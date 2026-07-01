# W-9 Collection — User Flows

## 1. First user signup

| Step | Actor | Screen | Objects | Status | Email | Audit | Errors |
|------|-------|--------|---------|--------|-------|-------|--------|
| 1 | User | `/signup` | auth user | — | confirm | — | email taken |
| 2 | User | `/onboarding` | organization, member | — | — | `organization.created` | — |

## 2. Create vendor

| Step | Actor | Screen | Objects | Status | Audit |
|------|-------|--------|---------|--------|-------|
| 1 | Member+ | `/vendors` → Add | `vendors` row | `active` | `vendor.created` |
| 2 | — | Vendor list | — | — | PostHog `vendor_created` |

**Errors:** missing name; billing limit (6th vendor on free)

## 3. Request W-9

| Step | Actor | Screen | Objects | Status | Email | Audit |
|------|-------|--------|---------|--------|-------|-------|
| 1 | Member+ | Modal/page | `workflow_instances`, `documents`, `tasks`, `magic_links`, `reminders` | `draft`→`sent` | vendor-w9-request | `w9_request.created`, `w9_request.sent`, `magic_link.created` |
| 2 | — | Success toast | — | — | — | `email.sent` |

**Errors:** no vendor email; active request exists; billing limit

## 4. Vendor receives email

Trigger: `sendW9RequestEmail` · Recipient: vendor email · CTA: magic link URL

## 5. Vendor opens magic link

| Step | Actor | Screen | Objects | Status | Audit |
|------|-------|--------|---------|--------|-------|
| 1 | External | `/external/w9/[token]` | workflow | `opened` | `magic_link.opened` |

**Errors:** expired, revoked, completed → recovery UI

## 6. Vendor uploads W-9

| Step | Actor | Screen | Objects | Status | Email | Audit |
|------|-------|--------|---------|--------|-------|-------|
| 1 | External | Upload form | `document_versions`, storage | `submitted` | internal-submission-received | `document.uploaded`, `magic_link.used` |
| 2 | External | `/complete` | — | — | — | — |

**Errors:** wrong MIME, >10MB, invalid token

## 7. Internal review

| Step | Actor | Screen | Objects | Status | Audit |
|------|-------|--------|---------|--------|-------|
| 1 | Manager+ | `/workflows/[id]` | — | `review_needed` | `document.review_started` |

## 8. Approve

| Step | Actor | Screen | Objects | Status | Audit |
|------|-------|--------|---------|--------|-------|
| 1 | Manager+ | Review panel | workflow, document | `approved`→`completed` | `document.approved` |

## 9. Reject / correction

| Step | Actor | Screen | Objects | Status | Email | Audit |
|------|-------|--------|---------|--------|-------|-------|
| 1 | Manager+ | Reject modal (reason required) | workflow, new magic link | `needs_correction` | vendor-w9-correction | `document.rejected`, `correction.requested` |

## 10. Resend link

Manual resend: max 1/24h (Member); unlimited Admin/Owner · Audit: `w9_request.sent`

## 11. Revoke link

Status `revoked` immediately · Audit: `magic_link.revoked`

## 12. Reminder sent

Worker finds `reminders` due · sends email · marks `sent` · Audit: `reminder.sent`

## 13. Evidence export

Manager+ · CSV + signed doc URLs · Audit: `evidence.exported`

## 14. Billing limit reached

Block action · upgrade modal · Audit: `billing.limit_reached` · PostHog event
