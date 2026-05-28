---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# List View Elements / Menu Item

**Figma Node ID:** `25773:87880` · **Type:** `COMPONENT_SET`  
**Group:** Layout · **Tier:** Base / Foundational Atom · **Variants:** 5  
**Dependencies:** Icon  
**Consumed by:** Menu (via List View body slot), context menus, kebab menus

---

## Summary

Menu item is a pre-built list row template for action menus. It provides a consistent row pattern — optional start icon, action label, optional L2 chevron — that slots directly into List View's body. It is used inside the Menu component or any context/kebab menu where tapping a row triggers an action or opens a sub-level.

This component is appropriate as a row item inside List View for action menus (kebab/more menus, context menus) and inside the Menu component for all action row items. It is not appropriate as a standalone component outside of a List View, for selection lists (use List view elements / Option instead), or when rows need custom layout beyond label + icon + L2 chevron.

---

## Variants / Types

| Property | Type | Default | Options |
|----------|------|---------|---------|
| **state** | Variant | `default` | `default`, `hover`, `pressed`, `disabled`, `focus` |
| **start Icon** | Boolean | `True` | `True`, `False` |
| **L2** | Boolean | `False` | `True`, `False` |

### state

| State | Description |
|-------|-------------|
| **default** | Rest state — no hover or interaction |
| **hover** | Subtle background highlight on pointer hover |
| **pressed** | Active press state |
| **disabled** | Non-interactive; reduced opacity |
| **focus** | Keyboard focus with focus outline |

### Boolean toggles

| Property | Default | Purpose |
|----------|---------|---------|
| **start Icon** | `True` | Show/hide leading action icon |
| **L2** | `False` | Show trailing chevron indicating a sub-menu |

---

## Anatomy

1. **Start icon** — Optional leading icon identifying the action
2. **Label text** — Action label text (verb-first recommended: "Delete", "Share", "Open")
3. **L2 chevron** — Optional trailing chevron indicating a sub-menu is available

---

## Visual States

- **Hover** — subtle background highlight on pointer hover
- **Pressed** — active press state
- **Disabled** — non-interactive with reduced opacity
- **Focus** — standard focus outline dependency; keyboard navigable

L2 chevron (›) triggers a nested submenu panel to the right of the current menu. Click/tap toggles sub-menu open/close.

---

## Usage Rules

- Keep action label text short and imperative — verb-first ("Delete", "Share", "Edit").
- Use start icon consistently across all items in the same menu.
- Use L2 only when a genuine sub-level exists — avoid nesting beyond one level.
- Always place inside a List View body slot.

### Assembly pattern

```
Menu (trigger button)
└── List View
    ├── Menu item (L2=false)  — standard action row
    ├── Menu item (L2=true)   — row with sub-menu
    │   └── List View (sub-menu)
    │       └── Menu item × n
    └── ...
```

### Do
- Keep action labels short and imperative (verb-first).
- Use start icon consistently across all items in the same menu.
- Use L2 only when a genuine second-level menu is needed.

### Don't
- Mix Menu item and Option in the same list — different interaction patterns.
- Use L2 chevron without an actual sub-menu being present.
- Place outside of a List View context.
- Nest beyond L2 — avoid third-level menus.

---

## Dark Mode Notes

All states must meet WCAG AA contrast requirements in both light and dark themes. Disabled items use reduced opacity tokens. The focus outline must be visible against the menu background in both light and dark modes.

---

## Related Components

| Component | Relationship |
|-----------|-------------|
| **List View** | Parent container — Menu item rows go inside the List View body slot |
| **Menu** | Consumer — Menu component uses Menu item as its action rows |
| **List view elements / Option** | Sibling — use for selection rows; do not mix with Menu item |
| **Button** | Alternative — for action rows with custom layout needs |

---

## Open questions

None.
