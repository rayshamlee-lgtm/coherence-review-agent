---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# ML Body / Shorts Video Answer

## Summary

Shorts Video Answer is an ML Body module that presents short-form vertical video results (TikTok-style) in a horizontally scrollable carousel within the algo mainline. It consists of a Section / title heading followed by a Horizontal Scroller containing Tok video cards.

**Figma Node ID:** `131263:179191` · **Type:** `COMPONENT` · **Group:** Layout  
**Tier:** Section ML Body module · **Variants:** 1 (single component)  
**Dependencies:** Section / title, Horizontal Scroller, Tok video  
**Consumed by:** Section body / algo (Zone A)

> This component is used **only** inside `Section body / algo` Zone A, slotted between standard algorithm results. It is not a standalone section.

---

## Structure

```
ML Body / Shorts Video Answer
├── Section / title — group heading with optional action link
└── Horizontal Scroller — carousel container holding Tok video cards
```

---

## Anatomy

1. **Section / title** — Group heading with optional action link (e.g., "See all")
2. **Body (Horizontal Scroller)** — Swipeable carousel container holding Tok video cards
3. **Section / footer** — Optional footer with navigation action

---

## Visual States

This component has no variant properties. Content is configured by swapping child instances. The structural container itself has no hover, pressed, or focus states — interaction is delegated to child components (Tok video hover-to-preview, Horizontal Scroller arrows).

---

## Usage Rules

- Use a clear heading like "Short videos" or "Trending clips" in the Section / title
- Populate the Horizontal Scroller with 3–8 Tok video cards
- Each Tok video card shows a vertical thumbnail with source attribution and play overlay
- The module occupies the full width of Zone A (Mainline)
- Spacing between the title and scroller uses the standard inner gap (`x-small` / 8px)
- Vertical spacing above and below matches algo result item spacing
- Tok video cards must maintain vertical aspect ratio across breakpoints
- Horizontal Scroller handles overflow with swipe/arrow navigation
- On narrow viewports, fewer cards are visible with swipe to reveal more
- Respect `prefers-reduced-motion` — disable hover-to-preview auto-play when reduced motion is preferred

---

## Do / Don't

### Do
- Provide a clear Section / title heading to identify the short video group
- Use the Horizontal Scroller for swipeable navigation between Tok video cards
- Ensure Tok video thumbnails maintain vertical aspect ratio across breakpoints
- Respect `prefers-reduced-motion` — show static thumbnails instead of hover auto-play when reduced motion is preferred

### Don't
- Use Shorts Video Answer for landscape or standard-ratio videos — those belong in ML body / video answer
- Include more than 6–8 Tok video cards — the carousel becomes unwieldy
- Omit the Section / title — the heading provides critical context within the algo stream
- Hardcode card widths — they must respond to the Horizontal Scroller container

---

## Dark Mode Notes

All text content must meet WCAG AA contrast in both light and dark themes. `prefers-reduced-motion` must be respected — show static thumbnails instead of hover auto-play when reduced motion is preferred.

---

## Open Questions

None.
