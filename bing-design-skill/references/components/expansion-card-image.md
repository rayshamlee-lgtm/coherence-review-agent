---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Expansion Card / Image

**Figma Node ID:** `64799:113918` · **Type:** `COMPONENT_SET` · **Group:** Cards · **Tier:** Sub-component / Card Atom · **Variants:** 5 · **Dependencies:** focus outline · **Consumed by:** Horizontal Scroller, image gallery sections, visual-first answer layouts

## Summary

The Image variant of the Expansion Card is dominated by image content — the visual is the primary element, with minimal or overlay text. It is designed for image-rich expandable experiences where the photo, illustration, or graphic is the main hook. Interaction reveals additional detail, metadata, or actions beneath or over the image.

This component is appropriate when the image is the content — photo galleries, visual search results, image previews — and for visual-first layouts where text is secondary to the imagery. It is not for content where text is equally or more important than the image (use Vertical or Horizontal Attachment variants), for text-only expandable content (use Expansion Card / Default), or for layouts where a fixed media ratio with structured text is needed (use Expansion Card / Horizontal Attachment).

---

## Variants

| Property | Values | Default |
|----------|--------|---------|
| **state** | `rest`, `hover`, `pressed`, `selected`, `focus` | `rest` |

Total: **5 variants**

### State

| State | Visual Treatment |
|-------|-----------------|
| **rest** | Image fills the card; minimal chrome or overlay |
| **hover** | Card elevates with shadow; body expands vertically to reveal truncated content, overlaying content below while container keeps original height |
| **pressed** | Stronger overlay or scale-down for tactile feedback |
| **selected** | Accent border, checkmark overlay, or tinted scrim to indicate active choice |
| **focus** | Visible focus outline around the card boundary |

---

## Anatomy

1. **Image card** — Image card instance with primary visual
2. **Title** — Article or content title text
3. **Metadata** — Source info with thumbnail and label

---

## Expansion Behavior

- No truncated title or metadata — the content body remains the same size.
- Image border-radius reduces to 'M' (8px) on expansion.
- On expansion: 8px padding, 16px border-radius on the elevated container, background color, elevation-3.
- Expansion is Y-direction only; the card container maintains its original height in the layout flow.

---

## Usage Rules

- Image fills the card surface edge-to-edge (full bleed).
- High-quality, high-resolution images are used — pixelation is immediately visible on image-dominant cards.
- If overlay text is present, it is kept minimal (title or single metadata line).
- A gradient scrim is applied at the bottom for overlay text contrast.
- `-corner-card-` tokens are used for card border radius — the inner image clips to match.
- Touch targets meet 48px minimum; the entire card surface is tappable.
- Aspect ratio is maintained across all breakpoints — stretching and squashing are avoided.
- The `selected` state is visually unmistakable — a prominent accent border or checkmark overlay is used, not just a subtle tint.

---

## Do / Don't

### Do
- Use full-bleed, high-resolution images that remain crisp across devices and pixel densities.
- Apply a gradient scrim behind any overlay text to guarantee WCAG AA contrast against the image.
- Make the `selected` state unmistakable — use a prominent accent border or checkmark overlay.
- Ensure hover feedback is visible — the elevation lift and body expansion provide clear interactive feedback.

### Don't
- Don't use low-resolution or placeholder images — image-dominant cards amplify quality issues.
- Don't place dense text over the image without a scrim — readability will fail on varied image content.
- Don't crop key subjects (faces, focal points) when the image fills the card.
- Don't rely solely on color change for the `selected` state — combine with border, checkmark, or elevation.

---

## Dark Mode Notes

Overlay text requires a scrim or solid background to meet WCAG AA against arbitrary image content in both light and dark themes. Focus outline must contrast against both the image and the page background. The `selected` indicator must meet AA contrast requirements in both themes.

---

## Related Components

| Component | Relationship |
|-----------|-------------|
| **Expansion Card / Default** | Use when no media element is needed |
| **Expansion Card / Horizontal Attachment** | Use when text and media share horizontal space equally |
| **Expansion Card / Vertical Attachment** | Use when media and text stack vertically with balanced weight |
| **Horizontal Scroller** | Common parent — image cards are often arranged in a scrollable gallery row |
| **Button** | May appear inside expanded content for CTAs |

---

## Open questions

None.
