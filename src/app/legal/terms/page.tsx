import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui";
import { Breadcrumbs } from "@/components/sections";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Service",
  description: "The terms governing your use of Keelstar.",
  path: "/legal/terms/",
});

export default function TermsPage() {
  return (
    <Container className="py-12">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Terms", href: "/legal/terms/" }]} />
      <div className="max-w-reading">
        <Eyebrow className="mb-3">Legal</Eyebrow>
        <h1 className="text-h1">Terms of Service</h1>
        <div className="prose-keel mt-8">
          <p>These terms govern your access to and use of Keelstar. By using the service, you agree to them.</p>
          <h2>Use of the service</h2>
          <p>Use Keelstar lawfully and in line with these terms and your plan. You're responsible for the data you upload and the access you grant.</p>
          <h2>Billing</h2>
          <p>Paid plans are billed per the pricing in effect for your subscription. You can manage your plan from your account.</p>
          <h2>Availability and changes</h2>
          <p>We publish product changes on the updates page and system status on the status page. We may update these terms; material changes will be communicated.</p>
          <p className="text-caption">This is placeholder legal copy and should be reviewed by counsel before launch.</p>
        </div>
      </div>
    </Container>
  );
}
