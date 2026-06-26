import type { Metadata } from "next";
import { Container, Eyebrow, Badge } from "@/components/ui";
import { Breadcrumbs } from "@/components/sections";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Updates",
  description: "Product updates, release notes, and changes to the Keelstar platform.",
  path: "/updates/",
});

const updates = [
  { date: "June 2026", tag: "New", title: "Exclusion Monitor scheduling", body: "Re-screen vendors and employees against OIG, OFAC, and SAM on a recurring schedule, with dated evidence of every check." },
  { date: "May 2026", tag: "Improved", title: "Contract notice-period deadlines", body: "Contract Renewal Tracker now calculates the decision deadline from each contract's notice period automatically." },
  { date: "April 2026", tag: "New", title: "Audit-trail exports", body: "Export a complete, timestamped audit trail from any workflow as evidence." },
];

export default function UpdatesPage() {
  return (
    <Container className="py-12">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Updates", href: "/updates/" }]} />
      <div className="max-w-2xl">
        <Eyebrow className="mb-3">Updates</Eyebrow>
        <h1 className="text-h1">What's new in Keelstar</h1>
        <p className="mt-4 text-body-lg text-secondary">Release notes and product changes. For evergreen how-tos, see the guides.</p>
      </div>
      <div className="mt-12 max-w-reading space-y-8">
        {updates.map((u) => (
          <article key={u.title} className="border-b border-border pb-8">
            <div className="flex items-center gap-3">
              <span className="text-caption text-tertiary">{u.date}</span>
              <Badge tone="accent">{u.tag}</Badge>
            </div>
            <h2 className="mt-2 text-h3 text-primary">{u.title}</h2>
            <p className="mt-2 text-body text-secondary">{u.body}</p>
          </article>
        ))}
      </div>
    </Container>
  );
}
