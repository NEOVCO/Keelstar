# Keelstar UX — Accessibility

> Target **WCAG 2.1 Level AA** for the protected app and external flows.

---

## Keyboard

- All interactive elements reachable via Tab
- Logical tab order matches visual order
- `Skip to main content` link on app shell
- Command menu: `Cmd+K` / `Ctrl+K`
- Escape closes modals, drawers, menus
- Arrow keys in command menu and dropdowns

---

## Focus

- Visible focus ring on all controls (`ring-2 ring-accent ring-offset-2`)
- Never `outline-none` without replacement
- Focus trap in modals and mobile drawer

---

## Semantics

- One `h1` per page (page title)
- Section headings `h2`/`h3` in order
- `nav` for sidebar and breadcrumbs
- `main` for content area
- `table` / `th` / `td` for data tables (not div grids)

---

## Forms

- Every input has visible `<label>` or `aria-label`
- Errors: `aria-invalid` + `aria-describedby` pointing to error text
- Required fields marked visually and `aria-required`

---

## ARIA

Use only when native HTML insufficient:

- `aria-expanded` on menus
- `aria-live="polite"` for toast notifications
- `role="status"` for processing states

---

## Color & status

- Status never conveyed by color alone — include text or icon
- Contrast ratio ≥ 4.5:1 body text, ≥ 3:1 large text
- Badge colors from design system tokens (pre-validated)

---

## Tables

- Column headers in `scope="col"`
- Caption or `aria-label` on table describing content
- Row actions accessible via keyboard menu

---

## Motion

```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

---

## File upload

- Native file input accessible (not div-only)
- Upload zone: `role="button"` if custom, or hidden input + label

---

## Document viewer

- Provide download alternative if embed not screen-reader friendly
- Alt text for preview thumbnails

---

## Testing

- Automated: axe in CI (future)
- Manual: keyboard-only pass per major flow
- VoiceOver spot check on external upload
