# Vendor Document Portal — W-9 Collection Module Spec

> Module slug: `vendor-document-portal` · App slug: `w9` · Entitlement: `w9_collector` · Workflow type: `w9_collection`
> Status: **Reference vertical slice v1** · Last updated: 2026-06-28

---

## 1. One-Sentence Job

Collect valid W-9s from vendors through secure request links, reminders, review, document storage and audit trail.

---

## 2. Target Customer

- **Industry:** Any business with vendor/contractor payments (construction, professional services, healthcare, property management, agencies)
- **Company size:** SMB and mid-market (5–500 employees)
- **Buyer role:** AP Manager, Controller, Finance Director, Operations Lead
- **Buyer pain:** "We chase W-9s in email threads and lose track of who submitted what."

---

## 3. Primary User

- AP clerk, office manager, finance coordinator
- Weekly use during vendor onboarding and year-end prep
- Non-technical; needs clear status and reminders

---

## 4. External Participant

- **Type:** Vendor contact (accounts payable contact at supplier/contractor)
- **Interaction:** Upload completed W-9 PDF via magic link
- **Account required:** No

---

## 5. Pain and Current Workaround

### Pain
- W-9 collection scattered across email, shared drives, spreadsheets
- No proof of when vendor submitted or who approved
- Missed W-9s discovered at 1099 season
- No reminders before deadlines

### Current workaround
Email request → vendor replies with attachment → manual save to folder → spreadsheet tracker

### Why insufficient
No versioning, no audit trail, no automated reminders, no secure external upload, no review workflow

---

## 6. First Paid Use Case

Send secure W-9 request to a vendor, receive upload via magic link, review and approve, with automated reminders and exportable evidence for audit.

---

## 7. MVP Scope

See [QA_CHECKLIST.md](./QA_CHECKLIST.md). Includes: vendor CRUD, W-9 request, magic link email, external upload, review/approve/reject, reminders, audit, evidence CSV export, billing limits.

---

## 8. Explicit Exclusions (v1)

IRS TIN matching · 1099 filing · tax advice · W-8 forms · accounting integrations · OCR · AI extraction · interactive W-9 form filling · COI/contracts/invoices · bulk vendor import · SSO · MFA beyond Supabase · advanced analytics · white-label · native mobile · custom roles · PDF evidence bundle

---

## 9. Shared Primitives Reused

| Primitive | Usage |
|-----------|--------|
| `organizations` | Tenant |
| `organization_members` | Internal users |
| `vendors` | **New** — vendor directory |
| `workflow_instances` | W-9 request (`type = w9_collection`) |
| `tasks` | External upload task |
| `external_participants` | Vendor contact |
| `magic_links` | Secure upload link |
| `documents` / `document_versions` | W-9 file storage |
| `reminders` | **New** — scheduled reminder rows |
| `notifications` / `email_events` | Email delivery |
| `audit_logs` | All actions |
| `organization_entitlements` | Module + usage limits |

---

## 10. Future Expansion

- Vendor Packet Portal (W-9 + COI + contracts in one portal)
- Bulk vendor import
- Parsed field extraction (TIN, name) when OCR/AI added
- `vendors` table feeds COI Tracker and Exclusion Monitor

---

## 11. Cross-Sell

| Direction | Module | Prompt |
|-----------|--------|--------|
| Downstream | COI Tracker | Track insurance for this vendor |
| Downstream | Vendor Packet Portal | Collect full onboarding packet |
| Downstream | Exclusion Monitor | Screen vendor against exclusion lists |

---

*Reference implementation for all future Keelstar modules.*
