---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Query Suggestion

**Figma Node ID:** `37713:76370` · **Type:** `COMPONENT_SET`  
**Group:** Actions · **Tier:** Base / Foundational Atom · **Variants:** 8  
**Dependencies:** focus outline  
**Consumed by:** Search box autocomplete, search overlays, suggestion dropdowns

---

## Summary

A Query Suggestion is an autocomplete item displayed in a dropdown list within the search interface. It presents a suggested or predicted query as the user types, with an optional thumbnail for rich visual suggestions. It is used to accelerate search by reducing typing and surfacing relevant queries.

This component is appropriate as autocomplete items in a search box dropdown, for search query predictions and recent searches, and when rich suggestions with thumbnails add meaningful context. It is not appropriate for suggested actions or follow-ups (use Suggestion chip), for related searches at the bottom of results (use Related search pill), or for filtering content (use Filter item).

---

## Variants / Types

| Property | Values | Default | Description |
|----------|--------|---------|-------------|
| **state** | `rest`, `hover`, `pressed`, `focus` | `rest` | Interaction state |
| **thumbnail** | `True`, `False` | `False` | Whether to show an image thumbnail alongside the suggestion text |

### state

| State | Description |
|-------|-------------|
| **rest** | Default, no interaction |
| **hover** | Background shifts to hover state on pointer enter |
| **pressed** | Active press state |
| **focus** | Keyboard focus ring visible |

### thumbnail

| Value | Behavior | Use case |
|-------|----------|----------|
| `False` | Text-only suggestion | Standard query autocomplete, recent searches |
| `True` | Suggestion with image preview | Entity suggestions (people, places, products) where a visual preview adds value |

---

## Anatomy

1. **Thumbnail** — Optional preview image for the suggested query (aligns left inside the pill)
2. **Query text** — Suggested search text; consumer-editable
3. **Container** — Pill-shaped row with hover/pressed states

---

## Visual States

- **Hover** — background shifts to hover state on pointer enter
- **Pressed** — active press state
- **Focus** — keyboard focus ring visible via `focus outline` dependency; `Enter` triggers the re-query
- **Click/tap** — re-queries the SERP with the suggested search term

---

## Usage Rules

- Suggestion text should be a complete, natural-language query.
- Bold or highlight the portion that matches the user's typed input.
- Order suggestions by relevance — most likely match first.
- Limit the visible suggestion count to 5–8 items to avoid overwhelming the user.
- Place Query suggestion items in a horizontal row between the Section title and the ML body content.
- Arrange chips with consistent gap directly below the section title header, above the first ML body result.
- When chips overflow the container width, wrap the row in a Horizontal Scroller — a right arrow appears to indicate more content.
- Show thumbnails only when images provide meaningful additional context (entities, products).

### Do
- Show thumbnails only when images provide meaningful additional context.
- Highlight the matching portion of the suggestion text to show relevance.
- Limit the visible suggestion count to 5–8 items.

### Don't
- Show thumbnails for generic text queries — reserve for entity/rich suggestions.
- Display stale or irrelevant suggestions.
- Block the search input when the suggestion list is open.

---

## Dark Mode Notes

All states must meet WCAG AA contrast in both light and dark themes. The focus ring via `focus outline` must be visible on the active suggestion. Thumbnail images must have appropriate contrast with the pill background.

---

## Related Components

| Component | Relationship |
|-----------|-------------|
| **Horizontal Scroller** | Common parent — Query suggestions are typically placed inside a Horizontal Scroller for overflow scrolling |
| **Suggestion chip** | Use for AI communication prompts; Query suggestion is for SERP re-query |
| **Related search pill** | Use for bottom-of-page related search grids; similar re-query behavior |
| **Dropdown** | Shares expand/collapse pattern but for form-field selection, not search |
| **Thumbnail** | Consumed by Query suggestion when `thumbnail: True` |

---

## Open questions

None.
