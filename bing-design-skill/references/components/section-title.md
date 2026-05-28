---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Section / Title

## Summary

Section Title is the heading bar that sits at the top of every Section. It provides the section's label and optional subtitle or action link. Every section in the SERP begins with a Section Title, establishing content hierarchy and giving users a clear landmark for scanning.

**Figma Node ID:** `129439:115240` · **Type:** `COMPONENT` · **Group:** Layout  
**Tier:** Section · **Variants:** 1 (no variant properties)  
**Dependencies:** Typography tokens  
**Consumed by:** All Section body types (magazine, algo, Q&A)

---

## Variants / Types

This component has no variant properties. Style and content are configured via the following properties:

| Property | Type | Default | Options / Notes |
|----------|------|---------|-----------------|
| **style** | Variant | `Clickable title` | `Clickable title`, `Text title`, `Copilot Branding` |
| **show sub title?** | Boolean | `true` | Toggle subtitle row visibility |
| **endProps?** | Boolean | `true` | Show/hide title End Props slot |
| **Props** *(title End Props)* | Variant | `Sponsor` | `Sponsor`, `AI buttons`, `See more`, `Tabs`, `WP Tabs` |

### Style reference

| Style | Description |
|-------|-------------|
| **Clickable title** | Interactive heading with trailing chevron icon; supports hover/pressed/focus states |
| **Text title** | Static non-interactive heading text |
| **Copilot Branding** | Copilot Search logo + "Copilot Answer" label — for Copilot/AI answer sections |

### title End Props variants

| Props value | Content |
|-------------|---------|
| **Sponsor** | Sponsored Slug attribution component |
| **AI buttons** | Row of AI/Copilot action buttons |
| **See more** | Single "See more" Button |
| **Tabs** | Sub-navigation tab group (Basic component) |
| **WP Tabs** | Whole-page tab group (Basic component) |

---

## Anatomy

1. **section Title** — Nested child component rendering in one of 3 styles (Clickable title, Text title, Copilot Branding)
2. **Subtitle** — Optional secondary descriptive text below the title (shown when `show sub title?=true`); single line with ellipsis truncation when space is insufficient
3. **title End Props** — Nested child component on the trailing side; visible when `endProps?=true`; buttons in end props use `--bing-smtc-foreground-content-neutral-tertiary` foreground at rest

---

## Visual States

- **Clickable title style:** Interactive; supports hover, pressed, and focus states; trailing chevron icon
- **Text title style:** Static; no interaction states
- **Copilot Branding style:** Static; no interaction states
- End Props slot components carry their own interactive states
- Subtitle uses ellipsis truncation (`text-overflow: ellipsis`) when space is insufficient

---

## Usage Rules

- Section Title is always positioned as the first element inside a Section, above the body type
- Section Title spans the full width of the section container
- Heading text must be kept concise — 1–4 words; use sentence case
- Subtitle/action is used for supplementary context ("From trusted sources") or navigation actions ("See all results →")
- The subtitle slot must not repeat the heading text
- At column=2 (≤640px mobile), the title should remain single-line where possible
- Text truncation applies at narrow viewports — ensure heading remains meaningful when truncated
- Query suggestions may optionally appear in the title area — they requery the page according to related topics
- Do not use more than 15 explore more pills; always use within the Title component
- The `endProps` slot is pre-wired — no manual assembly is required when selecting Title End Props variants

---

## Do / Don't

### Do
- Use Section Title for every section — it provides scannability and accessible landmarks
- Keep heading text short and descriptive
- Use the action slot sparingly — only when a clear navigation target exists
- Ensure heading text is unique within the page to aid screen reader navigation

### Don't
- Use Section Title without a parent Section container
- Place multiple Section Titles within a single Section
- Use the subtitle slot for long descriptions — keep it to a few words
- Duplicate the section heading in the body content
- Use Section Title as a standalone heading outside of a Section — use standard typography instead

---

## Dark Mode Notes

Heading text meets WCAG AA contrast against the section background in both light and dark themes. Subtitle text uses secondary foreground tokens that also meet AA requirements.

---

## Open Questions

None.
