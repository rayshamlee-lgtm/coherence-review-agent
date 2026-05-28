---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# List View Elements

**Figma Node ID:** `130716:156420` · **Type:** `SECTION`  
**Group:** Layout · **Tier:** Base / Foundational Atom · **Variants:** 18 (Option: 10, Menu item: 5, Number input: 3)  
**Dependencies:** Icon, Checkbox  
**Consumed by:** Dropdown, Menu (via List View body slot)

---

## Summary

List view elements are pre-built row content templates designed to be placed inside the List View body slot. They provide common patterns for dropdown menus, selection lists, and interactive panels. Three element types are included: Option (selection item), Menu item (action/navigation item), and Number input (stepper control).

These are not the only content that can go inside List View — consumers can also use Checkbox, Button, or any tailor-made design. List view elements are the most common pre-built templates.

This component family is appropriate as ready-made row content inside List View for Dropdown or Menu. It is not appropriate as standalone components outside of a list context, when the row needs custom layout, or for form-level inputs (use Field for text inputs, Checkbox for standalone checkboxes).

---

## Variants / Types

### Option (10 variants)

| Property | Type | Values | Default | Description |
|----------|------|--------|---------|-------------|
| **state** | Variant | `rest`, `hover`, `pressed`, `disabled`, `focus` | `rest` | Interaction state |
| **checkmark** | Variant | `False`, `True` | `False` | Show selection checkmark |
| **show Left icon?** | Boolean | `True`, `False` | `True` | Show leading icon |
| **end Slot** | Boolean | `True`, `False` | `False` | Show trailing slot |
| **Two line** | Boolean | `True`, `False` | `False` | Two-line layout with top label |

### Menu item (5 variants)

| Property | Type | Values | Default | Description |
|----------|------|--------|---------|-------------|
| **state** | Variant | `default`, `hover`, `pressed`, `disabled`, `focus` | `default` | Interaction state |
| **start Icon** | Boolean | `True`, `False` | `True` | Show leading icon |
| **L2** | Boolean | `True`, `False` | `False` | Show sub-level indicator (chevron) |

### Number input (3 variants)

| Property | Type | Values | Default | Description |
|----------|------|--------|---------|-------------|
| **Number** | Variant | `0`, `1`, `2` | `0` | Current numeric value display state |

---

## Anatomy

1. **Option** — Selectable list row with left icon, text + top label, checkmark, and end slot
2. **Menu item** — Actionable list row with start icon, text, and optional L2 chevron for sub-menus
3. **Number input** — Numeric entry row with label and stepper controls (increment/decrement)

---

## Visual States

### Option states
| State | Description |
|-------|-------------|
| `rest` | Default unselected appearance |
| `hover` | Subtle background highlight on pointer hover |
| `pressed` | Active press state |
| `disabled` | Non-interactive; reduced opacity |
| `focus` | Keyboard focus with focus outline |

### Menu item states
| State | Description |
|-------|-------------|
| `default` | Rest state — no hover or interaction |
| `hover` | Subtle background highlight on pointer hover |
| `pressed` | Active press state |
| `disabled` | Non-interactive; reduced opacity |
| `focus` | Keyboard focus with focus outline |

### Number input states
| Variant | Description |
|---------|-------------|
| `0` | Minimum state — decrement button is disabled |
| `1` | Mid-value state — both buttons enabled |
| `2` | Maximum / "2+" state — increment button may be disabled |

---

## Usage Rules

- Always place inside a List View body slot — these are not standalone components.
- Option: use for selection lists where users pick from predefined choices. Use `checkmark=True` for multi-select or confirmed selections. Use `Two line` for items that need a category label above the main text.
- Menu item: use for action menus triggered by a Button. Use `start Icon` to visually categorize actions. Use `L2` for items that open sub-menus; do not nest beyond one L2 level.
- Number input: use for bounded, discrete numeric selections (typically 0–10). Disable the − button at minimum and + button at maximum.
- Do not mix Option and Menu item in the same list — they serve different interaction patterns.
- Keep text concise — long labels break the row rhythm.
- Use consistent icon presence across all items in the same list.

### Do
- Use Option for selection lists and Menu item for action menus.
- Keep text concise across all element types.
- Use consistent icon presence across all items in the same list.

### Don't
- Use these outside of a List View context.
- Mix Option and Menu item in the same list.
- Use L2 chevron without an actual sub-menu being present.
- Use Number input for open-ended numeric input — use Field instead.

---

## Dark Mode Notes

All states must meet WCAG AA contrast requirements in both light and dark themes. Disabled items use reduced opacity tokens that must still maintain legibility.

---

## Related Components

| Component | Relationship |
|-----------|-------------|
| **List View** | Parent container — list view elements go inside the List View body slot |
| **Dropdown** | Consumer — uses Option and other elements as dropdown list items |
| **Menu** | Consumer — uses Menu item as action rows |
| **Checkbox** | Alternative content — can be used directly in List View body for multi-select |
| **Button** | Alternative content — can be used in List View body for action rows |
| **Field** | Alternative — use for text input within forms, not inside list rows |

---

## Open questions

None.
