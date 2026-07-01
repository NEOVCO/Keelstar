# W-9 Collection — Data Model

> Maps module entities to shared Keelstar tables. See [DATABASE_SCHEMA.md](../../DATABASE_SCHEMA.md) for platform-wide schema.

## Entity mapping

| Module concept | Storage |
|----------------|---------|
| Organization | `organizations` |
| Member | `organization_members` + `member_roles` |
| Vendor | `vendors` **(new)** |
| W-9 Request | `workflow_instances` where `type = 'w9_collection'` |
| Upload task | `tasks` where `assignee_type = 'external'` |
| External participant | `external_participants` |
| Magic link | `magic_links` (+ `vendor_id`, `status`, `external_email`) |
| W-9 document | `documents` where `document_type = 'w9'` |
| Document file | `document_versions` |
| Reminder | `reminders` **(new)** |
| Notification | `notifications` |
| Email delivery | `email_events` |
| Audit | `audit_logs` |
| Evidence export | `evidence_exports` **(new)** + CSV generation |
| Entitlement | `organization_entitlements` + `usage_tracking` **(new)** |

## vendors (new)

```sql
id, organization_id, name, email, phone, status, metadata, created_by, created_at, updated_at
```

## workflow_instances (extended)

Added: `vendor_id uuid REFERENCES vendors(id)`, `completed_at timestamptz`

W-9 request statuses: `draft`, `sent`, `opened`, `submitted`, `review_needed`, `approved`, `rejected`, `needs_correction`, `completed`, `cancelled`, `overdue`

Metadata jsonb: `{ message, requester_name, sent_at, submitted_at, approved_at, rejection_reason }`

## documents (extended)

Added: `workflow_instance_id`, `vendor_id`, `current_version_id`

W-9 document statuses: `pending`, `uploaded`, `review_needed`, `approved`, `rejected`, `archived`

## document_versions (extended)

Added: `uploaded_by_type`, `uploaded_by_email`, `storage_bucket`

## magic_links (extended)

Added: `vendor_id`, `external_email`, `status` (`active`|`used`|`expired`|`revoked`|`completed`)

`max_uses` default 10 for W-9 (multi-open before submit)

## reminders (new)

```sql
id, organization_id, workflow_instance_id, type, scheduled_at, sent_at,
status, reminder_window, recipient_email, metadata, created_at, updated_at
```

## evidence_exports (new)

```sql
id, organization_id, workflow_instance_id, exported_by, format, metadata, created_at
```

## usage_tracking (new)

```sql
id, organization_id, metric_key, period_start, count, created_at, updated_at
UNIQUE (organization_id, metric_key, period_start)
```

## Storage path

```
organizations/{org_id}/vendors/{vendor_id}/workflows/{workflow_id}/documents/{doc_id}/versions/v{n}/{filename}
```
