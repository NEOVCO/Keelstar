# Contract Renewal Tracker — Permissions

Contract Renewal Tracker reuses platform RBAC. No module-specific permission keys in v1 — same keys as W-9 Collection and COI Tracker.

There is **no external participant role** in MVP.

## Roles

| Role | Level | Contract module access |
|------|-------|------------------------|
| Owner | 100 | Full |
| Admin | 80 | Full except billing ownership |
| Manager | 60 | Create records, upload, enter fields, activate monitoring, export evidence |
| Member | 40 | Create records, upload, view records (no activate monitoring) |
| Viewer | 20 | Read only |

## Action matrix

| Action | Owner | Admin | Manager | Member | Viewer |
|--------|:-----:|:-----:|:-------:|:------:|:------:|
| view contract records | ✓ | ✓ | ✓ | ✓ | ✓ |
| create contract record | ✓ | ✓ | ✓ | ✓ | — |
| upload contract file (internal) | ✓ | ✓ | ✓ | ✓ | — |
| download contract file | ✓ | ✓ | ✓ | ✓ | — |
| enter / edit contract fields | ✓ | ✓ | ✓ | — | — |
| activate monitoring | ✓ | ✓ | ✓ | — | — |
| upload new version (amendment) | ✓ | ✓ | ✓ | ✓ | — |
| mark completed / cancelled | ✓ | ✓ | ✓ | — | — |
| view renewal monitor | ✓ | ✓ | ✓ | ✓ | ✓ |
| export evidence | ✓ | ✓ | ✓ | — | — |
| view audit log | ✓ | ✓ | ✓ | ✓ | ✓ |
| invite member | ✓ | ✓ | — | — | — |
| manage billing | ✓ | — | — | — | — |

## Permission keys (RBAC)

| Action | Permission key |
|--------|----------------|
| Create record | `workflows.create` |
| Upload file | `workflows.create` |
| Save fields | `workflows.approve` |
| Activate monitoring | `workflows.approve` |
| Complete / cancel | `workflows.update` |
| Export evidence | `audit.view` |
| View audit | `audit.view` |

## Entitlement gating

| Check | Key | Effect |
|-------|-----|--------|
| Module access | `contract_renewal` | Module hidden / API 403 without entitlement |
| Automated renewal reminders | `contract_renewal` | Reminders not scheduled on free tier |
| Usage limits | — | Free tier: 5 active records (see [BILLING_LIMITS.md](./BILLING_LIMITS.md)) |

## Enforcement

1. Server actions call `requirePermission(orgId, key)` in `src/lib/contracts/*`
2. RLS on `workflow_instances`, `documents` via `is_org_member` + role checks
3. Storage uploads use authenticated user context; signed URLs for download
4. `assertUsageLimit()` on contract create for `contract_active_records`
5. `checkModuleEntitlement()` before scheduling automated reminders

## Ownership

`workflow_instances.owner_id` set at create (creator). Owner receives renewal reminder emails. Reassignable by Admin+ (future); v1 owner is creator.
