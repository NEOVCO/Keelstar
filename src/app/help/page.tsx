import type { Metadata } from "next";
import { Container, Eyebrow, Card } from "@/components/ui";
import { Breadcrumbs } from "@/components/sections";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Help Center",
  description: "Short, high-intent help articles for Keelstar: account, billing, file formats, upload limits, notifications, troubleshooting, access, and exports.",
  path: "/help/",
});

const topics = [
  ["Account", "Manage your profile and sign-in."],
  ["Billing", "Plans, invoices, and seats."],
  ["File formats", "Which document formats are supported."],
  ["Upload limits", "File size and volume limits."],
  ["Notifications", "Control reminders and alerts."],
  ["Troubleshooting", "Fix common issues fast."],
  ["Access", "Roles, permissions, and invites."],
  ["Password reset", "Regain access to your account."],
  ["Workspace invites", "Add and manage members."],
  ["Exports", "Get your data and evidence out."],
];

export default function HelpHub() {
  return (
    <Container className="py-12">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Help", href: "/help/" }]} />
      <div className="max-w-2xl">
        <Eyebrow className="mb-3">Help Center</Eyebrow>
        <h1 className="text-h1">Quick answers to common questions</h1>
        <p className="mt-4 text-body-lg text-secondary">High-intent help for getting unblocked. For deeper setup, see the documentation.</p>
      </div>
      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map(([t, d]) => (
          <Card key={t} href="/contact/" title={t} desc={d} />
        ))}
      </div>
    </Container>
  );
}
