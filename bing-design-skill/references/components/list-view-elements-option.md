---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# List View Elements / Option

**Figma Node ID:** `64225:500930` · **Type:** `COMPONENT_SET`  
**Group:** Layout · **Tier:** Base / Foundational Atom · **Variants:** 10  
**Dependencies:** Icon  
**Consumed by:** Dropdown, Menu (via List View body slot), selection lists

---

## Summary

Option is a pre-built list row template for selection lists. It provides a consistent row pattern — left icon, label text, optional secondary line, checkmark indicator, and end slot — that slots directly into List View's body. It is used when users need to pick one or more items from a predefined set.

This component is appropriate as a row item inside List View for single or multi-select lists, inside Dropdown for option selection, and when a visual checkmark is needed to confirm selection. It is not appropriate as a standalone component outside of a List View, for action rows (use List view elements / Menu item instead), for form-level checkboxes (use the Checkbox component directly), or when rows need completely custom layout.

---

## Variants / Types

| Property | Type | Default | Options |
|----------|------|---------|---------|
| **state** | Variant | `rest` | `rest`, `hover`, `pressed`, `disabled`, `focus` |
| **checkmark** | Boolean | `False` | `True`, `False` |
| **show Left icon?** | Boolean | `True` | `True`, `False` |
| **Two line** | Boolean | `False` | `True`, `False` |

### state

| State | Description |
|-------|-------------|
| **rest** | Default unselected appearance |
| **hover** | Subtle background highlight on pointer hover |
| **pressed** | Active press state |
| **disabled** | Non-interactive; reduced opacity |
| **focus** | Keyboard focus with focus outline |

### Boolean toggles

| Property | Default | Purpose |
|----------|---------|---------|
| **checkmark** | `False` | Show/hide checkmark trailing indicator |
| **show Left icon?** | `True` | Show/hide leading icon |
| **Two line** | `False` | Show secondary label line below main label |

---

## Anatomy

1. **Left icon** — Optional leading icon for visual identification of the option
2. **Label text** — Primary row label; optional secondary line in Two-line variant
3. **Checkmark** — Optional trailing indicator showing selected state
4. **End slot** — Optional trailing icon or content

---

## Visual States

- **Hover** — subtle background highlight on pointer hover
- **Pressed** — active press state; click/tap toggles selection
- **Disabled** — non-interactive with reduced opacity; not focusable
- **Focus** — standard focus outline dependency

Click/tap toggles selection. Checkmark appears when selected. The checkmark must not be the only selection indicator — accessible state (`aria-selected`) must also be updated.

---

## Usage Rules

- Keep label text concise — long labels break the row rhythm.
- Use consistent left icon presence across all items in the same list.
- Use the Two-line variant only when secondary context genuinely aids user decisions.
- Do not mix Option and Menu item rows in the same list.
- Always place inside a List View body slot.
- For multi-select lists, ensure the parent List View has appropriate ARIA roles (`role="listbox"`, `role="option"`).

### Do
- Use Option for selection lists where users pick from predefined choices.
- Keep label text concise.
- Disable the item via `state=disabled` when the option is unavailable.

### Don't
- Mix Option and Menu item in the same list — they serve different patterns.
- Rely solely on the checkmark for selection feedback — also update the trigger label.
- Place outside of a List View context.

---

## Dark Mode Notes

All states must meet WCAG AA contrast requirements in both light and dark themes. Disabled items use reduced opacity tokens. The focus outline must be visible against the option background in both light and dark modes. The checkmark indicator must maintain sufficient contrast against the row background.

---

## Related Components

| Component | Relationship |
|-----------|-------------|
| **List View** | Parent container — Option rows go inside the List View body slot |
| **Dropdown** | Consumer — uses Option as dropdown list items |
| **List view elements / Menu item** | Sibling — use for action rows; do not mix with Option |
| **Checkbox** | Alternative — for standalone multi-select outside a list context |

---

## Open questions

None.
