---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Tok Video

**Figma Node ID:** `131062:161594` · **Type:** `COMPONENT_SET` · **Group:** Cards · **Tier:** Special / Content · **Variants:** 2 · **Dependencies:** Focus outline · **Consumed by:** Card components, Section body types (video sections)

## Summary

Tok Video is a card type used inside the ML body / Short video answer section. It displays vertical portrait video thumbnails with optional time overlay and play button, and is typically arranged in a horizontally scrollable row. It is designed for short-form vertical video content (TikTok-style) in SERP results, with hover-to-preview behavior and source attribution.

This component is appropriate as a card type inside ML body / Short video answer sections and for displaying short-form vertical video content. It is not for standard horizontal video embeds (use standard video card patterns), for image content (use image card patterns), or for live/streaming content (different UI treatment needed).

---

## Variants / States

| state | Description |
|-------|-------------|
| **rest** (default) | Default idle appearance; thumbnail visible; no hover chrome |
| **hover** | Sound icon appears at top-right corner; video auto-plays (muted) |

### Boolean Properties

| Property | Default | Description |
|----------|---------|-------------|
| **show Time?** | `False` | Show video duration overlay (e.g., "0:45") |
| **show Play button?** | `False` | Show play button overlay on the thumbnail |

### Property Combinations

| show Time? | show Play button? | Result |
|-----------|------------------|--------|
| `False` | `False` | Clean thumbnail only — minimal chrome |
| `True` | `False` | Thumbnail + duration badge |
| `False` | `True` | Thumbnail + play button |
| `True` | `True` | Thumbnail + duration badge + play button |

---

## Anatomy

1. **Video thumbnail** — Vertical portrait image fill; primary visual for the video
2. **Play button overlay** — Centered play icon; shown when `show Play button?=True`
3. **Bottom overlay** — Source attribution with favicon and title text overlaid at the bottom of the thumbnail
4. **Sound icon** — Mute/unmute control at top-right corner; appears on hover state

---

## Visual States

| State | Visual Treatment |
|-------|-----------------|
| rest | Thumbnail visible; no hover chrome; time badge and play button shown per boolean properties |
| hover | Card elevates; sound icon appears at top-right; video auto-plays (muted) |

---

## Usage Rules

- Tok Video uses a vertical (portrait) aspect ratio — taller than it is wide.
- Thumbnail aspect ratio is maintained across all sizes — no stretching or distorting.
- The bottom overlay is positioned at the bottom of the thumbnail with a semi-transparent background.
- The play button is centered on the thumbnail.
- Time and play overlays scale proportionally with the thumbnail.
- Video preview auto-plays on hover, muted by default — sound is opt-in via the sound icon.
- Click or tap opens the video in a full player or detail page.
- At narrow viewports, Tok Video cards appear within a Horizontal Scroller.
- Overlays on the thumbnail are kept minimal — excessive overlays obscuring the thumbnail are avoided.

---

## Do / Don't

### Do
- Use high-quality thumbnail images — they are the primary visual hook.
- Show the time overlay when duration helps users make viewing decisions.
- Show the play button when it's not obvious the content is a video.
- Maintain the vertical aspect ratio — don't crop to horizontal.

### Don't
- Don't auto-play video preview with sound on — mute by default and let users opt in via the sound icon.
- Don't stretch or distort the thumbnail to fit a non-native aspect ratio.
- Don't obscure the thumbnail with too many overlays.
- Don't use Tok Video for non-video content.

---

## Dark Mode Notes

Bottom overlay text must meet WCAG AA contrast against the semi-transparent background in both light and dark themes. Play button icon must meet AA contrast against the thumbnail. Hover-to-preview must respect `prefers-reduced-motion` — a static thumbnail is shown instead in reduced-motion contexts.

---

## Related Components

| Component | Relationship |
|-----------|-------------|
| **Horizontal Scroller** | Parent — Tok Video cards often appear in horizontal scrollers |
| **Card components** | Related — follows card-level patterns for interaction and focus |
| **Section body / magazine** | Grandparent — video sections use magazine layout zones |

---

## Open questions

None.
