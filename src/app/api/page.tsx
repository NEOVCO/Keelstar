import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui";
import { Breadcrumbs } from "@/components/sections";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "API",
  description: "Build on Keelstar. Developer documentation for organizations, users, documents, parsed fields, workflows, monitors, notifications, webhooks, and more.",
  path: "/api/",
});

const sections = [
  ["Overview", "What the Keelstar API does and how it's structured."],
  ["Authentication", "API keys and securing requests."],
  ["Organizations", "Manage workspaces programmatically."],
  ["Users", "Members and roles."],
  ["Documents", "Upload and retrieve documents."],
  ["Parsed fields", "Access extracted fields like dates and limits."],
  ["Workflows", "Create and drive workflows."],
  ["Monitors", "Set up continuous monitoring."],
  ["Notifications", "Configure reminders and alerts."],
  ["Webhooks", "Subscribe to events."],
  ["Rate limits", "Usage limits and headers."],
  ["Errors", "Error codes and handling."],
  ["Changelog", "API changes over time."],
];

export default function ApiHome() {
  return (
    <Container className="py-12">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "API", href: "/api/" }]} />
      <div className="max-w-2xl">
        <Eyebrow className="mb-3">API</Eyebrow>
        <h1 className="text-h1">Build on Keelstar</h1>
        <p className="mt-4 text-body-lg text-secondary">A clean, predictable API over the same workflows, monitors, and audit logs you use in the app.</p>
      </div>
      <div className="mt-10 max-w-reading overflow-hidden rounded-lg border border-border">
        <div className="border-b border-border bg-sunken px-4 py-2 font-mono text-caption text-tertiary">GET /v1/documents/:id/parsed-fields</div>
        <pre className="overflow-x-auto bg-surface p-4 font-mono text-body-sm text-secondary">{`{
  "id": "doc_8x2",
  "type": "certificate_of_insurance",
  "fields": {
    "expiration_date": "2026-11-30",
    "general_liability_limit": 1000000
  }
}`}</pre>
      </div>
      <div className="mt-10 divide-y divide-border border-y border-border max-w-reading">
        {sections.map(([t, d]) => (
          <div key={t} className="flex items-baseline justify-between gap-4 py-3">
            <span className="font-mono text-body-sm text-primary">{t}</span>
            <span className="text-caption text-tertiary">{d}</span>
          </div>
        ))}
      </div>
    </Container>
  );
}
