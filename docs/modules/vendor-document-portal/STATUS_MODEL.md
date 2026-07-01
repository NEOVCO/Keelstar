# W-9 Collection — Status Model

## Vendor (`vendors.status`)

| Status | Meaning | Set by | Audit |
|--------|---------|--------|-------|
| `active` | Normal vendor | create | `vendor.created` |
| `inactive` | Paused, no new requests | Admin+ | `vendor.updated` |
| `archived` | Hidden from default list | Admin+ | `vendor.archived` |

## W-9 Request (`workflow_instances.status`)

| Status | UI badge | Trigger | Next action | Notification | Audit |
|--------|----------|---------|-------------|--------------|-------|
| `draft` | draft | Create request | Send | — | `w9_request.created` |
| `sent` | waiting_external | Email sent | Vendor opens link | vendor-w9-request | `w9_request.sent` |
| `opened` | waiting_external | Magic link opened | Vendor uploads | — | `magic_link.opened` |
| `submitted` | review_needed | Upload complete | Internal review | internal-submission-received | `document.uploaded` |
| `review_needed` | review_needed | Alias of submitted | Review | — | `document.review_started` |
| `approved` | approved | Manager+ approves | Complete | optional | `document.approved` |
| `rejected` | rejected | Manager+ rejects | Correction flow | vendor-w9-correction | `document.rejected` |
| `needs_correction` | waiting_external | Rejection w/ resend | Vendor re-uploads | vendor-w9-correction | `correction.requested` |
| `completed` | completed | Finalized | — | — | `w9_request.completed` |
| `cancelled` | cancelled | Admin+ cancel | — | — | `w9_request.cancelled` |
| `overdue` | overdue | Past due, not submitted | Reminder | vendor-w9-overdue | `reminder.sent` |

## Document (`documents.status` for type w9)

| Status | Meaning |
|--------|---------|
| `pending` | Request created, no file |
| `uploaded` | Version exists |
| `review_needed` | Awaiting approval |
| `approved` | Approved |
| `rejected` | Rejected |
| `archived` | Superseded |

## Magic link (`magic_links.status`)

| Status | Meaning |
|--------|---------|
| `active` | Valid for upload |
| `used` | Submission consumed link |
| `expired` | Past expires_at |
| `revoked` | Manually revoked |
| `completed` | Request finished |

## Reminder (`reminders.status`)

| Status | Meaning |
|--------|---------|
| `scheduled` | Pending send |
| `sent` | Email delivered |
| `cancelled` | Request completed/cancelled |
| `failed` | Send failed |
