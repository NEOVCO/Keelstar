import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui";
import { Breadcrumbs, CtaBand } from "@/components/sections";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description: "Keelstar builds focused operational workflow applications on one shared platform — replacing spreadsheets, shared folders, and email chains.",
  path: "/about/",
});

export default function AboutPage() {
  return (
    <>
      <Container className="py-12">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "About", href: "/about/" }]} />
        <div className="max-w-reading">
          <Eyebrow className="mb-3">About</Eyebrow>
          <h1 className="text-h1">Operational workflows, without the enterprise suite</h1>
          <div className="prose-keel mt-8">
            <p>Keelstar exists to replace the spreadsheets, shared folders, Outlook reminders, and email chains that recurring business documents tend to live in. We believe that work deserves focused, monitored workflows with real audit trails — not an enterprise implementation project.</p>
            <p>We build one platform made of many focused applications. Each one solves a single recurring problem extremely well, and every one is obvious, affordable, self-serve, and fast to deploy. The recurring value is in monitoring and auditability, not one-time transactions.</p>
            <p>We started with vendor compliance, contract operations, HR compliance, and finance operations. The platform is built to scale from ten applications to fifty, and from hundreds of records to millions.</p>
          </div>
        </div>
      </Container>
      <CtaBand title="See the platform" primary={{ label: "Explore products", href: "/products/" }} secondary={{ label: "Try a free tool", href: "/tools/" }} />
    </>
  );
}
