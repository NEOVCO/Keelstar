# Keelstar UX — Empty States

> Every major list and module home must guide the user forward.

---

## Required structure

Each empty state includes:

1. **Clear title** (what’s missing)
2. **One sentence explanation** (why it matters)
3. **Primary CTA** (button)
4. **Secondary CTA** (optional link)
5. **Optional:** demo/sample action
6. **Optional:** link to docs

**Component:** `EmptyState` in `src/components/empty-states/`

**Visual:** Dashed border, sunken background — no illustrations.

---

## Page-specific copy

### Documents (`/app/documents`)

| Element | Copy |
|---------|------|
| Title | No documents yet |
| Text | Upload a document to extract key fields, create reminders, and keep an audit trail. |
| Primary | Upload document |
| Secondary | Request document from someone else |

### Workflows (`/app/workflows`)

| Title | Start your first workflow |
| Text | Turn a document or request into a trackable process with owners, deadlines, and history. |
| Primary | Start workflow |

### Monitors (`/app/monitors`)

| Title | Nothing is being monitored yet |
| Text | Create reminders for contracts, certificates, policies, or approvals before they become urgent. |
| Primary | Create monitor |

### Inbox (`/app/inbox`)

| Title | Inbox is clear |
| Text | New tasks and reviews will appear here when assigned to you. |
| Primary | View workflows |

### Vendors (`/app/vendors`)

| Title | No vendors yet |
| Text | Add vendors to collect W-9s, track insurance, and manage onboarding documents. |
| Primary | Add vendor |

### People (`/app/people`)

| Title | No people added |
| Text | Add employees or contractors to track policy acknowledgements and training. |
| Primary | Add person |

### Audit (`/app/audit`)

| Title | No audit activity yet |
| Text | Important actions will appear here automatically as your team uses Keelstar. |
| Primary | View documentation (link) |

### Home (`/app`) — new org

See [UX_DASHBOARD.md](./UX_DASHBOARD.md) — three starting actions.

---

## Module home empty states

Powered by `modules.ts`:

| Field | Example (W-9) |
|-------|---------------|
| `emptyStateTitle` | Collect your first W-9 |
| `emptyStateDescription` | Send a secure link to a vendor and track the submission without email threads. |
| `primaryAction` | Request W-9 |

---

## When not to show empty state

- Loading: use skeleton
- Filter returned zero results: “No matches” + clear filters CTA
- Permission denied: use `PermissionDeniedState`, not empty

---

## Anti-patterns

- Lorem ipsum
- Cartoon mascots
- “Unlock your potential”
- Empty with no CTA
