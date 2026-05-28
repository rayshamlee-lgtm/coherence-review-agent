---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# ML Body / Basic Algo

Basic Algo is the fundamental building block of the algo mainline. It represents a single algorithm result item — either an organic result (`type=general`) or a sponsored/ad result (`type=sponsor`). Optional properties add an end image (thumbnail on the right side) and an attachment (expandable content below the result). This is the most commonly used ML Body module — the majority of Zone A content consists of Basic Algo items.

**Figma Node ID:** `130747:30086` · **Type:** `COMPONENT_SET` · **Group:** Layout · **Variants:** 2 · **Dependencies:** Ads menu icon (internal, pre-wired into `type=sponsor`) · **Consumed by:** Section body / algo — Zone A (Mainline)

> This component is used only inside `Section body / algo` Zone A, slotted as individual result items in the mainline. It is not a standalone component — it is the repeating unit within the algo stream.

---

## Variants

| Property | Type | Default | Options | Description |
|----------|------|---------|---------|-------------|
| **type** | VARIANT | `general` | `general`, `sponsor` | Result type — organic or sponsored/ad |
| **end image** | BOOLEAN | `false` | `true`, `false` | Show a thumbnail image on the right side of the result |
| **attachment** | BOOLEAN | `false` | `true`, `false` | Show expandable attachment below the result |

### Type reference

| Type | Purpose | Visual differences |
|------|---------|-------------------|
| **general** | Organic search result | Standard result styling, no ad indicators |
| **sponsor** | Sponsored/ad result | Includes Ads menu icon (pre-wired), Sponsored Slug labeling |

### Property combinations

| type | end image | attachment | Use case |
|------|-----------|------------|----------|
| `general` | `false` | `false` | Standard organic result — title, URL, snippet only |
| `general` | `true` | `false` | Organic result with thumbnail (e.g., recipe, product) |
| `general` | `false` | `true` | Organic result with sitelinks or rich snippet expansion |
| `general` | `true` | `true` | Rich organic result with thumbnail + expandable content |
| `sponsor` | `false` | `false` | Standard sponsored result |
| `sponsor` | `true` | `false` | Sponsored result with thumbnail |
| `sponsor` | `false` | `true` | Sponsored result with expandable ad extensions |
| `sponsor` | `true` | `true` | Full-featured sponsored result |

---

## Visual States

This component is a structural container. Interaction is delegated to child components (title link, Ads menu icon, attachment toggle). The component itself does not have hover or pressed state variants — the interactive child elements carry their own states.

---

## Anatomy

1. **Algo Header** — Favicon, site name, and URL
2. **Algo body** — Page title and snippet (page description)
3. **Algo attachment** — Optional expandable supplementary content (mini magazine, quick fact, deeplinks)
4. **Site thumbnail** — Optional image shown on the right side of the result

### Ads Menu Icon (internal dependency)

The `Ads menu icon` component is an internal dependency pre-wired into the `type=sponsor` variant. It is not for direct consumer use.

- **Visibility:** Automatically present when `type=sponsor`; hidden when `type=general`
- **Purpose:** Provides ad transparency controls ("Why this ad?", "Report ad") as required by advertising policy
- **Configuration:** Pre-configured within the sponsor variant — consumers do not configure it

Do not manually add or remove the Ads menu icon. It is managed by the `type` variant toggle.

---

## Usage Rules

- Basic Algo is used for every standard search result in the algo mainline, both organic (`type=general`) and sponsored (`type=sponsor`).
- It is not appropriate for enriched result modules (video groups, PAA, mini magazines — use dedicated ML Body modules), as a standalone card outside the algo section (use Card components), or for right rail content (Zone A / Mainline only).
- `type=sponsor` must be used for all paid/sponsored results — ad disclosure is a compliance requirement. `type=general` must not be used for paid results.
- `end image` should be enabled only when the thumbnail is relevant and high-quality — avoid generic placeholder images.
- `attachment` should be enabled for results with meaningful expandable content (sitelinks, structured data). Keep attachment content concise and scannable.
- Basic Algo items stack vertically within Zone A, separated by List View gap spacing. The end image (when enabled) sits to the right of the text content, vertically centered. The attachment (when enabled) appears below the main result content with `x-small` (8px) spacing.
- The module fills the full width of Zone A at all breakpoints. Test at all 4 algo column variants (12, 8, 4, 2).

---

## Do / Don't

### Do
- Use `type=general` for all organic search results — it is the default and most common configuration.
- Use `type=sponsor` for all paid/sponsored results — it automatically includes required ad disclosure elements.
- Enable `end image` only when the thumbnail is relevant and high-quality.
- Enable `attachment` for results with meaningful expandable content (sitelinks, structured data).
- Test sponsor variants thoroughly — ad disclosure (Ads menu icon, Sponsored Slug) must be visible and accessible.

### Don't
- Manually add or configure the Ads menu icon — it is pre-wired into the `type=sponsor` variant.
- Use `type=sponsor` for organic results or `type=general` for paid results — ad disclosure is a compliance requirement.
- Enable `end image` with low-quality or irrelevant thumbnails — this degrades visual quality.
- Overload the attachment with excessive content — keep it scannable.
- Use Basic Algo outside of the algo mainline (Zone A) — it is designed for the algo stream context.

---

## Dark Mode Notes

No explicit dark-mode variant properties are defined. All text content (title, URL, snippet) must meet WCAG AA contrast in both light and dark themes. Sponsor variant styling must maintain sufficient contrast for ad disclosure elements in both modes.

---

## Related Components

| Component | Relationship |
|-----------|-------------|
| **Section body / algo** | Parent — Basic Algo items populate Zone A |
| **Ads menu icon** | Internal dependency — pre-wired into `type=sponsor` variant |
| **Sponsored Slug** | Sibling element — text label for sponsored results |
| **List View** | Container — Basic Algo items are typically wrapped in List View for consistent spacing |
| **ML Body / Mini Magazine** | Sibling — another ML Body module type in Zone A |
| **ML Body / Video Answer** | Sibling — another ML Body module type in Zone A |
| **ML Body / PAA Answer** | Sibling — another ML Body module type in Zone A |

---

## Open questions

None.
