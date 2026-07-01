# W-9 Collection — Reminders

## Defaults

| Setting | Value |
|---------|-------|
| Due date | 14 days after request creation |
| Reminder windows | 7 days before due · on due date · 7 days after due (if incomplete) |

## Scheduling rules

1. Created when W-9 request is **sent** (`sendW9RequestEmail`)
2. Only schedule reminders with `scheduled_at` in the future
3. `reminder_window`: `before_7d`, `on_due`, `after_7d`
4. `type`: `w9_reminder` | `w9_overdue`

## Stop conditions

Cancel all pending reminders when request status is:
- `approved`, `completed`, `cancelled`

## Correction flow

When status → `needs_correction`:
- Cancel old reminders
- Optionally schedule new reminders for new due date

## Manual resend

- Allowed via "Resend request" action
- **Rate limit:** 1 per 24 hours per request (Member/Manager)
- **Admin/Owner:** unlimited
- Creates new magic link if previous revoked/expired
- Audit: `w9_request.sent`

## Worker (`workers/reminder-sender`)

```
Daily cron (Render)
→ SELECT reminders WHERE status='scheduled' AND scheduled_at <= now()
→ JOIN workflow_instances WHERE status NOT IN (completed, cancelled, approved)
→ Dedupe by (workflow_instance_id, reminder_window)
→ Send email via template
→ UPDATE reminder status='sent', sent_at=now()
→ INSERT email_event, audit_log
→ On failure: status='failed', log Sentry
```

## Idempotency

- Unique partial index: `(workflow_instance_id, reminder_window)` WHERE status IN ('scheduled','sent')
- Worker skips if reminder already `sent` for same window

## Audit

Every send: `reminder.sent` + `email.sent`
