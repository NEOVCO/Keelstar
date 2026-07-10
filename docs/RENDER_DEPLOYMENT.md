# Keelstar Render Deployment

> **Status: pre-launch** — this document is the full deployment checklist. Not all services are on Render yet. Use it to track what must exist before go-live and to avoid missing env vars or workers.

---

## Launch readiness tracker

| Area | Status | Notes |
|------|--------|-------|
| `keelstar-web` (Next.js) | ⬜ Not launched | Blueprint stub in `render.yaml`; create service when ready |
| Background worker (notify + docs) | ⬜ Not launched | `keelstar-background-worker` in `render.yaml` |
| Daily cron (monitors + reminders + cleanup) | ⬜ Not launched | `keelstar-daily-cron` in `render.yaml` |
| Supabase migrations (`001`–`011`) | 🔧 External | Apply before web deploy |
| Stripe LIVE products + webhook | 🔧 External | Run `npm run stripe:setup` once per environment |
| Resend domain + `EMAIL_FROM` | 🔧 External | See `docs/TRANSACTIONAL_EMAIL_AND_AUTH.md` |
| Supabase auth URLs + SMTP | 🔧 External | Redirect URLs + Resend SMTP in Supabase dashboard |
| DNS → Render | 🔧 External | Point production domain when ready |

**Legend:** ⬜ Render service not created · 🔧 Configure outside Render · ✅ Done

---

## Services overview (cost-optimized)

**Three Render services** for production — down from the original seven-service design.

| # | Service name | Type | Start command | Schedule | Purpose |
|---|--------------|------|---------------|----------|---------|
| 1 | `keelstar-web` | Web Service | `npm run start` | Always on | Next.js app (marketing + `/app` + API routes) |
| 2 | `keelstar-background-worker` | Background Worker | `npm run worker:background` | Always on (~30s poll) | Queued **email** notifications + document extraction jobs |
| 3 | `keelstar-daily-cron` | Cron Job | `npm run worker:daily` | `0 6 * * *` UTC | Magic link cleanup, module monitors, generic monitors, reminders |

### What the daily cron runs (in order)

1. **Magic link cleanup** — expire stale external links
2. **Module monitors** — COI expiration, contract renewal, training, vendor packets, OIG exclusion
3. **Generic monitors** — user-created rules in `monitors` table
4. **Reminders** — W-9, COI, policy, signer, invoice reminder/overdue emails

### Cost comparison (Render Starter, approximate)

| Layout | Services | Always-on cost | Notes |
|--------|----------|----------------|-------|
| **Optimized (recommended)** | 3 | ~$14/mo (web + 1 worker) | Cron billed per execution minute |
| Original split | 7 | ~$21/mo (web + 2 workers) | 4 separate cron definitions |

Cron jobs only incur cost while running (~2–10 min/day for daily bundle). The biggest saving is **one background worker instead of two**.

### Scaling path (when to split again)

| Signal | Action |
|--------|--------|
| Email queue latency > 2 min regularly | Split `keelstar-background-worker` → dedicated notify worker |
| Document extraction backlog grows | Split doc processing to its own worker |
| Daily cron exceeds Render timeout (~30 min) | Split `keelstar-daily-cron` into module-monitors + reminders crons |
| High exclusion screening volume | Run OIG monitor on its own schedule |

**Notes**

- `render.yaml` defines the **optimized 3-service layout**. Not deployed yet.
- Individual `worker:*` scripts remain for local debugging (`npm run worker:reminders`, etc.).
- Shared job logic lives in `src/lib/workers/`.
- The web app runs **inline** document extraction after upload as a fallback; the background worker handles retries and queued jobs.
- **In-app** notifications (`channel = in_app`) are served by the web app — no worker needed.

---

## Shared Render settings

Apply to **all** Node services:

| Setting | Value |
|---------|-------|
| Runtime | Node 20 (`NODE_VERSION=20`) |
| Root directory | `.` |
| Region | Oregon (US West) or closest to Supabase |
| Branch | `main` |
| Build command | `NPM_CONFIG_PRODUCTION=false npm ci` |
| Plan | Starter (512 MB) — upgrade if workers OOM |

Web service **additional** build step:

```bash
NPM_CONFIG_PRODUCTION=false npm ci && NODE_OPTIONS=--max-old-space-size=460 npm run build && test -f .next/BUILD_ID
```

`RENDER=true` is set automatically by Render and enables memory-safe build settings in `next.config.mjs`.

---

## Web service (`keelstar-web`)

| Setting | Value |
|---------|-------|
| Build command | See above |
| Start command | `npm run start` |
| Health check path | `/api/health` |
| Expected status | 200 |

### Production URLs (set when launching)

Replace placeholders with your real domain:

| Variable | Example |
|----------|---------|
| `APP_URL` | `https://www.keelstar.com` |
| `NEXT_PUBLIC_APP_URL` | `https://www.keelstar.com` |
| `MARKETING_URL` | `https://www.keelstar.com` |

