# Keelstar Product Expansion Playbook

> **Mandatory operating manual for building every future Keelstar vertical module.**
>
> Read this document before writing a single line of module code. No exceptions.

---

## Reference vertical slices

Keelstar has five complete reference vertical slices. All module documentation, patterns, and implementation conventions must follow the same structure and reuse shared primitives proven in these slices.

### W-9 Collection (collection-centric)

**Vendor Document Portal / W-9 Collection** — first reference slice. Proves Collect → Extract → Approve → Audit for vendor document collection.

```
/docs/modules/vendor-document-portal/
```

### COI Tracker (monitoring-centric, external collection)

**COI Tracker** — second reference slice. Extends the W-9 pattern with expiration monitoring, status transitions (`active_monitoring`, `expiring_soon`, `expired`), dual reminder pipelines (request + expiration), external magic-link upload, and manual field capture without new domain tables.

```
/docs/modules/coi-tracker/
```

### Contract Renewal Tracker (monitoring-centric, internal-only)

**Contract Renewal Tracker** — third reference slice. Internal-only obligation monitoring with dual reminder pipelines.

```
/docs/modules/contract-renewal-tracker/
```

### Vendor Packet Portal (multi-document external collection)

**Vendor Packet Portal** — fourth reference slice. Composes W-9 + COI patterns into a single multi-session magic link portal with per-item checklist tasks, progress tracking, and incomplete-packet monitoring.

```
/docs/modules/vendor-packet-portal/
```

### Exclusion Monitoring (screening-centric, internal-only)

**Exclusion Monitoring** — fifth reference slice. Internal-only compliance screening with dedicated result tables, provider abstraction (demo/live OIG, SAM `not_configured`), match review workflow, and monthly `exclusion_monitoring` monitors.

```
/docs/modules/exclusion-monitoring/
```

Future modules must follow the same documentation structure (12 mandatory files) and reuse the shared primitives proven in these slices.

---

## 1. Purpose of the Playbook

This playbook is the **mandatory operating manual** for designing, specifying, building, and launching every future Keelstar vertical module.

Keelstar is not a loose collection of features. It is a **shared multi-tenant SaaS platform** made of focused workflow applications around documents, approvals, compliance, vendors, contracts, HR, finance, reminders, monitoring, and audit trails. Every module must strengthen the platform — not fragment it.

### Mandatory process

**No new vertical module may be built until its module spec exists and has been reviewed against this playbook.**

Before any implementation work begins, the module owner (founder, PM, or agent) must:

1. Read this playbook in full.
2. Read the platform constitution and related docs (see Section 22).
3. Create a module spec at the path below.
4. Complete every section of the module spec template (Section 5).
5. Pass the Module Qualification Framework (Section 4).
6. Confirm shared primitive reuse (Section 6).
7. Only then begin the Build Sequence (Section 20).

### Required deliverable before coding

Every module must create:

```
/docs/modules/[module-slug]/MODULE_SPEC.md
```

Examples:

- `/docs/modules/vendor-document-portal/MODULE_SPEC.md` (W-9)
- `/docs/modules/coi-tracker/MODULE_SPEC.md` (COI)
- `/docs/modules/contract-renewal-tracker/MODULE_SPEC.md` (Contract Renewal)

The module spec **must follow this playbook exactly**. A spec that skips sections, hand-waves audit events, or declares new database tables without justification will be rejected.

### What this playbook governs

| Area | Governed by this playbook |
|------|---------------------------|
| Product strategy | Qualification, MVP scope, exclusions, cross-sell |
| UX | Required pages, patterns, empty/error states |
| Data modeling | Shared primitives, when to add tables |
| Permissions | Role-action matrix per module |
| Auditing | Required events before implementation |
| Reminders | Schedules, idempotency, escalation |
| Magic links | External participant flows |
| Billing | Free utility, paid trigger, entitlements |
| Launch | Readiness checklist before go-live |

### Relationship to other docs

| Document | Role |
|----------|------|
| [NORTH_STAR.md](./NORTH_STAR.md) | Platform constitution — why Keelstar exists |
| [PRODUCT_MODULES.md](./PRODUCT_MODULES.md) | High-level module catalog |
| **This playbook** | How to design and build each module |
| `/docs/modules/[slug]/MODULE_SPEC.md` | Module-specific implementation contract |
| [DEVELOPMENT_RULES.md](./DEVELOPMENT_RULES.md) | Engineering law during implementation |
| [TASKS_TO_COMPLETE.md](./TASKS_TO_COMPLETE.md) | Platform foundation gaps (not module-specific) |

---

## 2. Keelstar Product Philosophy

### One platform, many focused applications

Keelstar is **not** a collection of unrelated SaaS tools bolted together. Keelstar is **one shared platform** made of focused applications. Each application solves **one recurring operational workflow** extremely well.

Users do not "buy Keelstar W-9" and "buy Keelstar COI" as separate products from separate vendors. They subscribe to Keelstar and enable the modules they need. All modules share organizations, users, roles, documents, workflows, monitors, audit logs, and billing.

### What every product must be

| Attribute | Meaning |
|-----------|---------|
| **Narrow** | One clear job-to-be-done. If you cannot state it in one sentence, the module is too broad. |
| **Useful** | Solves a real recurring pain for SMB and mid-market teams — not a hypothetical edge case. |
| **Self-serve** | A competent operations person can start without a sales call, demo, or implementation consultant. |
| **Document-centric** | Artifacts (PDFs, forms, certificates, contracts, signatures) are inputs; the workflow is the product. |
| **Monitoring-centric** | Ongoing visibility is the subscription value — not one-time document handling. |
| **Audit-centric** | Proof of who did what, when, with what evidence — exportable for compliance review. |
| **Easy to explain** | A buyer understands the value in 30 seconds. |
| **Easy to adopt** | First workflow completable in under 15 minutes. |
| **Easy to expand from** | Naturally leads to adjacent modules on the same platform. |

### The universal lifecycle

Every Keelstar module must implement all six stages of the platform lifecycle:

```
Collect → Extract → Approve → Monitor → Notify → Audit
```

Not every stage is equally prominent in every module (e.g. Simple Signer has minimal extraction), but **every stage must be considered** in the module spec. A module that skips Monitor without explicit justification is not a Keelstar module — it is a one-time tool.

---

#### Collect

**Definition:** The platform gathers a document, form, approval, signature, certification, or other evidence from an **internal user** or **external participant**.

**What happens:**
- An internal user uploads a file, creates a record, or initiates a request.
- An external participant receives a magic link and submits the requested artifact.
- An email ingestion or API upload delivers a document (future).
- A form captures structured data that becomes part of the workflow.

**Platform primitives used:** `workflow_instances`, `tasks`, `documents`, `document_versions`, `external_participants`, `magic_links`.

**Module spec must define:**
- Who initiates collection (internal role)?
- Who submits (internal, external, or both)?
- What artifact is collected?
- What triggers collection (manual, scheduled, event from another module)?
- What happens if collection never occurs?

**Examples:**
- W-9 Collector: vendor submits W-9 via magic link.
- COI Tracker: vendor uploads certificate of insurance.
- Policy Acknowledgement: employee acknowledges policy via magic link.
- Invoice Approval Lite: AP clerk uploads invoice PDF.

