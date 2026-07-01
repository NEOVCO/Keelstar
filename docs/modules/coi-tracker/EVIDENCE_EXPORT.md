# COI Tracker — Evidence Export (MVP)

## Function

`exportCoiEvidence(workflowId)` in `src/lib/coi/exportEvidence.ts` → downloadable CSV with workflow summary, coverage fields, document versions, reminders, and audit events.

## Permissions

Owner, Admin, Manager only (`audit.view` via `requirePermission`)

## Primary CSV section

| Column | Source |
|--------|--------|
| vendor_name | `vendors.name` |
| vendor_email | `vendors.email` |
| insured_name | `document_parsed_fields.insured_name` |
| certificate_holder | `document_parsed_fields.certificate_holder` |
| insurance_carrier | `document_parsed_fields.insurance_carrier` |
| policy_number | `document_parsed_fields.policy_number` |
| policy_type | `document_parsed_fields.policy_type` |
| effective_date | `document_parsed_fields.effective_date` |
| expiration_date | `document_parsed_fields.expiration_date` or `metadata.expiration_date` |
| coverage_limit | `document_parsed_fields.coverage_limit` |
| request_type | `coi_tracking` |
| current_status | `workflow_instances.status` |
| monitor_status | `monitors.status` (latest `coi_expiration`) |
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

Includes both request reminders (`coi_reminder`, `coi_overdue`) and expiration reminders (`coi_expiration_internal`).

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
  "metadata": { "versionCount": 2, "auditCount": 15 }
}
```

## Audit

`coi_evidence.exported` with `{ format: "csv" }`

## Analytics

PostHog: `coi_evidence_exported`

## Not included in v1

- ZIP bundle with PDFs
- Branded PDF summary report
- Separate audit-only download (combined in single CSV)
- Field override history export (overrides visible in audit section)
- Monitor run history (monitor status in summary row only)

## Future

- ZIP export with all COI PDF versions
- Compliance report PDF with org branding
- Bulk export across all vendors
