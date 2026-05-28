---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Menu

## Summary

Menu is a dropdown container that toggles between collapsed and expanded states. When expanded, it displays a vertical list of menu items for user selection. It is commonly triggered by a button click and appears as a floating list below or adjacent to its trigger.

**Figma Node ID:** `66134:126123` · **Type:** `COMPONENT_SET` · **Group:** Navigation  
**Tier:** Special / Utility · **Variants:** 2 · **Consumed by:** Button, Header, Card actions

---

## Variants / Types

| Property | Values | Default | Description |
|----------|--------|---------|-------------|
| **Expanded** | `False`, `True` | `False` | Whether the menu is collapsed or expanded |
| **alignment** | `right`, `left` | `right` | Which side the menu flyout aligns to relative to the trigger |

| Expanded | Description |
|----------|-------------|
| **False** | Menu is collapsed — only the trigger button is visible |
| **True** | Menu is expanded — the flyout panel is shown |

| alignment | Description |
|-----------|-------------|
| **right** | Flyout aligns to the right edge of the trigger |
| **left** | Flyout aligns to the left edge of the trigger |

---

## Anatomy

1. **Trigger button** — Button instance that opens the menu; uses `SerpIcon MoreHorizontal` for the trigger icon
2. **Flyout panel** — Expanded option list using Flyout with Basic body; contains List View rows

---

## Visual States

- **Collapsed (Expanded = False):** Only the trigger button is visible
- **Expanded (Expanded = True):** The flyout panel is shown below or adjacent to the trigger
- Menu items within the flyout have their own hover, pressed, and focus states
- Items with an L2 chevron (`SerpIcon CaretRight iconSize="m"`) indicate a nested sub-menu

---

## Usage Rules

- Menu items should be concise action labels or navigation targets
- Related items should be grouped together; use dividers for separation
- The currently selected item should be highlighted when the menu represents a selection state
- Menu floats below or adjacent to its trigger element
- Menu width should accommodate the longest item label without truncation
- Items stack vertically with consistent height and padding
- Maximum height should be set for long lists — scrolling is enabled beyond the limit
- On narrow viewports, consider anchoring the menu to the bottom of the screen (mobile action sheet pattern)
- Touch targets for menu items must meet minimum 44×44px on mobile
- Menu must not overflow the viewport — reposition if necessary
- Menu can be triggered by a button, avatar, or icon
- Options in a menu typically initiate an immediate action or navigation

---

## Do / Don't

### Do
- Close the menu when an item is selected or the user clicks outside
- Indicate the currently selected option (if applicable) with a check mark or highlight
- Use keyboard navigation (arrow keys) to move between items
- Keep the number of items manageable — consider grouping or sub-menus for long lists

### Don't
- Open a menu from within another menu (no nested menus) unless absolutely necessary
- Use the menu for content display — it is for actions and navigation
- Put complex interactive elements (forms, sliders) inside menu items
- Auto-expand the menu on page load without user interaction
- Use Menu for contextual tooltips or previews (use Flyout), modal content (use Overlay), or content filtering (use Filter item)

---

## Dark Mode Notes

Menu background and item text must meet WCAG AA contrast in both light and dark themes. Hover/focus highlights on items must be visually distinct. Selected item indicators must be visible in both themes.

---

## Open Questions

None.