---

## Worker services

### Background worker (`keelstar-background-worker`)

| Setting | Value |
|---------|-------|
| Type | Background Worker |
| Start command | `npm run worker:background` |

Polls every **30 seconds** for queued email notifications. Polls document extraction jobs every **60 seconds** (alternating ticks).

Requires `RESEND_API_KEY`, `EMAIL_FROM`, and Supabase keys.

### Daily cron (`keelstar-daily-cron`)

| Setting | Value |
|---------|-------|
| Type | Cron Job |
| Start command | `npm run worker:daily` |
| Schedule | `0 6 * * *` (06:00 UTC daily) |

Runs cleanup, all module monitors, generic monitors, and reminder emails in one job.

Requires `RESEND_API_KEY`, `EMAIL_FROM`, exclusion env vars, and Supabase keys.

### Local debugging (individual jobs)

| Script | What it runs |
|--------|----------------|
| `npm run worker:notifications` | Email queue only |
| `npm run worker:documents` | Document extraction only |
| `npm run worker:reminders` | Reminders only |
| `npm run worker:coi-monitor` | Module monitors only |
| `npm run worker:monitors` | Generic monitors only |
| `npm run worker:cleanup` | Magic link cleanup only |
| `npm run worker:background` | Same as production background worker |
| `npm run worker:daily` | Same as production daily cron |

---

## Environment variables

### Required on all services (web + workers)

```bash
NODE_ENV=production
NODE_VERSION=20

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres

# App URLs — use production domain at launch
APP_URL=https://www.keelstar.com
NEXT_PUBLIC_APP_URL=https://www.keelstar.com
MARKETING_URL=https://www.keelstar.com
```

### Web service only

```bash
# Build (Starter 512 MB — prevents OOM during next build)
NODE_OPTIONS=--max-old-space-size=460

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...   # optional today (hosted Checkout)

# Email
RESEND_API_KEY=re_...
EMAIL_FROM=Keelstar <no-reply@your-verified-domain.com>

# Security (reserved — no HTTP cron routes wired yet)
CRON_SECRET=generate-a-random-secret
```

### Background + daily cron (email, monitors, reminders)

Set on **`keelstar-background-worker`** and **`keelstar-daily-cron`**:

```bash
RESEND_API_KEY=re_...
EMAIL_FROM=Keelstar <no-reply@your-verified-domain.com>
APP_URL=https://www.keelstar.com
NEXT_PUBLIC_APP_URL=https://www.keelstar.com
```

### Daily cron only (exclusion screening)

```bash
EXCLUSION_DATA_MODE=live
# Optional:
# OIG_DATA_SOURCE_URL=https://oig.hhs.gov/exclusions/downloadables/UPDATED.csv
# SAM_API_KEY=
```

### Optional — analytics & error tracking (web)

```bash
# Code reads NEXT_PUBLIC_POSTHOG_KEY (not POSTHOG_KEY)
NEXT_PUBLIC_POSTHOG_KEY=phc_...
SENTRY_DSN=https://...@sentry.io/...
SENTRY_AUTH_TOKEN=sntrys_...   # build-time only, if Sentry source maps enabled
```

### Optional — SEO admin (`/app/admin/seo`)

```bash
ENABLE_SEO_ANALYTICS=true
NEXT_PUBLIC_ENABLE_SEO_ADMIN=true
ADMIN_EMAILS=you@example.com
GSC_PROPERTY_URL=sc-domain:keelstar.com
GA4_PROPERTY_ID=123456789
SEO_PUBLIC_BASE_URL=https://www.keelstar.com
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}   # prefer inline on Render
DATAFORSEO_LOGIN=...
DATAFORSEO_PASSWORD=...
```

### Do not set on Render (local / CI only)

```bash
E2E_EMAIL=...
E2E_PASSWORD=...
PLAYWRIGHT_BASE_URL=...
PLAYWRIGHT_SKIP_WEBSERVER=...
```

---

## External infrastructure (before Render launch)

### Supabase

1. Create project in same region as Render (US West recommended).
2. Apply all migrations in order:

   `001_core_schema` → `002_rls_policies` → `003_w9_vendor_portal` → `004_user_profiles` → `005_coi_tracker` → `006_contract_renewal` → `007_vendor_packet` → `008_exclusion_monitoring` → `009_seo_analytics` → `010_billing_stripe` → `011_platform_features`

   ```bash
   supabase db push
   ```

3. Storage bucket `documents` is created by migration `002` (private, signed URLs only).
4. Optional seed: `/supabase/seed/seed.sql` (staging only).

**Auth settings**

- Site URL: `https://www.keelstar.com` (or your production domain)
- Redirect URLs:
  - `https://www.keelstar.com/auth/callback`
  - `http://localhost:3000/auth/callback` (local dev)
