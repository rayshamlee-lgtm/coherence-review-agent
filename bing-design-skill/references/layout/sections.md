---
updated: 2026-05-21
source: serp-design-skill v2.1 wiki/Section-Presets.md
stability: beta
---

# Section Types

## Summary

Each SERP section follows a standard pattern: a section title + a grid
with zone columns. Different section types define different zone
configurations and responsive behaviors.

---

## CGM (Card Grid Magazine) — A + B + C

The primary content grid. Three zones with anchor + accessory cards.

| Tier | Zone A | Zone B | Zone C |
|---|---|---|---|
| XL (12) | span 6 | span 3 | span 3 |
| L (8) | span 3 | span 3 | span 2 |
| M (4) | span 2 + span 2 | stacked | horizontal row 2 |
| S (2) | all stacked | — | — |

- All cards forced to **200px height** with `overflow: hidden`.
- At M, Zone C switches to `flex-direction: row` (side-by-side cards).
- Expand/collapse only at M/S.

---

## Algo (Search Results) — A + C

Standard organic results. No section title.

| Tier | Zone A | Zone C |
|---|---|---|
| XL (12) | span 7 | span 4 (1 spacer) |
| L (8) | span 5 | span 3 |
| M/S | full width | stacked below |

- Zone A = organic results. Zone C = related search pills.
- No expand/collapse.

---

## Wide Answer — A + C (equal split)

The **only** section with an equal 50/50 split between zones.

| Tier | Zone A | Zone C |
|---|---|---|
| XL (12) | span 6 | span 6 |
| L (8) | span 4 | span 4 |
| M/S | full width | stacked below |

- Zone A = full-bleed content (e.g. map, no padding).
- Zone C = 2 cards maximum — no text labels, no headings.
- Expand/collapse only at M/S.

---

## AIG (Copilot Search) — A + C

AI-generated content section.

| Tier | Zone A | Zone C |
|---|---|---|
| XL (12) | span 8 | span 3 (1 spacer) |
| L (8) | span 5 | span 2 |
| M/S | full width | **hidden** (not stacked — `display: none`) |

- Zone C is **completely hidden** at M/S.
- Always expandable (424px collapsed → 3000px expanded).
- Section header has brand logo + action buttons (like, dislike, share, copy).

---

## Carousel — single zone, horizontal scroll

Full-width Zone A with horizontal scroll.

| Breakpoint | Card Size |
|---|---|
| XL–M | 200×200 px |
| S | 160×160 px |

- Hidden scrollbar.
- Navigation chevrons at edges.
- Card hover uses expanding `::before` pseudo-element.

---

## Deep Dive — A + B (pill columns)

Related search pills in two columns.

| Tier | Zone A | Zone B | Gap |
|---|---|---|---|
| XL/L | span 3 | span 3 | 24px |
| M/S | full width | full width | 8px (reduced) |

---

## Section responsive summary

| Section | Zones | Expand/Collapse | Zone C at M/S |
|---|---|---|---|
| CGM | A+B+C | M/S only | horizontal row |
| Algo | A+C | No | stacked below |
| Wide Answer | A+C (50/50) | M/S only | stacked below |
| AIG | A+C | Always | **hidden** |
| Carousel | A only | No | N/A |
| Deep Dive | A+B | No | stacked |

## Do / Don't

- **Do:** check which section type applies before choosing zone configurations.
- **Do:** test expand/collapse behavior at M/S breakpoints.
- **Don't:** assume Zone C is always visible — it hides in AIG at M/S.
- **Don't:** put more than 2 cards in Wide Answer Zone C.
- **Don't:** add a section title to Algo sections.

## Open questions

- **Breaker**: section type referenced in some contexts but not yet
  fully specified upstream.
