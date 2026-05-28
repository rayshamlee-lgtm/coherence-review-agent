---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# ML Body / Mini Magazine

## Summary

Mini Magazine is an ML Body module that renders a miniature magazine-style card grid inline within the algo mainline. It appears between standard algorithm results in Zone A, providing a compact curated-content break within the search results stream. The component contains a single row instance that exposes a body slot for card content.

**Figma Node ID:** `129439:118802` · **Type:** `COMPONENT_SET` · **Group:** Layout  
**Tier:** Section (ML Body module) · **Variants:** 1 (no variant properties)  
**Dependencies:** Row instance (body slot)  
**Consumed by:** Section body / algo — Zone A (Mainline)

> This component is used **only** inside `Section body / algo` Zone A, slotted between standard algorithm results. It is not a standalone section.

---

## Structure

```
ML Body / Mini Magazine
└── Row [INSTANCE]
    └── body [SLOT] — card grid content
```

---

## Anatomy

1. **Header** — Section / title or basic algo header (depending on usage context)
2. **Body** — Content area (card grid or slot content) via the body slot
3. **Section / footer** — Optional footer with expand/collapse or navigation action

---

## Visual States

This component has no variant properties. Variant differentiation comes from the cards placed inside the body slot. The structural container itself has no hover, pressed, or focus states — interaction is delegated to child components.

---

## Usage Rules

- Populate the body slot with a small set of cards (typically 2–4) arranged in a compact grid
- Cards must be contextually relevant to the surrounding algo results
- Keep the grid small — this is a "mini" magazine, not a full section-width layout
- The module occupies the full width of Zone A (Mainline)
- Spacing between cards uses the standard inner gap token (`x-small` / 8px)
- Vertical spacing above and below the module matches algo result item spacing
- The module reflows with Zone A — at column=4 and column=2, Zone A is full-width and the mini magazine stretches accordingly
- Cards within the grid should reflow or reduce count at narrower breakpoints
- Test at all 4 algo column variants (12, 8, 4, 2)

---

## Do / Don't

### Do
- Use Mini Magazine to introduce visual variety within a long algo result stream
- Keep the card count small (2–4 cards) — this is a miniature layout, not a full magazine section
- Ensure cards in the grid are contextually related to the surrounding search results
- Test the module within the full algo body context — verify spacing with adjacent results above and below

### Don't
- Use Mini Magazine as a standalone section body — it is an ML Body module for Zone A only
- Overload the grid with too many cards — keep it compact
- Use this for unrelated promotional content that disrupts the user's search flow
- Hardcode card widths — cards must respond to the Zone A container width

---

## Dark Mode Notes

All card content within the mini magazine must meet WCAG AA contrast in both light and dark themes. Card surfaces follow the standard card background tokens (`background-card-on-primary-default-`).

---

## Open Questions

None.
