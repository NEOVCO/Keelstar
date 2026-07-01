# W-9 Collection — Email Templates

Tone: professional, plain, trustworthy, concise. No marketing fluff.

Implementation: `src/lib/email/templates/*.ts` via Resend.

---

## vendor-w9-request

| Field | Value |
|-------|-------|
| **Trigger** | W-9 request sent |
| **Recipient** | Vendor email |
| **Subject** | `[Organization] requests your W-9 form` |
| **Body** | `[Organization] needs your completed W-9 for their records. Due date: [due_date]. [optional message]` |
| **CTA** | Upload W-9 securely → `[magic_link_url]` |
| **Variables** | `organizationName`, `vendorName`, `dueDate`, `message`, `magicLinkUrl`, `requesterName` |
| **Audit** | `email.sent` |

---

## vendor-w9-reminder

| Field | Value |
|-------|-------|
| **Trigger** | Reminder worker, 7 days before due |
| **Recipient** | Vendor email |
| **Subject** | `Reminder: [Organization] still needs your W-9 form` |
| **CTA** | Upload W-9 → `[magic_link_url]` |
| **Audit** | `reminder.sent`, `email.sent` |

---

## vendor-w9-overdue

| Field | Value |
|-------|-------|
| **Trigger** | Reminder worker, 7 days after due |
| **Subject** | `Overdue: W-9 request from [Organization]` |
| **CTA** | Upload W-9 → `[magic_link_url]` |
| **Audit** | `reminder.sent`, `email.sent` |

---

## vendor-w9-correction

| Field | Value |
|-------|-------|
| **Trigger** | Reject / request correction |
| **Subject** | `[Organization] requests an updated W-9 form` |
| **Body** | Includes `[rejection_reason]` |
| **CTA** | Upload updated W-9 → `[magic_link_url]` |
| **Audit** | `correction.requested`, `email.sent` |

---

## internal-submission-received

| Field | Value |
|-------|-------|
| **Trigger** | External upload complete |
| **Recipient** | Request owner / org admins |
| **Subject** | `[Vendor] submitted a W-9 for review` |
| **CTA** | Review submission → `[workflow_url]` |
| **Audit** | `email.sent` |

---

## request-approved (optional v1)

| Field | Value |
|-------|-------|
| **Trigger** | W-9 approved |
| **Recipient** | Vendor (optional) |
| **Subject** | `Your W-9 was received by [Organization]` |
| **Audit** | `email.sent` |

---

## member-invitation

| Field | Value |
|-------|-------|
| **Trigger** | Member invite |
| **Subject** | `[Name] invited you to join [Organization] on Keelstar` |
| **CTA** | Accept invitation → `[invite_url]` |
| **Audit** | `member.invited`, `email.sent` |

---

**Rules:** Never attach document contents. Log all sends to `email_events`. Log failures to Sentry.
