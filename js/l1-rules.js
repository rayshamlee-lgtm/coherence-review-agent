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

function checkFills(node, parent, findings) {
  if (!Array.isArray(node.fills)) return;
  if (node.styles && node.styles.fill) return;
  if (hasBoundVariable(node, "fills")) return;
  for (const f of node.fills) {
    if (f.visible === false) continue;
    if (f.type === "SOLID" && f.color) {
      const hex = rgbaToHex(f.color);
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

  for (const r of radii) {
    const rounded = Math.round(r);
    if (rounded === 0) continue; // 0 is always fine and uninteresting
    const inCatalog = TOKEN_CATALOG.cornerRadius.has(rounded);
    if (inCatalog) continue;     // matches a token — no finding needed
    findings.push(findingFor(
      node, parent, "L1.cornerRadius", "error",
      `Corner radius ${rounded}px is not a Bing corner token (allowed: 0, 4, 8, 12, 16, 24, 9999).`,
      { value: rounded },
    ));
  }
}

function checkSpacing(node, parent, findings) {
  // Only auto-layout frames carry padding / itemSpacing reliably.
  if (node.layoutMode !== "HORIZONTAL" && node.layoutMode !== "VERTICAL") return;

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
    const v = Math.round(raw);
    if (v === 0) continue;
    if (TOKEN_CATALOG.spacing.has(v)) continue;
    findings.push(findingFor(
      node, parent, "L1.spacing", "error",
      `${key} ${v}px is not a Bing spacing token (allowed: 2, 3, 4, 6, 8, 9, 12, 16, 20, 24).`,
      { property: key, value: v },
    ));
  }
}

export function runL1(root, opts = {}) {
  const findings = [];
  const flat = flatten(root, null, 0, [], opts);
  for (const { node, parent } of flat) {
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
