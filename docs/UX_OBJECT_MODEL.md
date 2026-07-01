# Keelstar UX — Object Model

> Universal object page pattern for Documents, Workflows, Tasks, Monitors, Vendors, People, and Audit events.

---

## Universal object page layout

Every major object detail page uses the same structure:

```
┌─ ObjectHeader ─────────────────────────────────────────┐
│ Breadcrumbs                                            │
│ Title + StatusBadge + metadata row                     │
│ Primary action + overflow menu                         │
├─ ObjectSummaryPanel (optional) ────────────────────────┤
│ Key fields grid · attention indicators                 │
├────────────────────────────┬───────────────────────────┤
│ Main content               │ ObjectRightRail           │
│ (preview, fields, tasks)   │ Activity timeline         │
│                            │ Related items             │
└────────────────────────────┴───────────────────────────┘
```

**Components:** `ObjectHeader`, `ObjectSummaryPanel`, `ObjectRightRail`, `ObjectActivityTimeline`, `ObjectMetadataGrid`, `RelatedItemsPanel`

---

## Document

### Fields (summary + detail)

| Field | Notes |
|-------|-------|
| Name | Editable with permission |
| Type | W-9, COI, contract, invoice, policy, … |
| Status | Shared document status system |
| Current version | v3 of 3 |
| Uploaded by | User or external email |
| Uploaded date | ISO → relative in lists |
| Source | Upload, external link, email |
| Linked workflow | Link to workflow detail |
| Extracted fields | Structured data + confidence |
| Related monitor | Link if watched |
| Audit history | Timeline tab or rail |

### Actions

| Action | Permission |
|--------|------------|
| Preview | `documents.view` |
| Download | `documents.view` |
| Upload new version | `documents.create` |
| Review extracted fields | `documents.review` |
| Approve / reject | `documents.approve` |
| Archive | `documents.archive` |
| Export evidence | `audit.export` |

### Main content tabs

1. **Preview** — document viewer
2. **Fields** — extraction review panel
3. **Versions** — `DocumentVersionHistory`
4. **Related** — workflow, vendor, monitor

---

## Workflow

### Fields

| Field | Notes |
|-------|-------|
| Type / module | W-9 collection, COI tracking, … |
| Status | Workflow status system |
| Owner | Member assignee |
| Due date | |
| Current step | From stepper |
| Participants | Internal + external |
| Related documents | |
| Tasks | Open + completed |
| Monitor | If created |
| Audit timeline | |

### Actions

Advance step · Assign owner · Send request · Create monitor · Complete · Cancel · Export evidence

### Main content

- `WorkflowStepper` at top
- `NextActionPanel` — single obvious CTA
- Linked documents cards
- Task list

---

## Task

### Fields

Title · Assignee (member/external) · Status · Due date · Linked workflow · Instructions · Completion evidence

### Actions

Complete · Reassign · Remind · Comment · Cancel

**Inbox** is a filtered task list; task detail can be drawer or full page.

---

## Monitor

### Fields

Monitored object · Rule description · Status · Next run · Last run · Reminder schedule · Owner · Escalation

### Actions

Pause · Resume · Edit reminders · Run now · View history

---

## Vendor

### Fields

Legal name · Contact email/phone · Status · Documents checklist · Active workflows · Missing requirements · Monitors · Risk signals (exclusion match)

### Actions

Request document · Start vendor packet · Create monitor · Archive

### Missing requirements pattern

Checklist: W-9 ✓ · COI ✗ expired · Packet 2/5 — drives attention on vendor detail.

---

## Person

Employees, contractors, external participants (non-vendor).

### Fields

Name · Email · Type · Documents · Acknowledgements · Training records · Tasks · Monitor status

### Actions

Send policy ack · Assign training · Create monitor

---

## Audit Event

Read-only object (row in global log or timeline entry).

### Fields

Actor · Actor type (user/external/system) · Action · Target object · Timestamp · IP/UA (if available) · Metadata JSON · Correlation ID

### Display

`AuditEventRow` in timelines; detail in drawer on click.

---

## Permission-denied pattern

If user lacks permission for primary action:

- Button disabled with tooltip: “You need [permission] to [action]”
- Link: “Request access from [owner]” (future)

Component: `PermissionDeniedState`

---

## Related objects graph

```
Vendor ──< Workflow ──< Document
   │           │
   └── Monitor ┘
```

`RelatedItemsPanel` shows 3–5 links max; “View all” → filtered list.

---

*Workflow lifecycle in [UX_WORKFLOW_PATTERN.md](./UX_WORKFLOW_PATTERN.md).*
