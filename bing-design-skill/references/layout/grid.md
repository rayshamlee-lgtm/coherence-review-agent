---
updated: 2026-05-21
source: serp-design-skill v2.1 wiki/foundations/grid-layout.md
stability: beta
---

# Grid System

## Summary

ACF uses a **4-tier responsive grid** based on CSS container queries
(`@container serp`). The grid uses a fixed 24px gutter at all tiers and
caps content at **1200px** max width. Header scrolls with the page —
never fixed or sticky.

## Breakpoints

| Tier | Width | Columns | Body Padding | Content Width |
|---|---|:---:|---|:---:|
| **XL** | ≥1392px (full ≥1520px) | 12 | Fluid 48–160px | 1200px |
| **L** | 1025–1391px | 8 | Fluid 48–96px | ~905px |
| **M** | 641–1024px | 4 | 36px fixed | ~569px |
| **S** | ≤640px | 2 | 24px fixed | ~274px |

- Column drop: 12 → 8 → 4 → 2
- Gutter: **24px** at all breakpoints
- Grid row height: **88px** with 24px gap

## Page structure

```
Page
├── Header (scrolls — NEVER fixed/sticky)
│   ├── Header top (logo + search bar + right actions)
│   └── Scope tabs
├── Body (vertical flex)
│   ├── Section × N (max-width: 1200px each)
│   │   ├── Section title
│   │   └── Grid (CSS grid)
│   │       └── Zone A / B / C
│   └── Pagination
└── Footer
```

## Responsive element behavior

| Element | Desktop (XL/L) | Tablet (M) | Mobile (S) |
|---|---|---|---|
| Header right group | Visible | Collapsed | Hidden |
| Drawer | 424px wide | 424px wide | Full-screen |
| Overlay | Centered modal | 688×424 modal | Full-screen (bottom drawer) |
| Body gap | 36px | 36px | 24px |

## Grid row types

| Row Type | Rows | Height | Use |
|---|:---:|:---:|---|
| 4-row | 4 × 88px | 424px | Magazine (CGM), Wide Answer |
| 2-row | 2 × 88px | 200px | Short sections |
| Auto | auto | Content | AIG, Algo, Carousel, Deep Dive |

## Alignment system

Three elements share **identical** left padding at every breakpoint:

1. Header left (logo + search bar left edge)
2. Scope tabs (tab strip left edge)
3. Body (content left/right edge)

Values: fluid clamp at XL/L, fixed 36/24px at M/S.

## Do / Don't

- **Do:** think in column spans, not pixels.
- **Do:** use `@container serp` for all responsive rules.
- **Do:** keep header, scope tabs, and body left edges pixel-aligned.
- **Don't:** use `@media` queries — use `@container serp`.
- **Don't:** fix or sticky the header.
- **Don't:** exceed 1200px max content width.

## Open questions

None.
