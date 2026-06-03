// Review orchestration. Two phases:
//   prepareReview:  parse → fetch → render preview
//   runReview:      (with the prep + optional scope) L1 → L2 → L3 → score
// The split lets the UI show the rendered preview first and let the user
// drag an in-scope rectangle on it before the heavy review work runs.

import { parseFigmaUrl, fetchNodes, renderImage, summarizeTree, buildNodeIndex, pickAnchorFrame, cropImageToDataUrl, isNodeCenterInScope } from "./figma.js";
import { runL1 } from "./l1-rules.js";
import { chatCompletion } from "./azure-openai.js";
import { l2Messages, l3Messages } from "./prompts.js";

// --- Phase 1: parse + fetch + render --------------------------------
export async function prepareReview({ figmaUrl, figmaToken }, onProgress) {
  const step = (id, status, detail) => onProgress({ id, status, detail });

  step("parse", "running", "Parsing Figma URL");
  const { fileKey, nodeId } = parseFigmaUrl(figmaUrl);
  step("parse", "done", `file=${fileKey}${nodeId ? `, node=${nodeId}` : ""}`);

  step("fetch", "running", "Fetching Figma nodes via REST API");
  const { root, fileName } = await fetchNodes(fileKey, nodeId, figmaToken);
  step("fetch", "done", `Loaded "${fileName}"`);

  let imageUrl = null;
  if (nodeId) {
    step("render", "running", "Asking Figma to render frame to PNG");
    try {
      imageUrl = await renderImage(fileKey, nodeId, figmaToken, 2);
      step("render", "done", "Frame rendered");
    } catch (e) {
      step("render", "warn", `Render failed: ${e.message}`);
    }
  } else {
    step("render", "warn", "No node-id in URL — L2/L3 will run on tree summary only");
  }

  const nodeIndex = buildNodeIndex(root);
  const anchor = pickAnchorFrame(nodeIndex);

  return { fileKey, nodeId, fileName, imageUrl, root, nodeIndex, anchor };
}

