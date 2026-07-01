# Keelstar Audit Logging

> Every important action is logged. Audit logs are append-only, tenant-scoped, and exportable.

---

## Philosophy

Keelstar serves compliance and operational workflows. Stakeholders need to answer: **who did what, when, to which resource, and from where?**

Audit logging is not optional. It is a core platform primitive, not a per-module afterthought.

### Principles

1. **Every important action is logged.** If an action affects data, permissions, workflows, or external access, it must produce an audit entry.
2. **Audit logs are append-only.** No UPDATE or DELETE operations on audit_logs for normal users or application code.
3. **Audit logs are tenant-scoped.** Every entry includes `organization_id`. Cross-tenant audit access is impossible.
4. **Audit logs are exportable.** Admins and managers with `audit.view` permission can export logs for compliance review.
5. **Audit logs are immutable.** Once written, an audit entry never changes. Corrections are new entries.

---

## Audit Entry Schema

Every audit log entry includes:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | uuid | auto | Primary key |
| organization_id | uuid | yes | Tenant scope |
| actor_type | text | yes | `user`, `external`, `system` |
| actor_id | uuid | no | User ID, external participant ID, or null for system |
| actor_email | text | no | Email for human-readable audit trail |
| action | text | yes | Dot-notation action key |
| target_type | text | no | Entity type (document, workflow, task, etc.) |
| target_id | uuid | no | Entity ID |
| metadata | jsonb | no | Action-specific context (never sensitive document content) |
| correlation_id | uuid | no | Request trace ID for linking related actions |
| ip_address | inet | no | Client IP when available |
| user_agent | text | no | Client user agent when available |
| created_at | timestamptz | auto | Immutable timestamp |

---

## Actor Types

| Type | When Used |
|------|-----------|
| `user` | Internal organization member performing an action |
| `external` | External participant acting via magic link |
| `system` | Background worker, cron job, or automated process |

---

## Standard Actions (Day One)

These actions must be audited from platform launch:

### Organization
- `organization.created`
- `organization.updated`
- `organization.settings_changed`

### Members
- `member.invited`
- `member.joined`
- `member.removed`
- `member.role_changed`
- `member.suspended`

### Documents
- `document.created`
- `document.updated`
- `document.archived`
- `document.version_created`
- `document.parsed`
- `document.field_overridden`

### Workflows
- `workflow.created`
- `workflow.updated`
- `workflow.status_changed`
- `workflow.completed`
- `workflow.cancelled`

### Tasks
- `task.created`
- `task.assigned`
- `task.completed`
- `task.cancelled`
- `task.overdue`

### Monitors
- `monitor.created`
- `monitor.updated`
- `monitor.run`
- `monitor.paused`
- `monitor.cancelled`

### Notifications
- `notification.created`
- `notification.sent`
- `notification.failed`

### Magic Links
- `magic_link.created`
- `magic_link.used`
- `magic_link.revoked`
- `magic_link.expired`

### Billing
- `billing.subscription_created`
- `billing.subscription_updated`
- `billing.subscription_cancelled`
- `billing.entitlement_changed`

---

## Implementation

### createAuditLog()

Central function in `/lib/audit/createAuditLog.ts`:

```typescript
createAuditLog({
  organizationId: string,
  actorType: 'user' | 'external' | 'system',
  actorId?: string,
  actorEmail?: string,
  action: string,
  targetType?: string,
  targetId?: string,
  metadata?: Record<string, unknown>,
  correlationId?: string,
  ipAddress?: string,
  userAgent?: string,
})
```

Uses service role client to bypass RLS for insertion. Validates all inputs.

### withAudit()

Reusable wrapper for server actions and API handlers:

```typescript
withAudit('document.created', async (ctx) => {
  // ... perform action
  return { targetType: 'document', targetId: doc.id, metadata: { ... } };
});
```

Automatically captures actor from session, correlation ID from request headers, IP and user agent.

---

## Access Control

- **Read**: Requires `audit.view` permission (Owner, Admin, Manager).
- **Insert**: Any authenticated action or service role (system/worker actions).
- **Update**: Never (append-only).
- **Delete**: Never for normal users. Retention policy may archive old logs (future).

---

## Export

Audit logs can be exported as CSV or JSON:

```
GET /api/audit/export?format=csv&from=2025-01-01&to=2025-12-31
```

Requires `audit.view` permission. Export itself is audited as `audit.exported`.

---

## What NOT to Log

- Document file contents or parsed field values containing PII (log field keys and actions, not values).
- Passwords, tokens, or secrets.
- Full request bodies containing sensitive data.
- High-frequency read operations (viewing a document is not audited; creating one is).

---

## Correlation IDs

Every HTTP request should carry or generate a correlation ID (`X-Correlation-ID` header). All audit entries within a request share this ID, enabling trace reconstruction:

```
correlation_id: abc-123
  → organization.created
  → member.role_changed (assigned owner)
  → audit.exported
```

---

*Audit Logging v1 — platform foundation.*
