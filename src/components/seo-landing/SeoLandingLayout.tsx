import Link from "next/link";
import { Container, Eyebrow, Button } from "@/components/ui";
import { Section, Breadcrumbs, CtaBand } from "@/components/sections";
import { Faq } from "@/components/Faq";
import type { SeoLandingPageData } from "@/lib/seo-landing/pages";
import { appSignupUrl } from "@/lib/site";
import { JsonLd, breadcrumbLd, faqLd, webPageLd } from "@/lib/jsonld";
import { WaitlistForm } from "./WaitlistForm";
import { SeoContentSections } from "./SeoContentSections";
import { SolutionsGuideLinks } from "./SolutionsGuideLinks";

type Props = { page: SeoLandingPageData };

const LAST_UPDATED_DISPLAY = "July 10, 2026";

const TOC_ITEMS = [
  { id: "page-summary", label: "Summary" },
  { id: "problem", label: "Problem" },
  { id: "how-it-works", label: "How it works" },
  { id: "benefits", label: "Benefits" },
  { id: "related-solutions", label: "Related guides" },
  { id: "colony-guides", label: "OIG guides" },
  { id: "faq", label: "FAQ" },
] as const;

export function SeoLandingLayout({ page }: Props) {
  const crumbs = [
    { name: "Home", href: "/" },
    ...(page.path.startsWith("/solutions/") ? [{ name: "Solutions", href: "/solutions/" }] : []),
    { name: page.breadcrumb, href: page.path },
  ];

  const lastUpdated = page.lastUpdated ?? "2026-07-10";
  const toc = TOC_ITEMS.filter((item) => {
    if (item.id === "related-solutions") return page.solutionLinks && page.solutionLinks.length > 0;
    if (item.id === "colony-guides") return page.colonyGuideLinks && page.colonyGuideLinks.length > 0;
    return true;
  });

  return (
    <article itemScope itemType="https://schema.org/WebPage">
      <JsonLd
        data={[
          breadcrumbLd(crumbs),
          webPageLd({
            name: page.h1,
            description: page.metaDescription,
            path: page.path,
            dateModified: lastUpdated,
          }),
          ...(page.faqs.length ? [faqLd(page.faqs)] : []),
        ]}
      />
      <Container className="pb-12 pt-12">
        <Breadcrumbs items={crumbs} />
        {page.eyebrow && <Eyebrow className="mb-4">{page.eyebrow}</Eyebrow>}
        <h1 className="max-w-3xl text-h1" itemProp="headline">
          {page.h1}
        </h1>
        <p
          id="page-summary"
          className="mt-5 max-w-2xl text-body-lg text-secondary"
          itemProp="description"
        >
          {page.hero}
        </p>
        <p className="mt-3 text-body-sm text-secondary" itemProp="dateModified" content={lastUpdated}>
          Last updated: <time dateTime={lastUpdated}>{LAST_UPDATED_DISPLAY}</time>
        </p>
        <nav aria-label="On this page" className="mt-6 max-w-2xl">
          <p className="text-body-sm font-medium text-primary">On this page</p>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-body-sm">
            {toc.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="text-accent hover:underline">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-8 flex flex-wrap gap-3">
          {page.comingSoon ? (
            <Button href="/contact/" variant="secondary" size="lg">
              Contact for early access
            </Button>
          ) : (
            <Button href={appSignupUrl()} size="lg">
              Start free
            </Button>
          )}
        </div>
        {page.relatedLinks && page.relatedLinks.length > 0 && (
          <p className="mt-6 text-body-sm text-secondary">
            Related:{" "}
            {page.relatedLinks.map((l, i) => (
              <span key={l.href}>
                {i > 0 && " · "}
                <Link href={l.href} className="font-medium text-accent hover:underline">
                  {l.label}
                </Link>
              </span>
            ))}
          </p>
        )}
      </Container>

      <Section tone="surface" id="problem">
        <h2 className="text-h2">{page.problemTitle}</h2>
        <p className="mt-4 max-w-3xl text-body-lg text-secondary">{page.problem}</p>
        {page.problemBullets && page.problemBullets.length > 0 && (
          <ul className="mt-6 max-w-3xl space-y-3">
            {page.problemBullets.map((item) => (
              <li key={item} className="text-body text-secondary">
                {item}
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section id="how-it-works">
        <h2 className="mb-8 text-h2">{page.howTitle}</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {page.how.map((step) => (
            <div key={step.title} className="rounded-md border border-border bg-surface p-6">
              <h3 className="text-h4 text-primary">{step.title}</h3>
              <p className="mt-2 text-body-sm text-secondary">{step.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="sunken" id="benefits">
        <h2 className="text-h2">{page.benefitsTitle}</h2>
        <ul className="mt-6 space-y-3">
          {page.benefits.map((b) => (
            <li key={b} className="text-body text-secondary">
              {b}
            </li>
          ))}
        </ul>
      </Section>

      <SeoContentSections
        sections={page.sections}
        whoItsFor={page.whoItsFor}
        checklist={page.checklist}
      />

      {page.solutionLinks && page.solutionLinks.length > 0 && (
        <SolutionsGuideLinks links={page.solutionLinks} />
      )}

      {page.colonyGuideLinks && page.colonyGuideLinks.length > 0 && (
        <SolutionsGuideLinks
          id="colony-guides"
          title="OIG screening guides"
          links={page.colonyGuideLinks}
        />
      )}

      {page.comingSoon && (
        <Section>
          <h2 className="mb-6 text-h2">Join the waitlist</h2>
          <WaitlistForm />
        </Section>
      )}

      <Section tone="surface" id="faq">
        <h2 className="mb-8 text-h2">FAQ</h2>
        <Faq items={page.faqs} />
      </Section>

      <CtaBand
        title={page.ctaTitle}
        body={page.ctaBody}
        primary={{
          label: page.comingSoon ? "Contact us" : "Start free",
          href: page.comingSoon ? "/contact/" : appSignupUrl(),
        }}
        secondary={{ label: "See pricing", href: "/pricing/" }}
      />
    </article>
  );
}
