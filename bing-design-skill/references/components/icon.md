---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Icon

## Summary

Icon is a foundational display atom that renders a single icon glyph at one of five sizes. The actual glyph is controlled via an instance swap (`iconStyle`), allowing any icon from the FluentUI icon library to be selected. Icons are used throughout the design system as visual affordances inside buttons, tabs, toasts, section footers, and other interactive or informational components.

**Figma Node ID:** `71401:239498` · **Type:** `COMPONENT_SET` · **Group:** Display  
**Tier:** Base / Foundational Atom · **Variants:** 5 · **Consumed by:** Button, Accordion, Toast, Section footer, Tab, Ads menu icon, and many more

---

## Variants / Types

| Property | Values | Default | Description |
|----------|--------|---------|-------------|
| **iconSize** | `xl`, `l`, `m`, `s`, `xs` | `xl` | Size of the icon container |
| **iconStyle** | *(instance swap)* | — | The icon glyph to display — swap from the FluentUI icon library |

### iconSize reference

| Value | Purpose |
|-------|---------|
| **xl** | Extra large — hero or featured icon placements |
| **l** | Large — prominent standalone icons |
| **m** | Medium — default size for most component slots (Button, Tab) |
| **s** | Small — compact inline icons |
| **xs** | Extra small — metadata, captions, dense layouts |

---

## Anatomy

1. **Icon glyph** — Vector shape rendered via instance swap; consumer selects from the FluentUI icon library

---

## Visual States

- Icons are non-interactive — they carry no hover, pressed, or focus states of their own
- Hover, pressed, and focus states are inherited from the wrapping interactive element (e.g., Button)

---

## Usage Rules

- The `iconStyle` property uses instance swap — the glyph is selected from the published FluentUI icon library
- Always match `iconSize` to the parent component's size context (e.g., `s` icon inside a small button)
- The Figma icon page contains the full glyph library (206 icons as of April 2026)
- Only icons registered in Bing SNR will render correctly in production
- When icons are placed inside components, the parent component typically controls size — `iconSize` generally does not need to be set manually
- Always use the **line style** (outline) variant — never the fill/solid style unless explicitly required
- All icons must come from the FluentUI icon set; other icon libraries are not permitted

---

## Do / Don't

### Do
- Always use the **line style** (outline) as the default — never fill/solid style unless specifically required
- Source all icons from the **FluentUI icon library**
- Ensure the icon glyph is **registered in Bing SNR** before using it in production designs
- Use icons to reinforce meaning alongside text labels, not as the sole indicator
- Maintain consistent icon sizes within the same context
- Ensure sufficient contrast between icon color and background

### Don't
- Use fill/solid style icons — line style is the ACF standard
- Use icons from non-FluentUI sources
- Use an icon that has not been registered in Bing SNR
- Use icons as the sole means of conveying critical information without accessible text
- Mix icon sizes within the same row or component group
- Use decorative icons that add no informational value in dense layouts

---

## Dark Mode Notes

Icon color must meet WCAG AA contrast requirements against the background in both light and dark themes. No icon-specific dark mode variant exists — color is controlled by the consuming component's token bindings.

---

## Open Questions

None.
