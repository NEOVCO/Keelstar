# Contract Renewal Tracker — Audit Events

All events written to `audit_logs` via `createAuditLog()`.

## Standard fields

| Field | Description |
|-------|-------------|
| `organization_id` | Tenant |
| `actor_type` | `user` \| `system` |
| `actor_id` | UUID or null |
| `actor_email` | When available |
| `action` | Event key below |
| `target_type` | Entity type |
| `target_id` | Entity UUID |
| `metadata` | JSON context |
| `ip_address` | When available |
| `user_agent` | When available |
| `correlation_id` | Request/workflow correlation |

No `external` actor type in v1 — all uploads are internal users.

## Event catalog

### Record lifecycle

| Action | target_type | When |
|--------|-------------|------|
| `contract.created` | workflow_instance | Record drafted |
| `contract.activated` | workflow_instance | Monitoring activated |
| `contract.completed` | workflow_instance | Manual complete |
| `contract.cancelled` | workflow_instance | Admin cancel |

### Document

| Action | target_type | When |
|--------|-------------|------|
| `contract_document.uploaded` | document | First file attached |
| `contract_document.version_created` | document_version | New version stored |

### Fields

| Action | target_type | When |
|--------|-------------|------|
| `contract_fields.updated` | document | Manual field save |

### Reminders

| Action | target_type | When |
|--------|-------------|------|
| `contract_reminder.created` | workflow_instance | Reminder scheduled on activate / reschedule |
| `contract_reminder.sent` | reminder | Worker delivered email |
| `contract_reminder.cancelled` | reminder | Complete, cancel, or date change |

### Monitor

| Action | target_type | When |
|--------|-------------|------|
| `contract_monitor.created` | monitor | Activated + monitor inserted |
| `contract_monitor.completed` | monitor | Superseded, completed, or cancelled |
| `contract_status.expiring_soon` | workflow_instance | Daily worker: ≤30 days to renewal |
| `contract_status.expired` | workflow_instance | Daily worker: past renewal date |

### Export / billing

| Action | target_type | When |
|--------|-------------|------|
| `contract_evidence.exported` | workflow_instance | CSV export |
| `billing.limit_reached` | organization | Usage limit hit |
| `email.sent` | email_event | Any email (shared) |

### Shared platform events (also apply)

| Action | When |
|--------|------|
| `vendor.created` | New vendor linked during contract create |
| `organization.created` | Onboarding |

## Metadata examples

```json
// contract.created
{
  "documentId": "uuid",
  "contractName": "Acme SaaS Master Agreement",
  "vendorId": null
}

// contract_document.uploaded
{
  "filename": "acme-msa-2024.pdf",
  "versionNumber": 1,
  "mimeType": "application/pdf"
}

// contract_fields.updated
{
  "fields": ["renewal_date", "termination_notice_days", "auto_renewal"],
  "renewalDate": "2027-01-01T00:00:00Z",
  "noticeDeadline": "2026-11-02T00:00:00Z"
}

// contract.activated
{
  "renewalDate": "2027-01-01T00:00:00Z",
  "noticeDeadline": "2026-11-02T00:00:00Z",
  "autoRenewal": true
}

// contract_monitor.created
{
  "workflowId": "uuid",
  "renewalDate": "2027-01-01T00:00:00Z",
  "monitorType": "contract_renewal"
}

// contract_monitor.completed
{
  "reason": "superseded"
}

// contract_reminder.created
{
  "window": "renew_90d",
  "scheduledAt": "2026-10-03T09:00:00Z",
  "category": "contract_renewal"
}

// contract_evidence.exported
{
  "format": "csv"
}
```

## Analytics events (PostHog — not audit_logs)

| Event | Trigger |
|-------|---------|
| `contract_created` | Record created |
| `first_contract_created` | First create per org |
| `contract_uploaded` | File uploaded |
| `contract_fields_saved` | Fields saved |
| `contract_activated` | Monitoring activated |
| `first_contract_activated` | First activation per org |
| `contract_monitor_created` | Monitor created |
| `contract_expiring_soon` | Status transition |
| `contract_expired` | Status transition |
| `contract_reminder_sent` | Reminder delivered |
| `contract_completed` | Manual complete |
| `contract_evidence_exported` | Export downloaded |
