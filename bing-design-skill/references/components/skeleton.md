---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Skeleton

## Summary

Skeleton is a loading placeholder component that renders a shimmer animation while content loads. It uses 2 keyframes to create the characteristic shimmer effect, providing visual feedback that content is incoming. Skeletons maintain the approximate layout shape of the content they replace, preventing layout shift when content loads.

Skeleton is used when content is loading outside of a card and the approximate shape of incoming content should be suggested. When a generic loading indicator is needed after an action (without layout hints), Spinner is used instead.

**Figma Node ID:** `63315:66847` · **Type:** `COMPONENT_SET` · **Group:** Feedback · **Variants:** 2

**Dependencies:** None

**Consumed by:** Any component that requires a loading state

---

## Variants / Types

### keyframe

| keyframe | Description |
|----------|-------------|
| `1` (default) | Shimmer gradient at starting position |
| `2` | Shimmer gradient at ending position |

The two keyframes represent the start and end states of the shimmer animation cycle. The animation alternates between these two states to produce the shimmer effect.

---

## Visual States

Skeleton has no interactive states. It has a single continuous animation state while loading content is pending. The component is non-interactive in all contexts.

| State | Description |
|-------|-------------|
| Loading | Shimmer animation plays continuously |
| Resolved | Skeleton is replaced by actual content; fades out on transition |

---

## Anatomy

1. **Layer 1** — Primary shimmer placeholder shape matching the content layout.
2. **Layer 2** — Secondary shimmer placeholder for additional content areas.

Skeleton shapes should approximate the layout of the content being loaded: rectangular blocks for text, rounded shapes for avatars or thumbnails.

---

## Usage Rules

- Skeleton shapes must occupy the same space as the content they replace to prevent layout shift.
- The number of skeleton elements must match the expected content structure.
- Skeleton and loaded content must not appear simultaneously in the same section — it is all skeleton or all loaded content.
- Skeleton must not be used as a permanent state; it must always resolve to content or an error state.
- Skeleton must not be shown for content that loads in under approximately 200ms — displaying a skeleton for near-instant loads adds visual noise.
- Skeleton layouts must follow the same responsive rules as the content they represent.
- Animation timing must be consistent across all skeleton instances on the same page.
- `prefers-reduced-motion` must be respected — a static skeleton (no animation) is an acceptable fallback.

---

## Do / Don't

### Do
- Show Skeleton immediately when content begins loading.
- Match skeleton shapes to the approximate layout of real content.
- Transition smoothly from skeleton to loaded content.
- Use consistent shimmer animation speed across all skeleton instances on the page.
- Maintain layout dimensions to prevent content shift on load.

### Don't
- Don't show Skeleton for content that loads nearly instantly.
- Don't use generic rectangles that provide no hint at content structure.
- Don't combine skeleton and loaded content in the same section simultaneously.
- Don't make the shimmer animation too fast (distracting) or too slow (appears frozen).
- Don't use Skeleton as a permanent state — always resolve to content or error.

---

## Dark Mode Notes

- Skeleton background and shimmer gradient must be subtle in both light and dark themes — avoid high-contrast shimmer that draws excessive attention.
- The shimmer effect must be visible in both light and dark themes; token selection ensures adequate contrast in each.

---

## Open Questions

None.
