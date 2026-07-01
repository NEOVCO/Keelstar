# Keelstar Magic Links

> External participants access specific tasks via secure, scoped, auditable magic links. No account creation required.

---

## Philosophy

Keelstar workflows frequently involve people outside the organization: vendors submitting W-9s, contractors uploading COIs, signers approving documents. These external participants should never need to create accounts, learn a new app, or see organization data beyond their specific task.

Magic links are the secure bridge between internal workflows and external action.

---

## Flow Overview

```
Internal user creates workflow/task
  → System creates external_participant record
  → System generates magic link (random token, hashed storage)
  → Email sent to external participant with link
  → External participant clicks link → /external/[token]
  → System validates token (hash match, not expired, not revoked, uses remaining)
  → External participant sees task-only UI
  → External participant completes action (upload, sign, acknowledge)
  → Task marked completed
  → Token marked used (if single-use)
  → Audit: magic_link.used, task.completed
  → Confirmation screen shown
```

---

## Token Generation

```typescript
// Generate cryptographically secure random token
const rawToken = crypto.randomBytes(32).toString('base64url'); // 256 bits

// Store only the hash
const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

// URL presented to external participant
const url = `${APP_URL}/external/${rawToken}`;
```

- **Entropy**: 256 bits minimum.
- **Format**: base64url (URL-safe).
- **Storage**: SHA-256 hash only. Raw token exists only in the URL sent via email.
- **Lookup**: Hash incoming token, query `magic_links.token_hash`.

---

## Token Properties

| Property | Description |
|----------|-------------|
| organization_id | Tenant scope |
| external_participant_id | Who this link is for |
| workflow_instance_id | Parent workflow |
| task_id | Specific task to complete |
| purpose | Action type: `w9_submit`, `coi_upload`, `sign_document`, `acknowledge_policy`, etc. |
| expires_at | Hard expiration timestamp |
| max_uses | Default 1 (single-use). Set >1 for multi-session tasks. |
| use_count | Incremented on each valid use |
| used_at | Timestamp of first use |
| revoked_at | Timestamp if manually revoked |
| revoked_by | Internal user who revoked |

---

## Validation Rules

A magic link is valid if ALL conditions are met:

1. Token hash matches a row in `magic_links`.
2. `revoked_at` IS NULL.
3. `expires_at` > now().
4. `use_count` < `max_uses`.

On validation failure, return appropriate error (expired, revoked, already used) without revealing whether the token ever existed.

---

## Single-Use vs Multi-Session

| Mode | max_uses | Use Case |
|------|----------|----------|
| Single-use (default) | 1 | W-9 submission, one-time signature |
| Multi-session | >1 | Vendor packet with multiple documents, training with quiz retries |

Single-use links are invalidated immediately after successful task completion. Multi-session links remain valid until `max_uses` reached or expiration.

---

## External Route: /external/[token]

The external participant page is intentionally minimal:

- **No app navigation.** No sidebar, no org switcher, no settings.
- **No account creation.** No signup/login prompts.
- **Task-only UI.** Shows task title, description, required action, and submit button.
- **Organization branding.** Shows organization name for trust, nothing else.
- **No data leakage.** External participant cannot see other tasks, documents, or members.

Layout: clean, centered, professional. Keelstar logo + organization name + task form.

---

## Security

| Measure | Implementation |
|---------|---------------|
| Hashed storage | SHA-256, raw token never in database |
| Expiration | Configurable, default 7 days |
| Single-use default | Prevents link sharing/replay |
| Revocation | Internal users can revoke anytime |
| Rate limiting | Max validation attempts per IP |
| No enumeration | Invalid tokens return generic error |
| Audit trail | Create, use, revoke all logged |
| HTTPS only | Enforced via security headers |

---

## Resend Behavior

Internal users can resend magic links:

1. Revoke existing link (`magic_link.revoked` audit).
2. Generate new token with fresh expiration.
3. Send new email (`magic_link.created` audit).
4. Old link immediately invalid.

Resend is limited to prevent abuse (max 5 resends per task).

---

## Revocation

Internal users with `workflows.update` permission can revoke magic links:

```typescript
revokeMagicLink(linkId, revokedByUserId)
  → Set revoked_at, revoked_by
  → Audit: magic_link.revoked
  → Link immediately invalid
```

Bulk revocation on workflow cancellation revokes all associated magic links.

---

## Email Template

Magic link emails include:
- Organization name (for trust)
- Task description (what is being requested)
- Clear call-to-action button with magic link URL
- Expiration notice
- Keelstar footer with support contact

Never include sensitive data, other tasks, or organization internals.

---

## Cleanup Worker

The `external-link-cleanup-worker` runs daily:

1. Find magic links where `expires_at < now()` AND `revoked_at IS NULL`.
2. Mark as expired (set `revoked_at = now()`, metadata: `{ reason: 'expired' }`).
3. Audit summary: `magic_link.expired` with count.
4. No deletion — expired links remain for audit trail.

---

## Implementation Files

| File | Purpose |
|------|---------|
| `/lib/magic-links/createMagicLink.ts` | Generate token, hash, store, audit |
| `/lib/magic-links/validateMagicLink.ts` | Hash, lookup, validate rules |
| `/lib/magic-links/revokeMagicLink.ts` | Revoke, audit |
| `/lib/magic-links/resendMagicLink.ts` | Revoke old + create new |
| `/app/external/[token]/page.tsx` | External participant UI |

---

*Magic Links v1 — platform foundation.*
