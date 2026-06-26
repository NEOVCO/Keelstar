import type { Metadata } from "next";
import { Hub } from "@/components/Hub";
import { guides } from "@/lib/guides";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Guides",
  description: "Evergreen, answer-first guides for operations and compliance teams — how to collect W-9s, track COI expirations, monitor contract renewals, and more.",
  path: "/guides/",
});

export default function GuidesHub() {
  return (
    <Hub
      crumbLabel="Guides"
      crumbHref="/guides/"
      eyebrow="Guides"
      title="Practical answers for operators"
      intro="Direct, answer-first guidance on the recurring document work that keeps companies running."
      items={guides.map((g) => ({ title: g.title, href: `/guides/${g.slug}/`, desc: g.summary }))}
    />
  );
}
