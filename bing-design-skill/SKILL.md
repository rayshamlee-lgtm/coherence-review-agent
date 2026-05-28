---
name: bing-design
description: >
  Authoritative reference for the Bing design system: design tokens,
  foundations, layout rules (5-tier grid, column-based responsive,
  zones, card architecture), 70+ components, and pattern references.
  This is the single source of truth for Bing UI rules. Consult this
  Skill whenever working on Bing search result pages, SERP, answer
  cards (ACF), magazine layouts, or any design that must follow Bing's
  design system — including generating Bing-style mocks/code, reviewing
  a design against Bing standards, looking up specific tokens or
  components, or answering questions about Bing UI structure. Use even
  when the user does not explicitly say "Bing" — if the context
  involves Bing SERP, answer cards, or Microsoft search surfaces, load
  this Skill.
metadata:
  stability: beta
  updated: 2026-05-21
---

# Bing Design System — Reference

Authoritative, neutral reference for the **Bing SERP design system** built
on ACF (Answer Card Framework). This Skill describes the system; it does
not generate or review designs. Consuming agents decide *what to do*
with this information.

---

## What this Skill is

- A **standardized design-system reference**, comparable to a product HIG.
- A **read-only rulebook**: loading it makes rules available; it performs
  no actions.
- Organized for **progressive disclosure**: this file is the map; details
  live in `references/`.

## What this Skill is NOT

- Not a code generator (no TSX, no setup scripts).
- Not a review agent or coherence checker.
- Not a segment-knowledge source (segment rules are maintained separately).
- Not a workflow guide (it describes rules, not Figma process).

---

## Non-negotiable principles

1. **All values are token-driven.** Never hardcode hex, px, or font values.
   Use SMTC semantic tokens (`--smtc-*`, `--bing-smtc-*`, `--mai-smtc-*`).
2. **Container queries, not media queries.** Responsive layout uses
   `@container serp`, never `@media`.
3. **Cards are flat at rest.** Elevation 0 at rest; Level 1 on hover only.
   Hover feedback is background-color change, not shadow.
4. **Dark mode is automatic.** Semantic tokens swap values via
   `class="dark"` on `<html>`. Never hardcode dark-mode colors.
5. **Header scrolls with the page.** Never fixed or sticky.

---

## System overview

The design system has four layers. Each maps to a `references/` subdirectory:

```
┌─────────────────────────────────────────────────────┐
│  Patterns        — Recurring solutions              │  references/patterns/
│  ┌─────────────────────────────────────────────────┐│
│  │  Components   — 70+ UI building blocks          ││  references/components/
│  │  ┌─────────────────────────────────────────────┐││
│  │  │  Layout    — Grid, zones, card architecture  │││  references/layout/
│  │  │  ┌─────────────────────────────────────────┐│││
│  │  │  │  Foundations — Tokens, color, type, etc. ││││  references/foundations/
│  │  │  └─────────────────────────────────────────┘│││
│  │  └─────────────────────────────────────────────┘││
│  └─────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```

---

## Key concepts (mini-glossary)

These are the most critical terms. Full glossary: [`references/glossary.md`](references/glossary.md).

| Term | Definition |
|---|---|
| **ACF** | Answer Card Framework — the design system / theme layer for Bing SERP. |
| **SMTC** | Semantic Token Catalog — the token naming convention aligned to MAI. |
| **CGM** | The magazine grid layout (formerly just "magazine"). A section type, not a card type. |
| **Zone A / B / C** | Content-priority columns within a section: primary / secondary / tertiary. |
| **Card Body (ML Body)** | The content slot inside a card shell. 28+ variants (BasicAlgo, NewsAnswer, MiniMagazine, etc.). |
| **Anchor card** | The primary (largest) card in a magazine grouping. |
| **Accessory card** | Supporting cards around the anchor. |
| **5-tier grid** | 12 → 8 → 4 → 2 columns via `@container serp` breakpoints. |

---

## Navigation table

| I want to… | Read |
|---|---|
| Look up a token name or value | [`assets/token-catalog.json`](assets/token-catalog.json) |
| Reverse-lookup hex → token | [`assets/color-lookup.json`](assets/color-lookup.json) |
| Find which tokens a component uses | [`assets/component-catalog.json`](assets/component-catalog.json) |
| Understand the token system | [`references/foundations/tokens-overview.md`](references/foundations/tokens-overview.md) |
| Learn color rules | [`references/foundations/color.md`](references/foundations/color.md) |
| Learn typography rules | [`references/foundations/typography.md`](references/foundations/typography.md) |
| Learn spacing rules | [`references/foundations/spacing.md`](references/foundations/spacing.md) |
| Learn corner radius rules | [`references/foundations/radius.md`](references/foundations/radius.md) |
| Learn elevation rules | [`references/foundations/elevation.md`](references/foundations/elevation.md) |
| Learn motion / animation rules | [`references/foundations/motion.md`](references/foundations/motion.md) |
| Learn icon rules | [`references/foundations/iconography.md`](references/foundations/iconography.md) |
| Learn accessibility rules | [`references/foundations/accessibility.md`](references/foundations/accessibility.md) |
| Understand the responsive grid | [`references/layout/grid.md`](references/layout/grid.md) |
| Understand zone structure | [`references/layout/zones.md`](references/layout/zones.md) |
| Understand card architecture | [`references/layout/card-architecture.md`](references/layout/card-architecture.md) |
| Understand section types (magazine, wide answer, carousel…) | [`references/layout/sections.md`](references/layout/sections.md) |
| Browse all components | [`references/components/index.md`](references/components/index.md) |
| Look up a specific component | `references/components/{name}.md` |
| See recurring patterns | [`references/patterns/index.md`](references/patterns/index.md) |
| See all terms defined | [`references/glossary.md`](references/glossary.md) |

---

*This Skill never tells you what to do with the information. Consult the
navigation table above and drill into `references/` based on your task.*
