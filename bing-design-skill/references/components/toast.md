---
updated: 2026-05-21
source: serp-design-skill v2.1
stability: beta
---

# Toast

A Toast is a temporary notification banner that communicates system feedback, status changes, or action results to the user. It supports six semantic styles covering the full range of feedback scenarios — from loading states to errors — and two fill intensities (Priority and Tint) for controlling visual prominence. An optional icon and optional undo action provide contextual and recovery support.

**Figma Node ID:** `77990:81916` · **Type:** `COMPONENT_SET` · **Group:** Feedback · **Variants:** 12 · **Dependencies:** focus outline

---

## Variants

| Property | Values | Default | Description |
|----------|--------|---------|-------------|
| **Style** | `Loading`, `Neutral`, `accent`, `error`, `success`, `warning` | `Neutral` | Semantic style conveying the type of notification |
| **Fill** | `Priority`, `Tint` | `Priority` | Visual intensity — solid/strong or subtle/soft |
| **show icon?** | `True`, `False` | `True` | Whether to display a leading semantic icon |
| **allow Undo?** | `True`, `False` | `True` | Whether to show an undo action button |

### Style — semantic meaning

| Style | Intent | Example |
|-------|--------|---------|
| **Loading** | Operation in progress | "Saving changes…" |
| **Neutral** | General informational message | "Settings updated" |
| **accent** | Brand or feature highlight | "New feature available" |
| **error** | Operation failed or problem occurred | "Failed to save. Please try again." |
| **success** | Operation completed successfully | "Changes saved successfully" |
| **warning** | Caution — potential issue or side effect | "This action cannot be undone" |

### Fill — visual prominence

| Fill | Appearance | Use case |
|------|------------|----------|
| **Priority** | Solid, high-contrast background fill. Neutral/Loading uses `--smtc-background-smoke` (rgba(0,0,0,0.6)). Status colors use `--smtc-status-{color}-background` tokens. Text/icon: `--bing-smtc-foreground-content-white`. No border. | Important notifications requiring immediate attention. Default for errors and warnings. |
| **Tint** | Subtle background (`--smtc-status-informative-tint-background`). Per-variant colored border (0.5px solid). Text: `--smtc-foreground-content-neutral-primary`. Icon color per-variant. | Lower-urgency notifications. Good for success confirmations and neutral info that should not dominate the page. |

---

## Visual States

Toast is non-interactive as a container, but the undo action element within it is interactive. The component auto-dismisses after a timed duration. On mobile, a swipe gesture may dismiss it early. The undo button must be focusable and activatable via keyboard.

---

## Anatomy

1. **Status icon** — Leading icon indicating toast type (info, success, warning, error, spinner for Loading)
2. **Message text** — Notification message; consumer-editable
3. **Action link** — Optional undo or action text link

---

## Usage Rules

- Toast is appropriate for confirming a completed action ("Saved", "Copied to clipboard"), communicating errors or warnings that don't block interaction, showing transient loading status at the page level, and when the user may want to undo an action immediately.
- It is not appropriate for persistent or critical errors requiring user action (use an inline error or dialog), for in-context loading (use Spinner within the loading container), for form validation (use inline field-level error messages), or for promotional or marketing messages (use a banner component).
- Toast messages should be concise and specific — describe what happened, not what went wrong technically.
- Toasts should be positioned at the bottom-center or top-center of the viewport consistently. Desktop: `position: fixed; right: 24px; bottom: 24px`. Mobile: `position: fixed; right: 16px; left: 16px; top: 16px` — full-width at top.
- Toast should auto-dismiss after 4–8 seconds (longer for error/warning, shorter for success/neutral). Default is approximately 5 seconds. Toasts with undo actions must persist longer — give users at least 8 seconds to act.
- Maximum width is 500px. Keep message text to 1 line where possible.
- No more than 3 toasts should be stacked simultaneously. Stack multiple toasts vertically with `small` spacing between them.
- The `Loading` style is for page-level async operations when Spinner alone is insufficient.
- Use `allow Undo?: True` for destructive or significant actions where reversal is meaningful (delete, archive, move).

---

## Do / Don't

### Do
- Use `Priority` fill for errors and warnings — high-contrast background demands attention.
- Use `Tint` fill for success and neutral messages — subtle appearance avoids disruption.
- Show undo (`allow Undo?: True`) for any destructive action (delete, archive, remove).
- Keep the icon visible — it provides instant recognition of the notification type.
- Auto-dismiss toasts after an appropriate duration (longer for errors, shorter for confirmations).
- Use `Loading` style for page-level async operations when Spinner alone is insufficient.

### Don't
- Use toasts for critical errors that block the user — use a dialog or inline alert instead.
- Stack more than 3 toasts simultaneously — it overwhelms and reduces readability.
- Use `success` style for neutral/informational messages — use `Neutral` instead.
- Auto-dismiss toasts with undo actions too quickly — give users at least 8 seconds.
- Use `accent` style for errors or warnings — semantic meaning must match the style.
- Rely on toasts as the only error feedback — pair with inline validation where applicable.

---

## Dark Mode Notes

Both `Priority` and `Tint` fills must meet WCAG AA text contrast requirements in both light and dark themes. Semantic colors (error red, success green, warning yellow) must maintain contrast in both modes. The component must not rely solely on color to convey the toast type — the icon and text must also communicate the style in both themes.

---

## Related Components

| Component | Relationship |
|-----------|-------------|
| **Spinner** | Use for in-context loading indicators; Toast `Loading` style is for page-level status |
| **Button** | Toast undo action uses button-like interaction patterns |
| **Ai disclaimer** | Use for persistent AI content notices, not transient notifications |
| **Tooltip** | Use for hover-triggered contextual info, not system feedback |

---

## Open questions

None.
