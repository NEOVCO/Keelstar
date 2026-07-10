# Policy Acknowledgement — Implementation Plan

> Phased build order. Mirrors COI / W-9 collection patterns with internal upload + external acknowledgement.

| Phase | Deliverable | Status |
|-------|-------------|--------|
| 1 | Module documentation (this folder) | ✅ |
| 2 | Migration `012_policy_acknowledgement.sql` — index only | ✅ |
| 3 | Constants (`src/lib/policies/constants.ts`) | ✅ |
| 4 | Request creation (`createRequest.ts`) | ✅ |
| 5 | Internal policy upload (`uploadPolicy.ts`) | ✅ |
| 6 | Send request + magic link (`sendRequest.ts`, `magicLinkUrl.ts`) | ✅ |
| 7 | External acknowledgement (`acknowledgeExternal.ts`, `/external/policy/[token]`) | ✅ |
| 8 | API routes | ✅ |
| 9 | Request reminders (`scheduleReminders.ts` + `reminder-sender`) | ✅ |
| 10 | Resend / revoke (`resendRevoke.ts`) | ✅ |
| 11 | Evidence export (`exportEvidence.ts`) | ✅ |
| 12 | Email templates | ✅ |
| 13 | Billing limits | ✅ |
| 14 | UI: `PolicyModulePage`, `RequestPolicyForm`, workflow actions | ✅ |
| 15 | Wire module registry + workflow detail | ✅ |
| 16 | Tests | Partial |

## Key architectural decisions

| Decision | Rationale |
|----------|-----------|
| No `policy_acknowledgements` table | Shared `documents` + `document_parsed_fields` + workflow metadata |
| Internal policy upload | Policy is org-authored; employee only acknowledges |
| Auto-complete on ack | No review gate in MVP — acknowledgement is the proof |
| People roster via `vendors` | Reuses workforce records from People module |
| `maxUses: 1` on magic link | Acknowledgement is one-time |
| Reminders only (no monitor worker) | Overdue tracked via workflow status + reminder pipeline |

## File map

```
src/lib/policies/
  constants.ts
  createRequest.ts
  uploadPolicy.ts
  sendRequest.ts
  acknowledgeExternal.ts
  scheduleReminders.ts
  resendRevoke.ts
  exportEvidence.ts
  magicLinkUrl.ts

src/app/api/policies/requests/route.ts
src/app/api/policies/requests/[id]/route.ts
src/app/api/external/policy/acknowledge/route.ts
src/app/external/policy/[token]/page.tsx

workers/reminder-sender/index.ts  — policy_reminder, policy_overdue
supabase/migrations/012_policy_acknowledgement.sql
```
