# Keelstar 1,000-Page SEO Plan

**Created:** 2026-07-11  
**Status:** Phase 1 in progress  
**Goal:** Capture long-tail and short-tail US keywords through high-quality articles that convert to free tools and monitored workflows.

---

## Tools & data sources

| Tool | Status | Use |
|------|--------|-----|
| **DataForSEO** (`DATAFORSEO_LOGIN` / `PASSWORD`) | Credentials OK — **account needs credits** (402 Payment Required) | Keyword volume, `keywords_for_keywords`, SERP |
| **Google Search Console** (`GSC_PROPERTY_URL` + service account) | Configured | Query mining, impression-based prioritization |
| **GA4** (`GA4_PROPERTY_ID`) | Configured | Landing page performance |
| **SEO control tower** (`npm run seo:seed`, `seo:sync`) | Ready | `gsc_query_page_daily`, page catalog |
| **llms.txt** (`/llms.txt`) | Live | Curated index for AI crawlers |
| **`npm run audit:seo-size`** | Live | Keep pages under 2 MB |

**Action:** Top up DataForSEO credits (~$50–100) before batch keyword expansion.

---

## Current baseline (~220 URLs)

| Layer | Count | Route | Intent |
|-------|------:|-------|--------|
| Guides (handwritten) | ~78 | `/guides/{slug}/` | Informational articles |
| Solutions | 50 | `/solutions/{slug}/` | Commercial mid-funnel |
| Hub landings | 6 | `/vendor-compliance/`, etc. | Pillars |
| Glossary | ~80+ | `/glossary/{slug}/` | Short-tail definitions |
| Compare | ~25 | `/compare/{slug}/` | Bottom-funnel |
| Tools, workflows, industries, products | ~55 | Various | Supporting |

**Gap to 1,000:** ~780 net-new pages.

---

## Keyword research summary (US, DataForSEO — prior pulls)

### Short-tail heads (pillar + glossary only — do not spam)

| Cluster | Keywords | Vol/mo | CPC | Strategy |
|---------|----------|--------|-----|----------|
| W-9 | `w9`, `w9 form`, `irs w9` | 300k–370k | ~$4 | 1 pillar guide + glossary; long-tail spokes |
| COI | `coi`, `certificate of insurance` | 12k–40k | $30–40 | Pillar + ACORD cluster |
| OIG | `oig exclusion list`, `oig check` | 1k–6.6k | ~$8 | **Highest Keelstar commercial fit** |
| Vendor | `vendor portal`, `vendor onboarding` | 600–10k | $20–96 | Playbooks + solutions |
| Contract | `contract renewal`, CLM terms | 600–12k | $23–200+ | Target renewal/notice only |
| E-sign | `electronic signature` | 18k | ~$8 | Deprioritize (DocuSign battlefield) |

### Mid-tail (best article + solution ROI)

| Keyword | Vol | CPC | Page type |
|---------|-----|-----|-----------|
| `w9 request` | 390 | ~$5 | Guide + solution |
| `acord 25` | 3,600 | ~$13 | Guide + solution |
| `oig exclusion list search` | 2,900 | ~$8 | Guide + solution |
| `vendor packet` | 210 | ~$10 | Guide + solution |
| `policy acknowledgment` | 70 | low | Guide |
| `leie database search` | 30 | ~$5 | Guide + solution |

### Long-tail patterns (bulk of 1,000)

- `how to [verb] [object]`
- `what is [term]`
- `[industry] [workflow]`
- `[object] checklist | requirements | template`
- `when to [action]` / `how often to [action]`
- `[tool] vs [alternative]`

---

## Target architecture (1,000 pages)

| Route | Target | Role |
|-------|-------:|------|
| `/guides/` | **500** | Primary informational articles |
| `/glossary/` | **200** | Short-tail definitions → link up |
| `/solutions/` | **150** | Commercial (50 done, +100) |
| `/industries/` | **80** | Industry × workflow matrix |
| `/compare/` | **40** | Keelstar vs X |
| `/learn/` (optional) | **30** | Multi-section playbooks |

