# Keelstar UX — Error States

> Recovery-focused errors. Every error answers: what happened, why, what to do next.

---

## Required structure

| Element | Spec |
|---------|------|
| Title | Short, plain language |
| Explanation | What failed |
| Why (if known) | Optional one line |
| Primary recovery | Button |
| Secondary | Alternative path |
| Support | Link/email when appropriate |

**Component:** `ErrorState`, `LimitReachedState`, `PermissionDeniedState`

---

## Error catalog

### Auth & permissions

| Code | Title | Primary action |
|------|-------|----------------|
| unauthorized | Sign in required | Go to login |
| missing_permission | You don’t have access | Back to home / request access |
| organization_not_found | Workspace not found | Create or join org |

### Upload & documents

| Code | Title | Primary action |
|------|-------|----------------|
| upload_failed | Upload failed | Try again |
| unsupported_file | File type not supported | See accepted types |
| file_too_large | File exceeds 10 MB | Choose smaller file |
| extraction_failed | Could not read document | Re-upload or enter manually |
| document_not_found | Document not found | Back to documents |

### External links

| Code | Title | Primary action |
|------|-------|----------------|
| link_expired | This link has expired | Ask for new link |
| link_revoked | Link no longer active | Contact organization |
| link_already_used | Already completed | None |

### Billing & limits

| Code | Title | Primary action |
|------|-------|----------------|
| subscription_limit_reached | Plan limit reached | View billing |
| payment_failed | Payment failed | Update payment method |

### Operations

| Code | Title | Primary action |
|------|-------|----------------|
| email_bounced | Email could not be delivered | Update email |
| reminder_failed | Reminder could not be sent | Retry |
| duplicate_record | Record already exists | Open existing |
| worker_delayed | Processing delayed | Dismiss / check later |

---

## Inline vs page errors

| Context | Pattern |
|---------|---------|
| Form field | Below input, `aria-describedby` |
| Upload zone | Banner inside zone |
| Full page | Centered `ErrorState` |
| Toast | Transient network errors |

---

## Limit reached UX

**Component:** `LimitReachedState`

- Show current usage: “5 of 5 vendors on Free plan”
- Primary: Upgrade
- Secondary: Archive unused records
- Audit: `billing.limit_reached` on block

---

## Support path

Footer line: “Contact support@keelstar.com” or org admin email for external pages.

---

## Logging

All errors logged server-side with correlation ID; show ID in support-facing page errors (not external).
