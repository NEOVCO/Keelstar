# Keelstar — Website Build Brief

> Project setup file for the Keelstar public website build.
> This is the canonical brief. Build against it together with `DESIGN.md`.

You are building the full public website architecture for Keelstar from scratch. Behave like a senior product designer, information architect, SEO strategist, brand strategist, and frontend engineer. Make implementation decisions in line with the specifications below. Do not introduce alternate strategic directions. Do not use generic SaaS templates. Do not use hero gradients, stock office photography, decorative 3D shapes, AI-slop illustrations, or vague marketing buzzwords. The final result must feel handcrafted, premium, quiet, institutional, highly credible, and built to scale for a decade.

## Brand Positioning

Keelstar is an Operational Workflow Platform.

**Primary category statement:**
"Keelstar is the operational workflow platform for collecting, approving, monitoring, and auditing the business documents that keep companies running."

**Homepage headline:**
"Operational workflows, without the enterprise suite."

**Homepage subheadline:**
"Collect, approve, monitor, and audit the documents that keep your business running — from W-9s and certificates of insurance to contracts, invoices, and policy acknowledgements."

**Core brand principles:**
- Keelstar is not an ERP, all-in-one suite, or enterprise implementation project.
- Keelstar is one platform made of many focused applications.
- Every application solves one recurring business problem extremely well.
- Every application must be obvious, affordable, self-serve, fast to deploy, and usable without consultants.
- The brand promise is replacing spreadsheets, shared folders, Outlook reminders, and email chains with focused operational workflows.
- The recurring value proposition is monitoring and auditability, not one-time transactions.

## Copy Style

Use direct, plain, confident language.
Avoid "transform," "revolutionize," "unlock," "supercharge," "AI-powered" unless the page explains the exact AI action.
Write like Stripe, Linear, Notion, Anthropic, Cloudflare, and Mercury at their clearest.
Headlines should be short and declarative.
Product pages should clearly explain the job in under five seconds.

**Examples of approved copy style:**
- "Collect W-9s without email chains."
- "Track COI expirations before they become a problem."
- "Extract renewal dates from contracts and monitor them automatically."
- "Route invoice approvals and keep the audit trail."

## Information Architecture

Use this exact top-level public route structure on keelstar.com:

```
/
  /products/
  /workflows/
  /industries/
  /tools/
  /templates/
  /glossary/
  /compare/
  /guides/
  /docs/
  /help/
  /api/
  /pricing/
  /security/
  /trust/
  /about/
  /contact/
  /updates/
```

Separate operational subdomains:
- app.keelstar.com for authenticated application surfaces
- status.keelstar.com for system status

Do not place public SEO content on subdomains.
Do not use "Solutions" as a primary navigation label. Use "Workflows" instead.

## Primary Navigation

**Desktop nav:** Products · Workflows · Industries · Resources · Pricing · Search · Sign in · Start free

**Products mega menu groups:**

Vendor Compliance
- W-9 Collector
- COI Tracker
- Vendor Packet
- Exclusion Monitor

Contract Operations
- Contract Renewal Tracker
- Contract Risk Scanner
- Simple Signer

HR Compliance
- Policy Acknowledgement Tracker
- Training Record Tracker

Finance Operations
- Invoice Approval

Platform
- Shared platform
- Audit logs
- Notifications
- API

**Workflows mega menu groups:** Collect · Extract · Approve · Monitor · Audit

**Industries menu:** Healthcare · Construction · Staffing · Logistics · Manufacturing · Facilities Services · Property Management · Professional Services · Nonprofit · Multi-site Retail

**Resources mega menu:**

Get started
- Free tools
- Templates
- Quick guides

Learn
- Guides
- Glossary
- Comparisons
- Updates

Product help
- Documentation
- Help Center
- API
- Security
- Trust
- Status

**Mobile nav:**
- Accordion structure matching desktop groups
- Search field pinned near top
- Primary CTA pinned at bottom: Start free
- Secondary CTA: Try a free tool

## Homepage Behavior

Build the homepage as a discovery and routing surface, not a brochure.

**Section order:**
1. Hero
2. Intent search / workflow prompt
3. Free tools strip
4. Workflow map
5. Product cluster overview
6. Trust-building platform capabilities
7. Top templates / guides / glossary / comparisons
8. Final CTA
9. Footer

**Hero requirements:**
- Headline and subheadline above
- Search box with sample prompts: collect w-9s · track coi expirations · contract notice period · route invoice approvals
- CTA 1: Try a free tool
- CTA 2: Explore workflows
- Small supporting examples beneath hero
- No excessive motion
- No illustration-heavy gimmicks

**Intent tiles directly under hero:** Collect W-9s · Track insurance certificates · Monitor contract renewals · Search exclusion lists · Route invoice approvals · Send policy acknowledgements

