---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Basic

**Figma Node ID:** `127584:44715` · **Type:** `COMPONENT_SET` · **Group:** Layout · **Tier:** Base / SDL Atom (structural container) · **Variants:** 3 · **Consumed by:** Higher-level layout components, cards, sections

## Summary

Basic is a foundational layout container that arranges child content in either a horizontal row or vertical column. It exposes a body slot for composing content side-by-side or stacked. This is a low-level building block — it is not typically used directly by consumers but serves as the structural backbone for higher-level components.

This component is appropriate as the inner layout primitive inside a larger component, and for composing custom card or section internals. It is not for page-level layouts (use Section or Card containers), form-specific grouping (use Form), or list-based repeated layouts (use List View).

---

## Variants

| direction | Description |
|-----------|-------------|
| **row - warp** (default) | Children arranged horizontally with wrapping when space runs out |
| **col** | Children stacked vertically (top to bottom) |
| **row - nowarp** | Children arranged horizontally without wrapping (overflow scrolls or clips) |

---

## Anatomy

1. **Body slot** — Primary content area; accepts any component or text via SLOT
2. **Container** — Auto-layout wrapper with configurable direction (row/column) and padding

---

## Visual States

Basic is a structural container with no interactive states. Interaction is delegated entirely to child components.

---

## Usage Rules

- `direction=row - warp` places children side-by-side with wrapping when space runs out.
- `direction=col` stacks children vertically.
- `direction=row - nowarp` places children in a single horizontal line without wrapping.
- Basic is nested inside higher-level components; it is not exposed directly to consumers.
- Slot content is kept semantically related — each Basic instance represents a single logical group.
- Multiple Basic instances can be combined to build grid-like or complex layouts.
- This component does not require its own ARIA role.

---

## Do / Don't

### Do
- Use `direction=row` for side-by-side content pairs (e.g., icon + text, thumbnail + description).
- Use `direction=col` for stacked content (e.g., title above body copy).
- Nest Basic inside higher-level components rather than exposing it directly to page consumers.
- Keep the slot content semantically related — it should form one logical group.

### Don't
- Don't use Basic as a top-level page layout container — use Section or a dedicated layout component.
- Don't leave the slot empty — if no slot content is needed, consider whether Basic is the right component.
- Don't deeply nest multiple Basic containers when a single higher-level component would be clearer.

---

## Dark Mode Notes

Basic carries no color tokens of its own. Dark mode behavior is fully inherited from child component tokens.

---

## Related Components

| Component | Relationship |
|-----------|-------------|
| **Form** | Use instead when wrapping form controls |
| **Transition** | Use instead when content needs enter/exit animation |
| **List View** | Use instead for repeated row items in a list |
| **Section** | Higher-level container that may use Basic internally |
| **Card** | Higher-level container that may use Basic for internal layout |

---

## Open questions

None.
