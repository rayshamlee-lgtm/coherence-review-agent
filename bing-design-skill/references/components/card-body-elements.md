---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Card Body Elements — Template Catalog

**Group:** Cards · **Tier:** Card / Body Templates · **Templates:** 17 body templates, 4 carousel patterns, 5 chart types, 2 reusable components · **Variants:** 17 · **Consumed by:** Answer Card, Image Card, and other card containers with body slots

## Summary

Card Body Elements is a template catalog of grab-and-use card interior layouts. Rather than a single component, it provides 17+ pre-built body templates, carousel patterns, chart types, and reusable components that drop directly into card body slots. Each template comes with pre-wired dependencies — no manual assembly is required. The correct template is selected based on the content pattern and dropped into a card body slot (e.g., Answer Card, Image Card).

This catalog is appropriate for populating the body slot of a card component with a pre-built layout, when the content matches a known pattern (news article, entity list, ratings, weather, etc.), and when carousel patterns, chart visualizations, or nested card layouts are needed inside a card body.

These templates are not for standalone page layouts, non-card containers, top-level page components, or fully custom layouts that don't match any existing template.

---

## Variants / Template Types

### Body Templates (direct use in card body slot)

| Name | Pattern | Description |
|------|---------|-------------|
| Hero image with body content | Static display | Full-width hero image above text body |
| News | Click to article | News-style layout with headline + metadata |
| 3 lines | Static / clickable | 3-line text content block |
| 2 lines | Static / clickable | 2-line compact text block |
| 3 entities | Click per entity | 3 entity items in a row |
| Entities for scroll | Horizontal scroll | Scrollable entity list |
| Multi item body | Click per item | Multiple content items stacked |
| Location | Click to map/details | Location card with optional image |
| Body / AI Disclaimer | Informational | AI disclaimer in card body |
| 4 data | Static display | 4 data points layout |
| 2 items | Click per item | 2-item comparison/pair layout |
| Ad body | Click to ad | Sponsored/ad content layout |
| Algo body | Click to result | Standard algorithm result body |
| Ratings | Static display | Rating display (stars/score) |
| General Text | Static / clickable | Generic text content block |
| Weather body | Static + interactive | Weather information layout |
| Nested card body | Context-dependent | Content for nested cards |

### Carousel Patterns

| Name | Variants | Pattern |
|------|----------|---------|
| Continuous Entity Item | 3v (slide 1 / 2+ / Last) | Horizontal carousel |
| 3 by 4 Q&A | 3v (slide 1 / 2+ / Last) | Q&A carousel |
| 3 by 4 Listed entities | single | Entity grid |
| Page by page carousel | 12v (4 widths × 3 slides) | Paginated carousel |

### Charts

| Name | Description |
|------|-------------|
| Gauge chart | Circular gauge visualization |
| Donut chart | Donut/ring chart |
| Range Bar Chart | Range bar visualization |
| Line graph | Line chart |
| Bar Chart | Bar chart visualization |

### Reusable Components

| Name | Variants | Description |
|------|----------|-------------|
| Nested Card | 12v (6 states × 2 themes) | Card-within-card; accent and neutral themes |
| Product | 8v (layout × style × discount) | E-commerce product card |

### Internal Dependencies (not for direct use)

The following sub-components are pre-wired into the templates above and are not intended for standalone use:

- **Metadata** — attribution, timestamps, source info
- **Title with image item** — titled content block with image
- **Video item** — inline video element
- **Vstack item** — vertical stack content block
- **Entity item (H/V)** — horizontal and vertical entity displays
- **Rating** — star/score display element
- **Weather nested card** — weather-specific nested card
- **Citation card** — source citation block
- **Truncation** — text overflow handling

---

## Anatomy

1. **Media area** — Image, map, or visual content region at the top of the card body
2. **Text content** — Title + description text block
3. **Container** — Flexible layout wrapper used inside card body slots as pre-built content templates

---

## Visual States

Interaction is inherited from the parent card container (Answer Card, Image Card, etc.). Body templates do not define their own interaction behavior. Keyboard navigation (Tab to focus, Enter to activate) is handled at the card level.

---

## Usage Rules

- A body template is chosen that matches the content structure: "News" for articles, "Location" for places, "Ratings" for review scores, etc.
- Body content is kept within the expected slot structure — template types are not mixed within one card.
- Body elements fill the card's body slot; width is inherited from the parent card.
- Internal dependencies (Metadata, Entity item, Rating, etc.) are used as pre-wired; they are not extracted for standalone use outside of a template.
- Carousel patterns are not placed inside non-scrollable containers.
- Templates are not used outside of a card container — they assume card chrome (header, footer, padding) is present.

### Content block sizing notes
- **Entity item (horizontal):** Compact horizontal building block; thumbnail left, text right, optional right-side elements. For dense lists.
- **Entity item (vertical):** Vertical card layout for content benefiting from a larger image area above text.
- **Thumbnail size:** Thumbnail is always 72px — do not adjust the size in these components.

---

## Do / Don't

### Do
- Match the template to the content pattern.
- Use the pre-wired dependencies as-is — templates include correctly configured sub-components.
- Test templates at multiple card widths to verify responsive behavior.
- Use carousel patterns when content exceeds a single viewport.
- Use chart templates for data visualization.

### Don't
- Don't build a custom body layout when an existing template already matches the content pattern.
- Don't mix multiple body templates within the same card.
- Don't use internal dependencies (Metadata, Entity item, Rating, etc.) directly outside of a template.
- Don't modify the internal structure of a template.
- Don't use body templates outside of a card container.
- Don't place carousel patterns inside non-scrollable containers.

---

## Dark Mode Notes

All templates inherit color tokens from the parent card container. Text content must meet WCAG 2.1 AA contrast in both light and dark themes. Images within templates must have meaningful `alt` text.

---

## Related Components

| Component | Relationship |
|-----------|-------------|
| **Answer card** | Primary consumer — body templates drop into the Answer Card body slot |
| **Image card** | Primary consumer — body templates drop into the Image Card body slot |
| **Basic** | The generic card body slot that hosts these templates |
| **Nested Card** | Both a reusable component in this catalog and a card container that can host body templates |
| **Carousel** | Parent pattern for carousel-type body templates |
| **Charts** | Standalone chart components also available as body templates in this catalog |

---

## Open questions

None.
