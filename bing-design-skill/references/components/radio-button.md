---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Radio Button

## Summary

Radio Button allows users to select exactly one option from a mutually exclusive group. Radio buttons always appear in groups of two or more — a single radio button has no meaningful use. The selection is immediate and visually clear.

**Figma Node ID:** `109427:128181` · **Type:** `COMPONENT_SET` · **Group:** Data Entry  
**Tier:** Base / Foundational Atom · **Variants:** 8 · **Consumed by:** Settings panels, forms, option groups, preference selectors

---

## Variants / Types

| Property | Values | Default | Description |
|----------|--------|---------|-------------|
| **state** | `rest`, `hover`, `pressed`, `focus` | `rest` | Interaction state |
| **disabled** | `false`, `true` | `false` | Whether the radio button is non-interactive |
| **checked** | `false`, `true` | `false` | Whether the radio button is selected |

### State reference

| State | Behavior |
|-------|----------|
| `Default` | Unchecked, idle |
| `Hover` | Pointer over the radio button |
| `Checked` | Selected — inner fill indicator visible |
| `Focus` | Keyboard focused — focus ring visible via `focus outline` |

---

## Anatomy

1. **Radio circle** — Circular input indicator; shows empty or filled dot when selected
2. **Selected dot** — Inner filled circle visible in selected state
3. **Label** — Descriptive text next to the radio button
4. **Focus ring** — Visible outline on keyboard focus (uses focus outline dependency)

---

## Visual States

- **Default / rest:** Empty circle, no fill indicator
- **Hover:** Visual highlight on the circle indicates interactivity
- **Checked:** Inner filled dot visible inside the outer circle
- **Focus:** Focus ring visible around the control
- **Disabled:** Reduced opacity; cursor indicates not-allowed; all interaction suppressed

---

## Usage Rules

- Radio buttons always appear in groups of two or more — a single radio button is not meaningful in isolation
- Each radio button label should be clear, concise, and mutually exclusive
- Options should be presented in a logical order (alphabetical, frequency, or progressive)
- A default option should be pre-selected when one is clearly recommended
- Arrange radio buttons vertically for easy scanning — horizontal arrangement is acceptable only for 2–3 short options
- Use `x-small` spacing between radio items vertically; `medium` spacing horizontally
- Group label sits above the radio group with `small` spacing

---

## Do / Don't

### Do
- Always use radio buttons in groups of 2 or more
- Pre-select a sensible default when applicable
- Make labels mutually exclusive and unambiguous

### Don't
- Use a single radio button in isolation — use Toggle or Checkbox instead
- Use radio buttons for multi-select — use Checkbox
- Use disabled radio buttons without explaining why they're unavailable
- Use radio buttons for selecting from long lists (5+ options) — consider Dropdown instead

---

## Dark Mode Notes

The focus ring (via `focus outline` dependency) must be visible in both light and dark themes to meet WCAG AA requirements. No radio-button-specific dark mode variant is documented.

---

## Open Questions

None.
