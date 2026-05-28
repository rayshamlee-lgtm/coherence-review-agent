---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Citation

**Figma Node ID:** `113380:57034` · **Type:** `COMPONENT_SET` · **Group:** Display · **Tier:** Consumer-facing · **Variants:** 4

## Summary

Citation provides source attribution for AI-generated and aggregated content on the SERP. It comes in two presentation types — **Inline** (embedded within text) and **In Card** (multi-source panel) — each with an active/inactive toggle that controls flyout visibility.

**Dependencies:**
- `Inline citation badge` — 36 variants
- `In card citation badge` — 4 variants
- `Dropdown flyout` — shared popup container

The Inline type attributes individual claims within AI/Copilot-generated text, placed immediately after the referenced statement. The In Card type shows aggregated sources for an entire card's content, placed in the card footer or attribution area. Citation is not for general navigation links or ad attribution (use Sponsored Slug + Ads menu icon).

---

## Variants

| Property | Values | Default |
|----------|--------|---------|
| **type** | `inline`, `in-card` | `inline` |
| **active** | `false`, `true` | `false` |

Total: 2 types × 2 active states = **4 variants**

| # | Type | Active | Behavior |
|---|------|--------|----------|
| 1 | Inline | false | Compact numbered badge in running text (e.g., "[1]"). Clickable. |
| 2 | Inline | true | Badge + dropdown flyout with source link and scroll. |
| 3 | In Card | false | Multi-favicon bar showing aggregated source icons. Clickable. |
| 4 | In Card | true | Favicon bar + dropdown flyout listing all sources with links. |

### Inline Citation Badge (36 variants)

| Property | Values |
|----------|--------|
| **Type** | `Counter`, `Counter + Name`, `Single source` |
| **Show link icon?** | `true`, `false` |
| **state** | `rest`, `hover`, `pressed` |
| **Style** | `Neutral`, `Themed` |

- **Counter** — Shows a number (e.g., "1"). Used for numbered inline references.
- **Counter + Name** — Shows number + source domain. Richer attribution.
- **Single source** — Shows domain name only (e.g., "lorem.com"). Used when there's one source.

### In Card Citation Badge (4 variants)

| Property | Values |
|----------|--------|
| **State** | `rest`, `hover`, `pressed`, `focus` |

Displays stacked favicon icons representing multiple sources. Favicons are 16×16px inside 24×24px circular containers.

---

## Anatomy

1. **Citation badge** — Inline badge showing source count with linked icons and labels
2. **Source links** — Individual source items with icon + label inside a link container
3. **Flyout panel** — Expandable dropdown showing full source list with scrollbar

---

## Visual States

| Interaction | Behavior |
|-------------|----------|
| Click source link | Navigates to the cited source URL |
| Click citation badge | Opens the full source list in a flyout panel |
| Keyboard Tab | Navigates to source links |
| Enter | Activates link navigation |
| Escape | Closes flyout |

---

## Usage Rules

### Inline placement
- The citation badge is placed immediately after the referenced sentence or claim within AI/Copilot-generated body text.
- Renders as a compact chip (e.g., `⇔ 1`) that flows inline — no line break needed.
- When `active=true`, a flyout opens showing the full source link.

### In Card placement
- Placed at the bottom of the AI/Copilot card, below the body content.
- Renders as a row of avatar thumbnails + source count label (e.g., `⇔ 4 Sources`) in the card footer area.
- When `active=true`, expands to show all source links.
- When sources overflow the row width, wrap in a Horizontal Scroller.

### Style selection
- `Neutral` style is used for standard SERP contexts.
- `Themed` style is used for branded or accented card contexts.
- Neutral and Themed styles are not mixed in the same card.

---

## Do / Don't

### Do
- Place Inline citations immediately after the referenced text.
- Use In Card for multi-source cards.
- Include the focus state for keyboard navigation.
- Use Themed style in accented/branded card contexts.

### Don't
- Don't scatter citations far from the content they attribute.
- Don't use In Card when there's only one source (use Single source Inline instead).
- Don't omit the focus outline on interactive badges.
- Don't mix Neutral and Themed styles in the same card.

---

## Dark Mode Notes

Both `Neutral` and `Themed` style variants resolve to appropriate tokens for light and dark themes. All citation badges and flyout content must meet WCAG AA contrast in both themes.

---

## Related Components

| Component | Relationship |
|-----------|-------------|
| **Flyout** | Dependency — dropdown popup container |
| **AI Disclaimer** | For AI-generated content notices |
| **Markdown** | For AI-generated text that citations attribute |

---

## Open questions

None.
