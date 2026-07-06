import type { Metadata } from "next";
import { Hub } from "@/components/Hub";
import { workflows } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Workflows",
  description:
    "Operational workflows for collecting W-9s, tracking COI expirations, monitoring contract renewals, routing approvals, and exporting audit evidence.",
  path: "/workflows/",
});

export default function WorkflowsHub() {
  return (
    <Hub
      crumbLabel="Workflows"
      crumbHref="/workflows/"
      eyebrow="Workflows"
      title="Operational workflows with an audit trail"
      intro="Each workflow shows how to run a recurring document process in Keelstar — from collection through monitoring and export."
      items={workflows.map((w) => ({
        title: w.title,
        href: `/workflows/${w.slug}/`,
        desc: w.summary,
        eyebrow: w.stage,
      }))}
    />
  );
}
