---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Section / Body Type / Wide Answer

**Figma Node ID:** `133967:48310` · **Type:** `COMPONENT_SET`  
**Group:** Layout · **Tier:** Section · **Variants:** 8  
**Dependencies:** Card components (Answer Card, Map Card, Splits Card, etc.), Zone system  
**Consumed by:** Page body

---

## Summary

The Wide Answer body type is a 2-zone grid layout for single-purpose, focused answer sections. Unlike Magazine (which has 3 zones for broad multi-topic content), Wide Answer uses only Zone A (hero anchor) and Zone C (supporting content), making it ideal for queries with a clear singular intent — for example, "ski in Banff" (map + featured locations) or "Tom Hanks news" (hero image slideshow + news items).

The 4 column variants map 1:1 to the Page breakpoints. The `height` property controls whether Zone A renders at full height (4 rows) or a reduced height (2 rows) at stacked breakpoints.

Wide Answer vs. Magazine: Magazine is broad (A + B + C) — multiple topics, multiple card types. Wide Answer is focused (A + C) — single purpose, one hero + supporting details.

This component is appropriate for focused, single-intent queries where one hero card dominates. It is not appropriate for broad multi-topic sections (use Magazine), algorithm-driven results (use Algo), Q&A/Copilot layouts (use Q&A), or when Zone B is needed (use Magazine).

---

## Variants / Types

| Property | Values | Default | Description |
|----------|--------|---------|-------------|
| **column** | `12`, `8`, `4`, `2` | `12` | Number of grid columns; maps to Page breakpoint |
| **height** | `default`, `fallback` | `default` | Zone A height behavior at col 4/2: default = 4 rows, fallback = 2 rows |

---

## Responsive Zone Layout

### height=default

| Column | Zone A (Hero) | Zone C (Supporting) | Layout | Total Height |
|--------|--------------|--------------------|---------| -------------|
| **12** | span 6, rows 1–4 | span 6, rows 1–4 | Side-by-side | 424px |
| **8** | span 4, rows 1–4 | span 4, rows 1–4 | Side-by-side | 424px |
| **4** | span 4, rows 1–4 | span 4, rows 5–8 | Stacked | 872px |
| **2** | span 2, rows 1–4 | span 2, rows 5–8 | Stacked | 872px |

### height=fallback

| Column | Zone A (Hero) | Zone C (Supporting) | Layout | Total Height |
|--------|--------------|--------------------|---------| -------------|
| **12** | span 6, rows 1–4 | span 6, rows 1–4 | Side-by-side | 424px |
| **8** | span 4, rows 1–4 | span 4, rows 1–4 | Side-by-side | 424px |
| **4** | span 4, rows 1–2 | span 4, rows 3–6 | Stacked (A reduced) | 648px |
| **2** | span 2, rows 1–2 | span 2, rows 3–6 | Stacked (A reduced) | 648px |

At col 4/2 with `height=fallback`, Zone A drops from 4 rows to 2 rows, accommodating scenarios where Zone C needs more vertical space.

### Breakpoint mapping

| Page breakpoint | Page columns | Wide Answer column variant |
|----------------|-------------|--------------------------|
| ≥1520px | 12 | `column=12` |
| 1519–1392px | 12 | `column=12` |
| 1391–1025px | 8 | `column=8` |
| 1024–641px | 4 | `column=4` |
| ≤640px | 2 | `column=2` |

---

## Zone Roles

| Zone | Role | Card type | Position |
|------|------|-----------|----------|
| **A** | Hero anchor | One single-purpose card — the dominant visual element (map, page-by-page carousel, video+text answer card, etc.) | Left (desktop) / top (mobile) |
| **C** | Supporting details | Flexible slot — Splits Card (stacked or side-by-side), horizontal cards, attachment cards, etc. | Right (desktop) / bottom (mobile) |

---

## Anatomy

