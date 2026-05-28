---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Markdown

**Figma Node ID:** `127612:121136` · **Type:** `COMPONENT_SET` · **Group:** Display · **Tier:** Base / SDL Atom · **Variants:** 2 · **Consumed by:** Copilot answer cards, AI-generated content panels, chat responses

## Summary

The Markdown component renders rich text content formatted in markdown syntax, with built-in support for streaming and static display states. It is purpose-built for AI/Copilot-generated content in ACF SERP experiences — showing real-time content generation with a streaming indicator, then transitioning to a complete, statically rendered view.

This component is appropriate for rendering AI/Copilot-generated markdown content (headings, lists, code blocks, links, emphasis), for displaying content that streams in progressively during generation, and for rich text answers in conversational or chat-based SERP experiences. It is not for plain unformatted text (use Label), for user-authored content without markdown formatting, for static HTML content not from a generation pipeline, or for short single-line text (use Label or body typography directly).

---

## Variants

| Property | Values | Default |
|----------|--------|---------|
| **streaming?** | `true`, `false` | `true` |

Total: **2 variants**

### streaming? — Content Generation State

| streaming? | Visual | Description |
|------------|--------|-------------|
| **true** | Content with streaming animation/indicator (e.g., pulsing cursor, shimmer) | Content is actively being generated. The `value` text updates progressively. Shows a visual indicator that generation is in progress. |
| **false** | Static rendered markdown | Content generation is complete. Full markdown is rendered without animation. Final, stable state for reading. |

---

## Anatomy

1. **Body slot** — Rich text content area; accepts rendered markdown text with heading, paragraph, list, and code styles

---

## Content Rendering

The Markdown component renders standard markdown syntax, mapped to ACF typography tokens:

- **Headings** (h1–h6) — mapped to ACF typography tokens (body1-strong, body2-strong, body3-strong per Token Guide Section 2)
- **Body text** — rendered as body3
- **Bold / italic / inline code** — standard emphasis and code formatting
- **Lists** (ordered and unordered) — properly indented with consistent spacing
- **Code blocks** — syntax-highlighted fenced code blocks
- **Links** — styled as interactive inline links
- **Tables** — structured data display

---

## Visual States

- The transition from `streaming?=true` to `streaming?=false` is smooth — abrupt visual jumps are avoided.
- During streaming, the container height grows naturally as content arrives.
- The streaming indicator (cursor/shimmer) is visually distinct but not distracting.
- Loading state behaves as a smooth skeleton-to-content transition.

---

## Usage Rules

- The Markdown component fills the width of its parent container.
- Internal spacing between markdown elements follows ACF typography and spacing tokens.
- Default inner gap between rendered markdown blocks: `x-small`.
- Generous spacing (`medium` to `large`) is used above and below the full Markdown component for breathing room.
- `streaming?=true` transitions to `streaming?=false` when content generation is complete — the streaming state is never left active after generation finishes.
- An empty Markdown component is not shown — a placeholder or skeleton is used during initial load.
- Markdown typography tokens are not overridden — the component maps to ACF's type scale consistently.
- `ariaLive="polite"` is used so screen readers announce content updates without interrupting the user.

---

## Do / Don't

### Do
- Show the streaming state (`streaming?=true`) while content is actively being generated to set user expectations.
- Provide a clear, smooth transition from streaming to complete state.
- Use the default placeholder text or a contextually appropriate message during initial load.
- Ensure rendered markdown follows ACF typography hierarchy.
- Allow the container to grow dynamically as streamed content arrives.
- Use `ariaLive="polite"` for screen reader announcements.

### Don't
- Don't leave `streaming?=true` after content generation is complete.
- Don't use the Markdown component for non-markdown plain text — use Label instead.
- Don't render an empty Markdown component.
- Don't use aggressive or distracting streaming animations.
- Don't allow streaming content to cause layout shifts that displace surrounding elements unpredictably.
- Don't override the markdown typography tokens.

---

## Dark Mode Notes

All rendered text meets WCAG AA contrast requirements in both light and dark themes. Code blocks use background colors with sufficient contrast for both the background fill and code text. Links within markdown are distinguishable by more than color alone (underline or other visual indicator). The streaming indicator does not rely solely on color — animation/motion provides an additional cue.

---

## Related Components

| Component | Relationship |
|-----------|-------------|
| **Label** | Use instead for plain, non-markdown single-line text |
| **Copilot answer card** | Primary consumer — embeds Markdown for AI-generated responses |
| **Skeleton / loading** | May be shown before the Markdown component enters streaming state |
| **Code block** | Markdown renders fenced code blocks internally; standalone code block may exist separately |
| **Chat message** | Uses Markdown for rendering conversational AI responses |

---

## Open questions

None.
