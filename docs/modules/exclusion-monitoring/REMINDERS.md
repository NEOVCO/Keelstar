# Exclusion Monitoring — Reminders

MVP uses **monitor schedule** (monthly default), not per-run reminder windows.

- Monitor `next_run_at` set to +30 days after each successful run
- Daily worker picks due monitors
- Idempotency: skip if completed run exists for same monitor on same UTC day
- Potential match triggers immediate email to owner (not a delayed reminder row)

Future: `reminders` table integration for digest emails.
