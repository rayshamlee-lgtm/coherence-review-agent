---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Form

## Summary

Form is a structural container that wraps form controls with consistent layout and spacing. It provides a single body slot into which input fields, checkboxes, radio buttons, selects, and other form elements are placed. As a single-variant component, it keeps form composition simple and predictable.

**Figma Node ID:** `127588:46193` · **Type:** `COMPONENT` · **Group:** Data Entry  
**Tier:** Base / SDL Atom (structural container) · **Variants:** 1 (single component) · **Consumed by:** Any component containing form controls

---

## Variants / Types

Form is a single non-variant container. There are no variant properties — all form layout behavior is handled internally via the body slot.

| Property | Type | Values | Default | Description |
|----------|------|--------|---------|-------------|
| **body** | SLOT | — | — | Accepts form control components (inputs, checkboxes, radio buttons, etc.) |

---

## Anatomy

1. **Body slot** — Primary content area; accepts Field, Checkbox, Radio button, Dropdown, and other form controls
2. **Container** — Vertical auto-layout wrapper with consistent field spacing

---

## Visual States

Form itself has no visual interaction states. It is a non-interactive structural container. All interactive states are provided by the child controls placed within the body slot.

---

## Usage Rules

- Place form controls inside the `body` slot in logical order (label → input → validation message)
- Use `small` spacing between inline items
- Stack Field components vertically for multi-field forms
- Place Checkbox for consent/agreement items below the input fields
- End with a submit Button (full-width recommended) as the last element in the form
- Form provides consistent vertical spacing between child elements — default inner gap is `x-small` (8px)
- Nest inside a Card or Section when the form is part of a larger experience
- Group related fields together; avoid mixing unrelated fields in a single Form container
- Use required indicators (`*`) on mandatory Field labels

---

## Do / Don't

### Do
- Use Form as the wrapper for any group of interactive form controls
- Maintain a logical top-to-bottom field order matching the user's mental model
- Pair with Button (`submit: true`) for form submission actions

### Don't
- Use Form for non-form content (text blocks, images, cards)
- Nest Form inside another Form — the HTML spec forbids nested `<form>` elements
- Omit Form when rendering form controls — it provides essential layout and semantic structure
- Use Form for a single standalone input with no surrounding form context

---

## Dark Mode Notes

No Form-specific dark mode behavior. Accessibility and visual treatment are inherited from child controls placed within the body slot.

---

## Open Questions

None.
