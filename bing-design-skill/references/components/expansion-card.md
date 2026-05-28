---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Expansion Card (Default)

The default Expansion Card is a compact interactive surface that reveals additional content on hover or interaction. It serves as the base building block for accordion-like patterns and progressive-disclosure flows. On hover, the card expands in the Y direction to reveal truncated content by overlaying content below, while the card container maintains its original layout height.

**Figma Node ID:** `64766:191039` · **Type:** `COMPONENT_SET` · **Group:** Cards · **Variants:** 4 · **Dependencies:** focus outline · **Consumed by:** Horizontal Scroller, accordion sections, "see more" flows

---

## Variants

| Property | Type | Default | Options | Description |
|----------|------|---------|---------|-------------|
| **State** | VARIANT | `rest` | `rest`, `hover`, `pressed`, `focus` | Interaction state of the card |

### State reference

| State | Behavior | Visual Treatment |
|-------|----------|-----------------|
| **rest** | Default idle appearance | Neutral card surface; standard elevation and border |
| **hover** | Cursor enters the card area | Card elevates (elevation-3) and body expands vertically to reveal truncated content — overlays content below; container keeps original layout height |
| **pressed** | Active click/tap in progress | Darker fill or reduced elevation to provide tactile feedback |
| **focus** | Keyboard focus via Tab | Visible focus outline (uses `focus outline` dependency) — must not be clipped by overflow |

Hover and pressed states must be visually distinct — identical visuals between the two are not acceptable.

---

## Anatomy

1. **Answer card** — Base Answer card with header (title + end-props) and body slot
2. **Title** — Article or content title text in the card header
3. **Body (Basic)** — Expandable content area using Basic component as slot container

---

## Expansion Behavior

- Expansion is Y-direction only — the card overlays to cover content below; X position does not change.
- The card container maintains its original height in layout — only the overlay grows.
- On hover, a maximum of approximately 5 additional lines are revealed.
- The expanded container applies: 8px padding, 16px border-radius, background color, elevation-3.
- Click or tap navigates to the detail page.

---

## Usage Rules

- This component is appropriate for progressively revealing supplementary content (answers, details, metadata), inside horizontal scrollers or stacked accordion layouts, and for "see more" patterns where content should stay in context.
- It is not appropriate for primary navigation (use Tab or Navigation Link), for toggling a boolean state (use Toggle), for content that should always be visible (use a standard Card), or for media-heavy expandable content (use Expansion Card / Image or Horizontal/Vertical attachment variants).
- The collapsed state should be concise — a title or summary line. Expanded content should provide meaningful additional detail, not repeat the summary.
- Touch targets must meet 48px minimum on mobile. Collapsed height should accommodate single-line titles without truncation.
- The rest state must look tappable — distinguish the card from static content using surface treatment, subtle border, or elevation.

---

## Do / Don't

### Do
- Ensure the rest state looks interactive — use surface color or subtle border to signal affordance.
- Provide distinct visual feedback for hover and pressed states so users feel confident the card is responding.
- Use smooth expand/collapse transitions to maintain spatial context.
- Keep expanded content short and scannable — progressive disclosure should reduce cognitive load, not add it.

### Don't
- Make hover and pressed states visually identical — users need distinct feedback for each interaction phase.
- Hide critical information behind the expansion — primary content should be visible in the collapsed state.
- Nest expansion cards inside other expansion cards — it creates confusing interaction layers.
- Use this variant when the card needs a media attachment — use the horizontal, vertical, or image variants instead.

---

## Dark Mode Notes

No explicit dark-mode variant properties are defined. Card surface and text must meet WCAG AA contrast ratios in both light and dark themes. The focus outline must be visible against both the card surface and the page background in both modes.

---

## Related Components

| Component | Relationship |
|-----------|-------------|
| **Expansion Card / Horizontal Attachment** | Use when the card includes a side-mounted media element |
| **Expansion Card / Vertical Attachment** | Use when the card includes a top/bottom media element |
| **Expansion Card / Image** | Use when image content dominates the card |
| **Horizontal Scroller** | Common parent — expansion cards are typically hosted inside scrollers |
| **Button** | May appear inside expanded content for CTAs |

---

## Open questions

None.
