import { prepareReview, runReview } from "./pipeline.js";
import { postComment, matchNodeId, pinForNode } from "./figma.js";

let lastResult = null; // cached for comment-post handlers

function toast(msg, kind = "info") {
  const t = document.createElement("div");
  t.className = `toast toast-${kind}`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add("show"), 10);
  setTimeout(() => { t.classList.remove("show"); setTimeout(() => t.remove(), 300); }, 3000);
}

async function handlePostClick(ev) {
  const btn = ev.currentTarget;
  if (!lastResult) return;
  const settings = JSON.parse(localStorage.getItem("coherence-review-settings") || "{}");
  if (!settings.figmaToken) { toast("No Figma token saved.", "error"); return; }

  const message = btn.dataset.message;
  const nodeId = btn.dataset.nodeId || null;
  btn.disabled = true;
  const original = btn.textContent;
  btn.textContent = "Posting…";
  try {
    // Prefer absolute canvas coords (Vector client_meta) so the pin lands
    // on the actual element. Fall back to file-level if we can't compute.
    const pin = pinForNode(lastResult.nodeIndex, lastResult.anchor, nodeId);
    await postComment(
      lastResult.fileKey,
      message,
      pin,                     // { x, y } or null
      settings.figmaToken,
    );
    btn.textContent = "✓ Posted";
    btn.classList.add("posted");
    toast("Comment posted to Figma", "ok");
  } catch (e) {
    console.error(e);
    btn.disabled = false;
    btn.textContent = original;
    toast(e.message, "error");
  }
}

