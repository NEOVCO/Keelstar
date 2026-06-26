import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container, Eyebrow, Badge } from "@/components/ui";
import { Section, Breadcrumbs, RelatedGrid, CtaBand } from "@/components/sections";
import { Faq } from "@/components/Faq";
import { ToolRunner } from "@/components/ToolRunner";
import { tools, getTool } from "@/lib/tools";
import { getProduct } from "@/lib/products";
import { getWorkflow } from "@/lib/content";
import { getTerm, getTemplate } from "@/lib/library";
import { pageMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbLd, faqLd } from "@/lib/jsonld";

export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const t = getTool(params.slug);
  if (!t) return {};
  return pageMetadata({ title: t.name, description: t.outcome, path: `/tools/${t.slug}/` });
}

export default function ToolPage({ params }: { params: { slug: string } }) {
  const t = getTool(params.slug);
  if (!t) notFound();
  const product = getProduct(t.product);
  const workflow = getWorkflow(t.workflow);
  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Free tools", href: "/tools/" },
    { name: t.name, href: `/tools/${t.slug}/` },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbLd(crumbs), ...(t.faqs.length ? [faqLd(t.faqs)] : [])]} />
      <Container className="py-12">
        <Breadcrumbs items={crumbs} />
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <Badge tone="success">Free · no account</Badge>
            <h1 className="mt-4 text-h1">{t.name}</h1>
            <p className="mt-5 text-body-lg text-secondary">{t.outcome}</p>
            {t.examples.length > 0 && (
              <div className="mt-8">
                <Eyebrow className="mb-3">When to use it</Eyebrow>
                <ul className="space-y-2">
                  {t.examples.map((ex, i) => (
                    <li key={i} className="flex gap-2 text-body-sm text-secondary">
                      <span className="text-accent">→</span>
                      {ex}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p className="mt-8 rounded-md border border-border bg-sunken p-4 text-caption text-secondary">{t.privacy}</p>
          </div>
          <div>
            <ToolRunner
              name={t.name}
              inputKind={t.inputKind}
              inputLabel={t.inputLabel}
              productSlug={t.product}
              productName={product?.name ?? "Keelstar"}
            />
          </div>
        </div>
      </Container>

      {t.faqs.length > 0 && (
        <Section tone="surface">
          <h2 className="mb-8 text-h2">Common questions</h2>
          <Faq items={t.faqs} />
        </Section>
      )}

      <Section>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <RelatedGrid
            title="Related product"
            links={product ? [{ label: product.name, href: `/products/${product.slug}/` }] : []}
          />
          <RelatedGrid
            title="Related workflow"
            links={workflow ? [{ label: workflow.title, href: `/workflows/${workflow.slug}/` }] : []}
          />
          <RelatedGrid
            title="Glossary"
            links={t.glossary.map((g) => ({ label: getTerm(g)?.term ?? g, href: `/glossary/${g}/` }))}
          />
        </div>
        {t.template && (
          <p className="mt-8 text-body-sm text-secondary">
            Prefer a starting structure? See the{" "}
            <a className="font-medium text-accent hover:underline" href={`/templates/${t.template}/`}>
              {getTemplate(t.template)?.name}
            </a>
            .
          </p>
        )}
      </Section>

      {product && (
        <CtaBand
          title="Monitor this continuously"
          body={`Move this from a one-time check into a monitored workflow with ${product.name}.`}
          primary={{ label: `Set up ${product.name}`, href: `/products/${product.slug}/` }}
          secondary={{ label: "Browse all tools", href: "/tools/" }}
        />
      )}
    </>
  );
}
