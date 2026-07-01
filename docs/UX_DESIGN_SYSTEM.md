# Keelstar UX — Design System

> Visual and component specification for the protected application. Implemented with **Tailwind CSS** and shared primitives in `src/components/ui/`.

---

## Visual direction

| Token | Value | Usage |
|-------|-------|-------|
| Background | Near-white / `--color-bg` | Page canvas |
| Surface | White `--color-surface` | Cards, tables |
| Sunken | `--color-surface-sunken` | Table headers, sidebar hover |
| Text primary | Near-black slate `--color-text-primary` | Headings, body |
| Text secondary | `--color-text-secondary` | Metadata, labels |
| Accent | Restrained cobalt `--color-accent` | Primary actions, active nav |
| Borders | `--color-border` | 1px subtle dividers |

### Avoid

- Oversized gradients, neon, purple AI aesthetic
- Decorative background noise or blob shapes
- Marketing-scale display type inside the app
- Random icon colors per module

### Prefer

- 1px borders over heavy shadows
- `shadow-sm` on hover for interactive cards only
- Status color only on badges and indicators

---

## Typography

**Font:** Inter (or Geist) via `--font-sans`. **Mono:** for IDs, correlation IDs, timestamps in audit.

| Role | Class | Size | Weight |
|------|-------|------|--------|
| Page title | `text-h2` | 1.875rem | 600 |
| Section title | `text-h4` | 1.125rem | 600 |
| Card title | `text-body-sm font-medium` | 0.9375rem | 500 |
| Body | `text-body` | 1rem | 400 |
| Table cell | `text-body-sm` | 0.9375rem | 400 |
| Metadata | `text-caption text-secondary` | 0.8125rem | 400 |
| Overline / nav group | `text-overline text-tertiary` | 0.75rem | 600 |
| Helper | `text-caption text-tertiary` | 0.8125rem | 400 |
| Badge | `text-caption font-medium` | 0.8125rem | 500 |

**Rule:** App page titles max `text-h2`. Reserve `text-h1`/`display` for marketing only.

---

## Layout

| Element | Spec |
|---------|------|
| Sidebar width | `240px` (`w-60`) expanded; `64px` collapsed |
| Top bar height | `56px` (`h-14`) |
| Page max width | `1152px` (`max-w-6xl`) |
| Content gutters | `px-6` mobile, `px-8` desktop |
| Section gap | `space-y-6` between major blocks |
| Card padding | `p-4` compact, `p-5` default |
| Table row height | `44px` comfortable; `36px` compact (future) |
| Drawer width | `400px` default; `560px` wide (extraction review) |
| Modal | `sm: 400px`, `md: 560px`, `lg: 720px` |
| Breakpoints | `sm 640`, `md 768`, `lg 1024`, `xl 1280` |

### Object page layout

```
┌─────────────────────────────────────────────────────────┐
│ Breadcrumbs + ObjectHeader                              │
├──────────────────────────────┬──────────────────────────┤
│ Summary panel (optional)     │                          │
├──────────────────────────────┤   Right rail (320px)     │
│ Main content (flex-1)        │   Activity timeline      │
│                              │   Related items          │
└──────────────────────────────┴──────────────────────────┘
```

Right rail collapses below main on `< lg`.

---

## Components

### Buttons (`Button`)

| Variant | Use |
|---------|-----|
| `default` | Primary action (one per screen region) |
| `secondary` | Secondary actions |
| `ghost` | Tertiary / toolbar |
| `destructive` | Irreversible (archive, revoke) |

Sizes: `sm` tables/toolbars, `default` forms, `lg` external primary CTA only.

### Inputs

- Always paired with visible `Label`
- Error state: red border + `text-error` message below, `aria-describedby`
- Disabled: reduced opacity + `cursor-not-allowed`

### Badges and status pills

Use shared `StatusBadge` from `src/lib/statuses`. Never invent per-page colors.

### Cards

- `rounded-lg border border-border bg-surface`
- Optional `CardHeader` / `CardContent` separation

### Tables

See [UX_TABLES_SEARCH.md](./UX_TABLES_SEARCH.md). Wrapper: `rounded-lg border overflow-hidden`.

### Modals and drawers

- Focus trap, Esc to close
- Primary action right-aligned in footer
- Title describes the action (“Approve W-9”, not “Confirm”)

### Toasts

- Bottom-right, 4s auto-dismiss
- Success / error / info variants only

### Banners

- Page-level alerts (limit reached, processing delayed)
- Dismissible when informational

### Upload zone

- Dashed border, drag-over accent border
- Supported types and max size always visible
- Progress bar during upload

### Document preview

- PDF: embedded viewer or page thumbnail + download
- Images: contained max-height with zoom optional later

### Timeline

- Vertical line, dot per event
- Group by day with date label
- Actor initials avatar (32px)

### Skeleton loaders

- Match final layout geometry; no spinners for full pages

---

## Status system

Canonical statuses live in `src/lib/statuses/index.ts`. UI maps internal module statuses → shared categories.

### Workflow statuses

`draft` · `waiting_on_internal` · `waiting_on_external` · `in_review` · `active_monitoring` · `completed` · `cancelled` · `overdue` · `failed`

### Document statuses

`uploaded` · `processing` · `parsed` · `review_needed` · `approved` · `rejected` · `expired` · `archived`

### Task statuses

`not_started` · `in_progress` · `waiting` · `completed` · `overdue` · `cancelled`

### Monitor statuses

`active` · `paused` · `completed` · `failed`

### Badge rules

| Status type | Visual |
|-------------|--------|
| `overdue` | Error variant; not pulsing unless critical monitor |
| `completed` | Success, muted |
| `review_needed` | Warning, prominent in attention lists |
| `failed` | Error + link to recovery action |
| `waiting_on_external` | Accent/subtle blue |

---

## Icons

**Library:** Lucide. One icon per nav item; 16px in sidebar, 20px in headers. No decorative icon grids.

---

## Motion

- Transitions: `150–200ms` ease
- Respect `prefers-reduced-motion`
- No celebratory animations on approve/complete

---

## Implementation files

| Concern | Location |
|---------|----------|
| CSS variables | `src/styles/globals.css` |
| Tailwind tokens | `tailwind.config.ts` |
| Primitives | `src/components/ui/` |
| Status mapping | `src/lib/statuses/` |

---

*All new components must use these tokens. Do not introduce hex colors in components.*