function postButton(label, message, nodeId) {
  const id = nodeId ? ` data-node-id="${nodeId}"` : "";
  const safeMsg = message.replace(/"/g, "&quot;");
  return `<button class="btn-post" data-message="${safeMsg}"${id}>${label}</button>`;
}

// Compute an overlay rectangle (percent-relative to the preview image) for
// a finding's node, given the preview's coordinate frame (the rendered
// root's absoluteBoundingBox). Returns null if we can't pin the node.
function overlayRect(r, nodeId) {
  if (!nodeId || !r?.nodeIndex) return null;
  const node = r.nodeIndex.byId.get(nodeId);
  const nb = node?.absoluteBoundingBox;
  // Coordinate frame for the rendered preview image. Prefer the actual
  // reviewed root (matches what renderImage() asked Figma to render).
  // If that node has no bbox (e.g. SECTION), fall back to the anchor
  // frame we picked for comment pinning.
  const rb = r?.root?.absoluteBoundingBox || r?.anchor?.absoluteBoundingBox;
  if (!nb || !rb || !rb.width || !rb.height) return null;
  const left   = ((nb.x - rb.x) / rb.width)  * 100;
  const top    = ((nb.y - rb.y) / rb.height) * 100;
  const width  = (nb.width  / rb.width)  * 100;
  const height = (nb.height / rb.height) * 100;
  // Clamp so we don't draw boxes way outside the image (e.g. nodes that
  // extend beyond the reviewed frame).
  if (left > 100 || top > 100 || left + width < 0 || top + height < 0) return null;
  return { left, top, width, height };
}
function overlayBoxHtml(rect, key, severity) {
  if (!rect) return "";
  const sev = severity || "warn";
  return `<div class="ov-box ov-${sev}" data-key="${key}" style="left:${rect.left}%;top:${rect.top}%;width:${rect.width}%;height:${rect.height}%"></div>`;
}

function dismissButton(key) {
  return `<button class="btn-dismiss" data-dismiss-key="${key}" title="Dismiss — exclude this from the score">×</button>`;
}

function handleDismissClick(ev) {
  const key = ev.currentTarget.dataset.dismissKey;
  if (!key || !lastResult) return;
  lastResult.dismissed ||= new Set();
  lastResult.dismissed.add(key);
  renderResult(lastResult, { preserveDismissed: true });
}

// Re-derive L1 / L2 / L3 / composite scores from the original review payload
// with the user's dismissed items filtered out. Mirrors the formulas in
// l1-rules.js (deduction-based) and pipeline.js (verdict-based for L2).
function recomputeScores(r) {
  const dismissed = r.dismissed || new Set();

  // ---- L1 ----
  const l1FindingsAll = (r._l1Original?.findings || r.l1.findings || []);
  const l1Findings = l1FindingsAll.filter(f => !dismissed.has(f._key));
  const w1 = { error: 2, warn: 0.5, info: 0.15 };
  let ded = 0;
  for (const f of l1Findings) ded += w1[f.severity] || 0;
  const l1Score = Math.max(0, Math.min(10, 10 - ded));
  const l1Counts = { error: 0, warn: 0, info: 0 };
  for (const f of l1Findings) l1Counts[f.severity] = (l1Counts[f.severity] || 0) + 1;
  const l1ByCode = {};
  for (const f of l1Findings) (l1ByCode[f.code] ||= []).push(f);

  // ---- L2 ----
  let l2 = null, l2Score = null;
  if (r._l2Original) {
    const issues = (r._l2Original.issues || []).filter(i => !dismissed.has(i._key));
    const idSet = new Set(issues.map(i => i.id));
    const coverage = {};
    for (const [dim, v] of Object.entries(r._l2Original.coverage || {})) {
      const remaining = (v.issueIds || []).filter(id => idSet.has(id));
      let verdict = v.verdict;
      if (verdict === "issues_found" && remaining.length === 0) verdict = "ok";
      coverage[dim] = { ...v, issueIds: remaining, verdict };
    }
    l2 = { ...r._l2Original, issues, coverage };

    const w2 = { intent: 1.2, hierarchy: 1, content: 1, usability: 1, scalability: 1 };
    const issueById = new Map(issues.map(i => [i.id, i]));
    let num = 0, den = 0;
    for (const [dim, w] of Object.entries(w2)) {
      const c = coverage[dim];
      if (!c || c.verdict === "not_applicable") continue;
      let s = 9;
      if (c.verdict === "issues_found") {
        const sevs = (c.issueIds || []).map(id => issueById.get(id)?.severity).filter(Boolean);
        s = sevs.includes("error") ? 4 : sevs.includes("warn") ? 6.5 : 7;
      }
      num += s * w; den += w;
    }
    l2Score = den > 0 ? Number((num / den).toFixed(2)) : null;
  }

  // ---- L3 ----
  let l3 = null, l3Score = null;
  if (r._l3Original) {
    const flags = (r._l3Original.flags || []).filter(f => !dismissed.has(f._key));
    let risk = r._l3Original.risk || null;
    if (flags.length === 0) risk = "low";
    l3 = { ...r._l3Original, flags, risk };
    l3Score = risk === "high" ? 4 : risk === "medium" ? 7 : 9;
  }

  const composite =
    (l1Score * 0.35) +
    ((l2Score ?? l1Score) * 0.45) +
    ((l3Score ?? l1Score) * 0.20);

  return {
    l1: { ...r.l1, findings: l1Findings, counts: l1Counts, byCode: l1ByCode, score: Number(l1Score.toFixed(2)) },
    l2, l2Score,
    l3, l3Score,
    composite: Number(composite.toFixed(2)),
  };
}

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

// ---------- settings persistence ----------
const LS_KEY = "coherence-review-settings";
function loadSettings() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; }
  catch { return {}; }
}
function saveSettings(s) {
  localStorage.setItem(LS_KEY, JSON.stringify(s));
}
function hydrateSettingsForm() {
  const s = loadSettings();
  $("#figmaToken").value = s.figmaToken || "";
  $("#azEndpoint").value = s.azEndpoint || "";
  $("#azDeployment").value = s.azDeployment || "";
  $("#azApiVersion").value = s.azApiVersion || "2024-08-01-preview";
  $("#azApiKey").value = s.azApiKey || "";
}
function readSettingsForm() {
  return {
    figmaToken: $("#figmaToken").value.trim(),
    azEndpoint: $("#azEndpoint").value.trim(),
    azDeployment: $("#azDeployment").value.trim(),
    azApiVersion: $("#azApiVersion").value.trim(),
    azApiKey: $("#azApiKey").value.trim(),
  };
}

