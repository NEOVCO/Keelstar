# Compliance Colony Map

**Colony ID:** `compliance`  
**Head hub:** `/vendor-compliance/`  
**Head solution:** `/solutions/third-party-vendor-compliance/`  
**Head product:** `/products/vendor-packet/`  
**Head tool:** `/tools/vendor-onboarding-packet-generator/`

Source of truth: `src/lib/seo-colonies/`

---

## Tier ladder

| Tier | Count | Role | Keyword difficulty |
|------|------:|------|-------------------|
| Glossary | 7 | Definitions, zero-competition entry | Easy |
| Guide | 13 | How-to / what-is long-tail | Easy–hard |
| Industry | 2 | Vertical mid-funnel | Medium |
| Solution | 12 | Commercial workflow pages | Medium–hard |
| Hub | 1 | Pillar landing | Hard |
| Product | 1 | Conversion page | Hard |
| Tool | 1 | Free utility funnel | Medium |

**Total colony pages:** 37

---

## Head pages (one URL per head keyword)

| Page | Path | Primary keyword |
|------|------|-----------------|
| Hub | `/vendor-compliance/` | vendor compliance software |
| Solution | `/solutions/third-party-vendor-compliance/` | third party vendor compliance |
| Product | `/products/vendor-packet/` | vendor packet software |
| Tool | `/tools/vendor-onboarding-packet-generator/` | vendor onboarding packet generator |

Do not create additional URLs targeting these head terms.

---

## Glossary colony (tier 1)

| Slug | Keyword | Link up |
|------|---------|---------|
| `vendor-onboarding` | vendor onboarding | hub, head solution, checklist guide |
| `due-diligence` | vendor due diligence | hub, head solution, high-risk guide |
| `compliance-control` | compliance control | hub, head solution, compliance checklist |
| `audit-evidence` | audit evidence | hub, head solution, export evidence guide |
| `certificate-of-insurance` | certificate of insurance | hub, head solution, COI expirations guide |
| `w-9` | w-9 form | hub, head solution, collect W-9s guide |
| `oig-exclusion` | oig exclusion | hub, head solution, OIG screening guide |

---

## Guide colony (tier 2)

Hub-curated guides (`COMPLIANCE_HUB_COLONY_GUIDES` — shown on `/vendor-compliance/`):

1. Vendor compliance checklist
2. How to collect W-9s from vendors
3. How to track COI expirations
4. How to screen vendors against the OIG list
5. How to build a vendor onboarding checklist
6. How to export vendor onboarding evidence
7. How to audit vendor onboarding records
8. How to block payments for non-compliant vendors
9. How to onboard high-risk vendors

Additional colony guides (funnel links in guide CTA box):

- How to set vendor document requirements by tier
- How to handle incomplete vendor packets
- How to collect W-9 and COI together
- How to track vendor onboarding status

---

## Industry + solutions (tier 3)

| Path | Keyword |
|------|---------|
| `/industries/healthcare/screen-vendors-against-exclusion-lists/` | healthcare vendor compliance |
| `/industries/multi-site-retail/build-vendor-onboarding-packets/` | multi-site retail vendor compliance |
| `/solutions/third-party-vendor-compliance/` | third party vendor compliance |
| `/solutions/vendor-due-diligence-software/` | vendor due diligence software |
| `/solutions/vendor-compliance-dashboard/` | vendor compliance dashboard |
| `/solutions/vendor-packet-software/` | vendor packet software |
| `/solutions/w9-collection-software/` | w9 collection software |
| `/solutions/coi-tracking-software/` | coi tracking software |
| `/solutions/oig-exclusion-check/` | oig exclusion check |
| `/solutions/vendor-payment-hold-controls/` | vendor payment hold controls |
| `/solutions/vendor-risk-tiering-software/` | vendor risk tiering software |
| `/solutions/vendor-onboarding-checklist/` | vendor onboarding checklist |
| `/solutions/w9-validation-before-payment/` | w9 validation before payment |
| `/solutions/coi-expiration-alerts/` | coi expiration alerts |

---

## Link-up rules (every colony page)

1. **Link up** — Each page links to 1–3 higher-tier targets via `linkUp` (internal links only, never redirects).
2. **Link sideways** — 2–3 sibling pages at the same tier via `linkSideways`.
3. **Glossary down** — Guides and solutions reference at least one glossary term.
4. **One keyword per URL** — No cannibalization across colony pages. Hub head keyword is `vendor compliance software`.
5. **Hub receives equity** — All tiers link to `/vendor-compliance/`; hub links to product + solution + tool.

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
- [ ] Head hub `/vendor-compliance/` impressions trending up
- [ ] No two colony URLs ranking for the same primary query (cannibalization)
- [ ] Hub page has clicks from colony guide internal links (behavior / scroll depth)
- [ ] Product page conversions from compliance guide CTAs
- [ ] New long-tail candidates from `npm run seo:longtail` assigned to glossary or guide — not hub

### Red flags

- Two guides targeting the same keyword → merge or differentiate intent
- Colony page with zero impressions after 90 days → strengthen `linkUp` or consolidate
- Head hub losing position while colonies rank → add more hub links from winning colonies

---

## Expansion queue (not in colony yet)

Cross-colony guides already covered in W-9, COI, or OIG colonies should not duplicate head keywords here. New compliance-specific guides (e.g. vendor questionnaire compliance, payment hold policies) should be added to `COMPLIANCE_PAGES` with unique keywords before publishing.
