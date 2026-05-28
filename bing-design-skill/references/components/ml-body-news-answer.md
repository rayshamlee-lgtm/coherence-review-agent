---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# ML Body / News Answer

News Answer is an ML Body module that presents news results inline within the algo mainline. It features a hero layout: a large featured news article (with image, source, headline, and snippet) at the top, followed by a 2×2 grid of secondary news cards inside a Horizontal Scroller. A "See all" action and optional Feedback module provide footer actions. This module appears between standard algorithm results in Zone A, giving breaking or trending news a prominent, visually rich presentation.

**Figma Node ID:** `132336:101531` · **Type:** `FRAME` · **Group:** Layout · **Variants:** 1 (no variant properties) · **Dependencies:** Section / title, Answer card, Image card, Thumbnail, Horizontal Scroller, Section / footer, Divider, Button · **Consumed by:** Section body / algo — Zone A (Mainline)

> This component is used only inside `Section body / algo` Zone A, slotted between standard algorithm results. It is not a standalone section — it is a template/module that plugs into the algo mainline.

---

## Variants

This component has no variant properties. It is a single, non-variant ML Body module. Visual variation comes from news content, source branding, and images supplied via instance overrides.

| Element | Required | Description |
|---------|----------|-------------|
| **Section / title** | Yes | Heading "News about {query}" with navigation chevron |
| **Answer card** | Yes | Container card wrapping the hero + grid + footer |
| **Hero image** | Yes | Large featured Image Card for the top news story |
| **Hero text** | Yes | Source name, timestamp, headline, snippet |
| **Secondary news cards** | Yes | 2×2 grid of smaller news cards with source, title, thumbnail |
| **See all button** | No | Footer action to navigate to full news results |
| **Section / footer** | No | Optional Feedback module (thumbs up/down) |

---

## Visual States

This component is a structural container — interaction is delegated to child components. No component-level visual state variants are defined.

---

## Anatomy

1. **Section / title** — "News about {query}" heading with navigation chevron action
2. **Hero news block** — Large Image Card (left) + text content (source badge, timestamp, headline, snippet) on the right
3. **Secondary news grid** — 2×2 grid of compact news cards inside Horizontal Scroller; each card shows source favicon/badge, timestamp, title, and Thumbnail
4. **Divider** — Separator between the grid and the footer
5. **See all button** — Ghost button with chevron linking to full news results
6. **Section / footer** — Optional Feedback module (thumbs up/down)

### Structure

```
ML Body / News Answer
├── Section / title — "News about {query}" heading with chevron
├── Answer card — container card
│   ├── Hero news article
│   │   ├── Image card — large featured image
│   │   └── Text block — source badge, timestamp, headline, snippet
│   ├── Horizontal Scroller
│   │   ├── Row 1 — 2 secondary news cards
│   │   └── Row 2 — 2 secondary news cards
│   ├── Divider
│   └── Button — "See all" action with chevron
└── Section / footer — optional Feedback module
```

---

## Usage Rules

- News Answer is appropriate when the query has clear news/current-events intent, when a featured (hero) news article deserves prominent visual treatment, and when multiple news sources are relevant and benefit from a grid preview.
- It is not appropriate as a standalone news section (build a full Section instead), for a single news link mixed into text results (use a standard algo result with news metadata), outside of Zone A in the algo section, or when the query has no news/current-events intent.
- The Section / title should display "News about {query}" with a navigation chevron.
- The hero article should be the most relevant/recent news item — display source name, timestamp, full headline, and a snippet.
- Secondary news cards should show source favicon/badge, timestamp, headline, and a small thumbnail.
- Source branding (favicon or publisher badge) should appear on every news card for credibility. Timestamps should appear on all articles so users can gauge freshness.
- The module occupies the full width of Zone A. Hero article uses a side-by-side layout (large image left, text right). Secondary cards are in a 2×2 grid inside a Horizontal Scroller.
- Reading order: title → hero article → secondary cards (row by row) → see all → feedback.
- Test at all 4 algo column variants (12, 8, 4, 2).

### Responsive

- The module reflows with Zone A — at `column=4` and `column=2`, Zone A is full-width.
- Hero article may stack vertically at narrow breakpoints (image above text).
- Secondary cards resize proportionally within the scroller.
- Horizontal Scroller provides scroll arrows when cards overflow.

---

## Do / Don't

### Do
- Use News Answer when the query has clear news/current-events intent.
- Feature the most relevant/recent article as the hero with a large image.
- Show source branding (favicon or publisher badge) on every news card for credibility.
- Include timestamps on all articles so users can gauge freshness.
- Ensure the hero image maintains aspect ratio and quality.
- Provide the Feedback module so users can signal relevance.

### Don't
- Use News Answer as a standalone news section — it is an ML Body module for Zone A only.
- Use a low-quality or irrelevant hero image — the hero carries the visual weight of the module.
- Omit source attribution — news credibility depends on visible publisher identity.
- Hardcode card sizes — they must respond to the Zone A container width.
- Display stale news without timestamps — freshness signals are critical for news content.

---

## Dark Mode Notes

No explicit dark-mode variant properties are defined. All text (headlines, source names, timestamps, snippets) must meet WCAG AA contrast in both light and dark themes. Source badges/favicons should maintain visibility against card backgrounds in both modes.

---

## Related Components

| Component | Relationship |
|-----------|-------------|
| **Section body / algo** | Parent — News Answer slots into Zone A |
| **Section / title** | Dependency — provides the news group heading |
| **Answer card** | Dependency — container card wrapping the news block |
| **Image card** | Child — hero article featured image |
| **Thumbnail** | Child — secondary card thumbnail images |
| **Horizontal Scroller** | Dependency — scrollable secondary news grid |
| **Section / footer** | Child — optional feedback module |
| **Button** | Child — "See all" footer action |
| **Divider** | Child — separator before footer |
| **ML Body / Basic Algo** | Sibling — standard algo results that surround this module |
| **ML Body / Images Answer** | Sibling — another ML Body module type in Zone A |
| **ML Body / Video Answer** | Sibling — another ML Body module type in Zone A |

---

## Open questions

None.
