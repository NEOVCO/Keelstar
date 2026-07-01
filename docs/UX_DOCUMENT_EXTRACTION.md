# Keelstar UX — Document Extraction

> Upload, processing, review, and version history for document-centric workflows.

---

## Upload flow

**Component:** `DocumentUploadZone`

| Element | Spec |
|---------|------|
| Drag and drop | Highlight border on dragover |
| Browse | Secondary button |
| Supported types | Listed inline: PDF, PNG, JPEG (module-specific) |
| Max size | e.g. 10 MB — always visible |
| Security note | One line under zone |
| Progress | Determinate bar during upload |
| Multi-file | Only where module allows (vendor packet) |

Errors inline — see [UX_ERROR_STATES.md](./UX_ERROR_STATES.md).

---

## Processing state

**Component:** `ProcessingState`

- Message: “Processing document…” (calm, no fake instant)
- Allow user to leave page; notify when done (in-app notification)
- Show on document detail if `status = processing`
- Skeleton on field panel while parsing

---

## Extraction review layout

**Component:** `ExtractionReviewPanel`

Two columns (`lg:` side by side; mobile: preview first, then fields):

| Left | Right |
|------|-------|
| `DocumentPreview` | Parsed fields list |

### Parsed field row

**Component:** `ParsedFieldRow`

| Element | Spec |
|---------|------|
| Label | Field name |
| Value | Extracted text |
| Confidence | `ConfidenceBadge` |
| Source | “Page 1” or region hint |
| Edit | Pencil → inline edit |
| Validation | Check / warning icon |

### Confidence display

| Level | Threshold | UI |
|-------|-----------|-----|
| High | ≥ 0.9 | Subtle check; no alarm |
| Medium | 0.7–0.89 | “Review suggested” |
| Low | < 0.7 | “Requires review” — warning badge |

**Component:** `ConfidenceBadge`

### User actions on fields

- Edit value
- Mark correct
- Mark unavailable / N/A
- Add missing field (manual)
- Approve all fields (batch with confirmation)

---

## Approve / reject document

After field review:

- **Approve** → `approved` status; workflow advances
- **Reject** → require reason; optional notify external
- **Request correction** → external re-upload flow

---

## Version history

**Component:** `DocumentVersionHistory`

| Column | Content |
|--------|---------|
| Version | v1, v2, … |
| Uploader | Name or email |
| Timestamp | Relative + absolute on hover |
| Status | Badge |
| Summary | “Correction upload” / “Initial submission” |
| Actions | Download · View |

Compare metadata between versions (not full diff v1).

**Rule:** Current version clearly marked. Never delete versions.

---

## Document actions toolbar

**Component:** `DocumentActions`

Preview · Download · New version · Approve · Reject · Archive · Export evidence

Overflow for infrequent actions.

---

## Integration points

| System | Role |
|--------|------|
| Storage | Supabase private bucket |
| Parsing | Worker / future AI service |
| Audit | `document.parsed`, `document.approved` events |

---

*Monitors for expiry: [UX_MONITORING_REMINDERS.md](./UX_MONITORING_REMINDERS.md)*
