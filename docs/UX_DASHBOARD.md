# Keelstar UX — Dashboard (Home)

> Route: `/app` — global operational home, not a vanity analytics page.

---

## Purpose

Answer in under 5 seconds: **“What needs my attention right now?”**

The home dashboard aggregates across all modules. It does not replace module homes (`/app/apps/w9`) or object lists.

---

## Layout (top → bottom)

### 1. Attention Required (highest priority)

**Component:** `DashboardAttentionPanel`

Shows items requiring **immediate** internal action, sorted by urgency:

| Item type | Example | Primary action |
|-----------|---------|----------------|
| Overdue task | Approve invoice | Open task |
| Review needed | W-9 submitted | Review |
| Failed extraction | COI parse failed | Re-upload / fix |
| Expiring critical | Contract notice in 7d | View monitor |
| Stale external request | W-9 sent 14d ago, no upload | Resend |
| Monitor failure | Exclusion check failed | View run |

Each row: **object name** · **status badge** · **owner** · **due date** · **action button**

Empty: “Nothing requires immediate attention.” (positive, calm)

Max 8 items; link “View all in Inbox” if more.

---

### 2. Waiting on Others

**Component:** `WaitingOnOthersPanel`

| Category | Example |
|----------|---------|
| External | Vendor has not submitted W-9 |
| Internal | Approver has not approved invoice |
| Employee | Policy acknowledgement pending |

Each row: who · what · since · **Send reminder** (secondary)

---

### 3. Expiring Soon

**Component:** `ExpiringSoonPanel`

Horizon: next 90 days, grouped 30/60/90.

| Object | Module |
|--------|--------|
| COI | COI Tracker |
| Contract renewal | Contracts |
| Training cert | Training |
| Monitor trigger | Any |

Action: **View** or **Create reminder**

---

### 4. Recent Activity

**Component:** `RecentActivityTimeline`

Last 15 events: uploads, submissions, approvals, reminders sent, monitor runs.

Not a full audit log — link to `/app/audit`.

---

### 5. Workflow Overview

**Component:** `WorkflowOverview`

Compact stat row (not charts unless real data):

| Metric | Source |
|--------|--------|
| Active | `status IN (active, in_review, waiting_*)` |
| Waiting | `waiting_on_external` + `waiting_on_internal` |
| Review needed | `in_review` |
| Overdue | `overdue` |
| Completed this month | `completed` + date filter |

Click stat → `/app/workflows?status=…`

---

### 6. Suggested Next Steps

**Component:** `SuggestedNextSteps`

Contextual, max 3 cards. Powered by `modules.ts` `crossSell` + org state.

| Trigger | Suggestion |
|---------|------------|
| First W-9 completed | “Add COI requirement for this vendor” |
| First document uploaded | “Create a renewal monitor” |
| Solo user | “Invite a teammate to review submissions” |
| Vendor created, no packet | “Send a vendor onboarding packet” |

**Tone:** helpful, not salesy. Dismissible per suggestion.

---

## New workspace empty state

When org has zero documents and zero workflows:

**Title:** “Set up your workspace”

**Three starting actions:**

1. Upload a document
2. Start a workflow
3. Send an external request

Hide stat panels until data exists.

---

## Permissions

- Dashboard visible to all active members
- Attention items filtered by what user can act on
- Billing/limit banners only for admins

---

## Mobile

Stack panels vertically. Attention Required first. Stats become 2-column grid.

---

## Backend integration (TODO)

| Panel | Data source |
|-------|-------------|
| Attention | `tasks`, `workflow_instances`, `documents`, `monitors` |
| Waiting | workflows + external participants |
| Expiring | `monitors` + document expiry metadata |
| Activity | `audit_logs` |
| Overview | aggregated counts query |
| Suggestions | rules engine + entitlements |

Until connected: `src/lib/mock-data/dashboard.ts`
