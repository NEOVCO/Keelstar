# Exclusion Monitoring — Billing Limits

Entitlement: `exclusion_monitor`

## Free tier
- 5 ad hoc checks / month (`exclusion_checks`)
- 1 active monitor (`exclusion_active_monitors`)
- OIG only (SAM shows not_configured on free unless paid + key)

## Paid tier
- Higher/unlimited checks and monitors (via subscription or entitlement)
- SAM when API key configured

Upgrade triggers: `assertUsageLimit` on screen and monitor create; audit `exclusion_billing.limit_reached`.
