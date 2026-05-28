---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Section / Body Type / Magazine

**Figma Node ID:** `129004:24359` · **Type:** `COMPONENT_SET`  
**Group:** Layout · **Tier:** Section · **Variants:** 4  
**Dependencies:** Card components (Anchor, Accessory), Zone system  
**Consumed by:** Page body

---

## Summary

The Magazine body type is a 3-zone grid layout for rich, curated content sections. It arranges cards into zones A (Anchor), B (Accessory), and C (Accessory), providing a visually engaging magazine-style layout. The 4 column variants map 1:1 to the Page breakpoints, enabling fully responsive section behavior.

This component is appropriate for curated, editorially-arranged content sections (e.g., "Top stories", "Trending now") and when a primary Anchor card with supporting Accessory cards is needed. It is not intended for algorithm-driven search results, Q&A or Copilot answer layouts, or content that is a single flat list with no zone hierarchy.

---

## Variants / Types

| Property | Values | Default | Description |
|----------|--------|---------|-------------|
| **column** | `12`, `8`, `4`, `2` | `12` | Number of grid columns; maps to Page breakpoint |

---

## Responsive Zone Layout

| Column | Zone A (Anchor) | Zone B (Accessory) | Zone C (Accessory) | Layout |
|--------|----------------|-------------------|-------------------|--------|
| **12** | span 6 | span 3 | span 3 | A + B + C side-by-side |
| **8** | span 3 | span 3 | span 2 | A + B + C side-by-side (proportional) |
| **4** | span 2 (row 1) | span 2 (row 1) | span 4 / `1/-1` (row 2, horizontal) | A + B share row 1; C reflows below full-width |
| **2** | span 2 | span 2 | span 2 | All zones stacked vertically (A → B → C) |

### Breakpoint mapping

| Page breakpoint | Page columns | Magazine column variant |
|----------------|-------------|----------------------|
| ≥1520px | 12 | `column=12` |
| 1519–1392px | 12 | `column=12` |
| 1391–1025px | 8 | `column=8` |
| 1024–641px | 4 | `column=4` |
| ≤640px | 2 | `column=2` |

---

## Zone Roles

| Zone | Role | Card type | Position |
|------|------|-----------|----------|
| **A** | Anchor | Large primary card — the dominant visual element | Left / top |
| **B** | Accessory | Medium supporting card — complements Zone A | Right of A (desktop) or below A (mobile) |
| **C** | Accessory | Small supporting card(s) — tertiary content | Far right (desktop) or bottom (mobile) |

---

## Anatomy

1. **Zone A** — Primary visual/content area (typically a hero image card or Answer that directly matches the query)
2. **Zone B** — Secondary content area (supplementary cards)
3. **Zone C** — Tertiary content area (supporting cards or Explore more)

---

## Visual States

This component is a structural container. Interaction states are delegated to child card components within each zone. Layout responds to viewport changes via responsive breakpoints. No intrinsic hover, focus, or pressed states exist at the Magazine body level.

---

## Usage Rules

- Zone A contains the highest-priority content for the section; Zones B and C hold supporting/contextual cards.
- Zone A (Anchor card) is sized **6×4**, **5×4**, or **4×4**. Zones B and C may be **×4** or **×2** height but must not be wider than Zone A.
- Section Title always precedes the Magazine body; Section Footer always follows it.
- Internal gap between zones follows the 24px grid gap. Cards within zones use Flexbox layout — they bind to the container grid span rather than hardcoded widths.
- At `column=4`, all zones stack at full span (span 4). Zone C goes below B.
- At `column=2` (mobile), all zones stack in A → B → C order.
- Cards must be designed for both Anchor and Accessory sizes per the Dual Card Requirement.

### Do
- Pair the Magazine body with Section Title and Section Footer for a complete section.
- Populate Zone A with an Anchor card and Zones B/C with Accessory cards.
- Test layouts at all 4 column variants to verify card reflow behavior.
- Ensure cards maintain consistent keyboard and screen reader behavior as content collapses.

### Don't
- Leave zones empty — if a zone has no content, consider a different body type.
- Hardcode card widths — cards must respond to zone span signals.
- Reorder DOM to "fit" a layout shape — preserve semantic reading order (A → B → C).
- Add non-ACF wrappers inside the grid structure.
- Use Magazine body for single-card sections — it is designed for multi-zone layouts.

---

## Dark Mode Notes

All card content within zones meets WCAG AA contrast in both light and dark themes. Zone backgrounds (if themed) must maintain sufficient contrast with card surfaces. No Magazine-specific dark mode tokens exist beyond those inherited from child card components.

---

## Related Components

| Component | Relationship |
|-----------|-------------|
| **Section / title** | Sibling — always precedes Magazine body |
| **Section / footer** | Sibling — always follows Magazine body |
| **Section body / algo** | Alternative — for algorithm result layouts |
| **Section body / Q&A** | Alternative — for Q&A/Copilot answer layouts |
| **Page** | Parent — breakpoints determine which column variant renders |
| **Card (Anchor)** | Child — populates Zone A |
| **Card (Accessory)** | Child — populates Zones B and C |
| **Horizontal Scroller** | May wrap card content within zones for overflow scenarios |

---

## Open questions

None.
