# Contract Renewal Tracker — User Flows

Internal-only MVP. No magic links, no external participants, no request/collection reminder pipeline.

## 1. First user signup

Same as platform onboarding. See [vendor-document-portal/USER_FLOWS.md](../vendor-document-portal/USER_FLOWS.md#1-first-user-signup).

## 2. Create contract record

| Step | Actor | Screen | Objects | Status | Audit |
|------|-------|--------|---------|--------|-------|
| 1 | Member+ | `CreateContractForm` / `/app/apps/contracts` | `workflow_instances`, `documents` | `draft` | `contract.created` |
| 2 | — | — | Usage check `contract_active_records` | — | — |

**Inputs:** `contract_name` (required), `counterparty` (optional), `vendor_id` (optional), `notes` (optional)

**Errors:** 4th active record on free tier

**API:** `POST /api/contracts`

## 3. Upload contract PDF (internal)

| Step | Actor | Screen | Objects | Status | Audit |
|------|-------|--------|---------|--------|-------|
| 1 | Member+ | Workflow detail upload zone | `document_versions`, storage | `draft`→`review_needed` | `contract_document.uploaded`, `contract_document.version_created` |
| 2 | — | — | `documents.current_version_id` updated | — | — |

**Accepted:** PDF, PNG, JPEG, DOC, DOCX · max 25 MB

**API:** `POST /api/contracts/[id]/upload`

**Errors:** wrong MIME; >25 MB; workflow `completed`/`cancelled`

## 4. Manual field entry

| Step | Actor | Screen | Objects | Status | Audit |
|------|-------|--------|---------|--------|-------|
| 1 | Manager+ | `ContractFieldsForm` on workflow detail | `document_parsed_fields` | — | `contract_fields.updated` |
| 2 | — | UI | Computed `notice_deadline` shown live | — | — |

Required before activation: `contract_name`, `renewal_date`

Reviewer reads uploaded PDF and enters: `counterparty`, `effective_date`, `termination_notice_days`, `auto_renewal`, `contract_value`, `notes`.

v1 extraction is manual — free tool `/tools/contract-renewal-extractor` may pre-fill a single file but paid workflow requires explicit save.

## 5. Internal review (side-by-side)

| Step | Actor | Screen | Objects | Status | Audit |
|------|-------|--------|---------|--------|-------|
| 1 | Manager+ | `/app/workflows/[id]` or `/app/apps/contracts/[id]` | — | `review_needed` | — |

Layout: PDF viewer + fields form + notice deadline callout ("Act by [date] to avoid auto-renewal").

## 6. Activate monitoring

| Step | Actor | Screen | Objects | Status | Email | Audit |
|------|-------|--------|---------|--------|-------|-------|
| 1 | Manager+ | Activate action | workflow, document, monitor, reminders | →`active_monitoring` (or `expiring_soon`/`expired` if near/past renewal) | — | `contract.activated`, `contract_monitor.created` |
| 2 | System | — | Metadata synced from parsed fields | — | — | — |
| 3 | System | — | Renewal reminders scheduled (paid) | — | `contract_reminder.created` |

**Errors:** missing `renewal_date`; invalid date; no document version uploaded

**API:** `PATCH /api/contracts/[id]` action `activate`

Prior active monitor on same workflow completed if re-activating after amendment.

## 7. Upload amended version (renewal cycle)

| Step | Actor | Screen | Objects | Status | Audit |
|------|-------|--------|---------|--------|-------|
| 1 | Member+ | Upload new version | new `document_version` | →`review_needed` | `contract_document.version_created` |
| 2 | Manager+ | Update fields + re-activate | monitor, reminders rescheduled | →`active_monitoring` | `contract_monitor.completed`, `contract_monitor.created` |

Old monitor completed with `reason: superseded`. Pending reminders cancelled and rescheduled from new `renewal_date`.

## 8. Mark completed

| Step | Actor | Screen | Objects | Status | Audit |
|------|-------|--------|---------|--------|-------|
| 1 | Manager+ | Complete action | workflow, monitor | `completed` | `contract.completed`, `contract_monitor.completed` |

Use when contract terminated or migrated off-platform. Cancels pending reminders.

## 9. Cancel record

| Step | Actor | Screen | Objects | Status | Audit |
|------|-------|--------|---------|--------|-------|
| 1 | Admin+ | Cancel action | workflow, monitor | `cancelled` | `contract.cancelled` |

## 10. Renewal monitoring (subscription value)

Worker `contract-renewal-monitor` runs daily:

| Step | Actor | Action | Status transition | Audit |
|------|-------|--------|-------------------|-------|
| 1 | System | Evaluate `monitors` where `monitor_type = contract_renewal` | — | — |
| 2 | System | Update workflow + document status | → `expiring_soon` or `expired` | `contract_status.expiring_soon` or `contract_status.expired` |
| 3 | System | Send due renewal reminders | — | `contract_reminder.sent` |

Internal email: `internal_contract_renewal_reminder` to workflow owner.

## 11. Renewal reminders

| Window | Days before renewal | Template |
|--------|---------------------|----------|
| `renew_90d` | 90 | internal_contract_renewal_reminder |
| `renew_60d` | 60 | internal_contract_renewal_reminder |
| `renew_30d` | 30 | internal_contract_renewal_reminder |
| `renew_0d` | 0 | internal_contract_renewal_reminder |

Paid entitlement required. Free tier: monitor status updates still run; emails not scheduled.

## 12. Evidence export

Manager+ · CSV with fields, versions, reminders, audit · Audit: `contract_evidence.exported`

## 13. Billing limit reached

Block on create · upgrade modal · Audit: `billing.limit_reached` · PostHog `billing_limit_reached`

| Limit | Trigger |
|-------|---------|
| 4th active contract record | Contract create |

## 14. Free utility funnel

| Step | Actor | Screen | Outcome |
|------|-------|--------|---------|
| 1 | Anonymous / logged out | `/tools/contract-renewal-extractor` | Single-file field preview |
| 2 | — | CTA | Sign up → Contract Renewal Tracker paid workflow |

Utility does not create `workflow_instances` or monitors.
