# Exclusion Monitoring — Module Spec

> Module slug: `exclusion-monitor` · App slug: `exclusions` · Entitlement: `exclusion_monitor` · Workflow type: `exclusion_screening`
> Status: **Vertical slice v1** · Monitor type: `exclusion_monitoring`

---

## 1. One-Sentence Job

Screen vendors and people against OIG LEIE and SAM exclusion sources, review potential matches, schedule recurring checks, and maintain audit-ready evidence.

---

## 2. Target Customer

Healthcare-adjacent providers, government contractors, staffing firms, and any organization that must prove exclusion screening occurred on a specific date.

---

## 3. Primary User

Compliance coordinator, credentialing specialist, vendor manager, HR operations.

---

## 4. External Participant

None in MVP. Internal-only screening workflow.

---

## 5. Pain

Manual OIG/SAM searches, spreadsheet logs, screenshots, forgotten periodic re-checks, no defensible audit trail.

---

## 6. First Paid Use Case

Add a vendor or person, run OIG screening, review any potential match, export CSV evidence, enable monthly monitor.

---

## 7. MVP Scope

See QA_CHECKLIST.md. Ad hoc + scheduled screening, review workflow, monitors, audit, CSV export, billing limits, demo/live provider modes.

---

## 8. Explicit Exclusions (v1)

Legal/compliance determinations · official government certification · payment/payroll blocking · state Medicaid lists · OFAC · bulk upload · fuzzy matching beyond normalized exact match · API exports · case management beyond review status.

---

## 9. Shared Primitives

`organizations`, `vendors`, `workflow_instances`, `monitors`, `monitor_runs`, `notifications`, `audit_logs`, `usage_tracking`, `evidence_exports`

---

## 10. Dedicated Tables

`screening_subjects`, `screening_runs`, `screening_results`, `screening_matches` — tenant-scoped with RLS.

---

## 11. Compliance Positioning

Keelstar organizes exclusion screening workflows and audit evidence. Results require human review. Not legal advice. Not an official government source.

---

## 12. Data Mode

`EXCLUSION_DATA_MODE=live|demo`. UI labels data source. SAM requires `SAM_API_KEY` or returns `not_configured`.
