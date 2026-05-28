---
updated: 2026-05-21
source: serp-design-skill v2.1 wiki/foundations/iconography.md
stability: beta
---

# Iconography

## Summary

ACF uses **Fluent UI System Icons** in outline style by default. Fill
style is reserved for active/selected states only. New icons must be
added to the ACF SERP icon set on demand as individual SVGs — the full
Fluent icon font cannot be imported in SNR.

## Sizes

| Size | Use |
|---|---|
| 12px | Micro-indicators, badges |
| 16px | Inline with body text |
| 20px | **Default** — buttons, card actions |
| 24px | Header actions, prominent controls |

## Color tokens

| Token | Use |
|---|---|
| `--smtc-foreground-content-neutral-primary` | Primary icons |
| `--smtc-foreground-content-neutral-secondary` | Secondary icons |
| `--smtc-foreground-content-brand` | Brand / accent icons |

## Do / Don't

- **Do:** use outline style for all rest-state icons.
- **Do:** switch to fill only for active/selected states.
- **Don't:** use emojis, hand-drawn SVG paths, or non-Fluent icon sets.
- **Don't:** use fill-style icons in default/rest state.

## Dark mode

Icon color tokens auto-switch with other foreground tokens.

## Open questions

None.
