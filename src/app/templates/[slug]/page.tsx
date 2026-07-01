import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container, Eyebrow, Button, Badge } from "@/components/ui";
import { Section, Breadcrumbs, RelatedGrid, FigureFrame, CtaBand } from "@/components/sections";
import { templates, getTemplate } from "@/lib/library";
import { getProduct } from "@/lib/products";
import { getWorkflow } from "@/lib/content";
import { getGuide } from "@/lib/guides";
import { getTerm } from "@/lib/library";
import { appSignupUrl } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbLd } from "@/lib/jsonld";

export function generateStaticParams() {
  return templates.map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const t = getTemplate(params.slug);
  if (!t) return {};
  return pageMetadata({ title: `${t.name} Template`, description: t.forWhat, path: `/templates/${t.slug}/` });
}

export default function TemplatePage({ params }: { params: { slug: string } }) {
  const t = getTemplate(params.slug);
  if (!t) notFound();
  const product = getProduct(t.product);
  const workflow = getWorkflow(t.workflow);
  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Templates", href: "/templates/" },
    { name: t.name, href: `/templates/${t.slug}/` },
  ];

  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <Container className="py-12">
        <Breadcrumbs items={crumbs} />
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <Badge tone="neutral">{t.category}</Badge>
            <h1 className="mt-4 text-h1">{t.name}</h1>
            <p className="mt-5 text-body-lg text-secondary">{t.forWhat}</p>
            <p className="mt-4 text-body-sm text-tertiary">Who should use it: {t.who}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={appSignupUrl()} size="lg">
                Download template
              </Button>
              {product && (
                <Button href={`/products/${product.slug}/`} variant="secondary" size="lg">
                  {`Automate with ${product.name}`}
                </Button>
              )}
            </div>
          </div>
          <FigureFrame label={`${t.slug}.template`} caption={`${t.name} — preview`} />
        </div>
      </Container>

      <Section tone="surface">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <RelatedGrid title="Related workflow" links={workflow ? [{ label: workflow.title, href: `/workflows/${workflow.slug}/` }] : []} />
          <RelatedGrid title="Related product" links={product ? [{ label: product.name, href: `/products/${product.slug}/` }] : []} />
          <RelatedGrid
            title="Related"
            links={[
              ...(t.guide ? [{ label: getGuide(t.guide)?.title ?? t.guide, href: `/guides/${t.guide}/` }] : []),
              ...t.glossary.map((s) => ({ label: getTerm(s)?.term ?? s, href: `/glossary/${s}/` })),
            ]}
          />
        </div>
      </Section>

      <CtaBand
        title="From template to monitored workflow"
        body="A template is a starting point. Keelstar keeps it current, reminds you, and keeps the audit trail."
        primary={{ label: "Start free", href: appSignupUrl() }}
        secondary={{ label: "Browse templates", href: "/templates/" }}
      />
    </>
  );
}
