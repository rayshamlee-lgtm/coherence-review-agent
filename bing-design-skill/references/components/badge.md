---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Badge

## Summary

Badge is a compact, non-interactive label used to convey status, category, or metadata at a glance. It surfaces contextual information — such as severity, freshness, or source type — without requiring user interaction. It is a foundational atom appearing across cards, list items, and media overlays on SERP.

**Figma Node ID:** `52608:147354` · **Type:** `COMPONENT_SET` · **Group:** Display · **Variants:** 132

**Dependencies:** none

**Consumed by:** Cards, list items, search results, media overlays

---

## Variants / Types

### Color (semantic)

| Color | Semantic intent | Example labels |
|-------|----------------|----------------|
| `info` | Neutral information, general metadata | "Updated", "3 min read", "Official" |
| `discovery` | New, featured, or promotional content | "New", "Featured", "Beta" |
| `success` | Positive outcome, completion, verified state | "Verified", "In stock", "Passed" |
| `danger` | Error, critical issue, high severity | "Critical", "Error", "Expired" |
| `warning` | Caution, attention needed, moderate severity | "Caution", "Low stock", "Expiring soon" |

### Variant (visual weight)

| Variant | Emphasis | Notes |
|---------|----------|-------|
| `soft` | Lower | Subtle; blends with surrounding content. Default choice for most badge placements. |
| `solid` | Higher | Strong, prominent. Foreground tokens vary by color: info uses `--bing-smtc-foreground-ctrl-on-image-switchable-rest`; success/warning/danger use `--mai-smtc-foreground-ctrl-on-image-rest`; discovery uses `--smtc-foreground-ctrl-on-brand-rest`. All appear visually white but use different tokens for dark mode adaptation. |

### Size

| Size | When to use |
|------|-------------|
| `md` | Default. Standard card contexts, list items, section headers. |
| `sm` | Compact layouts, metadata rows, inline alongside other small elements. |

### startProps (leading visual)

| Value | Behavior |
|-------|----------|
| `icon` | Leading icon before the label; reinforces meaning |
| `favicon` | Site favicon before the label; identifies source/origin |
| `none` | Text only; no leading visual |

### fontWeight

| Value | When to use |
|-------|-------------|
| `default` | Standard weight; suitable for most contexts |
| `bold` | Extra emphasis; use in dense layouts or alongside `danger` / `warning` color |

### Overlay

| Value | Behavior |
|-------|----------|
| `false` | Standard rendering on page or card backgrounds |
| `true` | Rendering on top of images or media with adjusted contrast |

**Variant count:** 3 startProps × 2 variant × 2 size × 5 color × 2 fontWeight × 2 overlay = 240 possible combinations; Figma contains 132 variants (some combinations are excluded where not meaningfully distinct).

---

## Visual States

Badge is non-interactive. It has no pointer states (hover, pressed, focus). When placed inside an interactive container, it inherits parent interaction but does not change its own appearance.

---

## Anatomy

1. **Icon** — Optional leading icon (instance swap); provides visual category hint.
2. **Label text** — Short status or category text; consumer-editable. Sentence case required.
3. **Container** — Pill-shaped background with token-bound color per variant.

---

## Usage Rules

- Limit badges to 1–2 per card item. Three or more creates visual clutter.
- Label text must be kept to 1–3 words.
- Use sentence case for label text ("In stock", not "IN STOCK").
- Use the same color for the same semantic meaning across the product.
- Default to `info` when the content is purely informational with no positive/negative connotation.
- Reserve `danger` exclusively for genuinely critical or error states.
- Use `-default` (brightened) tokens for most badge contexts. Use `-subtle` (desaturated) for dense or repeated layouts.
- `overlay=true` is required when the badge sits on top of a photo, video thumbnail, or visual background.
- `showLabel=false` must not be the sole means of conveying information; meaning must be communicated through surrounding context or accessible alternatives.
- Color must never be the only signal of badge meaning; always pair with a text label or icon.

---

## Do / Don't

### Do
- Use `soft` as the default — it integrates smoothly without drawing excessive attention.
- Use consistent semantic colors across the product so users learn to associate color with meaning.
- Pair icons or favicons with labels for accessibility.
- Use `overlay=true` when placing badges on images or media to ensure sufficient contrast.
- Use `sm` size in dense or repeated layouts to reduce visual weight.

### Don't
- Don't overuse badges — more than 2–3 per card creates visual noise.
- Don't use `danger` for non-critical information.
- Don't use `solid` for every badge — overuse of high-emphasis badges defeats visual hierarchy.
- Don't hide the label as the sole means of conveying information.
- Don't rely solely on color to convey meaning.
- Don't place badges where they might be mistaken for interactive buttons.

---

## Dark Mode Notes

- All badge color × variant combinations must meet WCAG 2.1 AA contrast in both light and dark themes.
- `solid` variant foreground tokens are chosen specifically for dark mode adaptation; info, success/warning/danger, and discovery each use a distinct token that appears visually white but resolves correctly per theme.
- `overlay=true` badges must maintain AA contrast against varied image backgrounds; use semi-transparent background layers where needed.
- Apply the desired variable mode to the parent container for light/dark theming.

---

## Open Questions

None.
