---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# ML Body / PAA Answer

## Summary

PAA (People Also Ask) Answer is the most complex ML Body module. It renders an expandable Q&A list inline within the algo mainline, combining a Section / title ("People also ask" heading), a List View body (expandable question rows), and a Section / footer (expand/collapse controls). Users can expand individual questions to reveal answers, making it a rich interactive module within the search results stream.

**Figma Node ID:** `130744:277730` · **Type:** `COMPONENT_SET` · **Group:** Layout  
**Tier:** Section (ML Body module) · **Variants:** 1 (no variant properties)  
**Dependencies:** Section / title, List View, Section / footer  
**Consumed by:** Section body / algo — Zone A (Mainline)

> This component is used **only** inside `Section body / algo` Zone A, slotted between standard algorithm results. It is not a standalone section.

---

## Structure

```
ML Body / PAA Answer
├── Section / title — "People also ask" heading
├── List View
│   └── body [SLOT] — expandable question/answer rows
└── Section / footer — expand/collapse controls
```

---

## Anatomy

1. **Section / title** — Text title ("People also ask" or localized equivalent)
2. **Body (ListView)** — Accordion list of expandable question rows
3. **Section / footer** — Feedback module with expand/collapse action ("See more" / "See less")

---

## Visual States

This component has no variant properties. Interactive states are delegated to child components:
- Each question row is individually expandable/collapsible (accordion behavior)
- Expanded state reveals an answer snippet with source attribution below the question
- The Section / footer "See more" / "See less" action is a paired toggle

---

## Usage Rules

- The Section / title must display "People also ask" or a localized equivalent
- Each question row in the List View body slot must be individually expandable/collapsible
- Answers revealed on expansion must be concise snippets with source attribution
- The Section / footer provides "See more" / "See less" to load additional questions
- The module occupies the full width of Zone A (Mainline)
- Structure stacks vertically: title → question list → footer
- List View gap should be set to `0` (none) — questions form a continuous block with dividers between items
- The footer sits flush below the last question row
- Show 3–5 questions initially; use the footer's "See more" action for additional ones
- Questions must not be auto-expanded on load — let users choose which questions to explore
- Expansion/collapse transitions should use the Transition component for smooth animation
- The module reflows with Zone A — question row text wraps naturally at narrower widths
- Test at all 4 algo column variants (12, 8, 4, 2)

### Section / footer configuration for PAA

| Property | Value | Reason |
|----------|-------|--------|
| **click action** | `Expansion: See more` / `Expansion: See less` | Toggle to show/hide additional questions |
| **Feedback** | `false` | Feedback not typically shown on PAA |
| **Footnote** | `false` | No attribution needed |

---

## Do / Don't

### Do
- Use PAA Answer when the search query has strong informational intent and related questions are available
- Show 3–5 questions initially, with more available via the footer's "See more" action
- Keep answer snippets concise — link to the full source for detailed answers
- Pair "See more" and "See less" footer states as a toggle
- Ensure the module integrates seamlessly with surrounding algo results in spacing and alignment

### Don't
- Use PAA Answer as a standalone section — it is an ML Body module for Zone A only
- Show too many questions at once — start with 3–5 and rely on "See more" for additional ones
- Omit the Section / title — "People also ask" provides essential context
- Omit the Section / footer — the expand/collapse control is integral to the PAA experience
- Auto-expand questions on load
- Use for non-question content — PAA is specifically for Q&A patterns

---

## Dark Mode Notes

All text content (questions, answers, metadata) must meet WCAG AA contrast in both light and dark themes. The expand/collapse chevron icon must meet AA contrast requirements. Dividers between question rows use standard border tokens with sufficient contrast.

---

## Open Questions

None.
