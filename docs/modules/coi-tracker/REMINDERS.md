# COI Tracker — Reminders

COI Tracker uses two reminder categories: **request reminders** (chase vendor for upload) and **expiration reminders** (alert internal owner before lapse). Both use the shared `reminders` table and platform notification pipeline.

---

## Request reminders (collection phase)

### Defaults

| Setting | Value |
|---------|-------|
| Due date | 14 days after request creation (`COI_DEFAULT_DUE_DAYS`) |
| Reminder windows | 7 days before due · on due date · 7 days after due (if incomplete) |

### Scheduling rules

1. Created when COI request is **sent** (`scheduleCoiRequestReminders` in `sendCoiRequestEmail`)
2. Only schedule reminders with `scheduled_at` in the future
3. Requires paid `coi_tracker` entitlement — **not scheduled on free tier**
4. `reminder_window`: `before_7d`, `on_due`, `after_7d`
5. `type`: `coi_reminder` | `coi_overdue`
6. `metadata.category`: `coi_request`
7. Scheduled at 09:00 local server time on target date

### Stop conditions

Cancel all pending request reminders when workflow status is in `TERMINAL_COI_STATUSES`:

`approved`, `active_monitoring`, `expiring_soon`, `expired`, `completed`, `cancelled`

Also cancelled on approve via `cancelCoiReminders()`.

### Correction flow

When status → `needs_correction`:
- Prior request reminders may be cancelled
- New send creates fresh reminder schedule

### Manual resend

- Allowed via `resendCoiRequest()`
- **Rate limit:** 1 per 24 hours per request (Member/Manager)
- **Admin/Owner:** unlimited
- Creates new magic link; audit: `coi_request.sent`

### Worker (`workers/reminder-sender`)

```
Daily cron (Render)
→ npm run worker:reminders
→ SELECT reminders WHERE status='scheduled' AND scheduled_at <= now()
  AND type IN ('coi_reminder', 'coi_overdue')
→ JOIN workflow_instances WHERE status NOT IN TERMINAL_COI_STATUSES
→ Resolve magic link URL via resolveCoiMagicLinkUrl()
→ Send email: vendor_coi_reminder or vendor_coi_overdue
→ UPDATE reminder status='sent', sent_at=now()
→ INSERT email_event, audit_log (coi_reminder.sent)
→ On failure: status='failed', log Sentry
```

---

## Expiration reminders (monitoring phase)

### Defaults

| Setting | Value |
|---------|-------|
| Expiring soon threshold | 30 days (`COI_EXPIRING_SOON_DAYS`) |
| Reminder windows | 30d · 14d · 7d · 0d · 7d post-expiration before internal follow-up |

### Scheduling rules

1. Created on **approve** when expiration monitor is created (`scheduleCoiExpirationReminders`)
2. Requires paid `coi_tracker` entitlement
3. Recipient: workflow owner email (internal only in v1)
4. `reminder_window`: `exp_30d`, `exp_14d`, `exp_7d`, `exp_0d`, `exp_post_7d`
5. `type`: `coi_expiration_internal`
6. `metadata`: `{ category: "coi_expiration", documentId, internal: true }`
7. Scheduled at 09:00 on `(expiration_date - daysBefore)`

### Stop conditions

Cancelled when workflow status is `cancelled` or `completed`.

Not cancelled on `expired` — post-expiration window (`exp_post_7d`) still fires.

### Worker (`workers/coi-expiration-monitor`)

```
Daily cron (Render)
→ npm run worker:coi-monitor
→ runCoiExpirationMonitor() in src/lib/coi/expirationMonitor.ts

Phase 1 — Status updates:
→ SELECT monitors WHERE monitor_type='coi_expiration' AND status='active'
→ For each: computeCoiMonitoringStatus(expirationDate)
→ UPDATE workflow_instances.status and documents.status
→ If expired: set monitor.status='expired'
→ Audit: coi_status.expiring_soon or coi_status.expired

Phase 2 — Expiration reminders:
→ SELECT reminders WHERE type='coi_expiration_internal' AND status='scheduled' AND scheduled_at <= now()
→ Skip if workflow cancelled/completed
→ Send internal_coi_expiration_reminder to owner
→ UPDATE reminder status='sent'
→ Audit: coi_reminder.sent
```

Monitor `next_run_at` set to next day 06:00 after each evaluation.

---

## Idempotency

- Unique partial index on `(workflow_instance_id, reminder_window)` WHERE status IN (`scheduled`, `sent`) — prevents duplicate windows
- Worker skips if reminder already `sent` for same window
- Monitor runs idempotent per day — same status transition not re-audited if status unchanged

## Audit

Every schedule: `coi_reminder.created`

Every send: `coi_reminder.sent` + `email.sent`

## Free vs paid

| Feature | Free tier | Paid (`coi_tracker`) |
|---------|-----------|----------------------|
| Initial request email | Yes (manual send) | Yes |
| Automated request reminders | No | Yes |
| Expiration monitor | Yes (on approve) | Yes |
| Automated expiration reminders | No | Yes |
| Manual resend | Yes (rate limited) | Yes |
