import Link from "next/link";
import {
  FileText,
  ShieldCheck,
  CalendarClock,
  ScanSearch,
  CheckSquare,
  FileSignature,
  ArrowRight,
} from "lucide-react";
import { Check } from "lucide-react";
import { Container, Eyebrow, Button, Card, Badge } from "@/components/ui";
import { Section, WorkflowSpine, TrustCallouts, CtaBand, RelatedGrid } from "@/components/sections";
import { HeroSearch } from "@/components/HeroSearch";
import { HomeProductPreview } from "@/components/HomeProductPreview";
import { SocialProof } from "@/components/SocialProof";
import { Testimonials } from "@/components/Testimonials";
import { Faq } from "@/components/Faq";
import { allProducts } from "@/lib/products";
import { tools } from "@/lib/tools";
import { site } from "@/lib/site";
import { JsonLd, websiteLd, organizationLd } from "@/lib/jsonld";

const intentTiles = [
  { label: "Collect W-9s", href: "/workflows/collect-w9s/", icon: FileText },
  { label: "Track insurance certificates", href: "/workflows/track-coi-expirations/", icon: ShieldCheck },
  { label: "Monitor contract renewals", href: "/workflows/monitor-contract-renewals/", icon: CalendarClock },
  { label: "Search exclusion lists", href: "/workflows/screen-vendors-against-exclusion-lists/", icon: ScanSearch },
  { label: "Route invoice approvals", href: "/workflows/route-invoice-approvals/", icon: CheckSquare },
  { label: "Send policy acknowledgments", href: "/workflows/send-policy-acknowledgments/", icon: FileSignature },
];

const stripTools = ["w9-request-generator", "acord-analyzer", "oig-search", "ofac-search", "sam-search", "contract-renewal-extractor"];

const clusters = ["Vendor Compliance", "Contract Operations", "HR Compliance", "Finance Operations", "Platform"] as const;

