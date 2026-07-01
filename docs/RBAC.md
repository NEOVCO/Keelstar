# Keelstar Role-Based Access Control

> Permissions are always organization-scoped. No authorization decision can happen without organization context.

---

## Roles

Keelstar defines six roles. Roles are assigned per organization membership, not globally.

| Role | Key | Description |
|------|-----|-------------|
| **Owner** | `owner` | Full control. Created org. Cannot be removed if sole owner. Billing authority. |
| **Admin** | `admin` | Manage members, settings, all modules. Cannot delete org or transfer ownership. |
| **Manager** | `manager` | Create/manage workflows, approve tasks, view audit logs. Cannot manage billing or members. |
| **Member** | `member` | Create documents, participate in workflows, complete assigned tasks. |
| **Viewer** | `viewer` | Read-only access to documents, workflows, and monitors. |
| **External Participant** | `external` | Not a normal account. Accesses specific tasks via magic link tokens only. |

---

## Permission Groups

Permissions are granular and grouped for clarity:

### Organization
| Permission | Key | Owner | Admin | Manager | Member | Viewer |
|------------|-----|-------|-------|---------|--------|--------|
| Manage organization | `organization.manage` | ✓ | ✓ | | | |
| Manage settings | `settings.manage` | ✓ | ✓ | | | |

### Members
| Permission | Key | Owner | Admin | Manager | Member | Viewer |
|------------|-----|-------|-------|---------|--------|--------|
| Invite members | `members.invite` | ✓ | ✓ | | | |
| Manage members | `members.manage` | ✓ | ✓ | | | |

### Documents
| Permission | Key | Owner | Admin | Manager | Member | Viewer |
|------------|-----|-------|-------|---------|--------|--------|
| View documents | `documents.view` | ✓ | ✓ | ✓ | ✓ | ✓ |
| Create documents | `documents.create` | ✓ | ✓ | ✓ | ✓ | |
| Update documents | `documents.update` | ✓ | ✓ | ✓ | ✓ | |
| Delete documents | `documents.delete` | ✓ | ✓ | ✓ | | |

### Workflows
| Permission | Key | Owner | Admin | Manager | Member | Viewer |
|------------|-----|-------|-------|---------|--------|--------|
| View workflows | `workflows.view` | ✓ | ✓ | ✓ | ✓ | ✓ |
| Create workflows | `workflows.create` | ✓ | ✓ | ✓ | ✓ | |
| Update workflows | `workflows.update` | ✓ | ✓ | ✓ | ✓ | |
| Approve workflows | `workflows.approve` | ✓ | ✓ | ✓ | | |

### Monitors
| Permission | Key | Owner | Admin | Manager | Member | Viewer |
|------------|-----|-------|-------|---------|--------|--------|
| View monitors | `monitors.view` | ✓ | ✓ | ✓ | ✓ | ✓ |
| Manage monitors | `monitors.manage` | ✓ | ✓ | ✓ | | |

### Notifications
| Permission | Key | Owner | Admin | Manager | Member | Viewer |
|------------|-----|-------|-------|---------|--------|--------|
| View notifications | `notifications.view` | ✓ | ✓ | ✓ | ✓ | ✓ |

### Audit
| Permission | Key | Owner | Admin | Manager | Member | Viewer |
|------------|-----|-------|-------|---------|--------|--------|
| View audit logs | `audit.view` | ✓ | ✓ | ✓ | | |

### Billing
| Permission | Key | Owner | Admin | Manager | Member | Viewer |
|------------|-----|-------|-------|---------|--------|--------|
| Manage billing | `billing.manage` | ✓ | | | | |

---

## External Participants

External participants are **not** organization members and **do not** have roles in the RBAC system.

- They are represented in `external_participants` table.
- They access specific tasks via `magic_links` with hashed tokens.
- Their access is scoped to exactly one task (and its related data).
- They cannot navigate the app, see organization data, or create accounts.
- Their actions are audited with `actor_type: 'external'`.

---

## Authorization Flow

```
Request → Authenticate (Supabase Auth)
       → Resolve active organization (cookie + membership check)
       → Check role permissions (has_permission)
       → Enforce RLS (Postgres)
       → Execute action
       → Audit log
```

### Server-Side Helpers

```typescript
// Require authenticated user with active organization
requireOrganization() → { user, organization, membership }

// Require specific permission in active organization
requirePermission('documents.create') → { user, organization, membership }

// Check permission without throwing
can(user, organizationId, 'workflows.approve') → boolean

// Get active organization from cookie/session
getActiveOrganization() → Organization | null
```

---

## Rules

1. **Permissions are always organization-scoped.** There are no global permissions for tenant data.
2. **No authorization without organization context.** Every API route and server action must call `requireOrganization()` or equivalent.
3. **Never trust client-provided organization_id.** Always verify membership server-side.
4. **External participants bypass RBAC.** Their access is controlled by magic link validation, not roles.
5. **Owner role is special.** At least one owner must exist per organization. Ownership transfer is an explicit action.
6. **Role changes are audited.** Every role assignment/removal creates an audit log entry.
7. **Permissions are defined in one place.** `/lib/rbac/permissions.ts` and `/lib/rbac/roles.ts` are the source of truth.
8. **RLS is the last line of defense.** Server-side checks are primary; RLS catches anything that slips through.

---

## Module Entitlements

Beyond RBAC, module access is gated by subscription entitlements:

```
User has permission → Organization has entitlement → Module is accessible
```

A user with `workflows.create` permission still cannot create COI workflows if the organization lacks the `coi_tracker` entitlement.

Entitlement checks happen in:
- Module navigation (hide unavailable modules)
- API routes (reject unauthorized module actions)
- Workflow creation (validate module type against entitlements)

---

*RBAC v1 — platform foundation.*
