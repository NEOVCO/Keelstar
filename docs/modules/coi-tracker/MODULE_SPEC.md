# COI Tracker — Certificate of Insurance Module Spec

> Module slug: `coi-tracker` · App slug: `coi` · Entitlement: `coi_tracker` · Workflow type: `coi_tracking`
> Status: **Reference vertical slice v2** · Last updated: 2026-06-29

---

## 1. One-Sentence Job

Collect certificates of insurance from vendors through secure request links, capture coverage details, monitor expiration dates, and maintain an audit trail so coverage never lapses unnoticed.

---

## 2. Target Customer

- **Industry:** Construction, property management, facilities, healthcare, professional services, agencies — any business requiring vendor insurance proof
- **Company size:** SMB and mid-market (5–500 employees)
- **Buyer role:** Risk Manager, Operations Director, Compliance Officer, AP Manager, Facilities Manager
- **Buyer pain:** "We find out a vendor's insurance expired only after an incident or during an audit."

---

## 3. Primary User

- Operations coordinator, compliance clerk, AP specialist, project manager
- Weekly use during vendor onboarding and ongoing compliance reviews
- Non-technical; needs clear expiration visibility and automated alerts

---

## 4. External Participant

- **Type:** Vendor contact (insurance coordinator or accounts payable at supplier/contractor)
- **Interaction:** Upload COI PDF via magic link (`coi_upload`)
- **Account required:** No

---

## 5. Pain and Current Workaround

### Pain
- COIs scattered across email attachments, shared drives, and spreadsheets
- Expiration dates buried in PDFs; no proactive alerts
- No proof of when vendor submitted or who approved coverage
- Lapsed coverage discovered during audits or after incidents
- Manual re-requesting before renewal

### Current workaround
Email request → vendor replies with COI attachment → save to folder → spreadsheet with expiration dates → calendar reminders (if any)

### Why insufficient
No versioning, no audit trail, no automated expiration monitoring, no secure external upload, no structured field capture, no evidence export for compliance reviews

---

## 6. First Paid Use Case

Send a secure COI request to a vendor, receive upload via magic link, manually enter or verify coverage fields (carrier, policy number, expiration), approve the certificate, and receive automated expiration reminders 30/14/7/0 days before lapse — with exportable evidence for audit.

---

## 7. MVP Scope

See [QA_CHECKLIST.md](./QA_CHECKLIST.md). Includes:

- Vendor selection (reuses `vendors` table from W-9 module)
- COI request creation and send via magic link
- External upload at `/external/coi/[token]`
- Manual field entry on `document_parsed_fields` (no OCR/AI in v1)
- Internal review: approve / reject / request correction
- Expiration monitor (`coi_expiration`) with status transitions: `active_monitoring` → `expiring_soon` → `expired`
- Request reminders (7d before due, on due, 7d overdue) via `reminder-sender` worker
- Expiration reminders (30/14/7/0/post-7d) via `coi-expiration-monitor` worker
- Audit events for all actions
- Evidence CSV export
- Billing limits (3 active records, 3 requests/month on free tier)

---

## 8. Explicit Exclusions (v1)

Live carrier verification API · ACORD form auto-parsing / OCR / AI extraction · `coi_certificates` dedicated table · insurance broker integration · claims workflows · enterprise risk scoring · coverage requirement templates per vendor category (`coi_requirements`) · bulk vendor import · vendor-facing expiration emails (internal only in v1) · PDF evidence bundle · white-label · SSO beyond Supabase

---

## 9. Shared Primitives Reused

| Primitive | Usage |
|-----------|--------|
| `organizations` | Tenant |
| `organization_members` | Internal users |
| `vendors` | Vendor directory (shared with W-9) |
| `workflow_instances` | COI request (`type = coi_tracking`) |
| `tasks` | External upload task |
| `external_participants` | Vendor contact |
| `magic_links` | Secure upload link (`purpose = coi_upload`) |
| `documents` / `document_versions` | COI file storage (`document_type = coi`) |
| `document_parsed_fields` | Manual coverage fields |
| `monitors` | Expiration monitor (`monitor_type = coi_expiration`) |
| `reminders` | Request and expiration reminder rows |
| `notifications` / `email_events` | Email delivery |
| `audit_logs` | All actions |
| `organization_entitlements` | Module + usage limits |
| `evidence_exports` | Export tracking |

**No new tables.** All COI data modeled via shared primitives. Migration `005_coi_tracker.sql` extends status constraints and monitor columns only.

---

## 10. Future Expansion

- `coi_requirements` table when metadata jsonb insufficient for per-category coverage rules
- OCR/AI extraction of ACORD 25 fields
- Vendor-facing expiration renewal emails (`vendor_coi_renewal_request` template exists, not wired in v1)
- Vendor Packet Portal (W-9 + COI in one portal)
- Cross-module monitor dashboard

---

## 11. Cross-Sell

| Direction | Module | Prompt |
|-----------|--------|--------|
| Upstream | W-9 Collector | "Collect W-9 for this vendor too" |
| Upstream | Vendor Packet Portal | Full onboarding packet |
| Downstream | Exclusion Monitor | Screen vendor against exclusion lists |
| Related | Contract Renewal Tracker | Align contract and insurance dates |

---

## 12. Implementation Reference

| Area | Location |
|------|----------|
| Domain logic | `src/lib/coi/*` |
| API routes | `/api/coi/requests`, `/api/coi/requests/[id]`, `/api/external/coi/upload` |
| External page | `/external/coi/[token]` |
| Module UI | `src/components/coi/*`, `/app/apps/coi` |
| Email templates | `src/lib/email/templates/coi.ts` |
| Migration | `supabase/migrations/005_coi_tracker.sql` |
| Workers | `workers/reminder-sender` (request reminders), `workers/coi-expiration-monitor` |

---

*Second reference vertical slice — proves the platform pattern established by W-9 Collection extends to monitoring-centric workflows.*
