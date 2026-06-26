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
import { Container, Eyebrow, Button, Card, Badge } from "@/components/ui";
import { Section, WorkflowSpine, TrustCallouts, CtaBand, RelatedGrid } from "@/components/sections";
import { HeroSearch } from "@/components/HeroSearch";
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

const clusters = ["Vendor Compliance", "Contract Operations", "HR Compliance", "Finance Operations"] as const;

export default function HomePage() {
  const freeTools = stripTools.map((s) => tools.find((t) => t.slug === s)!).filter(Boolean);

  return (
    <>
      <JsonLd data={[websiteLd(), organizationLd()]} />

      {/* 1 — Hero */}
      <Container className="pb-12 pt-16 sm:pb-16 sm:pt-24">
        <div className="max-w-3xl">
          <Eyebrow className="mb-4">Operational Workflow Platform</Eyebrow>
          <h1 className="text-balance text-h1 sm:text-display">{site.tagline}</h1>
          <p className="mt-5 max-w-2xl text-body-lg text-secondary">
            Collect, approve, monitor, and audit the documents that keep your business running — from W-9s and
            certificates of insurance to contracts, invoices, and policy acknowledgments.
          </p>
          <div className="mt-8">
            <HeroSearch />
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button href="/tools/" size="lg">
              Try a free tool
            </Button>
            <Button href="/workflows/" variant="secondary" size="lg">
              Explore workflows
            </Button>
          </div>
          <p className="mt-6 text-body-sm text-secondary">
            Collect W-9s without email chains. Track COI expirations before they become a problem. Route invoice
            approvals and keep the audit trail.
          </p>
        </div>
      </Container>

      {/* 2 — Intent tiles */}
      <Container className="pb-8">
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
      <Section tone="sunken">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <Eyebrow className="mb-3">Start in seconds, no account</Eyebrow>
            <h2 className="text-h2">Free tools that earn the next step</h2>
          </div>
          <Link href="/tools/" className="text-body-sm font-medium text-accent hover:underline">
            All free tools →
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {freeTools.map((t) => (
            <Card
              key={t.slug}
              title={t.name}
              desc={t.outcome}
              footer={
                <Button href={`/tools/${t.slug}/`} variant="secondary" size="md">
                  Open tool
                </Button>
              }
            />
          ))}
        </div>
      </Section>

      {/* 4 — Workflow map */}
      <Section>
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
      <Section tone="surface">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <Eyebrow className="mb-3">11 applications, one platform</Eyebrow>
            <h2 className="text-h2">Pick the workflow you need today</h2>
          </div>
          <Link href="/products/" className="text-body-sm font-medium text-accent hover:underline">
            All products →
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

      {/* 6 — Trust */}
      <Section tone="sunken">
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
      <Section>
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

      {/* 8 — Final CTA */}
      <CtaBand
        title="Replace the spreadsheet. Keep the audit trail."
        body="Start with one workflow today. Add the rest when you need them."
        primary={{ label: "Start free", href: `${site.appUrl}/sign-up` }}
        secondary={{ label: "Try a free tool", href: "/tools/" }}
      />
    </>
  );
}
