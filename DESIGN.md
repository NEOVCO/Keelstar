# Keelstar — Design Specification

> Generated from `PROMPT.md`. This is the visual and structural north star for the build.
> The website should look handcrafted, quiet, institutional, and premium — closer to a
> bank's engineering documentation than a startup landing page. Every decision below
> exists to serve two goals: **clarity** (the visitor understands the job in five seconds)
> and **credibility** (the visitor trusts this with their compliance records for a decade).

---

## 1. Design Principles

These five principles resolve every ambiguous decision during the build.

1. **Quiet over loud.** Restraint is the brand. No gradients on heroes, no neon, no motion for its own sake. Confidence is communicated through generous space, precise alignment, and typographic discipline — not visual volume.
2. **Routing over selling.** The homepage and hubs are wayfinding surfaces. Their job is to get a visitor to the one page that solves their problem, fast. Reduce decoration that competes with navigation.
3. **Evidence over adjectives.** Show real product UI, real document closeups, real field-extraction states, real audit logs. Never illustrate a benefit you can demonstrate.
4. **One job per surface.** Each section answers exactly one question. If a section is doing two jobs, split it.
5. **Built to scale.** Every component is a template instance. Nothing is bespoke that will be repeated 50× across products, 100× across guides, or 1,000,000× across indexed URLs.

---

## 2. Brand Expression

**Personality:** an institutional operator. Calm, exact, dependable, lightly technical. The voice of someone who has handled ten thousand vendor packets and never lost one.

**What it is not:** playful, hype-driven, "disruptive," consumer-trendy, or enterprise-bloated.

**Visual signature** (the recurring motifs that make Keelstar recognizable):
- The **keel line** — a single thin horizontal rule (1px, warm border color) used as a structural divider and as a quiet brand mark. Sections are separated by space and the occasional keel line, never by boxes-within-boxes.
- The **workflow spine** — the `Collect → Extract → Approve → Monitor → Audit` sequence rendered as connected nodes. This is the one signature graphic device, reused on the homepage, product pages, and workflow pages.
- **Status as color** — color is rationed. The interface is near-monochrome graphite-on-warm-white; the restrained blue marks primary action; the muted teal/green marks healthy status. Color carries meaning, never mood.

---

## 3. Color Tokens

Warm, low-saturation, enterprise-grade. Defined as CSS custom properties; Tailwind maps to these. All foreground/background pairs listed meet WCAG 2.2 AA.

### 3.1 Core neutrals

| Token | Hex | Usage |
|---|---|---|
| `--color-bg` | `#FBFAF8` | Page background — warm off-white, the canvas |
| `--color-surface` | `#FFFFFF` | Cards, menus, modals, raised surfaces |
| `--color-surface-sunken` | `#F5F3EF` | Inset areas, code blocks, table zebra, input wells |
| `--color-text-primary` | `#1A1C1E` | Headings and primary body — deep graphite, not pure black |
| `--color-text-secondary` | `#5B6068` | Supporting copy, captions, muted slate |
| `--color-text-tertiary` | `#8A8F97` | Metadata, placeholders, disabled labels |
| `--color-border` | `#E8E4DC` | Default hairline border — light gray with warmth |
| `--color-border-strong` | `#D6D1C7` | Emphasized dividers, input borders on focus-within |

### 3.2 Accent

| Token | Hex | Usage |
|---|---|---|
| `--color-accent` | `#1F3A5F` | Deep restrained blue — primary buttons, links, focus rings, active nav |
| `--color-accent-hover` | `#16304F` | Primary hover/pressed |
| `--color-accent-subtle` | `#EEF2F7` | Accent-tinted backgrounds (selected rows, hero search well, active tab) |
| `--color-accent-text` | `#1F3A5F` | Link text on light backgrounds |

### 3.3 Status (muted, never neon)

