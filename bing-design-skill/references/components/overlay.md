---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Overlay

## Summary

Overlay is a modal dialog component that renders on top of Page content with a dimming Backdrop. It contains its own Header, Body, and Footer sub-structure. The Overlay is part of the Page component and can be triggered by user actions (e.g., clicking a card for expanded detail, opening settings).

**Figma Node ID:** `32736:53806` · **Type:** `COMPONENT_SET` · **Group:** Overlay · **Variants:** 2

**Dependencies:** Backdrop, Focus outline

**Consumed by:** Page component

The Page component has an `overlay` boolean property. Setting `overlay: true` on Page reveals the Overlay modal — no manual layering is required.

---

## Variants / Types

### is desktop?

| Value | Layout | Size |
|-------|--------|------|
| `true` (default) | Centered modal dialog | 688×424px; max 1200×600px at ≥1392px breakpoint |
| `false` | Full-screen mobile bottom sheet | 320×680px |

### Property matrix

| Property | `true` | `false` |
|----------|--------|--------|
| CTA | Footer with Accept + Decline buttons visible | Footer hidden |
| backdrop | Smoke backdrop visible behind modal | No backdrop (desktop centered) |
| scrollbar | Scroll bar visible in body | Scroll bar hidden |

---

## Visual States

Overlay is either open or closed. When open:

- **Desktop:** Centered modal with backdrop; fade-in / scale-up animation.
- **Mobile:** Full-screen bottom sheet with backdrop; slides up from bottom.

When dismissed: modal closes, backdrop fades, focus returns to the triggering element.

---

## Anatomy

1. **Title** — Header text describing the overlay content.
2. **Close icon** — Dismissal button in the header area; uses the `Dismiss` icon from the SerpIcon registry (16px). This is the first (or last) focusable element in the modal.
3. **Body (Basic)** — Scrollable content area; accepts any content via Basic component.
4. **Scrollbar** — Visible scroll indicator for overflowing body content.
5. **Footer (Section Footer)** — Optional action bar at the bottom. Accept button uses `solid` variant; Decline button uses `ghost` variant.
6. **Backdrop** — Dims the full viewport behind the modal; click-to-dismiss.

### Backdrop behavior

| Mode | Backdrop | Notes |
|------|----------|-------|
| Mobile | Always shown | Ignores `backdrop` prop |
| Desktop (centered) | `backdrop=true` (default) | Standard centered modal needs backdrop |
| Desktop (section-nested) | `backdrop=false` | When overlay is embedded within a section, no backdrop needed |

---

## Responsive Sizing

| Page breakpoint | Overlay size | Behavior |
|----------------|-------------|----------|
| ≥1392px (12-col) | max 1200×600px | Centered modal with Backdrop |
| 1391–641px (8/4-col) | 688×424px | Smaller centered modal with Backdrop |
| ≤640px (2-col) | 320×680px (full-screen) | Bottom sheet with backdrop, drawer-style from bottom |

---

## Usage Rules

- Overlay is used for focused, interruptive tasks requiring user attention (confirmations, detail views, expanded content).
- Overlays must not be stacked — an Overlay must not open from within another Overlay.
- Overlay must not be used for content that should persist alongside the page; use Drawer instead.
- Background page scrolling is suppressed while the Overlay is open (`document.body.style.overflow: hidden`); this is restored on close.
- Focus is trapped within the Overlay while open — Tab cycles through internal elements only.
- Focus returns to the triggering element when the Overlay closes.
- A visible close button in the Header is always required.
- Backdrop click and Escape key must dismiss the Overlay.
- Overlay must not auto-open without user action.
- Critical workflow steps that could be accidentally dismissed must not be placed in an Overlay.

---

## Do / Don't

### Do
- Always include a visible close button in the Header.
- Trap focus within the Overlay when open.
- Return focus to the triggering element on close.
- Allow Backdrop click and Escape key to dismiss.
- Test the full-screen experience on mobile.

### Don't
- Don't open an Overlay from within another Overlay.
- Don't use Overlay for content that should persist alongside the page — use Drawer.
- Don't auto-open Overlays without user action.
- Don't place critical workflow steps in an Overlay that could be accidentally dismissed.
- Don't allow background page to scroll while Overlay is open.

---

## Dark Mode Notes

- Apply the desired variable mode (light/dark) to the parent container via Bing variable collections.
- Both modes are supported — all tokens auto-switch.
- Modal box background and text meet WCAG AA contrast in both themes.
- Backdrop provides sufficient dimming to distinguish the modal from background content in both themes.
- Close button meets minimum contrast and target size requirements in both themes.

---

## Open Questions

None.
