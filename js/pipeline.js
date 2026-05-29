// Review orchestration. Two phases:
//   prepareReview:  parse → fetch → render preview
//   runReview:      (with the prep + optional scope) L1 → L2 → L3 → score
// The split lets the UI show the rendered preview first and let the user
// drag an in-scope rectangle on it before the heavy review work runs.

import { parseFigmaUrl, fetchNodes, renderImage, summarizeTree, buildNodeIndex, pickAnchorFrame } from "./figma.js";
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
  const l1 = runL1(root, { scope });
  step("l1", "done",
    `${l1.nodeCount} nodes scanned · ${l1.counts.error || 0} errors · ${l1.counts.warn || 0} warns`);

  const treeSummary = summarizeTree(root, 160, { scope });
  const l1Summary = `${l1.nodeCount} nodes · errors=${l1.counts.error || 0} · warns=${l1.counts.warn || 0} · info=${l1.counts.info || 0}`;

  // Human-readable scope blurb for L2/L3 prompts (image-relative %).
  const scopeBlurb = scope && root.absoluteBoundingBox ? (() => {
    const rb = root.absoluteBoundingBox;
    const pct = (n, d) => `${Math.round((n / d) * 100)}%`;
    return `IN-SCOPE REGION — reviewer drew a sub-region of the screenshot to focus on. Restrict your judgment to what's inside this rectangle; ignore content outside it.\n  • horizontal: ${pct(scope.x - rb.x, rb.width)} → ${pct((scope.x + scope.width) - rb.x, rb.width)}\n  • vertical:   ${pct(scope.y - rb.y, rb.height)} → ${pct((scope.y + scope.height) - rb.y, rb.height)}`;
  })() : null;

  let l2 = null;
  let l3 = null;
  if (azure && azure.apiKey && azure.endpoint && azure.deployment) {
    step("l2", "running", "Running L2 — application quality judgment");
    try {
      l2 = await chatCompletion(
        azure,
        l2Messages({ imageUrl: imageUrl || "", treeSummary, l1Summary, projectContext, reviewScope, scopeBlurb }),
        { maxTokens: 1500, temperature: 0.2 },
      );
      step("l2", "done", `Summary: ${l2.summary || "(no summary)"}`);
    } catch (e) {
      step("l2", "warn", e.message);
    }

    step("l3", "running", "Running L3 — cross-team coherence warnings");
    try {
      l3 = await chatCompletion(
        azure,
        l3Messages({ imageUrl: imageUrl || "", treeSummary, projectContext, reviewScope, scopeBlurb }),
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
