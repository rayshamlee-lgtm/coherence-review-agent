---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# ML Body / Images Answer

## Summary

Images Answer is an ML Body module that presents image results inline within the algo mainline. It combines a Section / title (with navigation chevron), a row of Query suggestion pills for refining the image search, and a two-row image grid displayed inside a Horizontal Scroller. A "See all" action button links to the full image results page. This module appears between standard algorithm results in Zone A.

**Figma Node ID:** `132336:64741` · **Type:** `FRAME` · **Group:** Layout  
**Tier:** Section (ML Body module) · **Variants:** 1 (no variant properties)  
**Dependencies:** Section / title, Horizontal Scroller, Image card, Query suggestion, Button, Divider  
**Consumed by:** Section body / algo — Zone A (Mainline)

> This component is used **only** inside `Section body / algo` Zone A, slotted between standard algorithm results. It is not a standalone section.

---

## Structure

```
ML Body / Images Answer
├── Section / title — "Images of {query}" heading with chevron
├── Query suggestion row — horizontal pill chips for query refinement
├── Horizontal Scroller
│   ├── Row 1 — Image cards (4+ visible, scrollable)
│   └── Row 2 — Image cards (4+ visible, scrollable)
├── Divider
└── Button — "See all" action with chevron icon
```

---

## Anatomy

1. **Section / title** — "Images of {query}" heading with navigation action
2. **Query suggestion pills** — Horizontal row of refinement chips with optional leading favicons
3. **Image grid** — Two-row layout of Image cards inside a Horizontal Scroller
4. **Divider** — Separator between grid and footer action
5. **See all button** — Ghost button with chevron linking to full image results

---

## Visual States

This component has no variant properties. Visual variation comes from image content and query suggestion labels. Individual child components (Image cards, Query suggestion pills, Button) carry their own interactive states.

---

## Usage Rules

- The Section / title must display "Images of {query}" with a navigation chevron to the full images page
- Query suggestion pills provide query refinement — each pill shows a related search term with optional favicon
- Image cards must display relevant, high-quality thumbnails with title text below
- The "See all" button provides a clear exit to the full image search experience
- The image grid is limited to 2 rows — this is an inline preview, not a full gallery
- The module occupies the full width of Zone A (Mainline)
- Query suggestion pills are horizontally scrollable if they exceed available width
- Row 1 images may be slightly larger than Row 2 to create visual hierarchy
- At narrower breakpoints (column=4 and column=2), Zone A is full-width; image cards resize proportionally within the scroller
- Test at all 4 algo column variants (12, 8, 4, 2)

---

## Do / Don't

### Do
- Use Images Answer when the query has clear image/visual intent
- Provide relevant query suggestion pills to help users refine their image search
- Ensure image thumbnails maintain aspect ratio with proper corner radius
- Provide the "See all" action so users can access the full image results
- Display a minimum of 4 images per row — the grid should feel populated

### Don't
- Use Images Answer as a standalone image section — it is an ML Body module for Zone A only
- Display fewer than 4 images per row
- Omit the Section / title — the heading provides critical context within the algo stream
- Hardcode image card sizes — they must respond to the Horizontal Scroller and Zone A width
- Use low-quality or irrelevant thumbnails

---

## Dark Mode Notes

All text (image titles, pill labels, "See all") must meet WCAG AA contrast in both light and dark themes. Query suggestion pill backgrounds must maintain contrast against the module background.

---

## Open Questions

None.