---

#### Extract

**Definition:** The platform turns the submitted artifact into **structured fields, statuses, dates, obligations, amounts, or requirements** that can be reviewed, monitored, and reported on.

**What happens:**
- OCR, regex, AI, or manual entry populates `document_parsed_fields`.
- Key dates (expiration, renewal, notice deadline) become monitor inputs.
- Amounts, names, policy numbers, and coverage limits become review targets.
- Confidence scores indicate extraction quality; users can override.

**Platform primitives used:** `document_parsed_fields`, `document_versions.status` (`uploaded → processing → parsed | failed`), background job `document_processing`.

**Module spec must define:**
- Which fields are extracted?
- Extraction source priority (manual > user override > AI > OCR > regex > system)?
- Required vs optional fields?
- Validation rules (format, range, cross-field)?
- Behavior when extraction fails?
- Behavior when confidence is low?

**Examples:**
- COI Tracker: extract `expiration_date`, `carrier_name`, `policy_number`, `coverage_limits`.
- Contract Renewal Tracker: extract `renewal_date`, `notice_period_days`, `auto_renewal_clause`.
- Invoice Approval Lite: extract `vendor_name`, `invoice_amount`, `due_date`, `invoice_number`.

---

#### Approve

**Definition:** The platform allows the **right internal user** to review, accept, reject, correct, or escalate the item based on organization policy.

**What happens:**
- A reviewer sees the submitted artifact and extracted fields side by side.
- They approve (workflow advances), reject (external participant notified to resubmit), or request correction.
- Approval may be single-step or multi-step (Manager → Admin).
- Every decision is audited.

**Platform primitives used:** `tasks`, `workflow_steps`, `workflow_instances.status`, RBAC permissions (`workflows.approve`).

**Module spec must define:**
- Who can review (role)?
- Who can approve vs reject vs request correction?
- Is approval single-step or multi-step?
- What happens on rejection (new magic link? same link?)?
- What happens on correction request?
- SLA or due date for internal review?

**Examples:**
- W-9 Collector: AP manager reviews uploaded W-9, approves or requests resubmission.
- Contract Risk Scanner: legal/compliance reviewer flags risk clauses, approves or escalates.
- Invoice Approval Lite: department manager approves invoice amount before payment.

---

#### Monitor

**Definition:** The platform **watches** for future dates, expirations, missing submissions, overdue actions, changed statuses, or recurring checks — continuously, not just at submission time.

**What happens:**
- A `monitors` record is created when a workflow reaches a monitorable state.
- The daily monitor runner evaluates conditions (date approaching, overdue, missing).
- `monitor_runs` log every evaluation.
- Monitors can be paused, resumed, or cancelled.

**Platform primitives used:** `monitors`, `monitor_runs`, `reminder_rules`, background job `monitor-runner`.

**Module spec must define:**
- What object is monitored (document field, task, workflow)?
- What condition triggers concern (expiration, overdue, missing)?
- Monitor run frequency?
- Default reminder schedule?
- Owner when monitor fires?
- Pause/resume behavior?

**This is the subscription value.** Free tools collect once. Paid workflows monitor forever.

**Examples:**
- COI Tracker: monitor `expiration_date`, alert 90/60/30/7 days before lapse.
- Contract Renewal Tracker: monitor `renewal_date` and `notice_period_deadline`.
- Exclusion Monitor: recurring check against OIG/SAM lists on schedule.
- Training Record Tracker: monitor certification expiration.

---

#### Notify

**Definition:** The platform sends **timely reminders, alerts, requests, and escalations** to internal users and external participants via email (and eventually in-app).

**What happens:**
- Monitor evaluation or task due date triggers a `notifications` record.
- The notification sender worker delivers email via Resend.
- `email_events` log delivery status.
- Reminders are idempotent — no duplicate emails for the same window.

**Platform primitives used:** `notifications`, `email_events`, `reminder_rules`, background job `notification-sender`.

**Module spec must define:**
- Every email template (trigger, recipient, subject, variables)?
- Reminder schedule (see Section 13 defaults)?
- Escalation path (who gets notified when overdue)?
- Internal vs external recipients?
- Resend/revoke behavior for magic link emails?

**Examples:**
- W-9 Collector: "Please submit your W-9" → 3 days before due → on due date → 3 days overdue.
- COI Tracker: "Certificate expiring in 30 days" to vendor and internal owner.
- Invoice Approval Lite: "Invoice awaiting your approval" to assigned approver.

---

#### Audit

**Definition:** The platform records **who did what, when, why, and what evidence exists** — append-only, tenant-scoped, exportable.

**What happens:**
- Every important action creates an `audit_logs` entry.
- Entries include actor, action, target, timestamp, metadata, correlation ID.
- Evidence export bundles workflow summary, documents, approvals, and audit trail.

**Platform primitives used:** `audit_logs`, `createAuditLog()`, evidence export (future).

**Module spec must define:**
- Complete list of audit events (Section 14)?
- What evidence is exportable (Section 15)?
- Who can view and export audit data (`audit.view` permission)?

**Examples:**
- Every module: `workflow.created`, `document.uploaded`, `magic_link.used`, `monitor.run`.
- W-9 Collector: `document.approved`, `document.rejected`, `correction_requested`.
- Simple Signer: `document.signed`, `signature.captured`.

---

## 3. What Belongs in Keelstar

### Qualification criteria

A product belongs in Keelstar if **all** of the following are true:

| Criterion | Question to ask |
|-----------|-----------------|
| **Recurring** | Does this workflow happen more than once per year per organization? |
| **Operational** | Does it support day-to-day business operations, not strategic planning? |
| **Document or evidence-driven** | Is there an artifact, form, signature, or record involved? |
| **SMB / mid-market fit** | Is it useful to teams of 5–500 without enterprise IT? |
| **Workflow-based** | Does it have a clear start, steps, and completion? |
| **Monitorable** | Is there something to watch over time (deadline, expiration, recurrence)? |
| **Auditable** | Would someone need proof later for compliance, audit, or dispute? |
| **Permission-sensitive** | Do different roles need different access? |
| **External participants possible** | Might vendors, contractors, employees, or signers participate from outside? |
| **Business evidence** | Does completion produce evidence usable in an audit or dispute? |
| **Self-serve** | Can a user start without professional services? |
| **Shared primitive fit** | Can this be built with workflow, document, task, monitor, magic link, audit? |

If more than two criteria are **false**, the product likely does not belong in Keelstar.

### Strong examples (build these)

