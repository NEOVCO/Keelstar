import type { Metadata } from "next";
import { Hub } from "@/components/Hub";
import { industries } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Industries",
  description: "How operations and compliance teams across industries use Keelstar to keep documents collected, current, and auditable.",
  path: "/industries/",
});

export default function IndustriesHub() {
  return (
    <Hub
      crumbLabel="Industries"
      crumbHref="/industries/"
      eyebrow="Industries"
      title="Built for document-heavy operations"
      intro="See the pains, workflows, and products that fit your industry."
      items={industries.map((i) => ({ title: i.name, href: `/industries/${i.slug}/`, desc: i.headline }))}
    />
  );
}
