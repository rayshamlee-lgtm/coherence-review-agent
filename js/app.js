import { prepareReview, runReview } from "./pipeline.js";
import { postComment, matchNodeId, pinForNode } from "./figma.js";
import { startDeviceFlow, pollDeviceFlow, fetchCopilotModels } from "./copilot-auth.js";

// Refresh should always land the user at the top — auto-scroll after a
// run makes the saved scroll position meaningless and confusing on
// reload. Tell the browser not to restore, then enforce it once the
// page is fully laid out.
// bfcache restores (back/forward, and some refresh paths in Safari)
// don't fire `load`, so `load` alone isn't enough — also handle
// `pageshow`, and scroll immediately in case layout is already done.
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
const scrollTop = () => window.scrollTo(0, 0);
scrollTop();
window.addEventListener("DOMContentLoaded", scrollTop);
window.addEventListener("load", scrollTop);
window.addEventListener("pageshow", scrollTop);

let lastResult = null; // cached for comment-post handlers
// Persist PiP expand/collapse across renderResult re-runs (dismissals
// recompute scores and replace #result innerHTML, which would otherwise
// reset the floating preview back to its minimized default).
let pipExpanded = false;

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

  // ---- L4 (deterministic, deduction-based like L1) ----
  let l4 = null, l4Score = null;
  if (r._l4Original) {
    const l4FindingsAll = r._l4Original.findings || [];
    const l4Findings = l4FindingsAll.filter(f => !dismissed.has(f._key));
    let ded4 = 0;
    for (const f of l4Findings) ded4 += w1[f.severity] || 0;
    const s4 = Math.max(0, Math.min(10, 10 - ded4));
    const l4Counts = { error: 0, warn: 0, info: 0 };
    for (const f of l4Findings) l4Counts[f.severity] = (l4Counts[f.severity] || 0) + 1;
    const l4ByCode = {};
    for (const f of l4Findings) (l4ByCode[f.code] ||= []).push(f);
    l4 = { ...r._l4Original, findings: l4Findings, counts: l4Counts, byCode: l4ByCode, score: Number(s4.toFixed(2)) };
    l4Score = l4.score;
  }

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

    const w2 = { intent: 1.2, hierarchy: 1, content: 1, usability: 1, scalability: 1, imagery: 1 };
    const issueById = new Map(issues.map(i => [i.id, i]));
    let num = 0, den = 0;
    for (const [dim, w] of Object.entries(w2)) {
      const c = coverage[dim];
      if (!c || c.verdict === "not_applicable") continue;
      let s = 9;
      if (c.verdict === "issues_found") {
        const sevs = (c.issueIds || []).map(id => issueById.get(id)?.severity).filter(Boolean);
        s = sevs.includes("error") ? 4 : sevs.includes("warn") ? 6.5 : 9;
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
    (l1Score * 0.30) +
    ((l2Score ?? l1Score) * 0.40) +
    ((l4Score ?? l1Score) * 0.15) +
    ((l3Score ?? l1Score) * 0.15);

  return {
    l1: { ...r.l1, findings: l1Findings, counts: l1Counts, byCode: l1ByCode, score: Number(l1Score.toFixed(2)) },
    l2, l2Score,
    l3, l3Score,
    l4, l4Score,
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
  const provider = s.provider === "copilot" ? "copilot" : "azure";
  $(`#prov${provider === "copilot" ? "Copilot" : "Azure"}`).checked = true;
  $("#copilotModel").value = s.copilotModel || "gpt-4o";
  applyProviderVisibility(provider);
  applyCopilotAuthState();
}
function readSettingsForm() {
  const provider = document.querySelector('input[name="provider"]:checked')?.value || "azure";
  return {
    figmaToken: $("#figmaToken").value.trim(),
    provider,
    azEndpoint: $("#azEndpoint").value.trim(),
    azDeployment: $("#azDeployment").value.trim(),
    azApiVersion: $("#azApiVersion").value.trim(),
    azApiKey: $("#azApiKey").value.trim(),
    copilotModel: $("#copilotModel").value.trim() || "gpt-4o",
    copilotToken: loadCopilotToken(),  // managed by sign-in flow, not the form
  };
}
function applyProviderVisibility(provider) {
  $("#providerAzure").classList.toggle("hidden", provider !== "azure");
  $("#providerCopilot").classList.toggle("hidden", provider !== "copilot");
}

// ---------- Copilot device-flow auth ----------
const COPILOT_TOKEN_KEY = "coherence-copilot-token";
function loadCopilotToken() {
  return localStorage.getItem(COPILOT_TOKEN_KEY) || "";
}
function saveCopilotToken(token) {
  if (token) localStorage.setItem(COPILOT_TOKEN_KEY, token);
  else localStorage.removeItem(COPILOT_TOKEN_KEY);
}
function applyCopilotAuthState() {
  const signedIn = !!loadCopilotToken();
  $("#copilotAuthOut").classList.toggle("hidden", signedIn);
  $("#copilotAuthIn").classList.toggle("hidden", !signedIn);
  $("#copilotAuthPending").classList.add("hidden");
  if (signedIn) refreshCopilotModelList();
}

// Refresh the model dropdown using whatever /copilot/models returns
// for this user's subscription. Cached for the session in
// `_copilotModelCache` so the panel reopens instantly.
let _copilotModelCache = null;
async function refreshCopilotModelList(force = false) {
  const select = $("#copilotModel");
  if (!select) return;
  const token = loadCopilotToken();
  if (!token) return;
  if (!force && _copilotModelCache) {
    populateCopilotModelSelect(_copilotModelCache);
    return;
  }
  try {
    const models = await fetchCopilotModels(token);
    _copilotModelCache = models;
    populateCopilotModelSelect(models);
  } catch (e) {
    console.warn("Failed to fetch Copilot model list:", e?.message || e);
    // Fall back to the static dropdown options already in the HTML.
  }
}
// Models we never want to surface even if Copilot says they're
// available — known to be broken or unsupported by this demo's
// pipeline (e.g. gpt-5 rejects the chat-completions shape we send).
const COPILOT_MODEL_BLOCKLIST = new Set(["gpt-5"]);

function populateCopilotModelSelect(models) {
  const select = $("#copilotModel");
  if (!select) return;
  // Keep only chat-enabled, non-blocklisted models and prefer
  // vision-capable ones (we send images to L2/L3). Non-vision models
  // are still shown but grouped at the bottom so the user is warned.
  const chat = models.filter(m => m.chatEnabled && !COPILOT_MODEL_BLOCKLIST.has(m.id));
  const groups = new Map();
  for (const m of chat) {
    const key = m.vision ? m.vendor : `${m.vendor} (no vision)`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(m);
  }
  const saved = readSettingsForm().copilotModel;
  select.innerHTML = "";
  // Preserve render order: vision-first per vendor.
  const ordered = [...groups.entries()].sort((a, b) => {
    const av = a[0].includes("(no vision)") ? 1 : 0;
    const bv = b[0].includes("(no vision)") ? 1 : 0;
    return av - bv || a[0].localeCompare(b[0]);
  });
  for (const [label, items] of ordered) {
    const og = document.createElement("optgroup");
    og.label = label;
    for (const m of items.sort((a, b) => a.id.localeCompare(b.id))) {
      const opt = document.createElement("option");
      opt.value = m.id;
      opt.textContent = m.maxOutputTokens
        ? `${m.id} · ${m.maxOutputTokens.toLocaleString()} max out`
        : m.id;
      og.appendChild(opt);
    }
    select.appendChild(og);
  }
  // Reselect the previously-saved model if it still exists.
  if (saved && [...select.options].some(o => o.value === saved)) {
    select.value = saved;
  }
}

let _copilotSignInAbort = null;
async function runCopilotSignIn() {
  // Reset UI state.
  $("#copilotAuthOut").classList.add("hidden");
  $("#copilotAuthIn").classList.add("hidden");
  $("#copilotAuthPending").classList.remove("hidden");
  $("#copilotAuthStatus").textContent = "Requesting device code…";
  $("#copilotUserCode").textContent = "—";
  $("#copilotAuthUrl").href = "#";

  _copilotSignInAbort = new AbortController();
  try {
    const info = await startDeviceFlow();
    $("#copilotUserCode").textContent = info.user_code;
    $("#copilotAuthUrl").href = info.verification_uri;
    $("#copilotAuthStatus").textContent = "Waiting for authorization…";
    const token = await pollDeviceFlow(info, {
      onUpdate: () => { $("#copilotAuthStatus").textContent = "Waiting for authorization…"; },
      signal: _copilotSignInAbort.signal,
    });
    saveCopilotToken(token);
    applyCopilotAuthState();
  } catch (e) {
    $("#copilotAuthStatus").textContent = `Failed: ${e.message}`;
    // Leave pending view up so user can read the error; offer Cancel
    // to dismiss. Don't clobber existing token if any.
  } finally {
    _copilotSignInAbort = null;
  }
}
function cancelCopilotSignIn() {
  _copilotSignInAbort?.abort();
  applyCopilotAuthState();
}

// ---------- progress list ----------
const STEPS = [
  { id: "parse",  label: "Parse Figma URL" },
  { id: "fetch",  label: "Fetch Figma nodes" },
  { id: "render", label: "Render preview" },
  { id: "scope",  label: "Mark in-scope region" },
  { id: "l1",     label: "Check token compliance" },
  { id: "l4",     label: "Check accessibility" },
  { id: "l2",     label: "Check design quality" },
  { id: "l3",     label: "Check cross-team cohesion" },
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
    // Coordinate frame for the rendered preview. Prefer the reviewed
    // root's bbox; fall back to the anchor frame, since CANVAS and
    // SECTION node types don't expose absoluteBoundingBox via the
    // Figma REST API but their first child FRAME does.
    const rb = prep.root?.absoluteBoundingBox || prep.anchor?.absoluteBoundingBox;
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
    (r.l4?.findings || []).forEach((f, i) => f._key = `l4:${i}`);
    (r.l2?.issues   || []).forEach((i)    => i._key = `l2:${i.id}`);
    (r.l3?.flags    || []).forEach((f, i) => f._key = `l3:${i}`);
    r._l1Original = r.l1;
    r._l4Original = r.l4;
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
  const l4 = derived.l4;
  r.composite = derived.composite;
  r.l2Score = derived.l2Score;
  r.l3Score = derived.l3Score;
  r.l4Score = derived.l4Score;

  const esc = (s) => String(s ?? "").replace(/[<&>]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]));

  // One feedback-card shape, shared by every level so the output reads the
  // same regardless of which check produced it: a head row (status chip +
  // title + location + hover actions) with optional meta and body.
  const fcard = ({ cls, key, chip, title, where, meta, body, actions }) => `
    <div class="fcard ${cls}"${key ? ` data-key="${key}"` : ""}>
      <div class="fcard-head">
        ${chip || ""}
        <span class="fcard-title">${title}</span>
        ${where ? `<span class="fcard-where">${where}</span>` : ""}
        ${actions ? `<span class="row-actions">${actions}</span>` : ""}
      </div>
      ${meta ? `<div class="fcard-meta">${meta}</div>` : ""}
      ${body ? `<div class="fcard-body">${body}</div>` : ""}
    </div>`;
  const sevChip = (sev) => `<span class="sev sev-${sev}">${sev}</span>`;

  // Worst severity in a list (error > warn > info) — drives a group's head chip.
  const SEV_ORDER = { error: 3, warn: 2, info: 1 };
  const worstSev = (items) => items.reduce((w, f) =>
    (SEV_ORDER[f.severity] || 0) > (SEV_ORDER[w] || 0) ? f.severity : w, "info");

  // Collapsible group wrapper. Same head layout everywhere: caret + title +
  // status chip + count. Collapsed by default to keep the panel short; the
  // chip and count say what's inside before you expand.
  const fgroup = ({ title, chip, count, body }) => `
    <details class="fgroup">
      <summary class="fgroup-head">
        <span class="fgroup-caret"></span>
        <span class="fgroup-title">${title}</span>
        ${chip || ""}
        <span class="fgroup-count">${count}</span>
      </summary>
      <div class="fgroup-body">${body}</div>
    </details>`;

  // A non-collapsible "all clear" row — same head shape, no caret/body. Used
  // for design-quality dimensions that came back clean.
  const fgroupClear = ({ title, chip, note }) => `
    <div class="fgroup fgroup-clear">
      <div class="fgroup-head">
        <span class="fgroup-caret" style="visibility:hidden"></span>
        <span class="fgroup-title">${title}</span>
        ${chip || ""}
        <span class="fgroup-note">${note}</span>
      </div>
    </div>`;

  // Token compliance + accessibility findings, grouped by category (Color,
  // Typography, Corner radius, Spacing, Contrast …) derived from the rule code.
  const prettyCat = (code) => {
    const key = code.split(".")[1] || code;
    const spaced = key.replace(/([a-z])([A-Z])/g, "$1 $2");
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
  };
  const detGroups = (data, prefix) => {
    const items = data?.findings || [];
    if (!items.length) return "";
    const groups = new Map(); // label -> findings[]
    for (const f of items) {
      const label = prettyCat(f.code);
      if (!groups.has(label)) groups.set(label, []);
      groups.get(label).push(f);
    }
    // Errors first, then larger groups.
    const ordered = [...groups.entries()].sort((a, b) =>
      (SEV_ORDER[worstSev(b[1])] - SEV_ORDER[worstSev(a[1])]) || (b[1].length - a[1].length));
    return ordered.map(([label, fs]) => {
      const cards = fs.map(f => fcard({
        cls: "finding",
        key: f._key,
        chip: sevChip(f.severity),
        title: esc(f.message),
        where: `${esc(f.nodeName)} <span class="muted">· ${esc(f.nodeType)}</span>`,
        meta: `<span class="code">${esc(f.code)}</span>`,
        actions: `${postButton("💬 Post", `[Coherence Review · ${prefix}] ${f.message} (${f.code})`, f.nodeId)}${dismissButton(f._key)}`,
      })).join("");
      return fgroup({ title: esc(label), chip: sevChip(worstSev(fs)), count: fs.length, body: cards });
    }).join("");
  };
  const l1Findings = detGroups(l1, "Token compliance");
  const l4Findings = l4 ? detGroups(l4, "Accessibility") : "";

  const l2Counts = { error: 0, warn: 0, info: 0 };
  for (const t of (l2?.issues || [])) l2Counts[t.severity] = (l2Counts[t.severity] || 0) + 1;

  // One design-quality issue → card.
  const l2Issue = (t) => {
    const nodeId =
      (t.nodeId && r.nodeIndex.byId.has(t.nodeId) ? t.nodeId : null)
      || matchNodeId(r.nodeIndex, t.where)
      || r.nodeId
      || null;
    const msg = `[Coherence Review · Design quality — ${t.severity}] ${t.title}\n${t.why || ""}${t.where ? `\n(where: ${t.where})` : ""}`;
    return fcard({
      cls: "issue",
      key: t._key,
      chip: sevChip(t.severity),
      title: esc(t.title),
      where: t.where ? esc(t.where) : "",
      body: esc(t.why || ""),
      actions: `${postButton("💬 Post", msg, nodeId)}${dismissButton(t._key)}`,
    });
  };

  // Design quality grouped by the five rubric dimensions. Each issue is placed
  // under one primary dimension; clean dimensions still show an "ok" row so the
  // reviewer can see all five were considered.
  const l2Groups = (() => {
    if (!l2?.coverage) return "";
    const issues = l2.issues || [];
    const byId = new Map(issues.map(i => [i.id, i]));
    const dims = Object.keys(l2.coverage);
    const assigned = new Map(dims.map(d => [d, []]));
    const seen = new Set();
    // Primary bucket = first coverage group (in rubric order) that lists the id.
    for (const dim of dims) {
      for (const id of (l2.coverage[dim].issueIds || [])) {
        if (seen.has(id)) continue;
        const iss = byId.get(id);
        if (!iss) continue;
        assigned.get(dim).push(iss);
        seen.add(id);
      }
    }
    // Any issue not referenced by coverage → bucket by its own first dimension.
    for (const iss of issues) {
      if (seen.has(iss.id)) continue;
      const d = (iss.dimensions || []).find(x => assigned.has(x)) || dims[0];
      if (!d) continue;
      assigned.get(d).push(iss);
      seen.add(iss.id);
    }
    return dims.map(dim => {
      const list = assigned.get(dim) || [];
      const v = l2.coverage[dim] || {};
      const scen = v.scenario && v.scenario !== "n/a" ? ` <span class="muted">(${esc(v.scenario)})</span>` : "";
      if (!list.length) {
        const na = v.verdict === "not_applicable";
        return fgroupClear({
          title: `${esc(dim)}${scen}`,
          chip: `<span class="badge ${na ? "muted" : "good"}">${na ? "n/a" : "ok"}</span>`,
          note: esc(v.note || (na ? "not applicable" : "no issues")),
        });
      }
      return fgroup({
        title: `${esc(dim)}${scen}`,
        chip: sevChip(worstSev(list)),
        count: list.length,
        body: list.map(l2Issue).join(""),
      });
    }).join("");
  })();

  // L3 flags → cards. Warnings only, so a neutral "flag" chip in the status
  // slot (no severity), keeping the head layout identical to the others.
  const l3Flags = (l3?.flags || []).map(f => {
    const partners = (f.suggestedPartners || []).join(", ");
    const msg = `[Coherence Review · Cross-team cohesion flag] ${f.title}\nObservation: ${f.observation}\nMay conflict with: ${f.potentialConflict}\nSuggested partners: ${partners || "—"}\n(Confidence: ${f.confidence || "?"})`;
    const nodeId =
      (f.nodeId && r.nodeIndex.byId.has(f.nodeId) ? f.nodeId : null)
      || matchNodeId(r.nodeIndex, f.title)
      || r.nodeId
      || null;
    const body = `
      <div><b>Saw.</b> ${esc(f.observation)}</div>
      <div><b>May conflict with.</b> ${esc(f.potentialConflict)}</div>
      <div><b>Loop in.</b> ${esc(partners || "—")}</div>`;
    return fcard({
      cls: "flag",
      key: f._key,
      chip: `<span class="sev sev-flag">flag</span>`,
      title: esc(f.title),
      where: `<span class="muted">confidence: ${esc(f.confidence || "?")}</span>`,
      body,
      actions: `${postButton("💬 Post", msg, nodeId)}${dismissButton(f._key)}`,
    });
  }).join("");
  const l3RiskTier = !l3 ? "muted" : l3.risk === "high" ? "bad" : l3.risk === "medium" ? "warn" : "good";

  const summaryMsg = [
    `[Coherence Review · Summary]`,
    `Overall coherence risk: ${compositeRiskText(r.composite)}`,
    `Token compliance: ${r.l1.score}/10 — ${r.l1.counts.error || 0} err / ${r.l1.counts.warn || 0} warn`,
    r.l4Score != null ? `Accessibility: ${r.l4Score}/10 — ${r.l4?.counts.error || 0} fail / ${r.l4?.counts.warn || 0} manual` : null,
    r.l2Score != null ? `Design quality: ${r.l2Score}/10 — ${r.l2?.summary || ""}` : null,
    r.l3 ? `Cross-team cohesion: ${r.l3.risk || "?"} risk, ${(r.l3.flags || []).length} flags` : null,
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
      for (const f of (l4?.findings || [])) addFinding(f._key, f.nodeId, f.severity);
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
      <header><h3>Token compliance</h3>${scoreBadge(l1.score)}</header>
      <div class="counts">
        <span class="badge bad">${l1.counts.error || 0} error</span>
        <span class="badge warn">${l1.counts.warn || 0} warn</span>
        <span class="badge muted">${l1.counts.info || 0} info</span>
        <span class="muted">${l1.nodeCount} nodes scanned</span>
      </div>
      <div class="fcards">${l1Findings || `<p class="muted">No findings — looks clean against the token catalog.</p>`}</div>
    </section>

    <section class="lvl">
      <header><h3>Accessibility <span class="muted">— WCAG AA contrast</span></h3>${scoreBadge(r.l4Score)}</header>
      ${l4 ? `
      <div class="counts">
        <span class="badge bad">${l4.counts.error || 0} fail</span>
        <span class="badge warn">${l4.counts.warn || 0} manual-check</span>
        <span class="muted">${l4.textCount} text nodes evaluated</span>
      </div>
      <div class="fcards">${l4Findings || `<p class="muted">No contrast failures — all evaluated text meets WCAG AA.</p>`}</div>
      ` : `<p class="muted">Not run.</p>`}
    </section>

    <section class="lvl">
      <header><h3>Design quality</h3>${scoreBadge(r.l2Score)}</header>
      ${l2 ? `
      <div class="counts">
        <span class="badge bad">${l2Counts.error || 0} error</span>
        <span class="badge warn">${l2Counts.warn || 0} warn</span>
        <span class="badge muted">${l2Counts.info || 0} info</span>
      </div>
      ${l2.summary ? `<p class="lvl-summary">${esc(l2.summary)}</p>` : ""}
      <div class="fcards">${l2Groups || `<p class="muted">No issues raised.</p>`}</div>
      ` : `<p class="muted">Not run.</p>`}
    </section>

    <section class="lvl">
      <header><h3>Cross-team cohesion <span class="muted">— warnings only</span></h3>${scoreBadge(r.l3Score)}</header>
      ${l3 ? `
      <div class="counts">
        <span class="badge ${l3RiskTier}">${esc(l3.risk || "low")} risk</span>
        <span class="muted">${(l3.flags || []).length} flag${(l3.flags || []).length === 1 ? "" : "s"}</span>
      </div>
      ${l3.summary ? `<p class="lvl-summary">${esc(l3.summary)}</p>` : ""}
      <div class="fcards">${l3Flags || `<p class="muted">No flags raised.</p>`}</div>
      ` : `<p class="muted">Not run.</p>`}
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
    // Restore the previous expand/collapse state so a re-render (e.g.
    // after the user dismissed a finding) doesn't snap back to min.
    if (pipExpanded) {
      pip.classList.remove("pip-min");
      pip.classList.add("pip-max");
      document.body.classList.add("pip-open");
    } else {
      document.body.classList.remove("pip-open");
    }
    pip.querySelector(".pip-toggle").addEventListener("click", () => {
      const expand = pip.classList.contains("pip-min");
      pip.classList.toggle("pip-min", !expand);
      pip.classList.toggle("pip-max", expand);
      document.body.classList.toggle("pip-open", expand);
      pipExpanded = expand;
    });
  } else {
    document.body.classList.remove("pip-open");
  }
}

