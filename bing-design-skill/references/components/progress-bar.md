---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Progress Bar

## Summary

Progress Bar visualizes the completion status of a numerical value within a defined range. It communicates how far a process or metric has advanced — such as a score, completion percentage, or capacity — using a horizontal filled track. The bar fills proportionally from left to right, accompanied by optional helper text below.

This component supports **determinate** states only (a known current value within a min–max range). Indeterminate/loading states are not supported — use Spinner or Skeleton for those scenarios.

**Figma Node ID:** `108537:5068` · **Type:** `COMPONENT_SET` · **Group:** Feedback  
**Tier:** Available · **Variants:** 8 (4 bar thickness × 2 gap) · **Consumed by:** Cards, answer panels, loading states, data visualizations

---

## Variants / Types

| Property | Type | Values | Default | Description |
|----------|------|--------|---------|-------------|
| **bar thickness** | Variant | `sm`, `md`, `lg`, `xl` | `sm` | Height of the progress track |
| **gap** | Variant | `default`, `compact` | `default` | Spacing between the bar and helper text |

### Bar thickness reference

| Thickness | Track Height | When to use |
|-----------|-------------|-------------|
| **SM** | 1px | Minimal visual weight; subtle, ambient progress indicators where the bar is secondary to other content |
| **MD** | 2px | Default; balanced visibility for most card and panel contexts |
| **LG** | 4px | Increased prominence; use when the progress bar is a primary focus element |
| **XL** | 8px | Maximum visual weight; hero-level progress displays or dashboards |

### Gap reference

| Gap | Spacing | Helper Text Size | When to use |
|-----|---------|-------------------|-------------|
| **default** | 8px | Caption 1 (13px) | Standard spacing for most contexts |
| **compact** | 2px | Caption 2 (11px) | Dense layouts where vertical space is constrained |

### Primary configurations

| Config | Bar Thickness | Gap | Use case |
|--------|--------------|-----|----------|
| **Default** | MD (2px) | 8px | Standard cards, lower information density areas |
| **Compact** | MD (2px) | 2px | Higher information density areas, dense cards, stacked layouts |

---

## Anatomy

1. **Track** — Full-width background bar with pill shape (cornerRadius: 9999); fill uses a token-bound 10% black for a subtle background
2. **Indicator / Current value bar** — Nested inside the track; fills proportionally based on current value; uses brand blue fill (token: `smtc/ctrl/foreground/brand/rest`)
3. **Helper text** — Optional descriptive text below the bar; uses secondary foreground color token; Caption 1 (13px) for default or Caption 2 (11px) for compact

---

## Visual States

- **Progress bar** is display-only and non-interactive — it has no hover, focus, or pressed states
- Bar fill width updates proportionally when the current value changes
- Helper text updates automatically to reflect the current value/label

---

## Usage Rules

- Progress bars stretch to fill their container width (`layoutSizingHorizontal: FILL`)
- Place inside cards or panels where the bar contextualizes content already present
- For multiple progress bars in a list, use consistent thickness and gap settings
- Use **SM** or **MD** thickness for supplementary/ambient progress; reserve **LG** and **XL** for primary focus
- Pair **compact** gap with dense data layouts; pair **default** gap with standard card layouts
- Do not combine different thickness/gap settings in the same visual grouping
- Include helper text to clarify what the bar represents — a bare bar without context is ambiguous

---

## Do / Don't

### Do
- Use the **default** configuration (MD thickness, default gap) as the standard starting point for most contexts
- Match the progress bar width to its parent container
- Include helper text to clarify what the progress represents
- Use consistent bar thickness within the same card or section
- Pair **compact** gap with **SM** or **MD** thickness for dense layouts
- Use meaningful numerical helper text (e.g., "3 of 5 completed") rather than generic labels

### Don't
- Use Progress Bar for indeterminate/unknown-duration loading — use **Spinner** or **Skeleton** instead
- Use **XL** thickness for every bar — overuse creates visual heaviness
- Mix different thickness or gap variants within the same data group
- Omit helper text when the progress bar appears without clear surrounding context
- Use the progress bar as an interactive control — it is display-only; use a slider for user-adjustable values
- Exceed the container width — always use `FILL` sizing

---

## Dark Mode Notes

The indicator (brand blue) against the track background (10% black) meets WCAG 2.1 AA contrast in both light and dark themes. Helper text uses secondary foreground tokens that maintain AA contrast in all theme modes.

---

## Open Questions

None.
