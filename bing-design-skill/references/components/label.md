---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Label

**Figma Node ID:** `80959:305687` · **Type:** `COMPONENT_SET` · **Group:** Display · **Tier:** Base / SDL Atom · **Variants:** 180 · **Consumed by:** Cards, Form fields, Section headings, Metadata rows, Attribution lines

## Summary

Label is a non-interactive text display component used for structured labeling across the ACF design system. It provides a consistent typographic API for rendering text at various sizes, weights, colors, and alignments — ensuring hierarchy and readability in cards, form elements, metadata, and content sections.

This component is appropriate for displaying structured text that follows a defined typographic hierarchy (titles, descriptions, metadata), as a form field label with optional required indicator, for semantic status text (success, warning, error), and to render body copy or attribution lines. It is not for interactive text that triggers navigation (use a link or Button), for status indicators that need background emphasis (use Badge), for long-form paragraph content with no structural role, or for section-level headings that carry semantic HTML weight.

---

## Variants

| Property | Values | Default |
|----------|--------|---------|
| **color** | `prose`, `primary`, `secondary`, `success`, `warning`, `danger` | `prose` |
| **weight** | `normal`, `medium` | `normal` |
| **size** | `xl`, `lg`, `md`, `sm`, `xs` | `xs` |
| **textAlign** | `start`, `center`, `end` | `start` |

Total: 6 colors × 2 weights × 5 sizes × 3 textAlign = **180 variants**

Additionally, a **Required** boolean property (default `true`) shows or hides a required indicator (asterisk).

---

## Anatomy

1. **Label text** — Primary descriptive text; consumer-editable
2. **Required indicator** — Asterisk (*) shown when `Required=true`; toggled off for non-form labels

---

## Visual States

Label is a non-interactive display element — it has no pointer events by default and inherits interaction when placed inside an interactive container.

---

## Color — Semantic Intent

| Color | Token Pattern | Intent | Use Case |
|-------|---------------|--------|----------|
| **prose** | `-foreground-prose-` | Default body text | Standard descriptions, body copy, card text |
| **primary** | `-foreground-brand-` | Brand / accent emphasis | Highlighted keywords, inline links, branded callouts |
| **secondary** | `-foreground-secondary-` | Muted / supporting | Metadata, attribution, captions, supplementary text |
| **success** | `-foreground-success-` | Positive status | Confirmation messages, completion states, positive metrics |
| **warning** | `-foreground-warning-` | Caution status | Warning notices, approaching-limit indicators |
| **danger** | `-foreground-danger-` | Error / critical status | Validation errors, required-field messages, critical alerts |

## Weight — Typographic Emphasis

| Weight | Token | Purpose |
|--------|-------|---------|
| **normal** | regular | Body text, descriptions, supplementary content |
| **medium** | `-strong` | Titles, headings, inline emphasis |

In dense or repeated module layouts, titles may use `normal` weight to reduce visual noise — per token guide guidance that "when hierarchy doesn't add value, strong weight would add noise."

## Size Scale

| Size | Body Equivalent | Purpose | Example |
|------|-----------------|---------|---------|
| **xl** | body1 / body1-strong | Hero text, single-answer experiences | Featured answer, standalone response, prominent stat |
| **lg** | body2 / body2-strong | Section titles, emphasized text | Card heading in open layouts |
| **md** | body3-strong | Card titles, highlighted keywords | List item titles, repeated card titles |
| **sm** | body3 | Standard body text | Descriptions, supporting text, card body copy |
| **xs** | caption / small | Metadata, attribution, fine print | Source attribution, timestamps, legal disclaimers |

## Text Alignment

| Alignment | Behavior | Use Case |
|-----------|----------|----------|
| **start** | Left in LTR, right in RTL (default) | Standard content flow |
| **center** | Horizontally centered | Centered card layouts, hero sections, empty states |
| **end** | Right in LTR, left in RTL | Numeric values, prices, right-justified columns |

---

## Usage Rules

- A clear visual hierarchy is established: one `xl`, a few `lg`/`md`, many `sm`/`xs`.
- `medium` weight is used to create title/body distinction — size alone is not relied on.
- `start` alignment is the default — it respects LTR/RTL directionality automatically.
- Semantic colors (`success`, `warning`, `danger`) are used only for their intended status meanings — never decoratively.
- The Required indicator is enabled only for form labels where the field is mandatory.
- `xs` size keeps `secondary` or `prose` color and `normal` weight for readability.
- `primary` (brand) color is not used for long body text — it is for emphasis and accents only.

---

## Do / Don't

### Do
- Maintain clear typographic hierarchy — use one `xl` for hero content, a few `lg`/`md` for titles, `sm`/`xs` for body and metadata.
- Use `medium` weight for titles and headings, `normal` weight for body text.
- Use `prose` as the default color for general content.
- Use semantic colors (`success`, `warning`, `danger`) only for their intended status meanings.
- Reserve the Required indicator for actual form labels where the field is mandatory.
- Use `start` alignment as the default.

### Don't
- Don't use `danger` color for non-error text.
- Don't mix sizes inconsistently within the same context.
- Don't use `medium` weight for all text — overusing bold dilutes hierarchy.
- Don't use `primary` (brand) color for long body text.
- Don't set Required to `true` on non-form labels.
- Don't use `center` or `end` alignment for form labels.

---

## Dark Mode Notes

All 6 color variants meet WCAG 2.1 AA contrast requirements in both light and dark themes. `secondary` (muted) color maintains a minimum 4.5:1 contrast ratio against card and page backgrounds. Semantic colors are validated against both `-on-primary-` and `-on-secondary-` card backgrounds.

---

## Related Components

| Component | Relationship |
|-----------|-------------|
| **Badge** | Use instead when status text needs background emphasis or a pill-shaped container |
| **Button** | Use instead when text should trigger an action — Label is non-interactive |
| **Input / Form field** | Common consumer — uses Label for field identification and required indicators |
| **Card** | Common consumer — uses Label at various sizes for titles, descriptions, and metadata |
| **Section heading** | May use Label internally for consistent typographic styling |

---

## Open questions

None.
