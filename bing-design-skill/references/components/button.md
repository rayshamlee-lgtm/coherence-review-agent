---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Button

## Summary

Button is the most widely used foundational atom in the ACF design system. It is an interactive element that triggers an action or event. It is referenced by 30+ components across all tiers, including cards, section footers, navigation controls, and form elements.

**Figma Node ID:** `21527:12882` · **Type:** `COMPONENT_SET` · **Group:** Actions · **Variants:** 210

**Dependencies:** focus outline

---

## Variants / Types

### Variant (visual weight)

| Variant | Token | Emphasis | Purpose |
|---------|-------|----------|---------|
| `solid` / primary | `-ctrl-brand-` | Encouraging | The single most important action; use alone or with subtle/ghost — not with another primary |
| `solid` / secondary | `-ctrl-neutral-` | Neutral | Groups of buttons side-by-side; moderate emphasis; not recommended for `<a>` links that leave the current journey |
| `outline` | `-ctrl-outline-` | Less encouraging | Alternative or less-motivating actions; good inside cards, inline areas, or neutral spaces; acceptable styled replacement for a conventional hyperlink |
| `soft` / subtle | `-ctrl-subtle-` | Neutral / supporting | Low-emphasis inline actions (e.g., "See more"); designed for non-accent backgrounds only |
| `ghost` | `isGhost="true"` | Intentionally discouraged | Negative or backward actions (Cancel, Dismiss, Back); a boolean that removes rest-state background; hover and pressed states still follow the selected style |

**Hierarchy (strongest to weakest):**
Primary → Secondary → Outline → Subtle → Ghost

### Color

| Color | Notes |
|-------|-------|
| `primary` | Maps to brand token |
| `secondary` | Maps to neutral token |

### Size

| Size | Height | Use case |
|------|--------|----------|
| `sm` | 28px | Compact areas, inline actions, card footers |
| `md` | 38px | Default for most contexts |
| `lg` | 48px | Primary CTAs, prominent actions; recommended minimum for mobile touch targets |

### Style (theme behavior)

| Style | Behavior |
|-------|----------|
| `default` | Follows the current page theme (light/dark) |
| `alwaysDark` | Always renders in dark mode styling regardless of page theme; for use on images or visuals that do not switch in light/dark |
| `switchable` | Responds to light/dark mode changes; for use on graphics that do switch (maps, illustrations) |

---

## Visual States

| State | Description |
|-------|-------------|
| `default` | Resting appearance; full opacity |
| `hover` | Background shifts to hover token on pointer enter; reverts on pointer leave |
| `pressed` | Background shifts to pressed token on mouse-down / touch-start |
| `focus` | Focus ring appears (uses `focus outline` dependency) on keyboard navigation |
| `disabled` | All interaction suppressed; cursor changes to not-allowed; opacity reduced |

---

## Anatomy

1. **Icon start** — Optional leading icon slot (instance swap); reinforces action meaning
2. **Label** — Action text; consumer-editable; can be hidden for icon-only buttons
3. **Icon end** — Optional trailing icon slot; typically a chevron or external link indicator
4. **Container** — Auto-layout wrapper with variant-driven background, border, and corner radius

---

## Usage Rules

- `solid / primary` is reserved for the single most important action per context; multiple primary buttons in the same view overwhelm hierarchy.
- `secondary` (ctrl-neutral) is not appropriate for `<a>` links that take users out of the current journey.
- `subtle` is designed for non-accent backgrounds only; it does not provide sufficient contrast on accent or colored backgrounds.
- `ghost` is a boolean modifier, not a distinct visual style; it can be applied to any style variant and is reserved for negative or backward actions.
- When multiple buttons appear together, emphasis should descend: `solid` → `outline` → `ghost`.
- Button sizes within the same row or group must be consistent; mixing `sm` and `lg` in a single group is not permitted.
- Icon-only buttons (no visible label) must include an `ariaLabel`.
- Default size when no specific context requires otherwise: `md`.

---

## Do / Don't

### Do
- Use `solid / primary` for the single most important action.
- Pair `primary` with `subtle` or `ghost` for secondary actions.
- Use `outline` when multiple side-by-side buttons need elevated prominence.
- Use `subtle` for inline actions like "See more" on non-accent backgrounds.
- Use `ghost` for intentionally discouraged actions (Cancel, Dismiss, Back).
- Always provide `ariaLabel` for icon-only buttons.

### Don't
- Don't place multiple `primary` buttons side-by-side.
- Don't use `secondary` for `<a>` links that navigate users out of the journey.
- Don't use `subtle` on accent or colored backgrounds.
- Don't treat `ghost` as a visual style — it is a boolean option.
- Don't use `ghost` for primary or positive actions.
- Don't mix button sizes within the same button group or row.

---

## Dark Mode Notes

- All button variants meet WCAG 2.1 AA contrast requirements in both light and dark themes.
- The `alwaysDark` style maintains contrast in dark-on-dark scenarios (e.g., buttons on photos or video thumbnails that do not switch to light mode).
- The `switchable` style adapts to whichever theme the parent graphic uses.
- The `ghost` variant relies on text color for contrast; sufficient contrast against the background must be confirmed for each placement.

---

## Open Questions

None.
