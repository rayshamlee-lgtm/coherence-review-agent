---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Title End Props

**Group:** Layout · **Tier:** Dependency / Global · **Variants:** 5 · **Dependencies:** Section / title, Button, Tab · **Consumed by:** Section / title (end slot)

## Summary

Title End Props is an internal dependency component — it is not consumer-facing. It provides the end-slot content for Section / title, pre-wired into the title's trailing position. Partners do not use this component directly; it is assembled automatically when configuring a Section / title.

> Previously documented as "Whole Page Tab." That name was incorrect. This component lives in the `dependency / global` group and serves exclusively as the end props slot for Section / title.

This component is used when configuring the trailing slot of a Section / title — to add sponsor attribution, tab navigation, AI action buttons, or a "See more" expansion control to a section header. It is not for standalone use, for card-level actions (use Button or Filter item), or for building custom title layouts outside of Section / title.

---

## Variants

| variant | Description |
|---------|-------------|
| **See More** (default) | "See more" expansion button for expanding section content |
| **Sponsor** | Sponsor slug / attribution in the title end slot |
| **WP Tab** | Whole-page tab selector — pill-shaped topic refinement tabs in the title area |
| **AI Buttons** | AI action buttons (e.g., Copilot actions such as regenerate, copy) |
| **Tabs** | Tab group for sub-navigation within the section |

---

## Anatomy

1. **Action icon / Button** — Trailing action element in a title bar (e.g., close, settings, overflow menu)
2. **Container** — Alignment wrapper positioning the action at the end of the title row

---

## Visual States

Interaction behavior is inherited from the parent container (Section / title) or context. Interactive variants (WP Tab, AI Buttons, See More, Tabs) are reachable via keyboard tab order within the Section / title. Arrow-key navigation between tab items is supported for Tab and WP Tab variants.

---

## Usage Rules

- This component is always nested inside Section / title's trailing slot — it is never used outside of that context.
- The end-prop variant is matched to the section's purpose: "See More" for expandable content, "WP Tab" for topic pivots, "Sponsor" for sponsored sections, "Tabs" for multi-tab content.
- Only one variant per section title is used — combining multiple end-slot behaviors creates confusion.
- Section / title manages layout and spacing — this component's positioning is not manually overridden.
- `See More` is the default when the section simply needs an expansion affordance.
- `AI Buttons` is not used for non-AI actions.
- `Tabs` and `WP Tab` are not mixed in the same page context — one tab pattern per page region.

---

## Do / Don't

### Do
- Select the variant that matches the section's intent.
- Rely on Section / title to handle layout and spacing — this component is pre-wired into the correct slot.
- Keep one variant per section title.
- Use See More as the default when the section simply needs an expansion affordance.

### Don't
- Don't use Title End Props outside of Section / title — it is not designed for standalone placement.
- Don't manually override the slot positioning — the parent component manages alignment and spacing.
- Don't use AI Buttons for non-AI actions.
- Don't mix Tabs and WP Tab in the same page context.

---

## Dark Mode Notes

Sufficient color contrast is required for all variants in both light and dark themes. Token-based color application handles theme switching automatically.

---

## Related Components

| Component | Relationship |
|-----------|-------------|
| **Section / title** | Parent — Title End Props is consumed by the title's end slot |
| **Sponsored slug** | Related — the Sponsor variant displays a sponsor slug |
| **Tab** | Related — the Tabs variant uses tab-like navigation |

---

## Open questions

None.
