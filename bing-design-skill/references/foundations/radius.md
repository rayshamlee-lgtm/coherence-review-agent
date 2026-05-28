---
updated: 2026-05-21
source: serp-design-skill v2.1 wiki/foundations/shape.md
stability: beta
---

# Corner Radius

## Summary

Corner radius is determined by usage first, element size second. All radii
use dedicated semantic tokens from the MAI corner collection. ACF uses 8px
as the default control radius (MAI is moving to 12px, but ACF holds at
8px pending alignment).

## Key tokens

| Token | Value | Use |
|---|---|---|
| `--mai-smtc-corner-card-default` | 24px | All card types, overlays, drawers |
| `--smtc-corner-ctrl-lg-rest` | 16px | Medium-to-large outer elements |
| `--smtc-corner-ctrl-rest` | 8px | Buttons, thumbnails, controls (default) |
| `--smtc-corner-ctrl-sm-rest` | 4px | Badges, icons ≤20px |
| `--smtc-corner-circular` | 9999px | Pills, avatars, progress bars |

## Size rule

- Elements ≤20px → `corner-ctrl-sm-rest` (4px)
- Elements >20px → `corner-ctrl-rest` (8px)

## Do / Don't

- **Do:** use `corner-card-default` (24px) for every card, expansion card, overlay, and drawer.
- **Do:** match radius to element size using the size rule above.
- **Don't:** hardcode radius values.
- **Don't:** use inner-element tokens on outer page-level elements.

## Dark mode

Not applicable — shape tokens are dimensionless.

## Open questions

None.
