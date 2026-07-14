# OIG Colony Map

**Colony ID:** `oig`  
**Head hub:** `/exclusion-monitoring/`  
**Head solution:** `/solutions/oig-exclusion-check/`  
**Head product:** `/products/exclusion-monitor/`  
**Head tool:** `/tools/oig-search/`

Source of truth: `src/lib/seo-colonies/`

---

## Tier ladder

| Tier | Count | Role | Keyword difficulty |
|------|------:|------|-------------------|
| Glossary | 6 | Definitions, zero-competition entry | Easy |
| Guide | 11 | How-to / what-is long-tail | Easy–hard |
| Industry | 1 | Vertical mid-funnel | Medium |
| Solution | 12 | Commercial workflow pages | Medium–hard |
| Hub | 1 | Pillar landing | Hard |
| Product | 1 | Conversion page | Hard |
| Tool | 1 | Free utility funnel | Medium |

**Total colony pages:** 33

---

## Head pages (one URL per head keyword)

| Page | Path | Primary keyword |
|------|------|-----------------|
| Hub | `/exclusion-monitoring/` | oig exclusion list |
| Solution | `/solutions/oig-exclusion-check/` | oig exclusion check |
| Product | `/products/exclusion-monitor/` | oig exclusion monitoring software |
| Tool | `/tools/oig-search/` | oig exclusion search |

Do not create additional URLs targeting these head terms.

---

## Glossary colony (tier 1)

| Slug | Keyword | Link up |
|------|---------|---------|
| `oig-exclusion` | oig exclusion | hub, head solution, `leie` |
| `leie` | leie list | hub, LEIE guide, head solution |
| `exclusion-screening` | exclusion screening | hub, head solution, product |
| `re-screening-cadence` | oig re-screening frequency | hub, frequency guide, head solution |
| `exclusion-match-review` | oig match review | head solution, hub, match guide |
| `false-positive-match` | oig false positive | head solution, match guide, hub |

---

## Guide colony (tier 2)

Hub-curated guides (`OIG_HUB_COLONY_GUIDES` — shown on `/exclusion-monitoring/`):

1. How to search the OIG LEIE database
2. What is the OIG LEIE list?
3. How to screen vendors against the OIG list
4. How often should healthcare providers screen OIG?
5. How to screen billing vendors for OIG exclusions
6. How to document exclusion screening
7. How to prepare for a CMS exclusion screening audit
8. OIG and OFAC: what healthcare providers must screen
9. How to schedule monthly OIG screening

All colony guides also include funnel links (hub → solution → product → tool) in the guide CTA box.

---

## Industry + solutions (tier 3)

| Path | Keyword |
|------|---------|
| `/industries/healthcare/screen-vendors-against-exclusion-lists/` | healthcare oig vendor screening |
| `/solutions/oig-exclusion-check/` | oig exclusion check |
| `/solutions/oig-leie-search/` | oig leie search |
| `/solutions/leie-screening-software/` | leie screening software |
| `/solutions/healthcare-oig-screening/` | healthcare oig screening |
| `/solutions/vendor-exclusion-screening/` | vendor exclusion screening |
| `/solutions/monthly-oig-screening/` | monthly oig screening software |
| `/solutions/oig-exclusion-audit-trail/` | oig exclusion audit trail |
| `/solutions/medicaid-vendor-screening/` | medicaid vendor screening |
| `/solutions/oig-monthly-screening-software/` | oig monthly screening software |
| `/solutions/oig-continuous-monitoring/` | oig continuous monitoring |
| `/solutions/oig-vendor-roster-screening/` | oig vendor roster screening |
| `/solutions/oig-false-positive-review/` | oig false positive review |

---

## Link-up rules (every colony page)

1. **Link up** — Each page links to 1–3 higher-tier targets via `linkUp` (internal links only, never redirects).
2. **Link sideways** — 2–3 sibling pages at the same tier via `linkSideways`.
3. **Glossary down** — Guides and solutions reference at least one glossary term.
4. **One keyword per URL** — No cannibalization across colony pages.
5. **Hub receives equity** — All tiers link to `/exclusion-monitoring/`; hub links to product + solution + tool.

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
- [ ] Head hub `/exclusion-monitoring/` impressions trending up
- [ ] No two colony URLs ranking for the same primary query (cannibalization)
- [ ] Hub page has clicks from colony guide internal links (behavior / scroll depth)
- [ ] Product page conversions from OIG guide CTAs
- [ ] New long-tail candidates from `npm run seo:longtail` assigned to glossary or guide — not hub

### Red flags

- Two guides targeting the same keyword → merge or differentiate intent
- Colony page with zero impressions after 90 days → strengthen `linkUp` or consolidate
- Head hub losing position while colonies rank → add more hub links from winning colonies

---

## Expansion queue (not in colony yet)

Phase 3 OIG guides (e.g. DME, pharmacy, locum screening) should be added to `OIG_PAGES` with unique keywords before publishing. Assign each a `linkUp` path through this map.
