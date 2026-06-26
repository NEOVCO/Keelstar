import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Check, Minus } from "lucide-react";
import { Container, Eyebrow, Button } from "@/components/ui";
import { Section, Breadcrumbs, CtaBand } from "@/components/sections";
import { compares, getCompare } from "@/lib/library";
import { getProduct } from "@/lib/products";
import { pageMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbLd } from "@/lib/jsonld";

export function generateStaticParams() {
  return compares.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const c = getCompare(params.slug);
  if (!c) return {};
  return pageMetadata({ title: c.title, description: `${c.title}: an honest, migration-oriented comparison.`, path: `/compare/${c.slug}/` });
}

export default function ComparePage({ params }: { params: { slug: string } }) {
  const c = getCompare(params.slug);
  if (!c) notFound();
  const product = getProduct(c.cta);
  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Compare", href: "/compare/" },
    { name: c.title, href: `/compare/${c.slug}/` },
  ];

  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <Container className="py-12">
        <Breadcrumbs items={crumbs} />
        <div className="max-w-3xl">
          <Eyebrow className="mb-3">Comparison</Eyebrow>
          <h1 className="text-h1">{c.title}</h1>
          <p className="mt-5 text-body-lg text-secondary">
            An honest look at where Keelstar fits, where {c.alt} still makes sense, and how to migrate without a
            rip-and-replace.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-surface p-6">
            <p className="text-body-sm font-semibold text-primary">Who Keelstar is for</p>
            <p className="mt-2 text-body-sm text-secondary">{c.forKeelstar}</p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-6">
            <p className="text-body-sm font-semibold text-primary">Who {c.alt} is for</p>
            <p className="mt-2 text-body-sm text-secondary">{c.forAlt}</p>
          </div>
        </div>
      </Container>

      <Section tone="surface">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <Eyebrow className="mb-4">Where Keelstar is stronger</Eyebrow>
            <ul className="space-y-3">
              {c.keelstarStronger.map((x, i) => (
                <li key={i} className="flex gap-3 text-body-sm text-secondary">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />
                  {x}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Eyebrow className="mb-4">Where {c.alt} is stronger</Eyebrow>
            <ul className="space-y-3">
              {c.altStronger.map((x, i) => (
                <li key={i} className="flex gap-3 text-body-sm text-secondary">
                  <Minus className="mt-0.5 h-4 w-4 shrink-0 text-tertiary" aria-hidden />
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow className="mb-3">Best fit</Eyebrow>
            <p className="text-body-lg text-secondary">{c.bestFit}</p>
          </div>
          <div>
            <Eyebrow className="mb-3">Migration considerations</Eyebrow>
            <p className="text-body-lg text-secondary">{c.migration}</p>
          </div>
        </div>
      </Section>

      {product && (
        <CtaBand
          title={`See if ${product.name} fits`}
          primary={{ label: `Explore ${product.name}`, href: `/products/${product.slug}/` }}
          secondary={{ label: "Try a free tool", href: "/tools/" }}
        />
      )}
    </>
  );
}