---

## Cluster allocation (500 guides)

| Cluster | Guides | Product | Workflow |
|---------|-------:|---------|----------|
| W-9 & 1099 | 90 | w9-collector | collect-w9s |
| COI & insurance | 90 | coi-tracker | track-coi-expirations |
| OIG / exclusion | 70 | exclusion-monitor | screen-vendors-against-exclusion-lists |
| Vendor onboarding | 80 | vendor-packet | build-vendor-onboarding-packets |
| Contracts & renewals | 70 | contract-renewal-tracker | monitor-contract-renewals |
| Invoice / AP | 50 | invoice-approval | route-invoice-approvals |
| Policy & training | 50 | policy-acknowledgment-tracker | send-policy-acknowledgments |
| Platform / audit | 40 | platform | build-audit-trails |
| Industry overlays | 60 | varies | varies |

---

## Internal linking mesh

```
Glossary → Guide (deep) → Solution (commercial) → Product → Signup
              ↑                    ↓
         Industry page ────────────┘
         Hub landing (/w9-collection/, etc.)
```

Rules:
- Every guide: 1 glossary term, 1 solution, 1 product, 2 sibling guides
- Hub pages link top 10 guides per cluster
- `/solutions/` index = crawl hub
- `llms.txt` lists top 100 URLs per cluster (not all 1,000)

---

## Production system

| Step | Implementation |
|------|----------------|
| Spec format | `GuideArticleSpec` in `src/lib/guides/create-guide.ts` |
| Cluster files | `src/lib/guides/clusters/*.ts` |
| Keyword manifest | `docs/seo/phase1-manifest.jsonl` |
| Quality gate | Min 600 words: answer (80w) + 3+ sections + 5 FAQs |
| Cannibalization | Guides = info; Solutions = commercial; 1 keyword → 1 URL |
| Size audit | `npm run audit:seo-size` |
| Publish velocity | 25 pages/week → 1,000 in ~40 weeks |

---

## Rollout phases

### Phase 1 — Foundation (weeks 1–4, 60 pages) ← **CURRENT**

- [x] Save this plan
- [ ] `GuideSpec` factory
- [ ] Batch 1: 25 guides (15 W-9 + 10 OIG) — **in progress**
- [ ] Batch 2: 10 COI guides
- [ ] Batch 3: 25 more W-9/OIG guides
- [ ] Recharge DataForSEO; seed `seo_keyword_catalog`
- [ ] Enable GSC sync for impression-based tuning

### Phase 2 — Scale (weeks 5–8, 65 pages)

- 40 vendor/contract guides
- +30 solutions pages
- +50 glossary terms

### Phase 3 — Industry (weeks 9–12, 50 pages)

- 10 industries × 5 workflows = 50 at `/industries/{industry}/{workflow}/`

### Phase 4 — GSC long-tail (week 13+, ongoing)

- Publish from `gsc_query_page_daily` where impressions ≥ 50

---

## Risks

| Risk | Mitigation |
|------|------------|
| Thin content | Min 600 words; unique answer block per page |
| Cannibalization | Separate guide vs solution intent |
| W-9 head terms | One pillar, not 500 `w9 form` clones |
| Crawl budget | Sitemap priorities: hubs 0.9, guides 0.7, glossary 0.6 |
| DataForSEO cost | Batch API calls; cache in Postgres |

---

## Related docs

- [SEO_STRATEGY.md](./SEO_STRATEGY.md) — landing page rules
- [SEO_ANALYTICS_SETUP.md](./SEO_ANALYTICS_SETUP.md) — GSC/GA4/DataForSEO setup
- [docs/seo/phase1-manifest.jsonl](./seo/phase1-manifest.jsonl) — Phase 1 keyword manifest
- [docs/google-ads/KEELSTAR-US-SEARCH-DRAFT.md](./google-ads/KEELSTAR-US-SEARCH-DRAFT.md) — Paid search draft