| Module | Why it belongs |
|--------|----------------|
| **W-9 Collector** | Recurring vendor onboarding, document-driven, external participants, monitorable (missing W-9s), auditable (tax compliance). |
| **COI Tracker** | Recurring vendor compliance, expiration monitoring, external upload, audit trail for coverage proof. |
| **Contract Renewal Tracker** | Recurring deadline management, date extraction, monitor-driven reminders, audit for renewal decisions. |
| **Contract Risk Scanner** | Document-driven review workflow, approval chain, audit of review decisions. |
| **Exclusion Monitor** | Recurring scheduled checks, monitor-centric, auditable screening history. |
| **Vendor Packet Portal** | Multi-document collection, external portal, completion monitoring, audit trail. |
| **Policy Acknowledgement Tracker** | Recurring HR compliance, external/magic link, overdue monitoring, auditable proof. |
| **Training Record Tracker** | Certification expiration monitoring, document evidence, audit for compliance. |
| **Invoice Approval Lite** | Recurring approval workflow, document upload, overdue monitoring, audit for payment authorization. |
| **Simple Signer** | Document-driven, external signature via magic link, versioned signed artifact, audit of signing event. |

### Weak examples (do not build)

| Idea | Why it does not belong |
|------|------------------------|
| **Generic PDF compression** | One-time utility, no workflow, no monitoring, no audit value. → Free tool at most, not a module. |
| **Generic note-taking** | Not document/compliance driven, no monitoring, no shared primitive fit. |
| **Broad CRM** | Too wide, not focused, not document-centric, competes with Salesforce. |
| **Full accounting system** | Too wide, GL/journal entries are not Keelstar workflows. Invoice Approval Lite is the narrow slice. |
| **Full HRIS** | Too wide. Policy Acknowledgement and Training Record are the narrow slices. |
| **Full CLM** | Too wide. Contract Renewal and Risk Scanner are the narrow slices. |
| **Project management suite** | Tasks in Keelstar drive compliance workflows, not arbitrary kanban. |
| **One-off AI chatbot** | Not workflow-based, not auditable, not monitoring-centric. AI assists extraction — it is not the product. |
| **Generic image generation** | No operational workflow, no compliance value. |
| **Anything without recurring value** | If the user never returns after the first use, it is a free tool — not a subscription module. |

### The free tool vs paid module decision

| Characteristic | Free tool | Paid module |
|----------------|-----------|-------------|
| Usage frequency | One-time or occasional | Recurring |
| Value | Immediate single-task result | Ongoing monitoring and automation |
| Account required | No | Yes (organization) |
| Monitoring | None | Core feature |
| Audit trail | Minimal or none | Full append-only log |
| External participants | Optional | Core feature |
| Billing | Lead generation | Subscription entitlement |

**Rule:** If it can be done once without an account, it is a free tool at `/tools/[slug]`. If it requires ongoing visibility, reminders, and audit proof, it is a paid module.

---

## 4. Module Qualification Framework

Every proposed module must answer **all** of the following questions in its module spec **before build is approved**. Incomplete answers block implementation.

### Pain

**What specific recurring pain does this solve?**

- Describe the pain in the customer's words, not product language.
- Quantify if possible: "AP teams spend 4+ hours per month chasing W-9s via email."
- Identify who feels the pain most acutely.

**Fail if:** The pain is vague ("managing documents is hard") or non-recurring ("we need to sign one contract once").

### Buyer

**Who pays for it?**

- Role and department (AP Manager, Compliance Officer, HR Director, CFO, Operations Lead).
- Company size (SMB, mid-market).
- Is the buyer the same as the primary user?

**Fail if:** No clear buyer or buyer has no budget authority.

### User

**Who uses it day to day?**

- Role(s) that create workflows, upload documents, review submissions, manage monitors.
- Frequency of use (daily, weekly, monthly).
- Technical sophistication (non-technical operations staff).

### External participant

**Does anyone outside the organization need to participate?**

- If yes: who (vendor, contractor, employee, signer, auditor)?
- What do they do (upload, sign, acknowledge, complete form)?
- Do they need an account? (Answer must be **no** — magic link only.)

**If no external participant:** Confirm the module is still document/workflow driven and justify why magic links are not needed.

### Trigger

**What event starts the workflow?**

- Manual creation by internal user?
- Onboarding a new vendor/employee?
- Calendar date (annual renewal check)?
- Completion of another module's workflow (cross-module trigger)?
- Incoming email/API (future)?

### Artifact

**What document, form, record, approval, or evidence is involved?**

- File type(s): PDF, image, DOCX, structured form.
- Is it uploaded, generated, or signed?
- Is versioning required? (Answer: **yes** for all documents.)

### Structured data

**What fields must be extracted or captured?**

- List every field with type (text, date, number, currency, boolean).
- Mark required vs optional.
- Mark which fields drive monitoring.

### Review

**Who reviews the submitted information?**

- Role(s) with `workflows.approve` or module-specific permission.
- What do they see (artifact + extracted fields)?
- Review SLA?

### Decision

**What approval, rejection, correction, or escalation can happen?**

- Approve → workflow completes or advances.
- Reject → external participant resubmits.
- Request correction → specific fields flagged.
- Escalate → assigned to higher role after overdue period.

### Monitoring

**What needs to be watched over time?**

- Date-based (expiration, renewal, deadline)?
- Status-based (missing submission, overdue approval)?
- Recurrence-based (monthly exclusion check)?
- If nothing: **justify why this module has no monitor** (rare).

### Reminder

**What reminders or alerts are required?**

- Use default schedules from Section 13 unless module spec justifies deviation.
- List every reminder: trigger, recipient, channel, template.

### Audit

**What proof must exist later?**

- Who submitted what, when?
- Who approved/rejected, when?
- What document versions existed at time of approval?
- What reminders were sent?
- What monitors fired?

### Return frequency

**Why will the user return?**

- Monitoring dashboard showing upcoming expirations/overdue items.
- New vendors/employees/contracts triggering new workflows.
- Scheduled recurring checks.
- Compliance reporting period.

**Fail if:** User has no reason to return after first use.

### Expansion

**What adjacent Keelstar module should this naturally lead to?**

- Define upstream (feeds into this module) and downstream (this module feeds into).
- See Section 19 for cross-sell rules.

### Willingness to pay

**What ongoing value justifies a subscription?**

- Monitoring and reminders (not one-time extraction).
- Audit trail and evidence export.
- Team collaboration and permissions.
- External participant automation.
- Quantify: "One missed COI expiration can cost significant uninsured liability."

## 5. Mandatory Module Spec Template

Copy this template verbatim into `/docs/modules/[module-slug]/MODULE_SPEC.md` and complete every section.

