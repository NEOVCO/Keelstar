import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container, Eyebrow, Button } from "@/components/ui";
import { Breadcrumbs, RelatedGrid } from "@/components/sections";
import { glossary, getTerm } from "@/lib/library";
import { getProduct } from "@/lib/products";
import { getWorkflow } from "@/lib/content";
import { getGuide } from "@/lib/guides";
import { pageMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbLd, articleLd } from "@/lib/jsonld";

export function generateStaticParams() {
  return glossary.map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const t = getTerm(params.slug);
  if (!t) return {};
  return pageMetadata({ title: `What Is ${t.term}? | Keelstar Glossary`, description: t.definition, path: `/glossary/${t.slug}/`, type: "article" });
}

export default function GlossaryPage({ params }: { params: { slug: string } }) {
  const t = getTerm(params.slug);
  if (!t) notFound();
  const product = t.product ? getProduct(t.product) : undefined;
  const workflow = t.workflow ? getWorkflow(t.workflow) : undefined;
  const guide = t.guide ? getGuide(t.guide) : undefined;
  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Glossary", href: "/glossary/" },
    { name: t.term, href: `/glossary/${t.slug}/` },
  ];

  return (
    <>
      <JsonLd
        data={[
          articleLd({ title: `What is ${t.term}?`, description: t.definition, path: `/glossary/${t.slug}/`, updated: "2026-06-01", author: "Keelstar Team" }),
          breadcrumbLd(crumbs),
        ]}
      />
      <Container className="py-12">
        <Breadcrumbs items={crumbs} />
        <div className="grid gap-12 lg:grid-cols-[1fr_280px]">
          <article className="max-w-reading">
            <Eyebrow className="mb-3">Glossary</Eyebrow>
            <h1 className="text-h1">{t.term}</h1>
            <div className="mt-6 rounded-md border border-accent-subtle bg-accent-subtle p-5">
              <p className="text-caption font-semibold uppercase tracking-wide text-accent">Definition</p>
              <p className="mt-2 text-body text-primary">{t.definition}</p>
            </div>
            <div className="prose-keel mt-10">
              <h2>Why it matters operationally</h2>
              <p>{t.why}</p>
              {t.examples && (
                <>
                  <h2>Example</h2>
                  <p>{t.examples}</p>
                </>
              )}
            </div>
            {product && (
              <div className="mt-10 rounded-lg border border-border bg-surface p-6">
                <p className="text-body-sm font-semibold text-primary">Handle {t.term.toLowerCase()} in a workflow</p>
                <p className="mt-1 text-body-sm text-secondary">{product.job}</p>
                <div className="mt-4">
                  <Button href={`/products/${product.slug}/`}>{`Explore ${product.name}`}</Button>
                </div>
              </div>
            )}
          </article>
          <aside className="space-y-8">
            <RelatedGrid
              title="Related"
              links={[
                ...(workflow ? [{ label: workflow.title, href: `/workflows/${workflow.slug}/` }] : []),
                ...(guide ? [{ label: guide.title, href: `/guides/${guide.slug}/` }] : []),
                ...(product ? [{ label: product.name, href: `/products/${product.slug}/` }] : []),
              ]}
            />
            {t.related.length > 0 && (
              <RelatedGrid
                title="Related terms"
                links={t.related.map((s) => ({ label: getTerm(s)?.term ?? s, href: `/glossary/${s}/` }))}
              />
            )}
          </aside>
        </div>
      </Container>
    </>
  );
}
