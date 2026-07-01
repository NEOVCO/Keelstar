# COI Tracker — Permissions

COI Tracker reuses platform RBAC. No module-specific permission keys in v1 — same keys as W-9 Collection.

## Roles

| Role | Level | COI module access |
|------|-------|-------------------|
| Owner | 100 | Full |
| Admin | 80 | Full except billing ownership |
| Manager | 60 | Create requests, enter fields, approve/reject, export evidence |
| Member | 40 | Create requests, view records (no approve) |
| Viewer | 20 | Read only |
| External Participant | — | Magic link upload only (server-validated) |

## Action matrix

| Action | Owner | Admin | Manager | Member | Viewer | External |
|--------|:-----:|:-----:|:-------:|:------:|:------:|:--------:|
| view COI requests | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| create COI request | ✓ | ✓ | ✓ | ✓ | — | — |
| send / resend request | ✓ | ✓ | ✓ | ✓ | — | — |
| revoke magic link | ✓ | ✓ | ✓ | — | — | — |
| view document | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| download document | ✓ | ✓ | ✓ | ✓ | — | — |
| enter / edit COI fields | ✓ | ✓ | ✓ | — | — | — |
| approve COI | ✓ | ✓ | ✓ | — | — | — |
| reject COI | ✓ | ✓ | ✓ | — | — | — |
| request correction | ✓ | ✓ | ✓ | — | — | — |
| view expiration monitor | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| export evidence | ✓ | ✓ | ✓ | — | — | — |
| view audit log | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| invite member | ✓ | ✓ | — | — | — | — |
| manage billing | ✓ | — | — | — | — | — |
| upload COI (external) | — | — | — | — | — | ✓* |

*External upload via validated magic link only; no RLS client access.

## Permission keys (RBAC)

| Action | Permission key |
|--------|----------------|
| Create request | `workflows.create` |
| Send / resend | `workflows.create` |
| Revoke link | `workflows.update` |
| Save fields | `workflows.approve` |
| Approve / reject | `workflows.approve` |
| Export evidence | `audit.view` |
| View audit | `audit.view` |

## Entitlement gating

| Check | Key | Effect |
|-------|-----|--------|
| Module access | `coi_tracker` | Module hidden / API 403 without entitlement |
| Automated reminders | `coi_tracker` | Request and expiration reminders not scheduled on free tier |
| Usage limits | — | Free tier: 3 active records, 3 requests/month (see [BILLING_LIMITS.md](./BILLING_LIMITS.md)) |

## Enforcement

1. Server actions call `requirePermission(orgId, key)` in `src/lib/coi/*`
2. RLS on `workflow_instances`, `documents`, `vendors` via `is_org_member` + role checks
3. External routes (`/api/external/coi/upload`) use service role after token validation
4. `assertUsageLimit()` on request create for `coi_requests` and `coi_active_records`
5. `checkModuleEntitlement()` before scheduling automated reminders

## Resend rate limit

| Role | Manual resend limit |
|------|---------------------|
| Member / Manager | 1 per 24 hours per request |
| Admin / Owner | Unlimited |

Enforced in `resendCoiRequest()` via `metadata.last_resent_at`.
