---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Toggle

## Summary

Toggle is a binary switch that lets users turn a setting or feature on or off. It provides immediate visual feedback of its checked state and is the standard control for preferences, feature toggles, and any two-state option where the change takes effect immediately — without requiring a separate confirmation step.

**Figma Node ID:** `41171:63683` · **Type:** `COMPONENT_SET` · **Group:** Actions · **Variants:** 10

**Dependencies:** focus outline

**Consumed by:** Settings panels, preference controls, feature flags, card options

---

## Variants / Types

### State × Checked matrix

| State | Checked: False | Checked: True |
|-------|----------------|---------------|
| `rest` | Off, idle | On, idle |
| `hover` | Off, pointer over | On, pointer over |
| `pressed` | Off, being clicked | On, being clicked |
| `disabled` | Off, non-interactive | On, non-interactive |
| `focus` | Off, keyboard focused | On, keyboard focused |

### Label

| Value | Behavior |
|-------|----------|
| `True` (default) | Descriptive text label is shown adjacent to the switch |
| `False` | Label is hidden; only appropriate when surrounding context makes purpose unambiguous |

---

## Visual States

### Checked

| Checked | Track | Thumb | Semantics |
|---------|-------|-------|-----------|
| `False` (off) | Neutral/muted fill | Positioned left | Feature/setting is inactive |
| `True` (on) | Accent/brand fill | Positioned right | Feature/setting is active |

### Disabled

Disabled toggles retain their checked/unchecked visual to communicate current value. All pointer interaction is suppressed. A tooltip or contextual explanation for the disabled state is required.

---

## Anatomy

1. **Label** — Descriptive text for the toggle; uses Label component; consumer-editable.
2. **Track** — Pill-shaped background that changes color based on on/off state.
3. **Thumb** — Circular slider knob that moves left (off) or right (on).

---

## Usage Rules

- Toggle is used for settings that take effect immediately — no "Save" or "Submit" step.
- When a change requires a separate submission step, Checkbox must be used instead.
- Label text must describe the setting being controlled, not the action ("Dark mode", not "Turn on dark mode").
- Positive phrasing is required — "on" must equal the enabled state ("Show previews", not "Hide previews").
- `label=False` is only appropriate when surrounding context makes the toggle's purpose unambiguous.
- Touch targets must meet a 48px minimum on mobile.
- Toggle must not be used for multi-option selection (use Checkbox) or mutually exclusive options (use Radio button).
- Toggle must not be used to trigger one-time actions (use Button).
- Consistent placement within a settings group is required (e.g., right-aligned across all rows).

---

## Do / Don't

### Do
- Use Toggle for settings that take immediate effect.
- Label toggles with positive phrasing ("Show previews", not "Hide previews").
- Retain the checked/unchecked visual in disabled state so users understand current value.
- Provide a visible label whenever the toggle's purpose is not obvious from context.
- Use consistent placement across all toggle rows in a settings panel.
- Pair disabled toggles with an explanation (tooltip or helper text) of why they are unavailable.

### Don't
- Don't use Toggle for multi-option selection — use Checkbox.
- Don't use Toggle within a form that has a Submit or Save action — use Checkbox.
- Don't use negative label phrasing.
- Don't hide the label unless surrounding context makes the purpose unambiguous.
- Don't use Toggle for navigation or triggering actions — use Button or Tab.
- Don't group toggles as mutually exclusive options — use Radio button instead.

---

## Dark Mode Notes

- Both checked and unchecked tracks must meet WCAG AA contrast against the background in both themes.
- The thumb must be visually distinct from the track in all states.
- Disabled state must remain perceivable; reduced opacity is acceptable if contrast remains sufficient.
- All toggle variants meet WCAG 2.1 AA contrast requirements in both light and dark themes via design tokens.

---

## Open Questions

None.
