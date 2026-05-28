---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# List View

**Figma Node ID:** `128123:75215` · **Type:** `COMPONENT_SET`  
**Group:** Layout · **Tier:** Base / SDL Atom · **Variants:** 3  
**Dependencies:** none  
**Consumed by:** List views, repeated content patterns, dropdown menus, search result rows

---

## Summary

List View is a vertical list container that controls the spacing (gap) between repeated child items via its `gap` variant. It exposes a body slot for ListViewItem instances or custom content. The gap creates visual proximity between items — dividers are not used inside ListView; they separate groups at the parent container level instead.

This component is appropriate as the repeating list container for vertically stacked content (search result rows, dropdown items, settings lists) and when consistent inter-item spacing is required across a list. It is not appropriate for a single standalone card or content block (use Card or Basic), horizontal item arrangements (use Basic with `direction=row`), or form field grouping (use Form).

---

## Variants / Types

| Property | Type | Values | Default | Description |
|----------|------|--------|---------|-------------|
| **gap** | VARIANT | `0` (none), `2` (8px), `4` (16px) | `0` | Vertical spacing between consecutive list items |
| **body** | SLOT | — | — | Content slot — accepts ListViewItem instances or custom content |

### Gap reference

| Gap value | Resolved size | Spacing token | Use case |
|-----------|--------------|---------------|----------|
| `0` | 0px (none) | — | Dense/compact lists: dropdown items, autocomplete suggestions |
| `2` | 8px | `x-small` | Standard lists: search results, settings rows, content feeds |
| `4` | 16px | `small` | Spacious lists: card-heavy layouts, content with rich media |

---

## Anatomy

1. **Body slot** — Primary content area (Figma SLOT); accepts repeated ListViewItem instances or custom content

---

## Visual States

This component is a structural container. Interaction states are delegated to child components placed in the body slot. List View itself has no hover, focus, or pressed states.

---

## Usage Rules

- Use a consistent gap value for all items within the same list — do not mix gaps.
- Start with `gap=2` (8px) as the default; adjust only when content density requires it.
- For dense, scan-heavy lists (dropdowns, autocomplete), use `gap=0`.
- For spacious, browse-oriented lists (media cards, rich content), use `gap=4`.
- Gap creates proximity between items — do NOT use dividers between items inside a ListView; dividers separate groups at the parent container level.
- Do not nest List View inside another List View — flatten the list structure instead.
- Body content structure should be consistent across items in the same list.
- Use `body3-strong` for list item titles and `body3` for supporting text.

### Composition patterns

Grouped list (dividers separate groups, not items):
```
parentContainer
  Container
    subtitle (optional group heading)
    ListView
      ListViewItem × n
  Divider
  Container
    subtitle
    ListView
      ListViewItem × n
```

### Do
- Use `gap=2` (8px) as the default for standard lists.
- Use `gap=0` for dense/compact lists (dropdown items, autocomplete suggestions).
- Maintain a consistent gap value across all items in the same list.

### Don't
- Mix different gap values within the same list.
- Use `gap=4` (16px) for dense repeated content.
- Use List View for a single standalone item.
- Nest List View inside another List View.
- Use dividers between items inside a List View.
- Omit the body slot content — an empty List View renders meaningless whitespace.

---

## Dark Mode Notes

All text within body slot content must meet WCAG 2.1 AA contrast ratios in both light and dark themes. Do not rely solely on spacing or position to distinguish items — for grouped lists, use a Divider between groups at the parent level.

---

## Related Components

| Component | Relationship |
|-----------|-------------|
| **Basic** | General two-slot layout container; use List View specifically for repeated list rows |
| **Dropdown** | Consumer — ListView serves as the list body inside dropdown flyouts |
| **Menu** | Consumer — ListView serves as the list body inside menu flyouts |
| **List view elements** | Pre-built row templates (Option, Menu item, Number input) designed as ListViewItem content |
| **Card** | Can be placed inside List View's body slot for card-based lists |
| **Form** | Use instead when list rows contain form controls that need form semantics |
| **Section** | Parent container that may hold a list of List Views |

---

## Open questions

None.
