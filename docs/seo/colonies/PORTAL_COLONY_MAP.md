# Portal Colony Map

**Colony ID:** `portal`  
**Head hub:** `/vendor-portal/`  
**Head solution:** `/solutions/vendor-setup-portal/`  
**Head product:** `/products/vendor-packet/`  
**Head tool:** `/tools/vendor-onboarding-packet-generator/`

Source of truth: `src/lib/seo-colonies/`

---

## Tier ladder

| Tier | Count | Role | Keyword difficulty |
|------|------:|------|-------------------|
| Glossary | 4 | Definitions, zero-competition entry | Easy |
| Guide | 15 | How-to / what-is long-tail | Easy–medium |
| Industry | 2 | Vertical mid-funnel | Medium |
| Solution | 10 | Commercial workflow pages | Medium |
| Hub | 1 | Pillar landing | Hard |
| Product | 1 | Conversion page | Hard |
| Tool | 1 | Free utility funnel | Medium |

**Total colony pages:** 34

---

## Head pages (one URL per head keyword)

| Page | Path | Primary keyword |
|------|------|-----------------|
| Hub | `/vendor-portal/` | vendor portal |
| Solution | `/solutions/vendor-setup-portal/` | vendor setup portal |
| Product | `/products/vendor-packet/` | vendor packet software |
| Tool | `/tools/vendor-onboarding-packet-generator/` | vendor onboarding packet generator |

Do not create additional URLs targeting these head terms.

---

## Glossary colony (tier 1)

| Slug | Keyword | Link up |
|------|---------|---------|
| `vendor-onboarding` | vendor onboarding | hub, head solution, checklist guide |
| `onboarding-packet` | onboarding packet | hub, head solution, vendor packet guide |
| `vendor-packet` | vendor packet | hub, head solution, what-is-a-vendor-packet guide |
| `vendor-master-record` | vendor master record | hub, head solution, product |

---

## Guide colony (tier 2)

Hub-curated guides (`PORTAL_HUB_COLONY_GUIDES` — shown on `/vendor-portal/`):

1. How to send a vendor portal link
2. What is a vendor packet?
3. How to collect vendor documents in one place
4. How to build a vendor onboarding checklist
5. Vendor compliance checklist
6. How to track vendor onboarding status
7. How to handle incomplete vendor packets
8. How to collect W-9 and COI together
9. How to standardize vendor setup across locations

Additional colony guides (funnel links in guide CTA box):

- How to approve a new vendor
- How to reduce vendor onboarding time
- How to collect vendor questionnaires
- How to assign vendor onboarding owners
- How to set vendor document requirements by tier
- How to handle vendor name changes at onboarding

---

## Industry + solutions (tier 3)

| Path | Keyword |
|------|---------|
| `/industries/construction/build-vendor-onboarding-packets/` | construction vendor portal |
| `/industries/facilities-services/build-vendor-onboarding-packets/` | facilities vendor portal |
| `/solutions/vendor-setup-portal/` | vendor setup portal |
| `/solutions/vendor-document-collection/` | vendor document collection |
| `/solutions/vendor-packet-software/` | vendor packet software |
| `/solutions/vendor-document-portal/` | vendor document portal |
| `/solutions/vendor-information-management/` | vendor information management |
| `/solutions/supplier-onboarding-workflow/` | supplier onboarding workflow |
| `/solutions/vendor-onboarding-checklist/` | vendor onboarding checklist |
| `/solutions/third-party-vendor-compliance/` | third party vendor compliance |
| `/solutions/vendor-compliance-dashboard/` | vendor compliance dashboard |
| `/solutions/vendor-due-diligence-software/` | vendor due diligence software |

---

## Link-up rules (every colony page)

1. **Link up** — Each page links to 1–3 higher-tier targets via `linkUp` (internal links only, never redirects).
2. **Link sideways** — 2–3 sibling pages at the same tier via `linkSideways`.
3. **Glossary down** — Guides and solutions reference at least one glossary term.
4. **One keyword per URL** — No cannibalization across colony pages. Hub head keyword is `vendor portal`.
5. **Hub receives equity** — All tiers link to `/vendor-portal/`; hub links to product + solution + tool.

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
- [ ] Head hub `/vendor-portal/` impressions trending up
- [ ] No two colony URLs ranking for the same primary query (cannibalization)
- [ ] Hub page has clicks from colony guide internal links (behavior / scroll depth)
- [ ] Product page conversions from vendor guide CTAs
- [ ] New long-tail candidates from `npm run seo:longtail` assigned to glossary or guide — not hub

### Red flags

- Two guides targeting the same keyword → merge or differentiate intent
- Colony page with zero impressions after 90 days → strengthen `linkUp` or consolidate
- Head hub losing position while colonies rank → add more hub links from winning colonies

---

## Expansion queue (not in colony yet)

Phase 3 portal guides (e.g. vendor re-onboarding after merger, AP integration) should be added to `PORTAL_PAGES` with unique keywords before publishing. Assign each a `linkUp` path through this map.
