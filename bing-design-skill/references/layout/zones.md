---
updated: 2026-05-21
source: serp-design-skill v2.1 wiki/foundations/grid-layout.md, bing-design-skill-1.2 page-zoning.md (rationale only)
stability: beta
---

# Zones

## Summary

Zones are **content-priority columns** within a section body. Zone A is
the primary (hero) content, Zone B is secondary, Zone C is tertiary.
Think in column spans, not pixels — zones are inherently responsive.

**Important disambiguation:** "Zone" in this context means horizontal
columns within a section. It is unrelated to vertical height zones used
in some other design systems.

## Zone layouts by section type

### Magazine (CGM) — 3 zones: A + B + C

| Tier | Zone A | Zone B | Zone C |
|---|---|---|---|
| XL (12 cols) | span 6 | span 3 | span 3 |
| L (8 cols) | span 4 | span 2 | span 2 |
| M (4 cols) | span 2 + span 2 | stacked | horizontal row 2 |
| S (2 cols) | span 2 | span 2 | span 2 (all stacked) |

### Algo — 2 zones: A + C

| Tier | Zone A (Mainline) | Zone C (Right Rail) |
|---|---|---|
| XL (12 cols) | span 7 | span 4 (1 spacer) |
| L (8 cols) | span 5 | span 3 |
| M (4 cols) | span 4 | span 4 (stacked) |
| S (2 cols) | span 2 | span 2 (stacked) |

The spacer column between A and C in Algo at XL provides visual
breathing room — it is intentional, not a layout error.

### Q&A — 2 zones: A + C

| Tier | Zone A | Zone C |
|---|---|---|
| XL (12 cols) | span 8 | span 3 (1 spacer) |
| L (8 cols) | span 6 | span 2 |
| M (4 cols) | span 4 | hidden |
| S (2 cols) | span 2 | hidden |

## Content priority

- **Zone A**: primary content — hero card, anchor card, main answer.
- **Zone B**: secondary content — supporting cards, related info.
- **Zone C**: tertiary content — right rail, related searches, ads.

At narrow breakpoints (M/S), Zone C drops below A and switches to
horizontal direction, or hides entirely (Q&A layout).

## Do / Don't

- **Do:** design zone content by priority (A = most important).
- **Do:** test zone stacking behavior at every breakpoint.
- **Don't:** assume Zone C is always visible — it hides at M/S in Q&A.
- **Don't:** put critical content only in Zone C.

## Open questions

None.
