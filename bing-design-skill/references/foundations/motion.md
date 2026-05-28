---
updated: 2026-05-21
source: serp-design-skill v2.1 wiki/foundations/motion.md
stability: beta
---

# Motion

## Summary

All transitions use a single standard duration of 200ms with a consistent
cubic-bezier easing. Motion is purposeful and minimal — animate only to
provide interaction feedback. Respect `prefers-reduced-motion`.

## Key tokens

| Token | Value | Use |
|---|---|---|
| `--smtc-duration-short-02` | 200ms | All state transitions |
| `--bing-smtc-animation-ease-default` | `cubic-bezier(0.3, 0, 0.3, 1)` | Default easing |

## Do / Don't

- **Do:** animate `background-color` and `box-shadow` on hover/state changes at 200ms.
- **Do:** include a `prefers-reduced-motion` override that collapses all durations to ~0.
- **Don't:** use bouncing, spring physics, or variable easing curves.
- **Don't:** add decorative animations with no interaction feedback purpose.

## Dark mode

Tokens auto-switch; no separate dark motion values needed.

## Open questions

None.
