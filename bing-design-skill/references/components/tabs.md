---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Tabs (Tab + Tablist)

This document covers two tightly related components: **Tab** (the individual navigation item atom) and **Tablist** (the composite assembly that combines multiple Tabs with a content body panel). In practice, Tablist is the recommended component for building tabbed interfaces — Tab is consumed by Tablist and is documented here for completeness.

---

## Tab

A Tab is a navigation control that allows users to switch between content panels within a single view. Tabs provide immediate, in-context navigation without page reloads. The component supports two visual styles (ghost and solid), four interaction states, and a separate `selected?` boolean so any state can be combined with selected or unselected appearance.

**Figma Node ID:** `18822:4750` · **Type:** `COMPONENT_SET` · **Group:** Navigation · **Variants:** 12 · **Dependencies:** focus outline · **Consumed by:** Tablist

### Tab Variants

| Property | Values | Default | Description |
|----------|--------|---------|-------------|
| **state** | `rest`, `hover`, `pressed`, `focus` | `rest` | Interaction state of the tab |
| **Style** | `ghost`, `solid` | `ghost` | Visual style — transparent or filled background |
| **selected?** | `false`, `true` | `false` | Whether the tab is the active/current selection |
| **start icon** | `True`, `False` | `False` | Whether to display a leading icon |
| **Label** | *(text)* | `Label` | Tab label text |

`selected?` is a separate boolean property and can be combined with any state — e.g., `state=rest` + `selected?=true` shows the active tab at rest; `state=focus` + `selected?=true` shows the focused selected tab.

### Tab Visual States

| State | Behavior |
|-------|----------|
| `rest` | Tab is idle — unselected or selected at rest |
| `hover` | Pointer is over the tab; subtle background shift |
| `pressed` | Tab is being clicked/tapped |
| `focus` | Keyboard focus on the tab — shows focus ring via `focus outline` dependency |

### Tab Anatomy

1. **Label text** — Tab title; consumer-editable
2. **Active indicator** — Bottom border highlight visible on the selected tab
3. **Container** — Tab frame with padding and interaction state styling

### Tab Style reference

| Style | Background | Use case |
|-------|------------|----------|
| **ghost** | Transparent — no background fill at rest | Default choice. Blends into the surrounding layout. Best for tabs on page-level backgrounds where visual weight should be minimal. |
| **solid** | Filled background | Use when tabs need to stand out from the surrounding content, or when placed on complex/busy backgrounds where Ghost styling would lack contrast. |

---

## Tablist

A Tablist is a composite navigation component that combines multiple Tab items within a Horizontal Scroller, paired with a content body panel (Basic). It manages the active tab state and displays the corresponding body content. The component provides a complete tab navigation pattern with built-in scrolling support for overflow scenarios.

**Figma Node ID:** `131224:133228` · **Type:** `COMPONENT_SET` · **Group:** Navigation · **Variants:** 3 · **Dependencies:** Tab, Horizontal Scroller, Basic · **Consumed by:** Section title (endProps), content panels, search result pages

### Tablist Variants

| Property | Values | Default | Description |
|----------|--------|---------|-------------|
| **active tab** | `1`, `2`, `3` | `1` | Which tab is currently selected/active |

Tab instances inside the Tablist additionally expose:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| **state** | VARIANT | `rest` | `rest`, `hover`, `pressed`, `focus` |
| **Style** | VARIANT | `ghost` | `ghost`, `solid` — visual style; must be consistent across all tabs |
| **selected?** | VARIANT | `false` | Set `true` on the active tab, `false` on all others |
| **start icon** | BOOL | `false` | Show a leading icon; use consistently across all tabs or none |
| **Label** | TEXT | `Label` | Tab label text — edit each tab's label independently |

### Tablist Anatomy

1. **Tab bar (Horizontal Scroller > Basic)** — Horizontally scrollable row of Tab instances; one tab is selected, others are at default
2. **Body panel (Basic)** — Content slot below the tab bar; displays content for the active tab

### Property relationships

```
Tablist
├── active tab (1 / 2 / 3) — controls which body panel is visible
└── Tab instances (inside Horizontal Scroller)
    ├── selected? = true  → the active tab
    ├── selected? = false → all other tabs
    ├── Style (ghost / solid) — must be consistent across all tabs
    └── start icon — use consistently: all tabs or none
```

- **active tab** switches the body panel and sets the matching Tab's `selected?` to `true`.
- **Style** must be the same across all Tab instances in the bar — do not mix ghost and solid.
- **start icon** must be used consistently — either all tabs show an icon, or none do.

---

## Usage Rules (both components)

- Tabs and Tablist are appropriate for switching between related content panels within the same page context, for top-level navigation within a section or module, and when content categories are mutually exclusive and parallel in hierarchy.
- They are not appropriate for primary site navigation (use a navigation bar or header links), for filtering content within a single view (use Filter item), for triggering actions (use Button), for toggling a binary state (use Toggle), or when only a single Tab item is needed with no panel switching (use Tab directly).
- Tab labels should be short — ideally 1–2 words (e.g., "All", "Images", "Videos", "News"). Each label should clearly describe its content panel.
- Switching tabs must not cause a page refresh or redirect — content updates in-place.
- Do not mix Ghost and Solid styles within the same Tablist.
- For more than 3 tabs, extend the Tablist by adding additional Tab instances inside the Horizontal Scroller slot. The Horizontal Scroller handles overflow.
- The body panel (Basic component) is a slot — content is placed into it per the active tab's context.

### Responsive
- On narrow viewports, the Horizontal Scroller provides overflow scrolling for tab groups.
- Avoid truncating tab labels — abbreviate or reduce tab count instead.
- Touch targets should meet 48px minimum height on mobile.
- Consider a Dropdown as an alternative when space is constrained on mobile.

---

## Do / Don't

### Do
- Use Ghost style as the default — it integrates cleanly into most page layouts.
- Use Solid style when tabs sit on visually complex or accent backgrounds.
- Keep tab labels concise and parallel in structure ("Images" / "Videos" / "News").
- Ensure the selected state is visually distinct from all other states — combine underline, fill, or weight change with color.
- Use start icons consistently — either all tabs in a group have them, or none do.

### Don't
- Use tabs for actions that don't switch content — use Button instead.
- Nest Tablists within Tablists — use a different navigation pattern for sub-levels.
- Use more than 6–8 tabs without overflow handling.
- Mix Ghost and Solid styles within the same tab group.
- Rely solely on color to indicate the selected tab.
- Use tabs as filters — filtering should use Filter item components.
- Use Tablist when a simple Dropdown would be more space-efficient on mobile.

---

## Dark Mode Notes

Both Ghost and Solid styles must meet WCAG AA contrast requirements in both light and dark themes. The selected state indicator (underline or fill) must have sufficient contrast against the tab background in both modes. Focus rings must be visible in both themes.

---

## Related Components

| Component | Relationship |
|-----------|-------------|
| **Tab** | Atom — individual tab item; consumed by Tablist |
| **Tablist** | Composite — recommended component for building tabbed interfaces |
| **Horizontal Scroller** | Dependency of Tablist — provides scrollable container for Tab items |
| **Basic** | Dependency of Tablist — body content panel slot |
| **Button** | Use instead when the control triggers an action rather than switching content |
| **Filter item** | Use instead for filtering/faceting within a content view |
| **Toggle** | Use instead for binary on/off state changes |
| **Dropdown** | May replace tabs when space is constrained on mobile |
| **Section title** | Consumer — uses Tablist via endProps slot for Wholepage tabs |

---

## Open questions

None.