```markdown
# [Module Name] Module Spec

> Module slug: `[slug]`
> Entitlement key: `[entitlement_key]`
> Workflow type: `[workflow_type]`
> Status: Draft | In Review | Approved | In Build | Complete
> Author:
> Last updated:

---

## 1. One-Sentence Job

What specific job does this module do?

Example: "Collect signed W-9 forms from vendors with reminders and audit trail."

---

## 2. Target Customer

Who buys this?

- Industry:
- Company size:
- Buyer role:
- Buyer pain in their words:

---

## 3. Primary User

Who uses it day to day?

- Role(s):
- Frequency:
- Technical level:

---

## 4. External Participant

Who outside the organization interacts with it?

- Participant type: (vendor / contractor / employee / signer / other)
- Interaction: (upload / sign / acknowledge / complete form)
- Account required: No (magic link only)
- If none: justify

---

## 5. Pain and Current Workaround

### What is painful today?

### How is it currently handled?

(email, spreadsheet, shared drive, paper, ERP module, third-party tool)

### Why is that insufficient?

(lost documents, no reminders, no audit trail, manual chasing, expired coverage)

---

## 6. First Paid Use Case

What is the minimum workflow someone would pay for?

Describe the smallest workflow that delivers recurring monitored value.

---

## 7. MVP Scope

What is included in v1?

Checklist of features that ship in MVP:

- [ ] ...

---

## 8. Explicit Exclusions

What must NOT be built in v1?

List clearly to prevent scope creep:

- ...

---

## 9. End-to-End Workflow

Step-by-step workflow from start to completion.

For **each step**, document:

| Field | Value |
|-------|-------|
| Step number | |
| Step name | |
| Actor | (internal role / external participant / system) |
| Screen | (module home / create flow / external page / review / detail) |
| Object created or updated | (workflow_instance / task / document / monitor / etc.) |
| Status transition | (from → to) |
| Email or notification | (template key, recipient, or "none") |
| Audit event | (action key) |
| Error cases | (what can go wrong, what user sees) |

---

## 10. Objects Used

Which shared Keelstar objects are used?

| Primitive | How used in this module |
|-----------|-------------------------|
| Organization | |
| Member | |
| Role / Permission | |
| Workflow Instance | type = `[workflow_type]` |
| Workflow Step | |
| Task | |
| Document | |
| Document Version | |
| Parsed Field | |
| External Participant | |
| Magic Link | |
| Monitor | |
| Reminder Rule | |
| Notification | |
| Audit Log | |
| Entitlement | key = `[entitlement_key]` |

---

## 11. New Objects Required

Only if absolutely necessary.

| Proposed table/entity | Why shared primitives are insufficient |
|-----------------------|----------------------------------------|
| | |

If none: write "None — all data modeled via shared primitives and workflow metadata jsonb."

---

## 12. Status Models

### Workflow instance statuses

| Internal status | UI status (Section 9) | Meaning | Set by |
|-----------------|----------------------|---------|--------|

### Task statuses

| Internal status | UI status | Meaning | Set by |
|-----------------|-----------|---------|--------|

### Document statuses

| Internal status | UI status | Meaning | Set by |
|-----------------|-----------|---------|--------|

---

## 13. Permissions

Define actions by role.

| Action | Owner | Admin | Manager | Member | Viewer | External |
|--------|-------|-------|---------|--------|--------|----------|
| View records | | | | | | |
| Create records | | | | | | |
| Update records | | | | | | |
| Delete/archive | | | | | | |
| Send external request | | | | | | |
| Resend external request | | | | | | |
| Revoke magic link | | | | | | |
| Approve | | | | | | |
| Reject | | | | | | |
| Request correction | | | | | | |
| Create monitor | | | | | | |
| Edit monitor | | | | | | |
| Export evidence | | | | | | |
| View audit log | | | | | | |
| Manage module settings | | | | | | |

---

## 14. Magic-Link Needs

| Question | Answer |
|----------|--------|
| Does this module require external links? | Yes / No |
| Purpose(s) | (e.g. `w9_submit`, `coi_upload`, `sign_document`) |
| Recipient | |
| Expiry (default) | 7 days |
| Single-use or multi-session? | |
| Allowed actions | |
| Forbidden actions | |
| Visible org information | (org name only) |
| Completion behavior | |
| Expired behavior | |
| Revoked behavior | |
| Already-completed behavior | |
| Audit events | |

---

## 15. Document Handling

| Question | Answer |
|----------|--------|
| Accepted file types | (PDF, PNG, JPG, DOCX) |
| Maximum size | 25 MB |
| Upload source(s) | (internal_upload / external_upload) |
| Document type key | (e.g. `w9`, `coi`, `contract`, `invoice`) |
| Versioning rules | New upload = new version, history preserved |
| Parsed fields | (list with types) |
| Validation rules | |
| Confidence threshold for auto-accept | |
| Manual override behavior | Audited as `document.field_overridden` |
| Rejection/correction behavior | |
| Signed URL expiry | 1 hour |
| Evidence export includes | |

---

## 16. Monitoring and Reminders

| Question | Answer |
|----------|--------|
| Monitoring exists? | Yes / No |
| Monitored object | |
| Monitored date or condition | |
| Default owner | |
| Default reminder schedule | (use Section 13 defaults or custom) |
| Escalation path | |
| Overdue behavior | |
| Pause/resume behavior | |
| Completion behavior | (monitor cancelled when workflow completes?) |
| Monitor run frequency | Daily |
| Audit events | |
| Notification events | |

---

## 17. Audit Events

List **every** audit event for this module:

| Action key | Trigger | Actor type | Target type |
|------------|---------|------------|-------------|
| | | | |

Minimum required: all events from Section 14 of the playbook that apply to this module.

---

## 18. Evidence Export

What evidence should be exportable?

| Evidence item | Included in MVP? | Format |
|---------------|------------------|--------|
| Workflow summary | | CSV |
| Document versions | | |
| Extracted fields | | |
| Field overrides | | |
| Approvals/rejections | | |
| External submissions | | |
| Reminders sent | | |
| Monitor runs | | |
| Audit log events | | |

---

## 19. Emails

| Template key | Trigger | Recipient | Subject (pattern) | CTA |
|--------------|---------|-----------|-------------------|-----|
| | | | | |

---

## 20. UI Screens

| Screen | Route | Primary actions |
|--------|-------|-----------------|
| Module home | `/[slug]` | Create workflow, view active, view reminders |
| List page | `/[slug]/workflows` | Filter, search, bulk actions |
| Detail page | `/[slug]/workflows/[id]` | Review, approve, assign, create monitor |
| Create flow | `/[slug]/new` | Step-by-step creation |
| Review screen | (within detail) | Approve, reject, request correction |
| External flow | `/external/[token]` | Submit artifact |
| Settings | `/[slug]/settings` | Module-specific config (if any) |

---

## 21. Empty States

| Screen | Empty state message | CTA |
|--------|---------------------|-----|
| Module home (no workflows) | | Create first workflow |
| List page (no results) | | |
| Detail page (no documents) | | |
| Monitor dashboard (no monitors) | | |

---

## 22. Error States

| Error | User message | Recovery action |
|-------|--------------|-----------------|
| Upload failed (size) | | Reduce file size |
| Upload failed (type) | | Upload PDF instead |
| Extraction failed | | Enter fields manually |
| Magic link expired | | Contact [org name] |
| Permission denied | | Ask your admin |
| Monitor run failed | | (internal — retry next day) |

---

## 23. Analytics Events

### Activation

| Event | Trigger |
|-------|---------|
| `[module]_first_workflow_created` | |
| `[module]_first_document_uploaded` | |
| `[module]_first_external_request_sent` | |
| `[module]_first_external_completion` | |
| `[module]_first_approval` | |
| `[module]_first_monitor_created` | |

### Retention

| Event | Trigger |
|-------|---------|
| `[module]_second_workflow_created` | |
| `[module]_reminder_acted_on` | |
| `[module]_monitor_viewed` | |
| `[module]_evidence_exported` | |

### Expansion

| Event | Trigger |
|-------|---------|
| `[module]_cross_sell_clicked` | |
| `[module]_upgrade_clicked` | |

### Friction

| Event | Trigger |
|-------|---------|
| `[module]_upload_failed` | |
| `[module]_extraction_failed` | |
| `[module]_magic_link_expired` | |
| `[module]_external_abandoned` | |
| `[module]_workflow_creation_abandoned` | |

---

## 24. Billing and Limits

| Item | Value |
|------|-------|
| Free utility | (tool slug or "none") |
| Free plan limit | (e.g. 3 workflows, 1 monitor) |
| Paid plan trigger | (monitoring, external requests, team access) |
| Usage limits (paid) | |
| Document limits | |
| Monitor limits | |
| Evidence export access | (paid only / all) |
| Entitlement key | |
| Upgrade prompt locations | (module home, monitor creation, export button) |

---

## 25. Cross-Sell

| Direction | Module | Contextual prompt |
|-----------|--------|-------------------|
| Upstream | | |
| Downstream | | |
| Related | | |

Prompts must be contextual and non-blocking (Section 19 of playbook).

---

## 26. QA Checklist

- [ ] Happy path: create → collect → extract → approve → monitor → complete
- [ ] External participant flow via magic link
- [ ] Permission denied for unauthorized role
- [ ] Tenant isolation (Org A cannot see Org B data)
- [ ] Document version history preserved on re-upload
- [ ] Parsed field override audited
- [ ] Reminder sent at correct interval (not duplicated)
- [ ] Monitor run idempotent
- [ ] Magic link single-use enforced
- [ ] Magic link expiry enforced
- [ ] Audit events created for all actions in Section 17
- [ ] Email logged in notifications + email_events
- [ ] Entitlement gating works (module hidden/disabled without subscription)
- [ ] Empty states render correctly
- [ ] Error states render correctly
- [ ] Mobile external flow usable

---

## 27. Acceptance Criteria

What must be true before this module is considered complete?

- [ ] All MVP scope items (Section 7) implemented
- [ ] All exclusions (Section 8) respected — nothing extra shipped
- [ ] All audit events (Section 17) wired and verified
- [ ] All emails (Section 19) sending and logged
- [ ] All UI screens (Section 20) functional
- [ ] QA checklist (Section 26) passed
- [ ] Launch readiness checklist (Section 21 of playbook) passed
- [ ] Module registered in `src/lib/modules/modules.ts`
- [ ] Module spec status updated to Complete
```

