# Contract Renewal Tracker — Data Model

> Maps module entities to shared Keelstar tables. See [DATABASE_SCHEMA.md](../../DATABASE_SCHEMA.md) for platform-wide schema.
> **No `contracts` table** — all contract data lives in shared document and workflow primitives.

## Entity mapping

| Module concept | Storage |
|----------------|---------|
| Organization | `organizations` |
| Member | `organization_members` + `member_roles` |
| Vendor (optional) | `vendors` — link via `workflow_instances.vendor_id` |
| Contract record | `workflow_instances` where `type = 'contract_renewal'` |
| Contract document | `documents` where `document_type = 'contract'` |
| Document file | `document_versions` |
| Contract fields | `document_parsed_fields` (`extraction_source = 'manual'`) |
| Renewal monitor | `monitors` where `monitor_type = 'contract_renewal'` |
| Renewal reminder | `reminders` (`type = contract_renewal_internal`) |
| Notification | `notifications` |
| Email delivery | `email_events` |
| Audit | `audit_logs` |
| Evidence export | `evidence_exports` + CSV generation |
| Entitlement | `organization_entitlements` + `usage_tracking` |

**Not used in v1:** `tasks`, `external_participants`, `magic_links`

## workflow_instances (contract)

Contract record uses existing `workflow_instances` with type constraint extended in platform migrations.

**Type:** `contract_renewal`

**Statuses:** `draft`, `review_needed`, `active_monitoring`, `expiring_soon`, `expired`, `completed`, `cancelled`

**Key columns:** `vendor_id` (optional), `owner_id`, `title`, `completed_at`, `metadata`

**Metadata jsonb:**

```json
{
  "contract_name": "Acme SaaS Master Agreement",
  "counterparty": "Acme Software Inc.",
  "effective_date": "2024-01-01T00:00:00Z",
  "renewal_date": "2027-01-01T00:00:00Z",
  "termination_notice_days": 60,
  "notice_deadline": "2026-11-02T00:00:00Z",
  "auto_renewal": true,
  "contract_value": "$48,000/year",
  "notes": "Annual prepay; negotiate at renewal.",
  "activated_at": "2026-06-15T10:00:00Z",
  "activated_by": "user-uuid"
}
```

`notice_deadline` is computed on save: `renewal_date − termination_notice_days` (calendar days). Stored in metadata for display and export; not a separate monitor target in v1.

## documents (contract)

**document_type:** `contract`

**Statuses:** `pending`, `uploaded`, `review_needed`, `active_monitoring`, `expiring_soon`, `expired`, `archived`

**Key columns:** `workflow_instance_id`, `vendor_id` (optional), `current_version_id`, `status`

| Status | Meaning |
|--------|---------|
| `pending` | Record created, no file yet |
| `review_needed` | File uploaded, fields incomplete or unconfirmed |
| `active_monitoring` | Monitoring active |
| `expiring_soon` | ≤30 days to renewal |
| `expired` | Past renewal date |
| `archived` | Superseded by newer version or manually closed |

Document status mirrors workflow monitoring status after activation.

## document_parsed_fields (manual entry)

Fields stored per `document_version_id`. Canonical values also mirrored to `workflow_instances.metadata` on activate for list views and monitors.

### Required fields (activation gate)

| field_key | field_type | Notes |
|-----------|------------|-------|
| `contract_name` | text | Display name; usually matches workflow title |
| `renewal_date` | date | Drives monitor and reminders |

### Standard fields

| field_key | field_type | Notes |
|-----------|------------|-------|
| `counterparty` | text | Other party legal or trade name |
| `effective_date` | date | Contract start |
| `termination_notice_days` | integer | Days before renewal to give notice; used for notice deadline display |
| `auto_renewal` | boolean | Evergreen / auto-renew clause present |
| `contract_value` | text | Free-form value (e.g. `$48,000/year`) |
| `notes` | text | Internal notes |

**Extraction:** v1 is manual only (`extraction_source = 'manual'`, `confidence = 1.0`, `is_override = true` on save).

## monitors (contract renewal)

**monitor_type:** `contract_renewal`

**target_type:** `document`

**Key columns:** `document_id`, `vendor_id` (optional), `monitored_date` (= `renewal_date`)

**config:**

```json
{
  "renewalDate": "2027-01-01T00:00:00Z",
  "terminationNoticeDays": 60,
  "noticeDeadline": "2026-11-02T00:00:00Z"
}
```

**Statuses:** `active`, `paused`, `completed`, `cancelled`, `failed`, `expired`

When a new contract version is activated for the same workflow, prior active monitors are completed (`reason: superseded`).

## reminders

### Renewal reminders (`category: contract_renewal`)

| reminder_window | type | scheduled_at |
|-----------------|------|--------------|
| `renew_90d` | `contract_renewal_internal` | renewal_date − 90 days |
| `renew_60d` | `contract_renewal_internal` | renewal_date − 60 days |
| `renew_30d` | `contract_renewal_internal` | renewal_date − 30 days |
| `renew_0d` | `contract_renewal_internal` | renewal_date |

- Recipient: workflow `owner_id` email (internal only)
- `metadata`: `{ category: "contract_renewal", documentId, internal: true, noticeDeadline }`
- Scheduled at 09:00 server time on target date
- Requires paid `contract_renewal` entitlement to schedule

**v1 does not schedule separate reminders at `notice_deadline`.** UI highlights notice deadline; renewal reminders fire on renewal-date windows above.

## usage_tracking

| metric_key | When incremented / checked |
|------------|---------------------------|
| `contract_active_records` | On contract create — count of monitored + in-flight records |

Active record count includes workflows in: `active_monitoring`, `expiring_soon`, `expired`, `review_needed`, `draft` (in-flight intake).

Free tier cap: 3 (see [BILLING_LIMITS.md](./BILLING_LIMITS.md)).

## Storage path

```
organizations/{org_id}/workflows/{workflow_id}/documents/{doc_id}/versions/v{n}/{filename}
```

Optional vendor segment when `vendor_id` set:

```
organizations/{org_id}/vendors/{vendor_id}/workflows/{workflow_id}/documents/{doc_id}/versions/v{n}/{filename}
```

## Indexes (migration 006)

```sql
CREATE INDEX idx_monitors_contract_renewal_active
  ON monitors(organization_id, next_run_at)
  WHERE monitor_type = 'contract_renewal' AND status = 'active';
```

## Relationship to vendors

`vendor_id` is optional. Contracts with standalone counterparties (customers, landlords, SaaS vendors not in vendor directory) use `counterparty` text only. When linked, contract appears on vendor detail and counts toward vendor-scoped exports.
