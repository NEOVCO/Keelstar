import type { Metadata } from "next";
import { Hub } from "@/components/Hub";
import { workflows } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Workflows",
  description: "Problem-led workflows for collecting, approving, monitoring, and auditing the documents that keep your business running.",
  path: "/workflows/",
});

const stages = ["Collect", "Extract", "Approve", "Monitor", "Audit"] as const;

export default function WorkflowsHub() {
  return (
    <Hub
      crumbLabel="Workflows"
      crumbHref="/workflows/"
      eyebrow="Workflows"
      title="Start from the problem, not the product"
      intro="Each workflow maps a recurring operational job to the Keelstar applications, tools, and templates that handle it."
      items={stages.flatMap((stage) =>
        workflows
          .filter((w) => w.stage === stage)
          .map((w) => ({ title: w.title, href: `/workflows/${w.slug}/`, desc: w.summary, eyebrow: w.stage }))
      )}
    />
  );
}