// ---------- progress list ----------
const STEPS = [
  { id: "parse",  label: "Parse Figma URL" },
  { id: "fetch",  label: "Fetch Figma nodes" },
  { id: "render", label: "Render preview" },
  { id: "scope",  label: "Mark in-scope region" },
  { id: "l1",     label: "L1 — Token compliance" },
  { id: "l2",     label: "L2 — Application quality" },
  { id: "l3",     label: "L3 — Cross-team coherence" },
];
function renderSteps() {
  const ol = $("#steps");
  ol.innerHTML = "";
  for (const s of STEPS) {
    const li = document.createElement("li");
    li.id = `step-${s.id}`;
    li.className = "step pending";
    li.innerHTML = `<span class="dot"></span><span class="label">${s.label}</span><span class="detail"></span>`;
    ol.appendChild(li);
  }
}
function updateStep({ id, status, detail }) {
  const el = $(`#step-${id}`);
  if (!el) return;
  el.classList.remove("pending", "running", "done", "warn", "error");
  el.classList.add(status);
  const d = el.querySelector(".detail");
  if (d) d.textContent = detail || "";
}

// ---------- rendering results ----------
function scoreBadge(s) {
  if (s == null) return `<span class="badge muted">—</span>`;
  let tier = "good";
  if (s < 6) tier = "bad";
  else if (s < 8) tier = "warn";
  return `<span class="badge ${tier}">${s.toFixed(1)}</span>`;
}

// Fuzzy risk label derived from a 0–10 score. Used only for the
// overall/composite read; per-level and per-dimension still show numeric.
function compositeRiskBadge(s) {
  if (s == null) return `<span class="badge muted">—</span>`;
  let tier = "good", label = "Low risk";
  if (s < 6) { tier = "bad";  label = "High risk"; }
  else if (s < 8) { tier = "warn"; label = "Medium risk"; }
  return `<span class="badge ${tier}">${label}</span>`;
}
function compositeRiskText(s) {
  if (s == null) return "—";
  if (s < 6) return "High risk";
  if (s < 8) return "Medium risk";
  return "Low risk";
}

function riskBadge(risk) {
  const r = String(risk || "").toLowerCase();
  if (r === "high")   return `<span class="badge bad">High risk</span>`;
  if (r === "medium") return `<span class="badge warn">Medium risk</span>`;
  if (r === "low")    return `<span class="badge good">Low risk</span>`;
  return `<span class="badge muted">—</span>`;
}

