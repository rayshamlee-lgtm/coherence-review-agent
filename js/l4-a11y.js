// L4 accessibility engine — deterministic WCAG contrast checking.
//
// Unlike L1 (token off-ramps) this layer asks a different question: "can a
// user actually read the text?" For every visible TEXT node we resolve the
// foreground color (its fill), find the effective background behind it, and
// compute the real WCAG 2.1 contrast ratio. We grade against the AA bar:
//   - normal text  → 4.5:1
//   - large text   → 3.0:1   (≥24px, or ≥18.66px when bold)
//
// Honesty over coverage: when the text sits on an image or a gradient — or
// no solid background can be resolved — we do NOT guess a pass/fail. We emit
// an "indeterminate" finding asking for a manual check. A fake green is worse
// than an honest "couldn't tell."
//
// Output shape matches l1-rules.js (score / counts / findings / byCode) so the
// UI renders it with the same machinery.

import { flatten } from "./figma.js";

// ── color math ──────────────────────────────────────────────────────────

// One sRGB channel (0–1) → linear light, per WCAG relative-luminance def.
function linearize(c) {
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function relativeLuminance({ r, g, b }) {
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

// WCAG contrast ratio between two opaque colors. Always ≥ 1.
function contrastRatio(fg, bg) {
  const L1 = relativeLuminance(fg);
  const L2 = relativeLuminance(bg);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Composite a possibly-translucent foreground over an opaque background.
// alpha is the combined fill + node opacity in [0,1].
function blendOver(fg, bg, alpha) {
  if (alpha >= 1) return fg;
  return {
    r: fg.r * alpha + bg.r * (1 - alpha),
    g: fg.g * alpha + bg.g * (1 - alpha),
    b: fg.b * alpha + bg.b * (1 - alpha),
  };
}

function rgbToHex({ r, g, b }) {
  const to = (x) => Math.round(x * 255).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

// ── paint resolution ────────────────────────────────────────────────────

// The top-most visible paint wins (later fills render over earlier ones).
// Returns one of:
//   { kind: "solid", rgb, alpha }   — a usable color
//   { kind: "image" } / { kind: "gradient" }  — paintable but not a flat color
//   null                            — nothing painted (transparent)
function topPaint(node) {
  if (!Array.isArray(node.fills)) return null;
  for (let i = node.fills.length - 1; i >= 0; i--) {
    const f = node.fills[i];
    if (!f || f.visible === false) continue;
    if (f.type === "SOLID" && f.color) {
      return {
        kind: "solid",
        rgb: { r: f.color.r, g: f.color.g, b: f.color.b },
        alpha: (f.opacity == null ? 1 : f.opacity) * (f.color.a == null ? 1 : f.color.a),
      };
    }
    if (f.type === "IMAGE") return { kind: "image" };
    if (typeof f.type === "string" && f.type.startsWith("GRADIENT")) return { kind: "gradient" };
    // Unknown paint type — treat as paintable-but-unknown.
    return { kind: "other" };
  }
  return null;
}

// ── geometry ────────────────────────────────────────────────────────────

// Does `outer` fully contain `inner` (with a small tolerance)? Used to find
// which painted boxes sit behind a text node.
function containsBox(outer, inner, tol = 0.5) {
  return (
    outer.x - tol <= inner.x &&
    outer.y - tol <= inner.y &&
    outer.x + outer.width + tol >= inner.x + inner.width &&
    outer.y + outer.height + tol >= inner.y + inner.height
  );
}

function area(b) {
  return Math.max(0, b.width) * Math.max(0, b.height);
}

// ── classification ──────────────────────────────────────────────────────

// WCAG "large text": ≥ 18pt (24px) regular, or ≥ 14pt (18.66px) bold.
function isLargeText(fontSize, fontWeight) {
  if (fontSize >= 24) return true;
  if (fontSize >= 18.66 && fontWeight >= 700) return true;
  return false;
}

// AA thresholds.
const AA_NORMAL = 4.5;
const AA_LARGE = 3.0;

function findingFor(node, parent, code, severity, message, evidence) {
  return {
    code,
    severity, // "error" | "warn" | "info"
    nodeId: node.id,
    nodeName: node.name,
    nodeType: node.type,
    parentName: parent ? parent.name : null,
    message,
    evidence,
  };
}

// ── main ────────────────────────────────────────────────────────────────

export function runL4(root, opts = {}) {
  const findings = [];
  const flat = flatten(root, null, 0, [], opts);

  // Precompute the set of painted boxes once — every node that paints
  // something and has geometry is a background candidate.
  const painted = [];
  for (const { node } of flat) {
    const b = node.absoluteBoundingBox;
    if (!b) continue;
    const paint = topPaint(node);
    if (!paint) continue;
    painted.push({ node, bbox: b, paint });
  }

  let textCount = 0;

  for (const { node, parent } of flat) {
    if (node.type !== "TEXT") continue;
    const tb = node.absoluteBoundingBox;
    if (!tb || area(tb) === 0) continue;

    const fgPaint = topPaint(node);
    if (!fgPaint || fgPaint.kind !== "solid") continue; // gradient/image text — skip, rare
    textCount++;

    // Resolve the effective background: the smallest painted box (other than
    // the text itself) that fully contains the text. Smallest-area = the
    // nearest/innermost surface visually behind the glyphs.
    let bg = null;
    let bgArea = Infinity;
    for (const cand of painted) {
      if (cand.node.id === node.id) continue;
      if (area(cand.bbox) <= area(tb)) continue; // can't be a containing surface
      if (!containsBox(cand.bbox, tb)) continue;
      const a = area(cand.bbox);
      if (a < bgArea) { bgArea = a; bg = cand; }
    }

    const fontSize = Math.round(node.style?.fontSize || 0);
    const fontWeight = Math.round(node.style?.fontWeight || 400);
    const large = isLargeText(fontSize, fontWeight);
    const threshold = large ? AA_LARGE : AA_NORMAL;
    const sizeLabel = `${fontSize}px${fontWeight >= 700 ? " bold" : ""}${large ? " (large)" : ""}`;

    // No resolvable solid background → don't fake a verdict.
    if (!bg) {
      findings.push(findingFor(
        node, parent, "L4.contrast.indeterminate", "warn",
        `Could not resolve a solid background behind "${truncate(node.characters)}" — contrast not verifiable automatically. Check manually.`,
        { fg: rgbToHex(fgPaint.rgb), reason: "no-solid-background", sizeLabel },
      ));
      continue;
    }

    // Text over an image or gradient → indeterminate by definition.
    if (bg.paint.kind !== "solid") {
      findings.push(findingFor(
        node, parent, "L4.contrast.indeterminate", "warn",
        `"${truncate(node.characters)}" sits on ${bg.paint.kind === "image" ? "an image" : "a gradient"} — contrast varies across the area and can't be computed. Verify legibility manually (consider a scrim or text shadow).`,
        { fg: rgbToHex(fgPaint.rgb), background: bg.paint.kind, sizeLabel },
      ));
      continue;
    }

    // Both colors known → compute the real ratio.
    const fgEff = blendOver(fgPaint.rgb, bg.paint.rgb, fgPaint.alpha);
    const ratio = contrastRatio(fgEff, bg.paint.rgb);
    const ratioStr = `${ratio.toFixed(2)}:1`;

    const evidence = {
      fg: rgbToHex(fgEff),
      bg: rgbToHex(bg.paint.rgb),
      ratio: Number(ratio.toFixed(2)),
      required: threshold,
      sizeLabel,
      backgroundNode: bg.node.name,
    };

    if (ratio < threshold) {
      findings.push(findingFor(
        node, parent, "L4.contrast.fail", "error",
        `Text "${truncate(node.characters)}" has contrast ${ratioStr} against its background (${evidence.fg} on ${evidence.bg}) — below the WCAG AA minimum of ${threshold}:1 for ${large ? "large" : "normal"} text.`,
        evidence,
      ));
    }
    // Passing text emits no finding (keeps the panel focused on problems).
  }

  // Deduction-based score, identical weighting to L1 for a consistent 0–10.
  const weights = { error: 2, warn: 0.5, info: 0.15 };
  let deduction = 0;
  for (const f of findings) deduction += weights[f.severity] || 0;
  const score = Math.max(0, Math.min(10, 10 - deduction));

  const counts = { error: 0, warn: 0, info: 0 };
  for (const f of findings) counts[f.severity] = (counts[f.severity] || 0) + 1;

  const byCode = {};
  for (const f of findings) (byCode[f.code] ||= []).push(f);

  return {
    score: Number(score.toFixed(2)),
    textCount,
    counts,
    findings,
    byCode,
  };
}

function truncate(s, n = 40) {
  const t = String(s || "").replace(/\s+/g, " ").trim();
  return t.length > n ? t.slice(0, n) + "…" : t;
}
