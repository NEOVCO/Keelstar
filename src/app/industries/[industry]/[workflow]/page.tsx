import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Container, Eyebrow, Button } from "@/components/ui";
import { Breadcrumbs, Section, CtaBand } from "@/components/sections";
import { industries } from "@/lib/content";
import { getProduct } from "@/lib/products";
import { getGuide } from "@/lib/guides";
import { industryWorkflowPages, getIndustryWorkflowPage } from "@/lib/industry-workflows";
import { pageMetadata } from "@/lib/seo";
import { JsonLd, articleLd, breadcrumbLd } from "@/lib/jsonld";

export function generateStaticParams() {
  return industryWorkflowPages.map((p) => ({
    industry: p.industrySlug,
    workflow: p.workflowSlug,
  }));
}

export function generateMetadata({
  params,
}: {
  params: { industry: string; workflow: string };
}): Metadata {
  const page = getIndustryWorkflowPage(params.industry, params.workflow);
  if (!page) return {};
  return pageMetadata({
    title: page.title,
    description: page.summary,
    path: `/industries/${page.industrySlug}/${page.workflowSlug}/`,
    type: "article",
  });
}

export default function IndustryWorkflowPage({
  params,
}: {
  params: { industry: string; workflow: string };
}) {
  const page = getIndustryWorkflowPage(params.industry, params.workflow);
  if (!page) notFound();

  const industry = industries.find((i) => i.slug === page.industrySlug);
  const product = getProduct(page.product);
  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Industries", href: "/industries/" },
    { name: industry?.name ?? page.industrySlug, href: `/industries/${page.industrySlug}/` },
    { name: page.title, href: `/industries/${page.industrySlug}/${page.workflowSlug}/` },
  ];

  return (
    <>
      <JsonLd
        data={[
          articleLd({
            title: page.title,
            description: page.summary,
            path: `/industries/${page.industrySlug}/${page.workflowSlug}/`,
            updated: page.updated,
            author: "Keelstar Team",
          }),
          breadcrumbLd(crumbs),
        ]}
      />
      <Container className="py-12">
        <Breadcrumbs items={crumbs} />
        <div className="max-w-reading">
          <Eyebrow className="mb-3">{industry?.name ?? "Industry"}</Eyebrow>
          <h1 className="text-h1">{page.headline}</h1>
          <p className="mt-4 text-body text-secondary">{page.summary}</p>

          <div className="mt-8 rounded-md border border-accent-subtle bg-accent-subtle p-5">
            <p className="text-caption font-semibold uppercase tracking-wide text-accent">The short answer</p>
            <p className="mt-2 text-body text-primary">{page.answer}</p>
          </div>
        </div>
      </Container>

      <Section tone="surface">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow className="mb-4">Common pain points</Eyebrow>
            <ul className="space-y-3">
              {page.pains.map((p) => (
                <li key={p} className="flex gap-3 text-body text-secondary">
                  <span className="text-accent">•</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Eyebrow className="mb-4">Documents &amp; records</Eyebrow>
            <div className="flex flex-wrap gap-2">
              {page.documents.map((d) => (
                <span
                  key={d}
                  className="rounded-sm border border-border bg-sunken px-3 py-1.5 text-body-sm text-secondary"
                >
                  {d}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <Eyebrow className="mb-3">How it works</Eyebrow>
        <ol className="mt-6 space-y-6">
          {page.steps.map((step, i) => (
            <li key={step.title} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-subtle text-body-sm font-semibold text-accent">
                {i + 1}
              </span>
              <div>
                <h2 className="text-h4 text-primary">{step.title}</h2>
                <p className="mt-1 text-body text-secondary">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="sunken">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-h3 text-primary">Related guides</h2>
            <ul className="mt-4 space-y-2">
              {page.relatedGuides.map((slug) => {
                const guide = getGuide(slug);
                return (
                  <li key={slug}>
                    <Link href={`/guides/${slug}/`} className="text-body text-accent hover:underline">
                      {guide?.title ?? slug}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <h2 className="text-h3 text-primary">Related solutions</h2>
            <ul className="mt-4 space-y-2">
              {page.relatedSolutions.map((slug) => (
                <li key={slug}>
                  <Link href={`/solutions/${slug}/`} className="text-body text-accent hover:underline">
                    {slug.replace(/-/g, " ")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <CtaBand
        title={`Run ${page.headline.toLowerCase()} with reminders and an audit trail`}
        primary={{ label: product ? `Explore ${product.name}` : "Start free", href: product ? `/products/${product.slug}/` : "/signup/" }}
        secondary={{ label: "See all workflows", href: "/workflows/" }}
      />
    </>
  );
}
