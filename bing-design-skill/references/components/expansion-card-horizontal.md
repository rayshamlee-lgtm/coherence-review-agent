---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Expansion Card / Horizontal Attachment

**Figma Node ID:** `72261:110796` · **Type:** `COMPONENT_SET` · **Group:** Cards · **Tier:** Sub-component / Card Atom · **Variants:** 10 · **Dependencies:** focus outline · **Consumed by:** Horizontal Scroller, media-rich answer sections, product/entity cards

## Summary

The Horizontal Attachment variant of the Expansion Card pairs a side-mounted media element (thumbnail, image, or icon) with text content. The media sits to the left or right of the card body, making it appropriate for content where a visual preview accompanies expandable detail. A `scale` property controls whether the media maintains a fixed 16:9 aspect ratio or sizes freely.

This component is appropriate when expandable content benefits from a visual preview alongside text, for horizontal layouts inside scrollers where media context aids scanning, and when a persistent `selected` state is needed. It is not for text-only expandable content (use Expansion Card / Default), when media should appear above/below the text (use Vertical Attachment), or when the image is the primary content (use Expansion Card / Image).

---

## Variants

| Property | Values | Default |
|----------|--------|---------|
| **State** | `rest`, `hover`, `pressed`, `selected`, `focus` | `rest` |
| **scale** | `Fixed 16:9`, `free` | `Fixed 16:9` |

Total: 5 states × 2 scale options = **10 variants**

### State

| State | Visual Treatment |
|-------|-----------------|
| **rest** | Neutral card surface with media attachment |
| **hover** | Card elevates with shadow; body expands vertically to reveal truncated content, overlaying content below while container keeps original height |
| **pressed** | Darker fill or reduced elevation for tactile feedback |
| **selected** | Accent border or tinted surface (persistent, not transient) |
| **focus** | Visible focus outline wrapping both media and text regions |

The `selected` state must be visually distinct from `hover` — it uses a persistent accent (border or surface tint) rather than a transient hover effect.

### Scale

| Scale | Behavior | Use case |
|-------|----------|----------|
| **Fixed 16:9** | Media maintains 16:9 aspect ratio regardless of card size | Video thumbnails, landscape images, consistent grid alignment |
| **free** | Media sizes freely based on content or container | Portraits, icons, square images, or layouts where uniform ratio isn't needed |

---

## Anatomy

1. **Start media** — Image or Video card instance with thumbnail, badge, and play icon
2. **Content area** — Title, metadata, and optional subtitle

---

## Expansion Behavior

- Expansion is Y-direction only — the card overlays to cover content below.
- The card container maintains its original height in the layout flow.
- Truncated title or metadata: height becomes dynamic to show the truncated content.
- Maximum of 5 extra lines on expansion is suggested.
- On expansion: 8px padding, 16px border-radius on the elevated container, background color, elevation-3.

---

## Usage Rules

- Media attachment is meaningful — decorative-only images are avoided.
- Text uses `body3-strong` for the card title; `body3` for supporting text.
- Text is kept concise to prevent the text region from dominating the horizontal layout.
- Spacing between media attachment and text region: `-spacing-x-small`.
- Media and text are vertically center-aligned when content is short; top-aligned when text wraps to multiple lines.
- Inside Horizontal Scroller, card widths are consistent for visual rhythm.
- Touch targets meet 48px minimum.
- `Fixed 16:9` works best at wider card widths; `free` is used if the card becomes too narrow.

---

## Do / Don't

### Do
- Use `Fixed 16:9` for video thumbnails and landscape imagery to maintain consistent visual rhythm.
- Use the `selected` state to indicate a persistent user choice — pair with a clear accent border or surface tint.
- Ensure hover, pressed, and selected states are visually distinct from each other.
- Keep the media attachment relevant — it should preview or contextualize the expandable content.

### Don't
- Don't use `Fixed 16:9` with portrait or square source images — it will crop awkwardly; use `free` instead.
- Don't rely solely on color to distinguish `selected` from `rest` — combine color with border or elevation.
- Don't let the text region grow unbounded — truncate or clamp to maintain horizontal balance.
- Don't use this variant for text-only content — the empty media slot wastes space.

---

## Dark Mode Notes

Card surface, text, and `selected` accent must all meet WCAG AA contrast in both light and dark themes. Focus outline must be visible against the card surface and page background in both themes.

---

## Related Components

| Component | Relationship |
|-----------|-------------|
| **Expansion Card / Default** | Use when no media attachment is needed |
| **Expansion Card / Vertical Attachment** | Use when media should appear above/below text |
| **Expansion Card / Image** | Use when image content is dominant |
| **Horizontal Scroller** | Common parent — cards are typically arranged in a scrollable row |
| **Button** | May appear inside expanded content or as a CTA |

---

## Open questions

None.