| Token | Hex | Usage |
|---|---|---|
| `--color-success` | `#2F6B4F` | Healthy / current / collected — subdued teal-green |
| `--color-success-subtle` | `#EAF2ED` | Success backgrounds, "on track" pills |
| `--color-warning` | `#8A6A1E` | Expiring soon / pending — muted amber, no yellow glare |
| `--color-warning-subtle` | `#F6F0E2` | Warning backgrounds |
| `--color-error` | `#8E3B36` | Expired / rejected / failed — muted brick, not fire-engine red |
| `--color-error-subtle` | `#F6EAE9` | Error backgrounds |
| `--color-info` | `#1F3A5F` | Informational callouts (shares accent) |

### 3.4 Dark surfaces (used sparingly)

A near-black graphite is permitted for the footer and for "system schematic" figure backgrounds only. Never a dark hero.

| Token | Hex | Usage |
|---|---|---|
| `--color-ink` | `#15171A` | Footer background, schematic figure canvas |
| `--color-ink-text` | `#D9D5CD` | Text on ink surfaces |
| `--color-ink-border` | `#2A2D31` | Dividers on ink surfaces |

**Rules:** No multi-stop gradients on heroes or large fills. A single near-invisible warm wash (`--color-bg` → `--color-surface-sunken` at ≤4% delta) is the only permitted gradient, and only as a section transition. Status colors only appear on status-bearing UI (pills, dots, log rows), never as decoration.

---

## 4. Typography

A clean premium sans, optimized for both product UI and long-form docs. No display/novelty faces.

**Families**
- **Sans (UI + marketing + body):** `Inter` via `next/font`, with `font-feature-settings: "cv05","ss01","tnum"` enabled (tabular numbers matter for expiration dates and tables). Fallback: `system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`.
- **Mono (code, IDs, API, parsed-field values):** `JetBrains Mono` or `IBM Plex Mono`. Fallback: `ui-monospace, "SF Mono", Menlo, Consolas, monospace`.

**Type scale** (rem at 16px base; tracking tightens as size grows).

| Token | Size / line-height | Tracking | Weight | Usage |
|---|---|---|---|---|
| `display` | 3.25rem / 1.05 | -0.02em | 600 | Reserved; rarely used. Max one per page. |
| `h1` | 2.5rem / 1.1 | -0.018em | 600 | Page H1 / hero headline |
| `h2` | 1.875rem / 1.15 | -0.014em | 600 | Section headings |
| `h3` | 1.375rem / 1.25 | -0.01em | 600 | Subsection / card titles |
| `h4` | 1.125rem / 1.35 | -0.006em | 600 | Small headings, FAQ questions |
| `body-lg` | 1.125rem / 1.6 | 0 | 400 | Hero subhead, intro paragraphs |
| `body` | 1rem / 1.65 | 0 | 400 | Default prose |
| `body-sm` | 0.9375rem / 1.6 | 0 | 400 | Dense UI, docs sidebars |
| `caption` | 0.8125rem / 1.5 | 0.005em | 500 | Metadata, labels, badges |
| `overline` | 0.75rem / 1.4 | 0.08em | 600 | UPPERCASE eyebrows above headings |
| `mono` | 0.875rem / 1.6 | 0 | 400 | Code, IDs, parsed fields |

**Typographic rules**
- **Avoid the oversized-hero cliché.** The homepage H1 is `h1` (2.5rem), not a 5rem banner. Premium reads as composed, not shouty.
- **Eyebrows** (`overline`, uppercase, tracked, in `--color-text-secondary` or `--color-accent`) introduce sections so headings can stay short.
- **Measure:** prose columns cap at **68ch**; guides/docs reading column **~72ch**. Never full-width body text.
- **Weights used:** 400 (body), 500 (captions/labels), 600 (headings/buttons). No 700+ except optional 700 on the wordmark.
- Numerals are tabular everywhere a date, count, or money value appears.

---

## 5. Spacing & Layout

