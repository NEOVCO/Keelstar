# Keelstar UX — Information Architecture

> Hybrid **object-first** and **workflow-first** architecture for the protected application.

---

## Philosophy

Users think in **tasks, documents, vendors, deadlines, and evidence** — not in product SKU names. Keelstar is one platform with many workflow apps underneath.

### Why object-first navigation wins

| Problem with product-only nav | Object-first solution |
|------------------------------|------------------------|
| Ten disconnected apps | Shared Documents, Workflows, Monitors |
| Duplicate list pages per module | One workflow table filtered by module |
| Hard to answer “what needs attention?” | Home + Inbox aggregate across modules |
| Poor cross-sell | Contextual suggestions on object pages |
| Does not scale to 20+ modules | Apps section grows without breaking IA |

**Products (Apps)** remain discoverable for module-specific jobs and CTAs. **Platform objects** remain the daily operational home.

---

## Application surfaces

| Surface | Base path | Auth | Chrome |
|---------|-----------|------|--------|
| Marketing | `/`, `/pricing`, … | Public | Marketing header/footer |
| Auth | `/login`, `/signup`, `/onboarding` | Mixed | Minimal centered layout |
| **Protected app** | `/app/*` | Required | App shell (sidebar + top bar) |
| External | `/external/[token]` | Token | External layout only |

---

## Primary navigation (sidebar)

### Workspace

| Label | Route | User goal |
|-------|-------|-----------|
| Home | `/app` | See attention, activity, next steps |
| Inbox | `/app/inbox` | Act on assigned/waiting tasks |
| Workflows | `/app/workflows` | Browse all workflow instances |
| Documents | `/app/documents` | Browse all documents |
| Monitors | `/app/monitors` | Browse recurring rules and reminders |

### Records

| Label | Route | User goal |
|-------|-------|-----------|
| Vendors | `/app/vendors` | Vendor directory and compliance posture |
| People | `/app/people` | Employees, contractors, external contacts |
| Reports | `/app/reports` | Exports and compliance summaries |
| Audit Log | `/app/audit` | Org-wide immutable activity |

### Apps (modules)

| Label | Route | Module slug |
|-------|-------|-------------|
| W-9 Collector | `/app/apps/w9` | `w9` |
| COI Tracker | `/app/apps/coi` | `coi` |
| Contracts | `/app/apps/contracts` | `contracts` |
| Exclusions | `/app/apps/exclusions` | `exclusions` |
| Vendor Packets | `/app/apps/vendor-packets` | `vendor-packets` |
| Policies | `/app/apps/policies` | `policies` |
| Training | `/app/apps/training` | `training` |
| Invoices | `/app/apps/invoices` | `invoices` |
| Signer | `/app/apps/signer` | `signer` |

### Admin

| Label | Route | User goal |
|-------|-------|-----------|
| Settings | `/app/settings` | Org profile and preferences |
| Members | `/app/settings/members` | Invite and manage roles |
| Billing | `/app/settings/billing` | Plan, usage, upgrade |
| Security | `/app/settings/security` | SSO, sessions (future) |

---

## Route catalog

### Home and inbox

| Route | Purpose |
|-------|---------|
| `/app` | Global dashboard: attention, waiting, expiring, activity |
| `/app/inbox` | Task-centric queue: assigned, overdue, waiting on external |

### Workflows

| Route | Purpose |
|-------|---------|
| `/app/workflows` | Filterable table of all `workflow_instances` |
| `/app/workflows/[id]` | Workflow detail: stepper, next action, tasks, documents, monitor |

### Documents

| Route | Purpose |
|-------|---------|
| `/app/documents` | All documents across modules |
| `/app/documents/[id]` | Preview, extraction review, versions, audit |

### Monitors

| Route | Purpose |
|-------|---------|
| `/app/monitors` | All monitors and upcoming reminders |
| `/app/monitors/[id]` | Rule, schedule, run history, related object |

### Records

| Route | Purpose |
|-------|---------|
| `/app/vendors` | Vendor list |
| `/app/vendors/[id]` | Vendor profile, documents, workflows, gaps |
| `/app/people` | People directory |
| `/app/people/[id]` | Person record: acks, training, tasks |
| `/app/reports` | Report hub and export entry points |
| `/app/audit` | Global audit log with filters |

### Settings

| Route | Purpose |
|-------|---------|
| `/app/settings` | General org settings |
| `/app/settings/members` | Membership and roles |
| `/app/settings/billing` | Subscription and limits |
| `/app/settings/security` | Security settings |

### Module homes

| Route | Purpose |
|-------|---------|
| `/app/apps/[module]` | Module landing: job, CTA, filtered workflows/docs |

### External

| Route | Purpose |
|-------|---------|
| `/external/[token]` | Vendor/employee/signer task completion |

---

## Legacy route mapping (migration)

Existing routes redirect to `/app` equivalents during transition:

| Legacy | New |
|--------|-----|
| `/dashboard` | `/app` |
| `/tasks` | `/app/inbox` |
| `/workflows` | `/app/workflows` |
| `/documents` | `/app/documents` |
| `/monitors` | `/app/monitors` |
| `/vendors` | `/app/vendors` |
| `/audit` | `/app/audit` |
| `/settings` | `/app/settings` |
| `/billing` | `/app/settings/billing` |
| `/w9` | `/app/apps/w9` |
| `/requests/[id]` | `/app/workflows/[id]` |

---

## Object hierarchy (breadcrumbs)

```
Home > Workflows > W-9 request — Acme Cleaning Co.
Home > Documents > COI — Acme Cleaning Co. (v2)
Home > Vendors > Acme Cleaning Co.
Home > Apps > W-9 Collector
Home > Settings > Members
```

Detail pages **always** show breadcrumbs. List pages show page title only.

---

## Entitlement and visibility

- **Apps** without entitlement: show in sidebar with subtle locked state OR hide per org config (default: show locked with upgrade path on click).
- **Admin** routes: require `organization.manage` or `settings.manage`.
- **Audit export**: require `audit.view` + `audit.export`.
- **Billing**: require `organization.manage` or owner role.

---

## Search and command menu scope

Global search (Cmd+K) indexes: documents, workflows, vendors, people, settings pages, and quick actions (upload, start workflow, invite).

---

*See [UX_NAVIGATION.md](./UX_NAVIGATION.md) for interaction behavior.*
