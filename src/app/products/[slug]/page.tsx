import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Container, Eyebrow, Button, Badge } from "@/components/ui";
import { Section, Breadcrumbs, WorkflowSpine, TrustCallouts, CtaBand, RelatedGrid, FigureFrame } from "@/components/sections";
import { Faq } from "@/components/Faq";
import { allProducts, getProduct } from "@/lib/products";
import { getWorkflow } from "@/lib/content";
import { getTool } from "@/lib/tools";
import { getTerm, getTemplate, getCompare } from "@/lib/library";
import { pageMetadata } from "@/lib/seo";
import { JsonLd, softwareApplicationLd, breadcrumbLd } from "@/lib/jsonld";

export function generateStaticParams() {
  return allProducts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getProduct(params.slug);
  if (!p) return {};
  return pageMetadata({
    title: `${p.name}`,
    description: `${p.job} ${p.sub}`,
    path: `/products/${p.slug}/`,
  });
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const p = getProduct(params.slug);
  if (!p) notFound();

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products/" },
    { name: p.name, href: `/products/${p.slug}/` },
  ];

  const wfLinks = p.relatedWorkflows.map((s) => ({ label: getWorkflow(s)?.title ?? s, href: `/workflows/${s}/` }));
  const toolLinks = p.relatedTools.map((s) => ({ label: getTool(s)?.name ?? s, href: `/tools/${s}/` }));
  const termLinks = p.relatedGlossary.map((s) => ({ label: getTerm(s)?.term ?? s, href: `/glossary/${s}/` }));
  const tplLinks = p.relatedTemplates.map((s) => ({ label: getTemplate(s)?.name ?? s, href: `/templates/${s}/` }));
  const cmpLinks = p.relatedCompare.map((s) => ({ label: getCompare(s)?.title ?? s, href: `/compare/${s}/` }));

  return (
    <>
      <JsonLd
        data={[
          softwareApplicationLd({ name: p.name, description: p.sub, path: `/products/${p.slug}/` }),
          breadcrumbLd(crumbs),
        ]}
      />

      {/* Hero */}
      <Container className="pb-12 pt-12">
        <Breadcrumbs items={crumbs} />
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Badge tone="neutral">{p.cluster}</Badge>
              <Badge tone="accent">{p.node}</Badge>
            </div>
            <h1 className="text-h1">{p.job}</h1>
            <p className="mt-5 text-body-lg text-secondary">{p.sub}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={`${"https://app.keelstar.com"}/sign-up`} size="lg">
                Start free
              </Button>
              {p.utility && (
                <Button href={p.utility.href} variant="secondary" size="lg">
                  {p.utility.label}
                </Button>
              )}
            </div>
            <p className="mt-4 text-caption text-tertiary">Who it&apos;s for: {p.who}</p>
          </div>
          <div>
            {p.utility ? (
              <div className="rounded-lg border border-border bg-surface p-6">
                <Eyebrow className="mb-2">Try it now</Eyebrow>
                <p className="text-h4 text-primary">{p.utility.label}</p>
                <p className="mt-2 text-body-sm text-secondary">
                  Use the free tool first — no account needed. Move it into {p.name} when you want it monitored.
                </p>
                <div className="mt-4">
                  <Button href={p.utility.href}>Open the tool →</Button>
                </div>
              </div>
            ) : (
              <FigureFrame label={`app.keelstar.com/${p.slug}`} caption={`${p.name} — product UI`} />
            )}
          </div>
        </div>
      </Container>

      {/* What it does */}
      <Section tone="surface">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow className="mb-3">What it does</Eyebrow>
            <h2 className="text-h2">The job, handled end to end</h2>
          </div>
          <ul className="space-y-4">
            {p.whatItDoes.map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-subtle text-caption font-semibold text-accent">
                  {i + 1}
                </span>
                <span className="text-body text-secondary">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* How it works */}
      <Section>
        <Eyebrow className="mb-3">How it works</Eyebrow>
        <h2 className="mb-10 text-h2">Three steps</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {p.how.map((s, i) => (
            <div key={i} className="rounded-md border border-border bg-surface p-6">
              <span className="font-mono text-caption text-tertiary">0{i + 1}</span>
              <h3 className="mt-2 text-h4 text-primary">{s.title}</h3>
              <p className="mt-2 text-body-sm text-secondary">{s.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <WorkflowSpine highlight={p.node} />
        </div>
      </Section>

      {/* Monitoring / recurring value */}
      <Section tone="sunken">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow className="mb-3">Recurring value</Eyebrow>
            <h2 className="text-h2">Where the real value is</h2>
            <p className="mt-4 max-w-prose text-body-lg text-secondary">{p.monitoring}</p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-6">
            <Eyebrow className="mb-3">Audit output</Eyebrow>
            <p className="text-body text-secondary">{p.audit}</p>
            <div className="mt-4">
              <Link href="/security/" className="text-body-sm font-medium text-accent hover:underline">
                How Keelstar handles security →
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* Platform capabilities */}
      <Section>
        <div className="mb-10 max-w-2xl">
          <Eyebrow className="mb-3">On the shared platform</Eyebrow>
          <h2 className="text-h2">Built in, not bolted on</h2>
        </div>
        <TrustCallouts />
      </Section>

      {/* FAQ */}
      <Section tone="surface">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          <div>
            <Eyebrow className="mb-3">FAQ</Eyebrow>
            <h2 className="text-h2">Common questions</h2>
          </div>
          <Faq items={p.faqs} />
        </div>
      </Section>

      {/* Related */}
      <Section>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <RelatedGrid title="Related workflows" links={wfLinks} />
          <RelatedGrid title="Related tools" links={toolLinks} />
          <RelatedGrid title="Glossary" links={termLinks} />
          <RelatedGrid title="Templates" links={tplLinks} />
          <RelatedGrid title="Comparisons" links={cmpLinks} />
          <RelatedGrid title="Documentation" links={[{ label: `${p.name} docs`, href: `/docs/${p.slug}/` }, { label: "All documentation", href: "/docs/" }]} />
        </div>
      </Section>

      <CtaBand
        title={`Start with ${p.name} today`}
        body="Live the same day. No consultants, no implementation project."
        primary={{ label: "Start free", href: "https://app.keelstar.com/sign-up" }}
        secondary={{ label: "See pricing", href: "/pricing/" }}
      />
    </>
  );
}
