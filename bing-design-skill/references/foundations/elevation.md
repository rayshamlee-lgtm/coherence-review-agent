---
updated: 2026-05-21
source: serp-design-skill v2.1 wiki/foundations/elevation.md
stability: beta
---

# Elevation

## Summary

Elevation uses five levels (0–4) mapped to named shadow tokens. Cards at
rest are flat (Level 0); hover lifts to Level 1. Higher levels are for
overlays and system UI.

## Levels

| Level | Token | Use |
|---|---|---|
| 0 | (none) | Card at rest — flat, no shadow |
| 1 | `elevation-level-1` | Card hover, subtle lift |
| 2 | `elevation-level-2` | Flyout, dropdown, tooltip |
| 3 | `elevation-level-3` | Overlay / modal, drawer |
| 4 | `elevation-level-4` | Toast notifications |

## Z-index ranges

| Range | Use |
|---|---|
| 0 | Content |
| 100 | Dropdown |
| 200 | Overlay backdrop |
| 300 | Modal / drawer |
| 400 | Toast |

## Do / Don't

- **Do:** keep cards flat (Level 0) at rest.
- **Do:** apply Level 1 only on hover via background-color change + shadow.
- **Don't:** apply elevation to a card at rest.
- **Don't:** trigger elevation on card hover alone — combine with background-color change.

## Dark mode

Shadow tokens auto-switch; dark mode shadows are more subtle. Handled
automatically by the MAI elevation system.

## Open questions

None.
