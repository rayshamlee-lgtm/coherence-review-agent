---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Filter Item

## Summary

Filter Item is a versatile filtering control used for content faceting and refinement across the SERP. It supports four visual styles that communicate filter state and emphasis, five interaction states, an optional dropdown indicator for expandable sub-filters, and an optional leading icon. With 40 variants, it covers the full matrix of filtering interactions from passive browse to active selection.

**Figma Node ID:** `23722:37270` · **Type:** `COMPONENT_SET` · **Group:** Navigation  
**Tier:** Base / Foundational Atom · **Variants:** 40 · **Consumed by:** Filter bars, faceted search, category selectors, content refinement panels

---

## Variants / Types

| Property | Values | Default | Description |
|----------|--------|---------|-------------|
| **Style** | `Default`, `Secondary`, `Ghost`, `Selected` | `Default` | Visual style indicating filter emphasis and state |
| **State** | `Default`, `Hover`, `Pressed`, `Disabled`, `Focus` | `Default` | Interaction state |
| **Dropdown?** | `False`, `True` | `False` | Whether the filter expands into a sub-menu/dropdown |
| **start icon** | `True`, `False` | `False` | Whether to display a leading icon |
| **Label** | *(text)* | — | Filter label text |

### Style reference

| Style | Token pattern | Emphasis | Purpose |
|-------|--------------|----------|---------|
| **Default** | `-ctrl-neutral-` | Standard | Primary filter style; neutral prominence suitable for most filter bars |
| **Secondary** | `-ctrl-subtle-` | Reduced | Lower-emphasis filter for secondary or nested filtering contexts |
| **Ghost** | Ghost treatment | Minimal | Transparent background at rest; blends into layout, reveals interactivity on hover/focus |
| **Selected** | `-ctrl-brand-` | Active | Indicates the filter is currently applied; visually distinct from all other styles |

### Filter patterns

| Pattern | Description |
|---------|-------------|
| **Single select (exposed row)** | All options visible; selecting one deselects the others |
| **Single select (dropdown)** | `Dropdown?=True` — opens a list; selecting one closes the dropdown and updates the label |
| **Boolean filter** | Filter is either on or off; always use in combination with other filters — if isolated, replace with Toggle |
| **Multi-select (exposed row)** | Multiple items can be in `Selected` state simultaneously |
| **Multi-select (dropdown)** | `Dropdown?=True` — opens a list with checkmarks; label shows selection count (e.g., "Attraction type (3)") |

---

## Anatomy

1. **Label text** — Filter option text; consumer-editable
2. **Start icon** — Optional leading icon for category recognition (instance swap)
3. **Dropdown chevron** — `SerpIcon CaretDown iconSize="m"` (16px); visible when `Dropdown?` is `True`
4. **Container** — Rectangular frame with selected/unselected state styling
5. **Flyout menu** — Dropdown sub-menu panel that appears on press; contains selectable filter options (visible in Pressed state with `Dropdown?=True`)

---

## Visual States

| State | Description |
|-------|-------------|
| **Default** | Rest state; neutral styling |
| **Hover** | Background shifts to hover token on pointer enter |
| **Pressed** | Pressed/active state; may trigger dropdown open |
| **Disabled** | All interaction suppressed; visually dimmed |
| **Focus** | Visible focus ring via `focus outline` dependency |

---

## Usage Rules

- Label text should be kept short (1–3 words) and descriptive of the filter category
- When a filter is active, switch to `Selected` style to clearly indicate applied state
- For expandable filters, the label describes the filter category, not the current selection
- Arrange filter items horizontally in a filter bar, with horizontal scroll for overflow
- Use `xx-small` spacing between filter items
- Maintain consistent sizing across all filter items in the same bar
- Selected filters remain in their original position — do not reorder on selection
- On narrow viewports, use horizontal scrolling for filter overflow; consider collapsing less-used filters into a "More filters" dropdown on mobile
- Touch targets must meet 48px minimum height
- Apply icons consistently within a filter group — either all items have icons or none do

---

## Do / Don't

### Do
- Use `Default` style for standard filter bars
- Use `Selected` style to clearly indicate which filters are currently applied
- Use `Dropdown?: True` when a filter category has sub-options (e.g., "Date" → Last week / Last month / Custom)
- Use `Ghost` style for inline filters that should blend into content areas
- Apply start icons consistently across a filter group
- Allow users to deselect filters to return to an unfiltered state
- Display all filter options as an exposed row when there is only one type of filter

### Don't
- Use a single dropdown filter if that is the only filter for the given content (unless space constraints require it)
- Use `Selected` style as a default/rest state — it should only indicate an active filter
- Mix filter item styles arbitrarily within the same filter bar
- Use filter items for navigation — use Tab instead
- Disable filters silently — show `Disabled` state with context, or hide the filter
- Use `Dropdown?: True` for filters that apply directly — only for filters with sub-menus
- Overload a filter bar with too many items — group and prioritize by usage frequency

---

## Dark Mode Notes

All four styles must meet WCAG AA contrast requirements in both light and dark themes. `Selected` style must be visually distinct from `Default` through a combination of fill, weight, or border changes — not color alone. `Ghost` style must ensure sufficient text contrast against variable backgrounds.

---

## Open Questions

None.
