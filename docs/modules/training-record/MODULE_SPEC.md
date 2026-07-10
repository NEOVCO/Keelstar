# Training Record Tracker — Module Spec

> Module slug: `training-record` · App slug: `training` · Entitlement: `training_record` · Workflow type: `training_record`
> Status: **MVP vertical slice** · Last updated: 2026-07-07

---

## 1. One-Sentence Job

Upload employee training certificates, capture completion and expiration dates, and get internal reminders before certifications lapse.

---

## 2. Target Customer

- Healthcare, staffing, manufacturing, property management — any org tracking workforce certifications
- HR Manager, Compliance Officer, Safety Coordinator
- Pain: "We find out a certification expired only when scheduling or during an audit."

---

## 3. Primary User

HR coordinator, compliance clerk, safety manager — internal only, no external participants.

---

## 4. External Participant

None in v1 (internal upload and monitoring only).

---

## 5. MVP Scope

- Person selection from People roster
- Certificate upload (PDF/image/Word)
- Manual fields: course name, provider, completion date, expiration date
- Expiration monitor (`training_expiration`) with `active_monitoring` → `expiring_soon` → `expired`
- Internal reminders at 30/14/7/0 days before expiration
- Per-record evidence CSV export
- Organization training matrix CSV export
- Billing limits (5 active records on free tier)

---

## 6. Exclusions (v1)

LMS integration · course delivery · quiz engine · `training_types` table · bulk import · OCR/AI extraction

---

## 7. Shared Primitives

`vendors` (workforce) · `workflow_instances` · `documents` · `document_parsed_fields` · `monitors` · `reminders` · `audit_logs` · `usage_tracking`

No new domain tables. Migration adds indexes only.

---

## 8. Implementation Reference

| Area | Location |
|------|----------|
| Domain | `src/lib/training/*` |
| API | `/api/training/records` |
| UI | `src/components/training/*`, `/app/apps/training` |
| Worker | `workers/coi-expiration-monitor` (`runTrainingExpirationMonitor`) |