// --- Phase 2: L1 + L2 + L3 + score ----------------------------------
//
// `scope` (optional) = { x, y, width, height } in Figma canvas
// absolute coordinates. When set, L1 findings and the tree summary
// passed to L2/L3 are restricted to nodes inside this rectangle.
export async function runReview({ prep, scope, projectContext, reviewScope, azure }, onProgress) {
  const step = (id, status, detail) => onProgress({ id, status, detail });
  const { fileKey, nodeId, fileName, imageUrl, root, nodeIndex, anchor } = prep;

  step("l1", "running", "Running L1 token compliance checks");
  // The anchor frame is the outermost FRAME inside the reviewed root —
  // a "page wrapper" / canvas. Its own padding / itemSpacing / corner
  // radius / fill are decorative scaffolding (e.g. 160px page-left
  // padding, 32–60px screenshot corner), not the answer module's
  // design. Skip L1 token checks on that one node; descendants are
  // still inspected normally.
  const l1 = runL1(root, { scope, pageWrapperId: anchor?.id });
  step("l1", "done",
    `${l1.nodeCount} nodes scanned · ${l1.counts.error || 0} errors · ${l1.counts.warn || 0} warns`);

  const treeSummary = summarizeTree(root, 160, { scope });
  const l1Summary = `${l1.nodeCount} nodes · errors=${l1.counts.error || 0} · warns=${l1.counts.warn || 0} · info=${l1.counts.info || 0}`;

  // When the reviewer drew an in-scope region, physically crop the
  // screenshot before handing it to L2/L3 — prompt-level "focus here"
  // hints alone don't stop a vision model from nitpicking content
  // outside the box. Falls back to the full image (with a textual
  // scope blurb) if cropping fails for any reason (CORS, etc.).
  // Use the same root-then-anchor bbox fallback as the scope picker so
  // SECTION-rooted reviews still get proper crop coords.
  let visionImageUrl = imageUrl;
  let scopeBlurb = null;
  let cropped = false;
  const refBbox = root.absoluteBoundingBox || anchor?.absoluteBoundingBox;
  if (scope && imageUrl && refBbox) {
    const rb = refBbox;
    const cropPct = {
      x:      (scope.x - rb.x) / rb.width,
      y:      (scope.y - rb.y) / rb.height,
      width:  scope.width  / rb.width,
      height: scope.height / rb.height,
    };
    const dataUrl = await cropImageToDataUrl(imageUrl, cropPct);
    if (dataUrl) {
      visionImageUrl = dataUrl;
      cropped = true;
      scopeBlurb = "The screenshot below has already been cropped to the in-scope region the reviewer marked. Review only what you see — there is no out-of-scope content in this image.";
    } else {
      // Crop failed (likely CORS). Fall back to prompt-level scoping.
      const pct = (n, d) => `${Math.round((n / d) * 100)}%`;
      scopeBlurb = `IN-SCOPE REGION — reviewer drew a sub-region of the screenshot to focus on. Restrict your judgment to what's inside this rectangle; ignore content outside it.\n  • horizontal: ${pct(scope.x - rb.x, rb.width)} → ${pct((scope.x + scope.width) - rb.x, rb.width)}\n  • vertical:   ${pct(scope.y - rb.y, rb.height)} → ${pct((scope.y + scope.height) - rb.y, rb.height)}`;
    }
  }

  // GitHub Copilot's chat-completions proxy refuses external image
  // URLs ("validating image item: external image URLs are not
  // supported") — it only accepts inline data URLs. If we ended up
  // with a remote URL above (no scope, or scope crop failed), have
  // serve.py fetch and base64-encode it once before the vision calls.
  if (azure?.provider === "copilot" && visionImageUrl && !visionImageUrl.startsWith("data:")) {
    try {
      const r = await fetch(`/image-to-data?url=${encodeURIComponent(visionImageUrl)}`);
      if (r.ok) {
        const j = await r.json();
        if (j.dataUrl) visionImageUrl = j.dataUrl;
      }
    } catch (e) {
      console.warn("image-to-data fetch failed:", e?.message || e);
    }
  }

  let l2 = null;
  let l3 = null;
  if (azure && azure.apiKey && azure.endpoint && azure.deployment) {
    step("l2", "running",
      cropped ? "Running L2 — application quality (cropped to scope)" : "Running L2 — application quality judgment");
    try {
      l2 = await chatCompletion(
        azure,
        l2Messages({ imageUrl: visionImageUrl || "", treeSummary, l1Summary, projectContext, reviewScope, scopeBlurb }),
        { maxTokens: 1500, temperature: 0.2 },
      );
      step("l2", "done", `Summary: ${l2.summary || "(no summary)"}`);
    } catch (e) {
      step("l2", "warn", e.message);
    }

    step("l3", "running",
      cropped ? "Running L3 — cross-team coherence (cropped to scope)" : "Running L3 — cross-team coherence warnings");
    try {
      l3 = await chatCompletion(
        azure,
        l3Messages({ imageUrl: visionImageUrl || "", treeSummary, projectContext, reviewScope, scopeBlurb }),
        { maxTokens: 1200, temperature: 0.3 },
      );
      step("l3", "done", `${(l3.flags || []).length} flag(s) raised · risk=${l3.risk || "?"}`);
    } catch (e) {
      step("l3", "warn", e.message);
    }
  } else {
    step("l2", "warn", "Skipped — Azure OpenAI not configured");
    step("l3", "warn", "Skipped — Azure OpenAI not configured");
  }

  // Belt-and-suspenders: drop any L2 issue / L3 flag whose nodeId points
  // to a node whose bbox center sits outside the scope rect. Without
  // this, a model that pattern-matches off something in the tree summary
  // could still surface an out-of-scope finding even after image crop.
  if (scope) {
    const inScope = (nid) => !nid || isNodeCenterInScope(nodeIndex.byId.get(nid), scope);
    if (l2?.issues) l2.issues = l2.issues.filter(i => inScope(i.nodeId));
    if (l2?.topIssues) l2.topIssues = l2.topIssues.filter(i => inScope(i.nodeId));
    if (l3?.flags) l3.flags = l3.flags.filter(f => inScope(f.nodeId));
  }

  // Composite score per PRD weights: L1 35%, L2 45%, L3 20% (warning-only).
  const l2Score = (() => {
    if (!l2?.coverage) return null;
    const weights = { intent: 1.2, hierarchy: 1, content: 1, usability: 1, scalability: 1 };
    const issuesById = new Map((l2.issues || []).map(i => [i.id, i]));
    let num = 0, den = 0;
    for (const [dim, w] of Object.entries(weights)) {
      const cov = l2.coverage[dim];
      if (!cov || cov.verdict === "not_applicable") continue;
      let s = 9;
      if (cov.verdict === "issues_found") {
        const sevs = (cov.issueIds || [])
          .map(id => issuesById.get(id)?.severity)
          .filter(Boolean);
        s = sevs.includes("error") ? 4 : sevs.includes("warn") ? 6.5 : 7;
      }
      num += s * w;
      den += w;
    }
    return den > 0 ? num / den : null;
  })();
  const l3Score = l3
    ? (l3.risk === "high" ? 4 : l3.risk === "medium" ? 7 : 9)
    : null;
  const composite =
    (l1.score * 0.35) +
    ((l2Score ?? l1.score) * 0.45) +
    ((l3Score ?? l1.score) * 0.20);

  return {
    fileKey, nodeId, fileName, imageUrl,
    root, nodeIndex, anchor,
    scope: scope || null,
    l1, l2, l3,
    l2Score: l2Score != null ? Number(l2Score.toFixed(2)) : null,
    l3Score,
    composite: Number(composite.toFixed(2)),
  };
}
