# Keelstar UX — External Magic Links

> Routes: `/external/[token]` and module-specific paths like `/external/w9/[token]`.

---

## Principles

External participants must experience:

- **Minimal** — one task, no navigation
- **Trustworthy** — org name, security note, professional branding
- **Task-specific** — upload, sign, or acknowledge only
- **Mobile-friendly** — large touch targets, single column
- **No account** — never require signup

**No app sidebar. No marketing footer clutter.**

---

## Page structure

```
┌─────────────────────────────────────┐
│ [Keelstar logo]  Secure request     │
│ from {Organization Name}            │
├─────────────────────────────────────┤
│ Task summary card                   │
│ • What is requested                 │
│ • Who requested it                  │
│ • Due date (if any)                 │
│ • Estimated time: ~2 min            │
├─────────────────────────────────────┤
│ MAIN ACTION                         │
│ Upload / Sign / Acknowledge         │
├─────────────────────────────────────┤
│ Footer: security note · privacy     │
│ Support: org contact email          │
└─────────────────────────────────────┘
```

**Components:** `ExternalLayout`, `ExternalTaskSummary`, task-specific body, state components.

---

## Trust copy

**Header line:** “Secure request from **{Organization}**.”

**Footer security note:** “Your submission is encrypted in transit. Only {Organization} can access this file.”

---

## Task types

| Type | Component | Main action |
|------|-----------|-------------|
| Document upload | `ExternalUploadTask` | Drag/drop + submit |
| Signature | `ExternalSignatureTask` | Review + sign |
| Acknowledgement | `ExternalAcknowledgementTask` | Scroll policy + checkbox + submit |

---

## States

| State | Message | CTA |
|-------|---------|-----|
| Valid link | Normal task UI | Primary task action |
| Expired | “This link has expired.” | “Ask {org} for a new link” (mailto or text) |
| Revoked | “This link is no longer active.” | Contact org |
| Already completed | “This request has already been completed.” | None |
| Success | “Submission received.” | Summary + optional download receipt |
| Upload failed | Plain error + retry | Try again |
| Missing required field | Inline validation | Fix and submit |
| Unsupported file | “This file type is not supported.” | List accepted types |
| Request correction | Banner: “Correction requested: {reason}” | Re-upload |

**Components:** `ExternalCompletionState`, `ExternalExpiredState`, `ExternalRevokedState`

---

## Mobile rules

- Sticky primary submit at bottom
- File picker full width
- No horizontal scroll
- Min tap target 44px

---

## Branding

- Org name prominent; Keelstar logo small
- No org logo upload in v1 (future)
- Accent color from platform tokens only

---

## Analytics

Track: `external_link_opened`, `external_submission_completed`, `external_dropoff`, `magic_link_expired` — see [UX_ANALYTICS_EVENTS.md](./UX_ANALYTICS_EVENTS.md).

---

## Backend (TODO)

- Token validation server-side
- Rate limit uploads
- Virus scan hook (future)
- Never expose raw token in client logs
