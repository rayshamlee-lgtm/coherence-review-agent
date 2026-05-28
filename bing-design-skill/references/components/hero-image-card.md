---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Hero-image Card

The Hero-image Card is a specialized card layout that presents exactly two images side by side within a single card container. It is a single, fixed-layout component with no variant properties — optimized for dual-image presentation in comparison, before/after, or paired-image contexts where both images must be visible simultaneously.

**Figma Node ID:** `24166:52236` · **Type:** `COMPONENT` · **Group:** Cards · **Variants:** 1

---

## Variants

This component has no variant properties. It is a single, fixed-layout component.

| Aspect | Value |
|--------|-------|
| Variant count | 1 |
| Configurable properties | None |
| Layout | Two Image Card instances side by side within a card container |

---

## Visual States

Although no explicit state variants are defined in the Figma component, the following interaction states are required:

| State | Behavior |
|-------|----------|
| `rest` | Default presentation |
| `hover` | Images scale to 110% inside the card; card size does not change; subtle card-level hover treatment (background/elevation shift) |
| `pressed` | Card-level pressed state |
| `focus` | Visible focus ring via `focus outline` dependency (keyboard navigation) |

---

## Anatomy

1. **Image card (left)** — First Image Card instance with its own image fill
2. **Image card (right)** — Second Image Card instance, placed side by side with the left

### Layout structure

```
┌──────────────────────────────┐
│  ┌────────────┬────────────┐ │
│  │            │            │ │
│  │  Image 1   │  Image 2   │ │
│  │            │            │ │
│  └────────────┴────────────┘ │
│  [Optional metadata area]    │
└──────────────────────────────┘
```

### Image layout rules
- Both images occupy equal width (50/50 split)
- Images share the same height — vertically aligned
- A small gap separates the two images (`xx-small` or `x-small` spacing token)
- Images maintain aspect ratio using cover fit — no stretching or distortion
- Both images should use consistent framing and aspect ratio for visual balance
- Border radius uses `-corner-card-` tokens on the outer container only; inner image cards have clipped corners
- No padding — images reach edge-to-edge within the card surface

---

## Usage Rules

- This component is appropriate for side-by-side image comparison (before/after, option A vs. option B), for paired search results, and for dual-image visual answers where both images have equal weight.
- It is not appropriate for more than 2 images (use Multi Images Carousel Card), for a single image (use Image Card), for images with extensive metadata (use Image Card with `default` or `single Source` feature), or for images of different importance levels.
- Both images should be of comparable quality, resolution, and visual weight. If used for comparison, both images should be framed consistently (same zoom level, similar composition).
- Optional metadata (captions, labels, attribution) may appear below the image pair. Image labels (e.g., "Before" / "After") should be visually balanced.

### Responsive (Dual layout requirement)

| Layout | Description |
|--------|-------------|
| **Anchor Card** | Full side-by-side layout with both images equally sized. Optional captions/labels below each image. Sufficient width for both images to be clearly visible. |
| **Accessory Card** | At very small sizes, images stack vertically (top/bottom) instead of side-by-side to maintain readability. Captions may be dropped if space is constrained. |

- At ≤640px (2-column): the 50/50 split may become too narrow for meaningful images — stack vertically if needed.
- At 4-column breakpoint: maintain side-by-side if card span is 2+ columns; stack if single column.

---

## Do / Don't

### Do
- Use images of equal visual weight and quality — neither should dominate the other.
- Maintain consistent aspect ratio and framing across both images.
- Provide labels or captions when the comparison context isn't self-evident (e.g., "Before" / "After").
- Stack images vertically at narrow breakpoints rather than rendering tiny side-by-side images.
- Provide alt text for both images that describes each individually.

### Don't
- Pair images of wildly different aspect ratios — it creates visual imbalance.
- Use this card for more than 2 images — use Multi Images Carousel Card instead.
- Force side-by-side layout at widths where images become illegibly small.
- Omit alt text on either image — both need independent accessible descriptions.
- Use decorative images that add no informational value — each image should serve a purpose.

---

## Dark Mode Notes

No dedicated dark-mode variant. Card surface uses `background-card-on-primary-default-` tokens, which are expected to be theme-aware. Any text overlays or labels on images must meet WCAG AA contrast in both light and dark themes. The focus ring must be visible against the card background in both modes.

---

## Related Components

| Component | Relationship |
|-----------|-------------|
| **Image Card** | Use instead for single-image presentation or more complex image features |
| **Multi Images Carousel Card** | Use instead for 3+ images with navigation |
| **Answer Card** | Use instead for text-dominant answer content |
| **Video Card** | Use instead for video content |
| **Section / body** | Parent container — Hero-image Cards sit within section zones |

---

## Open questions

None.
