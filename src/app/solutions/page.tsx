import type { Metadata } from "next";
import Link from "next/link";
import { Container, Eyebrow } from "@/components/ui";
import { Section, Breadcrumbs, CtaBand } from "@/components/sections";
import { allSeoPageSpecs } from "@/lib/seo-landing/clusters";
import { appSignupUrl } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Solutions",
  description:
    "Guides and workflows for W-9 collection, COI tracking, OIG exclusion screening, vendor onboarding, contract renewals, invoice approvals, and policy acknowledgments.",
  path: "/solutions/",
});

const CLUSTER_LABELS: Record<string, string> = {
  w9: "W-9 collection",
  coi: "Certificate of insurance",
  oig: "OIG exclusion screening",
  vendor: "Vendor onboarding",
  contract: "Contract renewals",
  invoice: "Invoice approval",
  policy: "Policy & training",
};

const HUB_PAGES = [
  { label: "Vendor compliance", href: "/vendor-compliance/", desc: "W-9s, COIs, and audit trails in one place" },
  { label: "W-9 collection", href: "/w9-collection/", desc: "Secure W-9 requests and validation" },
  { label: "Certificate of insurance", href: "/certificate-of-insurance/", desc: "ACORD tracking and expiration alerts" },
  { label: "Exclusion monitoring", href: "/exclusion-monitoring/", desc: "OIG LEIE screening on a schedule" },
  { label: "Vendor onboarding", href: "/vendor-onboarding/", desc: "Complete vendor packets without email chase" },
  { label: "Vendor portal", href: "/vendor-portal/", desc: "Self-service document collection for vendors" },
];

export default function SolutionsIndexPage() {
  const byCluster = allSeoPageSpecs.reduce<Record<string, typeof allSeoPageSpecs>>((acc, spec) => {
    (acc[spec.cluster] ??= []).push(spec);
    return acc;
  }, {});

  return (
    <article>
      <Container className="pb-12 pt-12">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Solutions", href: "/solutions/" }]} />
        <Eyebrow className="mb-4">Solutions</Eyebrow>
        <h1 className="max-w-3xl text-h1">Operational workflows for vendor and compliance teams</h1>
        <p id="page-summary" className="mt-5 max-w-2xl text-body-lg text-secondary">
          Practical guides for collecting W-9s, tracking insurance certificates, screening OIG exclusions,
          onboarding vendors, and keeping audit-ready records—without an enterprise suite.
        </p>
        <p className="mt-3 text-body-sm text-secondary">
          Last updated: <time dateTime="2026-07-10">July 10, 2026</time>
        </p>
      </Container>

      <Section tone="surface">
        <h2 className="mb-6 text-h2">Start with a topic hub</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {HUB_PAGES.map((hub) => (
            <li key={hub.href}>
              <Link
                href={hub.href}
                className="block rounded-md border border-border bg-surface p-4 transition hover:border-accent/40"
              >
                <span className="text-body font-medium text-primary">{hub.label}</span>
                <p className="mt-1 text-body-sm text-secondary">{hub.desc}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {Object.entries(byCluster).map(([cluster, specs]) => (
        <Section key={cluster} tone={cluster === "w9" || cluster === "oig" ? "surface" : undefined}>
          <h2 className="mb-6 text-h2">{CLUSTER_LABELS[cluster] ?? cluster}</h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {specs.map((spec) => (
              <li key={spec.slug}>
                <Link
                  href={`/solutions/${spec.slug}/`}
                  className="block rounded-md border border-border bg-surface p-4 transition hover:border-accent/40"
                >
                  <span className="text-body font-medium text-primary">{spec.breadcrumb}</span>
                  <p className="mt-1 text-body-sm text-secondary line-clamp-2">{spec.metaDescription}</p>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ))}

      <CtaBand
        title="Ready to automate these workflows?"
        body="Start free with Keelstar. Add monitoring, reminders, and audit trails when you need them."
        primary={{ label: "Start free", href: appSignupUrl() }}
        secondary={{ label: "See pricing", href: "/pricing/" }}
      />
    </article>
  );
}
