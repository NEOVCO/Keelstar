import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Container, Eyebrow, Button } from "@/components/ui";
import { Breadcrumbs } from "@/components/sections";
import { guides, getGuide } from "@/lib/guides";
import { getProduct } from "@/lib/products";
import { getWorkflow } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { JsonLd, articleLd, breadcrumbLd } from "@/lib/jsonld";

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const g = getGuide(params.slug);
  if (!g) return {};
  return pageMetadata({ title: g.title, description: g.summary, path: `/guides/${g.slug}/`, type: "article" });
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function GuidePage({ params }: { params: { slug: string } }) {
  const g = getGuide(params.slug);
  if (!g) notFound();
  const product = getProduct(g.product);
  const workflow = getWorkflow(g.workflow);
  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Guides", href: "/guides/" },
    { name: g.title, href: `/guides/${g.slug}/` },
  ];

  return (
    <>
      <JsonLd
        data={[
          articleLd({ title: g.title, description: g.summary, path: `/guides/${g.slug}/`, updated: g.updated, author: g.author }),
          breadcrumbLd(crumbs),
        ]}
      />
      <Container className="py-12">
        <Breadcrumbs items={crumbs} />
        <div className="grid gap-12 lg:grid-cols-[1fr_240px]">
          <article className="max-w-reading">
            <Eyebrow className="mb-3">Guide</Eyebrow>
            <h1 className="text-h1">{g.title}</h1>
            <p className="mt-3 text-caption text-tertiary">
              By {g.author} · Updated{" "}
              {new Date(g.updated).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>

            <div className="mt-8 rounded-md border border-accent-subtle bg-accent-subtle p-5">
              <p className="text-caption font-semibold uppercase tracking-wide text-accent">The short answer</p>
              <p className="mt-2 text-body text-primary">{g.answer}</p>
            </div>

            <div className="prose-keel mt-10">
              {g.sections.map((s) => (
                <section key={s.heading} id={slugify(s.heading)}>
                  <h2>{s.heading}</h2>
                  <p>{s.body}</p>
                  {s.bullets && (
                    <ul>
                      {s.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>

            <div className="mt-12 rounded-lg border border-border bg-surface p-6">
              <p className="text-body-sm font-semibold text-primary">Put this into a monitored workflow</p>
              {product && (
                <p className="mt-1 text-body-sm text-secondary">
                  {product.name} handles this continuously — with reminders and an audit trail.
                </p>
              )}
              <div className="mt-4 flex flex-wrap gap-3">
                {product && <Button href={`/products/${product.slug}/`}>{`Explore ${product.name}`}</Button>}
                {workflow && (
                  <Button href={`/workflows/${workflow.slug}/`} variant="secondary">
                    See the workflow
                  </Button>
                )}
              </div>
            </div>
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <p className="mb-3 text-caption font-semibold uppercase tracking-wide text-tertiary">On this page</p>
              <ul className="space-y-2 border-l border-border">
                {g.sections.map((s) => (
                  <li key={s.heading}>
                    <a href={`#${slugify(s.heading)}`} className="-ml-px block border-l border-transparent pl-3 text-body-sm text-secondary hover:border-accent hover:text-accent">
                      {s.heading}
                    </a>
                  </li>
                ))}
              </ul>
              {workflow && (
                <div className="mt-8">
                  <p className="mb-2 text-caption font-semibold uppercase tracking-wide text-tertiary">Related</p>
                  <Link href={`/workflows/${workflow.slug}/`} className="block text-body-sm text-accent hover:underline">
                    {workflow.title}
                  </Link>
                </div>
              )}
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}
