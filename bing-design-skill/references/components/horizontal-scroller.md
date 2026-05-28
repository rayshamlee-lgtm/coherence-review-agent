---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Horizontal Scroller

**Figma Node ID:** `96280:371362` · **Type:** `COMPONENT_SET`  
**Group:** Navigation · **Tier:** Special / Utility · **Variants:** 13  
**Dependencies:** Scroller button, Card components, Focus outline  
**Consumed by:** Section body types, Card body areas

---

## Summary

Horizontal Scroller is a scrolling container for repeating content that overflows its parent width — expansion cards, thumbnails, video lists, and similar horizontally-arranged items. It supports both card-body and section-body contexts, themed backgrounds, and provides scroll arrow navigation with optional gradient fade edges.

This component is appropriate for horizontally-arranged repeating items that exceed container width (card carousels, thumbnail strips), inside card body areas or section body areas, and when content should be browsable via left/right scroll rather than pagination. It is not appropriate for vertical lists (use standard stacking layout), when all items fit within the container width (render flat), or for single-item content.

---

## Variants / Types

| Property | Values | Default | Description |
|----------|--------|---------|-------------|
| **scenario** | `non-card body`, `card body` | `non-card body` | Whether scroller is inside a card body or section body |
| **tall** | `standard`, `short` | `standard` | Height variant of the scroller |
| **overflow** | `true`, `false` | `true` | Whether content overflows container (shows scroll arrows) |
| **themed?** | `false`, `true` | `false` | Whether scroller has a themed background color |
| **slide** | `start`, `middle`, `end` | `start` | Current scroll position — controls arrow visibility |
| **gradient fade** | `True` | `True` | Gradient fade effect on overflow edges |

### Slide position × arrow visibility

| slide | Left arrow | Right arrow | Meaning |
|-------|-----------|-------------|---------|
| **start** | Hidden | Visible | At beginning — can scroll right |
| **middle** | Visible | Visible | In middle — can scroll both directions |
| **end** | Visible | Hidden | At end — can scroll left |

Arrows only appear when `overflow=true`. When `overflow=false`, no arrows render regardless of slide position.

### Scenario context

| Scenario | Context | Button style | Notes |
|----------|---------|-------------|-------|
| **non-card body** | On SERP background, no visible container | Scroller Buttons (elevated) | Use large buttons for tall/multi-row content |
| **card body** | Inside an answer card with visible container | Button Icon (flat) | Use small buttons for short/single-row content |

### tall

| Value | Purpose |
|-------|---------|
| **standard** | Standard height for full card rows |
| **short** | Compact height for thumbnails, chips, or dense content |

---

## Anatomy

1. **Content area (Basic)** — Horizontally scrollable row of items using Basic component
2. **Gradient edges** — Fade overlays on left/right indicating more content
3. **Scroll buttons** — Left/right Button instances for navigating the scroll area

Gradient token for edge fade: `--bing-smtc-ctrl-background-fade-on-primary`.

---

## Visual States

- **Scroll buttons** — click left/right arrows to scroll the content by one page width
- **Touch/drag** — on touch devices, swipe horizontally to scroll content; on mobile, scroller buttons are not shown — users swipe to scroll
- **Gradient indicators** — fade edges appear/disappear based on scroll position (hidden at start/end)

Arrows are excluded from tab order when hidden (start/end positions).

---

## Usage Rules

- Items within the scroller should be uniform in height (width may vary).
- Minimum 3–4 items should be visible at rest to suggest scrollability.
- Content should be meaningful in any scroll position — no critical-only-at-end items.
- Gradient fade is optional on desktop; required on mobile.
- Configure `scenario` before adding content: `non-card body` for SERP background contexts, `card body` for inside an answer card.
- Use `Themed? = true` when the scroller sits on a themed section background.
- On mobile, Horizontal Scroller does not have scroller buttons — users swipe to scroll.

### Do
- Set `overflow=true` when items exceed container width — this enables scroll arrows.
- Use `gradient fade` to visually indicate more content is available off-screen.
- Ensure the first visible item is fully rendered at rest (not partially clipped).
- Use `short` height for compact contexts (thumbnails, chips); `standard` for full cards.

### Don't
- Use a scroller with only 1–2 items — there is nothing to scroll.
- Hide critical content at the end of a long scroll — users may not reach it.
- Disable gradient fade without good reason — it is a key affordance.
- Use `card body` scenario outside of a Card component.
- Nest a Horizontal Scroller inside another Horizontal Scroller.

---

## Dark Mode Notes

Scroll arrows must meet WCAG AA contrast against the scroller background in both light and dark themes. Gradient fade does not obscure text on partially-visible items below AA contrast. Themed backgrounds (`themed? = true`) maintain sufficient contrast with content. The gradient token `--bing-smtc-ctrl-background-fade-on-primary` adapts to the current theme.

---

## Related Components

| Component | Relationship |
|-----------|-------------|
| **Scroller button** | Child — left/right arrow navigation buttons |
| **Card components** | Child — items within the scroller |
| **Section body / magazine** | Parent — scroller may live inside magazine zones |
| **Section body / algo** | Parent — scroller may live inside algo zones |

---

## Open questions

None.