**Free tools strip** — six tools with immediate action buttons:
- W-9 Request Generator
- ACORD Analyzer
- OIG Search
- OFAC Search
- SAM Search
- Contract Renewal Extractor

**Workflow map** — visual sequence: Collect → Extract → Approve → Monitor → Audit. This map must visually connect products across clusters while reinforcing the parent category "Operational Workflow Platform."

## Trust Building

Create a trust section emphasizing: Audit trails · Version history · Role-based permissions · Exports · Notifications · Shared platform architecture · Security and privacy · Fast self-serve setup.

Do not fabricate certifications. If no SOC 2 / ISO / HIPAA claims are provided, render placeholders such as:
- "Security documentation available on request"
- "Product security and data handling details"
- "Audit logging built into every workflow"

Provide real structural space for future compliance artifacts.

## Product Page Template

Reusable template for all product URLs. Required structure:
- Hero with one-sentence job-to-be-done
- Embedded lightweight utility launcher near top
- "What it does" section
- "How it works" 3-step section
- Monitoring / recurring value section
- Platform capabilities reused section
- Integrations / exports / audit section
- FAQ
- Documentation CTA
- Pricing CTA
- Related workflows
- Related tools
- Related glossary terms
- Related comparisons

Each product page must answer: what is the job · who is it for · what is immediate value · what becomes recurring monitored value · what evidence / audit output exists.

## Products

Create product pages for:
- /products/w9-collector/ — "Collect W-9s without email chains."
- /products/coi-tracker/ — "Track insurance certificates before they expire."
- /products/vendor-packet/ — "Collect every vendor document in one secure flow."
- /products/exclusion-monitor/ — "Monitor exclusion lists and keep the audit record."
- /products/contract-renewal-tracker/ — "Monitor contract renewals before notice periods pass."
- /products/contract-risk-scanner/ — "Review contract clauses and flag commercial risk."
- /products/simple-signer/ — "Send documents for signature without the enterprise suite."
- /products/policy-acknowledgement-tracker/ — "Send policies, collect acknowledgements, and keep version history."
- /products/training-record-tracker/ — "Track training and certification expirations."
- /products/invoice-approval/ — "Route invoice approvals and keep the audit trail."
- /products/platform/

## Workflow Pages

Reusable template under /workflows/, more problem-led than product-led. Required structure:
- Clear workflow headline
- What the workflow covers
- Why teams struggle today
- Recommended Keelstar stack for this workflow
- Suggested free tool
- Suggested template
- Step-by-step flow
- Audit considerations
- FAQ
- CTA to primary product

Initial workflow pages: collect-w9s · request-tax-documents-from-vendors · track-coi-expirations · review-acord-certificates · build-vendor-onboarding-packets · screen-vendors-against-exclusion-lists · screen-employees-against-exclusion-lists · monitor-contract-renewals · track-contract-notice-periods · review-contract-risk · send-documents-for-signature · send-policy-acknowledgements · track-policy-version-acceptance · track-training-records · monitor-certification-expirations · route-invoice-approvals · track-overdue-approvals · build-audit-trails · export-compliance-evidence · replace-spreadsheets-with-operational-workflows

## Industry Pages

Reusable template under /industries/ connecting pains, workflows, and products. Required sections:
- Industry-specific headline
- Common workflow pain points
- Relevant documents and records
- Recommended workflows
- Recommended products
- Related templates
- Related guides
- CTA to relevant free tools

Initial industry pages: healthcare · construction · staffing · logistics · manufacturing · facilities-services · property-management · professional-services · nonprofit · multi-site-retail

## Free Tools Strategy

Free tools are first-class acquisition surfaces. Create a /tools/ hub page and dedicated landing pages for the first twenty tools.

Rules:
- A visitor must be able to use the tool without login for the first run.
- If saved monitoring, historical tracking, exports, or subscriptions are needed, prompt for account creation after initial value.
- Do not index user-generated output pages by default.
- Use signed share URLs for outputs.
- Shared result pages must be private by default and opt-in for public sharing.
- Create editorial example result pages separately instead of indexing user exhaust.
- Use a "Monitor this continuously" CTA after successful tool completion.

Initial tool pages: w9-request-generator · w9-completion-checker · w9-vs-w8-guide-tool · acord-analyzer · coi-expiration-extractor · vendor-onboarding-packet-generator · oig-search · ofac-search · sam-search · exclusion-report-builder · contract-renewal-extractor · notice-period-calculator · termination-clause-scanner · contract-risk-clause-scanner · pdf-signer · policy-acknowledgement-link-maker · training-expiration-calculator · invoice-field-extractor · approval-matrix-builder · audit-trail-export-preview

