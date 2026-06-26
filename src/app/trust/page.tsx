import type { Metadata } from "next";
import Link from "next/link";
import { Container, Eyebrow, Button } from "@/components/ui";
import { Section, Breadcrumbs, CtaBand } from "@/components/sections";
import { Faq } from "@/components/Faq";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Trust",
  description: "Keelstar's platform principles, reliability, exportability, and change history — and a customer trust FAQ.",
  path: "/trust/",
});

const principles = [
  { title: "Your data is yours", body: "Everything you put into Keelstar is exportable at any time. No lock-in, no hostage data." },
  { title: "Evidence by default", body: "Audit trails and version history are built into every workflow, so proof is a download, not a project." },
  { title: "Focused, not bloated", body: "We build applications that solve one problem well, on shared infrastructure you can trust." },
  { title: "Honest about security", body: "We publish what we hold and don't claim certifications we don't have." },
];

const faqs = [
  { q: "Can we get our data out?", a: "Yes, at any time. Every workflow supports exporting records and their full history in portable formats." },
  { q: "What happens if we stop using Keelstar?", a: "You can export everything before you go. Your evidence is portable by design." },
  { q: "How do you handle changes and downtime?", a: "We publish product changes on our updates page and system status on our status page. Reliability is a first-class concern." },
  { q: "Do you have compliance certifications?", a: "We publish formal attestations as they're completed and provide product security and data-handling details on request." },
];

export default function TrustPage() {
  return (
    <>
      <Container className="py-12">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Trust", href: "/trust/" }]} />
        <div className="max-w-2xl">
          <Eyebrow className="mb-3">Trust</Eyebrow>
          <h1 className="text-h1">Built to be standardized on for a decade</h1>
          <p className="mt-4 text-body-lg text-secondary">
            Teams put their compliance records into Keelstar. These are the principles that earn — and keep — that
            trust.
          </p>
        </div>
      </Container>

      <Section tone="surface">
        <Eyebrow className="mb-6">Platform principles</Eyebrow>
        <div className="grid gap-6 sm:grid-cols-2">
          {principles.map((p) => (
            <div key={p.title} className="rounded-lg border border-border bg-bg p-6">
              <h2 className="text-h4 text-primary">{p.title}</h2>
              <p className="mt-2 text-body-sm text-secondary">{p.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-x-12 gap-y-8 lg:grid-cols-3">
          <div>
            <h2 className="text-h3 text-primary">Uptime &amp; status</h2>
            <p className="mt-2 text-body-sm text-secondary">
              Live system status is published at{" "}
              <a href={site.statusUrl} className="text-accent hover:underline" target="_blank" rel="noreferrer">
                status.keelstar.com
              </a>
              .
            </p>
          </div>
          <div>
            <h2 className="text-h3 text-primary">Exportability</h2>
            <p className="mt-2 text-body-sm text-secondary">Export any record or its full history at any time. Your data is portable by design.</p>
          </div>
          <div>
            <h2 className="text-h3 text-primary">Change history</h2>
            <p className="mt-2 text-body-sm text-secondary">
              Product changes are published on our{" "}
              <Link href="/updates/" className="text-accent hover:underline">
                updates
              </Link>{" "}
              page.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="sunken">
        <h2 className="mb-8 text-h2">Customer trust FAQ</h2>
        <Faq items={faqs} />
      </Section>

      <CtaBand
        title="See how Keelstar handles your data"
        primary={{ label: "Read the security overview", href: "/security/" }}
        secondary={{ label: "Contact us", href: "/contact/" }}
      />
    </>
  );
}
