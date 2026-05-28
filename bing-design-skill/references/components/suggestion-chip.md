---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Suggestion Chip

**Figma Node ID:** `79676:27197` · **Type:** `COMPONENT_SET`  
**Group:** Actions · **Tier:** Dependency · **Variants:** 4  
**Dependencies:** focus outline  
**Consumed by:** Suggestion chip lists, search interfaces, conversational UIs, query refinement areas

---

## Summary

A Suggestion Chip is a compact, pill-shaped clickable element that presents a suggested query or action. Used in suggestion lists to help users refine or explore related topics. Chips are lightweight and designed for quick scanning and selection.

This component is appropriate for presenting suggested queries or follow-up actions, in suggestion chip lists for search refinement, and for conversational UI quick-reply options. It is not appropriate for filtering content (use Filter item), navigation between views (use Tab), primary actions (use Button), or displaying related search terms in a grid (use Related search pill).

---

## Variants / Types

| Property | Values | Default | Description |
|----------|--------|---------|-------------|
| **state** | `default`, `hover`, `pressed`, `focus` | `default` | Interaction state |

### state

| State | Description |
|-------|-------------|
| **default** | Rest state, no interaction |
| **hover** | Background shifts to hover state on pointer enter |
| **pressed** | Active press state |
| **focus** | Keyboard focus ring visible |

---

## Anatomy

1. **Label text** — Suggestion text; consumer-editable (typically 1–5 words)
2. **Container** — Pill-shaped frame with hover/pressed interaction states

---

## Visual States

- **Hover** — background shifts to hover state on pointer enter
- **Pressed** — active press state
- **Focus** — keyboard focus ring visible via `focus outline` dependency; `Enter` activates the chip
- **Click/tap** — triggers an AI communication with the suggested prompt

---

## Usage Rules

- Chip text should be concise — typically a short phrase or query term (1–5 words).
- Use natural language that matches user search intent.
- Display chips in logical groupings or ranked by relevance.
- Arrange chips in a horizontal wrap layout (flow left-to-right; use Horizontal Scroller when overflow).
- Use `xx-small` spacing between chips. Chip groups use `small` spacing from surrounding content.
- Limit to 6–10 visible chips — do not overload a single view.
- Chips must be visually distinct from static text or badges.

### Do
- Keep chip text short and scannable (1–5 words).
- Group related suggestions together.
- Ensure chips are visually distinct from static text or badges.

### Don't
- Use suggestion chips for filtering — use Filter item.
- Overload a single view with too many chips (limit to 6–10 visible).
- Truncate chip text — shorten the suggestion instead.

---

## Dark Mode Notes

Chip text must meet WCAG AA contrast against the chip background in both light and dark themes. The focus ring via `focus outline` must be visible in both modes. Hover and pressed states must be distinguishable from the default state on both light and dark backgrounds.

---

## Related Components

| Component | Relationship |
|-----------|-------------|
| **Related search pill** | Similar pattern but for related search suggestions at the bottom of results |
| **Query suggestion** | Use for autocomplete items in a dropdown list rather than inline chips |
| **Filter item** | Use instead for filtering/faceting controls |
| **Button** | Use instead for primary or prominent actions |
| **Horizontal Scroller** | Wraps chip groups when overflow occurs |

---

## Open questions

None.
