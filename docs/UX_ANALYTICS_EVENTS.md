# Keelstar UX — Analytics Events

> Product analytics via `src/lib/analytics/track.ts`. No PII in properties.

---

## Naming convention

`snake_case` — `{object}_{action}` or `{module}_{action}`.

Include properties: `organization_id`, `module`, `workflow_type` where relevant. **Never** email, file contents, or document text.

---

## Activation funnel

| Event | When |
|-------|------|
| `organization_created` | Org created in onboarding |
| `first_document_uploaded` | First doc in org |
| `first_extraction_reviewed` | First field review saved |
| `first_workflow_created` | First workflow instance |
| `first_magic_link_sent` | First external request |
| `first_external_submission_completed` | First external upload/sign |
| `first_monitor_created` | First monitor |
| `first_reminder_sent` | First reminder delivered |
| `first_evidence_exported` | First CSV export |
| `first_member_invited` | First invite sent |

Each fires **once per org** (dedupe client-side or server).

---

## Module events

| Event | Module |
|-------|--------|
| `w9_request_created` | W-9 |
| `coi_uploaded` | COI |
| `contract_uploaded` | Contracts |
| `exclusion_check_run` | Exclusions |
| `vendor_packet_sent` | Vendor packets |
| `policy_ack_sent` | Policies |
| `training_record_uploaded` | Training |
| `invoice_approval_requested` | Invoices |
| `signer_request_sent` | Signer |

---

## UX friction

| Event | When |
|-------|------|
| `upload_failed` | Upload error |
| `extraction_failed` | Parse error |
| `magic_link_expired` | External hit expired token |
| `external_dropoff` | Opened link, no submit in session |
| `monitor_creation_abandoned` | Exited wizard mid-flow |
| `workflow_creation_abandoned` | Exited create mid-flow |

---

## Expansion & billing

| Event | When |
|-------|------|
| `module_locked_clicked` | Click locked app in sidebar |
| `upgrade_prompt_clicked` | Upgrade CTA |
| `billing_started` | Checkout started |
| `subscription_created` | Paid plan active |

---

## Implementation

```typescript
track("w9_request_created", { module: "w9", workflow_type: "w9_collection" });
```

PostHog stub safe no-op when key missing in dev.

---

## Dashboards (future)

- Activation funnel by first goal
- External completion rate by module
- Friction events week over week
