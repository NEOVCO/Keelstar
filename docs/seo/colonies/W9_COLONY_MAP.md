# W-9 Colony Map

**Colony ID:** `w9`  
**Head hub:** `/w9-collection/`  
**Head solution:** `/solutions/w9-request-from-vendor/`  
**Head product:** `/products/w9-collector/`  
**Head tool:** `/tools/w9-request-generator/`

Source of truth: `src/lib/seo-colonies/`

---

## Tier ladder

| Tier | Count | Role | Keyword difficulty |
|------|------:|------|-------------------|
| Glossary | 8 | Definitions, zero-competition entry | Easy |
| Guide | 15 | How-to / what-is long-tail | Easy–hard |
| Industry | 2 | Vertical mid-funnel | Medium |
| Solution | 12 | Commercial workflow pages | Medium–hard |
| Hub | 1 | Pillar landing | Hard |
| Product | 1 | Conversion page | Hard |
| Tool | 1 | Free utility funnel | Medium |

**Total colony pages:** 41

---

## Head pages (one URL per head keyword)

| Page | Path | Primary keyword |
|------|------|-----------------|
| Hub | `/w9-collection/` | w9 request |
| Solution | `/solutions/w9-request-from-vendor/` | w9 request from vendor |
| Product | `/products/w9-collector/` | w9 collector software |
| Tool | `/tools/w9-request-generator/` | w9 request generator |

Do not create additional URLs targeting these head terms.

---

## Glossary colony (tier 1)

| Slug | Keyword | Link up |
|------|---------|---------|
| `w-9` | form w-9 | hub, head solution, IRS form guide |
| `tin-matching` | tin matching | hub, head solution, TIN validation guide |
| `backup-withholding` | backup withholding | hub, head solution, backup withholding guide |
| `1099-nec` | 1099 nec | hub, 1099 guide, head solution |
| `taxpayer-identification-number` | taxpayer identification number | hub, w-9, TIN validation guide |
| `tin-validation` | tin validation | hub, head solution, product |
| `exempt-payee-code` | exempt payee code | head solution, hub, backup withholding |
| `payee-name-mismatch` | payee name mismatch | head solution, TIN mismatch guide, hub |

---

## Guide colony (tier 2)

Hub-curated guides (`W9_HUB_COLONY_GUIDES` — shown on `/w9-collection/`):

1. How to collect W-9s from vendors
2. How to request a W-9 from a new vendor
3. How to send a W-9 request email
4. What is IRS Form W-9?
5. How to validate a vendor TIN
6. How to re-collect stale W-9s
7. How to bulk request W-9s from vendors
8. How to prepare for 1099 filing season
9. How to handle a missing W-9 at year-end

Additional colony guides (funnel links in guide CTA box):

- What is backup withholding and how to avoid it
- How to collect W-9s before first payment
- How to handle W-9 for LLC vendors
- How to fix a TIN mismatch on a W-9
- W-9 vs W-8: which form
- When to issue a 1099 to a vendor

---

## Industry + solutions (tier 3)

| Path | Keyword |
|------|---------|
| `/industries/healthcare/collect-w9s/` | healthcare vendor w9 collection |
| `/industries/professional-services/collect-w9s/` | professional services w9 collection |
| `/solutions/w9-request-from-vendor/` | w9 request from vendor |
| `/solutions/collect-w9-online/` | collect w9 online |
| `/solutions/bulk-w9-request/` | bulk w9 request software |
| `/solutions/w9-reminder-automation/` | w9 reminder automation |
| `/solutions/stale-w9-alerts/` | stale w9 alerts |
| `/solutions/w9-validation-before-payment/` | w9 validation before payment |
| `/solutions/w9-collection-software/` | w9 collection software |
| `/solutions/w9-bulk-collection-software/` | w9 bulk collection software |
| `/solutions/w9-backup-withholding-controls/` | w9 backup withholding controls |
| `/solutions/w9-year-end-audit-packet/` | w9 year end audit packet |
| `/solutions/w9-llc-classification-check/` | w9 llc classification check |
| `/solutions/vendor-w9-management/` | vendor w9 management |

---

## Link-up rules (every colony page)

1. **Link up** — Each page links to 1–3 higher-tier targets via `linkUp` (internal links only, never redirects).
2. **Link sideways** — 2–3 sibling pages at the same tier via `linkSideways`.
3. **Glossary down** — Guides and solutions reference at least one glossary term.
4. **One keyword per URL** — No cannibalization across colony pages. Hub head keyword is `w9 request`; avoid repeating `w9 form` on multiple non-glossary pages.
5. **Hub receives equity** — All tiers link to `/w9-collection/`; hub links to product + solution + tool.

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
- [ ] Head hub `/w9-collection/` impressions trending up
- [ ] No two colony URLs ranking for the same primary query (cannibalization)
- [ ] Hub page has clicks from colony guide internal links (behavior / scroll depth)
- [ ] Product page conversions from W-9 guide CTAs
- [ ] New long-tail candidates from `npm run seo:longtail` assigned to glossary or guide — not hub

### Red flags

- Two guides targeting the same keyword → merge or differentiate intent
- Colony page with zero impressions after 90 days → strengthen `linkUp` or consolidate
- Head hub losing position while colonies rank → add more hub links from winning colonies

---

## Expansion queue (not in colony yet)

Phase 3 W-9 guides (e.g. S-corp, partnership, contractor W-9 handling) should be added to `W9_PAGES` with unique keywords before publishing. Assign each a `linkUp` path through this map.
