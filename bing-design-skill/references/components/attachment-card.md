---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Attachment Card

**Figma Node ID:** `72005:138225` · **Type:** `COMPONENT_SET`  
**Group:** Cards · **Tier:** Core / Card · **Variants:** 5  
**Dependencies:** focus outline  
**Consumed by:** Section body / magazine, document results, supplementary content modules

---

## Summary

The Attachment Card presents file attachments or supplementary linked content as a compact, interactive card. It is unique among card components in supporting a `selected` state (toggle selection) and a dedicated `focus` state for keyboard accessibility. Five states cover the full interaction lifecycle — rest, hover, pressed, selected, and focus — making it suitable for selection-based workflows.

This component is appropriate for file attachment results (PDFs, documents, spreadsheets, presentations), supplementary content links associated with a primary answer, selection/toggle workflows, and downloadable resource cards. It is not appropriate for primary image or video content (use Image Card or Video Card), full answer experiences (use Answer Card), or filter/tag selection (use Filter Item or Toggle).

---

## Variants / Types

| Property | Values | Default | Description |
|----------|--------|---------|-------------|
| **State** | `rest`, `hover`, `pressed`, `selected`, `focus` | `rest` | Full interaction state lifecycle |

### State reference

| State | Appearance | Trigger |
|-------|-----------|---------|
| `rest` | Default card surface, neutral styling | No interaction |
| `hover` | Subtle background/elevation shift | Pointer enters card |
| `pressed` | Darkened/active surface treatment | Mouse down / touch start |
| `selected` | Persistent visual indicator (border, background tint, or check) | User toggles selection on |
| `focus` | Visible focus ring via `focus outline` dependency | Keyboard Tab navigation |

---

## Anatomy

1. **Image area** — Image card instance displaying a preview thumbnail
2. **Badge** — Optional overlay badge with icon and label (e.g., file type indicator)
3. **Title** — Article or attachment title text
4. **Subtitle** — Secondary description text
5. **Metadata** — Tertiary information (source, date, size, etc.)

---

## Visual States

State lifecycle:
- `rest → hover → pressed → selected (toggle) → back to rest on deselect`
- Keyboard path: `rest → focus → pressed (Enter/Space) → selected`

The `selected` state is a persistent toggle — the card remains visually selected until the user deselects it. Multiple attachment cards can be selected simultaneously in a list.

The `focus` state is specifically for keyboard navigation — distinct from hover. Focus does not imply selection; the user must press `Enter` or `Space` to toggle selection.

### Sizing guidance

| Width | Token |
|-------|-------|
| 140px | (no token) |
| 200px | `by 2` token |
| 312px | `by 3` token |

Height uses standard ACF height tokens (by 2, by 3, by 4). Image/media height stays consistent regardless of metadata when combining attachment cards.

---

## Usage Rules

- Display file type icon, file name, and relevant metadata (size, date, source). File name truncates with ellipsis if it exceeds 1–2 lines.
- Secondary metadata uses `body3` at regular weight; file name uses `body3-strong`.
- Card surface uses `background-card-on-primary-default-` tokens; border radius uses `-corner-card-` tokens.
- When used in a list, gap between cards follows `x-small` spacing.
- At ≤640px (2-column), attachment cards stack full-width in a vertical list.
- Recommended for use in carousel or mainline row contexts.

### Do
- Use the `selected` state for toggle/selection workflows.
- Provide clear visual distinction between `hover`, `pressed`, and `selected` states — they must all be visually unique.
- Show file type icons for quick visual scanning of attachment types.
- Truncate long file names with ellipsis.
- Allow multi-select when presenting lists of attachments.

### Don't
- Use `selected` state visuals that are indistinguishable from `hover`.
- Hide file type information — users need to know what they are opening/downloading.
- Use Attachment Card for primary content results — it is designed for supplementary/attached resources.
- Omit the `focus` state.
- Auto-select attachment cards — selection must be user-initiated.
- Place more than 6–8 attachment cards in a single visible list without scroll or pagination.

---

## Dark Mode Notes

All 5 states must maintain WCAG AA contrast for text and interactive elements in both light and dark themes. The `selected` state indicator (border, tint, check) must meet AA contrast against the card background. The `focus` ring must be visible against the card surface in both modes. File type icons must have sufficient contrast against the card background.

---

## Related Components

| Component | Relationship |
|-----------|-------------|
| **Answer Card** | Use instead for primary answer/content experiences |
| **Image Card** | Use instead for image-dominant content |
| **Button** | Alternative for simple link/download actions without selection behavior |
| **Toggle** | Alternative for binary on/off states without card presentation |
| **Filter Item** | Alternative for filtering/selection in a different visual pattern |

---

## Open questions

None.
