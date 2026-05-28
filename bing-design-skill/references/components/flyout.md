---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Flyout

## Summary

Flyout is a floating popup container that appears adjacent to a trigger element. It supports 5 pointing directions (Up, Down, Left, Right, None) and an optional beak (pointing arrow) that visually connects the popup to its trigger. Flyout adapts its sizing between desktop and mobile contexts.

**Figma Node ID:** `52608:149479` · **Type:** `COMPONENT_SET` · **Group:** Overlay · **Variants:** 5

**Dependencies:** Focus outline

**Consumed by:** Various components requiring popup behavior (cards, controls, menus)

---

## Variants / Types

### pointing Direction

| Direction | Flyout position | Beak points | Use case |
|-----------|----------------|-------------|----------|
| `Up` | Above trigger | Down toward trigger | Trigger near bottom of viewport |
| `Down` (default) | Below trigger | Up toward trigger | Default — trigger near top/middle |
| `Left` | Left of trigger | Right toward trigger | Trigger near right edge |
| `Right` | Right of trigger | Left toward trigger | Trigger near left edge |
| `none` | Centered / no arrow | No beak | Floating popup without directional reference |

### Desktop vs mobile

| Property | Desktop (`true`) | Mobile (`false`) |
|----------|-----------------|-----------------|
| Width | Standard popup width | Wider / full-width (max 315px) |
| Positioning | Float adjacent to trigger | Centered with backdrop overlay |
| Backdrop | None | Smoke backdrop (dimmed background) |
| Beak | Shown (per `show Beak?`) | Hidden — direction forced to `none` |
| Dismissal | Click outside, Escape | Tap backdrop, Escape, back button |

### Mobile display approach

Designers may choose between two mobile approaches based on the content's importance:

| | Option 1: Lightweight flyout | Option 2: Overlay-like |
|---|---|---|
| Backdrop | No | Yes — smoke scrim |
| Scroll lock | No — page stays scrollable | Yes — page non-scrollable |
| Dismiss | Tap outside flyout | Tap backdrop to dismiss |
| Focus trap | No | Yes — `aria-modal="true"` |
| Best for | Low-priority supplementary info | Important disclosures, AI disclaimers |

The default mobile Figma variant uses the overlay-like approach (backdrop + centered panel). If a lightweight flyout without backdrop is preferred, the backdrop layer is omitted and the page remains scrollable. Both are acceptable based on content importance.

### trigger Mode

| Value | Behavior |
|-------|----------|
| `click` (default) | Clicking the trigger toggles the Flyout open/closed |
| `hover` | Hovering the trigger shows the Flyout; leaving hides it. Hover zone extends continuously from trigger to flyout via a padding bridge. |

---

## Visual States

| State | Description |
|-------|-------------|
| Closed | Not rendered; trigger is at rest |
| Open | Floating panel visible adjacent to trigger; beak points toward trigger (if enabled) |

Flyout does not have hover/pressed states of its own. Interactive elements inside the body inherit their own states.

---

## Anatomy

1. **Beak** — Triangular pointer connecting the flyout to its trigger element (desktop only; hidden on mobile). Beak color matches the flyout background. When `showBeak=false`, the gap between trigger and flyout reduces to 8px (from 14px with beak). Gap is derived from: `--serp-flyout-gap: calc(--serp-flyout-beak-height + --smtc-padding-content-xx-small)`.
2. **Backdrop** — Smoke overlay behind the flyout (mobile overlay-like approach only).
3. **Body (Basic)** — Content area using the Basic component; accepts any content.
4. **Container** — Elevated panel with shadow, border radius, and background token.

---

## Usage Rules

- Flyout content must be kept concise — it is a supplementary container, not a primary content area.
- The beak must visually align with the center of the trigger element.
- Flyout must not overflow the viewport; the pointing direction repositions or flips as needed.
- Body content can scroll if it exceeds the maximum height; the `scrollbar` property enables the scroll indicator.
- On mobile, `pointing Direction=none` is forced — the beak is always hidden.
- Flyout must not be nested inside other Flyouts.
- Complex forms or multi-step flows must not be placed inside a Flyout.
- Flyouts must not auto-open on page load; they must respond to user action.
- When using the overlay-like mobile approach, scroll lock and `aria-modal="true"` are both required.

---

## Do / Don't

### Do
- Use the beak to visually connect the Flyout to its trigger element.
- Flip the pointing direction when the Flyout would overflow the viewport.
- Dismiss the Flyout on outside click/tap and Escape key.
- Keep content lightweight — Flyout is for supplementary info, not primary content.
- Use `none` direction when the Flyout has no specific trigger anchor point.

### Don't
- Don't nest Flyouts inside other Flyouts.
- Don't place complex forms or multi-step flows inside a Flyout.
- Don't auto-open Flyouts on page load.
- Don't use Flyout when an Overlay or Drawer is more appropriate for the content volume.
- Don't use the overlay-like mobile approach without also implementing scroll lock and `aria-modal="true"`.

---

## Dark Mode Notes

- Flyout background and text meet WCAG AA contrast in both light and dark themes.
- Beak color matches the flyout background token in each theme.
- Flyout shadow provides sufficient visual separation from underlying content in both themes.

---

## Open Questions

None.
