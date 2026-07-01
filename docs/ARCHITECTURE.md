# Keelstar Architecture

> See [NORTH_STAR.md](./NORTH_STAR.md) for guiding principles.

---

## System Overview

Keelstar is a **modular monolith** deployed on Render, with background workers for async processing. The frontend is a Next.js App Router application. All persistent state lives in Supabase (Postgres + Auth + Storage).

```
┌─────────────────────────────────────────────────────────────────┐
│                        Render Platform                          │
├─────────────────────────────────────────────────────────────────┤
│  Web Service (Next.js)                                          │
│  ├── Marketing site          /                                  │
│  ├── Auth flows              /login, /signup                      │
│  ├── Protected app           /dashboard, /documents, ...        │
│  ├── Module pages            /w9, /coi, /contracts, ...         │
│  ├── External flows          /external/[token]                  │
│  ├── Free tools              /tools/w9-request, ...             │
│  └── API routes              /api/*                             │
├─────────────────────────────────────────────────────────────────┤
│  Worker Services (Node.js)                                      │
│  ├── document-processing-worker                                 │
│  ├── monitor-runner-worker (cron: daily)                        │
│  ├── notification-sender-worker                                 │
│  └── external-link-cleanup-worker (cron: daily)                 │
└─────────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Supabase   │    │    Stripe    │    │    Resend    │
│ Auth/DB/Store│    │   Billing    │    │    Email     │
└──────────────┘    └──────────────┘    └──────────────┘
         │
         ▼
┌──────────────┐    ┌──────────────┐
│    Sentry    │    │   PostHog    │
│   Errors     │    │  Analytics   │
└──────────────┘    └──────────────┘
```

---

## Next.js App Structure

```
src/app/
├── (marketing)/          # Public marketing pages (existing site)
├── (auth)/               # Login, signup, password reset
│   ├── login/
│   └── signup/
├── (app)/                # Protected application shell
│   ├── layout.tsx        # Sidebar + org switcher
│   ├── dashboard/
│   ├── documents/
│   ├── workflows/
│   ├── tasks/
│   ├── monitors/
│   ├── audit/
│   ├── settings/
│   ├── billing/
│   ├── w9/               # Module shells
│   ├── coi/
│   ├── contracts/
│   ├── exclusions/
│   ├── vendor-packets/
│   ├── policies/
│   ├── training/
│   ├── invoices/
│   └── signer/
├── external/
│   └── [token]/          # Magic link external participant flows
├── tools/                # Free utility tools (lead gen)
│   ├── w9-request/
│   ├── coi-analyzer/
│   └── ...
└── api/
    ├── auth/
    ├── organizations/
    ├── documents/
    ├── workflows/
    ├── tasks/
    ├── monitors/
    ├── notifications/
    ├── audit/
    ├── external/
    └── stripe/
```

Route groups `(marketing)`, `(auth)`, and `(app)` use separate layouts. Marketing keeps the public header/footer. The app uses a sidebar shell with organization switcher.

---

## Supabase Auth

- Email/password authentication via Supabase Auth.
- Session managed via `@supabase/ssr` with cookie-based sessions.
- On first login, user can create an organization (becomes Owner).
- Users can belong to multiple organizations via `organization_members`.
- Active organization stored in cookie (`keelstar_active_org`) and validated server-side.
- Middleware refreshes session and redirects unauthenticated users from `(app)` routes.

### Auth Flow

```
Signup → Email confirmation → Login → Create/Join Organization → App Dashboard
```

---

## Supabase Postgres

- All tenant data in Postgres with UUID primary keys.
- Every tenant table includes `organization_id`, `created_at`, `updated_at`.
- Migrations in `/supabase/migrations/`.
- Seed data in `/supabase/seed/`.
- TypeScript types generated from schema (future: `supabase gen types`).

---

## Row Level Security (RLS)

RLS is enabled on every tenant-scoped table. Helper functions:

```sql
current_organization_id()           -- Returns active org from JWT claim or session
is_org_member(org_id uuid)          -- Checks organization_members
has_permission(org_id uuid, key text) -- Checks role_permissions chain
```

Policy patterns:
- **Members**: SELECT/INSERT/UPDATE/DELETE only on rows where `is_org_member(organization_id)`.
- **Permission-gated**: Further restricted by `has_permission(organization_id, 'permission.key')`.
- **External participants**: Access only via service role with validated magic link context.
- **Audit logs**: Readable by members with `audit.view` permission. Never directly editable.

---

## Supabase Storage

- Private bucket: `documents`.
- Path convention: `organizations/{org_id}/documents/{doc_id}/versions/{version}/{filename}`.
- No public URLs. All access via signed URLs with expiration.
- Upload size limit enforced server-side (default: 25MB).
- MIME type validation on upload.
- Architecture supports future migration to S3-compatible storage by abstracting via `/lib/storage/`.

---

## Render Services

### Web Service
- **Build**: `npm install && npm run build`
- **Start**: `npm start`
- **Health check**: `GET /api/health`
- **Auto-deploy**: from main branch

### Worker Services
Each worker is a standalone Node.js process:

| Worker | Schedule | Purpose |
|--------|----------|---------|
| document-processing-worker | Continuous poll (60s) | Process uploaded documents |
| monitor-runner-worker | Cron: daily 06:00 UTC | Run due monitors, create reminders |
| notification-sender-worker | Continuous poll (30s) | Send queued email notifications |
| external-link-cleanup-worker | Cron: daily 02:00 UTC | Expire/revoke stale magic links |

Workers use `SUPABASE_SERVICE_ROLE_KEY` for database access (bypasses RLS). All worker actions are audited.

