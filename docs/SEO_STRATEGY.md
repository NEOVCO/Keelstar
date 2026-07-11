# Keelstar SEO Strategy (minimal)

> Landing pages only. No navigation or homepage changes.

## Pages

### Static hub pages (6)

| Route | Primary keyword |
|-------|-----------------|
| `/vendor-portal/` | vendor portal |
| `/vendor-compliance/` | vendor compliance software |
| `/vendor-onboarding/` | vendor onboarding |
| `/w9-collection/` | w9 request |
| `/certificate-of-insurance/` | certificate of insurance |
| `/exclusion-monitoring/` | oig exclusion list |

### Dynamic cluster pages (50)

Programmatic SEO landing pages generated from `src/lib/seo-landing/clusters/` via `buildPagesFromSpecs`.

| Cluster | Count | Example slugs |
|---------|------:|---------------|
| W-9 | 10 | `w9-request-from-vendor`, `stale-w9-alerts` |
| COI | 10 | `coi-tracking-software`, `additional-insured-certificate` |
| OIG | 8 | `oig-exclusion-check`, `medicaid-vendor-screening` |
| Vendor onboarding | 8 | `vendor-packet-software`, `vendor-setup-portal` |
| Contract | 6 | `contract-renewal-tracking`, `contract-review-checklist` |
| Invoice | 4 | `invoice-approval-workflow`, `overdue-invoice-approval-tracking` |
| Policy | 4 | `policy-acknowledgment-tracking`, `policy-attestation-software` |

**Total:** 57 indexed SEO landing routes (6 static hubs + 50 dynamic cluster pages + `/solutions/` index), plus tool pages listed below.

Dynamic pages live at `/solutions/{slug}/` (e.g. `/solutions/w9-request-from-vendor/`).

### Programmatic guides (Phase 1 — 25 new)

Factory: `src/lib/guides/create-guide.ts` + `src/lib/guides/clusters/`.

| Cluster | Batch 1 | Manifest |
|---------|--------:|----------|
| W-9 | 15 | `docs/seo/phase1-manifest.jsonl` |
| OIG | 10 | same |

See [SEO_1000_PAGE_PLAN.md](./SEO_1000_PAGE_PLAN.md) for the full 1,000-page roadmap.

| Route | Primary keyword |
|-------|-----------------|
| `/tools/w9-request-generator/` | w9 request |
| `/tools/vendor-information-form-template/` | vendor information form |

## Rules

- Reuse existing components (`Container`, `Section`, `CtaBand`, `Faq`, `Breadcrumbs`)
- Contextual internal links inside page body only
- No fake functionality on exclusion monitoring
- Dynamic pages use `/solutions/[slug]/` with `RESERVED_SLUGS` so static hubs keep dedicated routes
