---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Section / Body Type / Q&A

**Figma Node ID:** `129219:43211` · **Type:** `COMPONENT_SET`  
**Group:** Layout · **Tier:** Section · **Variants:** 4  
**Dependencies:** Card components, Copilot answer components, Zone system  
**Consumed by:** Page body

---

## Summary

The Q&A body type is a 2-zone layout optimized for answer-first experiences — Copilot answers, featured snippets, and Q&A content. Zone A holds the primary answer content with generous width, while Zone C provides a narrow sidebar. At narrow breakpoints (column=4, column=2), Zone C is hidden entirely, giving the answer full focus.

This component is appropriate for Copilot/AI answer sections, featured snippets, and Q&A experiences where the primary content should dominate with minimal sidebar distraction, and when sidebar content is supplementary and can be safely hidden on mobile. It is not appropriate for standard algorithm results (use Algo), curated multi-card layouts (use Magazine), or when sidebar content is critical and must be visible at all breakpoints.

---

## Variants / Types

| Property | Values | Default | Description |
|----------|--------|---------|-------------|
| **column** | `12`, `8`, `4`, `2` | `12` | Number of grid columns; maps to Page breakpoint |

---

## Responsive Zone Layout

| Column | Zone A (Answer) | Zone C (Sidebar) | Layout |
|--------|----------------|-----------------|--------|
| **12** | span 8 | span 3 | A wide + C sidebar (1 spacer col) |
| **8** | span 6 | span 2 | A wider, C narrower |
| **4** | span 4 | **hidden** | A only, full span |
| **2** | span 2 | **hidden** | A only, full span |

### Breakpoint mapping

| Page breakpoint | Page columns | Q&A column variant | Zone C visible? |
|----------------|-------------|-------------------|----------------|
| ≥1520px | 12 | `column=12` | Yes |
| 1519–1392px | 12 | `column=12` | Yes |
| 1391–1025px | 8 | `column=8` | Yes |
| 1024–641px | 4 | `column=4` | No — hidden |
| ≤640px | 2 | `column=2` | No — hidden |

---

## Zone Roles

| Zone | Role | Content |
|------|------|---------|
| **A** | Answer | Primary answer content — Copilot response, featured snippet, Q&A body |
| **C** | Sidebar | Supplementary content — related links, source citations, entity info |

---

## Anatomy

1. **Zone A** — Answer/response content area (clipped at 424px when collapsed via unified `expanded` state)
2. **Zone C** — Citation cards + "Show all" button + citation flyout (hidden at col 4/2)

Expansion is unified at the section level. Zone C has no expansion — instead, a "Show all" button at the bottom of Zone C opens a citation flyout with the full reference list. The SectionFooter (expand/collapse) is rendered as a sibling after the Q&A body, not inside it.

---

## Visual States

This component is a structural container. Interaction states are delegated to child components. Zone A may be in a collapsed state (clipped at 424px) or expanded state. When Zone C is hidden at col 4/2, it must be `display: none` or `aria-hidden="true"` — not just visually hidden — so that hidden focusable elements are removed from the tab order.

---

## Usage Rules

- Zone A must be a complete, self-contained answer experience — it must be self-sufficient since Zone C may be hidden.
- Zone C holds supplementary content that enhances but is not required for comprehension. Critical information must never be placed exclusively in Zone C.
- Section Title always precedes the Q&A body. Internal gap between zones follows the 24px grid gap.
- Zone A grows from span 8 → span 6 (of 8) as the page narrows from 12 to 8 columns.
- At column=4/2, Zone A stretches to full span; Zone C is removed from view entirely (not stacked).
- Answer content in Zone A must adapt gracefully to both span 8 (of 12) and full-span rendering.

### Do
- Ensure Zone A is a complete, self-contained answer experience.
- Use Zone C for supplementary citations, related links, or entity context.
- Test the experience at column=4 to verify nothing critical is lost when Zone C hides.
- Maintain consistent keyboard navigation even when Zone C is hidden.

### Don't
- Place essential information only in Zone C — it disappears on tablet and mobile.
- Assume Zone C is always visible — design Zone A to stand alone.
- Use Q&A body for standard search results — use Algo body instead.
- Hardcode zone widths in px — cards must respond to container span signals.
- Nest another Section body type inside Zone A.

---

## Dark Mode Notes

Answer text meets WCAG AA contrast in both light and dark themes. Citation links and supplementary text in Zone C maintain sufficient contrast. Copilot answer styling must be legible on both themed and neutral backgrounds.

---

## Related Components

| Component | Relationship |
|-----------|-------------|
| **Section / title** | Sibling — always precedes Q&A body |
| **Section / footer** | Sibling — follows Q&A body for expand/collapse; Zone C uses "Show all" button + flyout instead |
| **Section body / algo** | Alternative — for standard algo result layouts |
| **Section body / magazine** | Alternative — for curated content layouts |
| **Page** | Parent — breakpoints determine which column variant renders |

---

## Open questions

None.
