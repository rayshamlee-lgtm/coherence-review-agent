---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Dropdown

## Summary

Dropdown is a selector control that expands to reveal a list of options. It has two states — collapsed (showing the current selection or placeholder text) and expanded (showing the full option list). It is suited for single-selection from a moderate-to-large set of options when screen space is limited.

**Note:** The Figma component name includes a trailing space ("Dropdown ").

**Figma Node ID:** `25694:57298` · **Type:** `COMPONENT_SET` · **Group:** Data Entry · **Variants:** 2

**Dependencies:** focus outline

**Consumed by:** Forms, filter groups, settings panels, navigation controls

---

## Variants / Types

### Expanded

| Value | Description |
|-------|-------------|
| `False` (default) | Collapsed — shows current selection or placeholder; option list hidden |
| `True` | Expanded — option list flyout is visible |

---

## Visual States

| State | Description |
|-------|-------------|
| Collapsed | Field trigger visible; current selection or placeholder text shown; chevron points down |
| Expanded | Option list flyout open; chevron points up; scrollbar visible for long lists |

---

## Anatomy

1. **Field trigger** — Collapsed state showing the current selection or placeholder text; uses the Field component. Consumer can configure Field component properties to stylize the trigger.
2. **Dropdown icon** — Chevron indicator in the field showing expand/collapse affordance.
3. **Option list (Flyout)** — Expanded panel listing selectable options; uses Flyout with Basic body and scrollbar.
4. **Scrollbar** — Visible scroll indicator for long option lists within the flyout.

---

## Usage Rules

- Dropdown is used for single-selection from a set of 5 or more options where showing all options simultaneously is impractical.
- The collapsed state must always display the current selection or a placeholder.
- Option labels must be concise, parallel in structure, and mutually exclusive.
- Options should be ordered logically (most common first, alphabetical, or chronological).
- Dropdown width must accommodate the longest option label without truncation.
- The expanded list must not exceed the viewport; scroll or reposition as needed.
- Use icons for all options in a dropdown or for none — mixing icon and non-icon options in the same list is not permitted.
- A two-line Option is acceptable for certain scenarios; the top label should be concise (1–2 words) with the bottom label providing additional context.
- A Number input variant inside a dropdown is acceptable for numeric value entry within categorized options.

---

## Do / Don't

### Do
- Use Dropdown when the option count exceeds what Radio buttons can comfortably display.
- Show a clear current selection or placeholder in the collapsed state.
- Ensure the expanded list is keyboard-navigable.

### Don't
- Don't use Dropdown for 2–3 options — use Radio button for visible choices.
- Don't truncate option labels in the expanded list.
- Don't nest Dropdowns inside other Dropdowns.

---

## Dark Mode Notes

No explicit dark mode token overrides are documented for this component at this tier. The dropdown inherits theme tokens from its container. The focus ring meets WCAG AA contrast requirements in both light and dark themes.

---

## Open Questions

None.
