# Keelstar UX — Workflow Pattern

> Reusable workflow model for all Keelstar modules.

---

## Universal lifecycle

Every workflow follows this pattern:

| Step | Description |
|------|-------------|
| 1. Start | User initiates from module home or global create |
| 2. Add or request document | Upload internally or send external request |
| 3. Extract or enter data | Parsing + structured fields |
| 4. Review and confirm | Human validates extraction |
| 5. Assign owner and due date | Accountability |
| 6. Send external request | Magic link if needed |
| 7. Track task completion | Inbox + waiting panels |
| 8. Create monitor/reminder | Recurring value |
| 9. Resolve exceptions | Reject, correction, re-upload |
| 10. Export evidence | Audit packet |

Not every workflow uses every step (e.g. Simple Signer skips extraction).

---

## Workflow detail screen requirements

Every `/app/workflows/[id]` page **must** show:

- Current step (`WorkflowStepper`)
- Next action (`NextActionPanel`)
- Status + owner + due date (`ObjectHeader`)
- Activity history (`WorkflowTimeline` / audit)
- Linked documents
- Open tasks
- Monitor summary (if exists)

---

## Reusable components

| Component | Responsibility |
|-----------|----------------|
| `WorkflowStepper` | Visual steps; completed/active/pending states |
| `NextActionPanel` | Single primary CTA + short explanation |
| `WorkflowSummaryCard` | Compact card for lists and module homes |
| `WorkflowStatusBadge` | Maps internal status → UI category |
| `WorkflowTimeline` | Step + audit combined chronology |
| `CreateWorkflowDialog` | Module picker + minimal create form |

### WorkflowStepper states

| State | Visual |
|-------|--------|
| Completed | Check icon, muted |
| Active | Accent ring, bold label |
| Pending | Empty circle, tertiary text |
| Skipped | Muted, strikethrough optional |
| Failed | Error indicator + retry link |

### NextActionPanel rules

- Exactly **one** primary button
- Subtext: who acts next (internal name or “Vendor”)
- If blocked: explain blocker (“Waiting for vendor upload since Mar 12”)

---

## Status mapping

Module-specific statuses (e.g. W-9 `sent`, `submitted`) map to shared workflow categories — see `src/lib/statuses/workflow.ts`.

| Shared category | User-facing label |
|-----------------|-------------------|
| `waiting_on_external` | Waiting on vendor |
| `waiting_on_internal` | Waiting on team |
| `in_review` | Needs review |
| `active_monitoring` | Monitoring |
| `overdue` | Overdue |

---

## Create flow (MVP)

- Wizard max **4 steps**
- Pre-select module when entering from `/app/apps/w9`
- Validate entitlement before step 2
- Success → redirect to `/app/workflows/[id]`

---

## Exception handling

| Exception | UX |
|-----------|-----|
| Rejection | Require reason; notify external if applicable |
| Correction requested | New magic link or same link with banner |
| Cancelled | Confirm modal; audit reason |
| Failed | Show error + retry or support |

---

## Module configuration

Each module in `modules.ts` defines:

- `workflowType` — DB `workflow_instances.type`
- `primaryAction` — “Request W-9”
- Default steps in module spec (docs)

---

*Product-specific flows in [UX_PRODUCT_FLOWS.md](./UX_PRODUCT_FLOWS.md).*
