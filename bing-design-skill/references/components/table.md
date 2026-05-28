---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Table

**Figma Node ID:** `131224:177511` · **Type:** `COMPONENT_SET`  
**Group:** Display · **Tier:** Composite / Assembly · **Variants:** 2  
**Dependencies:** Table row  
**Consumed by:** Card body elements, answer cards, knowledge panels

---

## Summary

Table is a composite component that renders structured tabular data. It supports a compact mode for dense layouts and is composed of Table row sub-components. Tables are used within card bodies and answer panels to present structured information such as specs, comparisons, and data summaries.

This component is appropriate for displaying structured data in rows and columns within cards or answer panels, for comparison tables, specification lists, or key-value data, and when data has a consistent columnar structure. It is not appropriate for simple key-value pairs (use Label or list patterns instead), navigation or interactive lists (use List View), or layout purposes (use frames with auto-layout).

---

## Variants / Types

| Property | Values | Default | Description |
|----------|--------|---------|-------------|
| **compact** | `false`, `true` | `false` | Whether to use compact row spacing |

### compact

| Value | Purpose |
|-------|---------|
| **false** | Standard spacing — comfortable readability for general use |
| **true** | Compact spacing — denser layout for data-heavy contexts |

---

## Anatomy

1. **Table container** — Vertical auto-layout holding all rows
2. **Header row** — First Table row instance with header styling (bold text, distinct background)
3. **Data rows** — Repeating Table row instances for content; supports alternating row styles

Cell content may include images, badges, icons, and other components — not just text. Long content wraps to additional lines with truncation depending on length.

---

## Visual States

Table itself is a container — interaction states (hover, pressed) exist on individual Table rows, not on the Table component itself. Clickable rows highlight on hover and show a pressed state on click. Non-interactive rows have no hover or pressed state.

---

## Usage Rules

- Table is composed of Table row sub-components — add/remove rows as needed.
- Use `compact` mode in data-dense contexts (e.g., specification tables inside cards).
- Standard mode provides better readability for general-purpose tables.
- Spacing tokens: `smtc/gap/between/content/small` for row gaps; `smtc/gap/between/content/xx-small` for cell gaps.
- Consistent column widths must be maintained across all rows.

### Do
- Use consistent column widths across all rows.
- Use `compact` for dense data displays within constrained card bodies.
- Include a header row with distinct styling to differentiate from data rows.
- Ensure sufficient contrast between alternating row backgrounds if used.

### Don't
- Use tables for layout — use auto-layout frames instead.
- Nest tables within tables.
- Mix compact and standard rows within the same table.

---

## Dark Mode Notes

Header row and alternating row backgrounds must maintain WCAG AA contrast in both light and dark themes. Clickable row hover states must be distinguishable from the default row background in both modes.

---

## Related Components

| Component | Relationship |
|-----------|-------------|
| **Table row** | Dependency — individual rows within the table |
| **Card body elements** | Consumer — uses Table for structured data within cards |
| **List View** | Alternative — use for interactive list items without columnar structure |
| **Label** | Alternative — use for simple key-value pairs |

---

## Open questions

None.
