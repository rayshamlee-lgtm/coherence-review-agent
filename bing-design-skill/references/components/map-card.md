---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Map Card

**Figma Node ID:** `47073:177530` · **Type:** `COMPONENT_SET`  
**Group:** Cards · **Tier:** Core / Card · **Variants:** 4  
**Dependencies:** focus outline  
**Consumed by:** Section body / magazine, local answer experiences, direction results

---

## Summary

The Map Card embeds geographic/map content within a card container. Two property axes control the card: the map presentation type (`direction` vs. `scale up`) and the theme mode (`Light mode?`). Maps respond to the page's light/dark mode setting, so the map rendering must match the surrounding UI theme — following the Button `switchable` style pattern.

This component is appropriate for local search results that include geographic context, direction/navigation results, zoomed map views to highlight a specific area, and answer modules where geographic context enhances the response. It is not appropriate for static map images without interactivity (use Image Card with a map screenshot) or address-only content without a visual map (use a text-based Answer Card).

---

## Variants / Types

| Property | Values | Default | Description |
|----------|--------|---------|-------------|
| **Props** | `direction`, `scale up` | `direction` | Map presentation type |
| **Light mode?** | `true`, `false` | `true` | Map theme: light or dark rendering |

### Props reference

| Props | Description | Use case |
|-------|-------------|----------|
| `direction` | Direction-based map showing route/navigation | Turn-by-turn directions, route visualization, A-to-B navigation |
| `scale up` | Zoomed/enlarged map view | Area detail, neighborhood exploration, zoomed POI context |

### Light mode? reference

| Value | Behavior | Mapping |
|-------|----------|---------|
| `true` | Light map tiles, light UI overlays | Used when page is in light mode |
| `false` | Dark map tiles, dark UI overlays | Used when page is in dark mode |

---

## Anatomy

1. **Button** — Button instance for map interaction (expand, navigate)
2. **Container** — Card frame sized for map content

---

## Visual States

- **Hover** — no color change or elevation effect on the card container
- **Click/tap on Directions button** — opens navigation
- **Keyboard** — Tab focuses the card, Enter activates it; if the map is interactive (pan/zoom), arrow keys pan and +/- keys zoom

---

## Usage Rules

- `Light mode?` must always be synchronized to the current page theme — maps should feel integrated with the surrounding UI.
- Use `direction` when the user's query implies navigation intent (e.g., "directions to…", "how to get to…").
- Use `scale up` for location/area context queries (e.g., "where is…", nearby results).
- Map tiles should have skeleton/loading states while tiles render.
- Direction routes must be clearly distinguishable from map roads; location markers/pins should be visually prominent.
- Keep metadata (distance, duration, address) outside the map area or in a clearly separated overlay.
- Map region fills the allocated card area edge-to-edge (similar to `padding=none` pattern).

### Responsive (Dual layout requirement)
- **Anchor Card:** Full map with complete route/location detail; map region takes majority of card space; metadata (distance, duration, address) displayed alongside or below.
- **Accessory Card:** Simplified map — `scale up` style showing just the area without full route detail; minimize metadata to location name only.
- At ≤640px (2-column), map cards stack full-width; map must maintain a usable zoom level.
- At 4-column breakpoint, consider switching `direction` to `scale up` if route detail becomes illegible.

### Do
- Match `Light mode?` to the current page theme.
- Provide loading/skeleton states for map tile rendering.
- Ensure route lines and markers maintain sufficient contrast against map tiles in both light and dark modes.
- Test map readability at the smallest expected card size (Accessory layout).

### Don't
- Use `Light mode? = true` when the page is in dark mode (or vice versa).
- Render full route detail in Accessory card sizes — simplify to `scale up` with a location marker.
- Show a map so zoomed out that it conveys no useful geographic context.
- Overlay dense metadata on the map surface — keep text in a separate content region.
- Hardcode map dimensions — use Flexbox and let the container control sizing.
- Omit map attribution if required by the map tile provider.

---

## Dark Mode Notes

`Light mode? = false` switches map tiles to dark rendering. Route lines must meet WCAG AA contrast against map tiles in both modes. Any text overlay on the map must meet AA contrast requirements. Focus ring must be visible against the map background in both light and dark modes.

---

## Related Components

| Component | Relationship |
|-----------|-------------|
| **Answer Card** | Parent pattern — Map Card follows the card container conventions |
| **Image Card** | Use instead for static map screenshots without interactivity |
| **Button** | Shares `switchable` style concept for light/dark responsive behavior |
| **Section / body** | Parent container — map cards sit within section zones |

---

## Open questions

None.
