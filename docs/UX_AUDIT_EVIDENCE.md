# Keelstar UX — Audit & Evidence

> Immutable activity record and exportable compliance packets.

---

## Three surfaces for audit

| Surface | Route / location | Scope |
|---------|------------------|-------|
| Object timeline | Right rail on detail pages | Single object |
| Global audit log | `/app/audit` | Organization |
| Evidence export | Modal/panel on workflow/vendor | Curated packet |

---

## Object activity timeline

**Component:** `ObjectActivityTimeline` / `AuditTimeline`

- Newest first
- Grouped by calendar day
- Actor: initials avatar (32px) or “System”
- Action label: human-readable (“Approved W-9”)
- Timestamp: relative + tooltip absolute
- Metadata: one-line summary; expand for JSON (admin)

---

## Global audit log

**Component:** `AuditFilters` + table/timeline hybrid

### Filters

| Filter | Options |
|--------|---------|
| Date range | Presets + custom |
| Actor | User picker |
| Action | Event type multiselect |
| Object type | document, workflow, vendor, … |
| Module | w9, coi, … |
| Actor type | user, external, system |

### Table columns

Timestamp · Actor · Action · Object · Module · Details

Row click → **detail drawer** with full metadata + correlation ID.

### Export

Button: “Export log” → CSV (current filters). Requires `audit.export`.

---

## Evidence packet

**Component:** `EvidenceExportPanel`

### Includes

- Workflow summary
- Documents + version list
- Extracted fields snapshot
- Approvals (who, when)
- External submissions log
- Reminders sent
- Signatures (if applicable)
- Timestamps (UTC)
- Actor details
- Full audit event list for scope

### Formats

| Format | Status |
|--------|--------|
| CSV | **Now** |
| PDF | Later |
| JSON | Later |

### UX

- Scope picker: this workflow / this vendor / date range
- Progress indicator for generation
- Download link + audit `evidence.exported` event

---

## Audit event row schema (display)

| Field | Example |
|-------|---------|
| Actor | Jane Smith |
| Actor type | user |
| Action | `w9.approved` |
| Target | W-9 — Acme Cleaning |
| Timestamp | Jun 29, 2026 10:42 UTC |
| Correlation ID | `uuid` |

**Component:** `AuditEventRow`

---

## Permissions

| Action | Permission |
|--------|------------|
| View timeline | `audit.view` |
| View global log | `audit.view` |
| Export evidence | `audit.export` |

---

## Copy rules

- Past tense actions: “Uploaded document”, not “Upload document”
- External actors show email, not “Unknown”