- Enable email provider and confirmations.

**RLS verification**

```sql
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
```

### Stripe (LIVE)

1. Create products and sync price IDs to Supabase:

   ```bash
   npm run stripe:setup
   ```

   Requires `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY` in `.env`.

2. Webhook endpoint: `https://www.keelstar.com/api/stripe/webhook`

3. Subscribe to events:

   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

4. Copy signing secret → `STRIPE_WEBHOOK_SECRET`.

### Resend

1. Add and verify sending domain (SPF, DKIM, DMARC).
2. Set `EMAIL_FROM` to an address on that domain.
3. Test W-9 request email before go-live.

### DNS

Point production domain (e.g. `keelstar.com` / `www.keelstar.com`) to Render and enable TLS in the Render dashboard.

---

## Recommended launch order

1. Supabase — all migrations applied.
2. Stripe — products in DB, webhook endpoint created (can use test mode first).
3. Resend — domain verified.
4. **`keelstar-web`** — all web env vars set, deploy `main`.
5. **`keelstar-background-worker`** — queued emails + document extraction.
6. **`keelstar-daily-cron`** — cleanup, monitors, reminders (single daily job).
7. Optional: PostHog, Sentry, SEO admin env vars.

---

## Post-launch verification

| Check | How |
|-------|-----|
| Web health | `GET /api/health` → 200 |
| Auth | Login, signup, forgot-password, invite accept |
| Billing | Checkout → Stripe → webhook → entitlements in Supabase |
| Billing portal | Manage / cancel subscription |
| Document upload | Upload → parsed fields on document detail |
| Email | W-9 request sends (Resend + background worker) |
| Reminders | W-9/COI request → daily cron fires on schedule |
| Monitors | Create monitor in UI → daily cron processes it |
| Module monitors | COI/contract status updates after daily cron |
| Reports | CSV exports from `/app/reports` |
| Notifications | In-app bell + `/app/notifications` |
| Stripe webhook | `webhook_events.status = processed` |

---

## Troubleshooting deploys

### `Could not find a production build in the '.next' directory`

`next start` only works after a successful `next build`.

1. **Build command missing** — `render.yaml` is not applied unless the service was created from a Blueprint. In **Settings → Build & Deploy** set:
   - **Build command:** `NPM_CONFIG_PRODUCTION=false npm ci && NODE_OPTIONS=--max-old-space-size=460 npm run build && test -f .next/BUILD_ID`
   - **Start command:** `npm run start`

2. **`NODE_ENV=production` during install** — npm skips devDependencies. Use `NPM_CONFIG_PRODUCTION=false npm ci`.

3. **Build OOM on Starter (512 MB)** — set `NODE_OPTIONS=--max-old-space-size=460` or upgrade plan.

4. **Restart without rebuild** — trigger **Manual Deploy**, not just restart.

Deploy logs should show:

```
==> Running build command 'NPM_CONFIG_PRODUCTION=false npm ci && npm run build'...
```

---

## Rollback plan

1. **Web / workers**: Render Dashboard → Deploys → Rollback to previous successful deploy.
2. **Database**: Migrations are forward-only. Write a reverse migration if needed; never edit deployed migration files.
3. **Stripe**: Failed events remain in `webhook_events` — replay after fix.
4. **Emergency**: `MAINTENANCE_MODE=true` (planned — not implemented yet).

---

## Local development

```bash
npm install
cp .env.example .env
# Fill in Supabase, Stripe (test), Resend credentials

# Optional: local Supabase
supabase start
supabase db reset

npm run dev

# Workers (separate terminals)
npm run worker:documents
npm run worker:notifications
npm run worker:monitors
npm run worker:coi-monitor
npm run worker:reminders
npm run worker:cleanup

npm test
```

---

## Monitoring & alerts

| Tool | Purpose | Where to configure |
|------|---------|-------------------|
| Render Logs | Service stdout | Built-in per service |
| Supabase Dashboard | DB metrics, auth, storage | supabase.com |
| Sentry | Error tracking | `SENTRY_DSN` on web |
| PostHog | Product analytics | `NEXT_PUBLIC_POSTHOG_KEY` on web |

Recommended alerts:

- Render health check failure on `keelstar-web`
- Sentry error spike
- Supabase connection pool warnings
- Cron job failure emails from Render

---

## Known gaps (fix before or during launch)

| Item | Issue |
|------|-------|
| `render.yaml` | Only defines web service — add 6 workers to Blueprint |
| `.env.example` | Lists `POSTHOG_KEY`; code uses `NEXT_PUBLIC_POSTHOG_KEY` |
| `CRON_SECRET` | Documented but no protected cron HTTP routes exist yet |
| Platform features | Ensure OCR, workflows, notifications, reports, monitors are committed and pushed before deploy |

---

*Render Deployment v2 — pre-launch checklist.*
