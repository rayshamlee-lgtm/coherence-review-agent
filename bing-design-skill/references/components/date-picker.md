---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Date Picker

**Figma Node ID:** `74024:84925` · **Type:** `COMPONENT_SET` · **Group:** Data Entry · **Tier:** Special / Dependency · **Variants:** 4 · **Dependencies:** Field, Button, Focus outline · **Consumed by:** Form components, Filter controls

## Summary

Date Picker is a date selection component that allows users to choose a date or date range. It is classified as a dependency component, meaning it is consumed by other components rather than used standalone in the SERP layout. It provides 4 variants for different selection contexts.

This component is appropriate for date selection in forms, filters, or settings panels, and inside Drawer or Overlay panels for date-based filtering. It is not for time-only selection, for simple text input of dates (use Field with date formatting), or for date display (non-interactive).

---

## Variants

| Property | Values | Default |
|----------|--------|---------|
| **Expanded** | `False`, `True` | `False` |
| **Selection type** | `Single`, `Range` | `Single` |

Total: 2 expanded states × 2 selection types = **4 variants**

| Expanded | Selection type | Description |
|----------|---------------|-------------|
| False | Single | Calendar closed; single date selection mode |
| True | Single | Calendar open; single date selection |
| False | Range | Calendar closed; date range selection mode |
| True | Range | Calendar open; date range selection |

> **Note:** The exact variant property names are to be confirmed against the Figma source. The 4 variants likely represent combinations of expanded/collapsed state and single/range selection mode.

---

## Anatomy

1. **Field** — Text input trigger showing the selected date; uses Field component with calendar icon
2. **Calendar panel** — Flyout dropdown containing the date grid, month/year navigation, and day cells
3. **Text input** — Editable date text inside the field; supports typed date entry

---

## Visual States

| Interaction | Behavior |
|-------------|----------|
| Default (Expanded=False) | Field shows selected date or placeholder; calendar is hidden |
| Active (Expanded=True) | Calendar panel floats below the input |
| Hover (date cell) | Cell highlights on hover |
| Selected (date cell) | Selected date is visually distinct |
| Keyboard navigation | Arrow keys navigate the calendar grid |

- On mobile, for range date picker, refer to mobile-specific guidance.
- Toggle `Show metadata = True` on date cells to display additional date info.
- Expands into an L2 panel for date selection.

---

## Usage Rules

- The current month is shown by default when the picker opens.
- Keyboard input of dates is always allowed in addition to calendar selection.
- Date formats are localized based on user locale.
- Today's date is highlighted with a subtle indicator.
- Auto-submit on date selection is not used — users must confirm.
- Touch targets for date cells meet minimum 44×44px.
- On desktop, the calendar appears as a dropdown below the input field.
- On mobile (single date), the behavior is the same as desktop; for range date picker, refer to mobile-specific guidance.
- The component is not used standalone — it is consumed by Form and Filter controls.

---

## Do / Don't

### Do
- Show the current month by default when the picker opens.
- Allow keyboard input of dates in addition to calendar selection.
- Localize date formats based on user locale.
- Highlight today's date with a subtle indicator.

### Don't
- Don't force users to only use the calendar — always allow typed input.
- Don't disable future or past dates without clear indication of why.
- Don't use Date Picker for time selection.
- Don't auto-submit on date selection — let users confirm.

---

## Dark Mode Notes

Date cells, selected state indicator, and today's date indicator must all meet WCAG AA contrast in both light and dark themes. Disabled dates must be visually distinguishable but still meet minimum contrast.

---

## Related Components

| Component | Relationship |
|-----------|-------------|
| **Field** | Dependency — Date Picker uses Field for the input area |
| **Button** | Dependency — calendar navigation and confirmation |
| **Flyout** | Related — calendar dropdown uses similar floating behavior |

---

## Open questions

- Exact Figma variant property names and values need confirmation against the Figma source. The 4 variants are assumed to be Expanded × Selection type combinations.