**Base scale: 4px.** Use the ramp: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 120, 160`.

**Section rhythm**
- Marketing sections: **96–160px** vertical padding (top and bottom), generous and quiet. Hero gets the most air.
- Docs / data / UI sections: **24–48px** — tighter, denser, utilitarian.
- Intra-section gaps: heading→content `24–32px`; card grids `gap 24px`.

**Grid**
- **12-column** desktop grid, max content width **1200px** (`--container`), gutter **24px**, page margin **clamp(20px, 5vw, 64px)**.
- Prose/guide/docs reading column constrained to **~720px** centered, even inside the 12-col frame.
- Product feature sections snap to consistent column spans (e.g. 7/5 split for text+figure) reused across all product pages so the site feels engineered, not assembled.
- Breakpoints: `sm 640 · md 768 · lg 1024 · xl 1280`. Mega menus and the workflow spine collapse below `lg`.

**Radii & elevation** (restraint = small radii, almost no shadow)
- `--radius-sm 6px` (inputs, pills) · `--radius-md 10px` (cards, menus) · `--radius-lg 14px` (modals, figure frames). No pill-shaped 9999px buttons.
- Shadows are barely-there: `--shadow-sm 0 1px 2px rgba(20,23,26,.05)`, `--shadow-md 0 6px 24px -8px rgba(20,23,26,.12)` (menus/modals only). Prefer **borders over shadows** to separate surfaces.

---

## 6. Iconography & Imagery

**Icons:** one crisp, minimal **line** set (Lucide or Phosphor "regular"). 1.5px stroke, 20/24px grid, `currentColor`. No filled cartoon icons, no duotone, no emoji.

**Imagery direction** (in priority order):
1. **Real product UI** — clean screenshots/renders of Keelstar surfaces: a COI tracker table with status pills, an audit log timeline, a parsed-field panel highlighting an extracted renewal date.
2. **Document closeups** — a W-9 corner, an ACORD certificate field, a contract clause — cropped tight, desaturated slightly, on `--color-surface-sunken`.
3. **Line diagrams & system schematics** — the workflow spine, data-flow diagrams, permission models. Drawn with the icon stroke language, mono labels, on light or `--color-ink` canvas.
4. **Subtle abstract geometry** — only when purposeful (e.g. a faint dot-grid behind a schematic). Never as filler.

**Banned:** hero gradients · stock office photography · smiling-team-at-laptop shots · decorative 3D blobs/isometric props · AI-generated illustrations · glassmorphism · vague "abstract tech" swooshes.

**Figure framing:** product UI and document closeups sit in a `--radius-lg` frame with a 1px `--color-border`, optional thin top "browser bar" only when it adds clarity. Consistent inner padding so all figures align.

---

## 7. Components

All components are calm, sharp, restrained. Spec highlights below; build them into a local reusable system.

### Buttons
- **Primary:** solid `--color-accent`, white text, `--radius-sm`, weight 600, height 40px (lg 44px). Hover → `--color-accent-hover`. Focus → 2px accent ring offset 2px.
- **Secondary:** `--color-surface` fill, 1px `--color-border-strong`, `--color-text-primary` label. Hover → `--color-surface-sunken`.
- **Tertiary / link:** text + accent, underline on hover, optional trailing arrow `→`.
- **Icon-only:** 36/40px square, 1px border or ghost; always has `aria-label`.
- **Subtle destructive:** `--color-error` text on transparent; solid error fill only for irreversible confirmations.
- No gradients, no glow, no uppercase button labels.

### Header / Nav
- Sticky, 64px, `--color-surface` with 1px bottom `--color-border`; subtle blur backdrop on scroll. Wordmark left; Products · Workflows · Industries · Resources · Pricing center-left; Search (icon + ⌘K hint), Sign in (tertiary), Start free (primary) right.
- Active route marked by accent text + 2px underline. Keyboard-navigable; full ARIA.

### Mega menu
- Full-width panel under nav, `--color-surface`, `--shadow-md`, opens on hover **and** focus, closes on Esc/blur. Multi-column groups with `overline` group labels. Each item: title + one-line descriptor in `--color-text-secondary`. A trailing column may feature one promoted item (e.g. "New: Exclusion Monitor") or a quiet CTA. Fast fade/translate (120ms).

### Search modal (universal, ⌘K)
- Centered modal, `--radius-lg`, `--shadow-md`, max-width 640px, focus-trapped, Esc to close, scrim `rgba(20,23,26,.4)`.
- Input at top; results grouped with **type badges**: Product · Workflow · Tool · Guide · Template · Glossary · Docs · Help · API. Arrow-key navigation, Enter to go. Empty state shows sample prompts (`collect w-9s`, `track coi expirations`, `contract notice period`, `route invoice approvals`).

### Breadcrumbs
- `body-sm`, `--color-text-secondary`, `/` or `›` separators, current page non-link. Visible in UI **and** emitted as `BreadcrumbList` JSON-LD.

### Page heroes
- Left-aligned (marketing) or constrained (docs). `overline` eyebrow → `h1` headline → `body-lg` subhead → CTAs/utility → optional supporting examples. No background image; quiet warm canvas only.

### Cards (feature / product / workflow / tool)
- `--color-surface`, 1px `--color-border`, `--radius-md`, padding 24px. Line icon or tiny status motif top-left, `h3` title, one-line descriptor, optional trailing link/arrow. Hover lifts border to `--color-border-strong` + `--shadow-sm` (no scale transform). **Product cards** carry a cluster tag (Vendor Compliance / Contract Ops / HR / Finance). **Tool cards** carry an immediate action button. **Workflow cards** show a mini spine fragment.

### Workflow spine (signature graphic)
- Five nodes — Collect · Extract · Approve · Monitor · Audit — connected by a 1px keel line with small node dots. Each node: line icon + label + one-line role. Responsive: horizontal on `lg`, vertical stepper below. Nodes link to the matching `/workflows/` cluster. On product pages, the relevant node is highlighted in accent; the rest are graphite.

### Comparison tables
- Sticky header row, zebra via `--color-surface-sunken`, tabular numerals, `--color-success`/`--color-error` check/dash glyphs (never bare ✓/✗ emoji). Honest tone: competitor strengths shown plainly. Horizontal scroll with shadow affordance on mobile.

### FAQ accordion
- `--color-border` divided rows, `h4` question + chevron, single-expand optional. Full keyboard + ARIA (`aria-expanded`, `aria-controls`). Content stays in the DOM (answer-first / GEO requirement) — visually collapsed, not removed.

### Trust callouts
- Compact tiles: line icon + short label + one sentence (Audit trails · Version history · Role-based permissions · Exports · Notifications · Shared platform · Security · Self-serve setup). Plus a "compliance artifacts" placeholder row reading "Security documentation available on request" with real structural space for future SOC 2 / ISO / HIPAA badges.

### Alerts / callouts (docs)
- Tip (success-subtle) · Warning (warning-subtle) · Reference/Note (accent-subtle). Left 3px rule in the status color, line icon, `body-sm`. Muted, never neon.

### Form fields
- 40px height, `--radius-sm`, 1px `--color-border-strong`, `--color-surface` fill; focus → accent ring + border. Label above (`caption`, weight 500), help text below in `--color-text-tertiary`, error text in `--color-error`. Every field labeled; no placeholder-as-label.

### Utility input/output cards (free tools)
- Input well high on page: large drop/paste zone or field, primary action button, privacy note beneath ("Runs in your browser for the first pass. Nothing saved until you choose to."). Output state renders results in a clean card with a `--color-accent` **"Monitor this continuously →"** CTA and a secondary share (signed URL, private by default).

### Stat blocks, quote/testimonial, tabs, pagination, empty states, template previews
- **Stat block:** big tabular numeral (`h2`/`h1`), `caption` label, optional keel underline. Sparse — only with real figures.
- **Quote:** restrained, no giant quotation marks; attribution with role + company in `caption`. Use only real quotes; otherwise omit.
- **Tabs:** underline-style active indicator in accent, not pill toggles.
- **Pagination:** numbered + prev/next, `--color-text-secondary`, accent on current.
- **Empty states:** one line icon + one sentence + one action. Calm, never cute.
- **Template preview:** framed document thumbnail on `--color-surface-sunken`, download CTA, related links row.

### Docs sidebar & right-rail ToC
- Left sidebar: grouped nav, current item accent + left rule, collapsible sections, search at top. Right rail: in-page ToC, active heading highlighted on scroll (IntersectionObserver), sticky. Prev/next footer, "Last updated" + "Edit this page" affordances.

### CTA bands
- Full-width `--color-surface-sunken` or `--color-ink` band, single short headline + primary + secondary CTA. No gradient. Used as section 8 of the homepage and footer of product/workflow pages.

---

## 8. Homepage Composition (section by section)

The homepage is a **discovery and routing surface**. Quiet, scannable, fast. Target above-the-fold: headline, subhead, search, two CTAs, and the first row of intent tiles — all without scrolling on a laptop.

**1 — Hero**
`overline`: "Operational Workflow Platform". `h1`: *Operational workflows, without the enterprise suite.* `body-lg` subhead (the approved subheadline). A prominent **search well** (`--color-accent-subtle` background, `--radius-md`, mono-hinted placeholder) with rotating sample prompts: `collect w-9s` · `track coi expirations` · `contract notice period` · `route invoice approvals`. CTAs: **Try a free tool** (primary) · **Explore workflows** (secondary). Beneath: three quiet supporting examples in `body-sm` ("Collect W-9s without email chains." etc.). No background image, no motion beyond a 200ms entrance fade. Plenty of air — this section breathes at 120–160px padding.

**2 — Intent tiles**
A 6-tile grid (3×2 on `lg`, 2-col on `md`, stacked on `sm`) directly under the hero: Collect W-9s · Track insurance certificates · Monitor contract renewals · Search exclusion lists · Route invoice approvals · Send policy acknowledgements. Each tile: line icon + label + arrow, links to the matching workflow/product. These are routing, not features.

**3 — Free tools strip**
`overline` "Start in seconds, no account." Six tool cards each with an **immediate action button**: W-9 Request Generator · ACORD Analyzer · OIG Search · OFAC Search · SAM Search · Contract Renewal Extractor. Horizontal scroll-snap on mobile. Reinforces the acquisition strategy: value before signup.

**4 — Workflow map (the spine)**
The signature `Collect → Extract → Approve → Monitor → Audit` graphic, full bleed within container, on a faint dot-grid. Each node names the products that live there, visually connecting clusters and reinforcing the parent category. This is the conceptual heart of the page — give it room and a short framing line: "One platform. Five jobs. Every document accounted for."

**5 — Product cluster overview**
Four labeled clusters (Vendor Compliance · Contract Operations · HR Compliance · Finance Operations) as grouped card sets, each product a card with its one-line job-to-be-done. A quiet "11 applications, one platform" stat. This is a directory, not a pitch.

**6 — Trust / platform capabilities**
Trust callout tiles (Section 7) on a `--color-surface-sunken` band: audit trails, version history, role-based permissions, exports, notifications, shared platform, security, self-serve setup — plus the compliance-artifact placeholder. Communicates "safe to standardize on" without fabricating certifications.

**7 — Resources rail**
A four-up row surfacing top **Templates · Guides · Glossary · Comparisons**, each with 3–4 real links. Feeds SEO internal linking and gives researchers an immediate path deeper.

**8 — Final CTA band**
`--color-ink` band: short headline ("Replace the spreadsheet. Keep the audit trail."), **Start free** primary + **Try a free tool** secondary. No gradient.

**9 — Footer**
On `--color-ink`. Groups: Products · Workflows · Industries · Resources · Developers · Company · Legal. Includes status, security, privacy, terms, contact. Wordmark + short category line + the keel-line motif. Tabular, dense, comprehensive — a sitemap in disguise (no orphan pages).

---

## 9. Motion

Rare, fast, purposeful. Respect `prefers-reduced-motion` (disable all non-essential motion).
- Nav / mega menu open: 120ms fade + 4px translate.
- Search modal: 150ms scale-from-98% + fade.
- Hover: 100ms color/border only — **no scale or bounce**.
- Scroll reveal: at most one subtle 200ms fade/translate per section, triggered once. **No parallax, no pinned scroll, no scroll-driven animation sequences.**
- Durations `120–200ms`; easing `cubic-bezier(.2,.8,.2,1)`.

---

## 10. Accessibility (WCAG 2.2 AA)

- Semantic HTML and correct landmarks (`header`/`nav`/`main`/`footer`); one `h1` per page; logical heading order.
- All interactive elements keyboard-operable; visible 2px accent focus rings (never `outline:none` without replacement); skip-to-content link.
- Contrast: every text/background pair ≥ 4.5:1 (≥ 3:1 large) — the muted status palette was chosen to pass.
- Modals focus-trapped with restore-on-close; accordions/tabs use native semantics + minimal ARIA; tables have proper `th`/`scope`/captions.
- Forms: programmatic labels, described errors, no color-only signaling (status pills pair color with text/icon).
- Answer-first content stays in the DOM even when visually collapsed (also satisfies GEO/AI readiness).

---

## 11. Tokens — implementation reference

```css
:root {
  /* color */
  --color-bg:#FBFAF8; --color-surface:#FFFFFF; --color-surface-sunken:#F5F3EF;
  --color-text-primary:#1A1C1E; --color-text-secondary:#5B6068; --color-text-tertiary:#8A8F97;
  --color-border:#E8E4DC; --color-border-strong:#D6D1C7;
  --color-accent:#1F3A5F; --color-accent-hover:#16304F; --color-accent-subtle:#EEF2F7;
  --color-success:#2F6B4F; --color-success-subtle:#EAF2ED;
  --color-warning:#8A6A1E; --color-warning-subtle:#F6F0E2;
  --color-error:#8E3B36; --color-error-subtle:#F6EAE9;
  --color-ink:#15171A; --color-ink-text:#D9D5CD; --color-ink-border:#2A2D31;
  /* radius */
  --radius-sm:6px; --radius-md:10px; --radius-lg:14px;
  /* shadow */
  --shadow-sm:0 1px 2px rgba(20,23,26,.05);
  --shadow-md:0 6px 24px -8px rgba(20,23,26,.12);
  /* layout */
  --container:1200px; --reading:720px;
  /* type */
  --font-sans:"Inter",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  --font-mono:"JetBrains Mono",ui-monospace,"SF Mono",Menlo,monospace;
  /* motion */
  --ease:cubic-bezier(.2,.8,.2,1); --dur-fast:120ms; --dur:160ms; --dur-slow:200ms;
}
```

Spacing ramp (4px base) → Tailwind scale extension: `1=4 2=8 3=12 4=16 5=20 6=24 8=32 10=40 12=48 16=64 20=80 24=96 30=120 40=160`.

---

## 12. Page-type design checklist (reuse across the build)

Every templated page type inherits the system above plus its own composition contract:

- **Product page:** hero (one-sentence job) → embedded utility launcher → "What it does" → 3-step "How it works" → monitoring/recurring-value → reused platform-capabilities band → integrations/exports/audit → FAQ → docs + pricing CTA → related workflows/tools/glossary/templates/comparisons. The workflow spine appears with this product's node highlighted.
- **Workflow page:** problem-led hero → what it covers → why teams struggle → recommended Keelstar stack → suggested tool + template → step-by-step (spine fragment) → audit considerations → FAQ → CTA to primary product.
- **Industry page:** industry headline → pain points → relevant documents/records → recommended workflows → recommended products → related templates/guides → free-tool CTA.
- **Tool page:** one-sentence outcome → input well high on page → privacy note → example uses → FAQ → "Monitor this continuously" CTA → links to product/workflow/glossary.
- **Guide page:** answer-first block near top → ToC + sticky in-page nav → tables/checklists/examples → author + updated date → product CTA → related links. ≤720px reading column.
- **Glossary page:** direct definition first → why it matters operationally → related records/workflows → examples/edge cases → related products/guides/tools → related terms.
- **Compare page:** who each is for → where Keelstar is stronger → where the alternative is stronger → best-fit scenarios → migration notes → CTA. Honest, never keyword-stuffed.
- **Docs page:** left sidebar + right ToC + prev/next + last-updated/edit affordances; tighter density; clean code blocks and callouts.

---

*End of design specification. Build pages against this together with `PROMPT.md`. Do not start the loop until instructed.*
