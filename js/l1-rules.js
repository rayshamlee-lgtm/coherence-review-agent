// L1 rules engine.
//
// Two passes per node:
//   1. Bound-to-style check — is this value bound to a style or variable?
//      Unbound literals get flagged as a "hard-coded" warning.
//   2. Catalog check — when a value IS a literal, also compare it against
//      the BingDesignSkill V2 token catalog. Literals that match a token
//      are downgraded to "info" (designer used a legal value but didn't
//      bind it). Literals outside the catalog are upgraded to "error" —
//      these are genuine off-ramps from the design system.
//
// Checks performed:
//   - fills    (color)
//   - strokes  (color)
//   - typography (fontSize / fontWeight / fontFamily)
//   - cornerRadius (rectangleCornerRadii or cornerRadius)
//   - spacing  (paddingLeft/Right/Top/Bottom + itemSpacing) on auto-layout

import { flatten } from "./figma.js";
import { TOKEN_CATALOG } from "./token-catalog.js";

function rgbaToHex({ r, g, b }) {
  const to = (x) => Math.round(x * 255).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

function hasBoundVariable(node, key) {
  const bv = node.boundVariables;
  if (!bv) return false;
  const v = bv[key];
  if (!v) return false;
  if (Array.isArray(v)) return v.length > 0;
  return true;
}

function findingFor(node, parent, code, severity, message, evidence) {
  return {
    code,
    severity,            // "error" | "warn" | "info"
    nodeId: node.id,
    nodeName: node.name,
    nodeType: node.type,
    parentName: parent ? parent.name : null,
    message,
    evidence,
  };
}

// Choose severity based on whether a literal value matches the catalog.
//   - in catalog  → "info"  (legal value, but not bound — minor)
//   - off catalog → "error" (off-ramp from design system)
//   - unknown / not checkable → "warn" (hard-coded, can't verify)
function severityFromMatch(inCatalog) {
  if (inCatalog === true)  return "info";
  if (inCatalog === false) return "error";
  return "warn";
}

// Pure black and pure white are universal canvas / decoration colors;
// designers use them loosely and binding them to a token adds no real
// signal. Skip findings on these specific hex values.
const COLOR_SILENT = new Set(["#ffffff", "#000000"]);

function checkFills(node, parent, findings) {
  if (!Array.isArray(node.fills)) return;
  if (node.styles && node.styles.fill) return;
  if (hasBoundVariable(node, "fills")) return;
  for (const f of node.fills) {
    if (f.visible === false) continue;
    if (f.type === "SOLID" && f.color) {
      const hex = rgbaToHex(f.color);
      if (COLOR_SILENT.has(hex)) continue;
      const inCatalog = TOKEN_CATALOG.colors.has(hex);
      const sev = severityFromMatch(inCatalog);
      const msg = inCatalog
        ? `Fill color ${hex} matches a token but is hard-coded — bind it to a style or variable.`
        : `Fill color ${hex} is not in the Bing token palette and is hard-coded.`;
      findings.push(findingFor(node, parent, "L1.color.fill", sev, msg, { hex, inCatalog }));
    }
  }
}

function checkStrokes(node, parent, findings) {
  if (!Array.isArray(node.strokes)) return;
  if (node.styles && node.styles.stroke) return;
  if (hasBoundVariable(node, "strokes")) return;
  for (const s of node.strokes) {
    if (s.visible === false) continue;
    if (s.type === "SOLID" && s.color) {
      const hex = rgbaToHex(s.color);
      if (COLOR_SILENT.has(hex)) continue;
      const inCatalog = TOKEN_CATALOG.colors.has(hex);
      const sev = severityFromMatch(inCatalog);
      const msg = inCatalog
        ? `Stroke color ${hex} matches a token but is hard-coded — bind it to a style or variable.`
        : `Stroke color ${hex} is not in the Bing token palette and is hard-coded.`;
      findings.push(findingFor(node, parent, "L1.color.stroke", sev, msg, { hex, inCatalog }));
    }
  }
}

function matchTypographyRamp(fs, fw) {
  return TOKEN_CATALOG.typography.find(t => t.fontSize === fs && t.weight === fw) || null;
}

function checkTypography(node, parent, findings) {
  if (node.type !== "TEXT" || !node.style) return;
  if (node.styles && node.styles.text) return;
  const textVarKeys = [
    "fontSize", "fontFamily", "fontWeight", "fontStyle",
    "lineHeight", "letterSpacing", "paragraphSpacing",
  ];
  if (textVarKeys.some((k) => hasBoundVariable(node, k))) return;

  const fs = Math.round(node.style.fontSize || 0);
  const fw = Math.round(node.style.fontWeight || 0);
  const fam = node.style.fontFamily || "";

  const ramp = matchTypographyRamp(fs, fw);
  const familyOk = TOKEN_CATALOG.fontFamilies.has(fam);
  const weightOk = TOKEN_CATALOG.fontWeights.has(fw);
  const inCatalog = !!ramp && familyOk;

  const sev = severityFromMatch(inCatalog);
  const reasons = [];
  if (!ramp)      reasons.push(`${fs}px/${fw} is not in the typography ramp`);
  if (!familyOk)  reasons.push(`family "${fam}" is not a Bing font`);
  if (!weightOk)  reasons.push(`weight ${fw} is not 400 or 700`);

  const msg = inCatalog
    ? `Text style ("${fam}" ${fs}px / ${fw}, matches "${ramp.name}") is hard-coded — bind it to a text style or variable.`
    : `Hard-coded text style ("${fam}" ${fs}px / ${fw}) — ${reasons.join("; ") || "off-catalog"}.`;

  findings.push(findingFor(
    node, parent, "L1.typography", sev, msg,
    { fontFamily: fam, fontSize: fs, fontWeight: fw, ramp: ramp?.name || null, inCatalog },
  ));
}

function checkCornerRadius(node, parent, findings) {
  // Skip text + groups; only meaningful on shapes/frames.
  if (!("cornerRadius" in node || "rectangleCornerRadii" in node)) return;
  if (hasBoundVariable(node, "cornerRadius") ||
      hasBoundVariable(node, "topLeftRadius") ||
      hasBoundVariable(node, "topRightRadius") ||
      hasBoundVariable(node, "bottomLeftRadius") ||
      hasBoundVariable(node, "bottomRightRadius")) return;

  // rectangleCornerRadii: [tl, tr, br, bl] when corners are mixed.
  const radii = Array.isArray(node.rectangleCornerRadii)
    ? node.rectangleCornerRadii
    : (typeof node.cornerRadius === "number" ? [node.cornerRadius] : []);
  if (!radii.length) return;

  // The design system has exactly one "fully rounded" token: 9999. A pill
  // or circle MUST be expressed with that sentinel — not with whatever
  // large magic number happens to round the shape (999, 100, 71.43…).
  // Those magic numbers are real off-token values: they round correctly at
  // the current size but break the moment the element resizes, and they
  // bypass the design system. So we flag them. We only tailor the message
  // when the value visually fully rounds the element, to point the designer
  // at the 9999 circular token instead of the small-radius ramp.
  const bb = node.absoluteBoundingBox;
  const fullRoundThreshold = bb ? Math.min(bb.width, bb.height) / 2 : Infinity;

  // Collect distinct off-ramp values across all corners, then emit
  // one finding per unique value. A square with the same wrong radius
  // on all four corners counts as one issue, not four.
  const offending = new Set();
  for (const r of radii) {
    const rounded = Math.round(r);
    if (rounded === 0) continue;                            // 0 is always fine
    if (TOKEN_CATALOG.cornerRadius.has(rounded)) continue;  // matches a token
    offending.add(rounded);
  }
  for (const value of offending) {
    const fullyRounds = value >= fullRoundThreshold;
    const message = fullyRounds
      ? `Corner radius ${value}px fully rounds this element but isn't the circular token — use 9999 for pill / circular shapes (allowed: 0, 4, 8, 12, 16, 24, 9999).`
      : `Corner radius ${value}px is not a Bing corner token (allowed: 0, 4, 8, 12, 16, 24, 9999).`;
    findings.push(findingFor(
      node, parent, "L1.cornerRadius", "error", message,
      { value, fullyRounds },
    ));
  }
}

function checkSpacing(node, parent, findings) {
  // Only auto-layout frames carry padding / itemSpacing reliably.
  if (node.layoutMode !== "HORIZONTAL" && node.layoutMode !== "VERTICAL") return;

  // itemSpacing only paints a gap *between* siblings, so it has zero visual
  // effect unless at least two children participate in the auto-layout flow.
  // A child only participates when it's visible and not absolutely
  // positioned (ABSOLUTE children are lifted out of the flow). Frames that
  // wrap a single child but carry a leftover gap value are a common
  // file-organization artifact — checking their itemSpacing is noise.
  const laidOutChildCount = Array.isArray(node.children)
    ? node.children.filter(
        (c) => c.visible !== false && c.layoutPositioning !== "ABSOLUTE",
      ).length
    : 0;
  const itemSpacingHasEffect = laidOutChildCount >= 2;

  const checks = [
    ["paddingLeft",   node.paddingLeft],
    ["paddingRight",  node.paddingRight],
    ["paddingTop",    node.paddingTop],
    ["paddingBottom", node.paddingBottom],
    ["itemSpacing",   node.itemSpacing],
  ];

  for (const [key, raw] of checks) {
    if (raw == null) continue;
    if (hasBoundVariable(node, key)) continue;
    // Skip itemSpacing that can never render a gap (fewer than two laid-out
    // children). Padding still applies to a single child, so it's untouched.
    if (key === "itemSpacing" && !itemSpacingHasEffect) continue;
    const v = Math.round(raw);
    if (v === 0) continue;
    // itemSpacing can legitimately be negative for overlap layouts;
    // -4 is an accepted Bing pattern (e.g. stacked avatars).
    if (key === "itemSpacing" && v === -4) continue;
    if (TOKEN_CATALOG.spacing.has(v)) continue;
    findings.push(findingFor(
      node, parent, "L1.spacing", "error",
      `${key} ${v}px is not a Bing spacing token (allowed: 2, 3, 4, 6, 8, 9, 12, 16, 20, 24, 72, 160).`,
      { property: key, value: v },
    ));
  }
}

export function runL1(root, opts = {}) {
  const findings = [];
  // Grade the full tree, including the internals of placed library
  // components. A component's baked-in radius / color / spacing still ships
  // as part of the designer's module, so off-token values inside an instance
  // (e.g. a play-button radius of 999 instead of the 9999 circular token)
  // are real violations the reviewer should surface — even if the fix is to
  // swap the component or escalate to its owner rather than edit it locally.
  const flat = flatten(root, null, 0, [], opts);
  for (const { node, parent } of flat) {
    // Skip the page-wrapper node itself — its padding / spacing /
    // corner / fill are scaffolding, not the designed answer module.
    // Descendants of the wrapper are still inspected.
    if (opts.pageWrapperId && node.id === opts.pageWrapperId) continue;
    checkFills(node, parent, findings);
    checkStrokes(node, parent, findings);
    checkTypography(node, parent, findings);
    checkCornerRadius(node, parent, findings);
    checkSpacing(node, parent, findings);
  }

  // Aggregate score: start at 10, deduct per finding (capped).
  const weights = { error: 2, warn: 0.5, info: 0.15 };
  let deduction = 0;
  for (const f of findings) deduction += weights[f.severity] || 0;
  const score = Math.max(0, Math.min(10, 10 - deduction));

  // Bucket counts to render summary chips.
  const counts = { error: 0, warn: 0, info: 0 };
  for (const f of findings) counts[f.severity] = (counts[f.severity] || 0) + 1;

  // Group findings by code so the UI renders one row per rule.
  const byCode = {};
  for (const f of findings) {
    (byCode[f.code] ||= []).push(f);
  }

  return {
    score: Number(score.toFixed(2)),
    nodeCount: flat.length,
    counts,
    findings,
    byCode,
  };
}
