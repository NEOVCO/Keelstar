# Contract Renewal Tracker — Email Templates

Tone: professional, plain, actionable. Internal-only in v1 — no vendor or counterparty emails.

Implementation: `src/lib/email/templates/contracts.ts` via Resend.

---

## internal_contract_renewal_reminder

| Field | Value |
|-------|-------|
| **Trigger** | `contract-renewal-monitor` worker, `contract_renewal_internal` reminders |
| **Recipient** | Workflow owner (`owner_id` email) |
| **Windows** | `renew_90d`, `renew_60d`, `renew_30d`, `renew_0d` |
| **Subject (90/60/30d)** | `Contract renewal approaching: [contract_name]` |
| **Subject (0d)** | `Contract renewal today: [contract_name]` |
| **Body** | Contract name, counterparty, renewal date, notice deadline (if `termination_notice_days` set), auto-renewal flag, days remaining |
| **CTA** | View contract → `[workflow_url]` |
| **Variables** | `organizationName`, `contractName`, `counterparty`, `renewalDate`, `noticeDeadline`, `terminationNoticeDays`, `autoRenewal`, `daysRemaining`, `reminderWindow`, `workflowUrl` |
| **Audit** | `contract_reminder.sent`, `email.sent` |

### Window-specific copy hints

| Window | Lead line |
|--------|-----------|
| `renew_90d` | "This contract renews in 90 days." |
| `renew_60d` | "This contract renews in 60 days." |
| `renew_30d` | "This contract renews in 30 days." |
| `renew_0d` | "This contract renews today." |

When `auto_renewal` is true and `notice_deadline` is in the past, body includes: "Notice period may have passed — review immediately."

---

## internal_contract_submission_received (optional v1)

Not required — there is no external submission. If wired for team uploads by another member:

| Field | Value |
|-------|-------|
| **Trigger** | Member uploads file on record owned by someone else (future) |
| **Recipient** | Workflow owner |
| **Subject** | `[User] uploaded a contract for [contract_name]` |
| **CTA** | Review contract → `[workflow_url]` |

**Status:** Optional; not in MVP unless multi-user upload notification is implemented.

---

## Scheduling prerequisites

| Reminder category | Requires paid `contract_renewal` entitlement |
|-------------------|---------------------------------------------|
| Renewal reminders (`contract_renewal_internal`) | Yes |

Free tier: monitoring status transitions still run; reminder rows are not inserted.

---

## Rules

- Never attach contract PDF to email
- Log all sends to `email_events`
- Log failures to Sentry
- No magic link URLs — CTA is authenticated app deep link only
- Do not email counterparty or vendor contact in v1
