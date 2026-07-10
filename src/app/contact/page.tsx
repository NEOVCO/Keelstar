import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui";
import { Breadcrumbs } from "@/components/sections";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: "Get in touch with the Keelstar team about products, pricing, security documentation, or support.",
  path: "/contact/",
});

const routes = [
  { label: "Sales & pricing", desc: "Talk through workflows and platform pricing.", action: site.contactEmail },
  { label: "Security documentation", desc: "Request our security and data-handling details.", action: site.contactEmail },
  { label: "Support", desc: "Account, billing, or workflow questions.", action: site.contactEmail },
];

export default function ContactPage() {
  return (
    <Container className="py-12">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Contact", href: "/contact/" }]} />
      <div className="max-w-2xl">
        <Eyebrow className="mb-3">Contact</Eyebrow>
        <h1 className="text-h1">Talk to Keelstar</h1>
        <p className="mt-4 text-body-lg text-secondary">
          Tell us what you&apos;re trying to handle and we&apos;ll point you to the right workflow — or email us
          directly at{" "}
          <a href={`mailto:${site.contactEmail}`} className="font-medium text-accent hover:underline">
            {site.contactEmail}
          </a>
          .
        </p>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {routes.map((r) => (
          <div key={r.label} className="rounded-lg border border-border bg-surface p-6">
            <p className="text-body-sm font-semibold text-primary">{r.label}</p>
            <p className="mt-1 text-body-sm text-secondary">{r.desc}</p>
            <div className="mt-4">
              <a
                className="text-body-sm font-medium text-accent hover:underline"
                href={`mailto:${r.action}`}
              >
                {r.action}
              </a>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
