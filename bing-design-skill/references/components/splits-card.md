---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Splits Card

**Figma Node ID:** `62934:14962` · **Type:** `COMPONENT_SET`  
**Group:** Cards · **Tier:** Card · **Variants:** 6

---

## Summary

Splits Card is a grid-based card layout that splits content into a 2×2 (or up to 4×4) matrix of cells. It is used for structured data presentation such as quick facts, entity attributes, or comparison tables. The component supports accent and nonAccent styles with configurable padding and individually toggleable rows and columns.

This component is appropriate for quick fact answer panels displaying entity attributes, structured key-value data in a grid format, and comparison tables within answer cards. It is not appropriate for free-form content layouts (use Section body), single-column lists (use List View), or rich media cards (use Image card or Video card).

---

## Variants / Types

| Property | Values | Default | Description |
|---|---|---|---|
| **padding** | `default`, `medium`, `none` | `default` | Content padding level |
| **style** | `accent`, `nonAccent` | `accent` | Visual style: accent (card bg) or transparent |
| **Row 2** | `true`, `false` | `true` | Show second row |
| **Column 2** | `true`, `false` | `true` | Show second column |
| **Row 3** | `true`, `false` | `false` | Show third row |
| **Column 3** | `true`, `false` | `false` | Show third column |
| **Row 4** | `true`, `false` | `false` | Show fourth row |
| **Column 4** | `true`, `false` | `false` | Show fourth column |

### padding

| Value | Description |
|---|---|
| `default` | Standard card padding |
| `medium` | Reduced padding for compact layouts |
| `none` | No padding — content fills edge to edge |

### style

| Value | Description |
|---|---|
| `accent` | Card background with accent surface color |
| `nonAccent` | Transparent / neutral background |

---

## Anatomy

1. **Row** — Horizontal container holding cells in a single row
2. **Cell** — Individual content area within a row; contains label + value content

The grid is built from individually togglable rows and columns, supporting layouts from 1×1 up to 4×4.

---

## Visual States

- **Hover** — entire card shows a subtle background highlight; cursor changes to pointer
- **Pressed/Click** — opens a new page querying the specific topic for that segment
- **Keyboard focus** — Tab focuses the card, Enter activates the click action

---

## Usage Rules

- Toggle Row/Column booleans to match the data shape — 1×4, 2×2, 4×1 are all valid layouts.
- Use `accent` style with answer cards that need visual emphasis.
- Use `nonAccent` when the Splits Card sits inside an already-accented parent card.
- Keep cell content concise — label + short answer + link works best.
- Splits Card is used inside answer card bodies as a grid module (e.g., quick fact answer: 2×2 grid of attribute cells).

### Do
- Use consistent padding across all cells in the grid.
- Toggle Row/Column booleans to match the data shape — unused rows/columns should be hidden.
- Keep cell content concise.

### Don't
- Enable rows/columns that have no content — hide unused ones to keep the grid tight.
- Use for content that requires rich formatting or media within each cell.
- Mix long-form and short-form content across cells — keep density consistent.
- Rely solely on the grid to convey data relationships — each cell should be self-explanatory.

---

## Dark Mode Notes

All cell content must meet WCAG AA contrast in both light and dark themes. The `accent` background uses the card accent surface token, which adapts to light/dark mode. The `nonAccent` style relies on the parent container's background.

---

## Related Components

| Component | Relationship |
|-----------|-------------|
| **Answer Card** | Parent container |
| **Attachment Card** | Alternative card format |
| **Section body / Q&A** | May contain Splits Card in the answer zone |
| **List View** | Alternative for single-column lists |

---

## Open questions

None.
