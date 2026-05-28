---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Card Body / Page by Page Carousel

**Figma Node ID:** `18778:2258` · **Type:** `COMPONENT_SET` · **Group:** Card body · **Tier:** Card / Body Template · **Variants:** 24

## Summary

The Page by Page Carousel is a paginated carousel component for displaying content across multiple slides within a card. It supports standard and full-bleed styles with 4 responsive width breakpoints. Each slide is a configurable slot for custom content. It is used as a shared card body module for multi-page content that doesn't fit in a single view.

This component is appropriate for multi-page content within a card (image galleries, step-by-step guides) and for paginated results that don't fit in a single view. It is distinct from the section-level Horizontal Scroller. It is not for section-level horizontal scrolling (use Horizontal Scroller or Section body / Carousel), single-content cards, or continuous scrolling lists (use List View).

---

## Variants

| Property | Values | Default |
|----------|--------|---------|
| **style** | `standard`, `full bleed` | `standard` |
| **currentSlide** | `1`, `2`, `3` | `1` |
| **width** | `s`, `md`, `l`, `xl` | `md` |

Total: 2 styles × 3 slides × 4 widths = **24 variants**

### style

| Value | Description |
|-------|-------------|
| `standard` | Padded slides with visible card margins |
| `full bleed` | Slides extend to card edges — no internal padding |

### width

| Value | Description |
|-------|-------------|
| `s` | Small — mobile or compact column |
| `md` | Medium — default card width |
| `l` | Large — wide card or expanded view |
| `xl` | Extra large — full-width layout |

### currentSlide

Controls which slide is visible. Values: `1`, `2`, `3`.

---

## Anatomy

1. **Carousel container** — Outer frame managing slide visibility and pagination
2. **Slide 1 / 2 / 3** — Content slots for each page of the carousel
3. **Pagination indicators** — Dots or controls showing current position

---

## Visual States

| Interaction | Behavior |
|-------------|----------|
| Swipe left/right | Navigates between slides on touch devices |
| Click pagination dots | Jumps to a specific slide |
| Arrow keys (keyboard) | Navigates between slides when focused |

---

## Usage Rules

- Pagination indicators show total slides and current position.
- `full bleed` is used for media-heavy slides (images, video thumbnails).
- The `width` variant is matched to the parent card's responsive breakpoint.
- Slides are limited to 3 — users rarely paginate beyond that.
- Content heights across slides are kept consistent — drastically different heights are avoided.
- This component is placed inside an answer card body slot as a paginated content area.
- Each slide slot accepts arbitrary content — text, images, or nested components.
- The parent card must support horizontal overflow when this carousel is used.

---

## Do / Don't

### Do
- Use pagination indicators to show total slides and current position.
- Use `full bleed` for media-heavy slides.
- Match the `width` variant to the parent card's responsive breakpoint.

### Don't
- Don't exceed 3 slides — users rarely paginate beyond that.
- Don't mix drastically different content heights across slides.
- Don't use for content that should be visible simultaneously — use a grid instead.

---

## Dark Mode Notes

No dark-mode-specific variants are documented. Token-based color application handles theme switching for the carousel container and pagination indicators.

---

## Related Components

| Component | Relationship |
|-----------|-------------|
| **Horizontal Scroller** | Section-level scrolling container (distinct from this card-level carousel) |
| **Section body / Carousel** | Section-level card carousel |
| **Answer card** | Typical parent container |
| **Nested Card** | May be used as slide content |

---

## Open questions

None.
