import Link from "next/link";
import { Section } from "@/components/sections";

type LinkItem = { label: string; href: string };

type Props = {
  links: LinkItem[];
  title?: string;
};

export function SolutionsGuideLinks({
  links,
  title = "Related solution guides",
}: Props) {
  if (!links.length) return null;

  return (
    <Section tone="surface" id="related-solutions">
      <h2 className="text-h2">{title}</h2>
      <p className="mt-3 max-w-3xl text-body text-secondary">
        Step-by-step guides for specific workflows. Each page explains the problem, what good looks like, and how
        Keelstar helps—without an enterprise implementation project.
      </p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="block rounded-md border border-border bg-surface p-4 text-body font-medium text-primary transition hover:border-accent/40 hover:text-accent"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
