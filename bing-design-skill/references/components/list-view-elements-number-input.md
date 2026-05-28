---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# List View Elements / Number Input

**Figma Node ID:** `52608:102029` · **Type:** `COMPONENT_SET`  
**Group:** Layout · **Tier:** Base / Foundational Atom · **Variants:** 3  
**Dependencies:** none  
**Consumed by:** List View body slot (travel/booking contexts, quantity selection)

---

## Summary

Number input is a pre-built list row template for numeric quantity adjustment. It provides a stepper UI — decrement (−) / current value / increment (+) — in a consistent row format that slots directly into List View's body. It is used when users need to adjust a bounded numeric value within a list context (e.g., passenger count, item quantity, filter limits).

This component is appropriate as a row item inside List View when users need to adjust a numeric quantity, and for bounded discrete numeric selections within a defined min/max range. It is not appropriate as a standalone component outside of a List View, for free-form numeric text entry (use the Field component instead), or when the number range is large (e.g., 0–1000) — steppers are for small bounded ranges.

---

## Variants / Types

| Property | Type | Default | Options |
|----------|------|---------|---------|
| **Number** | Variant | `0` | `0`, `1`, `2` |

The `Number` property represents display variants (0 = minimum, 1 = mid, 2 = maximum/2+). Consumer logic controls the actual value and enables/disables the stepper buttons.

### Number

| Variant | Description |
|---------|-------------|
| **0** | Minimum state — decrement button is disabled |
| **1** | Mid-value state — both buttons enabled |
| **2** | Maximum / "2+" state — increment button may be disabled |

---

## Anatomy

1. **Decrement button (−)** — Decreases the value by one step; disabled at minimum value
2. **Value display** — Current numeric value shown between the stepper buttons
3. **Increment button (+)** — Increases the value by one step; disabled at maximum value

---

## Visual States

- **Hover** — subtle highlight on the active stepper button
- **Disabled buttons** — non-interactive with reduced opacity (− at minimum, + at maximum)

Value display updates immediately on each increment/decrement interaction.

---

## Usage Rules

- The current value is always shown clearly between the − and + buttons.
- The − button is disabled at minimum value; the + button is disabled at maximum value.
- Number input provides the display only — increment/decrement logic is wired by the consumer.
- Use for small bounded ranges (typically 0–10).
- Pair with a row label so the context is clear (e.g., "Adults (26+ yrs)").
- Always place inside a List View body slot.

### Do
- Use for bounded, discrete numeric selections (e.g., 0–10 passengers).
- Disable the − button at minimum and + at maximum.
- Label the row clearly so users understand what the number refers to.

### Don't
- Use for open-ended numeric input — use Field instead.
- Place outside of a List View body slot.
- Allow the value to exceed defined min/max without disabling the appropriate button.

---

## Dark Mode Notes

All interactive states must meet WCAG AA contrast in both light and dark themes. Disabled buttons use reduced opacity tokens that must remain distinguishable from enabled buttons. Value display text must maintain AA contrast against the row background.

---

## Related Components

| Component | Relationship |
|-----------|-------------|
| **List View** | Parent container — Number input rows go inside the List View body slot |
| **Field** | Alternative — for free-form numeric text input |
| **List view elements / Option** | Sibling — for selection rows |
| **List view elements / Menu item** | Sibling — for action rows |

---

## Open questions

None.
