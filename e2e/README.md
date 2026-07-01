# Playwright E2E

Browser tests for Keelstar using [Playwright](https://playwright.dev/).

## Setup

```bash
npm install
npx playwright install chromium
```

Set credentials in `.env` (or use defaults for local seed):

```
E2E_EMAIL=admin@keelstar.test
E2E_PASSWORD=...
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run test:e2e` | Full suite (starts dev server if not running) |
| `npm run test:e2e:audit` | Route audit only; writes `e2e/reports/audit-*.md` |
| `npm run test:e2e:ui` | Interactive UI mode |
| `npm run test:e2e:report` | Open HTML report after a run |
| `npm run test:e2e-w9` | W-9 lib-level flow (service role) |
| `npm run test:e2e-coi` | COI lib-level flow |
| `npm run test:e2e-contracts` | Contract lib-level flow |

Skip auto-starting the dev server when one is already up:

```bash
PLAYWRIGHT_SKIP_WEBSERVER=1 npm run test:e2e
```

## Structure

```
e2e/
  auth.setup.ts       # Login → storage state
  smoke/public.spec.ts
  app/navigation.spec.ts
  app/modules.spec.ts
  flows/w9-happy-path.spec.ts
  flows/coi-happy-path.spec.ts
  flows/contracts-happy-path.spec.ts
  audit/route-audit.spec.ts
  helpers/audit.ts
  reports/            # Generated audit markdown
```

## CI

Set `CI=1` for retries and a fresh web server. Store `E2E_EMAIL` / `E2E_PASSWORD` as secrets.

## Free tier limits

Flow tests create real records. On the free tier they **skip** when usage limits are hit (402). For a full run:

1. Apply `supabase/seed/demo_org.sql` so the test org has trial entitlements, or
2. Archive old `E2E *` vendors (tests auto-clean these when the vendor cap is reached), or
3. Use a fresh org via onboarding.

```bash
npm run test:e2e:flows   # serial happy-path tests (W-9, COI, contracts)
npm run test:e2e-w9      # lib-level W-9 flow (service role)
npm run test:e2e-coi
npm run test:e2e-contracts
```
