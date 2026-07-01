# COI Tracker — Implementation Plan

> Phased build order. Second reference vertical slice — mirrors W-9 Collection patterns.

| Phase | Deliverable | Status |
|-------|-------------|--------|
| 1 | Module documentation (this folder) | ✅ |
| 2 | Migration `005_coi_tracker.sql` — status constraints, monitor columns | ✅ |
| 3 | Constants + field definitions (`src/lib/coi/constants.ts`) | ✅ |
| 4 | COI request creation (`createRequest.ts`) | ✅ |
| 5 | Send request + magic link (`sendRequest.ts`, `magicLinkUrl.ts`) | ✅ |
| 6 | External upload (`uploadExternal.ts`, `/external/coi/[token]`) | ✅ |
| 7 | API routes (`/api/coi/requests`, `/api/external/coi/upload`) | ✅ |
| 8 | Manual field save (`saveFields.ts`, `CoiFieldsForm`) | ✅ |
| 9 | Review flow (`review.ts`, `requestCorrection.ts`) | ✅ |
| 10 | Expiration monitor (`expirationMonitor.ts`) | ✅ |
| 11 | Request reminders (`scheduleReminders.ts` + `reminder-sender` worker) | ✅ |
| 12 | Expiration reminders (in `expirationMonitor.ts` + `coi-expiration-monitor` worker) | ✅ |
| 13 | Email templates (`src/lib/email/templates/coi.ts`) | ✅ |
| 14 | Resend / revoke (`resendRevoke.ts`) | ✅ |
| 15 | Evidence export (`exportEvidence.ts`) | ✅ |
| 16 | Billing limits (`coi_active_records`, `coi_requests`) | ✅ |
| 17 | UI: `CoiModulePage`, `RequestCoiForm`, review actions | ✅ |
| 18 | Module registry (`src/lib/modules/modules.ts`) | ✅ |
| 19 | Tests | Partial |
| 20 | Launch checklist ([QA_CHECKLIST.md](./QA_CHECKLIST.md)) | Pending manual QA |

## Dependencies

- **W-9 / Vendor Document Portal** — `vendors` table, shared workflow patterns, magic link infrastructure
- Platform foundation: auth, org context, RBAC, audit, Supabase clients
- Resend for email (graceful no-op if key missing in dev)

## Key architectural decisions

| Decision | Rationale |
|----------|-----------|
| No `coi_certificates` table | Shared `documents` + `document_parsed_fields` sufficient for v1 |
| Manual extraction only | OCR/AI deferred; fields entered by reviewer |
| Two workers | Request reminders share `reminder-sender` with W-9; expiration logic isolated in `coi-expiration-monitor` |
| Internal-only expiration emails | Reduces vendor email fatigue in v1; `vendor_coi_renewal_request` reserved for v2 |
| Monitoring statuses on workflow | `active_monitoring`, `expiring_soon`, `expired` extend W-9 status model |
| 30-day expiring soon window | `COI_EXPIRING_SOON_DAYS = 30` — aligns with playbook defaults |

## File map

```
src/lib/coi/
  constants.ts          — types, field keys, reminder windows
  createRequest.ts      — draft workflow + document + task
  sendRequest.ts        — magic link + email + schedule request reminders
  uploadExternal.ts     — external upload + storage
  saveFields.ts         — document_parsed_fields CRUD
  review.ts             — approve (creates monitor) / reject
  requestCorrection.ts  — correction email
  expirationMonitor.ts  — monitor CRUD + daily runner
  scheduleReminders.ts  — request reminder scheduling
  resendRevoke.ts       — resend rate limit + revoke
  exportEvidence.ts     — CSV export
  magicLinkUrl.ts       — URL builders

src/app/api/coi/requests/route.ts
src/app/api/coi/requests/[id]/route.ts
src/app/api/external/coi/upload/route.ts
src/app/external/coi/[token]/page.tsx

workers/reminder-sender/index.ts      — coi_reminder, coi_overdue
workers/coi-expiration-monitor/index.ts

supabase/migrations/005_coi_tracker.sql
```

## Reference pattern

Every future module copies:

**docs folder → migration (extend shared tables only) → lib domain → API → UI → worker(s) → tests → seed**

COI Tracker validates that the pattern scales to **monitoring-centric** modules (not just collection workflows).

## Post-MVP backlog

- [ ] Wire `vendor_coi_renewal_request` for proactive vendor renewal emails
- [ ] `coi_requirements` for per-vendor coverage rules
- [ ] OCR/AI extraction of ACORD 25 fields
- [ ] COI-specific seed data (`supabase/seed/coi_demo.sql`)
- [ ] E2E tests for full collect → monitor flow
- [ ] ZIP evidence export
