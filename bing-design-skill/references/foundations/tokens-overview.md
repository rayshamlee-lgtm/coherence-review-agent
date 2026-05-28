---
updated: 2026-05-21
source: serp-design-skill v2.1 wiki/foundations/tokens-mai.md, wiki/Token-System.md
stability: beta
---

# Token System Overview

## Summary

The ACF token system uses the **SMTC (Semantic Token Catalog)** naming
convention, designed to map to the **MAI (Microsoft AI)** visual language.
Code written with ACF tokens is portable across Bing and MAI experiences.

## Three namespaces

| Prefix | Scope | Example |
|---|---|---|
| `--smtc-*` | Shared neutral tokens | `--smtc-foreground-content-neutral-primary` |
| `--bing-smtc-*` | Bing SERP-specific tokens | `--bing-smtc-background-card-on-primary-alt-rest` |
| `--mai-smtc-*` | MAI-specific tokens | `--mai-smtc-padding-card-default` |

## Token naming pattern

```
--{prefix}-{layer}-{element}-{variant}-{state}
```

Layers: `background`, `foreground`, `stroke`, `fill`, `shadow`.

## Value types

Production contains 487 tokens in 4 value types:

| Type | Count | Behavior |
|---|---|---|
| `themeValue` | 120 | Theme-dependent; always use `copilotNeutral` values |
| `lightDarkValue` | 178 | Auto-switch between light and dark mode |
| `basicValue` | 123 | Static, mode-independent |
| `desktopMobileValue` | 65 | Auto-scale between desktop and mobile sizes |

## Usage rule

Always wrap values in `var(--token, fallback)`:

```css
color: var(--smtc-foreground-content-neutral-primary, rgba(0,0,0,1));
```

## Do / Don't

- **Do:** always use semantic tokens; never hardcode hex, px, or font values.
- **Do:** use `copilotNeutral` for `themeValue` tokens.
- **Don't:** add new tokens to the `fallback` layer — it is fading out.
- **Don't:** use legacy prefixes (`--acf-font-*`, `--acf-color-*`, `--acf-spacing-*`, `--acf-radius-*`).
- **Don't:** use hyphens before numbers in typography token names (`body3`, not `body-3`).

## JSON lookup

For precise token queries, use the JSON catalogs in `assets/`:
- `token-catalog.json` — all tokens with light + dark values
- `color-lookup.json` — reverse: hex → token name
- `component-catalog.json` — component → tokens it uses

## Open questions

None.