## 6. Shared Primitive Checklist

Before creating new database tables, components, permissions, or workflows, **always** check whether the module can use existing shared primitives.

### Available shared primitives

| Primitive | Table / location | Purpose |
|-----------|------------------|---------|
| **Organization** | `organizations` | Tenant boundary |
| **Member** | `organization_members` | User ↔ org link |
| **Role** | `roles`, `member_roles` | RBAC role assignment |
| **Permission** | `permissions`, `role_permissions` | Granular access control |
| **Vendor** | `workflow_instances.metadata` or future `vendors` table | Vendor identity (prefer metadata until reporting requires table) |
| **Person** | `external_participants` or metadata | Employee/contractor identity for external flows |
| **External Participant** | `external_participants` | Non-account holder |
| **Workflow Instance** | `workflow_instances` | Running workflow (`type` = module workflow type) |
| **Workflow Step** | `workflow_steps` | Steps within instance |
| **Task** | `tasks` | Actionable items |
| **Document** | `documents` | Logical document entity |
| **Document Version** | `document_versions` | Immutable version history |
| **Parsed Field** | `document_parsed_fields` | Extracted/overrideable key-value data |
| **Monitor** | `monitors` | Scheduled monitoring rule |
| **Monitor Run** | `monitor_runs` | Log of every monitor execution |
| **Reminder Rule** | `reminder_rules` | Timing rules for reminders |
| **Notification** | `notifications` | Notification record (email or in-app) |
| **Email Event** | `email_events` | Email delivery tracking |
| **Magic Link** | `magic_links` | Secure external access token |
| **Audit Log** | `audit_logs` | Append-only action record |
| **Evidence Export** | API endpoint (future) | Compliance bundle |
| **Subscription** | `subscriptions` | Stripe subscription |
| **Entitlement** | `organization_entitlements` | Module access gate |

### The reuse rule

> **If a shared primitive can reasonably support the feature, reuse it.**
>
> Do not create product-specific primitives unless the module spec (Section 11) clearly explains why the shared primitive is insufficient.

### Examples

#### Bad: product-specific document table

Creating a `w9_documents` table with columns: id, vendor_name, tin, filename, status.

**Why bad:** `documents`, `document_versions`, and `document_parsed_fields` already model this. Use `documents.document_type = 'w9'` and parsed fields for `vendor_name`, `tin`.

#### Good: shared document tables

```
workflow_instances.type = 'w9_collection'
documents.document_type = 'w9'
document_parsed_fields: vendor_name, tin, address, entity_type
```

#### Bad: custom reminder logic in COI Tracker

`CoiReminderService` sends emails directly when expiration < 30 days.

**Why bad:** Bypasses shared monitor/reminder/notification pipeline. No idempotency, no audit, no email_events logging.

#### Good: shared monitor pipeline

```
monitors.monitor_type = 'coi_expiration'
reminder_rules: days_before = 90, 60, 30, 14, 7, 0
monitor-runner worker evaluates → creates notifications → notification-sender delivers
```

#### Bad: module-specific status table

`coi_statuses: id, coi_id, status, changed_at, changed_by`

**Why bad:** Duplicates workflow/task status tracking and audit_logs.

#### Good: workflow + audit

```
workflow_instances.status = 'active' | 'completed' | 'cancelled'
tasks.status = 'pending' | 'completed' | 'overdue'
audit_logs: coi.approved, coi.rejected at each transition
```

#### Bad: hardcoded module navigation

`AppSidebar.tsx` contains a hardcoded array of module names separate from `modules.ts`.

**Why bad:** Multiple places to update for every new module.

#### Good: single module registry

```
src/lib/modules/modules.ts → MODULES array
AppSidebar, module pages, billing, marketing all read from MODULES.
```

### When new tables ARE justified

Create product-specific tables **only when**:

1. **Reporting would become impossible** without normalized data (e.g. 10,000 vendors with complex relational queries).
2. **Constraints are materially different** (e.g. exclusion check results with match scores from external API).
3. **The shared primitive would become confusing** (e.g. overloading `workflow_instances.metadata` with 50 fields).
4. **Security requirements differ** (e.g. PHI segregation — unlikely in Keelstar SMB focus).
5. **The module requires its own lifecycle** that cannot be modeled with workflow/task/document/monitor.

Even then: document the justification in Section 11 of the module spec and get explicit approval.

---

## 7. Universal Data Model Rules

These rules apply to **every** module without exception. Violations block merge.

### Tenant scoping

Every tenant-scoped table must include:

```sql
organization_id uuid NOT NULL REFERENCES organizations(id),
created_at timestamptz DEFAULT now(),
updated_at timestamptz DEFAULT now()
```

Every tenant-scoped table must have **RLS enabled**.

Every query must filter by `organization_id` from verified membership — never trust client-provided org ID.

### State changes and audit

