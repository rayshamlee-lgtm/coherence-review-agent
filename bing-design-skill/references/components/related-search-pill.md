---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Related Search Pill

A Related Search Pill is a pill-shaped element that presents a related search query. Displayed in a vertically stacked list under a contextual heading (e.g., "Deep dive into…"), it helps users discover and navigate to related topics without reformulating their query manually.

**Figma Node ID:** `129185:113414` · **Type:** `COMPONENT_SET` · **Group:** Navigation · **Variants:** 2

---

## Variants

| Property | Values | Default | Description |
|----------|--------|---------|-------------|
| **state** | `rest`, `hover` | `rest` | Interaction state |

### State reference

| State | Description |
|-------|-------------|
| **rest** | Default idle appearance |
| **hover** | Background shifts to hover state on pointer enter |

---

## Visual States

This component has two visual states: `rest` and `hover`. There is no pressed or focus variant defined in the Figma component; implementation must provide a visible focus state for keyboard navigation.

---

## Anatomy

1. **Search icon** — Leading icon (Search glyph) indicating this is a search action
2. **Label text** — Related search query text; consumer-editable
3. **Container** — Pill-shaped frame with hover state

---

## Usage Rules

- Related Search Pill is appropriate for displaying related search suggestions at the bottom of SERP results, in grid layouts for browse-and-discover patterns, and for topic exploration adjacent to current search results.
- It is not appropriate for inline suggestions within the search box (use Query suggestion), for quick-reply or action suggestions (use Suggestion chip), or for filtering results (use Filter item).
- Pill text should be a complete, natural-language search query. Related searches should be algorithmically relevant to the current query.
- Pills are displayed in a stacked vertical list, typically 4–8 pills, under a contextual heading (e.g., "Deep dive into [topic]").
- Use `x-small` spacing between pills. Use `x-large` spacing above the related search section to separate from main results.
- Pills auto-size to fit their text content.
- The section containing the pills should have a contextual heading (e.g., "Deep dive into [topic]") above the group.

---

## Do / Don't

### Do
- Present related searches as complete, clickable query phrases.
- Use a vertically stacked list for easy scanning.
- Place at the end of search results as a discovery aid.
- Include a contextual section heading above the pill group.
- Keep the group to 6–8 pills for focus.

### Don't
- Mix related search pills with other chip/pill types in the same section.
- Display too many pills — keep to 6–8 for focus.
- Use for non-search navigation — these are search query shortcuts, not general links.

---

## Dark Mode Notes

No explicit dark-mode variant properties are defined. Pill text must meet WCAG AA contrast requirements against the pill background in both light and dark themes. The hover background shift must maintain sufficient contrast in both modes.

---

## Related Components

| Component | Relationship |
|-----------|-------------|
| **Suggestion chip** | Similar pattern but for inline query suggestions, not bottom-of-page grids |
| **Query suggestion** | Use for autocomplete dropdown items within the search box |
| **Filter item** | Use for filtering/faceting, not for search suggestions |

---

## Open questions

None.
