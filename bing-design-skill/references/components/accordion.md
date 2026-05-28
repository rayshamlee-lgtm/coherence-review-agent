---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Accordion

## Summary

Accordion is a vertically stacked disclosure widget that allows users to expand and collapse content sections. Each accordion item has a header (always visible) and a body (shown when expanded). It uses the Basic component as its body slot container, enabling any content to be placed inside. The primary use case within Bing SERP is PAA (People Also Ask) scenarios.

**Figma Node ID:** `70645:184068` · **Type:** `COMPONENT_SET` · **Group:** Navigation · **Variants:** 2

**Dependencies:** accordion header, Basic (body slot), Button (chevron)

**Consumed by:** Answer cards, FAQ sections, expandable content panels

---

## Variants / Types

### expanded?

| Value | Description |
|-------|-------------|
| `false` (default) | Collapsed — only the header is visible; body content is hidden |
| `true` | Expanded — body content is revealed below the header |

---

## Visual States

The accordion has two display states driven by the `expanded?` property. There are no separate pointer interaction states (hover, pressed) at the accordion level; interaction is handled by the child Button (chevron).

| State | Header | Body |
|-------|--------|------|
| Collapsed (`expanded?=false`) | Visible; chevron points down | Hidden |
| Expanded (`expanded?=true`) | Visible; chevron points up | Visible; height adapts to content (HUG) |

---

## Anatomy

1. **Header bar** — Always-visible clickable row containing the title text and expand/collapse chevron. Collapsed height is fixed at 60px.
2. **Title text** — Descriptive label summarizing the hidden content; consumer-editable.
3. **Chevron button** — Pre-wired Button that rotates on state change; points down when collapsed, up when expanded. Must not be manually overridden.
4. **Body slot** — Uses Basic as a content wrapper. The body uses `align-items: stretch` to fill container width, `min-width: 0` and `overflow: hidden` to constrain content within the grid parent, and CSS grid animation (`grid-template-rows: 0fr → 1fr`) for smooth expand/collapse.

---

## Usage Rules

- Accordion is used primarily for PAA (People Also Ask) scenarios on Bing SERP.
- Body content should be composed of answer cards — this is the standard content pattern for expanded accordion items.
- Multiple accordions in a group may be expanded simultaneously unless space is critical.
- The default state is collapsed (`expanded?=false`) to conserve vertical space.
- Width fills the container (640px default, stretches with FILL sizing).
- Accordions must not be nested inside other accordions.
- Critical information that users must see must not be placed inside an accordion body.

---

## Do / Don't

### Do
- Use descriptive header text so users can scan and decide what to expand.
- Default to collapsed to save vertical space.
- Allow multiple accordions to be expanded simultaneously unless space is critical.
- Use consistent header styling across all accordion items in a group.
- Place the most important or frequently accessed section first.

### Don't
- Don't nest accordions inside accordions — it creates confusing navigation depth.
- Don't hide critical information that users must see.
- Don't use accordion for very short content that does not benefit from collapsing.
- Don't override the chevron button behavior — it is pre-wired to the expanded state.
- Don't mix accordion with other expand/collapse patterns in the same section.

---

## Dark Mode Notes

No explicit dark mode token overrides are documented for this component at this tier. The accordion inherits theme tokens from its container. Apply the desired variable mode to the parent container for light/dark theming.

---

## Open Questions

None.
