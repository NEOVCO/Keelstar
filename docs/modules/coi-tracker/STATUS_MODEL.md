# COI Tracker — Status Model

## Vendor (`vendors.status`)

Shared with W-9 module. See [vendor-document-portal/STATUS_MODEL.md](../vendor-document-portal/STATUS_MODEL.md).

| Status | Meaning |
|--------|---------|
| `active` | Normal vendor |
| `inactive` | Paused |
| `archived` | Hidden from default list |

---

## COI Request (`workflow_instances.status`)

### Collection phase

| Status | UI badge | Trigger | Next action | Notification | Audit |
|--------|----------|---------|-------------|--------------|-------|
| `draft` | draft | Create request | Send | — | `coi_request.created` |
| `sent` | waiting_external | Email sent | Vendor opens link | vendor_coi_request | `coi_request.sent`, `coi_magic_link.created` |
| `opened` | waiting_external | Magic link opened | Vendor uploads | — | `coi_magic_link.opened` |
| `submitted` | review_needed | Upload complete (alias) | Internal review | internal_coi_submission_received | `coi_document.uploaded` |
| `review_needed` | review_needed | Upload complete | Enter fields, review | internal_coi_submission_received | `coi_document.uploaded` |
| `rejected` | rejected | Manager rejects (transient) | Correction flow | — | `coi_document.rejected` |
| `needs_correction` | waiting_external | Rejection w/ resend | Vendor re-uploads | vendor_coi_correction | `coi_correction.requested` |
| `overdue` | overdue | Past due, not submitted | Reminder | vendor_coi_overdue | `coi_reminder.sent` |
| `cancelled` | cancelled | Admin+ cancel | — | — | `coi_request.cancelled` |

### Monitoring phase (post-approval)

| Status | UI badge | Trigger | Next action | Notification | Audit |
|--------|----------|---------|-------------|--------------|-------|
| `approved` | approved | Brief transition on approve | Monitor created | — | `coi_document.approved` |
| `active_monitoring` | active | Approved, >30 days to expiry | Wait / renew | — | `coi_monitor.created` |
| `expiring_soon` | expiring_soon | ≤30 days to expiry (daily worker) | Request renewal | internal_coi_expiration_reminder | `coi_status.expiring_soon` |
| `expired` | expired | Past expiration date | Request new COI | internal_coi_expiration_reminder | `coi_status.expired` |
| `completed` | completed | Superseded by newer approved COI | — | — | `coi_monitor.completed` |

### Status computation (monitoring)

```typescript
daysUntilExpiration(expirationDate):
  days < 0        → expired
  days ≤ 30       → expiring_soon
  else            → active_monitoring
```

Constant: `COI_EXPIRING_SOON_DAYS = 30`

---

## Document (`documents.status` for type `coi`)

| Status | Meaning | Set when |
|--------|---------|----------|
| `pending` | Request created, no file | Request creation |
| `uploaded` | Version exists (unused in happy path) | — |
| `review_needed` | Awaiting field entry and approval | External upload |
| `approved` | Approved (brief) | Approve action |
| `rejected` | Rejected | Reject action |
| `active_monitoring` | Approved, monitoring active | Approve + monitor |
| `expiring_soon` | Within 30 days of expiration | Daily monitor worker |
| `expired` | Past expiration | Daily monitor worker |
| `archived` | Superseded | Replacement COI approved |

Document status mirrors workflow status during monitoring phase.

---

## Monitor (`monitors.status` for `coi_expiration`)

| Status | Meaning |
|--------|---------|
| `active` | Daily evaluation running |
| `paused` | Manually paused (future) |
| `completed` | Superseded by newer COI for same vendor |
| `cancelled` | Workflow cancelled |
| `failed` | Worker error |
| `expired` | Certificate expired (terminal for monitor) |

---

## Magic link (`magic_links.status`)

| Status | Meaning |
|--------|---------|
| `active` | Valid for upload |
| `used` | Submission consumed link |
| `expired` | Past `expires_at` |
| `revoked` | Manually revoked |
| `completed` | Request finished |

---

## Reminder (`reminders.status`)

| Status | Meaning |
|--------|---------|
| `scheduled` | Pending send |
| `sent` | Email delivered |
| `cancelled` | Request completed / terminal status |
| `failed` | Send failed |

---

## Active vs monitored status groups

**Active request statuses** (block duplicate requests): `draft`, `sent`, `opened`, `submitted`, `review_needed`, `needs_correction`, `overdue`

**Monitored statuses** (count toward active records limit): `active_monitoring`, `expiring_soon`, `expired`

**Terminal statuses** (cancel reminders): `approved`, `active_monitoring`, `expiring_soon`, `expired`, `completed`, `cancelled`
