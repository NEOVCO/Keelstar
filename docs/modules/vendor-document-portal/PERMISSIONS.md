# W-9 Collection — Permissions

## Roles

| Role | Level | W-9 module access |
|------|-------|-------------------|
| Owner | 100 | Full |
| Admin | 80 | Full except billing ownership |
| Manager | 60 | Create vendors, requests, approve/reject |
| Member | 40 | Create vendors, requests (no approve) |
| Viewer | 20 | Read only |
| External Participant | — | Magic link upload only (server-validated) |

## Action matrix

| Action | Owner | Admin | Manager | Member | Viewer | External |
|--------|:-----:|:-----:|:-------:|:------:|:------:|:--------:|
| create vendor | ✓ | ✓ | ✓ | ✓ | — | — |
| edit vendor | ✓ | ✓ | ✓ | ✓ | — | — |
| archive vendor | ✓ | ✓ | ✓ | — | — | — |
| request W-9 | ✓ | ✓ | ✓ | ✓ | — | — |
| resend request | ✓ | ✓ | ✓ | ✓ | — | — |
| revoke magic link | ✓ | ✓ | ✓ | — | — | — |
| view document | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| download document | ✓ | ✓ | ✓ | ✓ | — | — |
| approve document | ✓ | ✓ | ✓ | — | — | — |
| reject document | ✓ | ✓ | ✓ | — | — | — |
| request correction | ✓ | ✓ | ✓ | — | — | — |
| view audit log | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| export evidence | ✓ | ✓ | ✓ | — | — | — |
| invite member | ✓ | ✓ | — | — | — | — |
| manage billing | ✓ | — | — | — | — | — |
| upload W-9 (external) | — | — | — | — | — | ✓* |

*External upload via validated magic link only; no RLS client access.

## Permission keys (RBAC)

- `vendors.create`, `vendors.update`, `vendors.archive`
- `workflows.create`, `workflows.update`
- `documents.approve`, `documents.reject`
- `audit.read`, `evidence.export`
- `members.invite`, `billing.manage`

## Enforcement

1. Server actions call `requirePermission(orgId, key)`
2. RLS on `vendors`, `workflow_instances`, `documents` via `is_org_member` + role checks
3. External routes use service role after token validation
