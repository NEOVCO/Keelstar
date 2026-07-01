# Contract Renewal Tracker — Reminders

## Dual pipelines

### Notice deadline reminders

Anchor: `latest_notice_date` (= `renewal_date − notice_period_days`)

| Window | Days before notice date | Type |
|--------|-------------------------|------|
| `notice_90d` | 90 | `contract_notice_internal` |
| `notice_60d` | 60 | `contract_notice_internal` |
| `notice_30d` | 30 | `contract_notice_internal` |
| `notice_14d` | 14 | `contract_notice_internal` |
| `notice_7d` | 7 | `contract_notice_internal` |
| `notice_0d` | 0 | `contract_notice_internal` |

### Renewal date reminders

Anchor: `renewal_date`

| Window | Days before renewal | Type |
|--------|---------------------|------|
| `renew_90d` | 90 | `contract_renewal_internal` |
| `renew_60d` | 60 | `contract_renewal_internal` |
| `renew_30d` | 30 | `contract_renewal_internal` |
| `renew_14d` | 14 | `contract_renewal_internal` |
| `renew_7d` | 7 | `contract_renewal_internal` |
| `renew_0d` | 0 | `contract_renewal_internal` |

## Rules

- Only schedule future reminders (`scheduled_at > now`)
- Idempotent: skip if same `workflow + type + window` exists
- Recipient: workflow `owner_id` email; fallback to `created_by`
- Paid entitlement required to schedule (`contract_renewal`)
- Cancel all pending on: renewed, terminated, archived, cancelled
- Reschedule on renewal date or notice period change
- Sent at 09:00 server time on target date
- Every send audited; monitor runs audited as `monitor.run`

## Implementation

- `src/lib/contracts/scheduleReminders.ts` — `scheduleContractReminders`, `cancelContractReminders`, `rescheduleContractReminders`
- `src/lib/contracts/renewalMonitor.ts` — `runContractRenewalMonitor()` sends due reminders
- Worker: `workers/coi-expiration-monitor/index.ts` (runs COI + contract daily)
