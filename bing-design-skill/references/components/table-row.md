---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Table Row

**Figma Node ID:** `131224:177426` · **Type:** `COMPONENT_SET`  
**Group:** Display · **Tier:** Base / Foundational Atom · **Variants:** 6  
**Dependencies:** none  
**Consumed by:** Table

---

## Summary

Table row is the individual row atom used inside the Table composite. Each row has a body slot for cell content, supports compact mode for dense layouts, and provides interaction states (rest, hover, pressed) for clickable rows.

This component is appropriate as a child of the Table component and when building custom table layouts that need row-level interaction states. It is not appropriate as a standalone component outside of a Table — use List View for standalone interactive rows — or for non-tabular list items (use List View or Label).

---

## Variants / Types

| Property | Values | Default | Description |
|----------|--------|---------|-------------|
| **compact** | `false`, `true` | `false` | Whether to use compact row height |
| **state** | `rest`, `hover`, `pressed` | `rest` | Interaction state of the row |
| **body** | *(slot)* | — | Content slot for row cells |

### state

| Value | Purpose |
|-------|---------|
| **rest** | Default resting state |
| **hover** | Pointer hover — indicates the row is interactive |
| **pressed** | Active press — feedback during click/tap |

### compact

| Value | Purpose |
|-------|---------|
| **false** | Standard row height |
| **true** | Compact row height for data-dense tables |

---

## Anatomy

1. **Row container** — Horizontal auto-layout holding all cells
2. **Body slot** — Cell content area (Figma SLOT); accepts text, icons, or components for each column

---

## Visual States

- **Rest** — default background; no interaction indication
- **Hover** — row background shifts to hover token on pointer enter (non-header rows only)
- **Pressed** — active press feedback during click/tap

Selected state (when applicable) shows a distinct background token per consumer implementation. Hover and pressed states must only be applied to rows that are actually interactive — non-interactive data rows should remain in `rest` state.

---

## Usage Rules

- Table row is a dependency of Table — always use within a Table container.
- The `body` slot accepts cell content — drag cell frames into the slot.
- Match `compact` value to the parent Table's `compact` property for consistency.
- Consistent column widths must be maintained across all rows in a table.
- Apply hover/pressed states only for rows that are actually interactive.

### Do
- Keep cell content within the body slot concise and aligned across rows.
- Use the header variant for the first row to establish column labels.
- Use compact mode for dense data displays where vertical space is limited.
- Keep `compact` consistent with the parent Table's setting.

### Don't
- Use Table row outside of a Table component — it relies on Table's container layout.
- Apply hover/pressed states to non-interactive data rows.
- Mix compact and default rows within the same table.

---

## Dark Mode Notes

Row hover and pressed background tokens must maintain sufficient contrast in both light and dark themes. Non-interactive rows must not have hover/pressed states that could be confused with interactive rows.

---

## Related Components

| Component | Relationship |
|-----------|-------------|
| **Table** | Parent — Table row is always used inside Table |
| **List View** | Alternative — for standalone interactive rows outside tables |

---

## Open questions

None.
