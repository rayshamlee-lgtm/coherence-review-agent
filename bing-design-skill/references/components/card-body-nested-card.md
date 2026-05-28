---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Card Body / Nested Card

**Figma Node ID:** `18783:984` · **Type:** `COMPONENT_SET` · **Group:** Card body · **Tier:** Card / Body Template · **Variants:** 16

## Summary

The Nested Card is a reusable card-within-card component for embedding interactive content inside parent cards. It supports theme variants (accent / nonAccent), a selection state, and 4 interaction states. It is used as a shared module across different card scenarios, such as restaurant listings or product items embedded inside an answer card.

This component is appropriate for embedding interactive sub-cards inside parent cards and for any card-in-card pattern requiring hover/press/select states. It is not for top-level standalone cards (use Answer card or Image card directly) or non-interactive content (use a plain frame or Basic component).

---

## Variants

| Property | Values | Default |
|----------|--------|---------|
| **state** | `rest`, `hover`, `pressed`, `focused` | `rest` |
| **Theme** | `accent`, `nonAccent` | `accent` |
| **selected** | `true`, `false` | `false` |

Total: 4 states × 2 themes × 2 selected = **16 variants**

---

## Anatomy

1. **Container** — Card surface with theme-dependent background and border
2. **Body** — Content slot for nested card content (image, text, metadata)

---

## Visual States

| State | Theme | Selected | Description |
|-------|-------|----------|-------------|
| `rest` | accent | false | Default accent appearance |
| `rest` | nonAccent | false | Default nonAccent appearance |
| `hover` | accent/nonAccent | true/false | Mouse-over with elevation change |
| `pressed` | accent/nonAccent | true/false | Active/click state |
| `focused` | accent/nonAccent | true/false | Keyboard focus ring |

The `accent` theme applies brand tint; `nonAccent` uses standard card surface.

---

## Usage Rules

- This component is placed inside an answer card body slot as a sub-card module.
- It is used as a repeating item in list-style answer layouts (e.g., restaurant or product listings).
- All 4 interaction states are handled consistently (rest, hover, pressed, focused).
- The `selected` state is shown clearly when cards are selectable; it requires a clear selection mechanism.
- Themes are not mixed within the same parent card's nested cards.
- Nesting depth is limited to one level — card-in-card-in-card is not permitted.

---

## Do / Don't

### Do
- Handle all 4 interaction states consistently.
- Use the accent theme for brand-emphasized nested content.
- Show the selected state clearly when cards are selectable.

### Don't
- Don't nest more than one level deep — avoid card-in-card-in-card.
- Don't use the selected state without a clear selection mechanism.
- Don't mix themes within the same parent card's nested cards.

---

## Dark Mode Notes

The `accent` and `nonAccent` themes each resolve to distinct background and border tokens. Both themes must meet WCAG AA contrast in light and dark modes. No explicit dark-mode variant is documented; token-based color application handles theme switching.

---

## Related Components

| Component | Relationship |
|-----------|-------------|
| **Answer card** | Typical parent container |
| **Attachment card** | May contain nested cards |
| **Expansion card** | May use nested card in expanded content |
| **Splits card** | Alternative grid-based layout |

---

## Open questions

None.
