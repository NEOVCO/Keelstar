# Exclusion Monitoring — Existing Implementation Review

> Inspected: 2026-06-30 · Before building vertical slice

---

## Existing exclusion-related code

| Area | Status | Location |
|------|--------|----------|
| Module registry | Active, slug `exclusions`, entitlement `exclusion_monitor` | `src/lib/modules/modules.ts` |
| Product marketing | Product page, guides, glossary, tools registry | `src/lib/products.ts`, `src/lib/guides/exclusion.ts` |
| SEO landing | Waitlist page, honest “coming soon” copy | `src/app/exclusion-monitoring/`, `src/lib/seo-landing/exclusion-monitoring.ts` |
| App route | Generic `ModulePageShell` only | `src/app/(app)/app/apps/[slug]/page.tsx` |
| Seed | Product + workflow template `exclusion_monitoring` | `supabase/seed/seed.sql` |
| Free tools | `oig-search`, `sam-search` use `ToolRunner` placeholder | `src/lib/tools.ts`, `src/app/tools/[slug]/page.tsx` |

**Not found:** `src/lib/exclusions/`, exclusion API routes, screening tables, exclusion worker, dedicated UI components.

---

## Vendor / person structures

| Entity | Status |
|--------|--------|
| `vendors` | Real table (migration 003). Used by W-9, COI, vendor packets. |
| `people` | No DB table. `/app/people` lists org members; `[id]` uses `MOCK_PEOPLE`. |
| `external_participants` | Shared primitive for magic-link flows. Not used for exclusion MVP. |

**Decision:** MVP uses `screening_subjects` with optional `vendor_id` and inline name fields for ad hoc person/organization entry. No separate `people` table in v1.

---

## Monitor / reminder helpers

| Helper | Reuse for exclusions |
|--------|----------------------|
| `monitors` + `monitor_runs` | Yes — `monitor_type = exclusion_monitoring` |
| `src/lib/monitoring/runMonitors.ts` | Generic runner (reference only) |
| `workers/coi-expiration-monitor/index.ts` | Extend bundle with `runExclusionMonitor()` |
| `src/lib/coi/expirationMonitor.ts` | Pattern for create monitor + daily run + audit |
| `reminders` | Optional; exclusion uses monitor schedule + email alerts |

---

## Audit helpers

- `src/lib/audit/createAuditLog.ts` — reuse for all exclusion events
- Existing modules prefix actions: `coi_*`, `w9_*`, `contract.*`, `vendor_packet.*`
- Exclusion will use `exclusion_*` prefix per AUDIT_EVENTS.md

---

## What can be reused

- `vendors` table and vendor detail page pattern
- `workflow_instances` with `type = exclusion_screening` for audit linkage
- `monitors` / `monitor_runs` for monthly re-screening
- `notifications` + `src/lib/email/sendEmail.ts` + template pattern from COI/contracts
- `evidence_exports` table + CSV export pattern from `src/lib/coi/exportEvidence.ts`
- `usage_tracking` + `assertUsageLimit` for ad hoc check limits
- `checkModuleEntitlement` with `exclusion_monitor` product key
- `CoiModulePage` layout pattern for `ExclusionsModulePage`
- RBAC: map to existing `workflows.create`, `workflows.approve`, `monitors.manage`, `audit.view`

---

## What must be added

- Migration: `screening_subjects`, `screening_runs`, `screening_results`, `screening_matches` + RLS
- `src/lib/exclusions/` — providers (OIG demo/live, SAM not-configured), matching, screening orchestration, review, monitor runner, export
- API: `/api/exclusions/screen`, `/api/exclusions/subjects`, `/api/exclusions/results/[id]`
- UI: module dashboard, run screening flow, result/subject detail, vendor screening card
- Worker: scheduled exclusion monitor in `workers/coi-expiration-monitor`
- Email templates for potential match alerts
- Billing limits: ad hoc checks/month, active monitors
- Tests: `tests/exclusions.test.ts`
- Demo seed records (demo mode only)

---

## What must not be duplicated

- No separate vendor table
- No custom magic link system (no external participant flow in MVP)
- No parallel monitor table
- No fake live government API when `EXCLUSION_DATA_MODE=demo`

---

## Risks to existing modules

| Risk | Mitigation |
|------|------------|
| Workflow status constraint conflicts | Use dedicated `exclusion_screening` workflow type; minimal status set in metadata |
| Monitor worker failures block COI/contract | Wrap exclusion runner in try/catch; log errors per monitor |
| RLS gaps on new tables | Mirror `vendors` policies: `is_org_member` / `has_permission` |
| Billing entitlement naming | Keep `exclusion_monitor` to match seeded `products` row |

---

## Policy Acknowledgement note

User prompt referenced Policy Acknowledgement as implemented. **Current codebase:** registry + seed only (`ModulePageShell` at `/app/apps/policies`). No `src/lib/policies/` or API routes. Exclusion build does not depend on policy module.
