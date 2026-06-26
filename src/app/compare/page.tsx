import type { Metadata } from "next";
import { Hub } from "@/components/Hub";
import { compares } from "@/lib/library";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Comparisons",
  description: "Honest, migration-oriented comparisons of Keelstar versus spreadsheets, email, ERP suites, and point tools.",
  path: "/compare/",
});

export default function CompareHub() {
  return (
    <Hub
      crumbLabel="Compare"
      crumbHref="/compare/"
      eyebrow="Comparisons"
      title="Where Keelstar fits — and where it doesn't"
      intro="Straight comparisons to help you decide, including where the alternative is the better choice."
      items={compares.map((c) => ({ title: c.title, href: `/compare/${c.slug}/` }))}
    />
  );
}