For every tool page, include: clear one-sentence utility outcome · input area high on page · privacy note · example use cases · FAQ · link to corresponding product · link to corresponding workflow and glossary pages.

## Resource Center

Top nav label is "Resources," but use root-level public folders rather than nesting all content under /resources/. Include: /guides/ · /templates/ · /glossary/ · /compare/ · /updates/

## Guides Architecture

Use /guides/ for evergreen, educational, SEO-oriented pages. Do not treat /guides/ like a news blog. Use /updates/ for company news, release notes, and changelog-like editorial.

Create the first 100 guide pages exactly as listed in the roadmap. Build guide templates with: direct answer section near top · table / checklist / examples where relevant · relevant product CTA · related workflow/tool/template links · author and updated date · table of contents · sticky in-page navigation on desktop.

## Glossary

Create a /glossary/ hub page and the first 50 glossary pages from the roadmap list. Each glossary page must contain: direct definition at top · why it matters operationally · related records/workflows · examples or edge cases · related products, guides, and tools · related terms section.

## Comparison Pages

Create /compare/ pages from the roadmap list. Honest, useful, migration-oriented. Do not create spammy keyword-stuffed comparison pages. Structure: who each option is for · where Keelstar is stronger · where competitor/category is stronger · best fit scenarios · migration considerations · CTA to free tool or product.

## Template Library

Create /templates/ hub with filters by: vendor compliance · contract operations · HR compliance · finance operations · audits. Each template page must include: what the template is for · who should use it · preview section · download CTA · related workflow · related product · related glossary terms · related guide.

## Documentation

Use /docs/ as a complete public docs center. Do not place docs on a subdomain. Docs must be indexable, searchable, and tightly linked from product pages.

Docs IA: /docs/getting-started/ · /docs/account/ · /docs/organizations/ · /docs/permissions/ · /docs/billing/ · /docs/file-uploads/ · /docs/notifications/ · /docs/audit-logs/ · /docs/search/ · plus one docs section per product.

Docs UX: left sidebar · search bar at top · versionless for now · right rail table of contents · prev / next navigation · "edit this page" and "last updated" affordances · clean code blocks · callouts for tips, warnings, references.

## Help Center

Use /help/ for support-oriented, shorter, high-intent articles: account · billing · file formats · upload limits · notifications · troubleshooting · access · password reset · workspace invites · exports.

## API

Use /api/ for developer-facing documentation. Structure: overview · authentication · organizations · users · documents · parsed-fields · workflows · monitors · notifications · webhooks · rate limits · errors · changelog.

## Search Experience

Implement a universal site search modal available from: top nav · homepage hero · docs pages · mobile menu. Results unify: products · workflows · tools · guides · templates · glossary · docs · help · API. Use faceted grouping with badges for page type.

## SEO Architecture

Critical rules:
- All public content sections live on keelstar.com under subfolders.
- Descriptive slugs only; hyphen-separated lowercase slugs.
- No orphan pages; every important page reachable through main nav or contextual links.
- One canonical URL per page.
- No indexed filter pages, internal search result pages, user-generated tool results, or duplicate archives.
- Minimal parameter crawl exposure.

Public URL patterns: /products/{slug}/ · /workflows/{slug}/ · /industries/{slug}/ · /tools/{slug}/ · /templates/{slug}/ · /glossary/{slug}/ · /compare/{slug}/ · /guides/{slug}/ · /docs/{slug...}/ · /help/{slug}/ · /api/{slug...}/

Metadata rules: unique title and meta description for every page · align visible H1 with title intent · title formats ("W-9 Collector | Keelstar", "How to Collect W-9s | Keelstar", "What Is a W-9? | Keelstar Glossary", "Keelstar vs Spreadsheets for W-9 Collection") · dynamic OG image generation by page type · canonical tags on every indexable page · robots control on non-indexable pages · XML sitemap index with section shards · breadcrumbs visible in UI and marked up with JSON-LD.

Structured data (JSON-LD, not microdata):
- Sitewide: Organization, BreadcrumbList
- Homepage: WebSite, Organization
- Product pages: SoftwareApplication, BreadcrumbList
- Guide pages: Article or BlogPosting, author.url and updated date
- Docs / Help / API: breadcrumb markup, TechArticle where applicable

## Internal Linking Rules

- Product pages link to 3 workflows, 3 tools, 3 glossary terms, 2 templates, docs, and 2 comparison pages.
- Workflow pages link to primary product, adjacent products, 1 tool, 1 template, 2 guides, glossary terms.
- Tool pages link to product, workflow, glossary, template, and "monitor this continuously" CTA.
- Glossary pages link to one guide, one workflow, related tools, and related terms.
- Industry pages link to 3 workflows and 3 products.
- Guides link to primary workflow and primary product.

## Design System

