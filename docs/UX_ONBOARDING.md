# Keelstar UX — Onboarding

> Time to first value: **under 10 minutes**.

---

## First user (org creator)

| Step | Screen | Goal |
|------|--------|------|
| 1 | Sign up | Account created |
| 2 | Create organization | Name + slug |
| 3 | Choose first goal | Routes to relevant module |
| 4 | First action | Upload / request / start workflow |
| 5 | Complete first workflow step | External sent or doc uploaded |
| 6 | Suggest monitor | Contextual card |
| 7 | Suggest invite teammate | After first completion |

### First goal options

| Goal | Landing |
|------|---------|
| Collect vendor documents | `/app/apps/w9` |
| Track contract renewals | `/app/apps/contracts` |
| Monitor insurance certificates | `/app/apps/coi` |
| Get invoices approved | `/app/apps/invoices` |
| Send document for signature | `/app/apps/signer` |

Route: `/onboarding` — skip if org already has activity.

---

## Invited member

| Step | Experience |
|------|------------|
| Accept invite | Email link → join org |
| Land on Inbox | Assigned tasks visible |
| No org setup wizard | |

---

## External participant

| Step | Experience |
|------|------------|
| Click magic link | External layout |
| Understand request | Task summary |
| Complete task | Upload/sign/ack |
| Confirmation | Success state only |

No onboarding steps. Total flow < 3 minutes.

---

## Second product activation

Triggered **contextually** on object/workflow completion — never blocking modal.

| After | Suggest |
|-------|---------|
| W-9 approved | COI or vendor packet |
| COI uploaded | Renewal monitor |
| First workflow | Invite reviewer |

Powered by `modules.ts` → `crossSell`.

---

## Progress indicators

Optional checklist on home for new orgs (dismissible):

- [ ] Upload or request first document
- [ ] Complete first review
- [ ] Create first monitor
- [ ] Invite teammate

---

## Analytics milestones

See [UX_ANALYTICS_EVENTS.md](./UX_ANALYTICS_EVENTS.md) — `first_*` events map to onboarding funnel.
