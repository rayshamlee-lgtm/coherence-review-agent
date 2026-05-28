---
updated: 2026-05-21
source: serp-design-skill v2.1 wiki/Card-System.md
stability: beta
---

# Card Architecture

## Summary

Every card has two parts: **shell** (container) and **body** (content).
The shell controls visual treatment (background, border, radius, padding).
The body is the content slot. Cards do not size themselves — height comes
from zone/grid context.

## Anatomy

```
┌─────────────────────────────────────────┐
│ Card Shell (border-radius, bg)          │
│ ┌─────────────────────────────────────┐ │
│ │ CardTitle (optional, basic only)    │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ CardBody (content slot)             │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## Three shell types

| Shell Type | Background | Padding | Title | Use |
|---|:---:|:---:|:---:|---|
| **Basic** | Yes | Yes | Yes | Text-heavy content with title header |
| **No Title** | No | Yes | No | Structured data, no title needed |
| **No Deco** | No | No | No | Full-bleed content (images, videos, maps) |

## Two card styles

| Style | Background Token | Border | Use |
|---|---|---|---|
| **Accent** (default) | `--bing-smtc-background-card-on-primary-alt-rest` | None | All cards by default |
| **Neutral** | `--smtc-background-card-on-primary-default-rest` | `1px solid var(--smtc-stroke-card-on-primary-rest)` | Algo cards or specifically designed |

**Critical:** Neutral cards **must** have the stroke border. Accent cards have **no** border.

## Shell → body mapping

| Shell | Body Types |
|---|---|
| Basic | text, algo |
| No Title | singleQuickFact, entities, listView, multiNews |
| No Deco | image, video, multiQuickFact, map, singleNews, singleLocation, multiLocation, shopping |

## 14 card body types

| Body Type | Shell | Description |
|---|---|---|
| `text` | Basic | Text-heavy content with optional small image |
| `algo` | Basic | Search result: favicon, title, URL, snippet |
| `singleQuickFact` | No Title | Short factual answer |
| `entities` | No Title | Related entities carousel |
| `listView` | No Title | Navigable list items |
| `multiNews` | No Title | Series of news items |
| `image` | No Deco | Visual content, photos, galleries |
| `video` | No Deco | Video thumbnail + play button + duration |
| `multiQuickFact` | No Deco | Collection of quick facts in a grid |
| `map` | No Deco | Full-bleed geographical display |
| `singleNews` | No Deco | Single headline news item |
| `singleLocation` | No Deco | Single place listing |
| `multiLocation` | No Deco | Multiple related locations |
| `shopping` | No Deco | Product listings with images + prices |

## Height system

Row height = **88px**, gap = **24px**.

| Tall Variant | Body Height | Rows | Section Height |
|---|---|:---:|---|
| `standard` | ~352px | 4 rows | 424px |
| `standard-small` | ~160px | 2 rows | 200px |

Height rules:
- 1 card in a standard section → `standard` (4-row)
- 2 cards stacked in a standard section → both `standard-small` (2-row each)

## Width × height matrix

Every card body has two layout axes:

| Dimension | Values | Determined by |
|---|---|---|
| **Width** | Wide / Narrow | Zone width at runtime (`@container zone`) |
| **Height** | Tall / Short | `tall` prop |

### Four layout modes

| Mode | When | Layout |
|---|---|---|
| Wide + Tall | span 6 + standard | V-stack: image top, text below |
| Wide + Short | span 6 + standard-small | H-strip: image left, text right |
| Narrow + Tall | span 2 + standard | Single column, stacked |
| Narrow + Short | span 2 + standard-small | Ultra-minimal, 1–2 items |

### Span → width mapping

- **span 6** → almost always **wide** (≥548px)
- **span 2** → almost always **narrow** (~180px)
- **span 3** → starts **narrow** (~242px) → becomes **wide** during zone reflow

## Anchor and accessory cards

- **Anchor card**: primary (largest) card in a magazine grouping. Typically
  span 6, positioned in Zone A.
- **Accessory card**: secondary supporting cards. Typically span 2–3,
  positioned in Zone B or C.

Every design must provide both an anchor card and an accessory card variant.

## Do / Don't

- **Do:** always provide both anchor and accessory card variants.
- **Do:** test all 4 layout modes (wide/narrow × tall/short).
- **Do:** use `overflow: hidden` on all card shells.
- **Don't:** size cards explicitly — let zone/grid context determine height.
- **Don't:** add borders to accent cards.
- **Don't:** omit the stroke border on neutral cards.

## Open questions

None.
