---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Section / Body Type / Algo

**Figma Node ID:** `129215:41700` · **Type:** `COMPONENT_SET`  
**Group:** Layout · **Tier:** Section · **Variants:** 4  
**Dependencies:** Card components, ML Body components, Zone system  
**Consumed by:** Page body

---

## Summary

The Algo body type is a 2-zone layout for algorithm-driven search result sections. Zone A serves as the ML (Mainline) — the primary results column — while Zone C is the RR (Right Rail) for sidebar content such as knowledge panels or contextual information. ML Body components can be slotted into Zone A between standard algo results.

This component is appropriate for standard search result pages with mainline + right rail layout, and when the section contains algorithm-ranked results (blue links, enriched results). It is not intended for curated or editorial content, Q&A or Copilot answer experiences, or sections where no right rail is needed.

---

## Variants / Types

| Property | Values | Default | Description |
|----------|--------|---------|-------------|
| **column** | `12`, `8`, `4`, `2` | `12` | Number of grid columns; maps to Page breakpoint |

---

## Responsive Zone Layout

| Column | Zone A (ML — Mainline) | Zone C (RR — Right Rail) | Layout |
|--------|----------------------|------------------------|--------|
| **12** | span 7 | span 4 | Side-by-side (1 spacer col) |
| **8** | span 5 | span 3 | Side-by-side |
| **4** | span 4 | span 4 | Stacked (A above C) |
| **2** | span 2 | span 2 | Stacked (A above C) |

### Breakpoint mapping

| Page breakpoint | Page columns | Algo column variant | Zone C |
|----------------|-------------|-------------------|--------|
| ≥1520px | 12 | `column=12` | Visible (right rail) |
| 1519–1392px | 12 | `column=12` | Visible (right rail) |
| 1391–1025px | 8 | `column=8` | Visible (narrower rail) |
| 1024–641px | 4 | `column=4` | Stacks below Zone A |
| ≤640px | 2 | `column=2` | Stacks below Zone A |

---

## Zone Roles

| Zone | Abbreviation | Role | Content |
|------|-------------|------|---------|
| **A** | ML (Mainline) | Primary results column | Algo results, enriched cards, ML Body components |
| **C** | RR (Right Rail) | Sidebar | Knowledge panels, entity cards, contextual content |

### ML Body component slotting

ML Body components (enriched experiences such as maps, calculators, converters) slot into Zone A between standard algo results. They occupy the full mainline width and follow the same responsive behavior as Zone A.

| ML Body Module | Description |
|---------------|-------------|
| **Mini Magazine** | Compact magazine-style card cluster |
| **Video Answer** | Inline video answer experience |
| **PAA Answer** | "People Also Ask" expandable answer |
| **Basic Algo** | Standard enriched algo result block |

---

## Anatomy

1. **Zone A** — Primary result slot for algorithmic content cards and ML Body modules
2. **Zone C** — Secondary slot for supplementary content or sidebar

---

## Visual States

This component is a structural container. Interaction states are delegated to child components. Layout responds to viewport changes via responsive breakpoints.

---

## Usage Rules

- Zone A (ML) contains the primary algorithm results in ranked order. Zone C (RR) holds contextual sidebar content — knowledge panels, entity info, ads.
- ML Body components interrupt the algo result flow in Zone A for enriched experiences.
- Section Title always precedes the Algo body. Internal gap between zones follows the 24px grid gap.
- At `column=8`, both zones widen proportionally — the Algo body is the only body type where Zone C gets a wider span ratio at the 8-col breakpoint.
- At `column=4` and `column=2`, Zone C stacks below Zone A. Right Rail content should remain meaningful when stacked.
- DOM reading order must be maintained: Zone A first, then Zone C.

### Do
- Use Algo body for standard SERP result layouts with mainline + right rail.
- Test both side-by-side (12, 8) and stacked (4, 2) layouts thoroughly.
- Ensure ML Body components integrate seamlessly within the Zone A result flow.
- Use design-system tokens for all spacing and typography.

### Don't
- Place editorial/curated content in the Algo body — use Magazine instead.
- Hardcode zone widths in px — bind to container grid span.
- Assume the right rail is always visible — at column=4 and column=2 it stacks.
- Reorder DOM for visual layout — preserve semantic mainline → right rail order.
- Add non-ACF wrappers inside the grid structure.

---

## Dark Mode Notes

All result content meets WCAG AA contrast in both light and dark themes. Links within algo results must be distinguishable by more than color alone. No Algo-specific dark mode tokens beyond those inherited from child components.

---

## Related Components

| Component | Relationship |
|-----------|-------------|
| **Section / title** | Sibling — always precedes Algo body |
| **Section / footer** | Sibling — always follows Algo body |
| **Section body / magazine** | Alternative — for curated content layouts |
| **Section body / Q&A** | Alternative — for Q&A/answer layouts |
| **Page** | Parent — breakpoints determine which column variant renders |
| **ML Body components** | Child — slot into Zone A between standard results |

---

## Open questions

None.
