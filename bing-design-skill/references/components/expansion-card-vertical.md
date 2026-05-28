---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Expansion Card / Vertical Attachment

**Figma Node ID:** `64766:193541` · **Type:** `COMPONENT_SET` · **Group:** Cards · **Tier:** Sub-component / Card Atom · **Variants:** 5 · **Dependencies:** focus outline · **Consumed by:** Horizontal Scroller, stacked content sections, media-rich answer layouts

## Summary

The Vertical Attachment variant of the Expansion Card places a media element (image, thumbnail, or graphic) above or below the text content in a stacked layout. An optional chevron button provides an explicit expand/collapse affordance. This variant is suited for content where the visual should be vertically prominent and the card reads top-to-bottom.

This component is appropriate when a stacked image-over-text (or text-over-image) layout best represents the content, for visual-first cards where the media preview needs vertical prominence, and when an explicit chevron indicator is needed to signal expandability. It is not for side-by-side media + text (use Expansion Card / Horizontal Attachment), when the image is the primary content with minimal text (use Expansion Card / Image), or for text-only expandable content (use Expansion Card / Default).

---

## Variants

| Property | Values | Default |
|----------|--------|---------|
| **state** | `rest`, `hover`, `pressed`, `selected`, `focus` | `rest` |
| **show chevron button?** | `True`, `False` | `False` |

Note: The boolean property does not multiply the variant count — it is a toggleable instance property on each state variant.

### State

| State | Visual Treatment |
|-------|-----------------|
| **rest** | Neutral card surface; media above, text below (or vice versa) |
| **hover** | Card elevates with shadow; body expands vertically to reveal truncated content, overlaying content below while container keeps original height |
| **pressed** | Darker fill or reduced elevation for tactile feedback |
| **selected** | Accent border or tinted surface (persistent) |
| **focus** | Visible focus outline wrapping the full card |

### Show Chevron Button?

| Value | Behavior | Use case |
|-------|----------|----------|
| **False** (default) | No explicit expand indicator — the entire card surface is the tap target | When the card's interactive nature is clear from context |
| **True** | A chevron icon (▼/▲) is displayed, typically at the card bottom | When the expand/collapse affordance needs to be explicit |

If `show chevron button?` is `False`, the card surface must still look tappable via hover/pressed feedback.

---

## Anatomy

1. **Image card** — Image card with image and optional badge overlay
2. **Badge** — Category or status overlay with icon and label
3. **Title** — Article or content title text
4. **Subtitle** — Secondary description
5. **Metadata** — Tertiary info (source, date, etc.)

---

## Expansion Behavior

- Truncated title or metadata: height becomes dynamic to show the truncated content.
- Image remains the same size; image border-radius reduces to 'M' (8px) on expansion.
- Supplementary deco/data is allowed to show on expansion.
- Maximum of 5 extra lines on expansion is suggested.
- On expansion: 8px padding, 16px border-radius on the elevated container, background color, elevation-3.
- Expansion is Y-direction only; the card container maintains its original height in the layout flow.

---

## Usage Rules

- The most important visual (thumbnail, hero image) is placed in the media slot.
- The vertical layout reads top-to-bottom — the hook (image or title) is at the top.
- Spacing between media attachment and text region: `-spacing-x-small`.
- When the chevron is shown, it is placed at the card bottom with `-spacing-xx-small` padding.
- Inside Horizontal Scroller, consistent card heights are maintained to avoid ragged rows.
- Touch targets meet 48px minimum on mobile.
- If the chevron is shown, clicking it (or the card) must expand content — the two affordances must be consistent.
- The chevron is not a separate Tab stop — the card itself is the interactive element.
- The entire card responds to hover/pressed regardless of whether the chevron is shown.

---

## Do / Don't

### Do
- Enable the chevron button when the card appears outside familiar interactive contexts.
- Ensure the `selected` state is visually distinct from `hover` — use a persistent accent.
- Use high-quality images that maintain clarity when cropped to the card's media slot dimensions.
- Keep the vertical layout balanced — avoid oversized media that pushes text out of view.

### Don't
- Don't show the chevron AND hide the expand interaction — if the chevron is visible, clicking it must expand content.
- Don't use this variant when side-by-side media + text is a better fit.
- Don't let the media region grow so tall that users must scroll past it to reach the text.
- Don't rely solely on the chevron for affordance — the entire card should respond to hover/pressed.

---

## Dark Mode Notes

Text and chevron icon must meet WCAG AA contrast against the card surface in both light and dark themes. The `selected` accent and focus outline must also maintain AA contrast in both themes.

---

## Related Components

| Component | Relationship |
|-----------|-------------|
| **Expansion Card / Default** | Use when no media attachment is needed |
| **Expansion Card / Horizontal Attachment** | Use when media should sit beside text horizontally |
| **Expansion Card / Image** | Use when image content is the dominant element |
| **Horizontal Scroller** | Common parent — cards are typically arranged in a scrollable row |
| **Button** | May appear inside expanded content for CTAs |

---

## Open questions

None.
