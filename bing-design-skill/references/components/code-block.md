---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Code Block

**Figma Node ID:** `131634:466613` · **Type:** `COMPONENT_SET` · **Group:** Display · **Tier:** Base / Content Atom · **Variants:** 2 · **Dependencies:** Tooltip, Button, Divider · **Consumed by:** AI/Copilot answer cards, documentation content, accented card containers

## Summary

Code Block is a display component for rendering formatted code snippets. It comes in two variants: **inline** for short code examples inside accented card containers, and **standalone** for multi-line code blocks that appear as individual answer sections between body text. All code text uses the monospace font token (`--bing-smtc-text-global-body3-mono`) with syntax coloring via `--bing-smtc-data-foreground-*` tokens.

This component is appropriate for displaying formatted code snippets in AI/Copilot answers or documentation content. It is not for general preformatted text that is not code (use Markdown instead), for single inline code tokens within a sentence (use a styled `<code>` text run), or for editable code input (this component is display-only).

---

## Variants

| type | Structure | Use case |
|------|-----------|----------|
| **inline** (default) | Code text + copy tooltip icon | Short code examples inside accented card containers |
| **standalone** | Header (language label + copy button) → Divider → Body (code content) | Multi-line code blocks between body text |

---

## Anatomy

1. **Code text** — Monospace text content using `body3-mono` font and `data-foreground` color tokens
2. **Copy button** — Tooltip-wrapped icon button for copying code to clipboard (inline: top-right corner)
3. **Header** — Language label + copy Button (standalone only)
4. **Divider** — Separator between header and body (standalone only)
5. **Body** — Multi-line code content area (standalone only)

---

## Visual States

| Interaction | Behavior |
|-------------|----------|
| Copy button hover | Tooltip shows "Copy" |
| Copy button click | Code is copied to clipboard; tooltip confirms the action |
| Code text | Selectable but not editable |

There is no hover state on the container itself — interaction is on the copy button only.

---

## Usage Rules

- Inline code blocks are short — one line, a few tokens, quick references.
- Standalone is used for anything multi-line or that benefits from a language label.
- The language identifier is included in the standalone header (e.g., "Html", "JavaScript", "Python").
- **Inline** is placed inside an accented card container — the container's background provides visual separation.
- **Standalone** is treated as a block-level element between paragraphs of body text.
- Font: `--bing-smtc-text-global-body3-mono` for all code text.
- Text color: `--bing-smtc-data-foreground-*` tokens for syntax-colored text.
- Both tokens support light/dark theme switching automatically.
- Inline code text does not wrap — it truncates or scrolls if needed.
- Standalone body may scroll horizontally for wide code lines.
- Inline code blocks are not placed outside of accented containers — they rely on the container's background for contrast.

---

## Do / Don't

### Do
- Use `type=inline` for short code examples inside accented card containers.
- Use `type=standalone` for multi-line code blocks that appear between body text.
- Apply `--bing-smtc-text-global-body3-mono` font for all code text.
- Use `--bing-smtc-data-foreground-*` tokens for syntax-colored text.
- Include the copy button so users can easily grab code snippets.

### Don't
- Don't use standalone type for single-line snippets that fit inline.
- Don't override the mono font with proportional fonts — code must use monospace for alignment.
- Don't omit the language label in standalone mode.
- Don't place inline code blocks outside of accented containers.

---

## Dark Mode Notes

Both `--bing-smtc-text-global-body3-mono` and `--bing-smtc-data-foreground-*` tokens support light/dark theme switching automatically. Syntax highlighting colors must each meet WCAG AA contrast independently in both themes.

---

## Related Components

| Component | Relationship |
|-----------|-------------|
| **Markdown** | Sibling — renders rich text; Code Block handles code-specific formatting |
| **Tooltip** | Dependency — wraps the copy icon in inline mode |
| **Button** | Dependency — copy action button in standalone header |
| **Divider** | Dependency — separator between header and body in standalone mode |

---

## Open questions

None.
