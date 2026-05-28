---
updated: 2026-05-21
source: bing-design-skill-1.2 design-guidance.md (rationale only)
stability: beta
---

# Implementation Traps

Design rationale and common pitfalls preserved from prior knowledge that
are not covered in component-level documentation.

## Figma → CSS flex translation

Figma's auto-layout uses "Fill Container" and "Hug Contents" which map
to CSS flex properties, but the mapping is not always intuitive:

| Figma setting | CSS equivalent | Trap |
|---|---|---|
| Fill Container | `flex: 1 0 0` | Developers may confuse with `width: 100%` |
| Hug Contents | `flex-shrink: 0` + intrinsic width | Omitting `flex-shrink: 0` causes unexpected collapse |
| Fixed width | `width: Npx; flex-shrink: 0` | Must include `flex-shrink: 0` or flex container may override |

## Image sourcing priority

When selecting images for cards, follow this priority:

1. **Official brand imagery** (highest credibility)
2. **Licensed stock photography**
3. **User-contributed content** (with proper attribution)
4. **AI-generated imagery** (lowest — use only when above unavailable)

Rationale: brand credibility is directly affected by image source quality.

## Entity SERP right rail

For entity search results pages, the right rail (Zone C) contains
**Related Searches only** — not a knowledge panel. This is a deliberate
product decision, not a layout limitation.

## Algoblock gap = 0px

The gap between algo blocks is intentionally 0px. Each block owns its
own internal `padding-top`. This prevents double-spacing when blocks
stack and gives each block full control over its top spacing.

## Page Control visibility

Page Control (pagination) appears for:
- Standard web search queries
- Queries with multi-page results

Page Control is omitted for:
- Entity queries (knowledge panel takes over)
- Single-answer queries

## Open questions

None.
