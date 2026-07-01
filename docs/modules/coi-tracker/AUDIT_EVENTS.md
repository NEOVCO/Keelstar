# COI Tracker — Audit Events

All events written to `audit_logs` via `createAuditLog()`.

## Standard fields

| Field | Description |
|-------|-------------|
| `organization_id` | Tenant |
| `actor_type` | `user` \| `external` \| `system` |
| `actor_id` | UUID or null |
| `actor_email` | When available |
| `action` | Event key below |
| `target_type` | Entity type |
| `target_id` | Entity UUID |
| `metadata` | JSON context |
| `ip_address` | When available |
| `user_agent` | When available |
| `correlation_id` | Request/workflow correlation |

## Event catalog

### Request lifecycle

| Action | target_type | When |
|--------|-------------|------|
| `coi_request.created` | workflow_instance | Request drafted |
| `coi_request.sent` | workflow_instance | Email sent / resend |
| `coi_request.cancelled` | workflow_instance | Admin cancel (future) |

### Magic link

| Action | target_type | When |
|--------|-------------|------|
| `coi_magic_link.created` | magic_link | Link generated on send |
| `coi_magic_link.opened` | magic_link | External page load |
| `coi_magic_link.used` | magic_link | Upload submitted |
| `coi_magic_link.revoked` | magic_link | Manual revoke |

### Document

| Action | target_type | When |
|--------|-------------|------|
| `coi_document.uploaded` | document | External upload complete |
| `coi_document.version_created` | document_version | New version stored |
| `coi_document.approved` | document | Manager approves |
| `coi_document.rejected` | document | Manager rejects |

### Fields

| Action | target_type | When |
|--------|-------------|------|
| `coi_fields.updated` | document | Manual field save |

### Review / correction

| Action | target_type | When |
|--------|-------------|------|
| `coi_correction.requested` | workflow_instance | Rejection with resend |

### Reminders

| Action | target_type | When |
|--------|-------------|------|
| `coi_reminder.created` | workflow_instance | Reminder scheduled (request or expiration) |
| `coi_reminder.sent` | reminder | Worker delivered email |
| `coi_reminder.cancelled` | reminder | Terminal status (implicit via update) |

### Monitor

| Action | target_type | When |
|--------|-------------|------|
| `coi_monitor.created` | monitor | Approved + monitor inserted |
| `coi_monitor.completed` | monitor | Superseded by newer COI |
| `coi_status.expiring_soon` | workflow_instance | Daily worker: ≤30 days to expiry |
| `coi_status.expired` | workflow_instance | Daily worker: past expiration |

### Export / billing

| Action | target_type | When |
|--------|-------------|------|
| `coi_evidence.exported` | workflow_instance | CSV export |
| `billing.limit_reached` | organization | Usage limit hit |
| `email.sent` | email_event | Any email (shared) |

### Shared platform events (also apply)

| Action | When |
|--------|------|
| `vendor.created` | New vendor during COI flow |
| `organization.created` | Onboarding |

## Metadata examples

```json
// coi_request.sent
{
  "vendorEmail": "vendor@supplier.com",
  "magicLinkId": "uuid"
}

// coi_document.uploaded
{
  "filename": "coi-acme.pdf",
  "versionNumber": 1
}

// coi_document.approved
{
  "notes": "Coverage meets requirements",
  "expirationDate": "2027-06-01T00:00:00Z"
}

// coi_correction.requested
{
  "reason": "Expiration date not visible on certificate"
}

// coi_monitor.created
{
  "workflowId": "uuid",
  "expirationDate": "2027-06-01T00:00:00Z"
}

// coi_monitor.completed
{
  "reason": "replacement_approved"
}

// coi_reminder.created
{
  "window": "exp_30d",
  "scheduledAt": "2027-05-02T09:00:00Z",
  "category": "expiration"
}

// coi_evidence.exported
{
  "format": "csv"
}
```

## Analytics events (PostHog — not audit_logs)

| Event | Trigger |
|-------|---------|
| `coi_request_created` | Request created |
| `coi_request_sent` | Request sent |
| `first_coi_request_sent` | First send per org |
| `external_coi_uploaded` | External upload |
| `coi_submission_received` | Upload complete |
| `first_coi_uploaded` | First upload per org |
| `coi_fields_saved` | Fields saved |
| `coi_approved` | Approved |
| `first_coi_approved` | First approval per org |
| `coi_rejected` | Rejected |
| `coi_correction_requested` | Correction flow |
| `coi_monitor_created` | Monitor created |
| `first_coi_monitor_created` | First monitor per org |
| `coi_expiring_soon` | Status transition |
| `coi_expired` | Status transition |
| `coi_reminder_sent` | Reminder delivered |
| `coi_evidence_exported` | Export downloaded |
