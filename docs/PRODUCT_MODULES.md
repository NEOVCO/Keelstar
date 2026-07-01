# Keelstar Product Modules

> Each module is a focused workflow app that composes shared platform primitives. See [NORTH_STAR.md](./NORTH_STAR.md) for the Collect → Extract → Approve → Monitor → Notify → Audit pattern.

---

## Module Overview

| Module | Slug | Category | Entitlement Key |
|--------|------|----------|-----------------|
| W-9 Collector | `w9` | Tax & Vendor | `w9_collector` |
| COI Tracker | `coi` | Insurance & Risk | `coi_tracker` |
| Contract Renewal Tracker | `contracts` | Contracts | `contract_renewal` |
| Contract Risk Scanner | `contracts-risk` | Contracts | `contract_risk_scanner` |
| Exclusion Monitor | `exclusions` | Compliance | `exclusion_monitor` |
| Vendor Packet Portal | `vendor-packets` | Vendor Management | `vendor_packet` |
| Policy Acknowledgement Tracker | `policies` | HR & Compliance | `policy_acknowledgement` |
| Training Record Tracker | `training` | HR & Compliance | `training_record` |
| Invoice Approval Lite | `invoices` | Finance | `invoice_approval` |
| Simple Signer | `signer` | Documents | `simple_signer` |

---

## W-9 Collector

**Job-to-be-done:** Collect signed W-9 forms from vendors and contractors without email chaos.

**Free utility:** Generate a W-9 request link or email template at `/tools/w9-request`.

**Paid workflow:** Automated W-9 collection campaign — send requests via magic links, track submissions, extract TIN/name/address, store versions, monitor for missing/expired W-9s, remind vendors, audit everything.

**Shared primitives:** organizations, workflows (type: `w9_collection`), tasks, external_participants, magic_links, documents, document_versions, document_parsed_fields, monitors, notifications, audit_logs.

**Future entities:** None initially — metadata jsonb on workflow_instances suffices.

**MVP scope:** Create W-9 collection workflow, send magic link to vendor, vendor uploads W-9, placeholder extraction of vendor name, monitor for missing W-9s.

**Exclusions:** TIN validation against IRS, automated 1099 filing, bulk import of vendor lists.

---

## COI Tracker

> **Second reference vertical slice** — full module documentation at [`docs/modules/coi-tracker/`](./modules/coi-tracker/)

**Job-to-be-done:** Track certificates of insurance from vendors and ensure coverage never lapses.

**Free utility:** Upload a COI PDF and extract key fields (carrier, policy number, expiration) at `/tools/coi-analyzer`.

**Paid workflow:** Automated COI collection and monitoring — request COIs from vendors, capture coverage details (manual field entry in v1), monitor expiration dates, alert before lapse, maintain version history, audit trail.

**Shared primitives:** organizations, vendors, workflows (type: `coi_tracking`), tasks, external_participants, magic_links (`coi_upload`), documents, document_versions, document_parsed_fields (manual), monitors (`coi_expiration`), reminders, notifications, audit_logs.

**Future entities:** `coi_requirements` (required coverage types/limits per vendor category) — add only when metadata jsonb is insufficient. No `coi_certificates` table in v1.

**MVP scope:** Create COI tracking workflow, vendor uploads COI via magic link, manual entry of coverage fields, approve and activate expiration monitor, status transitions (`active_monitoring` → `expiring_soon` → `expired`), reminders at 30/14/7/0 days before expiration.

**Exclusions:** Direct carrier verification API, automated COI generation, insurance broker integration, OCR/AI extraction.

---

## Contract Renewal Tracker

> **Third reference vertical slice** — full module documentation at [`docs/modules/contract-renewal-tracker/`](./modules/contract-renewal-tracker/)

**Job-to-be-done:** Never miss a contract renewal deadline or auto-renewal notice window.

**Free utility:** Upload a contract and preview renewal/notice fields at `/tools/contract-renewal-extractor`.

**Paid workflow:** Internal contract intake — create record, upload PDF, manually enter renewal terms (`renewal_date` required), dual reminder pipelines (notice deadline + renewal date at 90/60/30/14/7/0 days), status transitions (`renewal_monitoring` → `notice_window_open` / `renewal_approaching` / `auto_renew_risk` → `expired`), internal reminders, version history, audit trail, evidence export.

**Shared primitives:** organizations, vendors (optional link), workflows (type: `contract_renewal`), documents, document_versions, document_parsed_fields (manual), monitors (`contract_renewal`), reminders, notifications, audit_logs.

**Future entities:** None initially — no `contracts` table in v1.

**MVP scope:** Internal-only (no magic links). Upload contract → manual field entry → activate monitoring → notice + renewal reminders → mark renewed/terminated/archived → evidence CSV export. Fields include `contract_name`, `counterparty`, `contract_type`, `renewal_date`, `notice_period_days`, `latest_notice_date` (computed), `auto_renewal`, `owner_id`, `renewal_term`, `contract_value`, `currency`.

**Exclusions:** Magic links / external upload, OCR/AI extraction, full CLM, e-signature (use Simple Signer), legal advice, bulk import.

---

## Contract Risk Scanner

**Job-to-be-done:** Identify risky clauses in contracts before signing.

**Free utility:** Upload a contract and get a basic risk summary at `/tools/contract-risk-scanner` (future).

**Paid workflow:** Automated contract review pipeline — upload contract, extract clauses, flag risk patterns (auto-renewal, liability caps, termination terms), assign review tasks, track resolution.

**Shared primitives:** organizations, workflows (type: `contract_risk_scan`), tasks, documents, document_versions, document_parsed_fields, audit_logs.

