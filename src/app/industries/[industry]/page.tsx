import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Container, Eyebrow, Card } from "@/components/ui";
import { Section, Breadcrumbs, RelatedGrid, CtaBand } from "@/components/sections";
import { industries, getIndustry, getWorkflow } from "@/lib/content";
import { getProduct } from "@/lib/products";
import { getTemplate } from "@/lib/library";
import { getGuide } from "@/lib/guides";
import { industryWorkflowPages } from "@/lib/industry-workflows";
import { pageMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbLd } from "@/lib/jsonld";

export function generateStaticParams() {
  return industries.map((i) => ({ industry: i.slug }));
}

export function generateMetadata({ params }: { params: { industry: string } }): Metadata {
  const i = getIndustry(params.industry);
  if (!i) return {};
  return pageMetadata({ title: `${i.name}`, description: i.headline, path: `/industries/${i.slug}/` });
}

export default function IndustryPage({ params }: { params: { industry: string } }) {
  const ind = getIndustry(params.industry);
  if (!ind) notFound();
  const workflowPages = industryWorkflowPages.filter((p) => p.industrySlug === ind.slug);
  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Industries", href: "/industries/" },
    { name: ind.name, href: `/industries/${ind.slug}/` },
  ];

  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <Container className="py-12">
        <Breadcrumbs items={crumbs} />
        <div className="max-w-3xl">
          <Eyebrow className="mb-3">{ind.name}</Eyebrow>
          <h1 className="text-h1">{ind.headline}</h1>
        </div>
      </Container>

      <Section tone="surface">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow className="mb-4">Common pain points</Eyebrow>
            <ul className="space-y-3">
              {ind.pains.map((p, i) => (
                <li key={i} className="flex gap-3 text-body text-secondary">
                  <span className="text-accent">•</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Eyebrow className="mb-4">Documents &amp; records</Eyebrow>
            <div className="flex flex-wrap gap-2">
              {ind.documents.map((d) => (
                <span key={d} className="rounded-sm border border-border bg-sunken px-3 py-1.5 text-body-sm text-secondary">
                  {d}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <Eyebrow className="mb-3">Recommended workflows</Eyebrow>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {ind.workflows.map((s) => {
            const w = getWorkflow(s);
            return w ? <Card key={s} href={`/workflows/${s}/`} title={w.title} desc={w.summary} eyebrow={w.stage} /> : null;
          })}
        </div>
        {workflowPages.length > 0 && (
          <div className="mt-10">
            <Eyebrow className="mb-3">Industry playbooks</Eyebrow>
            <ul className="mt-4 space-y-2">
              {workflowPages.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/industries/${p.industrySlug}/${p.workflowSlug}/`}
                    className="text-body text-accent hover:underline"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-10">
          <Eyebrow className="mb-3">Recommended products</Eyebrow>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {ind.products.map((s) => {
              const p = getProduct(s);
              return p ? <Card key={s} href={`/products/${s}/`} title={p.name} desc={p.job} /> : null;
            })}
          </div>
        </div>
      </Section>

      <Section tone="sunken">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <RelatedGrid title="Related templates" links={ind.templates.map((s) => ({ label: getTemplate(s)?.name ?? s, href: `/templates/${s}/` }))} />
          <RelatedGrid title="Related guides" links={ind.guides.map((s) => ({ label: getGuide(s)?.title ?? s, href: `/guides/${s}/` }))} />
        </div>
      </Section>

      <CtaBand
        title={`Bring ${ind.name.toLowerCase()} compliance under one platform`}
        primary={{ label: "Try a free tool", href: "/tools/" }}
        secondary={{ label: "Explore workflows", href: "/workflows/" }}
      />
    </>
  );
}
