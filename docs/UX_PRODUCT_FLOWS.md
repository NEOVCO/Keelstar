# Keelstar UX — Product Flows

> End-to-end flows per Keelstar module. All flows use shared workflow pattern unless noted.

---

## W-9 Collector

**Job:** Collect valid W-9s from vendors before payment or 1099 season.

| Step | Actor | Action |
|------|-------|--------|
| 1 | User | Create W-9 request |
| 2 | User | Add vendor name + email |
| 3 | System | Send magic link email |
| 4 | Vendor | Open `/external/[token]` |
| 5 | Vendor | Upload W-9 PDF |
| 6 | System | Validate file; extract fields |
| 7 | User | Review extracted fields |
| 8 | User | Approve or request correction |
| 9 | System | Store on vendor record; version document |
| 10 | User | Optional monitor for annual refresh |
| 11 | User | Export audit packet |

**Empty state title:** “Collect your first W-9 without chasing email threads.”  
**Primary CTA:** “Request W-9”  
**Cross-sell:** After approval → “Add COI requirement” · “Create vendor packet”

---

## COI Tracker

**Job:** Know whether vendor insurance certificates are current and acceptable.

| Step | Action |
|------|--------|
| 1 | Upload ACORD or request from vendor |
| 2 | Extract insured, carrier, limits, dates |
| 3 | Compare to requirement template |
| 4 | Highlight gaps/expiry |
| 5 | User confirms or overrides |
| 6 | Monitor expiration |
| 7 | Reminders before expiry |
| 8 | Export compliance evidence |

**Empty:** “Track insurance certificates before they expire.”  
**CTA:** “Upload COI”

---

## Contract Renewal Tracker

**Job:** Never miss renewal or notice deadlines.

Extract renewal date, notice period, auto-renewal, counterparty → monitor → reminder schedule → timeline.

**CTA:** “Upload contract”

---

## Contract Risk Scanner

**Job:** Spot contract risks before signing.

Upload → extract clauses → red flags by category → user reviews (not legal advice — **disclaimer required**) → save to record → optional counsel task.

**CTA:** “Scan contract”

---

## Exclusion Monitor

**Job:** Monitor vendors/people against exclusion lists.

Enter entity → run check → match/no-match → save proof → recurring monitor → alerts → export.

**CTA:** “Run exclusion check”

---

## Vendor Packet Portal

**Job:** One link for all onboarding documents.

Template → required docs checklist → magic link → vendor uploads each → internal review → reminders for missing → complete packet on vendor.

**CTA:** “Send vendor packet”

---

## Policy Acknowledgement Tracker

Upload policy → select people → magic links → review + acknowledge → timestamp proof → export report.

**CTA:** “Send acknowledgement request”

---

## Training Record Tracker

Upload certificate → extract person, course, expiry → monitor → reminders → training matrix export.

**CTA:** “Add training record”

---

## Invoice Approval Lite

Upload invoice → extract amount, vendor, due date → assign approver → task → reminders → audit.

**CTA:** “Submit for approval”

---

## Simple Signer

Upload PDF → add signer → magic link → sign → signed version + audit certificate.

**CTA:** “Send for signature”

---

## Cross-module patterns

| Pattern | Modules using it |
|---------|------------------|
| External upload | W-9, COI, Vendor packet, Signer |
| Extraction review | W-9, COI, Contract, Invoice |
| Monitor + reminders | COI, Contract, Training, Exclusion |
| Approval task | W-9, Invoice, Contract risk |

---

*External UX: [UX_EXTERNAL_MAGIC_LINKS.md](./UX_EXTERNAL_MAGIC_LINKS.md)*
