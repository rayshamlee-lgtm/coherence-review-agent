---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Avatar

## Summary

Avatar represents a user or entity with a visual identity. It supports two appearances: an actual image and a generic placeholder icon. An optional label can display the entity name below the avatar. This component is used in identity and personalization contexts such as article bylines, content cards, and comment threads.

**Figma Node ID:** `109510:164426` · **Type:** `COMPONENT_SET` · **Group:** Display  
**Tier:** Base / Foundational Atom · **Variants:** 2 · **Consumed by:** Cards, article bylines, user profiles, comment threads

---

## Variants / Types

| Property | Values | Default | Description |
|----------|--------|---------|-------------|
| **appearance** | `image`, `placeholder` | `image` | Actual photo or generic fallback icon |
| **show Label?** | `True`, `False` | `True` | Whether to display a name/label below the avatar |

### Appearance reference

| Value | Behavior | Use case |
|-------|----------|----------|
| `image` | Displays the user's actual photo, cropped to circle/shape | When a user/entity has an uploaded profile image |
| `placeholder` | Displays a generic person/entity icon | Fallback when no image is available, or for anonymous users |

---

## Anatomy

1. **Image container** — Square or circle frame that clips the avatar image
2. **Placeholder** — Fallback initial letter or generic icon shown when no image is provided
3. **Image** — User photo or illustration; fills the container and clips to shape
4. **Supporting text** — Optional name/label text below the avatar

---

## Visual States

- **image:** Avatar renders with the actual user/entity photo, center-cropped to the container shape
- **placeholder:** Avatar renders with a generic person or entity icon
- **Label visible:** Entity name or identifier displayed below the avatar
- **Label hidden:** Avatar appears without supporting text (when name is already shown adjacent)
- Avatar itself has no hover, focus, or pressed states — interaction is inherited from the parent container

---

## Usage Rules

- Use `image` appearance whenever a real photo is available; fall back to `placeholder` gracefully
- Label should display the entity's name or identifier — keep it concise
- Hide label (`show Label?: False`) when the entity name is already shown in adjacent text to avoid redundancy
- Use `xx-small` spacing between the avatar and its label
- Align avatars consistently: center-aligned in rows, left-aligned in bylines
- Always provide a `placeholder` fallback for when the image may fail to load

---

## Do / Don't

### Do
- Always provide a `placeholder` fallback when the image may fail to load
- Show the label when the avatar appears without adjacent identifying text
- Use consistent avatar sizes within the same context
- Maintain aspect ratio with center-crop

### Don't
- Stretch or distort images
- Use Avatar for non-identity imagery — use Thumbnail instead
- Show the label if the entity name is already adjacent (avoid redundancy)
- Use Avatar for brand logos or icons — use a dedicated icon or logo component

---

## Dark Mode Notes

The placeholder icon and its background must maintain WCAG AA contrast in both light and dark themes. No avatar-specific dark mode variant is documented.

---

## Open Questions

None.