export default function HomePage() {
  const freeTools = stripTools.map((s) => tools.find((t) => t.slug === s)!).filter(Boolean);

  return (
    <>
      <JsonLd data={[websiteLd(), organizationLd()]} />

      {/* 1 — Hero banner */}
      <section className="relative overflow-hidden border-b border-border bg-bg">
        {/* Banner backdrop: locally-hosted, license-clean texture asset
            (/public/hero-texture.svg) — paper grain + faint ledger lines + dot grid +
            soft accent wash. Masked so it fades out before the content below. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "url('/hero-texture.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center top",
            WebkitMaskImage: "linear-gradient(180deg, #000 0%, rgba(0,0,0,0.55) 60%, transparent 100%)",
            maskImage: "linear-gradient(180deg, #000 0%, rgba(0,0,0,0.55) 60%, transparent 100%)",
          }}
        />
        <Container className="relative pb-14 pt-14 sm:pb-20 sm:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <Eyebrow className="mb-4">Operational Workflow Platform</Eyebrow>
            <h1 className="text-balance text-h1 sm:text-display">
              Stop chasing compliance documents through email and spreadsheets.
            </h1>
            <p className="mt-5 max-w-xl text-body-lg text-secondary">
              <span className="font-medium text-primary">{site.tagline}</span> Collect, approve, monitor, and audit the
              documents that keep your business running — from W-9s and certificates of insurance to contracts,
              invoices, and policy acknowledgments.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button href={`${site.appUrl}/sign-up`} size="lg">
                Start free
              </Button>
              <Button href="/tools/" variant="secondary" size="lg">
                Try a free tool
              </Button>
              <Link href="/workflows/" className="px-1 text-body-sm font-medium text-accent hover:underline">
                Explore workflows →
              </Link>
            </div>
            <ul className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-body-sm text-secondary">
              {["Free tools, no account", "Monitored workflows from $49 / module / mo", "No implementation project"].map((x) => (
                <li key={x} className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-success" aria-hidden />
                  {x}
                </li>
              ))}
            </ul>
            <div className="mt-8 max-w-xl">
              <HeroSearch />
            </div>
          </div>
            <div className="lg:pl-4">
              <HomeProductPreview />
            </div>
          </div>
        </Container>
      </section>

      {/* Social proof — 650+ companies + logo strip */}
      <SocialProof />

      {/* 2 — Intent tiles */}
      <Container className="pb-12 pt-16 sm:pb-16 sm:pt-20">
        <Eyebrow className="mb-5">Jump straight to a common job</Eyebrow>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {intentTiles.map((t) => {
            const Icon = t.icon;
            return (
              <Link
                key={t.href}
                href={t.href}
                className="group flex items-center justify-between gap-3 rounded-md border border-border bg-surface px-4 py-3.5 transition-colors hover:border-border-strong"
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-accent" aria-hidden />
                  <span className="text-body-sm font-medium text-primary">{t.label}</span>
                </span>
                <ArrowRight className="h-4 w-4 text-tertiary transition-transform group-hover:translate-x-0.5 group-hover:text-accent" aria-hidden />
              </Link>
            );
          })}
        </div>
      </Container>

      {/* 3 — Free tools strip */}
      <Section tone="sunken" className="border-t border-border">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <Eyebrow className="mb-3">Start in seconds, no account</Eyebrow>
            <h2 className="text-h2">Free tools that earn the next step</h2>
          </div>
          <Link href="/tools/" className="text-body-sm font-medium text-accent hover:underline">
            All free tools →
          </Link>
        </div>
        <div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-3">
          {freeTools.map((t) => (
            <div key={t.slug} className="min-w-[78%] shrink-0 snap-start sm:min-w-0 sm:shrink">
              <Card
                title={t.name}
                desc={t.outcome}
                footer={
                  <Button href={`/tools/${t.slug}/`} variant="secondary" size="md">
                    Open tool
                  </Button>
                }
              />
            </div>
          ))}
        </div>
      </Section>

      {/* 4 — Workflow map */}
      <Section tone="surface" className="border-t border-border">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <Eyebrow className="mb-3">One platform. Five jobs.</Eyebrow>
          <h2 className="text-h2">Every document, accounted for</h2>
          <p className="mt-4 text-body-lg text-secondary">
            Keelstar connects focused applications along one operational spine — so collecting a document and auditing
            it years later are the same continuous workflow.
          </p>
        </div>
        <WorkflowSpine />
      </Section>

      {/* 5 — Product clusters */}
      <Section tone="sunken" className="border-t border-border">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <Eyebrow className="mb-3">11 applications, one platform</Eyebrow>
            <h2 className="text-h2">Pick one module, or several. It&apos;s up to you.</h2>
            <p className="mt-4 text-body-lg text-secondary">
              Every application is priced on its own. Start with the single workflow you need today and add more only
              when you want them — you never pay for modules you don&apos;t use, and there&apos;s no all-or-nothing
              bundle.
            </p>
          </div>
          <Link href="/products/" className="text-body-sm font-medium text-accent hover:underline">
            All products →
          </Link>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-md border border-border bg-bg px-4 py-3">
          {["Choose any module", "From $49 / module / month", "Add or remove anytime"].map((x) => (
            <span key={x} className="flex items-center gap-1.5 text-body-sm font-medium text-primary">
              <Check className="h-4 w-4 text-success" aria-hidden />
              {x}
            </span>
          ))}
          <Link href="/pricing/" className="ml-auto text-body-sm font-medium text-accent hover:underline">
            See pricing →
          </Link>
        </div>
        <div className="mt-10 space-y-10">
          {clusters.map((cluster) => (
            <div key={cluster}>
              <div className="mb-4 flex items-center gap-3">
                <h3 className="text-h4 text-primary">{cluster}</h3>
                <span className="h-px flex-1 bg-border" />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {allProducts
                  .filter((p) => p.cluster === cluster)
                  .map((p) => (
                    <Card key={p.slug} href={`/products/${p.slug}/`} title={p.name} desc={p.job} eyebrow={p.node} />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Testimonials */}
      <Testimonials />

      {/* 6 — Trust */}
      <Section tone="sunken" className="border-t border-border">
        <div className="mb-10 max-w-2xl">
          <Eyebrow className="mb-3">Built to be standardized on</Eyebrow>
          <h2 className="text-h2">Monitoring and auditability, by default</h2>
          <p className="mt-4 text-body-lg text-secondary">
            The recurring value isn&apos;t the first collection — it&apos;s knowing, every day after, that the record is
            current and the evidence is ready.
          </p>
        </div>
        <TrustCallouts />
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
          <Badge tone="accent">Security documentation available on request</Badge>
          <Link href="/security/" className="text-body-sm font-medium text-accent hover:underline">
            Security overview →
          </Link>
          <Link href="/trust/" className="text-body-sm font-medium text-accent hover:underline">
            Trust &amp; reliability →
          </Link>
        </div>
      </Section>

      {/* 7 — Resources rail */}
      <Section tone="surface" className="border-t border-border">
        <div className="mb-10 max-w-xl">
          <Eyebrow className="mb-3">Learn the work, not just the tool</Eyebrow>
          <h2 className="text-h2">Resources for operators</h2>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <RelatedGrid
            title="Templates"
            links={[
              { label: "Vendor W-9 Request", href: "/templates/vendor-w9-request/" },
              { label: "COI Tracking Log", href: "/templates/coi-tracking-log/" },
              { label: "Contract Renewal Log", href: "/templates/contract-renewal-log/" },
              { label: "All templates", href: "/templates/" },
            ]}
          />
          <RelatedGrid
            title="Guides"
            links={[
              { label: "How to Collect W-9s", href: "/guides/how-to-collect-w9s-from-vendors/" },
              { label: "How to Track COI Expirations", href: "/guides/how-to-track-coi-expirations/" },
              { label: "How to Track Contract Renewals", href: "/guides/how-to-track-contract-renewals/" },
              { label: "All guides", href: "/guides/" },
            ]}
          />
          <RelatedGrid
            title="Glossary"
            links={[
              { label: "What is a W-9?", href: "/glossary/w-9/" },
              { label: "Certificate of Insurance", href: "/glossary/certificate-of-insurance/" },
              { label: "Auto-Renewal Clause", href: "/glossary/auto-renewal-clause/" },
              { label: "All terms", href: "/glossary/" },
            ]}
          />
          <RelatedGrid
            title="Comparisons"
            links={[
              { label: "Keelstar vs Spreadsheets (W-9)", href: "/compare/keelstar-vs-spreadsheets-for-w9-collection/" },
              { label: "Keelstar vs ERP Suites", href: "/compare/keelstar-vs-erp-suites/" },
              { label: "Keelstar vs DocuSign", href: "/compare/keelstar-vs-docusign/" },
              { label: "All comparisons", href: "/compare/" },
            ]}
          />
        </div>
      </Section>

      {/* 8 — FAQ (objection handling) */}
      <Section tone="sunken" className="border-t border-border">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          <div>
            <Eyebrow className="mb-3">Before you start</Eyebrow>
            <h2 className="text-h2">Questions teams ask first</h2>
          </div>
          <Faq
            items={[
              { q: "Do I have to buy every module?", a: "No. Keelstar is one platform made of focused applications, and each is priced on its own. Start with a single module — say W-9 Collector or COI Tracker — and add others only when you need them." },
              { q: "Is there an implementation project?", a: "No. Keelstar is self-serve and live the same day. There are no consultants, no setup fees, and no rollout project — you create an account and start your first workflow." },
              { q: "Can I use it without signing up?", a: "Yes. Every free tool works with no account. You only create an account when you want a workflow monitored — with reminders and an audit trail." },
              { q: "Can I export my data?", a: "Always. Every workflow supports exporting records and their full history. Your evidence is portable by design, so there's no lock-in." },
            ]}
          />
        </div>
      </Section>

      {/* 9 — Final CTA */}
      <CtaBand
        title="Replace the spreadsheet. Keep the audit trail."
        body="Start with one module today. Add the rest when you need them — and pay only for what you use."
        primary={{ label: "Start free", href: `${site.appUrl}/sign-up` }}
        secondary={{ label: "Try a free tool", href: "/tools/" }}
      />
    </>
  );
}
