---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Sponsored Slug

**Figma Node ID:** `70217:267301` · **Type:** `COMPONENT_SET` · **Group:** Display · **Tier:** Base / Foundational Atom · **Variants:** 2 · **Consumed by:** Ad units, sponsored cards, paid placements, promoted listings

## Summary

A Sponsored Slug is a text label that identifies content as sponsored or paid advertising. It comes in two styles — Badged (prominent, badge-like indicator) and Subtle (minimal, text-only). It provides clear, honest disclosure of sponsored content per advertising policies and regulations.

This component is required on any paid or sponsored content on the SERP and serves as a required advertising disclosure element. It is not for AI content disclosure (use AI Disclaimer), for ad menu access (use Ads Menu Icon — pair both together), or for general status badges or tags (use Badge).

---

## Variants

| Style | Appearance | Use case |
|-------|------------|----------|
| **Badged** (default) | Prominent indicator with background fill or border — clearly stands out | Primary ad units, featured sponsored content, high-visibility placements |
| **subtle** | Minimal, text-only treatment — blends into surrounding content | Inline sponsored listings, lower-emphasis placements, text-heavy contexts |

---

## Anatomy

1. **Sponsored label** — "Sponsored" (or "Ad") text indicator
2. **Ads menu icon** — MoreVertical icon button for ad disclosure/actions
3. **Tooltip bubble** — "Learn how your ads are chosen" message; appears when user clicks the Ads Menu Icon

---

## Visual States

Sponsored Slug is a non-interactive display element — it has no pointer events by default and inherits interaction when placed inside an interactive container.

---

## Usage Rules

- Slug text is standard and recognizable ("Ad", "Sponsored", "Promoted"). Custom text beyond approved labeling terms is not used.
- This component is always paired with Ads Menu Icon — the Slug provides text labeling, the icon provides menu access. The slug is never shown without the icon.
- **Image card placement:** Positioned in the top-right corner of the image, overlaying it — using absolute positioning within the card frame.
- **Title row placement:** Placed at the trailing end of the title row, inline beside the ad title — right-aligned within the header.
- Spacing from adjacent elements: `xx-small`.
- Consistent placement is maintained across all ad units — never moved to bottom or center.

---

## Do / Don't

### Do
- Use `Badged` style for primary, high-visibility ad placements.
- Use `subtle` style for inline or text-heavy contexts where prominence should be lower.
- Pair with Ads Menu Icon for complete advertising disclosure.

### Don't
- Don't hide, minimize, or obscure the sponsored slug — disclosure is a compliance requirement.
- Don't style the slug to look like organic content — it must be distinguishable.
- Don't use custom text — stick to approved labeling ("Ad", "Sponsored").

---

## Dark Mode Notes

The `Badged` style background must provide sufficient contrast for the label text in both light and dark themes. Text must meet WCAG AA contrast requirements against its background in all themes. Token-based color application handles theme switching automatically.

---

## Related Components

| Component | Relationship |
|-----------|-------------|
| **Ads Menu Icon** | Always paired together — Slug provides text labeling, icon provides menu access |
| **AI Disclaimer** | Use instead for AI-generated content disclosure |
| **Avatar** | May appear alongside in sponsored author/entity attribution |

---

## Open questions

None.
