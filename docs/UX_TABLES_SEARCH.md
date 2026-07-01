# Keelstar UX — Tables & Search

> Operational list pages are a primary interface. Tables must be excellent.

---

## Standard list pages

| Page | Route |
|------|-------|
| Documents | `/app/documents` |
| Workflows | `/app/workflows` |
| Tasks / Inbox | `/app/inbox` |
| Monitors | `/app/monitors` |
| Vendors | `/app/vendors` |
| People | `/app/people` |
| Audit Log | `/app/audit` |

All use shared **DataTable** system in `src/components/tables/`.

---

## Table toolbar

**Component:** `TableToolbar`

| Control | Behavior |
|---------|----------|
| Search | Debounced 300ms; searches visible columns + metadata |
| Filters | Popover with field-specific filters |
| Sort | Column header click; indicator arrow |
| Density | Comfortable default; compact later |
| Export | Where entitled; CSV |

**Component:** `TableFilters`

Filters sync to URL query string for shareable views.

**Saved views:** Later — store filter presets per user.

---

## Standard columns

| Column | When |
|--------|------|
| Name / title | Always |
| Status | Badge |
| Owner | `OwnerCell` — avatar + name |
| Due date | `DueDateCell` — relative; red if overdue |
| Updated | Relative timestamp |
| Module | Workflow/document lists |
| Actions | `RowActions` menu |

---

## Row interaction

| Action | Behavior |
|--------|----------|
| Row click | Navigate to detail page |
| Checkbox | Bulk select mode |
| ⋮ menu | Quick actions without navigation |

---

## Bulk actions

**Component:** `BulkActionsBar` — appears when ≥1 row selected

| Action | Applies to |
|--------|------------|
| Assign owner | workflows, tasks |
| Create monitor | documents, vendors |
| Send reminder | workflows waiting on external |
| Archive | vendors, documents (safe) |
| Export | audit, documents |
| Change status | only where safe + permitted |

Confirm modal for destructive bulk actions.

---

## Density

| Mode | Row height | Use |
|------|------------|-----|
| Comfortable | 44px | Default |
| Compact | 36px | Power users (future) |

---

## Empty search results

“No results for ‘{query}’” + **Clear filters** link — not full empty state.

---

## Mobile

Tables → card list. Each card: title, status, owner, due date, chevron.

---

## Implementation

| File | Role |
|------|------|
| `DataTable.tsx` | Core table |
| `TableToolbar.tsx` | Search + filters |
| `StatusBadge` | From `lib/statuses` |
| `OwnerCell.tsx` | |
| `DueDateCell.tsx` | |
| `RowActions.tsx` | |

Do not build one-off tables per page.
