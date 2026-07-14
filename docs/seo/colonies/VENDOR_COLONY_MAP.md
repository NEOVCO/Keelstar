# Vendor Colony Map

**Colony ID:** `vendor`  
**Head hub:** `/vendor-onboarding/`  
**Head solution:** `/solutions/vendor-packet-software/`  
**Head product:** `/products/vendor-packet/`  
**Head tool:** `/tools/vendor-information-form-template/`

Source of truth: `src/lib/seo-colonies/`

---

## Tier ladder

| Tier | Count | Role | Keyword difficulty |
|------|------:|------|-------------------|
| Glossary | 8 | Definitions, zero-competition entry | Easy |
| Guide | 16 | How-to / what-is long-tail | Easy–hard |
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
| Hub | `/vendor-onboarding/` | vendor onboarding |
| Solution | `/solutions/vendor-packet-software/` | vendor packet software |
| Product | `/products/vendor-packet/` | vendor packet software |
| Tool | `/tools/vendor-information-form-template/` | vendor information form template |

Do not create additional URLs targeting these head terms.

---

## Glossary colony (tier 1)

| Slug | Keyword | Link up |
|------|---------|---------|
| `vendor-onboarding` | vendor onboarding | hub, head solution, checklist guide |
| `onboarding-packet` | onboarding packet | hub, head solution, vendor packet guide |
| `vendor-packet` | vendor packet | hub, head solution, what-is-a-vendor-packet guide |
| `vendor-tier` | vendor tier | hub, head solution, requirements-by-tier guide |
| `vendor-master-record` | vendor master record | hub, head solution, product |
| `vendor-offboarding` | vendor offboarding | head solution, hub, vendor master record |
| `due-diligence` | vendor due diligence | hub, head solution, high-risk guide |
| `beneficial-ownership` | beneficial ownership | head solution, hub, high-risk guide |

---

## Guide colony (tier 2)

Hub-curated guides (`VENDOR_HUB_COLONY_GUIDES` — shown on `/vendor-onboarding/`):

1. Vendor compliance checklist
2. How to build a vendor onboarding checklist
3. What is a vendor packet?
4. How to send a vendor portal link
5. How to collect vendor documents in one place
6. How to approve a new vendor
7. How to track vendor onboarding status
8. How to collect W-9 and COI together
9. How to export vendor onboarding evidence

Additional colony guides (funnel links in guide CTA box):

- How to set vendor document requirements by tier
- How to handle incomplete vendor packets
- How to onboard high-risk vendors
- How to block payments for non-compliant vendors
- How to reduce vendor onboarding time
- How to re-onboard vendors after merger
- How to integrate vendor onboarding with AP

---

## Industry + solutions (tier 3)

| Path | Keyword |
|------|---------|
| `/industries/construction/build-vendor-onboarding-packets/` | construction vendor onboarding |
| `/industries/staffing/build-vendor-onboarding-packets/` | staffing vendor onboarding |
| `/solutions/vendor-packet-software/` | vendor packet software |
| `/solutions/vendor-onboarding-checklist/` | vendor onboarding checklist |
| `/solutions/supplier-onboarding-workflow/` | supplier onboarding workflow |
| `/solutions/vendor-document-collection/` | vendor document collection |
| `/solutions/vendor-setup-portal/` | vendor setup portal |
| `/solutions/vendor-due-diligence-software/` | vendor due diligence software |
| `/solutions/third-party-vendor-compliance/` | third party vendor compliance |
| `/solutions/vendor-information-management/` | vendor information management |
| `/solutions/vendor-document-portal/` | vendor document portal |
| `/solutions/vendor-compliance-dashboard/` | vendor compliance dashboard |
| `/solutions/vendor-risk-tiering-software/` | vendor risk tiering software |
| `/solutions/vendor-payment-hold-controls/` | vendor payment hold controls |

---

## Link-up rules (every colony page)

1. **Link up** — Each page links to 1–3 higher-tier targets via `linkUp` (internal links only, never redirects).
2. **Link sideways** — 2–3 sibling pages at the same tier via `linkSideways`.
3. **Glossary down** — Guides and solutions reference at least one glossary term.
4. **One keyword per URL** — No cannibalization across colony pages. Hub head keyword is `vendor onboarding`; avoid repeating `vendor packet software` on multiple non-glossary pages.
5. **Hub receives equity** — All tiers link to `/vendor-onboarding/`; hub links to product + solution + tool.

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
- [ ] Head hub `/vendor-onboarding/` impressions trending up
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

Phase 3 vendor guides (e.g. vendor questionnaire collection, vendor name changes at onboarding) should be added to `VENDOR_PAGES` with unique keywords before publishing. Assign each a `linkUp` path through this map.
