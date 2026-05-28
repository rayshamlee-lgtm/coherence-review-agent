---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Thumbnail

## Summary

Thumbnail renders an image preview at a predefined size. It enforces consistent image rhythm across the SERP — from full-size grid images (88px) down to favicon-size icons (16px) and video previews with a play indicator.

**Figma Node ID:** `20011:10148` · **Type:** `COMPONENT_SET` · **Group:** Display  
**Tier:** Base / Foundational Atom · **Variants:** 6 · **Consumed by:** Cards, search results, video carousels, favicon rows

---

## Variants / Types

| Size | Use case |
|------|----------|
| `88px` | Default grid rhythm. Standard card thumbnails, image grids |
| `72px` | Compact card layouts, secondary image positions |
| `56px` | Dense list items, smaller card variants |
| `36px` | Inline thumbnails, list-style results |
| `16px` | Favicon-size. Source attribution, domain icons |
| `Video Thumbnail` | Video preview with play indicator overlay. Wider aspect ratio |

---

## Anatomy

1. **Image** — Preview image fill; clips to the thumbnail frame shape (square or rounded)
2. **Play indicator** — Overlay element visible in the `Video Thumbnail` variant only; communicates video interactivity

---

## Visual States

- **Default:** Image fills the container at the defined size
- **Video Thumbnail:** Includes a play indicator overlay on top of the video still image
- Thumbnail itself has no hover, focus, or pressed states — interaction is inherited from the parent container

---

## Usage Rules

- Images must be high-resolution and properly cropped to avoid pixelation at any size
- `Video Thumbnail` must include a visible play indicator to communicate interactivity
- The smallest size that maintains legibility of the image content is the correct choice
- Thumbnail sizes within the same list or grid must remain consistent
- Thumbnails align to the grid baseline — the 88px size anchors the default card rhythm
- Use `x-small` spacing token between thumbnail and adjacent text content
- `16px` is used exclusively for favicons and domain icons in attribution rows

---

## Do / Don't

### Do
- Use `88px` as the default size for standard card image grids
- Use `16px` exclusively for favicons and domain icons in attribution rows
- Use `Video Thumbnail` for any video content — the play indicator sets user expectation

### Don't
- Mix thumbnail sizes within the same repeating list
- Use `Video Thumbnail` for non-video content — the play indicator misleads users
- Stretch or distort images to fill the thumbnail — maintain aspect ratio and crop appropriately
- Use Thumbnail for user identity images — use Avatar instead

---

## Dark Mode Notes

No dark-mode-specific variant behavior documented. The play indicator in `Video Thumbnail` must maintain sufficient contrast (WCAG AA) against the video still image in both light and dark themes.

---

## Open Questions

None.
