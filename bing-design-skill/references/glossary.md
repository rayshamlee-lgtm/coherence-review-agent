---
updated: 2026-05-21
source: serp-design-skill v2.1, Figma HIG
stability: beta
---

# Glossary

Authoritative term list for the Bing design system. Each entry includes a
short definition, stability label, and pointer to the detailed reference.

---

## Page & structure

| Term | Definition | Stability | Reference |
|---|---|---|---|
| **SerpPage** | The top-level shell: header, search bar, scope tabs, menu, dark mode toggle, deep dive, pagination. All built-in; never recreate. | stable | `layout/grid.md` |
| **Header** | Scrolls with the page (never fixed/sticky). Contains logo, search box, scope tabs, rewards avatar. | stable | `layout/grid.md` |

## Layout

| Term | Definition | Stability | Reference |
|---|---|---|---|
| **5-tier grid** | 12 → 8 → 4 → 2 columns via CSS container queries (`@container serp`). Gutter 24px at all tiers. | stable | `layout/grid.md` |
| **Zone A / B / C** | Content-priority columns within a section body. A = primary (hero), B = secondary, C = tertiary. At narrow breakpoints, C drops below and switches to horizontal direction. | stable | `layout/zones.md` |
| **CGM (Card Grid Magazine)** | The magazine layout. A section type with zones A+B+C arranging anchor + accessory cards. Replaced the old "magazine" terminology. | stable | `layout/sections.md` |
| **Wide Answer** | Full-width section spanning all grid columns. No zone sub-division. | stable | `layout/sections.md` |
| **Carousel** | Horizontal-scroll section with overflow cards. | stable | `layout/sections.md` |
| **Algo** | Standard organic results section. Uses zones A+C (no B). | stable | `layout/sections.md` |
| **AIG** | Copilot Search section. | beta | `layout/sections.md` |
| **Deep Dive** | Related-search-pill row at page bottom. | stable | `layout/sections.md` |
| **Breaker** | TBD — upstream naming not yet confirmed. | tbd | `layout/sections.md` |

## Cards

| Term | Definition | Stability | Reference |
|---|---|---|---|
| **Card shell** | The outer container. Three variants: `Basic`, `No Title`, `No Deco`. Two styles: `Accent` (warm bg, no border) vs `Neutral` (white bg, 1px border). | stable | `layout/card-architecture.md` |
| **Card Body (ML Body)** | The content slot inside a card shell. 28+ variants. | stable | `layout/card-architecture.md` |
| **Anchor card** | Primary (largest) card in a magazine grouping. | stable | `layout/card-architecture.md` |
| **Accessory card** | Secondary supporting cards around the anchor. | stable | `layout/card-architecture.md` |
| **`span` / `tall` props** | Card sizing on the grid. `span` = column count, `tall` = row height multiplier. | stable | `layout/card-architecture.md` |
| **BasicAlgo** | The atomic "blue-link" organic result component (favicon + attribution + title + snippet). | stable | `components/basic-algo.md` |
| **mini-magazine** | A card-body type (`ml-body-mini-magazine`). NOT a top-level section archetype. | stable | `layout/card-architecture.md` |

## Tokens & foundations

| Term | Definition | Stability | Reference |
|---|---|---|---|
| **ACF** | Answer Card Framework — the design system / theme layer for Bing SERP. | stable | `foundations/tokens-overview.md` |
| **SMTC** | Semantic Token Catalog — the naming convention for all design tokens. | stable | `foundations/tokens-overview.md` |
| **MAI** | Microsoft AI visual language. ACF tokens map to MAI; code using ACF tokens is portable to MAI experiences. | stable | `foundations/tokens-overview.md` |
| **Token namespaces** | `--smtc-*` (shared neutral), `--bing-smtc-*` (Bing-specific), `--mai-smtc-*` (MAI-specific). | stable | `foundations/tokens-overview.md` |

---

## Open questions

- **Breaker**: upstream naming and behavior not yet confirmed.
- **AIG**: section structure may evolve as Copilot Search matures.
