---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Divider

## Summary

Divider is a thin horizontal line used to visually separate content sections within cards, panels, and page regions. It supports a 10-step spacing scale and 3 color intensities, providing precise control over visual weight and breathing room around content boundaries in ACF SERP layouts.

**Figma Node ID:** `127925:26168` · **Type:** `COMPONENT_SET` · **Group:** Display  
**Tier:** Base / SDL Atom · **Variants:** 30 (10 spacing × 3 color) · **Consumed by:** Cards, Sections, Lists, Flyouts, Settings panels

---

## Variants / Types

| Property | Values | Default | Description |
|----------|--------|---------|-------------|
| **spacing** | `0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9` | `0` | Vertical space around the divider line (maps to spacing token scale) |
| **color** | `default`, `subtle`, `strong` | `default` | Visual weight/prominence of the divider line |

### Spacing reference

| Spacing | Use case |
|---------|----------|
| **0** | No extra space; line sits flush between elements. Dense layouts, tight card interiors. |
| **1–2** | Minimal breathing room. Between tightly related items (e.g., metadata rows). |
| **3–4** | Moderate spacing. Standard within-card separation. |
| **5–6** | Generous spacing. Between distinct content blocks within a section. |
| **7–9** | Large spacing. Major content group boundaries; approaches section-level separation. |

### Color reference

| Color | Weight | Use case |
|-------|--------|----------|
| **default** | Medium | General-purpose content separation; most common choice |
| **subtle** | Low | Within-card separation where a softer break is needed; avoids visual heaviness in dense layouts |
| **strong** | High | Major section breaks; use sparingly to avoid visual noise |

---

## Anatomy

1. **Divider line** — Single horizontal rule; uses token-bound stroke color and 1px thickness

---

## Visual States

- Divider has no interactive states — it is a purely structural/visual element
- The `spacing` property controls vertical padding above and below the line
- The `color` property controls line prominence via token-bound stroke color

---

## Usage Rules

- Dividers carry no text content — they are purely structural/visual elements
- The divider line itself is 1px in height (controlled by the component, not the spacing property)
- The `spacing` prop controls the vertical padding above and below the divider line
- `subtle` color is preferred for within-card separation to keep card interiors clean
- `default` color is the standard choice for most contexts
- `strong` color is reserved for major section breaks where a prominent visual boundary is needed
- Dividers should span the full width of their container
- On mobile, consider reducing spacing by 1–2 steps in dense card layouts

---

## Do / Don't

### Do
- Use `subtle` for within-card separation to maintain a clean, lightweight interior
- Use `strong` only for major section breaks where a clear, prominent boundary is needed
- Let whitespace do the work first — add a divider only when spacing alone is insufficient
- Maintain consistent spacing values across similar content groups for visual rhythm
- Use spacing `0` when the divider line alone (without padding) provides the needed separation

### Don't
- Overuse dividers — whitespace alone often suffices
- Use dividers inside dense lists where they add visual clutter instead of clarity
- Use `strong` dividers between every item — it creates visual heaviness and breaks scanning flow
- Mix different color dividers within the same card or section
- Use dividers as decorative borders — they serve a structural separation purpose
- Stack dividers without content between them

---

## Dark Mode Notes

All three color variants (default, subtle, strong) function correctly in both light and dark themes. The divider line color meets WCAG AA non-text contrast requirements (3:1 ratio against adjacent backgrounds) for `default` and `strong` variants. The `subtle` variant is decorative — structural meaning must be conveyed through other means (spacing, headings).

---

## Open Questions

None.