1. **Zone A** — Hero anchor card (single card: map, page-by-page carousel, hero image with overlay, video+text, etc.)
2. **Zone C** — Supporting details slot (Splits Card with multiple card containers, or other card arrangements)

Zone C is a slot — Splits Card with 3 rows is an example. It can hold horizontal card layouts, attachment cards side-by-side, or any combination appropriate to the content.

---

## Grid Specifications

| Token | Value | Purpose |
|-------|-------|---------|
| **Grid gap (x & y)** | `--smtc/gap/between/content/x-large` (24px) | Spacing between zones |
| **Row height** | 88px | Fixed row unit for the CSS grid |
| **Zone A card padding** | `--mai/smtc/padding/card/default` (20px) | Answer card internal padding |
| **Zone A card corner** | `--mai/smtc/corner/card/default` (24px) | Answer card corner radius |
| **Zone A min-height** | 200px | Ensures Zone A doesn't collapse |
| **Zone A max-height** | 424px (4 rows) | Constrains Zone A content |
| **Zone C gap** | `--smtc/gap/between/content/small` (12px) | Gap between items in Zone C |

---

## Visual States

This component is a structural container. Interaction states are delegated to child components. At col 4/2, a collapse/expand toggle (SectionFooter) applies with `max-height` + `overflow: hidden`. Collapsed state constrains container max-height to 424px at col 4 / 648px at col 2. Smooth transition: `max-height 0.3s ease`.

---

## Usage Rules

- Zone A contains ONE hero card that serves the primary intent of the query.
- Zone C provides supporting details — related items, sub-topics, or contextual information. Do not mix unrelated content across zones.
- Zone A card is sized span 6 × 4 rows at col 12; Zone C uses `--smtc/gap/between/content/small` (12px) gap between items.
- Use `height=fallback` when Zone A content is less dominant and Zone C needs more space at narrow breakpoints.
- At `column=4` and `column=2`, content may exceed visible area — expansion toggle (SectionFooter) applies.

### Example use cases

| Query intent | Zone A | Zone C |
|-------------|--------|--------|
| "Ski in Banff" | Map card (interactive map) | 3 featured locations (Splits Card) |
| "Tom Hanks news" | Page-by-page carousel | Recent news articles (stacked answer cards) |
| "Paris weather" | Weather visualization card | 5-day forecast items (horizontal cards) |

### Do
- Place exactly ONE card in Zone A — it must be the dominant visual element.
- Use `height=fallback` when Zone A content is secondary to Zone C at mobile.
- Test expand/collapse behavior at col 4/2 with Section Footer.
- Ensure Zone C content is related to Zone A's topic (single purpose).

### Don't
- Put multiple cards in Zone A — it is a single hero slot.
- Use Wide Answer for broad multi-topic content — use Magazine instead.
- Hardcode zone widths — they must respond to column span signals.
- Reorder DOM to fit a layout shape — preserve semantic reading order (A → C).
- Mix unrelated topics across Zone A and Zone C.

---

## Dark Mode Notes

Zone A accented card background (`background/card/on-primary/alt/rest`) maintains contrast with text in both light and dark themes. Zone C card backgrounds maintain contrast with page background. All card content within zones meets WCAG AA contrast.

---

## Related Components

| Component | Relationship |
|-----------|-------------|
| **Section body / magazine** | Sibling — 3-zone layout for broad/multi-topic content |
| **Section body / algo** | Sibling — list-based layout for algorithm results |
| **Section body / Q&A** | Sibling — 2-zone layout for Copilot answers |
| **Section body / Carousel** | Sibling — horizontal scrolling card section |
| **Section / title** | Dependency — heading above the body |
| **Section / footer** | Dependency — expand/collapse toggle at col 4/2 |
| **Answer Card** | Child — primary card container in Zone A |
| **Splits Card** | Child — multi-card grid in Zone C |
| **Page** | Parent — Wide Answer slots into Page body |

---

## Open questions

None.
