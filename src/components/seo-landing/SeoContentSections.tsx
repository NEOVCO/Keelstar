import Link from "next/link";
import { Eyebrow } from "@/components/ui";
import { Section } from "@/components/sections";
import type { SeoContentSection } from "@/lib/seo-landing/types";

type Props = {
  sections?: SeoContentSection[];
  whoItsFor?: { title: string; items: string[] };
  checklist?: { title: string; items: string[] };
};

export function SeoContentSections({ sections, whoItsFor, checklist }: Props) {
  if (!sections?.length && !whoItsFor && !checklist) return null;

  return (
    <>
      {sections?.map((section, index) => (
        <Section key={section.title} tone={index % 2 === 0 ? undefined : "surface"}>
          {section.eyebrow && <Eyebrow className="mb-3">{section.eyebrow}</Eyebrow>}
          <h2 className="text-h2">{section.title}</h2>
          <div className="mt-5 max-w-3xl space-y-4">
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className="text-body text-secondary">
                {paragraph}
              </p>
            ))}
          </div>
          {section.bullets && section.bullets.length > 0 && (
            <ul className="mt-6 max-w-3xl space-y-3">
              {section.bullets.map((item) => (
                <li key={item} className="text-body text-secondary">
                  {item}
                </li>
              ))}
            </ul>
          )}
        </Section>
      ))}

      {whoItsFor && (
        <Section tone="sunken">
          <h2 className="text-h2">{whoItsFor.title}</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {whoItsFor.items.map((item) => (
              <li key={item} className="rounded-md border border-border bg-surface p-5 text-body-sm text-secondary">
                {item}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {checklist && (
        <Section>
          <h2 className="text-h2">{checklist.title}</h2>
          <ul className="mt-6 max-w-3xl space-y-3">
            {checklist.items.map((item) => (
              <li key={item} className="flex items-start gap-3 text-body text-secondary">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-body-sm text-secondary">
            Need a tracked version?{" "}
            <Link href="/vendor-portal/" className="font-medium text-accent hover:underline">
              Set up a vendor portal
            </Link>
            ,{" "}
            <Link href="/vendor-onboarding/" className="font-medium text-accent hover:underline">
              vendor onboarding workflow
            </Link>
            , or browse{" "}
            <Link href="/solutions/" className="font-medium text-accent hover:underline">
              all solution guides
            </Link>
            .
          </p>
        </Section>
      )}
    </>
  );
}
