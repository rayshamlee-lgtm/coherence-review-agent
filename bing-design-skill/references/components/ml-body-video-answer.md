---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# ML Body / Video Answer

## Summary

Video Answer is an ML Body module that presents video results inline within the algo mainline. It combines a Section / title (for labeling the video group) with a List View-based body (for laying out video cards). This module appears between standard algorithm results in Zone A, giving video content a distinct, self-contained presentation within the search results stream.

**Figma Node ID:** `130726:259530` · **Type:** `COMPONENT_SET` · **Group:** Layout  
**Tier:** Section (ML Body module) · **Variants:** 1 (no variant properties)  
**Dependencies:** Section / title, List View  
**Consumed by:** Section body / algo — Zone A (Mainline)

> This component is used **only** inside `Section body / algo` Zone A, slotted between standard algorithm results. It is not a standalone section.

---

## Structure

```
ML Body / Video Answer
├── Section / title — video group heading
└── List View
    └── body [SLOT] — video card content
```

---

## Anatomy

1. **Section / title** — Group heading for the video results
2. **Body** — List View or content area containing video cards
3. **Section / footer** — Optional footer with navigation or expand action

---

## Visual States

This component has no variant properties. Variant differentiation comes from the video cards placed inside. Individual child components carry their own interactive states. The structural container itself has no hover, pressed, or focus states.

---

## Usage Rules

- The Section / title instance must display a clear label such as "Videos" or "Video results"
- The List View body slot is populated with video cards (typically Card / Video)
- Keep the video item count to 3–6 items — this is an inline module, not a dedicated video page
- The module occupies the full width of Zone A (Mainline)
- Spacing between the title and the list body uses the standard inner gap (`x-small` / 8px)
- List View gap should be set to `2` (8px) for standard list density or `4` (16px) for richer video cards
- The module reflows with Zone A — at column=4 and column=2, Zone A is full-width
- Video cards within the List View adapt to the available width (e.g., switching from side-by-side thumbnails to stacked layout)
- Test at all 4 algo column variants (12, 8, 4, 2)

---

## Do / Don't

### Do
- Use Video Answer when the search query has strong video intent
- Provide a clear Section / title heading to help users identify the video group
- Ensure video thumbnails maintain aspect ratio across breakpoints

### Don't
- Use Video Answer as a standalone section — it is an ML Body module for Zone A only
- Include too many video items — 3–6 is typical; more warrants a dedicated section
- Omit the Section / title — the heading provides critical context within the algo stream
- Hardcode video card widths — they must respond to the Zone A container width

---

## Dark Mode Notes

All text content (video titles, metadata) must meet WCAG AA contrast in both light and dark themes. Video thumbnail overlays (play icons, duration badges) must maintain sufficient contrast against the thumbnail image — use `alwaysDark` style for elements rendered on top of video thumbnails.

---

## Open Questions

None.
