import type { Metadata } from "next";
import Link from "next/link";
import { Container, Badge } from "@/components/ui";
import { Section, Breadcrumbs, CtaBand } from "@/components/sections";
import { Faq } from "@/components/Faq";
import { VendorInformationFormTemplate } from "@/components/seo-landing/VendorInformationFormTemplate";
import { SeoContentSections } from "@/components/seo-landing/SeoContentSections";
import {
  vendorInformationFormSections,
  vendorInformationFormFaqs,
} from "@/lib/seo-landing/content/vendor-information-form-template";
import { pageMetadata } from "@/lib/seo";
import { appSignupUrl } from "@/lib/site";
import { JsonLd, breadcrumbLd, faqLd } from "@/lib/jsonld";

export const metadata: Metadata = pageMetadata({
  title: "Vendor Information Form Template",
  description:
    "Free vendor information form template for legal entity, tax ID, insurance, contacts, and payment details. Start here, then track submissions in Keelstar.",
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
      <JsonLd data={[breadcrumbLd(crumbs), faqLd(vendorInformationFormFaqs)]} />
      <Container className="py-12">
        <Breadcrumbs items={crumbs} />
        <Badge tone="success">Free · no account</Badge>
        <h1 className="mt-4 text-h1">Vendor Information Form Template</h1>
        <p className="mt-5 max-w-2xl text-body-lg text-secondary">
          A starting checklist for supplier setup and vendor registration. For a full tracked workflow, see{" "}
          <Link href="/vendor-onboarding/" className="font-medium text-accent hover:underline">
            vendor onboarding
          </Link>{" "}
          or{" "}
          <Link href="/vendor-portal/" className="font-medium text-accent hover:underline">
            vendor portal
          </Link>
          .
        </p>
        <div className="mt-10 max-w-xl">
          <VendorInformationFormTemplate />
        </div>
      </Container>
      <SeoContentSections sections={vendorInformationFormSections} />
      <Section tone="surface">
        <h2 className="mb-8 text-h2">FAQ</h2>
        <Faq items={vendorInformationFormFaqs} />
      </Section>
      <CtaBand
        title="Turn this into a tracked vendor portal"
        body="Collect each item through secure links with reminders, validation, and exports."
        primary={{ label: "Create a Keelstar workspace", href: appSignupUrl() }}
        secondary={{ label: "Vendor portal", href: "/vendor-portal/" }}
      />
    </>
  );
}
