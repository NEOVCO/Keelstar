# COI Tracker — Data Model

> Maps module entities to shared Keelstar tables. See [DATABASE_SCHEMA.md](../../DATABASE_SCHEMA.md) for platform-wide schema.
> **No `coi_certificates` table** — all COI data lives in shared document and workflow primitives.

## Entity mapping

| Module concept | Storage |
|----------------|---------|
| Organization | `organizations` |
| Member | `organization_members` + `member_roles` |
| Vendor | `vendors` (shared with W-9) |
| COI Request | `workflow_instances` where `type = 'coi_tracking'` |
| Upload task | `tasks` where `assignee_type = 'external'` |
| External participant | `external_participants` |
| Magic link | `magic_links` (`purpose = coi_upload`, `vendor_id`, `external_email`, `status`) |
| COI document | `documents` where `document_type = 'coi'` |
| Document file | `document_versions` |
| Coverage fields | `document_parsed_fields` (`extraction_source = 'manual'`) |
| Expiration monitor | `monitors` where `monitor_type = 'coi_expiration'` |
| Request reminder | `reminders` (`type = coi_reminder` \| `coi_overdue`) |
| Expiration reminder | `reminders` (`type = coi_expiration_internal`) |
| Notification | `notifications` |
| Email delivery | `email_events` |
| Audit | `audit_logs` |
| Evidence export | `evidence_exports` + CSV generation |
| Entitlement | `organization_entitlements` + `usage_tracking` |

## workflow_instances (COI)

COI request uses existing `workflow_instances` with extensions from migration `005_coi_tracker.sql`.

**Type:** `coi_tracking`

**Statuses:** `draft`, `sent`, `opened`, `submitted`, `review_needed`, `approved`, `rejected`, `needs_correction`, `overdue`, `active_monitoring`, `expiring_soon`, `expired`, `cancelled`, `completed`

**Key columns:** `vendor_id`, `owner_id`, `due_date`, `completed_at`, `metadata`

**Metadata jsonb:**

```json
{
  "message": "Please include general liability coverage.",
  "requester_name": "jane@acme.com",
  "recipient_email": "vendor@supplier.com",
  "sent_at": "2026-06-01T12:00:00Z",
  "submitted_at": "2026-06-05T09:00:00Z",
  "approved_at": "2026-06-06T14:00:00Z",
  "rejected_at": null,
  "rejection_reason": null,
  "expiration_date": "2027-06-01T00:00:00Z",
  "insured_name": "Acme Supplier LLC",
  "policy_type": "general_liability",
  "magic_link_url": "https://app.keelstar.com/external/coi/...",
  "last_resent_at": null
}
```

## documents (COI)

**document_type:** `coi`

**Statuses:** `pending`, `uploaded`, `review_needed`, `approved`, `rejected`, `active_monitoring`, `expiring_soon`, `expired`, `archived`

**Key columns:** `workflow_instance_id`, `vendor_id`, `current_version_id`, `status`

Document status mirrors workflow monitoring status after approval.

## document_parsed_fields (manual entry)

Fields stored per `document_version_id`. No dedicated COI table.

### Required fields (approval gate)

| field_key | field_type | Notes |
|-----------|------------|-------|
| `insured_name` | text | Named insured on certificate |
| `policy_type` | text | One of `COI_POLICY_TYPES` enum |
| `expiration_date` | date | Drives monitor |

### Standard fields

| field_key | field_type | Notes |
|-----------|------------|-------|
| `certificate_holder` | text | Organization named as certificate holder |
| `insurance_carrier` | text | Carrier name |
| `policy_number` | text | Policy identifier |
| `effective_date` | date | Coverage start |
| `coverage_limit` | text | Primary limit (e.g. `$1,000,000`) |
| `notes` | text | Free-form reviewer notes |

### Optional fields

| field_key | field_type | Notes |
|-----------|------------|-------|
| `additional_insured` | text | Additional insured endorsement |
| `waiver_of_subrogation` | text | Waiver status |
| `aggregate_limit` | text | Aggregate coverage limit |
| `per_occurrence_limit` | text | Per-occurrence limit |

**Policy types:** `general_liability`, `workers_compensation`, `auto_liability`, `professional_liability`, `umbrella_excess`, `other`

**Extraction:** v1 is manual only (`extraction_source = 'manual'`, `confidence = 1.0`, `is_override = true` on save).

## monitors (COI expiration)

Extended by migration `005_coi_tracker.sql`:

```sql
document_id uuid REFERENCES documents(id)
vendor_id uuid REFERENCES vendors(id)
monitored_date timestamptz  -- expiration date
```

**monitor_type:** `coi_expiration`

**target_type:** `document`

**config:** `{ "expirationDate": "2027-06-01T00:00:00Z" }`

**Statuses:** `active`, `paused`, `completed`, `cancelled`, `failed`, `expired`

When a new COI is approved for the same vendor, prior active monitors are completed (`replacement_approved`).

## magic_links

| Field | COI value |
|-------|-----------|
| `purpose` | `coi_upload` |
| `expires_in_days` | 14 (default) |
| `max_uses` | 10 |
| `status` | `active` → `used` on submission |

## reminders

### Request reminders (`category: coi_request`)

| reminder_window | type | scheduled_at |
|-----------------|------|--------------|
| `before_7d` | `coi_reminder` | due_date − 7 days |
| `on_due` | `coi_reminder` | due_date |
| `after_7d` | `coi_overdue` | due_date + 7 days |

### Expiration reminders (`category: coi_expiration`)

| reminder_window | type | scheduled_at |
|-----------------|------|--------------|
| `exp_30d` | `coi_expiration_internal` | expiration − 30 days |
| `exp_14d` | `coi_expiration_internal` | expiration − 14 days |
| `exp_7d` | `coi_expiration_internal` | expiration − 7 days |
| `exp_0d` | `coi_expiration_internal` | expiration date |
| `exp_post_7d` | `coi_expiration_internal` | expiration + 7 days |

Expiration reminders are **internal only** (workflow owner email). Paid entitlement required to schedule.

## usage_tracking

| metric_key | When incremented / checked |
|------------|---------------------------|
| `coi_requests` | On request send (monthly) |
| `coi_active_records` | On request create (count of monitored + in-flight records) |

Active record count includes workflows in: `active_monitoring`, `expiring_soon`, `approved`, `review_needed`, `submitted`.

## Storage path

```
organizations/{org_id}/vendors/{vendor_id}/workflows/{workflow_id}/documents/{doc_id}/versions/v{n}/{filename}
```

## Indexes (migration 005)

- `idx_monitors_coi_active` on `monitors(organization_id, next_run_at)` WHERE `monitor_type = 'coi_expiration' AND status = 'active'`
- `idx_monitors_document` on `monitors(document_id)`
- `idx_reminders_type_scheduled` on `reminders(type, status, scheduled_at)` WHERE `status = 'scheduled'`
