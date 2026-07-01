# W-9 Collection — Evidence Export (MVP)

## Function

`exportW9Evidence(workflowInstanceId)` → downloadable CSV + document signed URLs

## CSV columns

| Column | Source |
|--------|--------|
| vendor_name | `vendors.name` |
| vendor_email | `vendors.email` |
| request_type | `w9_collection` |
| request_created_at | `workflow_instances.created_at` |
| request_sent_at | `metadata.sent_at` |
| due_date | `workflow_instances.due_date` |
| submitted_at | `metadata.submitted_at` |
| approved_at / rejected_at | `metadata` |
| current_status | `workflow_instances.status` |
| document_versions | JSON list: version, filename, created_at |
| download_urls | Signed URLs (1h expiry) generated at export time |

## Separate outputs

1. **Audit events CSV** — all `audit_logs` for workflow + related entities
2. **Document download** — signed URL per version (not ZIP in v1)

## Tracking

Insert `evidence_exports` row with `exported_by`, `format: 'csv'`, metadata.

## Permissions

Owner, Admin, Manager only (`evidence.export`)

## Audit

`evidence.exported` with `{ workflow_instance_id, version_count, audit_event_count }`

## Future (not v1)

- ZIP bundle with PDFs
- Branded PDF summary report
