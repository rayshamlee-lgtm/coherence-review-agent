---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Transition

**Figma Node ID:** `127612:121410` · **Type:** `COMPONENT` · **Group:** Layout · **Tier:** Base / SDL Atom (structural / behavioral) · **Variants:** 1 (single component) · **Consumed by:** Components requiring enter/exit animations, content switching, streaming states

## Summary

Transition is a behavioral wrapper that applies enter/exit animation to its child content. It provides a single body slot — any component placed inside receives transition behavior (fade, slide, or other animation) when it mounts, unmounts, or switches state. This is the standard mechanism for animated content changes across the ACF system.

This component is appropriate for animating content entering or leaving the viewport (expanding a section, revealing an answer), for content-switching transitions (tab panels, accordion content, carousel slides), and for smoothing streaming/loading states (progressive content reveal). It is not for static content that never changes visibility, for hover/pressed micro-interactions on controls (handled by the control's own state tokens), or as a layout container (use Basic or Section for structure).

---

## Variants

This component has a single, non-variant form with no variant properties. Animation parameters are controlled at the SDL / runtime level.

---

## Anatomy

1. **Animation container** — Wrapper that applies the enter/exit animation (fade, slide, scale)
2. **Content slot** — Inner area (Figma SLOT); the content being transitioned is placed here

---

## Visual States

Transition is invisible in Figma's static view — it represents runtime behavior. The animation container has no interactive states of its own; all states are delegated to child components.

---

## Usage Rules

- The content that needs animation is wrapped inside Transition's `body` slot.
- Transition is nested inside Section, Card, or any parent; it adds behavior, not layout.
- CSS-based transitions (opacity, transform) are preferred for smooth 60 fps animation.
- Transition is scoped to the smallest content unit that changes — entire sections are not wrapped unnecessarily.
- Multiple Transition wrappers on the same content are not stacked — one wrapper is sufficient.
- Content remains accessible before and after the transition completes — no content is hidden from screen readers mid-animation.
- Animation alone does not convey state changes — visible UI cues (icons, text) are paired alongside.

---

## Do / Don't

### Do
- Use Transition for content that appears/disappears dynamically (accordions, panels, streaming answers).
- Scope Transition to the smallest content unit that changes.
- Ensure content is accessible before and after the transition completes.

### Don't
- Don't use Transition on permanently visible, static content — it adds overhead with no benefit.
- Don't rely on animation alone to convey state changes — pair with visible UI cues.
- Don't stack multiple Transition wrappers on the same content.

---

## Dark Mode Notes

Transition carries no color tokens of its own. Dark mode behavior is fully inherited from child component tokens.

---

## Related Components

| Component | Relationship |
|-----------|-------------|
| **Basic** | Use for structural layout; Transition adds behavior, not structure |
| **Form** | Can be wrapped in Transition for animated form reveal/dismiss |
| **List View** | Individual list items can use Transition for staggered entry animations |
| **Section** | Sections may use Transition internally for expandable content areas |

---

## Open questions

None.
