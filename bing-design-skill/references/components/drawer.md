---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Drawer

## Summary

Drawer is a side-panel overlay that slides in from the right edge of the viewport. It provides a secondary content area for detail views, settings, or expanded information without leaving the current page. The Drawer is 424px wide on desktop and full-screen on mobile, and contains its own Header, Body, and Footer sub-structure.

**Figma Node ID:** `91769:41038` · **Type:** `COMPONENT_SET` · **Group:** Overlay · **Variants:** 2

**Dependencies:** Backdrop, Focus outline

**Consumed by:** Page component

The Page component has a `drawer` boolean property. Setting `drawer: true` on Page reveals the Drawer panel — no manual layering is required.

---

## Variants / Types

### is Desktop?

| Value | Layout | Width |
|-------|--------|-------|
| `true` (default) | Side panel from right edge | 424px fixed |
| `false` | Full-screen panel | Full-screen (≤640px breakpoint) |

### Property matrix

| Property | Default | Purpose |
|----------|---------|---------|
| backdrop | `true` | Show backdrop overlay behind Drawer |
| scrollbar | `true` | Show scrollbar in body |
| CTA | `true` | Show call-to-action footer button |

**Note:** Exact variant property names are to be confirmed from the Figma source. The 2 variants likely represent open/closed or desktop/mobile states.

---

## Visual States

Drawer is either open or closed. When open:

- **Desktop/tablet:** 424px side panel slides in from the right edge; Backdrop dims the remaining viewport.
- **Mobile:** Full-screen panel covers the entire viewport.

When dismissed: panel slides out, Backdrop fades, focus returns to the triggering element.

---

## Anatomy

1. **Title** — Header text describing the drawer content.
2. **Close icon** — Dismissal button in the header area; easily reachable.
3. **Body (Basic)** — Scrollable content area; accepts any content via Basic component. Body scrolls independently if content exceeds Drawer height.
4. **Scrollbar** — Visible scroll indicator for overflowing body content.
5. **Footer (Section Footer)** — Optional action bar at the bottom with buttons or navigation controls.
6. **Backdrop** — Optional dimmed background covering the remaining viewport; click-to-dismiss.

---

## Responsive Sizing

| Page breakpoint | Drawer width | Behavior |
|----------------|-------------|----------|
| ≥641px (12/8/4-col) | 424px fixed | Side panel with Backdrop |
| ≤640px (2-col) | Full-screen | Converts to full-screen panel |

The 424px width is fixed across all desktop and tablet breakpoints — it does not scale.

---

## Usage Rules

- Drawer is used for detail views, settings panels, and progressive disclosure of additional content where side-by-side viewing with the main page is desirable on desktop.
- Drawer is not appropriate for focused, interruptive tasks that require full user attention; use Overlay instead.
- Drawer must not be opened from within another Drawer or Overlay.
- Background page scrolling is suppressed while the Drawer is open (`document.body.style.overflow: hidden`); this is restored on close.
- Focus is trapped within the Drawer while open — Tab cycles through internal elements only.
- Focus returns to the triggering element when the Drawer closes.
- A visible close button in the Header is always required.
- Backdrop click and Escape key must dismiss the Drawer.
- Content designed for the Drawer must work within the fixed 424px width on desktop; wide content (tables, complex layouts) is not suitable.
- On mobile, side-by-side viewing is not available — the Drawer becomes full-screen.

---

## Do / Don't

### Do
- Always include a visible close button in the Header.
- Trap focus within the Drawer when open.
- Return focus to the triggering element on close.
- Allow Backdrop click and Escape key to dismiss.
- Design content to work within the fixed 424px width.

### Don't
- Don't open a Drawer from within another Drawer or Overlay.
- Don't use Drawer for critical workflow steps that require full attention — use Overlay.
- Don't assume side-by-side viewing is always available — full-screen on mobile.
- Don't place wide content (tables, complex layouts) that will not fit in 424px.
- Don't allow background page to scroll while Drawer is open.

---

## Dark Mode Notes

- Drawer background and text meet WCAG AA contrast in both light and dark themes.
- Backdrop provides sufficient dimming to distinguish the Drawer from background content in both themes.
- Close button meets minimum contrast and tap target size requirements in both themes.
- Apply the desired variable mode to the parent container for light/dark theming.

---

## Open Questions

Exact variant property names are to be confirmed from the Figma source. The 2 variants likely represent open/closed or desktop/mobile states but have not been formally documented.
