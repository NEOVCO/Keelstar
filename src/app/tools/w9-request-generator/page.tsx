import type { Metadata } from "next";
import Link from "next/link";
import { Container, Badge } from "@/components/ui";
import { Section, Breadcrumbs, CtaBand } from "@/components/sections";
import { Faq } from "@/components/Faq";
import { W9RequestGenerator } from "@/components/seo-landing/W9RequestGenerator";
import { pageMetadata } from "@/lib/seo";
import { appSignupUrl } from "@/lib/site";
import { JsonLd, breadcrumbLd, faqLd } from "@/lib/jsonld";

const faqs = [
  { q: "Is this a legally binding W-9?", a: "No. This tool generates a request email. The vendor still completes and signs IRS Form W-9." },
  { q: "Can Keelstar track responses?", a: "Yes. Create a free workspace to send secure links, validate submissions, and monitor who has not responded." },
  { q: "What should a W-9 request email include?", a: "A clear subject line, what you need, how to submit securely, and a contact for questions. This generator drafts that structure—you add your secure link." },
];

export const metadata: Metadata = pageMetadata({
  title: "W-9 Request Generator",
  description: "Generate a professional W-9 request email to send a vendor. Free, no account required.",
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
      <JsonLd data={[breadcrumbLd(crumbs), faqLd(faqs)]} />
      <Container className="py-12">
        <Breadcrumbs items={crumbs} />
        <Badge tone="success">Free · no account</Badge>
        <h1 className="mt-4 text-h1">W-9 Request Generator</h1>
        <p className="mt-5 max-w-xl text-body-lg text-secondary">
          Draft a vendor W-9 request email with your company and vendor names. Copy and send, or{" "}
          <Link href="/w9-collection/" className="font-medium text-accent hover:underline">
            collect W-9s in Keelstar
          </Link>
          .
        </p>
        <div className="mt-10 max-w-xl">
          <W9RequestGenerator />
        </div>
      </Container>
      <Section tone="surface">
        <h2 className="mb-8 text-h2">FAQ</h2>
        <Faq items={faqs} />
      </Section>
      <CtaBand
        title="Track W-9 responses automatically"
        body="Move from a one-time email to monitored W-9 collection with reminders."
        primary={{ label: "Start free", href: appSignupUrl() }}
        secondary={{ label: "W-9 collection", href: "/w9-collection/" }}
      />
    </>
  );
}
