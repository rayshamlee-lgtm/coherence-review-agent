---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Suggestion Chips List

**Figma Node ID:** `79676:30152` · **Type:** `COMPONENT` · **Group:** Layout · **Tier:** Page · **Variants:** 1 (single component) · **Dependencies:** Suggestion chip components · **Consumed by:** Page body (Related searches area)

## Summary

Suggestion Chips List is a page-level container for suggestion chip components. It arranges chips in a horizontal list layout, providing users with quick access to related or suggested search queries. This component lives in the Page body's Related Searches area, typically between the last section and pagination.

This component is appropriate in the Page body for related search suggestions, when displaying a horizontal row of clickable search query suggestions, and after the main content sections before pagination. It is not for filter controls (use Filter item components), navigation tabs (use Tab or Whole Page Tab), or non-interactive tag/label display.

---

## Variants

This component has a single, non-variant form with no configurable properties. It acts as a layout container for individual Suggestion chip components. Chip appearance is controlled by the Suggestion chip component inside.

---

## Anatomy

1. **Chip items** — Row of Suggestion chip instances
2. **Horizontal scroll** — Overflow behavior for chips exceeding container width
3. **Container** — Auto-layout wrapper managing chip spacing and alignment

---

## Visual States

- Each chip handles its own hover/click states independently.
- The container itself has no interactive states.
- Chips overflow horizontally; the user can scroll or swipe to see more.

---

## Usage Rules

- Each chip represents a related search query or suggestion.
- Chips contain concise, meaningful search terms.
- Chips are ordered by relevance — most relevant suggestions first.
- Chips are arranged horizontally with consistent gap between them.
- Overflow behavior: the list wraps to a new line or scrolls horizontally (context-dependent).
- Chip count is limited — typically 6–10 — to avoid overwhelming users.
- On mobile (column=2), visible chips may be limited with a "More" control.
- Touch targets for chips meet minimum 44px height.
- The Suggestion Chips List is placed after main content sections.

---

## Do / Don't

### Do
- Populate with contextually relevant suggestions based on the current query.
- Limit the number of chips to avoid overwhelming users (typically 6–10).
- Ensure chips are visually consistent in style and sizing.
- Place the Suggestion Chips List after main content sections.

### Don't
- Don't use empty or placeholder chips.
- Don't mix chip styles within the same list.
- Don't place the list above main content sections.
- Don't use chips for non-search actions.

---

## Dark Mode Notes

Chip text and background must meet WCAG AA contrast in both light and dark themes. Focus indicators are visible on each chip. Hover state provides clear visual feedback. Token-based color application handles theme switching automatically.

---

## Related Components

| Component | Relationship |
|-----------|-------------|
| **Page** | Parent — Suggestion Chips List lives in the Page body |
| **Suggestion chip** | Child — individual suggestion chip instances arranged in the row |
| **Filter item** | Related — similar chip appearance but for filtering, not navigation |

---

## Open questions

None.