Every object that changes state must produce audit events. If you cannot name the audit event, reconsider the feature.

### Document versioning

Every document update must create a new `document_versions` row. Never overwrite files in storage. Never UPDATE a version row's file content.

### External actions

Every external participant action must:
- Be linked to a valid `magic_links` record.
- Produce an audit event with `actor_type: 'external'`.
- Never create a Supabase Auth user account.

### Reminders

Every reminder must be linked to a `monitors` or `tasks` record. No ad-hoc cron jobs sending emails outside the notification pipeline.

### Email logging

Every email send must create:
1. A `notifications` row.
2. An `email_events` row.
3. An audit event (`notification.sent` or module-specific).

### Prefer shared tables + metadata

Use this pattern by default:

```typescript
workflow_instances {
  type: 'coi_tracking',
  status: 'active',
  metadata: {
    vendor_name: 'Acme Corp',
    vendor_email: 'vendor@acme.com',
    required_coverage: { general_liability: 1000000 },
  }
}
```

Only create product-specific tables when the criteria in Section 6 are met.

---

## 8. Universal UX Rules

Every module must reuse standard Keelstar UX patterns. Consistency builds trust and reduces development time.

### Design principles

- Premium, minimal, serious — inspired by Stripe, Linear, Mercury.
- Dense but readable — operations users want information, not whitespace.
- No AI slop — no generic gradients, no robot illustrations, no hype copy.
- Subtle motion only where it aids comprehension.
- Mobile-friendly external flows (vendors sign on phones).

### Module Home

**Route:** `/[module-slug]` (e.g. `/w9`, `/coi`)

**Must show:** module name and job, primary CTA, active workflows, documents needing review, upcoming reminders, recent activity, one cross-sell suggestion.

**Must not show:** unrelated modules, full org audit log, billing details.

### List Page

**Must show:** records, status badges (Section 9), owner, due date, filters, search, bulk actions, empty state with CTA.

### Detail Page

**Must show:** header, status, owner, due date, related documents, extracted fields, tasks, monitor, activity timeline, audit history, action buttons.

### Create Flow

- Step-by-step wizard, maximum 4 steps for MVP.
- Pre-select module type. Validate entitlement first.
- Success redirects to detail page.

### Review Flow

- Submitted artifact + extracted fields side by side.
- Approve / reject / request correction with audited actions.

### External Flow

- Route: `/external/[token]`
- No app navigation. Org name + task only. Mobile-friendly.

### Completion State

- Summary, monitor status, audit timeline, evidence export (if entitled).

### Audit / Evidence View

- Requires `audit.view`. Append-only timeline. Export button where defined.

### UX deviation rule

> No module should invent a radically different UX unless the module spec (Section 20) justifies the deviation.

## 9. Universal Status Mapping

Module-specific internal statuses must map to **shared UI status categories** for consistent badges, filters, and dashboards.

### Shared UI statuses

| UI status | Badge color | Meaning |
|-----------|-------------|---------|
| `draft` | Neutral | Created but not yet active |
| `active` | Blue/accent | In progress |
| `waiting_internal` | Yellow | Blocked on internal action |
| `waiting_external` | Yellow | Blocked on external participant |
| `review_needed` | Orange | Submitted, awaiting review |
| `approved` | Green | Approved by reviewer |
| `rejected` | Red | Rejected by reviewer |
| `completed` | Green | Workflow finished successfully |
| `overdue` | Red | Past due date |
| `expiring_soon` | Orange | Monitor: approaching expiration |
| `paused` | Neutral | Monitor or workflow paused |
| `cancelled` | Neutral | Cancelled by user |
| `failed` | Red | Processing or extraction failed |
| `archived` | Neutral | Archived, read-only |

### Module spec must define

1. Internal statuses — values stored in database.
2. UI status mapping — how each internal status maps to shared UI status.
3. Who can change each status — role required.
4. What action changes it — user action or system event.
5. Notification trigger — does this transition send email?
6. Audit event — what action key is logged?

### Example: W-9 Collector

| Internal status | UI status | Changed by | Action | Notification | Audit |
|-----------------|-----------|------------|--------|--------------|-------|
| `draft` | `draft` | Member+ | Create workflow | None | `workflow.created` |
| `active` | `waiting_external` | System | Magic link sent | `magic_link_task_request` | `magic_link.created` |
| `active` | `review_needed` | External | W-9 uploaded | `document_submitted` | `document.version_created` |
| `active` | `approved` | Manager+ | Approve W-9 | `task_completed` | `document.approved` |
| `active` | `rejected` | Manager+ | Reject W-9 | `correction_requested` | `document.rejected` |
| `completed` | `completed` | Manager+ | Mark complete | None | `workflow.completed` |
| `cancelled` | `cancelled` | Admin+ | Cancel workflow | None | `workflow.cancelled` |

---

## 10. Universal Permission Rules

All permissions are organization-scoped. No authorization without organization context. See [RBAC.md](./RBAC.md).

### Default roles

| Role | Typical module access |
|------|----------------------|
| **Owner** | Full access including billing and settings |
| **Admin** | Full module access except billing |
| **Manager** | Create, review, approve, manage monitors, view audit |
| **Member** | Create workflows, upload documents, complete assigned tasks |
| **Viewer** | Read-only access to records and monitors |
| **External Participant** | Not a role — magic link only, scoped to one task |

### Required permission matrix

Every module spec (Section 13) must define permissions for:

| Action | Suggested permission key |
|--------|-------------------------|
| View records | `workflows.view` + module entitlement |
| Create records | `workflows.create` + module entitlement |
| Update records | `workflows.update` |
| Delete/archive records | `workflows.update` |
| Send external request | `workflows.create` |
| Resend external request | `workflows.update` |
| Revoke magic link | `workflows.update` |
| Approve | `workflows.approve` |
| Reject | `workflows.approve` |
| Request correction | `workflows.approve` |
| Create monitor | `monitors.manage` |
| Edit monitor | `monitors.manage` |
| Export evidence | `audit.view` |
| View audit log | `audit.view` |
| Manage module settings | `settings.manage` |

### Permission UX rules

| Situation | Behavior |
|-----------|----------|
| User lacks permission, action irrelevant | Hide the action entirely |
| User lacks permission, action contextually relevant | Show disabled with explanation |
| User lacks entitlement | Show upgrade prompt |
| Never | Show action that silently fails |

---

## 11. Magic-Link Rules

External participants should **not** need accounts. See [MAGIC_LINKS.md](./MAGIC_LINKS.md).

### Every module using external participants must define

| Requirement | Module spec section |
|-------------|---------------------|
| Purpose of the link | Section 14 (e.g. `w9_submit`) |
| Recipient | Section 4 |
| Expiry | Default 7 days |
| Single-use or multi-session | Default single-use |
| Allowed actions | Section 14 |
| Forbidden actions | No app navigation, no org data, no other tasks |
| Visible organization information | Organization name only |
| Completion / expired / revoked / already-completed behavior | Section 14 |
| Audit events | `magic_link.created`, `magic_link.used`, `magic_link.revoked` |

### Magic-link page checklist

