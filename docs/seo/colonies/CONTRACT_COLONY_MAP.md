# Contract Colony Map

**Colony ID:** `contract`  
**Head hub:** `/solutions/contract-renewal-tracking/` (solution page — no static hub)  
**Head solution:** `/solutions/contract-renewal-tracking/`  
**Head product:** `/products/contract-renewal-tracker/`  
**Head tool:** `/tools/contract-renewal-extractor/`

Source of truth: `src/lib/seo-colonies/`

---

## Tier ladder

| Tier | Count | Role | Keyword difficulty |
|------|------:|------|-------------------|
| Glossary | 8 | Definitions, zero-competition entry | Easy |
| Guide | 15 | How-to long-tail | Easy–hard |
| Industry | 2 | Vertical mid-funnel | Medium |
| Solution | 11 | Commercial workflow pages | Medium–hard |
| Hub | 1 | Pillar authority (solution URL) | Hard |
| Product | 1 | Conversion page | Hard |
| Tool | 1 | Free utility funnel | Medium |

**Total colony pages:** 39

---

## Head pages (one URL per head keyword)

| Page | Path | Primary keyword |
|------|------|-----------------|
| Hub / Solution | `/solutions/contract-renewal-tracking/` | contract renewal tracking |
| Product | `/products/contract-renewal-tracker/` | contract renewal tracker |
| Tool | `/tools/contract-renewal-extractor/` | contract renewal extractor |

There is no separate static hub landing. The head solution page receives hub authority and displays `colonyGuideLinks` injected in `src/lib/seo-landing/data.ts`.

Do not create additional URLs targeting these head terms.

---

## Glossary colony (tier 1)

| Slug | Keyword | Link up |
|------|---------|---------|
| `auto-renewal-clause` | auto-renewal clause | hub, head solution, avoid auto-renewals guide |
| `notice-period` | contract notice period | hub, head solution, find notice period guide |
| `evergreen-contract` | evergreen contract | hub, head solution, avoid auto-renewals guide |
| `renewal-date` | contract renewal date | hub, head solution, track renewals guide |
| `termination-clause` | contract termination clause | hub, head solution, non-renewal guide |
| `statement-of-work` | statement of work | hub, head solution, MSA SOW linking solution |
| `effective-date` | contract effective date | hub, head solution, track renewals guide |
| `termination-for-convenience` | termination for convenience | hub, head solution, termination clause |

---

## Guide colony (tier 2)

Hub-curated guides (`CONTRACT_HUB_COLONY_GUIDES` — shown on `/solutions/contract-renewal-tracking/`):

1. How to track contract renewals (core)
2. How to avoid accidental auto-renewals
3. How to build a contract renewal calendar
4. How to find a contract notice period (core)
5. How to track notice periods across a portfolio
6. How to maintain a contract renewal calendar
7. How to track SaaS contract renewals
8. How to monitor notice periods for vendors
9. How to avoid missing contract renewal deadlines

Additional colony guides (funnel links in guide CTA box):

- How to give notice of non-renewal
- How to prepare for a contract renegotiation
- How to document contract renewal decisions
- How to renew a vendor contract
- How to negotiate before auto-renewal
- How to link contracts to vendor records

---

## Industry + solutions (tier 3)

| Path | Keyword |
|------|---------|
| `/industries/logistics/monitor-contract-renewals/` | logistics contract renewals |
| `/industries/manufacturing/monitor-contract-renewals/` | manufacturing contract renewals |
| `/solutions/contract-renewal-tracking/` | contract renewal tracking |
| `/solutions/contract-expiration-alerts/` | contract expiration alerts |
| `/solutions/contract-notice-period-tracking/` | contract notice period tracking |
| `/solutions/vendor-contract-management/` | vendor contract management |
| `/solutions/contract-risk-review-software/` | contract risk review software |
| `/solutions/contract-review-checklist/` | contract review checklist |
| `/solutions/contract-notice-period-tracker/` | contract notice period tracker |
| `/solutions/contract-saas-renewal-management/` | saas contract renewal management |
| `/solutions/contract-obligation-tracking/` | contract obligation tracking |
| `/solutions/contract-msa-sow-linking/` | msa sow linking |
| `/solutions/contract-auto-renewal-prevention/` | contract auto-renewal prevention |

---

## Colony funnel (guide CTA box)

Every contract colony guide resolves via `getContractColonyFunnelForGuide`:

1. Contract renewal tracking → `/solutions/contract-renewal-tracking/`
2. Contract Renewal Tracker → `/products/contract-renewal-tracker/`
3. Contract renewal extractor → `/tools/contract-renewal-extractor/`
4. Notice period calculator (notice-related guides) → `/tools/notice-period-calculator/`

---

## Link-up rules (every colony page)

1. **Link up** — Each page links to 1–3 higher-tier targets via `linkUp` (internal links only, never redirects).
2. **Link sideways** — 2–3 sibling pages at the same tier via `linkSideways`.
3. **Glossary down** — Guides and solutions reference at least one glossary term.
4. **One keyword per URL** — No cannibalization across colony pages. Head keyword is `contract renewal tracking`; avoid repeating it on non-head pages.
5. **Hub receives equity** — All tiers link to `/solutions/contract-renewal-tracking/`; hub links to product + solution + tool.

### Tier-specific defaults

| Tier | Link up to |
|------|------------|
| Glossary | hub, head solution, related glossary/guide |
| Guide | head solution, hub, product |
| Industry | hub, head solution, product |
| Solution | hub, head solution, product |
| Tool | hub, product, head solution |
| Hub | product, head solution, tool |
| Product | hub, head solution |

---

## Measurement checklist (GSC)

Run monthly after `npm run seo:sync -- all`:

- [ ] Colony guides show impressions with avg position &lt; 20
- [ ] Head solution `/solutions/contract-renewal-tracking/` impressions trending up
- [ ] No two colony URLs ranking for the same primary query (cannibalization)
- [ ] Solution page has clicks from colony guide internal links (behavior / scroll depth)
- [ ] Product page conversions from contract guide CTAs
- [ ] New long-tail candidates from `npm run seo:longtail` assigned to glossary or guide — not head solution

### Red flags

- Two guides targeting the same keyword → merge or differentiate intent
- Colony page with zero impressions after 90 days → strengthen `linkUp` or consolidate
- Head solution losing position while colonies rank → add more hub links from winning colonies

---

## Expansion queue (not in colony yet)

Remaining phase 2 contract guides (e.g. portfolio management, offboarding at contract end, evergreen vendor contracts) should be added to `CONTRACT_PAGES` with unique keywords before publishing. Assign each a `linkUp` path through this map.
