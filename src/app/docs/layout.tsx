import Link from "next/link";
import { Container } from "@/components/ui";
import { docsNav } from "@/lib/docs";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <Container className="py-10">
      <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <Link href="/docs/" className="mb-4 block text-body-sm font-semibold text-primary">
              Documentation
            </Link>
            <nav aria-label="Docs" className="space-y-6">
              {docsNav.map((section) => (
                <div key={section.label}>
                  <p className="mb-2 text-caption font-semibold uppercase tracking-wide text-tertiary">{section.label}</p>
                  <ul className="space-y-1.5 border-l border-border">
                    {section.pages.map((p) => (
                      <li key={p.slug}>
                        <Link
                          href={`/docs/${p.slug}/`}
                          className="-ml-px block border-l border-transparent pl-3 text-body-sm text-secondary hover:border-accent hover:text-accent"
                        >
                          {p.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </Container>
  );
}
