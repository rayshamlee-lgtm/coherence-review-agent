---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Answer Card

## Summary

Answer Card is the primary card container for SERP answer experiences. It wraps rich answer content — text blocks, lists, tables, media, and interactive elements — within a consistent card surface. Two background styles (accented and neutral) support visual hierarchy on the page. Flexible height and padding options accommodate diverse content types.

**Figma Node ID:** `23712:60845` · **Type:** `COMPONENT_SET` · **Group:** Cards · **Variants:** 36

**Dependencies:** focus outline

**Consumed by:** Section body / magazine (Zone A), Section body / Q&A (Zone A), answer experiences

---

## Variants / Types

### Style

| Style | Token prefix | Surface meaning |
|-------|-------------|-----------------|
| `accented` | `background-card-on-primary-alt-` | Accent card on neutral page — draws attention |
| `nonAccent` | `background-card-on-primary-default-` | Neutral card on neutral page — blends with surroundings |

### Padding

| Padding | Behavior | Use case |
|---------|----------|----------|
| `default` | Standard inset on all sides | Most answer content |
| `none` | Zero padding — full-bleed content | Embedded maps, full-width media, edge-to-edge visuals |
| `block` | Larger vertical/horizontal padding | Long-form text content needing more breathing room |

### Height

| Height | Behavior | Use case |
|--------|----------|----------|
| `standard` | Fixed to magazine grid row height (88px rhythm) | Grid-aligned answer layouts |
| `flexible` | Grows with content | Variable-length answers, expandable content |

### Common padding × height combinations

| Combination | Description |
|-------------|-------------|
| default + standard | Most common; grid-aligned card with standard inset |
| none + standard | Full-bleed media in a fixed-height container |
| none + flexible | Full-bleed media that grows with content |
| block + flexible | Long-form text answers with generous padding and variable height |

---

## Visual States

| State | Description |
|-------|-------------|
| `rest` | Card background at base token value; no elevation change |
| `hover` | Subtle brightness or overlay shift on pointer enter |
| `pressed` | Darkened overlay on mouse-down / touch-start |

All three states are present for both `accented` and `nonAccent` styles.

---

## Anatomy

1. **Card header** — Optional title area with text and an end-props slot. The chevron button in the end-props slot uses the same foreground color as the title (`--smtc-foreground-content-neutral-primary`) at rest. When a child component needs to escape card bounds (e.g., AI Disclaimer flyout), the `.serp-answer-card--overflow-visible` modifier class switches the card from `overflow: clip` to `overflow: visible`.
2. **Body (Basic)** — Content slot using the Basic component; answer content is dropped here.
3. **Container** — Card frame with elevation, padding, and corner radius tokens.

### Card base properties

| Property | Description |
|----------|-------------|
| EnableDefaultBackground | Enables background styling per design tokens; disable for transparent backgrounds |
| EnableBorder | Adds border stroke on card boundary; available only when `EnableDefaultBackground = false` |
| Column span | Base columns the card occupies in Magazine/ACF Container Grid |
| Row span | Base rows in the grid; defines spatial footprint |
| Special width/height | Optional non-standard sizing mapping (e.g., "1.4" → 140px) |
| State | Controls state styling for interactivity (rest, hover, pressed) |

---

## Usage Rules

- `accented` style is reserved for the single most prominent answer on the page; multiple `accented` cards side-by-side dilute hierarchy.
- `nonAccent` is appropriate for secondary or supporting answer cards.
- `padding=none` is intended for full-bleed embedded content (maps, media); it must not be used with text-heavy content.
- `height=flexible` is used when content length is unpredictable; `height=standard` should not be used when content may overflow.
- Cards must not be hardcoded to fixed widths; the container grid controls card dimensions.
- Answer cards must not be nested inside other answer cards; use `background-card-on-secondary-default-` tokens for nested surfaces.
- Spacing between card content elements uses the spacing token scale: `x-small` for default inner gaps, `small` for section-level content breaks.
- Corner radius uses `-corner-card-` tokens.
- The Anchor Card (Zone A primary large card) uses `standard` height for grid alignment. The Accessory Card (smaller supporting card) simplifies content and may use `flexible` height.
- Every answer card design must support both Anchor and Accessory layouts.

---

## Do / Don't

### Do
- Use `accented` for the single most prominent answer — it should be immediately identifiable.
- Use `nonAccent` for secondary answers or when multiple cards appear in the same section.
- Use `padding=none` for full-bleed embedded content to maximize visual impact.
- Use `height=flexible` when content length is unpredictable.
- Provide both Anchor and Accessory layouts for every answer card design.
- Test with both short and long content to ensure `flexible` height scales gracefully.

### Don't
- Don't place multiple `accented` cards side-by-side.
- Don't combine `padding=none` with text-heavy content.
- Don't hardcode widths inside the card.
- Don't use `height=standard` for content that may overflow.
- Don't nest answer cards inside other answer cards.
- Don't detach the answer card component; use component properties to customize.

---

## Dark Mode Notes

- Both `accented` and `nonAccent` backgrounds meet WCAG 2.1 AA contrast requirements for overlaid text in both light and dark modes.
- Apply the desired variable mode to the parent container using Bing variable collections.
- `accented` style uses `background-card-on-primary-alt-` tokens validated for AA contrast in both themes.

---

## Open Questions

None.
