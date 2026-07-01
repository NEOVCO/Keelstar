# Keelstar SEO analytics control tower

Internal-only module ported from [TenderLedger / AO UK](../AO UK/docs/SEO_ANALYTICS_SETUP.md): **Google Search Console** + **GA4 Data API** + **DataForSEO** → Postgres → admin UI.

> **Not for production** by default. Keep `ENABLE_SEO_ANALYTICS` unset on Render unless you explicitly want admin SEO routes live.

## Quick start (local)

1. Apply migration: `009_seo_analytics.sql` (via Supabase SQL or `DATABASE_URL`).
2. Ensure `.env` has SEO variables (see below).
3. Service account JSON at `secrets/google-service-account.json` (gitignored).
4. Add the service account email to **Keelstar** GSC + GA4 properties.
5. `npm run seo:seed` then `npm run seo:sync -- all`
6. Open `/app/admin/seo` while logged in as an `ADMIN_EMAILS` user.

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ENABLE_SEO_ANALYTICS` | Yes (local) | `true` to enable `/api/admin/seo/*` |
| `NEXT_PUBLIC_ENABLE_SEO_ADMIN` | Yes (local UI) | `true` to show `/app/admin/seo` |
| `ADMIN_EMAILS` | Yes | Comma-separated platform admin emails |
| `GOOGLE_SERVICE_ACCOUNT_JSON_FILE` | Recommended | Path to GCP service account JSON |
| `GSC_PROPERTY_URL` | For GSC | e.g. `sc-domain:keelstar.com` or `https://www.keelstar.com/` |
| `GA4_PROPERTY_ID` | For GA4 | Numeric GA4 property ID (not `G-` measurement ID) |
| `SEO_PUBLIC_BASE_URL` | Optional | Default `https://www.keelstar.com` |
| `DATAFORSEO_LOGIN` | Optional | DataForSEO API login |
| `DATAFORSEO_PASSWORD` | Optional | DataForSEO API password |
| `DATABASE_URL` | Yes | Same Postgres as Supabase (for sync scripts + API) |

## Google Cloud setup

1. Reuse the TenderLedger GCP service account **or** create a new one.
2. Enable **Search Console API** and **Google Analytics Data API**.
3. In [Search Console](https://search.google.com/search-console): add service account email to **keelstar.com** property.
4. In GA4 Admin → Property access: add service account as **Viewer**.
5. Set `GSC_PROPERTY_URL` to the exact property string (domain: `sc-domain:keelstar.com`).

## CLI

```bash
npm run seo:seed          # seed seo_page_catalog from sitemap
npm run seo:sync -- gsc   # GSC last 15 days
npm run seo:sync -- ga4   # GA4 last 15 days
npm run seo:sync -- all   # both
```

## API routes (admin auth)

- `GET /api/admin/seo/status`
- `GET /api/admin/seo/overview?days=28`
- `POST /api/admin/seo/sync/gsc?days=15`
- `POST /api/admin/seo/sync/ga4?days=15`
- `POST /api/admin/seo/seed-catalog`
- `POST /api/admin/seo/keywords` — body `{ "keywords": ["w9 request", ...] }`

## Tables

`gsc_page_daily`, `gsc_query_page_daily`, `ga4_landing_page_daily`, `seo_page_catalog`, `seo_page_diagnostics_daily`, `seo_sync_state`

## Keelstar vs TenderLedger

| TenderLedger | Keelstar |
|--------------|----------|
| FastAPI + Celery | Next.js API routes + `scripts/seo-sync.ts` |
| SQLAlchemy | `pg` pool |
| TenderLedger URL catalog | Sitemap + SEO landing paths |
| Same GSC/GA4 schema | Migration `009` |

## Next steps

- Port full diagnostics engine (`opportunity_type` scoring)
- Scheduled worker cron for daily 15-day sync
- LLM JSON summary endpoints for content planning
