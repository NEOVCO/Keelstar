# COI Tracker — Email Templates

Tone: professional, plain, trustworthy, concise. No marketing fluff.

Implementation: `src/lib/email/templates/coi.ts` via Resend.

---

## vendor_coi_request

| Field | Value |
|-------|-------|
| **Trigger** | COI request sent (`sendCoiRequestEmail`) |
| **Recipient** | Vendor email (`metadata.recipient_email` or `vendors.email`) |
| **Subject** | `[Organization] requests your certificate of insurance` |
| **Body** | `[Organization] needs your certificate of insurance for their records. Due date: [due_date]. [optional message]` |
| **CTA** | Upload certificate securely → `[magic_link_url]` |
| **Variables** | `organizationName`, `vendorName`, `dueDate`, `message`, `magicLinkUrl`, `requesterName` |
| **Audit** | `email.sent` |

---

## vendor_coi_reminder

| Field | Value |
|-------|-------|
| **Trigger** | `reminder-sender` worker, `coi_reminder` type |
| **Recipient** | Vendor email |
| **Windows** | `before_7d`, `on_due` |
| **Subject** | `Reminder: [Organization] still needs your certificate of insurance` |
| **CTA** | Upload certificate → `[magic_link_url]` |
| **Audit** | `coi_reminder.sent`, `email.sent` |

---

## vendor_coi_overdue

| Field | Value |
|-------|-------|
| **Trigger** | `reminder-sender` worker, `coi_overdue` type |
| **Window** | `after_7d` |
| **Subject** | `Overdue: COI request from [Organization]` |
| **CTA** | Upload certificate → `[magic_link_url]` |
| **Audit** | `coi_reminder.sent`, `email.sent` |

---

## vendor_coi_correction

| Field | Value |
|-------|-------|
| **Trigger** | Reject / request correction (`sendCoiCorrectionEmail`) |
| **Subject** | `[Organization] requests an updated certificate of insurance` |
| **Body** | Includes `[rejection_reason]` |
| **CTA** | Upload updated certificate → `[magic_link_url]` |
| **Audit** | `coi_correction.requested`, `email.sent` |

---

## internal_coi_submission_received

| Field | Value |
|-------|-------|
| **Trigger** | External upload complete (`uploadExternalCoi`) |
| **Recipient** | Workflow owner |
| **Subject** | `[Vendor] submitted a COI for review` |
| **CTA** | Review submission → `[workflow_url]` |
| **Audit** | `email.sent` |

---

## internal_coi_expiration_reminder

| Field | Value |
|-------|-------|
| **Trigger** | `coi-expiration-monitor` worker, `coi_expiration_internal` reminders |
| **Recipient** | Workflow owner (internal) |
| **Windows** | `exp_30d`, `exp_14d`, `exp_7d`, `exp_0d`, `exp_post_7d` |
| **Subject** | `COI expiring soon for [Vendor]` |
| **Body** | Expiration date and link to workflow detail |
| **CTA** | View COI → `[workflow_url]` |
| **Audit** | `coi_reminder.sent`, `email.sent` |

**Note:** v1 sends expiration reminders to internal owner only. Vendor is not emailed on expiration.

---

## vendor_coi_renewal_request (template only — not wired in v1)

| Field | Value |
|-------|-------|
| **Trigger** | Future: proactive renewal before expiration |
| **Recipient** | Vendor email |
| **Subject** | `[Organization] requests an updated certificate of insurance` |
| **Body** | Current expiration date, renewal CTA |
| **CTA** | Upload updated certificate → `[magic_link_url]` |
| **Status** | Defined in `coi.ts`; not invoked in v1 implementation |

---

## Scheduling prerequisites

| Reminder category | Requires paid `coi_tracker` entitlement |
|-------------------|----------------------------------------|
| Request reminders (`coi_reminder`, `coi_overdue`) | Yes |
| Expiration reminders (`coi_expiration_internal`) | Yes |

Free tier users can send initial request email manually but do not get automated reminder scheduling.

---

**Rules:** Never attach document contents. Log all sends to `email_events`. Log failures to Sentry. Magic link URL resolved via `resolveCoiMagicLinkUrl()` in reminder worker.
