import type { Metadata } from "next";
import { Container, Eyebrow, Card } from "@/components/ui";
import { Breadcrumbs } from "@/components/sections";
import { templates, templateCategories } from "@/lib/library";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Templates",
  description: "Ready-to-use templates for vendor compliance, contract operations, HR compliance, finance operations, and audits.",
  path: "/templates/",
});

export default function TemplatesHub() {
  return (
    <Container className="py-12">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Templates", href: "/templates/" }]} />
      <div className="max-w-2xl">
        <Eyebrow className="mb-3">Templates</Eyebrow>
        <h1 className="text-h1">Start from a proven structure</h1>
        <p className="mt-4 text-body-lg text-secondary">
          Download a template to get going today — then automate it with the matching Keelstar workflow.
        </p>
      </div>
      <div className="mt-12 space-y-12">
        {templateCategories.map((cat) => {
          const items = templates.filter((t) => t.category === cat);
          if (!items.length) return null;
          return (
            <div key={cat}>
              <div className="mb-4 flex items-center gap-3">
                <h2 className="text-h4 text-primary">{cat}</h2>
                <span className="h-px flex-1 bg-border" />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((t) => (
                  <Card key={t.slug} href={`/templates/${t.slug}/`} title={t.name} desc={t.forWhat} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Container>
  );
}
