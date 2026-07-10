# Keelstar US Search Campaign — DRAFT (do not enable)

**Status:** Paused draft for review  
**Daily budget:** $15.00 USD | **Market:** United States only | **Network:** Search only

## Credentials status

| Variable | Status |
|----------|--------|
| `DATAFORSEO_LOGIN` / `DATAFORSEO_PASSWORD` | Present — used for keyword research |
| `GOOGLE_SERVICE_ACCOUNT_JSON_FILE` | Present — GSC/GA4 only, not Ads API |
| `GOOGLE_ADS_*` | **Not configured** — cannot push to Ads account via API |
| TenderLedger `AW-18038241178` | UK tag in AO UK — not on Keelstar |

Required for API push: `GOOGLE_ADS_DEVELOPER_TOKEN`, `CLIENT_ID`, `CLIENT_SECRET`, `REFRESH_TOKEN`, `CUSTOMER_ID`, `LOGIN_CUSTOMER_ID`, `CONVERSION_ACTION_ID`, `NEXT_PUBLIC_GOOGLE_ADS_ID`.

## Keyword research (DataForSEO, US)

**Target:** oig exclusion list search (2,900/mo, $7.88 CPC), oig check (1,000, $8.64), leie database search (30, $4.95), oig exclusion list screening (30, low comp), supplier compliance software (30, low comp).

**Avoid:** vendor onboarding software ($110 CPC), vendor compliance software ($71), coi tracking software ($47).

## Campaign

**Name:** `[DRAFT] Keelstar | US Search | Vendor Compliance`  
**Budget:** $15/day | **Bidding:** Manual CPC → Maximize conversions after 15 signups  
**Geo:** United States | **Language:** English | **Partners:** Off

### Ad Group 1: OIG Exclusion Monitoring (65%) → `/exclusion-monitoring/`

Keywords (phrase/exact, max CPC $2.50–$4.50): oig exclusion list search, oig check, oig exclusion list check, oig exclusion list screening, oig exclusion screening, oig exclusion monitoring, oig screening, leie database search, exclusion screening services, oig sanction checks.

### Ad Group 2: Vendor Compliance (25%) → `/vendor-compliance/`

Keywords: supplier compliance software, supplier compliance management software, healthcare vendor compliance, vendor document management, third party vendor compliance.

### Ad Group 3: COI & W-9 (10%) → `/w9-collection/`

Keywords: certificate of insurance management software, coi tracking system, w9 collection.

### Negatives

jobs, careers, salary, nursing, physician, pdf, definition, wikipedia, sam.gov, sam exclusion, gsa exclusion, government contract jobs.

## RSA — OIG ad group

**URL:** `https://www.keelstar.com/exclusion-monitoring/?utm_source=google&utm_medium=cpc&utm_campaign=us-vendor-compliance`

**Headlines:** OIG Exclusion Monitoring | Screen Vendors Against OIG | LEIE Checks on a Schedule | Dated Audit Records Built In | Stop Spreadsheet Screening | Re-Screen Vendors Automatically | OIG LEIE Screening Software | Catch Exclusions Before Pay | Export Evidence for Audits | Start Free — No Setup Fee | Built for Healthcare Teams | Self-Serve Vendor Compliance | W-9 + COI + OIG Together | $49/Workflow — Start Today | Continuous OIG Monitoring

**Descriptions:**
1. Screen vendors against the OIG LEIE list on a schedule. Keep dated records and export audit evidence. Start free today.
2. Replace one-time OIG searches with continuous monitoring. Review matches, log dispositions, and re-screen automatically.
3. W-9 collection, COI tracking, and OIG screening in one vendor record. Self-serve pricing from $49/workflow.
4. No enterprise suite required. Keelstar is live the same day with reminders, audit trails, and exports.

## Extensions

Sitelinks: Exclusion Monitor, W-9 Collector, COI Tracker, Free Tools, Pricing.  
Callouts: Dated audit records, Self-serve pricing, No setup fees, Scheduled re-screens.

## Before launch

- [ ] Campaign **Paused**
- [ ] Signup conversion on `app.keelstar.com/signup`
- [ ] Add `AW-` gtag to Keelstar
- [ ] US geo only, search partners off
