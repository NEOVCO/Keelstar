# Contract Renewal Tracker — Billing Limits

## Plans (MVP)

### Free tier

| Limit | Value |
|-------|-------|
| Active contract records | 3 |
| Vendors | 5 (shared platform limit) |
| Team members | 1 (owner only) |
| Automated renewal reminders | No |
| Renewal monitor on activate | Yes |
| Status transitions (expiring_soon/expired) | Yes |
| Evidence export | Basic (CSV) |
| Free utility (`contract-renewal-extractor`) | Unlimited single-file use |

**Active contract record** counts workflows in: `active_monitoring`, `expiring_soon`, `expired`, `review_needed`, `draft`.

Checked on contract **create** via `assertUsageLimit(orgId, "contract_active_records")`.

There is no monthly "send" metric — internal-only module has no outbound request emails.

### Paid tier (`contract_renewal` entitlement)

| Limit | Value |
|-------|-------|
| Active contract records | Unlimited |
| Vendors | Unlimited |
| Team members | Up to 5 |
| Automated renewal reminders (90/60/30/0) | Yes |
| Evidence export | Full |

## Upgrade triggers

| Action blocked | Modal message |
|----------------|---------------|
| Create 4th active contract record | "Upgrade for unlimited contract tracking" |
| Automated reminders (implicit) | Reminders not scheduled without entitlement |
| Invite 2nd member | "Upgrade for team collaboration" (shared) |

## Implementation

| File | Purpose |
|------|---------|
| `src/lib/billing/limits.ts` | `FREE_TIER_LIMITS.contractActiveRecords = 5` |
| `src/lib/billing/checkUsageLimit.ts` | `countActiveContractRecords()`, `assertUsageLimit()` |
| `src/lib/billing/checkEntitlement.ts` | `checkModuleEntitlement(orgId, "contract_renewal")` |
| `src/lib/contracts/scheduleReminders.ts` | Skips scheduling if no paid entitlement |
| `src/lib/contracts/renewalMonitor.ts` | Status updates always run; reminder scheduling gated |

### usage_tracking

`contract_active_records` is counted live from `workflow_instances`, not stored in `usage_tracking`.

No monthly increment metric in v1 (unlike `coi_requests`).

## On block

1. Throw user-facing error with upgrade CTA
2. Audit: `billing.limit_reached` with `{ limit: "contract_active_records" }`
3. PostHog: `billing_limit_reached`

## Stripe

Placeholder checkout URL in upgrade modal if Stripe not configured (shared billing flow).

## Relationship to other module limits

Contract, COI, and W-9 limits are independent. An org on free tier can have 3 COI records and 5 contract records. Vendor limit (5) is shared.

## Paid value proposition

The subscription unlocks **ongoing renewal automation** — 90/60/30/0 day internal alerts — plus unlimited active records. Free tier proves intake, field capture, and monitoring status visibility; paid tier automates the follow-up before auto-renewals and missed notice windows.
