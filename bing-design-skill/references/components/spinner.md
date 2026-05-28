---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Spinner

A Spinner is a loading indicator that communicates ongoing processing or content retrieval. It uses three keyframes to represent a smooth animation and supports optional background dimming to overlay existing content during load states. An optional label provides context about what is loading.

**Figma Node ID:** `63315:56771` · **Type:** `COMPONENT_SET` · **Group:** Feedback · **Variants:** 9

---

## Variants

| Property | Values | Default | Description |
|----------|--------|---------|-------------|
| **keyframe** | `1`, `2`, `3` | `1` | Animation keyframe position (Figma representation of the spinning animation) |
| **Background Dim** | `Null`, `Accent`, `Neutral` | `Null` | Background overlay style behind the spinner |
| **show label?** | `True`, `False` | `True` | Whether a loading label is displayed below the spinner |

### Background Dim reference

| Value | Behavior | Use case |
|-------|----------|----------|
| `Null` | No background overlay — spinner floats transparently | Inline loading within a container that already has defined bounds |
| `Accent` | Brand/accent-tinted dimmed overlay | Loading on top of accent or branded content areas |
| `Neutral` | Neutral dimmed overlay | Loading on top of standard content — most common overlay choice |

---

## Visual States

The Spinner is non-interactive. It has no hover or pressed states. The animation plays continuously until the loading operation completes, at which point the system removes it. The keyframe property (1, 2, 3) represents discrete animation positions for Figma design purposes; in implementation, all three frames combine into a continuous rotation.

---

## Anatomy

1. **Spinner icon** — Rotating circular animation indicating loading in progress
2. **Loading text** — Optional descriptive text below the spinner; consumer-editable
3. **Background** — Optional colored overlay covering existing content during load

---

## Usage Rules

- This component is appropriate for short, action-triggered loading states (form submissions, tab switches). Structured content loading or layout loading should use Skeleton or card loading patterns instead.
- The component is appropriate when load time is indeterminate (no progress percentage available).
- It is not appropriate for determinate progress (use a progress bar), for skeleton/placeholder layouts (use skeleton screens), or for operations under 300ms (no indicator needed).
- The `Neutral` Background Dim is the standard choice for overlaying existing content. `Accent` dim should only be used on content areas that are already accent-styled.
- Label text should describe what is loading ("Loading results…", "Updating…") and kept short. The label should be shown when loading context is not obvious from surrounding UI, and hidden when the spinner is in a small container or context is self-evident.
- The spinner should be centered within its loading container. When Background Dim is active, the overlay covers the entire content area being loaded.
- The component must never run indefinitely — implementation must pair it with timeout and error handling.

---

## Do / Don't

### Do
- Use `Neutral` Background Dim for standard content overlay loading.
- Show a label when the user may not understand what is loading.
- Use all 3 keyframes in implementation to create smooth animation.

### Don't
- Show a spinner for operations under 300ms — it creates unnecessary visual noise.
- Use `Accent` dim on neutral backgrounds — match the dim to the content area's style.
- Leave a spinner running indefinitely — pair with timeout and error handling.

---

## Dark Mode Notes

No explicit dark-mode variant properties are defined. The Background Dim overlays (`Accent`, `Neutral`) should use tokens that are already theme-aware. The spinner icon and label color must maintain WCAG AA contrast against the Background Dim overlay in both light and dark themes.

---

## Related Components

| Component | Relationship |
|-----------|-------------|
| **Toast** | Use Toast (Loading style) for transient loading notifications at the page level |
| **Thumbnail** | Spinner may overlay a Thumbnail during image loading |
| **Card** | Primary consumer — displays Spinner during content loading states |

---

## Open questions

None.
