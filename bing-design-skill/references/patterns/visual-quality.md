---
updated: 2026-05-21
source: serp-design-skill v2.1 wiki/visual-quality.md, wiki/foundations/visual-quality.md
stability: beta
---

# Visual Quality Checklist

## Summary

The Visual Quality framework is a three-category QA rubric used to
evaluate cards before publishing. All designs must pass these checks in
both light and dark mode.

## Categories

### Structure

- Card must stay on-grid at all breakpoints — no overflow or empty gaps.
- Typography hierarchy must be clear at every size.
- AA contrast required in both light and dark mode.

### Expression

- Icons must share unified style, weight, and size — no mixing outline,
  fill, and thick-line styles.
- Images must maintain aspect ratio and not awkwardly crop key subjects.
- Color accents must guide focus subtly, not dominate.

### Craft & interaction

- Hover feedback uses **background color change only** — not elevation.
- Elevation applies only in container-expand scenarios.
- Skeleton used for pre-load; spinner used after user input.
- Skeleton must never appear on top of an accent card.
- Loading, error, and missing-data states must all have defined treatments.

### Localization

- Layouts must support LTR and RTL without breaking alignment.
- Icons must not be incorrectly mirrored.

## Card variant requirement

Every design must provide both:
- **Anchor card** (large, primary)
- **Accessory card** (smaller, supporting)

## Do / Don't

- **Do:** use `body/3-strong` for clickable elements (consistency rule).
- **Do:** provide both anchor and accessory card variants.
- **Do:** test in both light and dark mode.
- **Don't:** trigger elevation on card hover — use background color change only.
- **Don't:** use skeleton loading on top of an accent card.
- **Don't:** rely solely on color to convey meaning.
- **Don't:** apply light-theme surfaces directly on dark backgrounds.

## Open questions

None.