See `DESIGN.md` for the full tokenized design system, typography, spacing, grid, component specs, art direction, and motion. Summary of intent: warm off-white background, deep restrained blue accent, Inter-based type, generous marketing whitespace, tighter docs density, 12-column grid, crisp minimal line icons, real product UI / document closeups / line diagrams (no stock office shots, no fake AI imagery). Motion is rare, fast, and purposeful.

## Technical Stack

- Next.js App Router · TypeScript · React Server Components where appropriate
- Tailwind CSS (or equivalent utility-first system) with tokens
- Component library extracted into a local reusable system
- Sanity for structured content · MDX for docs/guides/updates · Algolia for public-site search
- next/image · next/font · dynamic metadata through Next.js Metadata API

Project structure:
```
src/
  app/
    (marketing)/
    (docs)/
    (auth)/
    sitemap.ts
    robots.ts
    opengraph-image.tsx
  components/
  lib/
  content/
  styles/
  types/
```

Use route groups to separate marketing/docs/auth concerns without changing URL paths.

Next.js implementation details: generateMetadata for dynamic routes · sitemap generation · robots generation · OG image generation · MDX component mapping · route-level loading states only where useful · static generation + ISR for content pages · clean server/client boundaries.

## Performance Targets

LCP ≤ 2.5s · INP ≤ 200ms · CLS ≤ 0.1. Keep above-the-fold JS minimal · lazy-load non-critical interactive modules · avoid layout shift from images/embeds · preload key fonts · optimized image sizes · avoid heavy client libraries on marketing pages · avoid unnecessary third-party scripts · treat embeds carefully.

## Accessibility

Target WCAG 2.2 AA. Semantic HTML throughout · correct landmarks · keyboard access for all interactions · visible focus states · color contrast compliance · accessible modal behavior · skip links · ARIA only when native semantics are insufficient · accessible labels for all forms · screen-reader-friendly tables and accordions.

## AI / Agent / GEO Readiness

Do not implement fake "AI SEO hacks." Do not rely on llms.txt as a primary strategy. Create source-worthy pages. Requirements: clear answer-first structure on guides, glossary, workflow, and tool pages · direct definitions near the top · stable permanent URLs · visible updated dates · accessible DOM and ARIA for interactive surfaces · semantic buttons/links · no hidden primary content behind interaction · no public user-result pages indexed by default · analytics hooks for AI-originating referrals · Bing Webmaster verification and measurement support · plan for ChatGPT referral attribution.

## Analytics & Event Tracking

Implement GA4 + PostHog hooks. Track: nav_click · search_open · search_submit · search_result_click · tool_start · tool_complete · tool_share · tool_monitor_cta_click · pricing_view · plan_select · sign_up_start · sign_up_complete · doc_download · comparison_cta_click · workflow_cta_click · demo_request · contact_submit.

## Account Flows

Public auth routes: sign in · sign up · invite accept · forgot password · verify email. Copy for auth pages should remain product-grade and quiet. Do not make auth pages feel like a separate generic auth provider surface.

## Trust / Security Pages

Build /security/ and /trust/.

Security page sections: encryption and storage overview · access controls · audit logging · application security · privacy/data handling · incident reporting · contact security team · future compliance artifacts placeholder.

Trust page sections: platform principles · uptime / status link · product reliability · exportability · change history / updates · customer trust FAQ.

## Footer

Footer groups: Products · Workflows · Industries · Resources · Developers · Company · Legal. Include status, security, privacy, terms, and contact.

## Content Seeding

Seed the site with: all product pages · all workflow pages · all industry pages · first 20 tools · first 20 templates · first 50 glossary pages · first 50 comparison pages · first 100 guides · docs/getting-started and initial product docs stubs · help center initial core articles · API overview and section skeletons.

Fully write launch-ready copy for: homepage · /products/w9-collector/ · /products/coi-tracker/ · /products/contract-renewal-tracker/ · /products/platform/ · /pricing/ · /security/ · /trust/ · /tools/w9-request-generator/ · /tools/acord-analyzer/ · /tools/oig-search/ · /tools/contract-renewal-extractor/ · top 10 guides · top 10 glossary pages · top 10 comparison pages · top 5 templates · top 5 workflows · top 3 industries.

For the rest, generate complete structured page scaffolds with polished copy placeholders consistent with the voice and architecture.

## Output Expectation

Produce: full Next.js project structure · reusable components · page templates · design tokens · content schema definitions · seeded route map · SEO metadata helpers · JSON-LD helpers · navigation and mega menu implementation · homepage and priority page copy · docs shell · search UI shell · trust/security pages · responsive polished UI.

The final product must look like it came from a top digital product agency working for a serious, premium software company. It must feel timeless, technically credible, conversion-focused, and ready to scale from 10 products to 50+ products and from hundreds to millions of indexed URLs.
