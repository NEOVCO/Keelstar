# Contract Renewal Tracker — Implementation Plan

> Phased build order. Third reference vertical slice — obligation monitoring with dual reminder pipelines.

| Phase | Deliverable | Status |
|-------|-------------|--------|
| 1 | Module documentation (this folder) | ✅ |
| 2 | `EXISTING_IMPLEMENTATION_REVIEW.md` | ✅ |
| 3 | Migration `006_contract_renewal.sql` — monitor index | ✅ |
| 4 | Constants + notice date utilities | ✅ |
| 5 | Contract record creation (`createContract.ts`) | ✅ |
| 6 | Internal upload (`uploadContract.ts`) | ✅ |
| 7 | API routes (`/api/contracts/requests`) | ✅ |
| 8 | Manual field save + notice date (`saveFields.ts`) | ✅ |
| 9 | Activate monitoring (`review.ts`) | ✅ |
| 10 | Dual reminder scheduling (`scheduleReminders.ts`) | ✅ |
| 11 | Renewal monitor worker (`renewalMonitor.ts` in coi-expiration-monitor) | ✅ |
| 12 | Lifecycle (`lifecycle.ts`) — renewed/terminated/archived/cancel | ✅ |
| 13 | Owner assignment (`assignOwner.ts`) | ✅ |
| 14 | Email templates (`contracts.ts`) | ✅ |
| 15 | Evidence export (`exportEvidence.ts`) | ✅ |
| 16 | Billing limits (`contract_active_records` = 3 free) | ✅ |
| 17 | UI: `ContractsModulePage`, forms, actions | ✅ |
| 18 | Module registry (`src/lib/modules/modules.ts`) | ✅ |
| 19 | Tests (`tests/contracts.test.ts`) | ✅ |
| 20 | Demo seed (`contracts_demo.sql`) | ✅ |
| 21 | Launch checklist ([QA_CHECKLIST.md](./QA_CHECKLIST.md)) | Pending manual QA |

## Post-MVP backlog

- [ ] Dedicated `/app/contracts/[id]` route (currently `/app/workflows/[id]`)
- [ ] Standalone `workers/contract-renewal-monitor/` process
- [ ] Free tool `/tools/contract-renewal-extractor`
- [ ] Owner picker UI on detail page
- [ ] Vendor picker on create form
- [ ] ZIP evidence export with signed document URLs
- [ ] OCR/AI extraction of renewal clauses
- [ ] Wire `contracts_demo.sql` into main `seed.sql`