- [ ] Keelstar branding (logo, minimal)
- [ ] Requesting organization name
- [ ] Task title, description, purpose
- [ ] Due date if relevant
- [ ] Mobile-friendly layout
- [ ] No internal navigation
- [ ] No unrelated organization data exposed
- [ ] Graceful error states (expired, revoked, used, not found)

### Security

- Token stored as SHA-256 hash only. 256-bit entropy. Rate limited. HTTPS enforced. No enumeration.

---

## 12. Document Handling Rules

Every module involving documents must complete Section 15 of the module spec.

### Required definitions

Accepted file types, maximum size (25 MB default), upload source, document type key, versioning rules, parsed fields, validation, confidence behavior, override behavior, rejection/correction behavior, signed URL expiry, evidence export scope.

### Universal document rules

| Rule | Rationale |
|------|-----------|
| Never overwrite documents | Audit and compliance require history |
| Always create new versions | Increment `version_number` |
| Never expose public storage URLs | Signed URLs with expiration only |
| Always show current version | Detail page defaults to latest |
| Always preserve history | Version list on detail page |
| Always audit upload, review, override, download | See Section 14 |

### Storage path convention

```
organizations/{organization_id}/documents/{document_id}/versions/{version_number}/{filename}
```

Never deviate from this path structure.

---

## 13. Monitoring and Reminder Rules

Every module spec must explicitly answer: **Does this module need monitoring?** If No, justify (rare).

### Required monitor definitions

Monitored object, condition, owner, reminder schedule, escalation path, overdue behavior, pause/resume, completion behavior, run frequency (daily default), audit events, notification events.

### Default reminder schedules

#### For expirations (COI, training cert, contract renewal)

| Days before | Recipient | Template |
|-------------|-----------|----------|
| 90 | Internal owner | `reminder` |
| 60 | Internal owner | `reminder` |
| 30 | Internal owner + external | `reminder` |
| 14 | Internal owner + external | `reminder` |
| 7 | Internal owner + external | `overdue_reminder` |
| 0 | Internal owner + external | `overdue_reminder` |

#### For task requests (W-9, policy acknowledgement, signature)

| Timing | Recipient | Template |
|--------|-----------|----------|
| 3 days before due | External participant | `reminder` |
| On due date | External + internal owner | `reminder` |
| 3 days overdue | External + internal owner | `overdue_reminder` |
| 7 days overdue | Internal owner + escalation role | `overdue_reminder` |

### Idempotency

- No duplicate emails for the same reminder window.
- Monitor runs idempotent — same monitor + same day = skip.

## 14. Audit Rules

Every module must define audit events in Section 17 of the module spec **before implementation begins**.

### Required audit event categories

Include all that apply:

| Category | Action keys |
|----------|-------------|
| **Lifecycle** | `[module].created`, `[module].updated`, `[module].deleted`, `[module].archived` |
| **Submission** | `[module].submitted`, `document.uploaded`, `document.version_created` |
| **Extraction** | `document.parsed`, `document.field_overridden` |
| **Review** | `[module].reviewed`, `[module].approved`, `[module].rejected`, `[module].correction_requested` |
| **Magic link** | `magic_link.created`, `magic_link.opened`, `magic_link.used`, `magic_link.revoked` |
| **Email** | `notification.sent`, `notification.failed` |
| **Reminder** | `reminder.created`, `reminder.sent` |
| **Monitor** | `monitor.created`, `monitor.run`, `monitor.paused`, `monitor.cancelled` |
| **Export** | `evidence.exported`, `audit.exported` |
| **Permission** | `member.role_changed` (if module-specific settings) |

### Required audit entry fields

`organization_id`, `actor_type`, `actor_id`, `actor_email` (when available), `action`, `target_type`, `target_id`, `timestamp`, `metadata`, `correlation_id`, `ip_address`, `user_agent`.

### Append-only rule

Audit logs are **never updated or deleted** by application code.

---

## 15. Evidence Export Rules

Every module must define what "evidence" means (Section 18 of module spec).

### Evidence may include

Workflow summary, documents, document versions, extracted fields, field overrides, approvals, rejections, correction requests, external submissions, signatures, reminders sent, monitor runs, timestamps, audit log events.

### MVP export guidance

- MVP format: **CSV** for structured data. ZIP with documents post-MVP.
- Do not overbuild PDF export in v1.
- **Do define** what evidence must eventually contain.
- Export audited as `evidence.exported`. Requires `audit.view`.

---

## 16. Email and Notification Rules

Every module must define required emails in Section 19 of the module spec.

### Each email definition must include

Template key, trigger, recipient, subject pattern, purpose, CTA, key variables, security/privacy note (if needed), related audit event.

### Email tone

| Do | Don't |
|----|-------|
| Plain, professional language | Marketing fluff |
| Organization name for trust | Generic "A company has requested..." |
| Clear single CTA | Multiple competing buttons |
| Expiration notice | Urgency manipulation |

### Logging requirements

Every sent email creates: `notifications` row, `email_events` row, audit event.

---

## 17. Analytics Rules

Every module must define analytics events in Section 23 of the module spec.

### Activation (first time)

`[module]_first_workflow_created`, `_first_document_uploaded`, `_first_external_request_sent`, `_first_external_completion`, `_first_approval`, `_first_monitor_created`.

### Retention (return usage)

`[module]_second_workflow_created`, `_reminder_acted_on`, `_monitor_viewed`, `_evidence_exported`.

### Expansion (cross-sell and upgrade)

`[module]_cross_sell_clicked`, `_module_locked_clicked`, `_team_member_invited`, `_billing_page_viewed`, `_upgrade_clicked`.

### Friction (drop-off and failure)

`[module]_upload_failed`, `_extraction_failed`, `_magic_link_expired`, `_external_abandoned`, `_workflow_creation_abandoned`, `_reminder_failed`.

### Analytics properties

Include `organization_id` (PostHog group), `module_slug`, `workflow_type`. Never include document contents, PII field values, or full email addresses.

---

## 18. Billing and Entitlement Rules

Every module must define billing in Section 24 of the module spec.

### Required definitions

Free utility, free plan limit, paid plan trigger, usage limits, team limits, document limits, monitor limits, evidence export access, entitlement key, upgrade prompt locations.

### Upgrade prompt philosophy

| Good | Bad |
|------|-----|
| "Monitor this certificate before it expires." | "Upgrade now to unlock power!" |
| "Send automated reminders to vendors." | "Premium feature — pay now" |

Show value at the moment the user needs it — not on every page load.

### Entitlement enforcement

- Module navigation hidden if entitlement missing.
- API routes reject without entitlement (403).
- Upgrade prompt at point of need, not blocking unrelated actions.

---

## 19. Cross-Sell Rules

Every module must define upstream and downstream relationships in Section 25 of the module spec.

### Cross-sell principles

Contextual, useful, subtle, non-blocking, honest.

### Module relationship map

**W-9 Collector** → downstream: COI Tracker, Vendor Packet Portal, Exclusion Monitor

**COI Tracker** → upstream: W-9, Vendor Packet; downstream: Vendor Packet Portal

**Contract Renewal Tracker** → upstream: Contract Risk Scanner; downstream: Simple Signer

**Contract Risk Scanner** → downstream: Contract Renewal Tracker, Simple Signer

