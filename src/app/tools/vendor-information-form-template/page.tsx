import type { Metadata } from "next";
import Link from "next/link";
import { Container, Badge } from "@/components/ui";
import { Section, Breadcrumbs, CtaBand } from "@/components/sections";
import { Faq } from "@/components/Faq";
import { VendorInformationFormTemplate } from "@/components/seo-landing/VendorInformationFormTemplate";
import { pageMetadata } from "@/lib/seo";
import { appSignupUrl } from "@/lib/site";
import { JsonLd, breadcrumbLd, faqLd } from "@/lib/jsonld";

const faqs = [
  { q: "What is a vendor information form?", a: "A standard template to collect legal entity name, tax ID, contacts, insurance status, and payment details from a new vendor." },
  { q: "Can this become a tracked portal?", a: "Yes. Keelstar turns checklists into secure vendor links with reminders, validation, and audit history." },
  { q: "What is the difference between legal entity and vendor name?", a: "The vendor name is often a DBA or trade name. The legal entity is the name on tax and insurance documents—both belong on your vendor record." },
];

export const metadata: Metadata = pageMetadata({
  title: "Vendor Information Form Template",
  description: "Free vendor information form template for legal entity, tax, insurance, and contact details.",
  path: "/tools/vendor-information-form-template/",
});

export default function VendorInformationFormTemplatePage() {
  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Free tools", href: "/tools/" },
    { name: "Vendor Information Form", href: "/tools/vendor-information-form-template/" },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbLd(crumbs), faqLd(faqs)]} />
      <Container className="py-12">
        <Breadcrumbs items={crumbs} />
        <Badge tone="success">Free · no account</Badge>
        <h1 className="mt-4 text-h1">Vendor Information Form Template</h1>
        <p className="mt-5 max-w-xl text-body-lg text-secondary">
          A starting checklist for vendor setup. For onboarding workflows, see{" "}
          <Link href="/vendor-onboarding/" className="font-medium text-accent hover:underline">
            vendor onboarding
          </Link>
          .
        </p>
        <div className="mt-10 max-w-xl">
          <VendorInformationFormTemplate />
        </div>
      </Container>
      <Section tone="surface">
        <h2 className="mb-8 text-h2">FAQ</h2>
        <Faq items={faqs} />
      </Section>
      <CtaBand
        title="Turn this into a tracked vendor portal"
        body="Collect each item through secure links with reminders and exports."
        primary={{ label: "Create a Keelstar workspace", href: appSignupUrl() }}
        secondary={{ label: "Vendor portal", href: "/vendor-portal/" }}
      />
    </>
  );
}