// ---------- scope picker (phase 2) ----------
// Renders the rendered Figma preview inside the "Mark in-scope region"
// step row of the Pipeline card. The reviewer drags a rectangle to mark
// what's in-scope; the row collapses on confirm. `onConfirm(scope|null)`
// receives the rectangle in Figma canvas absolute coordinates (so the
// pipeline can filter node bboxes directly), or null for "whole frame".
function renderScopePicker(prep, onConfirm) {
  const stepLi = $("#step-scope");
  if (!stepLi) return;
  // Clear any previous picker body left over from a re-run.
  stepLi.querySelector(".step-body")?.remove();
  const body = document.createElement("div");
  body.className = "step-body scope-picker";
  body.innerHTML = `
    <p class="scope-hint muted">Drag on the preview to mark the in-scope region. Drag a corner to resize, drag inside to move. Or skip and review the whole frame.</p>
    <div class="scope-stage" id="scopeStage">
      <img class="scope-preview" src="${prep.imageUrl}" alt="Figma preview" draggable="false" />
      <div class="scope-box hidden" id="scopeBox">
        <div class="scope-handle nw" data-dir="nw"></div>
        <div class="scope-handle ne" data-dir="ne"></div>
        <div class="scope-handle sw" data-dir="sw"></div>
        <div class="scope-handle se" data-dir="se"></div>
      </div>
    </div>
    <div class="scope-actions">
      <button id="scopeRunSelection" class="btn-primary" disabled>Review selection</button>
      <button id="scopeRunFull" class="btn-secondary">Review entire frame</button>
    </div>
  `;
  stepLi.appendChild(body);

  const stage = $("#scopeStage");
  const boxEl = $("#scopeBox");
  const runSelBtn = $("#scopeRunSelection");
  const runFullBtn = $("#scopeRunFull");

  // Box state in stage-relative pixel coordinates.
  let box = null; // { x, y, w, h } or null
  const MIN = 10;
  const stageRect = () => stage.getBoundingClientRect();
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const evtPos = (ev) => {
    const r = stageRect();
    return { x: clamp(ev.clientX - r.left, 0, r.width),
             y: clamp(ev.clientY - r.top,  0, r.height) };
  };
  const drawBox = () => {
    if (!box) { boxEl.classList.add("hidden"); runSelBtn.disabled = true; return; }
    boxEl.classList.remove("hidden");
    boxEl.style.left   = `${box.x}px`;
    boxEl.style.top    = `${box.y}px`;
    boxEl.style.width  = `${box.w}px`;
    boxEl.style.height = `${box.h}px`;
    runSelBtn.disabled = !(box.w >= MIN && box.h >= MIN);
  };

  // Interaction modes: "draw" (start fresh), "move" (translate box),
  // "resize" (drag one of four corners). Decided on mousedown by what
  // element the user landed on.
  let mode = null;
  let startPt = null;
  let startBox = null;
  let resizeDir = null;

  stage.addEventListener("mousedown", (ev) => {
    if (ev.button !== 0) return;
    ev.preventDefault();
    const target = ev.target;
    const p = evtPos(ev);
    if (target.classList && target.classList.contains("scope-handle")) {
      mode = "resize"; resizeDir = target.dataset.dir;
      startBox = { ...box };
      startPt = p;
    } else if (box && target === boxEl) {
      mode = "move";
      startBox = { ...box };
      startPt = p;
    } else {
      mode = "draw";
      box = { x: p.x, y: p.y, w: 0, h: 0 };
      startPt = p;
      drawBox();
    }
  });
  window.addEventListener("mousemove", (ev) => {
    if (!mode) return;
    const p = evtPos(ev);
    const r = stageRect();
    if (mode === "draw") {
      const x = Math.min(p.x, startPt.x);
      const y = Math.min(p.y, startPt.y);
      box = { x, y, w: Math.abs(p.x - startPt.x), h: Math.abs(p.y - startPt.y) };
    } else if (mode === "move") {
      const dx = p.x - startPt.x;
      const dy = p.y - startPt.y;
      box = {
        x: clamp(startBox.x + dx, 0, r.width  - startBox.w),
        y: clamp(startBox.y + dy, 0, r.height - startBox.h),
        w: startBox.w, h: startBox.h,
      };
    } else if (mode === "resize") {
      const dx = p.x - startPt.x;
      const dy = p.y - startPt.y;
      let { x, y, w, h } = startBox;
      if (resizeDir.includes("e")) w = startBox.w + dx;
      if (resizeDir.includes("s")) h = startBox.h + dy;
      if (resizeDir.includes("w")) { x = startBox.x + dx; w = startBox.w - dx; }
      if (resizeDir.includes("n")) { y = startBox.y + dy; h = startBox.h - dy; }
      // Handle negative drag past origin by flipping.
      if (w < 0) { x += w; w = -w; }
      if (h < 0) { y += h; h = -h; }
      // Clamp to stage.
      x = clamp(x, 0, r.width  - 1);
      y = clamp(y, 0, r.height - 1);
      w = clamp(w, 1, r.width  - x);
      h = clamp(h, 1, r.height - y);
      box = { x, y, w, h };
    }
    drawBox();
  });
  window.addEventListener("mouseup", () => { mode = null; startPt = null; startBox = null; resizeDir = null; });

  const collapse = () => body.remove();

  // Convert the picked stage-pixel rect to Figma canvas absolute coords
  // using the rendered root's bbox as the reference frame, then run the
  // review with that scope.
  runSelBtn.addEventListener("click", () => {
    if (!box || box.w < MIN || box.h < MIN) return;
    const r = stageRect();
    const rb = prep.root?.absoluteBoundingBox;
    collapse();
    if (!rb || !r.width || !r.height) { onConfirm(null); return; }
    const scope = {
      x:      rb.x + (box.x / r.width)  * rb.width,
      y:      rb.y + (box.y / r.height) * rb.height,
      width:  (box.w / r.width)  * rb.width,
      height: (box.h / r.height) * rb.height,
    };
    onConfirm(scope);
  });
  runFullBtn.addEventListener("click", () => { collapse(); onConfirm(null); });
}

