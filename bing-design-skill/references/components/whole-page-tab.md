---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Whole Page Tab

**Group:** Navigation · **Tier:** Sub-component · **Consumed by:** Section Title → endProps → wp-tabs variant

## Summary

Whole Page Tab is a pill-shaped query refinement tab used within Section Title's end props slot. It allows users to switch between topic views within a section (e.g., "Overview", "Movies", "Awards"). This is not a standalone component — it is always nested inside Section Title via the Title End Props dependency.

---

## Variants / States

| State | Appearance |
|-------|------------|
| **Rest (inactive)** | Outlined border (`--bing-smtc-stroke-ctrl-default`), transparent background, brand foreground |
| **Active** | Filled background (`--bing-smtc-background-ctrl-subtle-rest`), 1px solid border (`--smtc-ctrl-lite-filter-foreground-selected`), brand foreground |
| **Hover** | Filled background (`--bing-smtc-background-ctrl-outline-hover`), transparent border, dark text |
| **Pressed** | Filled background (`--bing-smtc-background-ctrl-outline-pressed`), transparent border, dark text |

---

## Anatomy

1. **Pill container** — Rounded rectangle with corner radius from `--mai-smtc-corner-ctrl-xlg-rest` (16px fallback)
2. **Tab label** — Text content using `--bing-smtc-text-global-body3` (14px/22px 400 fallback)

---

## Tokens

| Property | Token | Fallback |
|----------|-------|----------|
| Corner radius | `--mai-smtc-corner-ctrl-xlg-rest` | 16px |
| Padding | `--smtc-padding-ctrl-lg-text-top/bottom` + `--smtc-padding-ctrl-lg-horizontal-default` | 12px 16px |
| Font | `--bing-smtc-text-global-body3` | 14px/22px 400 |
| Rest border | `--bing-smtc-stroke-ctrl-default` | rgba(0,0,0,0.1) |
| Active border | `--smtc-ctrl-lite-filter-foreground-selected` | #322d29 |
| Rest foreground | `--smtc-foreground-ctrl-on-outline-rest` | #0159ba |

---

## Usage Rules

- Whole Page Tab is only placed inside Section Title's end props slot (via Title End Props, WP Tab variant).
- It is used for topic refinement within a section — switching between topic views (e.g., "Overview", "Movies", "Awards").
- Tab text is concise and clearly descriptive of the topic view.
- The Active state is maintained for the currently selected topic.
- Whole Page Tab and the Tabs variant (from Title End Props) are not mixed in the same page context — one tab pattern per page region.

---

## Do / Don't

### Do
- Use for topic-level refinement within a section header.
- Maintain the Active state on the currently selected tab.
- Keep tab labels concise.

### Don't
- Don't use standalone outside of Section Title's end props slot.
- Don't mix with the Tabs variant in the same page region.
- Don't use for page-level navigation — this is a section-level refinement pattern.

---

## Dark Mode Notes

All 4 states must meet WCAG AA contrast requirements in both light and dark themes. Token-based color application handles theme switching. Rest border color (`rgba(0,0,0,0.1)` fallback) must be verified for sufficient contrast in dark mode.

---

## Related Components

| Component | Relationship |
|-----------|-------------|
| **Section / title** | Grandparent — Whole Page Tab appears in the title's end props slot |
| **Title End Props** | Parent — the WP Tab variant of Title End Props contains Whole Page Tab |
| **Tabs** | Related — alternative tab pattern for sub-navigation within sections |

---

## Open questions

- The source wiki file for whole-page-tab.md is truncated — the full token table and any additional states or notes beyond the 4 interaction states were not present in the source. Confirm completeness against Figma source.
