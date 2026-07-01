# Contract Renewal Tracker — Existing Implementation Review

> Inspected: 2026-06-30 · Before completing vertical slice v4

---

## Existing contract-related routes

| Route | File | Status |
|-------|------|--------|
| `/app/apps/contracts` | `src/app/(app)/app/apps/[slug]/page.tsx` → `ContractsModulePage` | Implemented |
| `/app/workflows/[id]` | `WorkflowDetailView` (contract branch) | Implemented — no dedicated `/app/contracts/[id]` |
| `POST /api/contracts/requests` | `src/app/api/contracts/requests/route.ts` | Create contract |
| `POST /api/contracts/requests/[id]` | `src/app/api/contracts/requests/[id]/route.ts` | Upload, save_fields, activate, complete, export |
| `/tools/contract-renewal-extractor` | Referenced in `modules.ts` | **Not implemented** (free tool page) |

Docs reference `/api/contracts` and `/api/contracts/[id]` — actual paths use `/api/contracts/requests`.

---

## Existing database fields / tables

**No dedicated `contracts` table.** Data uses shared primitives:

| Table | Usage |
|-------|--------|
| `workflow_instances` | `type = 'contract_renewal'`; statuses: `draft`, `review_needed`, `active_monitoring`, `expiring_soon`, `expired`, `completed`, `cancelled` |
| `documents` | `document_type = 'contract'` |
| `document_versions` | Internal upload, storage path `organizations/{org}/contracts/{wf}/documents/...` |
| `document_parsed_fields` | Manual fields: `contract_name`, `counterparty`, `effective_date`, `renewal_date`, `termination_notice_days`, `auto_renewal`, `contract_value`, `notes` |
| `monitors` | `monitor_type = 'contract_renewal'`; `monitored_date` = renewal date |
| `reminders` | `type = contract_renewal_internal`; windows `renew_90d`, `renew_60d`, `renew_30d`, `renew_0d` only |
| `audit_logs` | Partial contract.* events |
| `evidence_exports` | Basic CSV export tracking |

**Migration:** `006_contract_renewal.sql` — monitor index only.

**Missing vs target spec:**
- `notice_period_days` / `latest_notice_date` not computed or stored in metadata
- No notice-deadline reminder pipeline (`contract_notice_internal`)
- Statuses `notice_window_open`, `renewal_approaching`, `auto_renew_risk`, `renewed`, `terminated`, `archived` not implemented
- `contract_type`, `start_date`, `end_date`, `renewal_term`, `currency`, `owner_id` reassignment incomplete

---

## Existing helpers / components

### `src/lib/contracts/`

| File | Purpose |
|------|---------|
| `constants.ts` | Types, field keys, renewal reminder windows (4 windows, no 14/7d) |
| `createContract.ts` | Draft workflow + document; owner = creator |
| `uploadContract.ts` | Internal upload; blocks upload when monitored |
| `saveFields.ts` | `document_parsed_fields` CRUD |
| `review.ts` | `activateContractMonitoring`, `completeContract` |
| `renewalMonitor.ts` | Monitor create, renewal reminders, daily worker logic |
| `exportEvidence.ts` | Basic CSV |

**Missing lib files:** `scheduleReminders.ts`, `lifecycle.ts`, `noticeDate.ts`, `assignOwner.ts`

### `src/components/contracts/`

| Component | Purpose |
|-----------|---------|
| `ContractsModulePage.tsx` | Module dashboard |
| `AddContractForm.tsx` | Create contract |
| `ContractUploadForm.tsx` | PDF upload |
| `ContractFieldsForm.tsx` | Manual field entry |
| `ContractWorkflowActions.tsx` | Activate, complete, export |

### Workers

Contract logic runs inside `workers/coi-expiration-monitor/index.ts` via `runContractRenewalMonitor()`. No standalone `workers/contract-renewal-monitor/`.

### Email

`src/lib/email/templates/contracts.ts` — single `internal_contract_renewal_reminder` template.