// ---------- main wiring ----------
window.addEventListener("DOMContentLoaded", () => {
  hydrateSettingsForm();
  renderSteps();

  const settingsPanel = $("#settingsPanel");
  const openSettings  = () => settingsPanel.classList.add("open");
  const closeSettings = () => settingsPanel.classList.remove("open");
  $("#settingsToggle").addEventListener("click", (e) => {
    e.stopPropagation();
    settingsPanel.classList.toggle("open");
  });
  $("#settingsClose")?.addEventListener("click", closeSettings);
  // Click-outside to dismiss.
  document.addEventListener("click", (e) => {
    if (!settingsPanel.classList.contains("open")) return;
    if (settingsPanel.contains(e.target)) return;
    if ($("#settingsToggle").contains(e.target)) return;
    closeSettings();
  });
  // Esc to dismiss.
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && settingsPanel.classList.contains("open")) closeSettings();
  });

  $("#saveSettings").addEventListener("click", () => {
    saveSettings(readSettingsForm());
    closeSettings();
  });

  // Toggle Azure / Copilot field groups live as the radio changes.
  document.querySelectorAll('input[name="provider"]').forEach(el => {
    el.addEventListener("change", () => applyProviderVisibility(el.value));
  });

  // Copilot device-flow auth wiring.
  $("#copilotSignIn")?.addEventListener("click", runCopilotSignIn);
  $("#copilotCancelSignIn")?.addEventListener("click", cancelCopilotSignIn);
  $("#copilotSignOut")?.addEventListener("click", () => {
    saveCopilotToken("");
    applyCopilotAuthState();
  });
  $("#copilotCopyCode")?.addEventListener("click", async (e) => {
    const code = $("#copilotUserCode").textContent.trim();
    if (!code || code === "—") return;
    try { await navigator.clipboard.writeText(code); } catch {}
    const btn = e.currentTarget;
    btn.classList.add("copied");
    setTimeout(() => btn.classList.remove("copied"), 1400);
  });

  $("#runBtn").addEventListener("click", async () => {
    const figmaUrl = $("#figmaUrl").value.trim();
    if (!figmaUrl) { alert("Paste a Figma link first."); return; }
    const projectContext = $("#projectContext")?.value.trim() || "";
    const reviewScope = $("#reviewScope")?.value.trim() || "";
    const s = readSettingsForm();
    saveSettings(s);
    if (!s.figmaToken) { alert("Figma Personal Access Token required (settings)."); return; }
    if (s.provider === "copilot" && !s.copilotToken) {
      alert("Sign in to GitHub Copilot via Settings before running a review.");
      return;
    }

    $("#result").classList.add("hidden");
    document.body.classList.remove("pip-open");
    pipExpanded = false;
    renderSteps();
    $("#runBtn").disabled = true;
    $("#errorBox").classList.add("hidden");
    // Bring the Pipeline panel into view so the reviewer immediately
    // sees progress instead of staring at the same hero card.
    document.querySelector(".panel.progress")?.scrollIntoView({ behavior: "smooth", block: "start" });

    try {
      // Phase 1: parse + fetch + render preview.
      const prep = await prepareReview(
        { figmaUrl, figmaToken: s.figmaToken },
        updateStep,
      );

      // Phase 2: ask the reviewer to mark an in-scope region (or skip).
      const azure = s.provider === "copilot"
        ? {
            provider: "copilot",
            model: s.copilotModel || "gpt-4o",
            copilotToken: s.copilotToken || "",
            // Surface as "configured" to pipeline.js's truthy check below.
            apiKey: "copilot-proxy", endpoint: "copilot-proxy", deployment: s.copilotModel || "gpt-4o",
          }
        : {
            provider: "azure",
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
        // Surface the result panel so the reviewer doesn't have to
        // scroll past the pipeline + picker to find their findings.
        requestAnimationFrame(() => {
          $("#result")?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        $("#runBtn").disabled = false;
      };
      if (prep.imageUrl) {
        updateStep({ id: "scope", status: "running", detail: "Awaiting reviewer input" });
        renderScopePicker(prep, runWithScope);
        // Scroll the picker into view so the user can see the preview
        // and the action buttons without hunting. Re-scroll once the
        // preview image finishes loading (it changes the picker's
        // height) so the Review-selection / Review-entire-frame row
        // ends up visible at the bottom of the viewport.
        const scrollPickerIntoView = () => {
          document.querySelector("#step-scope .scope-actions")
            ?.scrollIntoView({ behavior: "smooth", block: "end" });
        };
        requestAnimationFrame(scrollPickerIntoView);
        const previewImg = document.querySelector("#scopeStage .scope-preview");
        if (previewImg && !previewImg.complete) {
          previewImg.addEventListener("load", scrollPickerIntoView, { once: true });
        }
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
