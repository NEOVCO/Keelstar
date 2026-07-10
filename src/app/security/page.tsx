import type { Metadata } from "next";
import { Container, Eyebrow, Button, Badge } from "@/components/ui";
import { Section, Breadcrumbs } from "@/components/sections";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Security",
  description: "How Keelstar protects your documents: encryption, access controls, audit logging, application security, and data handling. Security documentation available on request.",
  path: "/security/",
});

const sections = [
  { id: "encryption", title: "Encryption and storage", body: "Data is encrypted in transit and at rest. Documents and records are stored on managed, access-controlled infrastructure, with backups and retention configurable to your needs." },
  { id: "access", title: "Access controls", body: "Role-based permissions govern who can view and act on each workflow. Access is granted by role and is fully auditable, so adding or removing access is a single, recorded decision." },
  { id: "audit", title: "Audit logging", body: "Audit logging is built into every workflow. Every meaningful action — request, edit, approval, export — is recorded with an actor and timestamp, and can be exported as evidence." },
  { id: "appsec", title: "Application security", body: "We follow secure development practices, review changes before release, and monitor for issues. Security testing and dependency review are part of our process." },
  { id: "privacy", title: "Privacy and data handling", body: "You own your data. We process it to provide the service, support exports at any time, and honor deletion requests. We do not sell your data." },
  { id: "incident", title: "Incident reporting", body: `If you believe you've found a security issue, email ${site.contactEmail}. We investigate reports promptly and will keep you informed.` },
];

export default function SecurityPage() {
  return (
    <>
      <Container className="py-12">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Security", href: "/security/" }]} />
        <div className="max-w-2xl">
          <Eyebrow className="mb-3">Security</Eyebrow>
          <h1 className="text-h1">Security built into every workflow</h1>
          <p className="mt-4 text-body-lg text-secondary">
            Keelstar holds the documents that prove your business is compliant. Protecting them — and being able to show
            what happened to them — is the core of the product, not an afterthought.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Badge tone="accent">Security documentation available on request</Badge>
            <Button href="/contact/" variant="secondary">
              Request security documentation
            </Button>
          </div>
        </div>
      </Container>

      <Section tone="surface">
        <div className="grid gap-x-12 gap-y-10 lg:grid-cols-2">
          {sections.map((s) => (
            <div key={s.id} id={s.id}>
              <h2 className="text-h3 text-primary">{s.title}</h2>
              <p className="mt-3 max-w-prose text-body text-secondary">{s.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="rounded-lg border border-border bg-surface p-8">
          <Eyebrow className="mb-3">Future compliance artifacts</Eyebrow>
          <h2 className="text-h3 text-primary">Built with room for what&apos;s next</h2>
          <p className="mt-3 max-w-prose text-body text-secondary">
            We don&apos;t claim certifications we don&apos;t hold. As formal attestations such as SOC 2 are completed,
            they&apos;ll be published here. In the meantime, product security and data-handling details are available on
            request, and audit logging is built into every workflow.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {["Product security & data handling details", "Audit logging built into every workflow", "Security documentation available on request"].map((x) => (
              <div key={x} className="rounded-md border border-dashed border-border-strong bg-sunken p-4 text-body-sm text-secondary">
                {x}
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
