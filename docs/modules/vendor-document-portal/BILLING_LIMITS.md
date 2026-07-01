# W-9 Collection — Billing Limits

## Plans (MVP)

### Free tier

| Limit | Value |
|-------|-------|
| Vendors | 5 |
| W-9 requests / calendar month | 5 |
| Team members | 1 (owner only) |
| Automated reminders | Manual resend only |
| Evidence export | Basic (metadata CSV) |

### Paid tier (`w9_collector` entitlement)

| Limit | Value |
|-------|-------|
| Vendors | Unlimited |
| W-9 requests | Unlimited |
| Team members | Up to 5 |
| Automated reminders | Yes |
| Evidence export | Full |

## Upgrade triggers

| Action blocked | Modal message |
|----------------|---------------|
| Create 6th vendor | "Upgrade for unlimited vendors" |
| Create 6th request this month | "Upgrade for unlimited W-9 requests" |
| Invite 2nd member | "Upgrade for team collaboration" |
| Enable automated reminders (free) | "Upgrade for automated reminders" |

## Implementation

- `lib/billing/checkEntitlement.ts` — has `w9_collector`?
- `lib/billing/checkUsageLimit.ts` — count vendors, monthly requests
- `usage_tracking` table: `metric_key` = `w9_requests`, `vendors`
- On block: audit `billing.limit_reached`, PostHog `billing_limit_reached`

## Stripe

Placeholder checkout URL in upgrade modal if Stripe not configured.
