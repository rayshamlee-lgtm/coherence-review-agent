---
updated: 2026-05-21
source: serp-design-skill v2.1 wiki/foundations/spacing.md
stability: beta
---

# Spacing

## Summary

Spacing uses semantic `--smtc-gap-between-content-*` tokens that
automatically resolve to smaller values on mobile via `desktopMobileValue`.
Card internal padding uses a dedicated token. Never hardcode pixel values.

## Key tokens

| Token | Desktop | Mobile | Use |
|---|---|---|---|
| `--smtc-gap-between-content-xx-small` | 4px | 3px | Micro-spacing, attribution |
| `--smtc-gap-between-content-x-small` | 8px | 6px | Default inner gap |
| `--smtc-gap-between-content-small` | 12px | 9px | Related items |
| `--smtc-gap-between-content-medium` | 16px | 12px | Smaller section gap |
| `--smtc-gap-between-content-x-large` | 24px | 16px | Between cards / modules |
| `--mai-smtc-padding-card-default` | 20px | — | Card internal padding |

## Do / Don't

- **Do:** use `x-large` (24px) between sections and cards.
- **Do:** use `x-small` (8px) as the default inner gap.
- **Do:** let `desktopMobileValue` handle responsive scaling automatically.
- **Don't:** hardcode pixel values for spacing.

## Dark mode

Not applicable — spacing tokens are dimensionless.

## Open questions

None.
