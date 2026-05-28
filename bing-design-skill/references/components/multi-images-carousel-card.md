---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Multi Images Carousel Card

**Figma Node ID:** `49577:146920` · **Type:** `COMPONENT_SET`  
**Group:** Cards · **Tier:** Core / Card · **Variants:** 3  
**Dependencies:** focus outline, scroller button  
**Consumed by:** Section body / magazine, image gallery experiences, visual answer modules

---

## Summary

The Multi Images Carousel Card presents a navigable series of images within a single card container. Three slide variants represent the navigation state: first slide, middle slides (2+), and last slide. Navigation controls and indicators adapt based on the current position — first slide hides the "previous" control, last slide hides the "next" control, and middle slides show both.

This component is appropriate for image galleries or photo collections within a single card, multiple related images that should be browsed sequentially, and visual answer experiences requiring slide-by-slide exploration. It is not appropriate for a single image (use Image Card), exactly 2 images side-by-side (use Hero-image card), video content (use Video Card), or in-card image sliders within a different card type (use Image Card with `feature=slider`).

---

## Variants / Types

| Property | Values | Default | Description |
|----------|--------|---------|-------------|
| **Slide** | `1`, `2+`, `Last` | `1` | Current slide navigation position |

### Slide reference

| Slide | Navigation state | Controls visible |
|-------|-----------------|-----------------|
| `1` | First image displayed | "Next" control only (no "Previous") |
| `2+` | Middle slides — any slide between first and last | Both "Previous" and "Next" controls |
| `Last` | Final image displayed | "Previous" control only (no "Next") |

---

## Anatomy

1. **Image container (slot)** — Editable slot where designers add or swap image content per slide
2. **Pagination** — Pagination instance for navigating between images (prev/next/dots)
3. **See all overlay** — Last-child overlay prompting users to view the full gallery
4. **Container** — Card frame with carousel sizing

---

## Visual States

Navigation controls use the Scroller Button dependency for "Previous" and "Next" arrows. At `Slide=1`, only forward/next navigation is shown — previous is hidden (not disabled). At `Slide=Last`, only backward/previous navigation is shown — next is hidden (not disabled). At `Slide=2+`, both controls are visible.

Dot indicators show the user's position within the carousel. The active dot is visually distinct (filled vs. outlined, or size difference). Indicator count matches the total number of slides.

Slides transition smoothly with a horizontal slide animation. Transitions must respect `prefers-reduced-motion` — use instant switch when reduced motion is preferred.

---

## Usage Rules

- Minimum 3 slides recommended — fewer than 3 should use Image Card or Hero-image card.
- Each slide features a single high-quality image. Images maintain consistent aspect ratio across all slides.
- Optional metadata (caption, attribution, index) can appear below the image area.
- Navigation uses the Scroller Button dependency.
- Card surface uses `background-card-on-primary-default-` tokens; border radius uses `-corner-card-` tokens.
- Navigation controls are positioned at card mid-height, overlaying the image edges.
- Dot indicators: `xxx-small` gap between dots, centered below the image.

### Responsive (Dual layout requirement)
- **Anchor Card:** Full carousel with navigation arrows, dot indicators, and optional caption/metadata below each image.
- **Accessory Card:** Simplified — show image + dot indicators only; navigation arrows may be replaced by swipe gesture on touch devices; captions dropped to save space.
- At ≤640px (2-column): full-width card; touch swipe is primary navigation; arrows may be hidden in favor of swipe affordance.
- Images must scale proportionally — never stretch or distort across breakpoints.

### Do
- Show slide position indicators (dots or progress) so users know how many images exist.
- Hide (not disable) the navigation control that has no destination.
- Maintain consistent image aspect ratio across all slides.
- Support both click/tap navigation controls and swipe gestures on touch devices.
- Respect `prefers-reduced-motion`.
- Provide alt text for every image in the carousel.

### Don't
- Use this component for fewer than 3 images.
- Auto-advance slides without user control.
- Show disabled navigation controls — hide the inapplicable direction entirely.
- Make dot indicators the only way to navigate.
- Mix image and non-image slides — this is an image-specific carousel.
- Crop images inconsistently across slides.

---

## Dark Mode Notes

Navigation arrow controls must meet WCAG AA contrast against the image background; a semi-transparent scrim behind arrows is the recommended approach. Active vs. inactive dot indicators must have sufficient contrast differentiation. Any text overlay (captions) must meet AA contrast against the card surface.

---

## Related Components

| Component | Relationship |
|-----------|-------------|
| **Image Card** | Use instead for single-image cards; `feature=slider` offers in-card carousel |
| **Hero-image card** | Use instead for exactly 2 images side-by-side |
| **Scroller Button** | Dependency — provides the Previous/Next navigation arrow controls |
| **Video Card** | Use instead for video content |
| **Section / body** | Parent container — carousel cards sit within section zones |

---

## Open questions

None.
