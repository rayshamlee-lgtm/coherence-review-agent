---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Image Card

The Image Card is a visually-driven card component where imagery is the dominant content element. Six feature variants cover a range of image presentation patterns — from standard thumbnail cards to overlay-style metadata and in-card sliders. The component supports optional secondary action buttons, autoplay behavior, and badge overlays.

**Figma Node ID:** `18895:4861` · **Type:** `COMPONENT_SET` · **Group:** Cards · **Variants:** 21 · **Dependencies:** focus outline, button, badge

---

## Variants

| Property | Values | Default | Description |
|----------|--------|---------|-------------|
| **feature** | `default`, `action Button`, `center Icon`, `overlay Meta Data`, `single Source`, `slider` | `default` | Image presentation pattern |
| **state** | `rest`, `hover`, `pressed` | `rest` | Interaction state |
| **show 2nd button?** | `true`, `false` | `false` | Toggle secondary action button |
| **autoplay?** | `true`, `false` | `true` | Auto-advance behavior (slider feature) |
| **showBadge** | `true`, `false` | `false` | Show badge overlay on image |

### Feature variant reference

| Feature | Description | Key behavior |
|---------|-------------|--------------|
| `default` | Standard image card with metadata below | Image fills top region; title + metadata in content area |
| `action Button` | Image card with prominent action button | CTA button anchored in card footer or overlaid |
| `center Icon` | Image with centered icon overlay | Play, expand, or informational icon centered on image |
| `overlay Meta Data` | Text metadata overlaid directly on the image | Requires `alwaysDark` or `switchable` style treatment for legibility |
| `single Source` | Image card attributed to a single source | Source attribution prominently displayed |
| `slider` | In-card image carousel | Horizontal navigation between multiple images within the card |

---

## Visual States

### Feature × State matrix

| Feature | rest | hover | pressed |
|---------|------|-------|---------|
| **default** | Static image + metadata | Image brightness/overlay shift | Darkened overlay |
| **action Button** | Button at rest | Button + card hover treatment | Card pressed state |
| **center Icon** | Icon visible at rest | Icon may scale or gain emphasis | Pressed overlay |
| **overlay Meta Data** | Text over image with scrim | Scrim intensifies on hover | Darkened overall |
| **single Source** | Source label visible | Hover treatment on card | Pressed overlay |
| **slider** | First slide visible, navigation dots | Navigation arrows appear | Active slide pressed |

### Overlay Meta Data — style treatment

When `feature=overlay Meta Data`, text sits directly on the image. Two style treatments apply:

| Style | Behavior | Use case |
|-------|----------|----------|
| **alwaysDark** | Dark text/scrim treatment regardless of page theme | Photos and images that don't switch in light/dark mode |
| **switchable** | Adapts overlay treatment to current light/dark mode | Graphics or illustrations that respond to theme changes |

---

## Anatomy

1. **Image** — Primary visual fill; stretches to card width
2. **Overlay button** — Optional Button instance for actions on top of the image (e.g., play, expand)
3. **Container** — Card frame with no-padding option for edge-to-edge images

---

## Usage Rules

- Image Card is appropriate when the primary content is an image or photo, for image search results, gallery grids, visual stories, and carousel/slider experiences within a single card.
- It is not appropriate for video content (use Video Card), answer/text-dominant content (use Answer Card), multi-image galleries with slide navigation (use Multi Images Carousel Card), or side-by-side image comparison (use Hero-image Card).
- Images should maintain aspect ratio — cover fit with centered focal points. The `overlay Meta Data` feature requires a sufficient scrim/gradient overlay to maintain WCAG AA contrast.
- Overlay text should be concise — maximum 2 lines for title, 1 line for metadata.
- `show 2nd button?` is most useful with `feature=default` or `feature=action Button`. It adds a secondary action (e.g., "Save", "Share") alongside the primary action.
- `autoplay?` applies to `feature=slider`. When true, images auto-advance; minimum 4-second interval. Must respect `prefers-reduced-motion`.
- `showBadge` renders a badge overlay (e.g., "New", "HD", content type label). Use sparingly for meaningful labels — not for decoration.
- Card surface uses `background-card-on-primary-default-` tokens. Border radius uses `-corner-card-` tokens.

### Responsive (Dual layout requirement)

| Layout | Description |
|--------|-------------|
| **Anchor Card** | Full-featured image card with all metadata, action buttons, and optional badge. Image region takes majority of card height. |
| **Accessory Card** | Simplified — drop secondary buttons, reduce metadata to title only, remove badge if space is constrained. Image remains hero element. |

- At ≤640px, `slider` feature should support touch swipe gestures. Navigation arrows may collapse to dots only.
- Image aspect ratio must be maintained across breakpoints — never stretch or distort.

---

## Do / Don't

### Do
- Use `overlay Meta Data` with `alwaysDark` style when overlaying text on photographic images.
- Maintain image aspect ratio across all breakpoints.
- Use `showBadge` sparingly for meaningful labels (content type, status) — not for decoration.
- Provide a text alternative (alt text) for every image.
- Ensure `slider` feature has clear navigation affordance (dots, arrows, or both).
- Test `autoplay?=true` with reduced-motion preferences — respect `prefers-reduced-motion`.

### Don't
- Overlay light text on bright images without a scrim — use gradient overlay or `alwaysDark` treatment.
- Use `show 2nd button?` on Accessory cards — simplify to a single action at small sizes.
- Combine `overlay Meta Data` with `showBadge` if it creates visual clutter over the image.
- Use `slider` for fewer than 3 images — use `default` or Hero-image Card instead.
- Auto-advance slides too quickly — minimum 4-second interval for `autoplay?=true`.
- Crop key subjects out of images at narrow breakpoints — test focal point preservation.

---

## Dark Mode Notes

The `overlay Meta Data` feature uses `alwaysDark` or `switchable` style treatments. `switchable` adapts the scrim and text color to the current light/dark theme. `alwaysDark` ignores theme and always applies dark treatment — appropriate for photographic content that does not itself invert in dark mode. All text in the content area must meet WCAG AA contrast against the card surface in both themes.

---

## Related Components

| Component | Relationship |
|-----------|-------------|
| **Answer Card** | Use instead for text/data-dominant answer content |
| **Video Card** | Use instead for video playback content |
| **Multi Images Carousel Card** | Use instead for dedicated multi-image slide navigation |
| **Hero-image Card** | Use instead for side-by-side dual image presentation |
| **Button** | Child component — used in `action Button` feature and `show 2nd button?` |
| **Badge** | Child component — rendered when `showBadge=true` |

---

## Open questions

None.
