---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Tooltip

## Summary

Tooltip displays contextual information in a small popup when the user hovers over or focuses on a trigger element. It supports four pointing directions (Top, Bottom, Left, Right) and provides supplementary descriptions, labels, or hints without cluttering the interface. Tooltip content is non-essential by design — it should never contain critical information.

**Figma Node ID:** `26665:46635` · **Type:** `COMPONENT_SET` · **Group:** Overlay  
**Tier:** Base / Foundational Atom · **Variants:** 8 · **Consumed by:** Buttons, icons, controls, truncated labels, data visualizations

---

## Variants / Types

| Property | Values | Default | Description |
|----------|--------|---------|-------------|
| **state** | `rest`, `hover` | `rest` | Visibility state — rest (hidden/ready) or hover (visible) |
| **Instance** | SLOT | Info icon | Icon instance swap — controls which icon glyph triggers the tooltip |
| **Direction** | `Top`, `bottom`, `Left`, `Right` | `Top` | Which direction the tooltip points relative to its trigger |

### Direction reference

| Direction | Tooltip position | Arrow points |
|-----------|-----------------|-------------|
| `Top` | Above the trigger | Down toward trigger |
| `bottom` | Below the trigger | Up toward trigger |
| `Left` | Left of the trigger | Right toward trigger |
| `Right` | Right of the trigger | Left toward trigger |

---

## Anatomy

1. **Trigger (Instance)** — Any atom-level component (Icon, Button, etc.) that triggers the tooltip on hover/focus
2. **Tooltip bubble** — Floating text container with directional beak pointing to the trigger

---

## Visual States

- **rest:** Tooltip is hidden; only the trigger element is visible
- **hover:** Tooltip bubble is visible; appears with slight entrance delay (typically 300ms) to avoid flicker on quick mouse movement
- Tooltip bubble appears on both pointer hover and keyboard focus; disappears on pointer leave or blur
- `Escape` key dismisses the tooltip

---

## Usage Rules

- Tooltip text should be brief — 1–2 short sentences maximum
- Use sentence case; no period for single phrases
- Tooltip content should supplement, not duplicate, visible UI text
- Choose direction based on available space — avoid tooltips that extend beyond the viewport
- Default to `Top` direction; fall back to `bottom`, `Left`, or `Right` when space is constrained
- The tooltip bubble appears near its trigger with 4px gap between the two elements
- Tooltip must appear on both hover and keyboard focus — it must not be hover-only

---

## Do / Don't

### Do
- Use tooltips to label icon-only controls (pair with `aria-label` on the control)
- Default to `Top` direction and adjust only when space requires it
- Keep content short and scannable — ideally under 2 lines

### Don't
- Put interactive elements (links, buttons) inside tooltips — use a Popover or Flyout
- Use tooltips for essential information — content is hidden until hover and inaccessible on touch devices
- Show tooltips on elements that already have visible, descriptive labels
- Overload tooltips with long explanations, paragraphs, or lists
- Use tooltips for form validation messages — use inline error states instead

---

## Dark Mode Notes

Tooltip content must meet WCAG AA contrast requirements against the tooltip background in both light and dark themes. No tooltip-specific dark mode variant is documented — color is controlled by token bindings.

---

## Open Questions

None.