function renderResult(r, { preserveDismissed = false } = {}) {
  lastResult = r;
  const out = $("#result");
  out.classList.remove("hidden");

  // First-time setup: assign stable keys + snapshot the original payload so
  // dismissals can re-derive scores from the unmodified data.
  if (!r._keysReady) {
    (r.l1?.findings || []).forEach((f, i) => f._key = `l1:${i}`);
    (r.l2?.issues   || []).forEach((i)    => i._key = `l2:${i.id}`);
    (r.l3?.flags    || []).forEach((f, i) => f._key = `l3:${i}`);
    r._l1Original = r.l1;
    r._l2Original = r.l2;
    r._l3Original = r.l3;
    r._keysReady = true;
  }
  if (!preserveDismissed) r.dismissed = new Set();

  // Apply current dismissals to derive the view + scores.
  const derived = recomputeScores(r);
  const l1 = derived.l1;
  const l2 = derived.l2;
  const l3 = derived.l3;
  r.composite = derived.composite;
  r.l2Score = derived.l2Score;
  r.l3Score = derived.l3Score;

  const esc = (s) => String(s ?? "").replace(/[<&>]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]));

  const l1Findings = Object.entries(l1.byCode).map(([code, items]) => `
    <details class="rule">
      <summary>
        <span class="code">${code}</span>
        <span class="count">${items.length}</span>
        <span class="sev sev-${items[0].severity}">${items[0].severity}</span>
        <span class="msg">${esc(items[0].message)}</span>
      </summary>
      <ul>
        ${items.slice(0, 30).map(f => `
          <li class="finding" data-key="${f._key}">
            <span class="finding-text"><b>${esc(f.nodeName)}</b>
            <span class="muted">(${f.nodeType})</span> — ${esc(JSON.stringify(f.evidence))}</span>
            <span class="row-actions">
              ${postButton("💬 Post", `[Coherence Review · L1] ${f.message} (${code})`, f.nodeId)}
              ${dismissButton(f._key)}
            </span>
          </li>`).join("")}
        ${items.length > 30 ? `<li class="muted">… ${items.length - 30} more</li>` : ""}
      </ul>
    </details>
  `).join("");

  const verdictChip = (v) => {
    if (v === "ok") return `<span class="badge good">ok</span>`;
    if (v === "issues_found") return `<span class="badge warn">issues</span>`;
    if (v === "not_applicable") return `<span class="badge muted">n/a</span>`;
    return `<span class="badge muted">—</span>`;
  };
  const issuesById = new Map((l2?.issues || []).map(i => [i.id, i]));
  const l2Dims = l2?.coverage ? Object.entries(l2.coverage).map(([k, v]) => {
    const scenario = v.scenario && v.scenario !== "n/a" ? ` <span class="muted">(${esc(v.scenario)})</span>` : "";
    const linkedIssues = (v.issueIds || []).map(id => issuesById.get(id)).filter(Boolean);
    let body = "";
    if (v.verdict === "issues_found" && linkedIssues.length) {
      body = `<ul class="dim-issues">${linkedIssues.map(i => `
        <li>
          <div><b>${esc(i.title || "(untitled)")}</b>${i.where ? ` <span class="muted">— ${esc(i.where)}</span>` : ""}</div>
          ${i.why ? `<div class="muted">${esc(i.why)}</div>` : ""}
        </li>`).join("")}</ul>`;
    } else if (v.note) {
      body = `<div class="muted">${esc(v.note)}</div>`;
    } else {
      body = `<div class="muted">No findings.</div>`;
    }
    return `
      <details class="dim">
        <summary class="dim-head">
          <span class="dim-name">${k}${scenario}</span>
          ${verdictChip(v.verdict)}
        </summary>
        <div class="dim-body">${body}</div>
      </details>`;
  }).join("") : `<p class="muted">L2 not run.</p>`;

  const l2Issues = (l2?.issues || l2?.topIssues || []).map(t => {
    // Prefer the explicit nodeId the model returned (instructed to copy
    // it from the [id=…] tag in the tree summary). Fall back to fuzzy
    // matching the "where" string against node names, then to the
    // reviewed root.
    const nodeId =
      (t.nodeId && r.nodeIndex.byId.has(t.nodeId) ? t.nodeId : null)
      || matchNodeId(r.nodeIndex, t.where)
      || r.nodeId
      || null;
    const msg = `[Coherence Review · L2 — ${t.severity}] ${t.title}\n${t.why || ""}${t.where ? `\n(where: ${t.where})` : ""}`;
    return `
      <li class="issue" data-key="${t._key}">
        <div class="issue-head">
          <span class="sev sev-${t.severity}">${t.severity}</span>
          <b>${esc(t.title)}</b>
          <span class="muted">${esc(t.where || "")}</span>
          <span class="row-actions">
            ${postButton("💬 Post", msg, nodeId)}
            ${dismissButton(t._key)}
          </span>
        </div>
        <div>${esc(t.why || "")}</div>
      </li>`;
  }).join("");

  const l3Flags = (l3?.flags || []).map(f => {
    const partners = (f.suggestedPartners || []).join(", ");
    const msg = `[Coherence Review · L3 — cross-team flag] ${f.title}\nObservation: ${f.observation}\nMay conflict with: ${f.potentialConflict}\nSuggested partners: ${partners || "—"}\n(Confidence: ${f.confidence || "?"})`;
    const nodeId =
      (f.nodeId && r.nodeIndex.byId.has(f.nodeId) ? f.nodeId : null)
      || matchNodeId(r.nodeIndex, f.title)
      || r.nodeId
      || null;
    return `
      <li class="flag" data-key="${f._key}">
        <div class="flag-title">
          <b>${esc(f.title)}</b>
          <span class="muted">confidence: ${esc(f.confidence || "?")}</span>
          <span class="row-actions">
            ${postButton("💬 Post", msg, nodeId)}
            ${dismissButton(f._key)}
          </span>
        </div>
        <div><b>Saw.</b> ${esc(f.observation)}</div>
        <div><b>May conflict with.</b> ${esc(f.potentialConflict)}</div>
        <div><b>Loop in.</b> ${esc(partners || "—")}</div>
      </li>`;
  }).join("");

  const summaryMsg = [
    `[Coherence Review · Summary]`,
    `Overall coherence risk: ${compositeRiskText(r.composite)}`,
    `L1 (spec): ${r.l1.score}/10 — ${r.l1.counts.error || 0} err / ${r.l1.counts.warn || 0} warn`,
    r.l2Score != null ? `L2 (quality): ${r.l2Score}/10 — ${r.l2?.summary || ""}` : null,
    r.l3 ? `L3 (cross-team): ${r.l3.risk || "?"} risk, ${(r.l3.flags || []).length} flags` : null,
  ].filter(Boolean).join("\n");
  const summaryBtn = postButton("💬 Post summary to Figma", summaryMsg, r.nodeId || null);

  out.innerHTML = `
    <header class="result-head">
      <div>
        <h2>${r.fileName || "(unnamed file)"} <span class="muted">— ${r.fileKey}</span></h2>
        <div class="muted">${r.nodeId ? `node ${r.nodeId}` : "whole file"}</div>
      </div>
      <div class="composite">
        <div class="composite-label">Coherence risk</div>
        <div class="composite-score">${compositeRiskBadge(r.composite)}</div>
        <div class="composite-action">${summaryBtn}</div>
      </div>
    </header>

    ${r.imageUrl ? (() => {
      // Group findings by nodeId so multiple issues on the same node share
      // a single overlay box. Severity ranks: error > warn > info — the
      // shared box adopts the worst severity. Each finding's _key gets
      // mapped to its box key so hover-linkage from the right rail still
      // points at the correct box.
      const SEV_RANK = { error: 3, warn: 2, info: 1 };
      const byNode = new Map(); // nodeId -> { rect, severity, keys: Set }
      const keyToBox = {};      // _key -> nodeId (used as box key)
      const addFinding = (key, nodeId, severity) => {
        const rect = overlayRect(r, nodeId);
        if (!rect) return;
        const cur = byNode.get(nodeId);
        if (cur) {
          if ((SEV_RANK[severity] || 0) > (SEV_RANK[cur.severity] || 0)) cur.severity = severity;
          cur.keys.add(key);
        } else {
          byNode.set(nodeId, { rect, severity, keys: new Set([key]) });
        }
        keyToBox[key] = nodeId;
      };
      for (const f of (l1.findings || [])) addFinding(f._key, f.nodeId, f.severity);
      for (const t of (l2?.issues || l2?.topIssues || [])) {
        const nid = (t.nodeId && r.nodeIndex.byId.has(t.nodeId) ? t.nodeId : null)
          || matchNodeId(r.nodeIndex, t.where);
        addFinding(t._key, nid, t.severity);
      }
      for (const f of (l3?.flags || [])) {
        const nid = (f.nodeId && r.nodeIndex.byId.has(f.nodeId) ? f.nodeId : null)
          || matchNodeId(r.nodeIndex, f.title);
        addFinding(f._key, nid, "info");
      }
      const overlays = [];
      for (const [nid, info] of byNode) {
        overlays.push(overlayBoxHtml(info.rect, nid, info.severity));
      }
      r._keyToBox = keyToBox;
      // Picture-in-picture floating preview. Starts minimized in the
      // bottom-right corner; click ⤢ to expand to the right half of the
      // viewport (the main column shifts left to make room via the
      // .pip-open class on <body>).
      return `
        <div id="pip" class="pip-min">
          <div class="pip-head">
            <span class="pip-title">Preview</span>
            <button class="pip-toggle" title="Expand / collapse">⤢</button>
          </div>
          <div class="pip-body">
            <div class="preview-wrap">
              <img class="preview" src="${r.imageUrl}" alt="Figma preview" />
              <div class="preview-overlay">${overlays.join("")}</div>
            </div>
          </div>
        </div>`;
    })() : ""}

    <section class="lvl">
      <header><h3>Level 1 · Spec compliance</h3>${scoreBadge(l1.score)}</header>
      <div class="counts">
        <span class="badge bad">${l1.counts.error || 0} error</span>
        <span class="badge warn">${l1.counts.warn || 0} warn</span>
        <span class="badge muted">${l1.counts.info || 0} info</span>
        <span class="muted">${l1.nodeCount} nodes scanned</span>
      </div>
      ${l1Findings || `<p class="muted">No findings — looks clean against the token catalog.</p>`}
    </section>

    <section class="lvl">
      <header><h3>Level 2 · Application quality</h3>${scoreBadge(r.l2Score)}</header>
      ${l2?.summary ? `<p>${l2.summary}</p>` : ""}
      <div class="dims">${l2Dims}</div>
      ${l2Issues ? `<h4>Top issues</h4><ul class="issues">${l2Issues}</ul>` : ""}
    </section>

    <section class="lvl">
      <header><h3>Level 3 · Cross-team coherence (warnings only)</h3>${scoreBadge(r.l3Score)}</header>
      ${l3?.summary ? `<p>${esc(l3.summary)}</p>` : ""}
      ${l3Flags ? `<ul class="flags">${l3Flags}</ul>` : `<p class="muted">No flags raised.</p>`}
    </section>
  `;

  // Attach handlers to every Post + Dismiss button.
  out.querySelectorAll(".btn-post").forEach(b => b.addEventListener("click", handlePostClick));
  out.querySelectorAll(".btn-dismiss").forEach(b => b.addEventListener("click", handleDismissClick));

  // Hover-link between finding rows and overlay boxes on the preview.
  // Each finding row's data-key is its `_key`; each box's data-key is the
  // nodeId. `r._keyToBox` maps row key → box key.
  const keyToBox = r._keyToBox || {};
  // Reverse: nodeId (box) → list of all finding rows sharing it.
  const boxToRows = {};
  for (const [k, nid] of Object.entries(keyToBox)) {
    (boxToRows[nid] ||= []).push(k);
  }
  const rowEl = (k) => out.querySelector(`.finding[data-key="${CSS.escape(k)}"], .issue[data-key="${CSS.escape(k)}"], .flag[data-key="${CSS.escape(k)}"]`);
  const boxEl = (nid) => out.querySelector(`.ov-box[data-key="${CSS.escape(nid)}"]`);
  out.querySelectorAll(".finding, .issue, .flag").forEach(row => {
    const key = row.dataset.key;
    const nid = keyToBox[key];
    if (!nid) return;
    row.addEventListener("mouseenter", () => boxEl(nid)?.classList.add("active"));
    row.addEventListener("mouseleave", () => boxEl(nid)?.classList.remove("active"));
    row.addEventListener("click", () => {
      const box = boxEl(nid);
      if (box) box.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });
  out.querySelectorAll(".ov-box").forEach(box => {
    const nid = box.dataset.key;
    const keys = boxToRows[nid] || [];
    box.addEventListener("mouseenter", () => {
      box.classList.add("active");
      keys.forEach(k => rowEl(k)?.classList.add("active"));
    });
    box.addEventListener("mouseleave", () => {
      box.classList.remove("active");
      keys.forEach(k => rowEl(k)?.classList.remove("active"));
    });
    box.addEventListener("click", () => {
      const first = keys.map(rowEl).find(Boolean);
      if (!first) return;
      let p = first.parentElement;
      while (p && p !== out) {
        if (p.tagName === "DETAILS") p.open = true;
        p = p.parentElement;
      }
      first.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });

  // PiP expand/collapse. When expanded, body.pip-open shifts the main
  // column left to make room on the right half of the viewport.
  const pip = out.querySelector("#pip");
  if (pip) {
    pip.querySelector(".pip-toggle").addEventListener("click", () => {
      const expand = pip.classList.contains("pip-min");
      pip.classList.toggle("pip-min", !expand);
      pip.classList.toggle("pip-max", expand);
      document.body.classList.toggle("pip-open", expand);
    });
  } else {
    document.body.classList.remove("pip-open");
  }
}

// ---------- main wiring ----------
window.addEventListener("DOMContentLoaded", () => {
  hydrateSettingsForm();
  renderSteps();

  $("#settingsToggle").addEventListener("click", () => {
    $("#settingsPanel").classList.toggle("open");
  });

  $("#saveSettings").addEventListener("click", () => {
    saveSettings(readSettingsForm());
    $("#settingsPanel").classList.remove("open");
  });

  $("#runBtn").addEventListener("click", async () => {
    const figmaUrl = $("#figmaUrl").value.trim();
    if (!figmaUrl) { alert("Paste a Figma link first."); return; }
    const projectContext = $("#projectContext")?.value.trim() || "";
    const reviewScope = $("#reviewScope")?.value.trim() || "";
    const s = readSettingsForm();
    saveSettings(s);
    if (!s.figmaToken) { alert("Figma Personal Access Token required (settings)."); return; }

    $("#result").classList.add("hidden");
    document.body.classList.remove("pip-open");
    renderSteps();
    $("#runBtn").disabled = true;
    $("#errorBox").classList.add("hidden");

    try {
      // Phase 1: parse + fetch + render preview.
      const prep = await prepareReview(
        { figmaUrl, figmaToken: s.figmaToken },
        updateStep,
      );

      // Phase 2: ask the reviewer to mark an in-scope region (or skip).
      const azure = {
        endpoint: s.azEndpoint,
        deployment: s.azDeployment,
        apiVersion: s.azApiVersion,
        apiKey: s.azApiKey,
      };
      const runWithScope = async (scope) => {
        updateStep({ id: "scope", status: "done",
          detail: scope ? "User-marked region" : "Whole frame" });
        const r = await runReview(
          { prep, scope, projectContext, reviewScope, azure },
          updateStep,
        );
        renderResult(r);
        $("#runBtn").disabled = false;
      };
      if (prep.imageUrl) {
        updateStep({ id: "scope", status: "running", detail: "Awaiting reviewer input" });
        renderScopePicker(prep, runWithScope);
        // runBtn stays disabled until the user picks a scope and review finishes.
      } else {
        // No image to draw on — skip selection, review whole frame.
        await runWithScope(null);
      }
    } catch (e) {
      console.error(e);
      $("#errorBox").textContent = e.message;
      $("#errorBox").classList.remove("hidden");
      $("#runBtn").disabled = false;
    }
  });
});
