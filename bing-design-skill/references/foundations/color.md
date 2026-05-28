---
updated: 2026-05-21
source: serp-design-skill v2.1 wiki/foundations/color.md
stability: beta
---

# Color

## Summary

The ACF color system is fully token-driven using semantic variables that
auto-switch between light/dark mode and across themes. All tokens follow
a layered architecture (Root → Mode → Theme → MAI Collection → Partner).
Never hardcode hex values.

## Key tokens

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bing-smtc-background-card-on-primary-alt-rest` | #f8f4f1 | #232738 | Accent card background |
| `--smtc-background-card-on-primary-default-rest` | #ffffff | #1b1a19 | Neutral card background |
| `--smtc-background-web-page-primary` | #ffffff | rgba(27,26,25,1) | Page background |
| `--smtc-foreground-content-neutral-primary` | rgba(0,0,0,1) | rgba(255,255,255,1) | Primary text |
| `--smtc-foreground-content-neutral-secondary` | rgba(0,0,0,0.8) | rgba(255,255,255,0.8) | Body text |
| `--bing-smtc-foreground-content-neutral-tertiary` | rgba(0,0,0,0.6) | rgba(255,255,255,0.6) | Caption / metadata |
| `--smtc-ctrl-link-foreground-brand-rest` | #4007a2 | #82c7ff | Links |
| `--smtc-stroke-card-on-primary-rest` | rgba(0,0,0,0.10) | rgba(255,255,255,0.10) | Neutral card border |

## Card color rules

- **Accent cards**: use `--bing-smtc-background-card-on-primary-alt-*`. No border.
- **Neutral cards**: use `--smtc-background-card-on-primary-default-*`. Always apply
  `1px solid var(--smtc-stroke-card-on-primary-rest)` border.

## Do / Don't

- **Do:** use accent-card background tokens for warm/branded cards.
- **Do:** always pair neutral cards with the stroke border token.
- **Don't:** add a border to accent cards.
- **Don't:** use `foreground/content/brand` for text on brand buttons — use `foreground/ctrl/on-brand/rest`.
- **Don't:** use `stroke/ctrl/neutral/rest` for dividers — use `stroke/divider/default`.
- **Don't:** hardcode hex values in any context.

## Dark mode

All semantic tokens auto-swap via `class="dark"` on `<html>`. Dark accent
card background is theme-dependent (`#232738` for copilotNeutral). Never
hardcode dark hex values.

## Open questions

None.