### Tests

`tests/contracts.test.ts` — 6 unit tests (constants, storage path, status, billing). No integration tests for full workflow.

### Seed

`supabase/seed/contracts_demo.sql` — 5 demo contracts; **not wired into main `seed.sql`**.

---

## What can be reused

- **Workflow model** — `workflow_instances.type = 'contract_renewal'` ✓
- **Document versioning** — `uploadContract.ts` storage + version pattern ✓
- **Parsed fields** — `saveFields.ts` pattern matches COI manual entry ✓
- **Monitor creation** — `createContractRenewalMonitor()` structure ✓
- **COI reminder patterns** — `cancelCoiReminders`, idempotent scheduling from `src/lib/coi/scheduleReminders.ts`
- **Module page shell** — `ContractsModulePage` layout matches COI/W-9 ✓
- **Workflow detail integration** — `WorkflowDetailView` contract branch ✓
- **Billing** — `contract_active_records` in `checkUsageLimit.ts` ✓
- **Audit helper** — `createAuditLog()` ✓
- **API action pattern** — POST with `action` switch (COI parity) ✓

---

## What needs to be added

1. **Notice date computation** — `latest_notice_date = renewal_date − notice_period_days`; store in metadata + monitor config
2. **Dual reminder pipelines** — notice windows (90/60/30/14/7/0) + renewal windows (90/60/30/14/7/0)
3. **Expanded status model** — `notice_window_open`, `renewal_approaching`, `auto_renew_risk`, `renewed`, `terminated`, `archived`
4. **Lifecycle actions** — mark renewed (requires new renewal date), terminated, archived, cancel
5. **`cancelContractReminders()`** — on complete/terminate/archive/cancel; reschedule on date change
6. **Owner assignment** — API + UI to reassign `owner_id`
7. **Additional fields** — `contract_type`, `start_date`, `end_date`, `renewal_term`, `currency`
8. **Enhanced evidence export** — reminders, monitor history, notice deadline, owner
9. **Email templates** — notice deadline, auto-renew risk, expired, owner assigned
10. **Expanded tests** — notice date calc, status transitions, reminder idempotency, tenant isolation
11. **Demo seed** — user-specified contracts (Northline, Harbor, Bright Oak, Clearpath)
12. **Free tier** — align to 3 active contracts per user spec

---

## What must not be duplicated

- **No `contracts` table** — use `workflow_instances.metadata` + `document_parsed_fields`
- **No custom reminder sender** — use shared `reminders` + `notifications` + worker
- **No separate audit system** — use `createAuditLog()`
- **No hardcoded module nav** — read from `src/lib/modules/modules.ts`
- **No external participant flow** — internal-only for MVP
- **No AI/OCR extraction pipeline** — manual entry only

---

## Risks to W-9 and COI flows

| Risk | Mitigation |
|------|------------|
| Shared worker regression | Keep COI `runCoiExpirationMonitor()` unchanged; contract logic in separate exported functions; run existing COI tests |
| Monitor type collision | Contract uses `monitor_type = 'contract_renewal'` — distinct from `coi_expiration` |
| Reminder type collision | Use `contract_renewal_internal` and `contract_notice_internal` — distinct from `coi_*` types |
| Workflow type collision | `contract_renewal` vs `w9_collection` / `coi_tracking` — no overlap |
| Billing limit key collision | `contract_active_records` separate from `coi_active_records` |
| Storage path | Contract uses `contracts/` segment — W-9/COI use vendor paths; no conflict |
| `WorkflowDetailView` changes | Contract branch is isolated (`isContract`); W-9/COI branches untouched |
| Status badge additions | Add new statuses to `src/lib/statuses/index.ts` without removing COI/W-9 mappings |

---

## Implementation decision

Extend existing `src/lib/contracts/*` and shared primitives. Do not rebuild from scratch. Align statuses and fields to MVP spec while preserving backward compatibility for existing `active_monitoring` / `expiring_soon` rows via status normalization in the monitor worker.
