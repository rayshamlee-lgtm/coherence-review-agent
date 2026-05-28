---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Checkbox

## Summary

Checkbox is a selection control that allows users to choose one or more options from a set, or toggle an individual option on/off. It supports unchecked, checked, and mixed (indeterminate) states — making it suitable for both flat lists and hierarchical "select all" patterns in ACF SERP experiences.

**Figma Node ID:** `25773:76196` · **Type:** `COMPONENT_SET` · **Group:** Data Entry  
**Tier:** Base / SDL Atom · **Variants:** 10 · **Consumed by:** Filter panels, Settings, Forms, List items with selection

---

## Variants / Types

| Property | Values | Default | Description |
|----------|--------|---------|-------------|
| **state** | `rest`, `hover`, `pressed`, `focus` | `rest` | Interaction state |
| **disabled** | `False`, `True` | `False` | Whether the checkbox is non-interactive |
| **checked** | `False`, `True` | `False` | Whether the checkmark is visible |
| **mix mark** | `False`, `True` | `False` | When True (and checked=True), shows dash overlay instead of checkmark (indeterminate) |

### State reference

| State | Visual | Description |
|-------|--------|-------------|
| **Default** | Empty box | Unchecked rest state; no user interaction |
| **Hover** | Highlighted border/fill | Cursor over the checkbox; provides interactive affordance |
| **Checked** | Box with checkmark | User has selected this option |
| **Mixed** | Box with dash/minus | Indeterminate — parent checkbox when children are partially selected |
| **Focus** | Focus ring | Keyboard focus state; visible ring around the control |

---

## Anatomy

1. **Check box** — Square input indicator; shows empty, checked, or indeterminate state
2. **Label** — Descriptive text next to the checkbox
3. **Focus ring** — Visible outline on keyboard focus (uses focus outline dependency)

---

## Visual States

- **Default / rest:** Empty square box, no indicator
- **Hover:** Border or background highlight indicates the control is interactive
- **Checked:** Checkmark visible inside the box
- **Mixed / indeterminate:** Dash or minus indicator inside the box (parent "select all" with partial child selection)
- **Focus:** Focus ring visible around the control
- **Disabled:** All states above with reduced opacity; cursor indicates not-allowed; all interaction suppressed

---

## Usage Rules

- Always provide a visible label adjacent to the checkbox — never use a standalone checkbox without context
- Keep label text concise; one line preferred. If wrapping is needed, the checkbox aligns to the first line
- When checkboxes form a group, provide a group heading (e.g., "Filter by category")
- Align checkboxes vertically in lists; use consistent spacing between items
- Position the checkbox to the left of its label (LTR) or right (RTL)
- In dense layouts, use `xxx-small` / `xx-small` spacing between checkbox items
- **Mixed state pattern:** Use Mixed on a parent "Select all" checkbox when some (but not all) children are checked. Clicking a Mixed checkbox checks all children; clicking again unchecks all children.
- Checkbox is for selection, not for triggering immediate actions (use Button) or binary on/off settings (use Toggle)

---

## Do / Don't

### Do
- Use Mixed state for "Select all" when only some items in the group are selected
- Show Focus state for keyboard navigation to meet WCAG AA focus indicator requirements
- Group related checkboxes under a clear heading or label
- Maintain visual consistency — all checkboxes in a group should be the same size
- Explain why a checkbox is disabled (e.g., tooltip or helper text)

### Don't
- Use a checkbox for binary on/off settings — use Toggle instead
- Disable a checkbox without providing context for why it's unavailable
- Use a checkbox to trigger an immediate action — checkboxes represent selection
- Nest checkboxes more than one level deep (parent → children only)
- Rely solely on the checkmark color to convey checked state — ensure sufficient contrast and shape differentiation
- Place checkboxes in horizontal rows when there are more than 3 options — use vertical stacking

---

## Dark Mode Notes

Checkbox border, fill, and checkmark icon must meet WCAG AA contrast requirements against both light and dark backgrounds. Disabled state uses reduced opacity and remains perceivable — color alone must not indicate the disabled state.

---

## Open Questions

None.
