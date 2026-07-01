# Contract Renewal Tracker — Status Model

## Contract record (`workflow_instances.status`)

### Intake phase

| Status | Meaning | Set by |
|--------|---------|--------|
| `draft` | Record created, no document | Create |
| `uploaded` | Document uploaded | Upload |
| `metadata_needed` | Key renewal data missing | System after upload |
| `review_needed` | Fields entered, not activated | Save fields |
| `cancelled` | User cancelled intake | Cancel action |

### Monitoring phase

| Status | Meaning | Set by |
|--------|---------|--------|
| `renewal_monitoring` | Monitor active, >30 days to key dates | Activate |
| `notice_window_open` | Latest notice date within 30 days | Daily worker |
| `renewal_approaching` | Renewal date within 30 days | Daily worker |
| `auto_renew_risk` | Notice passed + auto-renews | Daily worker |
| `expired` | Renewal date passed | Daily worker |

### Terminal phase

| Status | Meaning | Set by |
|--------|---------|--------|
| `renewed` | User marked renewed (new renewal date required) | Mark renewed |
| `terminated` | User ended contract | Mark terminated |
| `archived` | Hidden from active lists | Archive |
| `failed` | Monitor/worker failure | Worker |

**Legacy aliases** (normalized in UI/worker): `active_monitoring` → `renewal_monitoring`, `expiring_soon` → `renewal_approaching`, `completed` → `renewed`

## Status computation

```typescript
daysToRenewal < 0 → expired
daysToNotice < 0 && autoRenews → auto_renew_risk
daysToNotice ≤ 30 → notice_window_open
daysToRenewal ≤ 30 → renewal_approaching
else → renewal_monitoring
```

`latest_notice_date = renewal_date − notice_period_days`

## Document status

Mirrors workflow status during monitoring. Terminal: `archived`.

## Monitor status

`active`, `paused`, `completed`, `cancelled`, `failed`, `expired`

## Reminder status

`scheduled`, `sent`, `cancelled`, `failed` — cancelled when contract renewed/terminated/archived/cancelled or dates change.
