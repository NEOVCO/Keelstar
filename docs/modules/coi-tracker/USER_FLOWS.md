# COI Tracker — User Flows

## 1. First user signup

Same as platform onboarding. See [vendor-document-portal/USER_FLOWS.md](../vendor-document-portal/USER_FLOWS.md#1-first-user-signup).

## 2. Select or create vendor

| Step | Actor | Screen | Objects | Status | Audit |
|------|-------|--------|---------|--------|-------|
| 1 | Member+ | `/app/vendors` or request form | `vendors` row (existing or new) | `active` | `vendor.created` (if new) |

**Errors:** missing vendor email (required for send); billing limit on active COI records

## 3. Create COI request

| Step | Actor | Screen | Objects | Status | Audit |
|------|-------|--------|---------|--------|-------|
| 1 | Member+ | `RequestCoiForm` / `/app/apps/coi` | `workflow_instances`, `documents`, `tasks` | `draft` | `coi_request.created` |
| 2 | — | — | Usage check `coi_active_records` | — | — |

**Errors:** active request exists for vendor (unless `replaceExisting`); 4th active record on free tier

**API:** `POST /api/coi/requests`

## 4. Send COI request

| Step | Actor | Screen | Objects | Status | Email | Audit |
|------|-------|--------|---------|--------|-------|-------|
| 1 | Member+ | Send action | `magic_links`, `external_participants`, `reminders` | `draft`→`sent` | vendor_coi_request | `coi_request.sent`, `coi_magic_link.created` |
| 2 | — | — | `usage_tracking.coi_requests` incremented | — | — | — |

**Errors:** no recipient email; billing limit (4th request this month on free)

## 5. Vendor receives email

Trigger: `sendCoiRequestEmail` · Recipient: vendor email · CTA: `/external/coi/[token]`

## 6. Vendor opens magic link

| Step | Actor | Screen | Objects | Status | Audit |
|------|-------|--------|---------|--------|-------|
| 1 | External | `/external/coi/[token]` | workflow | `opened` (optional) | `coi_magic_link.opened` |

**Errors:** expired, revoked, completed → recovery UI with org contact message

## 7. Vendor uploads COI

| Step | Actor | Screen | Objects | Status | Email | Audit |
|------|-------|--------|---------|--------|-------|-------|
| 1 | External | `CoiUploadForm` | `document_versions`, storage | `review_needed` | internal_coi_submission_received | `coi_document.uploaded`, `coi_document.version_created`, `coi_magic_link.used` |
| 2 | External | Completion state | `tasks` completed | — | — | — |

**API:** `POST /api/external/coi/upload`

**Errors:** wrong MIME (PDF/PNG/JPEG only); >10MB; invalid/expired token; workflow already completed

## 8. Internal field entry

| Step | Actor | Screen | Objects | Status | Audit |
|------|-------|--------|---------|--------|-------|
| 1 | Manager+ | `CoiFieldsForm` on workflow detail | `document_parsed_fields` | — | `coi_fields.updated` |

Required before approval: `insured_name`, `policy_type`, `expiration_date`

v1 extraction is manual — reviewer reads PDF and enters fields.

## 9. Internal review

| Step | Actor | Screen | Objects | Status | Audit |
|------|-------|--------|---------|--------|-------|
| 1 | Manager+ | `/app/workflows/[id]` | — | `review_needed` | — |

Side-by-side: uploaded COI PDF + parsed fields form.

## 10. Approve COI

| Step | Actor | Screen | Objects | Status | Email | Audit |
|------|-------|--------|---------|--------|-------|-------|
| 1 | Manager+ | Approve action | workflow, document, monitor, reminders | →`active_monitoring` (or `expiring_soon`/`expired` if near/past expiry) | — | `coi_document.approved`, `coi_monitor.created` |
| 2 | System | — | Prior vendor monitors completed | `completed` on old | `coi_monitor.completed` |
| 3 | System | — | Expiration reminders scheduled (paid) | — | `coi_reminder.created` |

**Errors:** missing required fields; invalid expiration date

## 11. Reject / request correction

| Step | Actor | Screen | Objects | Status | Email | Audit |
|------|-------|--------|---------|--------|-------|-------|
| 1 | Manager+ | Reject modal (reason required) | workflow, document, new magic link | `needs_correction` | vendor_coi_correction | `coi_document.rejected`, `coi_correction.requested` |

Optional `resendLink: true` creates new magic link and emails vendor.

## 12. Resend link

Manual resend via `resendCoiRequest()`:

- Max 1/24h (Member/Manager); unlimited Admin/Owner
- Creates new magic link if needed
- Audit: `coi_request.sent`

## 13. Revoke link

`revokeCoiMagicLink()` · Status `revoked` immediately · Audit: `coi_magic_link.revoked`

## 14. Request reminders (collection phase)

Worker `reminder-sender` processes `coi_reminder` and `coi_overdue` types:

| Window | Template |
|--------|----------|
| `before_7d` | vendor_coi_reminder |
| `on_due` | vendor_coi_reminder |
| `after_7d` | vendor_coi_overdue |

Cancelled when workflow reaches terminal status. Paid entitlement required to schedule.

## 15. Expiration monitoring (subscription value)

Worker `coi-expiration-monitor` runs daily:

| Step | Actor | Action | Status transition | Audit |
|------|-------|--------|-------------------|-------|
| 1 | System | Evaluate `monitors` where `monitor_type = coi_expiration` | — | `coi_monitor.run` (implicit via status update) |
| 2 | System | Update workflow + document status | → `expiring_soon` or `expired` | `coi_status.expiring_soon` or `coi_status.expired` |
| 3 | System | Send due expiration reminders | — | `coi_reminder.sent` |

Internal email: `internal_coi_expiration_reminder` to workflow owner.

## 16. Renewal (future / manual v1)

When COI expires, internal user creates new COI request for same vendor. Approving new COI completes prior monitor (`replacement_approved`).

Template `vendor_coi_renewal_request` exists for future vendor-facing renewal emails.

## 17. Evidence export

Manager+ · CSV with fields, versions, reminders, audit · Audit: `coi_evidence.exported`

## 18. Billing limit reached

Block on create or send · upgrade modal · Audit: `billing.limit_reached` · PostHog `billing_limit_reached`

| Limit | Trigger |
|-------|---------|
| 4th active COI record | Request create |
| 4th request this month | Request send |
