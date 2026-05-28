---
updated: 2026-05-21
source: serp-design-skill v2.1 wiki/foundations/accessibility.md
stability: beta
---

# Accessibility

## Summary

All components must meet **WCAG 2.1 AA**. Semantic foreground tokens on
paired background tokens meet contrast requirements when used correctly.
Every interactive element needs a visible focus ring, logical tab order,
and correct ARIA roles.

## Contrast requirements

| Element | Minimum ratio |
|---|---|
| Normal text (<18px) | 4.5:1 |
| Large text (≥18px or ≥14px bold) | 3:1 |
| UI components, graphical objects | 3:1 |

Minimum touch target: **44×44px** on mobile.

## Focus ring

| Token | Use |
|---|---|
| `--smtc-ctrl-focus-outer-stroke` | Focus ring color |

Use 2px focus ring with offset; ensure 3:1 contrast against surrounding
background.

## Do / Don't

- **Do:** verify tertiary text on accent card backgrounds — may be borderline on contrast.
- **Do:** trap focus inside modals and drawers; close on Escape.
- **Do:** support keyboard navigation for all interactive elements.
- **Don't:** remove `:focus-visible` styles.
- **Don't:** rely solely on color to convey meaning.
- **Don't:** use CSS-only reordering that breaks tab sequence.

## Dark mode

Semantic token pairs maintain AA compliance in both modes when used
correctly.

## Open questions

None.
