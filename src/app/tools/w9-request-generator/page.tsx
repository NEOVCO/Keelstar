import type { Metadata } from "next";
import Link from "next/link";
import { Container, Badge } from "@/components/ui";
import { Section, Breadcrumbs, CtaBand } from "@/components/sections";
import { Faq } from "@/components/Faq";
import { W9RequestGenerator } from "@/components/seo-landing/W9RequestGenerator";
import { SeoContentSections } from "@/components/seo-landing/SeoContentSections";
import {
  w9RequestGeneratorSections,
  w9RequestGeneratorFaqs,
} from "@/lib/seo-landing/content/w9-request-generator";
import { pageMetadata } from "@/lib/seo";
import { appSignupUrl } from "@/lib/site";
import { JsonLd, breadcrumbLd, faqLd } from "@/lib/jsonld";

export const metadata: Metadata = pageMetadata({
  title: "W-9 Request Generator",
  description:
    "Generate a professional W-9 request email to send a vendor. Free template for company and vendor names—no account required.",
  path: "/tools/w9-request-generator/",
});

export default function W9RequestGeneratorPage() {
  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Free tools", href: "/tools/" },
    { name: "W-9 Request Generator", href: "/tools/w9-request-generator/" },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbLd(crumbs), faqLd(w9RequestGeneratorFaqs)]} />
      <Container className="py-12">
        <Breadcrumbs items={crumbs} />
        <Badge tone="success">Free · no account</Badge>
        <h1 className="mt-4 text-h1">W-9 Request Generator</h1>
        <p className="mt-5 max-w-2xl text-body-lg text-secondary">
          Draft a vendor W-9 request email with your company and vendor names. Copy and send from your inbox, or move to{" "}
          <Link href="/w9-collection/" className="font-medium text-accent hover:underline">
            tracked W-9 collection
          </Link>{" "}
          when you need reminders and audit history.
        </p>
        <div className="mt-10 max-w-xl">
          <W9RequestGenerator />
        </div>
      </Container>
      <SeoContentSections sections={w9RequestGeneratorSections} />
      <Section tone="surface">
        <h2 className="mb-8 text-h2">FAQ</h2>
        <Faq items={w9RequestGeneratorFaqs} />
      </Section>
      <CtaBand
        title="Track W-9 responses automatically"
        body="Move from a one-time email to monitored W-9 collection with reminders and validated submissions."
        primary={{ label: "Start free", href: appSignupUrl() }}
        secondary={{ label: "W-9 collection", href: "/w9-collection/" }}
      />
    </>
  );
}