**Future entities:** `risk_patterns` (configurable clause patterns) — add when AI/regex rule engine needs dedicated storage.

**MVP scope:** Upload contract, placeholder risk flags in parsed fields, create review task for manager.

**Exclusions:** Full AI legal analysis, jurisdiction-specific legal advice, contract negotiation tools.

---

## Exclusion Monitor

**Job-to-be-done:** Monitor vendor and employee names against OIG/SAM exclusion lists.

**Free utility:** Search a name against exclusion databases at `/tools/oig-search`.

**Paid workflow:** Maintain vendor/employee roster, schedule periodic exclusion checks, alert on matches, track resolution, audit all checks.

**Shared primitives:** organizations, workflows (type: `exclusion_monitoring`), monitors, monitor_runs, tasks, notifications, audit_logs.

**Future entities:** `exclusion_checks` (check results with match details), `exclusion_sources` (OIG, SAM, state lists).

**MVP scope:** Add names to monitor, daily check placeholder (always clear), audit check runs.

**Exclusions:** Real-time OIG/SAM API integration (future), automated clearing, healthcare-specific workflows.

---

## Vendor Packet Portal

> **Fourth reference vertical slice** — full module documentation at [`docs/modules/vendor-packet-portal/`](./modules/vendor-packet-portal/)

**Job-to-be-done:** Collect all required vendor onboarding documents in one place.

**Paid workflow:** Create vendor packet with configurable checklist (W-9, COI, MSA, banking), send single multi-session magic link portal, track per-item uploads, monitor incomplete packets, remind vendor and internal team.

**Shared primitives:** organizations, vendors, workflows (`vendor_packet`), tasks (per checklist item), external_participants, magic_links (multi-session), documents, monitors, reminders, notifications, audit_logs.

**MVP scope:** Checklist selection, portal link, external uploads per item, progress tracking, incomplete monitor, reminders, evidence export.

**Exclusions:** Vendor scoring, payment integration, ERP sync, template library.

---

## Policy Acknowledgement Tracker

**Job-to-be-done:** Ensure every employee acknowledges company policies with proof.

**Free utility:** Generate a policy acknowledgement form (future).

**Paid workflow:** Distribute policies to employees, track acknowledgements, send reminders for overdue, maintain acknowledgement records, audit trail.

**Shared primitives:** organizations, workflows (type: `policy_acknowledgement`), tasks, external_participants, magic_links, documents, monitors, notifications, audit_logs.

**Future entities:** None initially.

**MVP scope:** Upload policy document, assign acknowledgement tasks, magic link for employees, monitor overdue acknowledgements.

**Exclusions:** Policy authoring/versioning system, HRIS integration, training content delivery.

---

## Training Record Tracker

**Job-to-be-done:** Track employee training certifications and expiration dates.

**Free utility:** None initially.

**Paid workflow:** Maintain training records, track certification expiration, send renewal reminders, store completion certificates, audit compliance status.

**Shared primitives:** organizations, workflows (type: `training_record`), tasks, documents, document_versions, document_parsed_fields, monitors, reminder_rules, notifications, audit_logs.

**Future entities:** `training_types` (certification categories with default expiration periods).

**MVP scope:** Add training record with expiration date, monitor for approaching expiry, notification reminders.

**Exclusions:** LMS integration, course delivery, quiz/assessment engine.

---

## Invoice Approval Lite

**Job-to-be-done:** Route invoices through a simple approval chain without enterprise AP software.

**Free utility:** None initially.

**Paid workflow:** Upload invoice, extract amount/vendor/due date, route through approval chain, track status, monitor overdue approvals, notify approvers.

**Shared primitives:** organizations, workflows (type: `invoice_approval`), tasks, documents, document_versions, document_parsed_fields, monitors, notifications, audit_logs.

**Future entities:** `approval_chains` (reusable approval routing rules).

**MVP scope:** Upload invoice, create approval task for manager, placeholder extraction of amount, monitor overdue approvals.

**Exclusions:** Payment processing, ERP integration, GL coding, three-way matching.

---

## Simple Signer

**Job-to-be-done:** Get documents signed quickly without DocuSign complexity.

**Free utility:** Sign a PDF online at `/tools/pdf-signer`.

**Paid workflow:** Send documents for signature via magic link, track signature status, store signed versions, audit signing events.

**Shared primitives:** organizations, workflows (type: `simple_signer`), tasks, external_participants, magic_links, documents, document_versions, notifications, audit_logs.

**Future entities:** None initially.

**MVP scope:** Upload document, send magic link for signature, external participant signs (placeholder: checkbox + name), store signed version.

**Exclusions:** Advanced e-signature compliance (ESIGN/UETA certificates), witness/notary, bulk signing, template library.

---

## Shared Primitive Usage Matrix

| Primitive | W-9 | COI | Contract | Risk | Exclusion | Vendor | Policy | Training | Invoice | Signer |
|-----------|-----|-----|----------|------|-----------|--------|--------|----------|---------|--------|
| workflows | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| tasks | ✓ | ✓ | ✓ | ✓ | | ✓ | ✓ | ✓ | ✓ | ✓ |
| magic_links | ✓ | ✓ | | | | ✓ | ✓ | | | ✓ |
| documents | ✓ | ✓ | ✓ | ✓ | | ✓ | ✓ | ✓ | ✓ | ✓ |
| parsed_fields | ✓ | ✓ | ✓ | ✓ | | | | ✓ | ✓ | |
| monitors | ✓ | ✓ | ✓ | | ✓ | ✓ | ✓ | ✓ | ✓ | |
| notifications | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| audit_logs | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

---

*Product Modules v1 — platform foundation.*