---

## Cron Jobs

Initial implementation uses Supabase `background_jobs` table + Render cron workers:

```
Render Cron → Worker script → Poll background_jobs → Process → Mark complete
```

Future migration path: BullMQ + Redis or managed queue (Inngest, Trigger.dev).

Job requirements:
- Idempotent (safe to retry).
- Status tracking: `pending → processing → completed | failed`.
- Failure logging with retry count.
- Correlation ID for tracing.

---

## Stripe Billing

- One Stripe Customer per organization.
- Subscriptions stored in `subscriptions` table.
- Products/modules in `products` table.
- Module access via `organization_entitlements`.
- Webhook handler at `/api/stripe/webhook`:
  - Verifies Stripe signature.
  - Stores raw event in `webhook_events`.
  - Idempotent processing (check event ID before acting).
  - Updates subscriptions and entitlements.
  - Audits `billing.subscription_updated`.

---

## Resend Email

- Transactional email via Resend API.
- Templates in `/lib/email/templates/`.
- Every send creates: `notifications` row, `email_events` row, audit log.
- Emails include organization name, never leak sensitive data.
- Professional, plain, enterprise-grade templates.

---

## Sentry

- `@sentry/nextjs` for error tracking.
- Configured in `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`.
- Source maps uploaded on build.
- PII scrubbing enabled.

---

## PostHog

- Client-side analytics via `posthog-js`.
- Server-side events via `posthog-node` for key business events.
- Organization-scoped group analytics (future).
- No PII in event properties.

---

## Multi-Tenancy Model

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│    User     │────▶│ org_members      │────▶│ Organization│
│ (Supabase   │     │ (role assignment)│     │ (tenant)    │
│  Auth)      │     └──────────────────┘     └──────┬──────┘
└─────────────┘                                      │
                                                     ▼
                              ┌──────────────────────────────────┐
                              │ All tenant data scoped by org_id │
                              │ documents, workflows, tasks,     │
                              │ monitors, audit_logs, etc.       │
                              └──────────────────────────────────┘
```

Active organization context flows through:
1. Cookie (`keelstar_active_org`)
2. Server-side validation via `requireOrganization()`
3. Supabase RLS policies
4. All API routes and server actions

---

## Magic Links

See [MAGIC_LINKS.md](./MAGIC_LINKS.md) for full specification.

Summary:
- Random 256-bit token, stored hashed (SHA-256).
- Scoped to: organization, external participant, workflow, task, purpose.
- Single-use by default; `max_uses` column for multi-session.
- External route: `/external/[token]` — minimal UI, task-only.
- Full audit trail on create, use, revoke.

---

## Document Ingestion

```
Upload → Storage (signed) → documents + document_versions rows
  → background_jobs (document_processing)
  → Worker picks up → status: processing
  → extractDocumentFields() → document_parsed_fields
  → status: parsed | failed
  → Audit: document.parsed
```

Sources: `internal_upload`, `external_upload`, `email`, `api`.

---

## Extraction Pipeline

Interface: `extractDocumentFields(documentVersionId)`.

MVP: placeholder logic (filename parsing, basic metadata).

Future: OCR (Tesseract/Google Vision), AI extraction (Claude/GPT), regex patterns per document type.

Parsed fields stored generically with type, confidence, source, and override support.

---

## Monitor Scheduler

```
Daily cron → monitor-runner-worker
  → Find monitors where next_run_at <= now()
  → For each monitor (idempotent):
      → Create monitor_run record
      → Evaluate condition (deadline approaching, expired, overdue)
      → Create notifications if action needed
      → Update next_run_at
      → Audit: monitor.run
  → Continue on failure (log and skip)
```

Monitor types: contract renewal, COI expiration, training expiry, policy overdue, invoice overdue, exclusion recheck, vendor packet incomplete.

---

## Notification System

```
Trigger (monitor, workflow, manual)
  → Create notifications row (status: pending)
  → notification-sender-worker picks up
  → Render email template
  → Send via Resend
  → Create email_events row
  → Update notification status: sent
  → Audit: notification.sent
  → Retry on failure (max 3 attempts)
```

---

## Audit Logging

See [AUDIT_LOGGING.md](./AUDIT_LOGGING.md).

Central helper: `createAuditLog()` in `/lib/audit/`.
Reusable wrapper: `withAudit(action, handler)`.

All audit logs are append-only, tenant-scoped, and exportable.

---

## Security Model

| Layer | Mechanism |
|-------|-----------|
| Authentication | Supabase Auth (JWT) |
| Authorization | RBAC + RLS + server-side checks |
| Data isolation | organization_id on every tenant table |
| Storage | Private bucket, signed URLs only |
| Input validation | Zod schemas on all API inputs |
| Rate limiting | Middleware-based (MVP: in-memory, future: Redis) |
| Headers | CSP, HSTS, X-Frame-Options, X-Content-Type-Options |
| Secrets | Environment variables only |
| External access | Hashed magic link tokens, scoped, expiring |

---

## Future Scalability

| Component | Current (MVP) | Future |
|-----------|---------------|--------|
| Queue | Supabase `background_jobs` table | BullMQ + Redis or Inngest |
| Storage | Supabase Storage | S3-compatible (R2, S3) |
| Extraction | Placeholder | OCR + AI pipeline |
| Search | Postgres full-text | Meilisearch or pgvector |
| Realtime | Polling | Supabase Realtime |
| Multi-region | Single region | Read replicas + CDN |
| Microservices | Modular monolith | Extract workers to services if needed |

The modular monolith design ensures we can extract any component later without rewriting the platform.

---

*Architecture v1 — platform foundation.*
