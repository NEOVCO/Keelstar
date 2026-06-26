import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container, Eyebrow, Button, Badge, Card } from "@/components/ui";
import { Section, Breadcrumbs, WorkflowSpine, CtaBand, RelatedGrid } from "@/components/sections";
import { Faq } from "@/components/Faq";
import { workflows, getWorkflow } from "@/lib/content";
import { getProduct } from "@/lib/products";
import { getTool } from "@/lib/tools";
import { getTerm, getTemplate } from "@/lib/library";
import { getGuide } from "@/lib/guides";
import { pageMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbLd, faqLd } from "@/lib/jsonld";

export function generateStaticParams() {
  return workflows.map((w) => ({ slug: w.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const w = getWorkflow(params.slug);
  if (!w) return {};
  return pageMetadata({ title: `How to ${w.title}`, description: w.summary, path: `/workflows/${w.slug}/` });
}

export default function WorkflowPage({ params }: { params: { slug: string } }) {
  const w = getWorkflow(params.slug);
  if (!w) notFound();

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Workflows", href: "/workflows/" },
    { name: w.title, href: `/workflows/${w.slug}/` },
  ];
  const primary = getProduct(w.primaryProduct);
  const stack = w.stack.map((s) => getProduct(s)).filter(Boolean);

  return (
    <>
      <JsonLd data={[breadcrumbLd(crumbs), ...(w.faqs.length ? [faqLd(w.faqs)] : [])]} />
      <Container className="pb-10 pt-12">
        <Breadcrumbs items={crumbs} />
        <div className="max-w-3xl">
          <Badge tone="accent">{w.stage}</Badge>
          <h1 className="mt-4 text-h1">{w.title}</h1>
          <p className="mt-5 text-body-lg text-secondary">{w.covers}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {primary && <Button href={`/products/${primary.slug}/`} size="lg">{`Explore ${primary.name}`}</Button>}
            {w.tool && (
              <Button href={`/tools/${w.tool}/`} variant="secondary" size="lg">
                Try the free tool
              </Button>
            )}
          </div>
        </div>
      </Container>

      <Section tone="surface">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow className="mb-3">Why teams struggle today</Eyebrow>
            <h2 className="text-h2">The manual version doesn&apos;t scale</h2>
            <p className="mt-4 text-body-lg text-secondary">{w.struggle}</p>
          </div>
          <div>
            <Eyebrow className="mb-3">Recommended Keelstar stack</Eyebrow>
            <div className="space-y-3">
              {stack.map((p) => (
                <Card key={p!.slug} href={`/products/${p!.slug}/`} title={p!.name} desc={p!.job} />
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <Eyebrow className="mb-3">Step by step</Eyebrow>
        <h2 className="mb-10 text-h2">The flow, end to end</h2>
        <ol className="space-y-4">
          {w.steps.map((s, i) => (
            <li key={i} className="flex gap-4 rounded-md border border-border bg-surface p-5">
              <span className="font-mono text-body-sm text-tertiary">0{i + 1}</span>
              <span className="text-body text-secondary">{s}</span>
            </li>
          ))}
        </ol>
        <div className="mt-12">
          <WorkflowSpine highlight={w.stage} />
        </div>
      </Section>

      <Section tone="sunken">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow className="mb-3">Audit considerations</Eyebrow>
            <h2 className="text-h2">Evidence, ready before it&apos;s asked for</h2>
            <p className="mt-4 text-body-lg text-secondary">{w.audit}</p>
          </div>
          <div className="grid gap-4">
            {w.tool && (
              <Card
                href={`/tools/${w.tool}/`}
                eyebrow="Suggested free tool"
                title={getTool(w.tool)?.name ?? w.tool}
                desc={getTool(w.tool)?.outcome}
              />
            )}
            {w.template && (
              <Card
                href={`/templates/${w.template}/`}
                eyebrow="Suggested template"
                title={getTemplate(w.template)?.name ?? w.template}
                desc={getTemplate(w.template)?.forWhat}
              />
            )}
          </div>
        </div>
      </Section>

      {w.faqs.length > 0 && (
        <Section>
          <h2 className="mb-8 text-h2">Common questions</h2>
          <Faq items={w.faqs} />
        </Section>
      )}

      <Section tone="surface">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <RelatedGrid title="Related guides" links={w.guides.map((g) => ({ label: getGuide(g)?.title ?? g, href: `/guides/${g}/` }))} />
          <RelatedGrid title="Glossary" links={w.glossary.map((g) => ({ label: getTerm(g)?.term ?? g, href: `/glossary/${g}/` }))} />
          <RelatedGrid
            title="Related products"
            links={stack.map((p) => ({ label: p!.name, href: `/products/${p!.slug}/` }))}
          />
        </div>
      </Section>

      {primary && (
        <CtaBand
          title={`Ready to ${w.title.toLowerCase()}?`}
          primary={{ label: `Explore ${primary.name}`, href: `/products/${primary.slug}/` }}
          secondary={w.tool ? { label: "Try the free tool", href: `/tools/${w.tool}/` } : undefined}
        />
      )}
    </>
  );
}
