---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Field

## Summary

Field is a form input component with configurable label, helper text, status text, and info indicator. It provides a consistent input pattern across all form contexts in the ACF design system. Field is the building block for composed form elements such as search inputs, date pickers, and filter controls.

**Figma Node ID:** `80959:305713` · **Type:** `COMPONENT` · **Group:** Data Entry  
**Tier:** Special / Utility · **Variants:** 1 (single component with boolean/text properties) · **Consumed by:** Form components, Date picker, Search bar

---

## Variants / Types

This component has no variant properties. All sub-elements are toggled via boolean and text properties.

**Field-level properties:**

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| **Label** | Boolean | `true` | Show field label above the input |
| **Status text** | Boolean | `true` | Show validation status text below the input |
| **Status text content** | Text | "Status text" | Content of the status text (e.g., "This field is required") |
| **Helper text** | Boolean | `true` | Show helper/hint text below the input |
| **Helper text content** | Text | "Helper text" | Content of the helper text (e.g., "Enter your full name") |
| **Info sign** | Boolean | `true` | Show info indicator icon next to the label |

**Nested Text input properties:**

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| **State** | Variant | `rest` | rest, hover, pressed, disabled, error, focus, read-only |
| **Size** | Variant | `Default` | Default, Large |
| **Style** | Variant | `Default` | Default, Borderless |
| **show Left icon?** | Boolean | `false` | Show leading icon inside input |
| **show Right icon?** | Boolean | `false` | Show trailing icon inside input |
| **show Right button?** | Boolean | `false` | Show trailing action button inside input |

---

## Anatomy

1. **Label** — Label component showing the field name; includes required indicator (*)
2. **Info sign** — Optional Icon instance for contextual help; appears next to the label when enabled
3. **Text input** — Primary input surface where users type; includes placeholder text and cursor
4. **Helper text** — Static guidance below the input (e.g., format hints)
5. **Status text** — Dynamic validation feedback below the input (e.g., error/success messages)
6. **Container** — Vertical auto-layout wrapping label + input + helper/status text

---

## Visual States

Text input states (applied to the nested input sub-component):

| State | Description |
|-------|-------------|
| **rest** | Default idle state |
| **hover** | Pointer over the input |
| **pressed** | Input is being clicked/tapped |
| **focus** | Input is actively focused (keyboard or mouse) |
| **disabled** | Non-interactive; reduced opacity |
| **error** | Validation failed; error styling applied; `aria-invalid="true"` |
| **read-only** | Displays content without allowing editing |

---

## Usage Rules

- Label and Info sign are independent toggles — Info sign only appears when Label is visible
- Helper text and Status text can both appear simultaneously or independently
- Status text should convey validation state (error, success, warning)
- Helper text provides static guidance for the field
- Field occupies the full width of its parent container — no fixed width
- Label sits above the input with `x-small` spacing; helper/status text sits below with `xx-small` spacing
- Placeholder text disappears when the user starts typing — it must not be used as a substitute for Label
- Info sign should be used sparingly — only when additional context is genuinely helpful

---

## Do / Don't

### Do
- Always include a Label for accessibility (visually hide it with `aria-label` if needed)
- Use Helper text for format hints and pre-fill guidance
- Use Status text for dynamic validation feedback
- Use Info sign sparingly — only when additional context is genuinely helpful
- Provide clear, actionable error messages in Status text

### Don't
- Use placeholder text as a substitute for Label — placeholders disappear on focus
- Show both error and success Status text simultaneously
- Overload Helper text with long instructions — keep it to one line
- Use Info sign for critical information — it requires an extra click to reveal
- Use Field for display-only content — it implies editability

---

## Dark Mode Notes

Label, Helper text, and Status text all meet WCAG AA contrast in both light and dark themes. Error state Status text uses the danger/error foreground token — it must be distinguishable by more than color alone (icon or text prefix). Input border contrast meets AA in both theme modes.

---

## Open Questions

None.
