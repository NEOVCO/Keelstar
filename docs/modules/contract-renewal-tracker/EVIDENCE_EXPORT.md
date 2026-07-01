# Contract Renewal Tracker — Evidence Export (MVP)

## Function

`exportContractEvidence(workflowId)` in `src/lib/contracts/exportEvidence.ts` → downloadable CSV with workflow summary, contract fields, document versions, reminders, and audit events.

## Permissions

Owner, Admin, Manager only (`audit.view` via `requirePermission`)

## Primary CSV section

| Column | Source |
|--------|--------|
| contract_name | `document_parsed_fields.contract_name` or `workflow_instances.title` |
| counterparty | `document_parsed_fields.counterparty` |
| vendor_name | `vendors.name` (if linked) |
| effective_date | `document_parsed_fields.effective_date` |
| renewal_date | `document_parsed_fields.renewal_date` or `metadata.renewal_date` |
| termination_notice_days | `document_parsed_fields.termination_notice_days` |
| notice_deadline | computed or `metadata.notice_deadline` |
| auto_renewal | `document_parsed_fields.auto_renewal` |
| contract_value | `document_parsed_fields.contract_value` |
| notes | `document_parsed_fields.notes` |
| request_type | `contract_renewal` |
| current_status | `workflow_instances.status` |
| monitor_status | `monitors.status` (latest `contract_renewal`) |
| owner_email | owner member email |
| document_versions | JSON list: version, filename, created_at, download_url |

Signed download URLs generated at export time with 1-hour expiry (`getSignedUrl(path, 3600)`).

## Reminders section

Prefixed with `# Reminders` header.

| Column | Source |
|--------|--------|
| type | `reminders.type` |
| window | `reminders.reminder_window` |
| status | `reminders.status` |
| scheduled_at | `reminders.scheduled_at` |
| sent_at | `reminders.sent_at` |

Includes renewal reminders (`contract_renewal_internal`) only.

## Audit events section

Prefixed with `# Audit Events` header.

| Column | Source |
|--------|--------|
| action | `audit_logs.action` |
| actor_type | `audit_logs.actor_type` |
| actor_email | `audit_logs.actor_email` |
| target_type | `audit_logs.target_type` |
| target_id | `audit_logs.target_id` |
| created_at | `audit_logs.created_at` |

Query scope: all audit events for workflow target or metadata referencing workflow ID.

## Tracking

Insert `evidence_exports` row:

```json
{
  "organization_id": "...",
  "workflow_instance_id": "...",
  "exported_by": "user_id",
  "format": "csv",
  "metadata": { "versionCount": 2, "auditCount": 12 }
}
```

## Audit

`contract_evidence.exported` with `{ format: "csv" }`

## Analytics

PostHog: `contract_evidence_exported`

## Not included in v1

- ZIP bundle with contract PDFs
- Branded PDF summary report
- Portfolio-wide bulk export (single workflow only)
- Field override history export (overrides visible in audit section)
- Monitor run history (monitor status in summary row only)
- Notice-deadline-specific reminder log (not scheduled in v1)

## Future

- ZIP export with all contract PDF versions
- Portfolio CSV across all active contracts
- Compliance report PDF with org branding
- Export filtered by `expiring_soon` / `expired` for board reporting
