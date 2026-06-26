import type { Metadata } from "next";
import { Hub } from "@/components/Hub";
import { tools } from "@/lib/tools";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Free Tools",
  description: "Free tools you can use with no account — generate a W-9 request, analyze an ACORD certificate, search exclusion lists, extract contract renewal dates, and more.",
  path: "/tools/",
});

export default function ToolsHub() {
  return (
    <Hub
      crumbLabel="Free tools"
      crumbHref="/tools/"
      eyebrow="Free tools"
      title="Use a tool now. No account required."
      intro="Each tool gives you a result on the first run. When you need it monitored, move it into the matching Keelstar workflow."
      items={tools.map((t) => ({ title: t.name, href: `/tools/${t.slug}/`, desc: t.outcome }))}
    />
  );
}
