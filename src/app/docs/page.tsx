import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/ui";
import { Breadcrumbs } from "@/components/sections";
import { docsNav } from "@/lib/docs";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Documentation",
  description: "Keelstar documentation: getting started, platform capabilities, and per-application guides.",
  path: "/docs/",
});

export default function DocsHome() {
  return (
    <div className="max-w-reading">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Docs", href: "/docs/" }]} />
      <Eyebrow className="mb-3">Documentation</Eyebrow>
      <h1 className="text-h1">Keelstar documentation</h1>
      <p className="mt-4 text-body-lg text-secondary">
        Everything you need to set up workflows, manage your workspace, and get the most out of each application.
      </p>
      <div className="mt-10 space-y-8">
        {docsNav.map((section) => (
          <div key={section.label}>
            <h2 className="text-h4 text-primary">{section.label}</h2>
            <ul className="mt-3 divide-y divide-border border-y border-border">
              {section.pages.map((p) => (
                <li key={p.slug}>
                  <Link href={`/docs/${p.slug}/`} className="flex items-baseline justify-between gap-3 py-3">
                    <span className="text-body-sm font-medium text-primary">{p.title}</span>
                    <span className="text-caption text-tertiary">{p.intro}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