**Exclusion Monitor** → upstream: W-9, Vendor Packet

**Vendor Packet Portal** → upstream: W-9, COI; downstream: Exclusion Monitor

**Policy Acknowledgement** → downstream: Training Record Tracker

**Training Record Tracker** → upstream: Policy Acknowledgement

**Invoice Approval Lite** → upstream: W-9 Collector

**Simple Signer** → upstream: Contract Renewal, Contract Risk Scanner

### Cross-sell UI pattern

Show **one** contextual suggestion card on module home and detail page. Never on external participant pages. Never blocking task completion.

---

## 20. Build Sequence for Every Module

| Step | Action | Deliverable |
|------|--------|-------------|
| 1 | Create module spec | `/docs/modules/[slug]/MODULE_SPEC.md` |
| 2 | Qualification review | Section 4 complete |
| 3 | MVP scope and exclusions | Sections 7 and 8 |
| 4 | Objects and statuses | Sections 10, 11, 12 |
| 5 | Permissions | Section 13 |
| 6 | Workflow definition | Section 9 (every step) |
| 7 | Audit events | Section 17 |
| 8 | Reminder logic | Section 16 |
| 9 | Emails | Section 19 |
| 10 | UI screens | Section 20 |
| 11 | Analytics events | Section 23 |
| 12 | QA checklist | Section 26 |
| 13 | Update shared module config | `src/lib/modules/modules.ts` |
| 14 | Database changes | Only if Section 11 justifies |
| 15 | UI implementation | Shared components, Section 8 patterns |
| 16 | Backend logic | API routes, service layer, workers |
| 17 | External flow | If Section 14 requires |
| 18 | Tests | Unit + integration per Section 26 |
| 19 | Seed/demo data | Demo workflow for QA |
| 20 | Launch checklist | Section 21 below |

> **No module should start from UI alone.** Spec first. Always.

---

## 21. Launch Readiness Checklist

### Product

- [ ] Clear pain, buyer, first paid use case
- [ ] MVP scope complete, exclusions respected
- [ ] Cross-sell path defined
- [ ] One-sentence job visible on module home

### UX

- [ ] Module home, list, detail, create, review flows
- [ ] External flow mobile-friendly (if applicable)
- [ ] Empty and error states
- [ ] Permissions behavior (hide/disable/upgrade)
- [ ] Audit timeline on detail page

### Technical

- [ ] Organization-scoped, RLS verified
- [ ] Permissions enforced server-side
- [ ] Signed URLs only for storage
- [ ] All audit events wired
- [ ] No unnecessary new tables
- [ ] Workers idempotent, emails logged
- [ ] Magic links secure (if used)
- [ ] Entitlement gating enforced
- [ ] Module in `modules.ts` registry

### Business

- [ ] Pricing trigger and entitlement key defined
- [ ] Usage limits enforced
- [ ] Contextual upgrade prompts
- [ ] Analytics events defined

### QA

- [ ] Happy path end-to-end
- [ ] Permission, tenant isolation, external link tests
- [ ] Document version, email, reminder, audit tests

---

## 22. Cursor Behavior Rules

### Before building any vertical module, you must:

1. Read this playbook.
2. Read `/docs/NORTH_STAR.md`.
3. Read `/docs/ARCHITECTURE.md`.
4. Read `/docs/RBAC.md`.
5. Read `/docs/AUDIT_LOGGING.md`.
6. Read `/docs/MAGIC_LINKS.md`.
7. Create or update `/docs/modules/[module-slug]/MODULE_SPEC.md`.
8. Confirm shared primitive reuse (Section 6).
9. Explain any proposed new primitives (Section 11).
10. Build only after the spec is complete (all 27 sections).

### You must not:

| Prohibition | Reason |
|-------------|--------|
| Create product-specific database tables by default | Shared primitives first |
| Invent new UX patterns unnecessarily | Consistency (Section 8) |
| Skip audit logging | Compliance (Section 14) |
| Skip RLS | Security ([DEVELOPMENT_RULES.md](./DEVELOPMENT_RULES.md)) |
| Expose storage files publicly | Security (Section 12) |
| Create external user accounts for magic-link participants | Philosophy (Section 11) |
| Hardcode module metadata in multiple places | Use `modules.ts` |
| Build outside MVP scope | Scope control |
| Add fake metrics or marketing fluff | Integrity |
| Create inconsistent statuses | Section 9 mapping |
| Send emails outside notification pipeline | Section 16 |
| Implement monitoring as ad-hoc cron | Section 13 |
| Start without complete module spec | Section 20 |

---

## 23. Example Mini Specs

Abbreviated examples. Full specs must use the complete template from Section 5.

### W-9 Collector

**Job:** Collect valid W-9s from vendors with reminders and audit trail.

**Shared primitives:** Workflow (`w9_collection`), Task, Document, Parsed Fields, Magic Link, Monitor, Notification, Audit Log.

**MVP:** Create vendor workflow, send magic link, vendor uploads W-9, extract name/address, internal review approve/reject, monitor missing W-9s, reminders, evidence export.

**Exclusions:** IRS TIN matching, 1099 filing, W-8 forms, accounting integrations, bulk CSV import.

**Entitlement:** `w9_collector`

---

### COI Tracker

**Job:** Track vendor certificates of insurance and avoid expired coverage.

**Shared primitives:** Workflow (`coi_tracking`), Document, Parsed Fields, Monitor, Reminder Rule, Magic Link, Notification, Audit Log.

**MVP:** Request/upload COI, extract expiry and carrier, review fields, expiration monitor, 90/60/30/14/7/0 day reminders, evidence export.

**Exclusions:** Live carrier verification, claims workflows, enterprise risk scoring, broker integration.

**Entitlement:** `coi_tracker`

---

### Contract Renewal Tracker

**Job:** Never miss contract renewal or notice deadlines.

**Reference slice:** Third — internal-only monitoring variant. Full docs at `/docs/modules/contract-renewal-tracker/`.

**Shared primitives:** Workflow (`contract_renewal`), Document, Parsed Fields, Monitor (`contract_renewal`), Reminder, Notification, Audit Log. No magic links or external tasks in v1.

**MVP:** Create contract record, internal PDF upload, manual field entry (`renewal_date` required), activate monitoring, status transitions (`active_monitoring` → `expiring_soon` → `expired`), internal reminders at 90/60/30/0 days, evidence CSV export.

**Exclusions:** Magic links, external participants, OCR/AI extraction, full CLM, redlining, negotiation, Word plugin, e-signature (use Simple Signer), template library, legal advice, notice-deadline reminder pipeline (display only in v1).

**Entitlement:** `contract_renewal`

---

## 24. Final Instruction

**Every Keelstar module must make the platform stronger.**

If a module does not reuse shared primitives, create recurring monitored value, produce audit evidence, and fit the Collect → Extract → Approve → Monitor → Notify → Audit model, it should not be built.

Keelstar wins by being the one platform where every operational document workflow shares the same foundation, the same trust model, and the same audit trail.

Build narrow. Build monitored. Build auditable. Build on the platform.

---

*Product Expansion Playbook v1 — mandatory reading before every new module.*

