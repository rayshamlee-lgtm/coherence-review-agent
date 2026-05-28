---
updated: 2026-05-21
source: serp-design-skill v2.1 wiki/foundations/typography.md
stability: beta
---

# Typography

## Summary

All text uses `--bing-smtc-text-global-*` tokens under the MAI naming
convention. Primary font is Segoe UI with a system UI fallback stack;
Ginto Copilot Variable is reserved for Copilot/AI surfaces. Body/3
(14px/22) is the default body size across the product.

## Type scale

| Token | Size / Line-height | Weight | Use |
|---|---|---|---|
| `display/1` | 54/64 | 700 | Hero display |
| `title/2` | 24/32 | 400 | Card/section headers |
| `subtitle/2` | 18/22 | 400 | Algo title, sub-section |
| `body/1` | 18/28 | 400 | Single-answer hero body |
| `body/3` | 14/22 | 400 | **Default body text** |
| `body/3-strong` | 14/22 | 700 | Default card title, inline emphasis |
| `caption/1` | 13/20 | 400 | Attribution, metadata |
| `caption/2` | 11/13 | 400 | Badge labels, micro-labels |

## Naming rules

- No hyphens before numbers: `body3`, not `body-3`.
- Exception: alt variants use hyphens (`body-2-alt-strong`).

## Do / Don't

- **Do:** start with `body/3` for any card body text; `body/3-strong` for card titles.
- **Do:** pair `caption/2` with `foreground/content/neutral/tertiary` for attribution.
- **Do:** use `body/3-strong` for clickable text elements (consistency rule).
- **Don't:** use `body/1` for general card text — reserved for single-answer hero.
- **Don't:** use caption styles as card titles — minimum is `body/3-strong`.
- **Don't:** hardcode font sizes or weights.
- **Don't:** use deprecated `--acf-font-*` tokens.
- **Don't:** use `foreground/primary` color for body text — use `foreground/secondary`.

## Dark mode

Text color tokens auto-switch (white with opacity on dark). No special
dark overrides needed when tokens are used correctly.

## Open questions

None.
