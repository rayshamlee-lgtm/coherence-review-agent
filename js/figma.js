// Figma API client. Runs entirely in the browser using the user's Figma
// Personal Access Token (Figma supports CORS on api.figma.com).

const API = "https://api.figma.com/v1";

export function parseFigmaUrl(url) {
  // Accept /file/, /design/, /proto/ URLs.
  const m = url.match(/figma\.com\/(?:file|design|proto)\/([A-Za-z0-9]+)/);
  if (!m) throw new Error("Not a recognizable Figma URL.");
  const fileKey = m[1];
  // node-id may be e.g. "12-345" (new) or "12:345" (legacy/url-decoded)
  const nodeMatch = url.match(/[?&]node-id=([^&]+)/);
  let nodeId = null;
  if (nodeMatch) {
    nodeId = decodeURIComponent(nodeMatch[1]).replace(/-/g, ":");
  }
  return { fileKey, nodeId };
}

async function figmaGet(path, token) {
  const res = await fetch(`${API}${path}`, {
    headers: { "X-Figma-Token": token },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Figma API ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.json();
}

// Fetch the targeted node subtree with full style geometry.
// If no nodeId is provided we fall back to the file's first page.
export async function fetchNodes(fileKey, nodeId, token) {
  if (nodeId) {
    const data = await figmaGet(
      `/files/${fileKey}/nodes?ids=${encodeURIComponent(nodeId)}&geometry=paths`,
      token,
    );
    const entry = data.nodes[nodeId];
    if (!entry || !entry.document) {
      throw new Error(`Node ${nodeId} not found in file.`);
    }
    return { root: entry.document, fileName: data.name, styles: entry.styles || {} };
  }
  const file = await figmaGet(`/files/${fileKey}?depth=4`, token);
  return { root: file.document, fileName: file.name, styles: file.styles || {} };
}

// Render a node to a PNG URL.
export async function renderImage(fileKey, nodeId, token, scale = 2) {
  if (!nodeId) throw new Error("Cannot render without a node-id selection.");
  const data = await figmaGet(
    `/images/${fileKey}?ids=${encodeURIComponent(nodeId)}&format=png&scale=${scale}`,
    token,
  );
  const url = data.images && data.images[nodeId];
  if (!url) throw new Error("Figma did not return an image for the node.");
  return url;
}

// Names of top-level SERP sections that aren't the designer's work — the
// standard chrome (header / search / verticals) and the placeholder content
// pinned below the reviewed module (algo results / related searches /
// footer). Matched on direct children of the review root only, so a node
// named "Header" *inside* a card (a card's own header, legitimate work)
// is still inspected.
const PAGE_CHROME = [
  /^header\b/i,                        // "Header", "Header Top", "Header Container"
  /^top.?bar$/i,                       // "Topbar"
  /^nav(igation)?(bar)?$/i,            // "Nav", "Navigation", "Navbar"
  /^search.?(box|bar|field|input)$/i,
  /^vertical.?(tabs|pages|nav)?s?$/i,  // "Verticals", "Vertical Tabs"
  /^sign.?in$/i,
  /^user.?(profile|menu|avatar)$/i,
  /^algo.?(results?|cards?|stack)?$/i, // "Algo", "Algo Results", "Algo Stack"
  /^mainline.?algo/i,
  /^algo.?mainline/i,
  /^related.?searche?s?$/i,
  /^paa\b/i,                           // People Also Ask
  /^footer\b/i,
];
export function isPageChrome(name) {
  if (!name) return false;
  const n = name.trim();
  return PAGE_CHROME.some(p => p.test(n));
}

// True if axis-aligned rects intersect (treating zero overlap as miss).
function rectsIntersect(a, b) {
  if (!a || !b) return false;
  return !(a.x + a.width  <= b.x ||
           b.x + b.width  <= a.x ||
           a.y + a.height <= b.y ||
           b.y + b.height <= a.y);
}
// True if a node's center point falls inside the scope rect. Used to
// decide whether a finding belongs to the user-marked region.
export function isNodeCenterInScope(node, scope) {
  if (!scope) return true;
  const b = node?.absoluteBoundingBox;
  if (!b) return true; // can't decide — include rather than silently drop
  const cx = b.x + b.width  / 2;
  const cy = b.y + b.height / 2;
  return cx >= scope.x && cx <= scope.x + scope.width
      && cy >= scope.y && cy <= scope.y + scope.height;
}

// Flatten a Figma node tree into an array of nodes for L1 inspection.
// Skips:
//  - nodes whose `visible` is explicitly false (designer toggled the eye
//    off) and all their descendants
//  - direct children of the review root whose name matches PAGE_CHROME
//    (standard SERP header / verticals / algo / related searches / footer)
//  - any subtree whose bbox does not intersect opts.scope, if one is set
//    (user-drawn in-scope region in canvas coordinates)
export function flatten(root, parent = null, depth = 0, acc = [], opts = {}) {
  if (root.visible === false) return acc;
  if (depth === 1 && isPageChrome(root.name)) return acc;
  if (opts.scope && root.absoluteBoundingBox && !rectsIntersect(root.absoluteBoundingBox, opts.scope)) return acc;
  acc.push({ node: root, parent, depth });
  if (root.children) {
    for (const child of root.children) flatten(child, root, depth + 1, acc, opts);
  }
  return acc;
}

// Post a comment to a Figma file. clientMeta pins the comment:
//   - { node_id, node_offset: { x, y } }  pins to a node
//   - { x, y }                             pins to canvas coords
//   - omitted                              file-level comment
export async function postComment(fileKey, message, clientMeta, token) {
  const payload = {
    message,
    ...(clientMeta ? { client_meta: clientMeta } : {}),
  };
  console.log("[postComment] →", JSON.stringify(payload));
  const res = await fetch(`${API}/files/${fileKey}/comments`, {
    method: "POST",
    headers: {
      "X-Figma-Token": token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Figma comment ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.json();
}

// Build a flat lookup so the UI can match LLM "where" strings back to nodes.
// Also stores parent pointers so we can walk up to find a frame ancestor —
// Figma's FrameOffset client_meta only accepts FRAME / COMPONENT / INSTANCE /
// SECTION as node_id. Passing a TEXT or RECTANGLE silently drops the pin
// to the canvas origin.
export function buildNodeIndex(root) {
  const byName = new Map();
  const byId = new Map();
  const parentOf = new Map();
  function walk(n, parent) {
    byId.set(n.id, n);
    if (parent) parentOf.set(n.id, parent);
    const key = (n.name || "").trim().toLowerCase();
    if (key && !byName.has(key)) byName.set(key, n);
    if (n.children) n.children.forEach((c) => walk(c, n));
  }
  walk(root, null);
  return { byName, byId, parentOf, root };
}

// NOTE: SECTION is intentionally excluded. Figma's comments API will not
// accept a SECTION node_id as a FrameOffset target — it silently drops the
// pin to the canvas origin. Always anchor on a real FRAME / COMPONENT /
// INSTANCE inside the section instead.
const FRAME_LIKE = new Set(["FRAME", "COMPONENT", "INSTANCE", "COMPONENT_SET"]);

// Nodes inside an INSTANCE have synthetic ids like "I370:4693;2519:50772"
// — prefix "I" plus a semicolon-joined path. The comments API can't pin
// to these; only the top-level instance id (without ";") is addressable.
function isInstanceChild(id) {
  return typeof id === "string" && id.includes(";");
}

// Walk up from `node` to the nearest frame-like ancestor (including itself).
function findFrameAncestor(index, node) {
  let cur = node;
  while (cur) {
    if (FRAME_LIKE.has(cur.type)) return cur;
    cur = index.parentOf.get(cur.id) || null;
  }
  return null;
}

// The "anchor" is the single FRAME we pin every comment to. We pick it
// once at review time so all pins guaranteed stay on the same page and
// inside the design the user actually asked us to review.
export function pickAnchorFrame(index) {
  // If the review root is itself a frame-like container, use it directly.
  if (FRAME_LIKE.has(index.root.type)) return index.root;
  // Otherwise descend into the first frame-like child we can find.
  const queue = [index.root];
  while (queue.length) {
    const n = queue.shift();
    if (FRAME_LIKE.has(n.type)) return n;
    if (n.children) queue.push(...n.children);
  }
  return null;
}

// Compute a FrameOffset pin for the offending node.
//
// Strategy: walk up from the target to its nearest FRAME-like ancestor
// inside the fetched subtree. Pin to that frame, with node_offset placed
// at the target's center in the frame's local coordinates.
//
// Why this works:
//   - Different content modules (each its own FRAME) get pinned to
//     themselves, so they end up at distinct locations on the canvas.
//   - A leaf (e.g. a button) gets pinned to its containing card frame,
//     at the button's visible position.
//   - Because we only walk inside the fetched subtree, we never cross
//     pages.
//
// The `fallback` argument is the review-time anchor — used only when the
// target has no usable bbox at all.
export function pinForNode(index, fallback, nodeId) {
  const target = nodeId ? index.byId.get(nodeId) : null;
  if (!target) return fallback ? pinForNode(index, fallback, fallback.id) : null;

  // 1) Find the nearest FRAME-like ancestor whose id is pinnable (top-level
  //    node id, not an instance-child synthetic id).
  let frame = target;
  while (frame && (!FRAME_LIKE.has(frame.type) || isInstanceChild(frame.id))) {
    frame = index.parentOf.get(frame.id) || null;
  }
  // 2) If we couldn't find one (target was already at the root), use the
  //    review-time fallback.
  if (!frame || !frame.absoluteBoundingBox) frame = fallback;
  if (!frame || !frame.absoluteBoundingBox) return null;

  const fb = frame.absoluteBoundingBox;
  // If the target itself has a box, aim at its center; otherwise center
  // of the frame.
  const tb = target.absoluteBoundingBox || fb;
  const cx = tb.x + tb.width  / 2;
  const cy = tb.y + tb.height / 2;
  const ox = Math.max(0, Math.min(fb.width,  cx - fb.x));
  const oy = Math.max(0, Math.min(fb.height, cy - fb.y));

  const pin = { node_id: frame.id, node_offset: { x: ox, y: oy } };
  // Diagnostic log — values inlined so they're visible without expanding.
  console.log(
    `[pinForNode] target=${target.id}(${target.type} "${target.name}") ` +
    `frame=${frame.id}("${frame.name}") ` +
    `tb=${tb ? `${Math.round(tb.x)},${Math.round(tb.y)} ${Math.round(tb.width)}x${Math.round(tb.height)}` : "null"} ` +
    `fb=${Math.round(fb.x)},${Math.round(fb.y)} ${Math.round(fb.width)}x${Math.round(fb.height)} ` +
    `offset=${Math.round(ox)},${Math.round(oy)}`
  );
  return pin;
}

// Best-effort: find a node id by matching the LLM "where" string against
// node names. Returns null if nothing reasonable matches.
export function matchNodeId(index, whereText) {
  if (!whereText) return null;
  const w = whereText.toLowerCase();
  // exact name hit
  if (index.byName.has(w)) return index.byName.get(w).id;
  // substring hit on any name; pick the shortest matching name (most specific)
  let best = null;
  for (const [name, node] of index.byName) {
    if (w.includes(name) || name.includes(w)) {
      if (!best || name.length < best.name.length) best = { name, node };
    }
  }
  return best ? best.node.id : null;
}

// Produce a compact textual summary of the design for L2/L3 prompts.
// Each line carries the node's Figma id in `[id=…]` so the LLM can refer
// back to specific nodes when emitting issues/flags — that's what lets us
// pin comments precisely instead of fuzzy-matching by name.
export function summarizeTree(root, maxNodes = 160, opts = {}) {
  const lines = [];
  let count = 0;
  function walk(n, depth) {
    if (count >= maxNodes) return;
    // Skip hidden nodes — otherwise the LLM "sees" inactive variants
    // (e.g. a placeholder text node still in the file but visible:false
    // because the input has a value), and invents issues like "the
    // search field shows both the query and the placeholder".
    if (n.visible === false) return;
    // Skip standard page-chrome subtrees at depth 1 (see PAGE_CHROME).
    // Keeps L2/L3 attention on the designed module under review.
    if (depth === 1 && isPageChrome(n.name)) return;
    // Skip subtrees fully outside the user-drawn scope rectangle, if any.
    if (opts.scope && n.absoluteBoundingBox && !rectsIntersect(n.absoluteBoundingBox, opts.scope)) return;
    count++;
    const pad = "  ".repeat(depth);
    const parts = [n.type, n.name];
    if (n.characters) {
      const t = n.characters.replace(/\s+/g, " ").slice(0, 60);
      parts.push(`text="${t}"`);
    }
    if (n.absoluteBoundingBox) {
      const b = n.absoluteBoundingBox;
      parts.push(`${Math.round(b.width)}x${Math.round(b.height)}`);
    }
    parts.push(`[id=${n.id}]`);
    lines.push(`${pad}- ${parts.join(" | ")}`);
    if (n.children) for (const c of n.children) walk(c, depth + 1);
  }
  walk(root, 0);
  if (count >= maxNodes) lines.push(`(... ${maxNodes}+ nodes truncated)`);
  return lines.join("\n");
}
