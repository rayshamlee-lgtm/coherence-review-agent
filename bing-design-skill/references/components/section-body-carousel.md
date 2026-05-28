---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Section / Body Type / Carousel

**Figma Node ID:** `130744:269893` · **Type:** `COMPONENT_SET`  
**Group:** Layout · **Tier:** Section · **Variants:** 12  
**Dependencies:** Scroller button (global), Zone A, Card components  
**Consumed by:** Page body

---

## Summary

The Carousel body type is a horizontally scrollable card container for section content. Unlike Magazine (zone-based reflow), Carousel maintains a single horizontal scroll track across all breakpoints. Cards are arranged in up to 4 rows via slot positions and navigated with Start/End scroller buttons. The 4 column variants (12, 8, 4, 2) map 1:1 to Page breakpoints for responsive behavior.

This component is appropriate for browsable card collections that benefit from horizontal scrolling (e.g., "People also search for", "Related topics") and when content is long and homogeneous — many cards of similar shape and priority. It is not appropriate for curated, editorially-ranked content (use Magazine), algorithm-driven results with sidebar (use Algo), Q&A/Copilot layouts (use Q&A), or sections with fewer than ~4 cards.

**Variant formula:** 4 columns × 3 slide positions = 12 variants.

---

## Variants / Types

| Property | Type | Values | Default | Description |
|----------|------|--------|---------|-------------|
| **column** | Variant | `12`, `8`, `4`, `2` | `12` | Number of grid columns; maps to Page breakpoint |
| **slide** | Variant | `first`, `middle`, `last slide` | `first` | Current scroll position — controls which navigation arrows appear |
| **fade?** | Boolean | `true` / `false` | `true` | Toggles gradient fade effect on scroll edges |
| **see all button** | Boolean | `true` / `false` | `true` | Shows/hides "See all" CTA to view full results |

### Column variants

| Column | Breakpoint | Behavior |
|--------|-----------|----------|
| **12** | ≥1392px (desktop) | Full span; most cards visible per viewport |
| **8** | 1391–1025px | Reduced span; fewer cards visible, same scroll mechanic |
| **4** | 1024–641px (tablet) | Compact carousel; cards may grow taller or reduce per-row count |
| **2** | ≤640px (mobile) | Narrowest span; typically 1–2 cards visible at a time |

### Slide position variants

| Slide | Start (left) | End (right) | Description |
|-------|:------------:|:-----------:|-------------|
| **first** | — | ✓ | User is at the beginning; only forward scroll available |
| **middle** | ✓ | ✓ | User is mid-scroll; both directions available |
| **last slide** | ✓ | — | User has reached the end; only backward scroll available |

---

## Anatomy

1. **Row slot** — Horizontally scrollable row of cards; up to 4 row slots (`row`, `row2`, `row3`, `row4`) inside Zone A
2. **Gradient overlays** — Left/right fade indicators showing more content is available
3. **Scroller button** — Navigation button (ChevronRight icon) for scrolling the carousel

### Slot usage

| Slot | Purpose | Notes |
|------|---------|-------|
| **row** | Primary card row | Always populated; contains the main carousel content |
| **row2** | Second row | Optional; use for 2-row carousels |
| **row3** | Third row | Optional; use sparingly — 3+ rows reduce scannability |
| **row4** | Fourth row | Optional; maximum density |

Rows are arranged vertically inside Zone A's GRID layout. Each row scrolls in sync with the entire carousel viewport.

---

## Visual States

The carousel itself is a structural container. At `slide=first`, the Start (left) scroller button is hidden from the tab order. At `slide=last`, the End (right) scroller button is hidden. At `slide=middle`, both are visible. The `fade?` gradient overlays appear/disappear based on scroll position.

---

## Usage Rules

- Cards inside the carousel should be homogeneous in shape and purpose (same card type per row).
- Section Title always precedes the Carousel body; Section Footer always follows it.
- Internal card spacing follows the 24px grid gap. Scroller buttons (Start/End) overlay the carousel edges with gradient masks.
- Horizontal scrolling is the primary navigation model at all breakpoints — the carousel does not reflow to a vertical stack.
- At `column=2` (mobile), touch swipe targets must be ≥44px.
- Card widths remain consistent within the carousel; the number of visible cards decreases as the column span narrows.

### Do
- Use the `fade?` gradient to signal overflow — users need a visual hint that content extends off-screen.
- Test all 3 slide states (`first`, `middle`, `last slide`) to verify correct arrow visibility.
- Test layouts at all 4 column variants to verify card sizing and scroller behavior.
- Keep card content concise — carousel cards are scanned quickly, not read deeply.
- Use `see all button` when the full result set is larger than what the carousel displays.

### Don't
- Nest carousels inside carousels — one horizontal scroll axis per section.
- Use the Carousel body for content that requires zone-based hierarchy — use Magazine instead.
- Auto-scroll or auto-advance the carousel — let users control scroll position.
- Hide critical content behind the scroll — the first visible cards must convey the section's purpose.
- Disable the `fade?` gradient without providing an alternative overflow indicator.
- Populate more than 2 rows unless the content density genuinely warrants it.

---

## Dark Mode Notes

All card content meets WCAG AA contrast in both light and dark themes. Gradient fade overlays must not reduce text/icon contrast below AA on edge cards. Scroller button icons must meet AA contrast against the gradient background.

---

## Related Components

| Component | Relationship |
|-----------|-------------|
| **Section / title** | Sibling — always precedes Carousel body |
| **Section / footer** | Sibling — always follows Carousel body |
| **Section body / magazine** | Alternative — for zone-based curated layouts |
| **Section body / algo** | Alternative — for algorithm result layouts |
| **Section body / Q&A** | Alternative — for Q&A/Copilot answer layouts |
| **Page** | Parent — breakpoints determine which column variant renders |
| **Scroller button** | Child (global) — provides Start/End navigation arrows |
| **Card components** | Child — populates row slots inside Zone A |

---

## Open questions

None.
