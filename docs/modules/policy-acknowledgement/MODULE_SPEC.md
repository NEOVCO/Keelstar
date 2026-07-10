# Policy Acknowledgement Tracker — Module Spec

> Module slug: `policy-acknowledgement` · App slug: `policies` · Entitlement: `policy_acknowledgement` · Workflow type: `policy_acknowledgement`
> Status: **MVP vertical slice** · Last updated: 2026-07-07

---

## 1. One-Sentence Job

Distribute company policies to employees and contractors, collect signed acknowledgements via secure magic links, and maintain timestamped proof for HR and compliance audits.

---

## 2. Target Customer

- **Industry:** Healthcare, property management, professional services, any regulated SMB
- **Company size:** SMB and mid-market (5–500 employees)
- **Buyer role:** HR Manager, Compliance Officer, Operations Director
- **Buyer pain:** "We cannot prove employees read and acknowledged updated policies when auditors ask."

---

## 3. Primary User

- HR coordinator, compliance clerk, office manager
- Periodic use during policy rollouts and annual re-acknowledgement cycles
- Non-technical; needs completion tracking and exportable evidence

---

## 4. External Participant

- **Type:** Employee or contractor (from People roster — `vendors` with `record_type` employee/contractor)
- **Interaction:** Read policy PDF and acknowledge via magic link (`policy_acknowledgement`)
- **Account required:** No

---

## 5. Pain and Current Workaround

### Pain
- Paper sign-off sheets or email replies with no central tracking
- No proof of when someone acknowledged which policy version
- Chasing stragglers manually before deadlines
- Audit requests require digging through email and shared drives

### Current workaround
Email policy PDF → ask for reply "I acknowledge" → spreadsheet of names → calendar reminders

### Why insufficient
No versioning proof, no secure link audit trail, no automated overdue reminders, no exportable evidence bundle

---

## 6. First Paid Use Case

Upload a policy document, assign an acknowledgement request to an employee, send a magic link, receive typed-name acknowledgement with timestamp, and export evidence for compliance review.

---

## 7. MVP Scope

- Person selection from People roster (`vendors` workforce records)
- Internal policy document upload (PDF/Word)
- Acknowledgement request creation and send via magic link
- External acknowledge page at `/external/policy/[token]`
- Auto-complete workflow on acknowledgement (no internal review gate)
- Request reminders (7d before due, on due, 7d overdue) via `reminder-sender` worker
- Audit events for all actions
- Evidence CSV export
- Billing limits (3 requests/month, 5 active records on free tier)

---

## 8. Explicit Exclusions (v1)

Policy authoring/versioning system · HRIS integration · bulk roster import for ack campaigns · quiz/attestation questions · e-signature certificate PDF · department-level rollups · manager escalation emails · dedicated `policy_acknowledgements` table · OCR/AI extraction

---

## 9. Shared Primitives Reused

| Primitive | Usage |
|-----------|--------|
| `organizations` | Tenant |
| `organization_members` | Internal users |
| `vendors` | People roster (employee/contractor) |
| `workflow_instances` | Policy request (`type = policy_acknowledgement`) |
| `tasks` | External acknowledgement task |
| `external_participants` | Employee/contractor contact |
| `magic_links` | Secure ack link (`purpose = policy_acknowledgement`) |
| `documents` / `document_versions` | Policy file storage (`document_type = policy`) |
| `document_parsed_fields` | Acknowledgement metadata (name, timestamp) |
| `reminders` | Request/overdue reminder rows |
| `notifications` / `email_events` | Email delivery |
| `audit_logs` | All actions |
| `organization_entitlements` | Module + usage limits |
| `usage_tracking` | Monthly request counts |

**No new domain tables.** Migration `012_policy_acknowledgement.sql` adds performance index only.

---

## 10. Future Expansion

- Bulk campaign (one policy → many people)
- Policy version library with re-ack on update
- Manager escalation for overdue acknowledgements
- Training module cross-link
- PDF acknowledgement certificate generation

---

## 11. Cross-Sell

| Direction | Module | Prompt |
|-----------|--------|--------|
| Related | Training Record Tracker | "Track required training for this person" |
| Related | Exclusion Monitor | "Screen this employee against OIG" |
| Platform | People roster | Shared workforce records |

---

## 12. Implementation Reference

| Area | Location |
|------|----------|
| Domain logic | `src/lib/policies/*` |
| API routes | `/api/policies/requests`, `/api/external/policy/acknowledge` |
| External page | `/external/policy/[token]` |
| Module UI | `src/components/policies/*`, `/app/apps/policies` |
| Email templates | `src/lib/email/templates/policies.ts` |
| Migration | `supabase/migrations/012_policy_acknowledgement.sql` |
| Workers | `workers/reminder-sender` (policy_reminder, policy_overdue) |

---

*HR vertical slice — proves magic-link collection pattern extends to workforce acknowledgement workflows.*
