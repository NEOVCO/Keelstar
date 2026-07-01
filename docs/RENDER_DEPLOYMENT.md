# Keelstar Render Deployment

> Deployment guide for the Keelstar platform on Render.

---

## Services Overview

| Service | Type | Purpose |
|---------|------|---------|
| keelstar-web | Web Service | Next.js application |
| keelstar-doc-worker | Background Worker | Document processing |
| keelstar-monitor-worker | Cron Job | Daily monitor runner |
| keelstar-notify-worker | Background Worker | Notification sender |
| keelstar-cleanup-worker | Cron Job | Magic link cleanup |

---

## Web Service Setup

### Render Dashboard

1. Create new **Web Service**.
2. Connect GitHub repository.
3. Configure:

| Setting | Value |
|---------|-------|
| Name | `keelstar-web` |
| Region | Oregon (US West) or closest to Supabase region |
| Branch | `main` |
| Root Directory | `.` |
| Runtime | Node |
| Build Command | `npm install && npm run build` |
| Start Command | `npm start` |
| Plan | Starter (scale as needed) |

### Health Check

| Setting | Value |
|---------|-------|
| Health Check Path | `/api/health` |
| Expected Status | 200 |

---

## Worker Services

### Document Processing Worker

| Setting | Value |
|---------|-------|
| Name | `keelstar-doc-worker` |
| Type | Background Worker |
| Build Command | `npm install` |
| Start Command | `node workers/document-processing/index.js` |
| Plan | Starter |

Polls `background_jobs` every 60 seconds for `document_processing` jobs.

### Monitor Runner Worker

| Setting | Value |
|---------|-------|
| Name | `keelstar-monitor-worker` |
| Type | Cron Job |
| Build Command | `npm install` |
| Start Command | `node workers/monitor-runner/index.js` |
| Schedule | `0 6 * * *` (daily at 06:00 UTC) |
| Plan | Starter |

### Notification Sender Worker

| Setting | Value |
|---------|-------|
| Name | `keelstar-notify-worker` |
| Type | Background Worker |
| Build Command | `npm install` |
| Start Command | `node workers/notification-sender/index.js` |
| Plan | Starter |

Polls pending notifications every 30 seconds.

### External Link Cleanup Worker

| Setting | Value |
|---------|-------|
| Name | `keelstar-cleanup-worker` |
| Type | Cron Job |
| Build Command | `npm install` |
| Start Command | `node workers/external-link-cleanup/index.js` |
| Schedule | `0 2 * * *` (daily at 02:00 UTC) |
| Plan | Starter |

---

## Environment Variables

Set on **all services** (web + workers):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres

# App
APP_URL=https://app.keelstar.com
MARKETING_URL=https://keelstar.com
NODE_ENV=production
```

Set on **web service only**:

```bash
# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Email
RESEND_API_KEY=re_...

# Analytics & Monitoring
POSTHOG_KEY=phc_...
SENTRY_DSN=https://...@sentry.io/...
SENTRY_AUTH_TOKEN=sntrys_...

# Security
CRON_SECRET=random-secret-for-cron-auth
```

---

## Supabase Configuration

### Project Setup

1. Create Supabase project in same region as Render (US West recommended).
2. Run migrations: `supabase db push` or apply via Supabase Dashboard SQL editor.
3. Run seed: apply `/supabase/seed/seed.sql`.

### Auth Settings

- Enable email provider.
- Set Site URL to `https://app.keelstar.com`.
- Add redirect URLs: `https://app.keelstar.com/auth/callback`, `http://localhost:3000/auth/callback`.
- Enable email confirmations.

### Storage

- Create private bucket: `documents`.
- No public access.
- Storage policies applied via migration.

### RLS

- All RLS policies applied via migrations.
- Verify with: `SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';`

---

## Stripe Webhook Setup

1. In Stripe Dashboard → Developers → Webhooks.
2. Add endpoint: `https://app.keelstar.com/api/stripe/webhook`.
3. Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`.

---

## Resend DNS Setup

1. Add domain in Resend Dashboard.
2. Add DNS records:
   - SPF: `v=spf1 include:amazonses.com ~all`
   - DKIM: (provided by Resend)
   - DMARC: `v=DMARC1; p=none;`
3. Set from address: `notifications@keelstar.com`.
4. Verify domain before sending production emails.

---

## Build Commands

### Web Service

```bash
npm install && npm run build
```

Next.js production build with Sentry source map upload (if configured).

### Workers

```bash
npm install
```

Workers run compiled JS directly. TypeScript compiled via project build or ts-node in dev.

---

## Start Commands

| Service | Command |
|---------|---------|
| Web | `npm start` |
| Doc Worker | `node workers/document-processing/index.js` |
| Monitor Worker | `node workers/monitor-runner/index.js` |
| Notify Worker | `node workers/notification-sender/index.js` |
| Cleanup Worker | `node workers/external-link-cleanup/index.js` |

---

## Health Checks

### Web Service

```
GET /api/health
→ 200 { "status": "ok", "timestamp": "..." }
```

Checks: database connectivity (optional Supabase ping).

### Workers

Workers log heartbeat every poll cycle:
```
[doc-worker] Heartbeat: processed 0 jobs, queue depth: 0
```

Monitor via Render logs. Set up alerts on error log patterns.

---

## Rollback Plan

1. **Web service**: Render Dashboard → Deploys → select previous successful deploy → Rollback.
2. **Workers**: Same rollback process per worker service.
3. **Database**: Migrations are forward-only. To rollback schema:
   - Write a reverse migration.
   - Apply via Supabase Dashboard.
   - Never modify deployed migrations.
4. **Stripe**: Webhook events stored in `webhook_events`. Replay failed events after fix.
5. **Emergency**: Set `MAINTENANCE_MODE=true` env var to show maintenance page (future).

---

## Local Development

```bash
# Install dependencies
npm install

# Copy environment
cp .env.example .env.local
# Fill in Supabase local or remote credentials

# Run Supabase locally (optional)
supabase start
supabase db reset  # applies migrations + seed

# Start dev server
npm run dev

# Run workers locally (separate terminals)
node workers/document-processing/index.js
node workers/notification-sender/index.js
node workers/monitor-runner/index.js
node workers/external-link-cleanup/index.js

# Run tests
npm test
```

---

## Monitoring & Alerts

| Tool | Purpose | Setup |
|------|---------|-------|
| Sentry | Error tracking | DSN in env vars, `@sentry/nextjs` |
| PostHog | Product analytics | Key in env vars |
| Render Logs | Service logs | Built-in, filter by service |
| Supabase Dashboard | Database metrics | Built-in |

Recommended alerts:
- Sentry: new error spike
- Render: service health check failure
- Supabase: connection pool exhaustion

---

*Render Deployment v1 — platform foundation.*
