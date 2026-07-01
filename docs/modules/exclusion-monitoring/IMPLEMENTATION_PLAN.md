# Exclusion Monitoring — Implementation Plan

## Phase 1 — Foundation
1. Migration `008_exclusion_monitoring.sql` (tables + RLS + indexes)
2. `src/lib/exclusions/constants.ts`
3. Provider abstraction + demo dataset + OIG/SAM providers

## Phase 2 — Core logic
4. `matchScoring.ts` — normalized exact match
5. `runScreening.ts` — orchestrate run, store results
6. `reviewResult.ts` — clear / confirm with required notes
7. `createMonitor.ts` + `exclusionMonitor.ts` — monthly schedule

## Phase 3 — API
8. `POST /api/exclusions/screen`
9. `GET/POST /api/exclusions/subjects/[id]`
10. `GET/POST /api/exclusions/results/[id]`

## Phase 4 — UI
11. `ExclusionsModulePage`
12. `RunScreeningForm`, result/subject pages
13. Vendor detail `ExclusionScreeningCard`

## Phase 5 — Ops
14. Worker bundle update
15. Email templates
16. Billing limits
17. Tests + demo seed
