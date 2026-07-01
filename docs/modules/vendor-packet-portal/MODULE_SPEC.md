# Vendor Packet Portal — Module Spec

> Module slug: `vendor-packet-portal` · App slug: `vendor-packets` · Entitlement: `vendor_packet` · Workflow type: `vendor_packet`
> Status: **Reference vertical slice v4** · Last updated: 2026-06-30

## One-Sentence Job

Collect W-9, COI, and other vendor onboarding documents through one secure multi-item portal with progress tracking and reminders.

## MVP Scope

- Select vendor + checklist items (W-9, COI, MSA, banking)
- Send multi-session magic link (`maxUses: 50`, 30-day expiry)
- External portal at `/external/vendor-packet/[token]`
- Per-item upload with progress bar
- Status: draft → sent → opened → in_progress → review_needed → completed
- Incomplete packet monitor + request reminders (7d before, on due, 7d overdue)
- Evidence CSV export
- Billing: 3 active packets / 3 sends per month (free tier)

## Shared Primitives

`workflow_instances`, `tasks`, `documents`, `document_versions`, `magic_links`, `monitors`, `reminders`, `vendors`, `audit_logs`

## Exclusions

Template library, ERP sync, vendor scoring, payment integrations, AI extraction
