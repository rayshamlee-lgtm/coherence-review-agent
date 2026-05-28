---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Ads Menu Icon

**Figma Node ID:** `70217:266902` · **Type:** `COMPONENT_SET` · **Group:** Actions · **Tier:** Dependency · **Variants:** 2 · **Consumed by:** ML body / basic algo / sponsor

## Summary

The Ads Menu Icon is a small indicator that identifies sponsored or advertising content and provides access to an ad-related menu. It has two states — default (idle) and triggered (menu opened/active). Clicking the icon reveals options related to the ad, such as "Why this ad?" or "Report ad."

This component is required on any sponsored or paid content to indicate advertising status and provide access to ad transparency controls. It is a regulatory disclosure element for paid placements. It is not for general content menus, sponsored text labeling (use Sponsored Slug), or non-advertising interactive icons (use Button icon-only variant).

---

## Variants / States

| State | Description |
|-------|-------------|
| **Default** (default) | Icon is idle; ad menu is closed |
| **Triggered** | Ad menu is opened/active |

---

## Anatomy

1. **Icon** — Ad indicator glyph (MoreVertical); supports instance swap for flexibility
2. **Trigger area** — Clickable region that opens the ads menu overlay

---

## Visual States

| State | Visual Treatment |
|-------|-----------------|
| Default | Neutral icon, no background fill |
| Triggered | Active appearance indicating menu is open |
| Hover | Visual feedback before committing to action |

---

## Usage Rules

- This component appears on every sponsored or paid content unit as a compliance requirement. It is never omitted.
- It is always paired with Sponsored Slug — the Slug provides text labeling, this component provides menu access.
- Menu options must include transparency controls ("Why this ad?", "Report", "Ad preferences").
- Position is consistently within ad units, typically in the top-right corner.
- Spacing from card edge: `xx-small`.
- The icon is visible but does not compete with ad content for attention.

---

## Do / Don't

### Do
- Include on every sponsored/paid content unit for regulatory compliance.
- Provide meaningful menu options ("Why this ad?", "Report", "Ad preferences").
- Use `Triggered` state to clearly show the menu is open.

### Don't
- Don't hide or make the icon difficult to find — ad transparency is a compliance requirement.
- Don't use for non-ad content — this is exclusively for sponsored placements.
- Don't use as the sole ad indicator — always pair with Sponsored Slug for text labeling.

---

## Dark Mode Notes

The icon must meet WCAG AA contrast requirements against its background in both light and dark themes. No dark-mode-specific variant is documented; token-based color application handles theme switching.

---

## Related Components

| Component | Relationship |
|-----------|-------------|
| **Sponsored Slug** | Paired together — Slug provides text labeling, this icon provides menu access |
| **Button** | Use for general interactive icons outside of ad contexts |
| **Tooltip** | May supplement the icon with a hover description |

---

## Open questions

None.
