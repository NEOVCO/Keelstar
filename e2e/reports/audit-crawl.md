# Keelstar navigation crawl

Generated: 2026-07-06T13:50:48.431Z

## Summary

- Sidebar links checked: 21
- Sidebar failures: 2
- Primary CTAs checked: 5
- CTA failures: 1

## Sidebar

| Label | Expected | Landed | OK | Console errors |
|-------|----------|--------|----|----------------|
| Home | /app/ | /app/ | ✓ | — |
| Inbox | /app/inbox/ | /app/inbox/ | ✓ | — |
| Workflows | /app/workflows/ | /app/workflows/ | ✓ | — |
| Documents | /app/documents/ | /app/documents/ | ✓ | — |
| Monitors | /app/monitors/ | /app/monitors/ | ✓ | — |
| Vendors | /app/vendors/ | /app/vendors/ | ✓ | — |
| People | /app/people/ | /app/people/ | ✓ | — |
| Reports | /app/reports/ | /app/reports/ | ✓ | — |
| Audit Log | /app/audit/ | /app/audit/ | ✓ | — |
| W-9 Collector | /app/apps/w9/ | /app/apps/w9/ | ✓ | — |
| COI Tracker | /app/apps/coi/ | /app/apps/coi/ | ✓ | — |
| Contract Renewal Tracker | /app/apps/contracts/ | /app/apps/contracts/ | ✓ | — |
| Contract Risk Scanner | /app/apps/contracts-risk/ | /app/apps/contracts-risk/ | ✓ | — |
| Exclusion Monitor | /app/apps/exclusions/ | /app/apps/exclusions/ | ✓ | — |
| Vendor Packet Portal | /app/apps/vendor-packets/ | /app/apps/vendor-packets/ | ✓ | — |
| Policy Acknowledgement Track | /app/apps/policies/ | /app/apps/policies/ | ✓ | — |
| Training Record Tracker | /app/apps/training/ | /app/apps/training/ | ✓ | — |
| Invoice Approval Lite | /app/apps/invoices/ | /app/apps/invoices/ | ✓ | — |
| Simple Signer | /app/apps/signer/ | /app/apps/signer/ | ✓ | — |
| Settings | /app/settings/ | /app/settings/ | ✗ | Failed to fetch RSC payload for http://localhost:3000/app/.  |
| Billing | /app/settings/billing/ | /app/ | ✗ | — |

## Primary CTAs

| Route | Button | Landed | OK | Note |
|-------|--------|--------|----|------|
| /app/vendors | Add vendor | /app/vendors/new/ | ✓ | — |
| /app/apps/w9 | Request W-9 | /app/vendors/new/ | ✓ | — |
| /app/apps/coi | Request COI | /app/vendors/ | ✓ | — |
| /app/apps/contracts | Add contract | /app/apps/contracts/ | ✓ | — |
| /app/settings |  | /app/settings | ✗ | Primary CTA not visible |

## Issues

### Sidebar: Settings

- `Failed to fetch RSC payload for http://localhost:3000/app/. Falling back to browser navigation. TypeError: Failed to fetch
    at fetchServerResponse (webpack-internal:///(app-pages-browser)/./node_mo`
- `Failed to load resource: the server responded with a status of 500 (Internal Server Error)`

### Sidebar: Billing

- locator.click: Timeout 10000ms exceeded.
Call log:
[2m  - waiting for locator('aside nav a[href="/app/settings/billing/"]').first()[22m


### CTA: /app/settings → 

- Primary CTA not visible
