import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui";
import { Breadcrumbs } from "@/components/sections";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How Keelstar collects, uses, and protects your data.",
  path: "/legal/privacy/",
});

export default function PrivacyPage() {
  return (
    <Container className="py-12">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Privacy", href: "/legal/privacy/" }]} />
      <div className="max-w-reading">
        <Eyebrow className="mb-3">Legal</Eyebrow>
        <h1 className="text-h1">Privacy Policy</h1>
        <div className="prose-keel mt-8">
          <p>This page describes how Keelstar collects, uses, and protects your information. You own your data; we process it to provide the service, support exports at any time, and honor deletion requests. We do not sell your data.</p>
          <h2>Information we collect</h2>
          <p>Account details, the documents and records you upload, and usage data needed to operate the service.</p>
          <h2>How we use it</h2>
          <p>To provide and improve the workflows you use, send the notifications you configure, and maintain audit trails.</p>
          <h2>Your choices</h2>
          <p>Export your data at any time, request deletion, and manage notification preferences from your account.</p>
          <p className="text-caption">This is placeholder legal copy and should be reviewed by counsel before launch.</p>
        </div>
      </div>
    </Container>
  );
}
