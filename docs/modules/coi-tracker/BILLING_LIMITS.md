# COI Tracker — Billing Limits

## Plans (MVP)

### Free tier

| Limit | Value |
|-------|-------|
| Active COI records | 3 |
| COI requests / calendar month | 3 |
| Vendors | 5 (shared platform limit) |
| Team members | 1 (owner only) |
| Automated request reminders | No |
| Automated expiration reminders | No |
| Initial request email (manual send) | Yes |
| Expiration monitor on approve | Yes |
| Evidence export | Basic (CSV) |

**Active COI record** counts workflows in: `active_monitoring`, `expiring_soon`, `approved`, `review_needed`, `submitted`.

Checked on request **create** via `assertUsageLimit(orgId, "coi_active_records")`.

**Monthly requests** incremented on request **send** via `incrementUsage(orgId, "coi_requests")`.

### Paid tier (`coi_tracker` entitlement)

| Limit | Value |
|-------|-------|
| Active COI records | Unlimited |
| COI requests | Unlimited |
| Vendors | Unlimited |
| Team members | Up to 5 |
| Automated request reminders | Yes |
| Automated expiration reminders | Yes |
| Evidence export | Full |

## Upgrade triggers

| Action blocked | Modal message |
|----------------|---------------|
| Create 4th active COI record | "Upgrade for unlimited COI tracking" |
| Send 4th request this month | "Upgrade for unlimited COI requests" |
| Automated reminders (implicit) | Reminders not scheduled without entitlement |
| Invite 2nd member | "Upgrade for team collaboration" (shared) |

## Implementation

| File | Purpose |
|------|---------|
| `src/lib/billing/limits.ts` | `FREE_TIER_LIMITS.coiActiveRecords = 3`, `coiRequestsPerMonth = 3` |
| `src/lib/billing/checkUsageLimit.ts` | `countActiveCoiRecords()`, `assertUsageLimit()` |
| `src/lib/billing/checkEntitlement.ts` | `checkModuleEntitlement(orgId, "coi_tracker")` |
| `src/lib/coi/scheduleReminders.ts` | Skips scheduling if no paid entitlement |
| `src/lib/coi/expirationMonitor.ts` | Skips expiration reminder scheduling if no paid entitlement |

### usage_tracking

| metric_key | period | incremented |
|------------|--------|-------------|
| `coi_requests` | calendar month (`YYYY-MM-01`) | On request send |

`coi_active_records` is counted live from `workflow_instances`, not stored in `usage_tracking`.

## On block

1. Throw user-facing error with upgrade CTA
2. Audit: `billing.limit_reached` with `{ limit: "coi_active_records" | "coi_requests" }`
3. PostHog: `billing_limit_reached`

## Stripe

Placeholder checkout URL in upgrade modal if Stripe not configured (shared billing flow).

## Relationship to W-9 limits

COI and W-9 limits are independent. An org on free tier can have 5 W-9 requests and 3 COI requests per month. Vendor limit (5) is shared.

## Paid value proposition

The subscription unlocks **ongoing monitoring automation** — expiration reminders and request chase emails — not just higher counts. Free tier proves collection and monitoring status; paid tier automates the follow-up.
