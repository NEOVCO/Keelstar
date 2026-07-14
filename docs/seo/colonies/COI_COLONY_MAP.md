# COI Colony Map

**Colony ID:** `coi`  
**Head hub:** `/certificate-of-insurance/`  
**Head solution:** `/solutions/coi-tracking-software/`  
**Head product:** `/products/coi-tracker/`  
**Head tool:** `/tools/acord-analyzer/`

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

**Total colony pages:** 40

---

## Head pages (one URL per head keyword)

| Page | Path | Primary keyword |
|------|------|-----------------|
| Hub | `/certificate-of-insurance/` | certificate of insurance |
| Solution | `/solutions/coi-tracking-software/` | coi tracking software |
| Product | `/products/coi-tracker/` | coi tracker software |
| Tool | `/tools/acord-analyzer/` | acord analyzer |

Do not create additional URLs targeting these head terms.

---

## Glossary colony (tier 1)

| Slug | Keyword | Link up |
|------|---------|---------|
| `certificate-of-insurance` | certificate of insurance | hub, head solution, COI checklist guide |
| `acord-25` | acord 25 | hub, head solution, ACORD 25 read guide |
| `additional-insured` | additional insured | hub, head solution, additional insured guide |
| `coverage-limit` | coverage limit | hub, head solution, verify limits guide |
| `coi-tracking` | coi tracking | hub, head solution, product |
| `waiver-of-subrogation` | waiver of subrogation | head solution, hub, COI checklist guide |
| `certificate-holder` | certificate holder | hub, head solution, COI request guide |
| `certificate-expiration-date` | certificate expiration date | hub, head solution, track expirations guide |

---

## Guide colony (tier 2)

Hub-curated guides (`COI_HUB_COLONY_GUIDES` — shown on `/certificate-of-insurance/`):

1. How to track COI expirations
2. How to read an ACORD 25 certificate
3. What to check on a certificate of insurance
4. How to request a certificate of insurance
5. How to set COI expiration reminders
6. How to handle an expired certificate of insurance
7. How to collect COIs from subcontractors
8. How to verify coverage limits on a COI
9. What is an ACORD 25 form?

Additional colony guides (funnel links in guide CTA box):

- How to build a COI renewal process
- How to audit vendor insurance compliance
- How to set vendor insurance requirements
- What additional insured means for your business
- How to verify general liability on a COI
- How to collect COIs before vendor go-live

---

## Industry + solutions (tier 3)

| Path | Keyword |
|------|---------|
| `/industries/construction/track-coi-expirations/` | construction coi tracking |
| `/industries/healthcare/track-coi-expirations/` | healthcare coi tracking |
| `/solutions/coi-tracking-software/` | coi tracking software |
| `/solutions/coi-expiration-alerts/` | coi expiration alerts |
| `/solutions/acord-25-tracking/` | acord 25 tracking |
| `/solutions/certificate-of-insurance-tracker/` | certificate of insurance tracker |
| `/solutions/coi-renewal-reminders/` | coi renewal reminders |
| `/solutions/vendor-insurance-certificate-tracking/` | vendor insurance certificate tracking |
| `/solutions/additional-insured-certificate/` | additional insured certificate |
| `/solutions/coi-requirements-tracking/` | coi requirements tracking |
| `/solutions/coi-expiration-alert-system/` | coi expiration alert system |
| `/solutions/acord-25-tracking-tool/` | acord 25 tracking tool |
| `/solutions/coi-subcontractor-monitoring/` | coi subcontractor monitoring |
| `/solutions/coi-coverage-gap-alerts/` | coi coverage gap alerts |

---

## Link-up rules (every colony page)

1. **Link up** — Each page links to 1–3 higher-tier targets via `linkUp` (internal links only, never redirects).
2. **Link sideways** — 2–3 sibling pages at the same tier via `linkSideways`.
3. **Glossary down** — Guides and solutions reference at least one glossary term.
4. **One keyword per URL** — No cannibalization across colony pages. Hub head keyword is `certificate of insurance`; avoid repeating `coi tracking` on multiple non-glossary pages.
5. **Hub receives equity** — All tiers link to `/certificate-of-insurance/`; hub links to product + solution + tool.

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
- [ ] Head hub `/certificate-of-insurance/` impressions trending up
- [ ] No two colony URLs ranking for the same primary query (cannibalization)
- [ ] Hub page has clicks from colony guide internal links (behavior / scroll depth)
- [ ] Product page conversions from COI guide CTAs
- [ ] New long-tail candidates from `npm run seo:longtail` assigned to glossary or guide — not hub

### Red flags

- Two guides targeting the same keyword → merge or differentiate intent
- Colony page with zero impressions after 90 days → strengthen `linkUp` or consolidate
- Head hub losing position while colonies rank → add more hub links from winning colonies

---

## Expansion queue (not in colony yet)

Phase 3 COI guides (e.g. tenant COI tracking, professional liability verification) should be added to `COI_PAGES` with unique keywords before publishing. Assign each a `linkUp` path through this map.
