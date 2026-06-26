import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/ui";
import { Breadcrumbs } from "@/components/sections";
import { allDocs, getDoc } from "@/lib/docs";
import { pageMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbLd } from "@/lib/jsonld";

export function generateStaticParams() {
  return allDocs.map((d) => ({ slug: d.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const doc = getDoc(params.slug);
  if (!doc) return {};
  return pageMetadata({ title: `${doc.title} — Docs`, description: doc.intro, path: `/docs/${doc.slug}/`, type: "article" });
}

export default function DocPage({ params }: { params: { slug: string } }) {
  const doc = getDoc(params.slug);
  if (!doc) notFound();
  const idx = allDocs.findIndex((d) => d.slug === doc.slug);
  const prev = allDocs[idx - 1];
  const next = allDocs[idx + 1];
  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Docs", href: "/docs/" },
    { name: doc.title, href: `/docs/${doc.slug}/` },
  ];

  return (
    <article className="max-w-reading">
      <JsonLd data={breadcrumbLd(crumbs)} />
      <Breadcrumbs items={crumbs} />
      <Eyebrow className="mb-3">Documentation</Eyebrow>
      <h1 className="text-h1">{doc.title}</h1>
      <p className="mt-4 text-body-lg text-secondary">{doc.intro}</p>
      <div className="prose-keel mt-8">
        {doc.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <div className="mt-8 rounded-md border border-accent-subtle bg-accent-subtle p-4 text-body-sm text-secondary">
        Tip: every workflow shares the same audit logging, permissions, and exports — so this applies across applications.
      </div>
      <div className="mt-6 flex items-center justify-between text-caption text-tertiary">
        <span>Last updated June 2026</span>
        <a href="/contact/" className="hover:text-accent">Edit this page</a>
      </div>
      <nav className="mt-10 flex justify-between border-t border-border pt-6 text-body-sm">
        {prev ? (
          <Link href={`/docs/${prev.slug}/`} className="text-accent hover:underline">← {prev.title}</Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/docs/${next.slug}/`} className="text-accent hover:underline">{next.title} →</Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
