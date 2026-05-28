---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Image

## Summary

Image is a foundational display atom for rendering images within the ACF design system. It supports an optional fuzzy mark overlay for content that requires visual obscuring (e.g., sensitive or blurred content indicators). Image is consumed by card components and Thumbnail as the base image rendering element.

**Figma Node ID:** `131224:154942` · **Type:** `COMPONENT_SET` · **Group:** Display  
**Tier:** Base / Foundational Atom · **Variants:** 2 · **Consumed by:** Image card, Thumbnail, Video card, Multi images carousel card

---

## Variants / Types

| Property | Values | Default | Description |
|----------|--------|---------|-------------|
| **fuzzy Mark** | `false`, `true` | `false` | Whether a fuzzy/blur overlay is applied to the image |

| Value | Purpose |
|-------|---------|
| **false** | Standard image display — no overlay |
| **true** | Fuzzy/blur overlay applied — used for sensitive, NSFW, or content-gated imagery |

---

## Anatomy

1. **Image fill** — Primary visual content; fills the container frame
2. **Fuzzy mark overlay** — Conditional semi-transparent overlay for content sensitivity (when fuzzy Mark = true)

---

## Visual States

- **Standard (fuzzy Mark = false):** Image renders at full fidelity with no overlay
- **Fuzzy marked (fuzzy Mark = true):** Semi-transparent blur overlay suppresses image content (opacity: 0.35, blur: 18px)
- **Hover (zoom):** When `zoomOnHover` is enabled by the consuming component, the image scales up 20% over 300ms with linear easing

---

## Usage Rules

- Image is typically consumed inside higher-level card components — standalone placement is rare
- The fuzzy mark overlay is a visual indicator only; it does not block access to the underlying content
- Source image aspect ratio must always be preserved — object-fit crop is applied, never stretch
- **Fully occupied:** When used as a card hero or standalone visual, the image fills the entire container frame with no padding or gap
- **Align to content height:** When paired with text in a row layout (e.g., list item thumbnail), the image height is constrained to match adjacent content height rather than stretching
- Enable `fuzzy Mark` for content flagged as sensitive by the content pipeline

---

## Do / Don't

### Do
- Use `fuzzy Mark` for content flagged as sensitive by the content pipeline
- Ensure images have appropriate alt text in the consuming component
- Maintain aspect ratios consistent with the parent card type

### Don't
- Use Image standalone for decorative purposes — use frame fills instead
- Rely solely on fuzzy mark for content moderation — it is a visual indicator, not an access blocker
- Use Image for icons or glyphs (use Icon), avatar/profile pictures (use Avatar), or decorative backgrounds (use frame fills directly)

---

## Dark Mode Notes

No dark-mode-specific variant behavior documented. The fuzzy mark overlay uses opacity-based treatment that functions consistently across light and dark themes.

---

## Open Questions

None.
