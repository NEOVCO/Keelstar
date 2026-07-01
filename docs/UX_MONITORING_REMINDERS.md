# Keelstar UX — Monitoring & Reminders

> Monitors are recurring value — “watch this object and alert before it’s urgent.”

---

## Definition

A **monitor** is a recurring rule that watches a document, person, vendor, contract, or workflow and notifies the right people before something needs attention.

---

## Monitor creation flow (7 steps)

| Step | Input |
|------|-------|
| 1 | Choose object to monitor |
| 2 | Choose rule type (expiry, renewal, exclusion recheck, …) |
| 3 | Choose date/trigger |
| 4 | Choose reminder schedule |
| 5 | Choose owner |
| 6 | Choose escalation (optional) |
| 7 | Confirm summary |

**Components:** `MonitorRuleBuilder`, `ReminderScheduleEditor`

Can launch from: object page, global create, post-approval suggestion.

---

## Default reminder presets

- 90 days before
- 60 days before
- 30 days before
- 14 days before
- 7 days before
- On due date
- Overdue follow-up (1d, 3d, 7d)

Presets are toggles; custom dates allowed.

---

## Monitor list (`/app/monitors`)

**Columns:** Monitored object · Rule · Status · Next reminder · Owner · Last run · Actions

**Views (future):** calendar · timeline · by owner · by module

**Component:** `MonitorCard` for mobile card list.

---

## Monitor detail (`/app/monitors/[id]`)

| Section | Content |
|---------|---------|
| Header | Object name + monitor status |
| Rule summary | Plain language description |
| Schedule | Upcoming reminders list |
| Run history | `MonitorRunHistory` |
| Related object | Link to document/vendor/workflow |
| Audit | Timeline of changes |

**Actions:** Pause · Resume · Edit schedule · Run now

---

## List page integration

Home **Expiring Soon** and vendor **missing/expiring** columns pull from monitor engine.

---

## Reminder UX in workflows

On workflow detail, show:

- Next reminder date
- “Send reminder now” (rate-limited)
- Cancel reminders on complete

---

## Failure states

| Failure | UX |
|---------|-----|
| Email bounce | Banner on monitor + audit event |
| Worker delayed | “Reminders may be delayed” info banner |
| Run failed | Error on run history + retry |

---

## Backend (TODO)

- `reminders` table + worker
- Magic link URL reconstruction in worker
- `billing` limits on monitor count (future)
