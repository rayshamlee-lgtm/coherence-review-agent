---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Section / Footer

## Summary

Section Footer is the closing bar for sections, providing navigation actions, user feedback, and attribution. It is highly configurable through 4 independent properties that combine to produce 27 variants. The footer is the **only** sanctioned location for the Feedback module (thumbs up/down) — feedback cannot appear standalone elsewhere in the SERP.

**Figma Node ID:** `44265:223540` · **Type:** `COMPONENT_SET` · **Group:** Layout  
**Tier:** Section · **Variants:** 27  
**Dependencies:** Button, Feedback module, Focus outline  
**Consumed by:** All Section types

---

## Variants / Types

| Property | Values | Default | Description |
|----------|--------|---------|-------------|
| **click action** | `Redirect`, `Expansion: See more`, `Expansion: See less`, `No action` | `Redirect` | Main CTA behavior |
| **Feedback** | `true`, `false` | `false` | Show thumbs up/down feedback module |
| **Footnote** | `true`, `false` | `false` | Show attribution/source footnote |
| **block?** | `true`, `false` | `false` | Whether footer renders as a block element |
| **show Gradient** | `true`, `false` | `true` | Show top gradient fade |
| **Footnote link** | `true`, `false` | `true` | Show footnote link |

### Click action reference

| Value | Behavior | Use case |
|-------|----------|----------|
| **Redirect** | Navigates to a new page/URL | "See all results →", "View on source site" |
| **Expansion: See more** | Expands collapsed section content beyond default 424px; body height becomes dynamic | Section has truncated/hidden results below fold |
| **Expansion: See less** | Collapses previously expanded content back to 424px | Paired toggle with "See more" |
| **No action** | No CTA button rendered | Footer used solely for Feedback and/or Footnote |

### Variant count

27 variants arise from: 4 click action × 2 Feedback × 2 Footnote × 2 block? = 32 possible; 5 invalid combinations are excluded, yielding **27 active variants**.

### Common configurations

| Use case | click action | Feedback | Footnote | block? |
|----------|-------------|----------|----------|--------|
| Standard section with "See more" | `Expansion: See more` | `false` | `false` | `false` |
| Section with feedback | `No action` | `true` | `false` | `false` |
| Section with redirect + attribution | `Redirect` | `false` | `true` | `false` |
| Copilot answer with feedback + footnote | `No action` | `true` | `true` | `false` |

---

## Anatomy

1. **Gradient** — Optional fading overlay applied when section body content is cropped; smooths the visual cutoff edge before the footer
2. **Divider** — Horizontal rule flanking the action button on both sides (divider → button → divider)
3. **Action button** — "See more" / "See less" (expansion) with chevron ↓/↑, or "See all" (redirect) with chevron →; hidden when click action is 'No action'
4. **Footnote** — Optional row of source/disclaimer text with an inline link
5. **Feedback module** — Optional thumbs up/down user feedback widget (pre-wired; cannot be placed standalone elsewhere)

---

## Visual States

- **Redirect:** "See all" button with right-pointing chevron; no toggle state
- **Expansion: See more:** Body height expands beyond 424px; button toggles to "See less" with chevron ↑; pushes content below downward
- **Expansion: See less:** Body height collapses back to 424px; button toggles back to "See more" with chevron ↓
- **No action:** Footer renders without an action button; Footnote and/or Feedback module may still be present

---

## Usage Rules

- Section Footer always appears as the last child in a Section, after the body type
- When `block?=true`, the footer renders as a full-width block element
- Spacing between body and footer follows section internal gap tokens
- "Expansion: See more" and "Expansion: See less" must always be used as a paired toggle
- "No action" + `Feedback=true` is the designated pattern for showing standalone feedback within a section
- Redirect label must use clear action text: "See all", "View source", "More results"
- Footer button text format: "See all/more [optional text, up to 15 characters]" (e.g., "See all athletic shoes for kids")
- Only a right-pointing or downward-pointing chevron icon is used in the footer button
- Footnote text must be kept brief — source name, date, or attribution ("Powered by…", "Source: Wikipedia")
- At narrow breakpoints (column=2), elements stack vertically
- The Feedback module (`🔗 dependency / feedback module`) is pre-wired inside Section Footer — this is the **only** way to surface feedback thumbs in the SERP

---

## Do / Don't

### Do
- Use Section Footer to close every section — even if only using `No action` with Feedback
- Pair "Expansion: See more" and "Expansion: See less" as toggle states
- Use `No action` + `Feedback=true` for standalone feedback within a section
- Keep footnote text concise and attribution-focused
- Use the `Redirect` action for navigation to external or paginated content
- Use only a right-pointing or downward-pointing chevron icon in the footer button
- Follow the footer button text format: "See all/more [optional text, up to 15 characters]"

### Don't
- Place the Feedback module anywhere other than inside Section Footer
- Use multiple click actions simultaneously — only one CTA per footer
- Use "Expansion: See less" without a corresponding "See more" state
- Use `block?=true` unless the footer needs to span full container width as a block
- Overload the footer with both a redirect CTA and expansion — pick one intent
- Use any icon other than a right-pointing or downward-pointing chevron
- Modify the footer button text beyond the prescribed format

---

## Dark Mode Notes

All text and interactive elements meet WCAG AA contrast in both light and dark themes. Feedback icons maintain sufficient contrast in both themes. Footnote text uses secondary foreground tokens that meet AA requirements.

---

## Open Questions

None.
