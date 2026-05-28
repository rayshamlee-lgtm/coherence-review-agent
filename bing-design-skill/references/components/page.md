---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Page

**Figma Node ID:** `129439:121714` · **Type:** `COMPONENT_SET` · **Group:** Layout · **Tier:** Page · **Consumed by:** Top-level — this is the root SERP component · **Dependencies:** Section components, Header, Footer, Drawer, Overlay, Scope tabs

## Summary

Page is the top-level component in the ACF design system. It defines the overall SERP structure, responsive breakpoints, and column grid that all child components inherit. Every Bing SERP experience is composed from a Page component containing Sections, which in turn contain Cards.

The Page component establishes the authoritative breakpoint system for the entire design system. All other responsive behavior (Section body variants, card reflow, overlay sizing) derives from Page breakpoints.

The Page includes built-in `drawer` and `overlay` boolean properties. Toggling these reveals a Drawer side-panel or a full Overlay modal directly within the Page — no manual layering or stacking is required.

This component is used as the root container for any Bing SERP page to establish the responsive grid and breakpoint system. It is not for sub-page layouts (use Section body types instead) or standalone widgets (those are Section- or Card-tier components).

---

## Properties

| Property | Type | Default | Options |
|----------|------|---------|---------|
| **width** | VARIANT | `1520px +` | `1520px +`, `1519 – 1392px`, `1391 – 1025px`, `1024 – 641px`, `640px & below` |
| **padding** | VARIANT | `160px` | `160px`, `96–160px flex`, `60–96px flex`, `36px`, `24px` |
| **column count** | VARIANT | `12` | `12`, `8`, `4`, `2` |
| **drawer** | BOOLEAN | `false` | `true`, `false` |
| **overlay** | BOOLEAN | `false` | `true`, `false` |

---

## Breakpoint-to-Property Mapping

This table is the source of truth for all responsive behavior in the ACF system.

| Width variant | Padding | Column count | Viewport range | Body content width |
|--------------|---------|-------------|---------------|-------------------|
| **1520px +** | `160px` | `12` | ≥1520px | 1200px |
| **1519 – 1392px** | `96–160px flex` | `12` | 1519–1392px | 1072px |
| **1391 – 1025px** | `60–96px flex` | `8` | 1391–1025px | 905px |
| **1024 – 641px** | `36px` | `4` | 1024–641px | 569px |
| **640px & below** | `24px` | `2` | ≤640px | 274px |

---

## Anatomy

### Structure (all variants)
```
Page
├── Header (search bar + right group + scope tabs)
├── Body
│   ├── basic [INSTANCE] — main section content slot
│   ├── Page Body Section [FRAME] — related searches section
│   └── Pagination container [FRAME] — page navigation
├── Footer (Terms + Privacy links)
├── Drawer (BOOLEAN toggle — side panel overlay, shown/hidden)
└── Overlay (BOOLEAN toggle — modal dialog, shown/hidden)
```

1. **Header** — Search bar + right group (user actions) + scope tabs (content type filters)
2. **Body** — Primary scrollable content area with section bodies
3. **Footer** — Terms of Use + Privacy Policy links
4. **Drawer** — 424px side panel; shown via `drawer=true` toggle
5. **Overlay** — Modal dialog; shown via `overlay=true` toggle; 688×424px on desktop, DrawerContainer style (395px) on mobile

---

## Responsive Behavior by Area

| Area | ≥1520px (12col) | 1391–1025px (8col) | 1024–641px (4col) | ≤640px (2col) |
|------|-----------------|--------------------|--------------------|---------------|
| **Header** | Full search bar + right group + scope tabs | Full | Right group collapses | Hamburger menu |
| **Body gap** | 36px | 36px | 36px | 24px |
| **Header padding** | Standard | Standard | 20px | 20px |
| **Drawer** | 424px side panel | 424px side panel | 424px side panel | 424px container-based (not full-page-width) |
| **Overlay** | 688×424 modal | 688×424 modal | 688×424 modal | DrawerContainer style (395px wide) |

---

## Visual States

Page is a structural container. Interaction is delegated to child components. Layout responds to viewport changes via responsive breakpoints.

---

## Usage Rules

- The Page breakpoint table is the single source of truth for responsive design.
- All sections within the body use matching column variants for the current breakpoint.
- Breakpoint boundaries (1520, 1392, 1025, 641, 640) are tested for smooth transitions.
- The Drawer is used for progressive disclosure of detail content.
- The Overlay is used for focused, interruptive tasks that require user attention.
- Page padding is not overridden within child components.
- Content is not placed outside the Section structure within the Page body.
- Drawer and Overlay must be tested at the mobile breakpoint — their behavior changes significantly.

---

## Do / Don't

### Do
- Treat the Page breakpoint table as the single source of truth for responsive design.
- Ensure all sections within the body use matching column variants for the current breakpoint.
- Test at breakpoint boundaries (1520, 1392, 1025, 641, 640) for smooth transitions.
- Use the Drawer for progressive disclosure of detail content.
- Use the Overlay for focused, interruptive tasks.

### Don't
- Don't override Page padding within child components.
- Don't hardcode viewport-specific styles — use the column span system.
- Don't place content outside the Section structure within the Page body.
- Don't assume Drawer or Overlay is always fixed-size — test mobile full-screen behavior.
- Don't skip breakpoint testing — layout issues often appear at transition points.

---

## Dark Mode Notes

All Page chrome (Header, Footer) meets WCAG AA contrast. Padding areas use the page background token (`smtc/background/webPage/primary`). The Copilot icon uses `fill="currentColor"` for theme-aware coloring. The Page background follows the palette to reinforce unified content (per VQ Framework — Theme Cohesion).

---

## Related Components

| Component | Relationship |
|-----------|-------------|
| **Section / title** | Child — sections populate the Body |
| **Section body / magazine** | Grandchild — body types live inside sections |
| **Section body / algo** | Grandchild — body types live inside sections |
| **Section body / Q&A** | Grandchild — body types live inside sections |
| **Section / footer** | Grandchild — section footers close sections |
| **Overlay** | Child — modal dialog within Page |
| **Drawer** | Child — side panel within Page |
| **Whole page tab** | Child — scope tab variant for page-level navigation |

---

## Open questions

None.
