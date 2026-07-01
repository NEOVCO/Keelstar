# Contract Renewal Tracker — Module Spec

> Module slug: `contract-renewal-tracker` · App slug: `contracts` · Entitlement: `contract_renewal` · Workflow type: `contract_renewal`
> Status: **Reference vertical slice v3** · Last updated: 2026-06-29

---

## 1. One-Sentence Job

Track contract renewal dates and notice windows for every agreement in one place, upload contract PDFs internally, capture key terms manually, and receive automated reminders before renewals pass so auto-renewals and missed notice periods never surprise the business.

---

## 2. Target Customer

- **Industry:** Operations, finance, legal ops, procurement, facilities, property management, SaaS buyers, agencies — any team managing recurring vendor or customer contracts
- **Company size:** SMB and mid-market (5–500 employees)
- **Buyer role:** Operations Director, CFO, General Counsel (lite), Procurement Manager, Facilities Manager, IT Director
- **Buyer pain:** "We only discover a contract auto-renewed when the invoice hits — or we miss the notice window buried in a 40-page PDF."

---

## 3. Primary User

- Operations coordinator, contract administrator, finance analyst, office manager
- Weekly use during contract intake and quarterly renewal reviews
- Non-technical; needs a single renewal calendar with clear "act by" dates and email alerts

---

## 4. External Participant

**None in MVP.** Contract Renewal Tracker is **internal-only**:

- No magic links
- No external upload portal
- No `external_participants` or `tasks` with `assignee_type = external`
- Internal users upload PDFs and enter fields inside the authenticated app

Future modules (Simple Signer, Vendor Packet Portal) may attach external flows to contracts already tracked here.

---

## 5. Pain and Current Workaround

### Pain

- Renewal dates scattered across shared drives, email threads, and spreadsheets
- Notice periods (30/60/90 days) require manual calendar math from renewal date
- Auto-renewal clauses discovered too late
- No version history when amended contracts arrive
- No audit trail of who entered dates or activated monitoring
- Spreadsheet rows go stale when contracts renew or terminate

### Current workaround

Save PDF to folder → spreadsheet with renewal date column → Outlook/Google Calendar reminders (if any) → manual notice-period math in a second column

### Why insufficient

No document versioning, no structured field capture, no status model for approaching vs lapsed renewals, no centralized evidence export, reminders are per-person not per-record, no link between contract file and monitored date

---

## 6. First Paid Use Case

Upload an existing vendor SaaS agreement, enter `renewal_date` and `termination_notice_days` from the contract, activate renewal monitoring, and receive internal email reminders at 90, 60, 30, and 0 days before renewal — with exportable evidence showing the file, fields, reminders sent, and audit timeline.

---

## 7. MVP Scope

See [QA_CHECKLIST.md](./QA_CHECKLIST.md). Includes:

- Create contract record (title, optional counterparty, optional vendor link)
- Internal PDF/DOC upload on workflow detail
- Manual field entry on `document_parsed_fields` (`renewal_date` required before activation)
- Activate monitoring → `active_monitoring` with `contract_renewal` monitor
- Status transitions: `active_monitoring` → `expiring_soon` (≤30 days) → `expired` (past renewal)
- Computed **notice deadline** displayed in UI: `renewal_date − termination_notice_days`
- Renewal reminders at 90/60/30/0 days before `renewal_date` (internal owner only)
- Daily worker evaluates monitors and sends due reminders
- Audit events for all actions
- Evidence CSV export
- Billing limits (5 active monitored records on free tier)
- Free utility funnel: `/tools/contract-renewal-extractor` (single-file extract, no monitoring)

---

## 8. Explicit Exclusions (v1)

Magic links / external participants · OCR/AI extraction (manual fields only) · `contracts` dedicated table · full CLM (redlining, negotiation, obligation management) · e-signature (use Simple Signer) · legal advice or clause interpretation · Word plugin · separate notice-period reminder pipeline (display only in v1; renewal-date reminders only) · bulk CSV import · ERP sync · multi-party approval chains · white-label · SSO beyond Supabase · PDF evidence ZIP bundle

---

## 9. Shared Primitives Reused

| Primitive | Usage |
|-----------|--------|
| `organizations` | Tenant |
| `organization_members` | Internal users |
| `vendors` | Optional link (`vendor_id` on workflow/document) — shared with W-9/COI |
| `workflow_instances` | Contract record (`type = contract_renewal`) |
| `documents` / `document_versions` | Contract file storage (`document_type = contract`) |
| `document_parsed_fields` | Manual contract fields |
| `monitors` | Renewal monitor (`monitor_type = contract_renewal`) |
| `reminders` | Renewal reminder rows (`type = contract_renewal_internal`) |
| `notifications` / `email_events` | Internal email delivery |
| `audit_logs` | All actions |
| `organization_entitlements` | Module + usage limits |
| `evidence_exports` | Export tracking |

**No new tables.** Migration `006_contract_renewal.sql` adds monitor index only. No `tasks`, `magic_links`, or `external_participants` in v1.

---

## 10. Future Expansion

- Notice-period reminder pipeline (alert at notice deadline, not just renewal date)
- OCR/AI extraction of renewal and termination clauses
- Link to Contract Risk Scanner pre-sign review
- Vendor Packet Portal includes contract slot fed from this module
- Cross-module dashboard: contracts + COI + W-9 per vendor
- Bulk import from spreadsheet
- Renewal decision workflow (renew / terminate / renegotiate task)

---

## 11. Cross-Sell

| Direction | Module | Prompt |
|-----------|--------|--------|
| Upstream | Contract Risk Scanner | "Scan this contract for risky clauses before you track renewal" |
| Upstream | Simple Signer | "Get this amendment signed" |
| Related | COI Tracker | "Align insurance expiry with contract renewal" |
| Related | W-9 Collector | "Collect W-9 from this counterparty" |
| Related | Vendor Packet Portal | "Add contract to vendor onboarding packet" |

---

## 12. Implementation Reference

| Area | Location |
|------|----------|
| Domain logic | `src/lib/contracts/*` |
| API routes | `/api/contracts`, `/api/contracts/[id]` |
| Module UI | `src/components/contracts/*`, `/app/apps/contracts` |
| Email templates | `src/lib/email/templates/contracts.ts` |
| Migration | `supabase/migrations/006_contract_renewal.sql` |
| Worker | `workers/contract-renewal-monitor` |

---

*Third reference vertical slice — proves the monitoring-centric pattern from COI Tracker works for internal-only workflows without magic links or external collection phases.*
