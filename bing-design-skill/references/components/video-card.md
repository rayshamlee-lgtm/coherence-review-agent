---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Video Card

The Video Card presents video content with a thumbnail preview and associated metadata. Three feature variants handle different layout relationships between the video thumbnail and text content — from standard layouts to overlay metadata and split-area designs. This component is the primary card type for video search results and embedded video experiences on the SERP.

**Figma Node ID:** `23573:43809` · **Type:** `COMPONENT_SET` · **Group:** Cards · **Variants:** 6 · **Dependencies:** focus outline, button

---

## Variants

| Property | Values | Default | Description |
|----------|--------|---------|-------------|
| **feature** | `default`, `overlay Meta Data`, `divided area` | `default` | Video presentation layout pattern |
| **State** | `rest`, `hover` | `rest` | Interaction state |

### Feature variant reference

| Feature | Description | Layout |
|---------|-------------|--------|
| `default` | Standard video card — thumbnail above, metadata below | Vertical stack: video thumbnail → title + metadata content area |
| `overlay Meta Data` | Metadata overlaid on the video thumbnail | Duration, source, and title text rendered over the thumbnail with scrim |
| `divided area` | Split layout between video and text | Horizontal split: video thumbnail on one side, text content on the other |

---

## Visual States

### Feature × State matrix

| Feature | rest | hover |
|---------|------|-------|
| **default** | Thumbnail with play icon and badge | Video auto-plays; progress bar appears; sound icon shown |
| **overlay Meta Data** | Text over thumbnail with scrim gradient | Video auto-plays; progress bar appears |
| **divided area** | Side-by-side video + text | Video auto-plays in video region; progress bar appears |

### Overlay Meta Data — style treatment

When `feature=overlay Meta Data`, text overlays the video thumbnail. Two style treatments apply, mirroring the Image Card overlay pattern:

| Style | Behavior | Use case |
|-------|----------|----------|
| **alwaysDark** | Dark scrim/text treatment regardless of page theme | Video thumbnails that don't change with light/dark mode |
| **switchable** | Adapts overlay to current light/dark mode | Thumbnails from graphics or illustrations that respond to theme |

---

## Anatomy

1. **Video thumbnail** — Preview image fill; primary visual for the video
2. **Play icon** — Centered play button overlay at rest state
3. **Progress bar** — Playback progress indicator shown during hover preview
4. **Bottom overlay** — Source attribution and title text (feature-dependent)

### Divided area layout

The `divided area` feature creates a horizontal split:
- **Video region:** Thumbnail with play affordance, fixed aspect ratio (16:9 recommended)
- **Text region:** Title, description, source attribution, duration metadata
- At narrow breakpoints, the split stacks vertically (video on top, text below)

---

## Usage Rules

- Video Card is appropriate for video search results, video answer modules, split-layout video + text content (`divided area`), and when video metadata needs to overlay the thumbnail (`overlay Meta Data`).
- It is not appropriate for static image content (use Image Card), audio-only content, video playlists or multi-video carousels (use Multi Images Carousel Card or a scroller pattern), or live-streaming indicators (extend with badge overlays from Image Card patterns).
- A play icon must always be shown at rest state to clearly signal video content.
- Video thumbnails should be high quality and representative of the video content. Bottom overlay should show source attribution so users know where the video comes from.
- Title should be concise — max 2 lines. Description max 2–3 lines.
- Card surface uses `background-card-on-primary-default-` tokens. Border radius uses `-corner-card-` tokens. Video thumbnail aspect ratio: 16:9 for standard layouts.
- Hover-to-preview should be muted by default. A sound icon allows users to opt in to audio.
- When used in an Expansion Card (horizontal context), the badge and play icon become emphasized on hover. The badge typically shows video duration.

### Responsive (Dual layout requirement)

| Layout | Description |
|--------|-------------|
| **Anchor Card** | Full `default` or `divided area` layout with complete metadata, description, and source attribution. Video thumbnail takes prominent space. |
| **Accessory Card** | Simplified — `default` layout with title and duration only. Drop description, collapse metadata to essentials. Thumbnail remains clear with play affordance. |

- `divided area` at ≤640px (2-column): stack vertically — video thumbnail on top, text content below.
- At 4-column breakpoint: `divided area` may switch from horizontal to vertical depending on available span.

---

## Do / Don't

### Do
- Always show a play icon overlay at rest state to clearly signal video content.
- Use hover-to-preview so users can sample video before committing.
- Use `overlay Meta Data` with scrim gradient to ensure text legibility over the thumbnail.
- Use `divided area` when the text content is equally important as the video (e.g., article + video).
- Stack `divided area` vertically on narrow breakpoints — maintain reading order (video → text).
- Respect `prefers-reduced-motion` — show static thumbnail instead of hover preview.

### Don't
- Auto-play video preview with sound on — mute by default and let users opt in via the sound icon.
- Overlay dense text on thumbnails — keep `overlay Meta Data` to title + source.
- Use `divided area` at narrow widths without stacking — side-by-side becomes too cramped.
- Stretch or distort video thumbnails — maintain aspect ratio.
- Omit video source attribution — users need to know where the video comes from.

---

## Dark Mode Notes

The `overlay Meta Data` feature uses `alwaysDark` or `switchable` style treatments, identical to the Image Card overlay pattern. `switchable` adapts the scrim and text color to the current light/dark theme. `alwaysDark` always applies dark treatment regardless of theme — appropriate for photographic thumbnails that do not invert in dark mode. The progress bar and sound icon must meet WCAG AA contrast against the video preview in both themes.

---

## Related Components

| Component | Relationship |
|-----------|-------------|
| **Image Card** | Use instead for static image content; shares `overlay Meta Data` pattern |
| **Answer Card** | Use instead for text-dominant answer content |
| **Button** | Child component — play button and secondary actions |
| **Multi Images Carousel Card** | Consider for multi-video thumbnail presentations |
| **Section / body** | Parent container — Video Cards sit within section zones |

---

## Open questions

None.
