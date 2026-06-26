import type { Metadata } from "next";
import Link from "next/link";
import { Container, Eyebrow } from "@/components/ui";
import { Breadcrumbs } from "@/components/sections";
import { glossary } from "@/lib/library";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Glossary",
  description: "Plain-language definitions of the documents, clauses, and compliance terms behind operational workflows — W-9, certificate of insurance, notice period, audit trail, and more.",
  path: "/glossary/",
});

export default function GlossaryHub() {
  const sorted = [...glossary].sort((a, b) => a.term.localeCompare(b.term));
  return (
    <Container className="py-12">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Glossary", href: "/glossary/" }]} />
      <div className="max-w-2xl">
        <Eyebrow className="mb-3">Glossary</Eyebrow>
        <h1 className="text-h1">The language of operational workflows</h1>
        <p className="mt-4 text-body-lg text-secondary">
          Direct definitions, why each term matters operationally, and where it shows up in your work.
        </p>
      </div>
      <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((t) => (
          <Link
            key={t.slug}
            href={`/glossary/${t.slug}/`}
            className="group border-b border-border py-3"
          >
            <span className="block text-body-sm font-medium text-primary group-hover:text-accent">{t.term}</span>
            <span className="block truncate text-caption text-secondary">{t.definition}</span>
          </Link>
        ))}
      </div>
    </Container>
  );
}
