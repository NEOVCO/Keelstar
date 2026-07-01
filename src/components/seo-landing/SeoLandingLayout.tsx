import Link from "next/link";
import { Container, Eyebrow, Button } from "@/components/ui";
import { Section, Breadcrumbs, CtaBand } from "@/components/sections";
import { Faq } from "@/components/Faq";
import type { SeoLandingPageData } from "@/lib/seo-landing/pages";
import { appSignupUrl } from "@/lib/site";
import { JsonLd, breadcrumbLd, faqLd } from "@/lib/jsonld";
import { WaitlistForm } from "./WaitlistForm";
import { SeoContentSections } from "./SeoContentSections";

type Props = { page: SeoLandingPageData };

export function SeoLandingLayout({ page }: Props) {
  const crumbs = [
    { name: "Home", href: "/" },
    { name: page.breadcrumb, href: page.path },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbLd(crumbs), ...(page.faqs.length ? [faqLd(page.faqs)] : [])]} />
      <Container className="pb-12 pt-12">
        <Breadcrumbs items={crumbs} />
        {page.eyebrow && <Eyebrow className="mb-4">{page.eyebrow}</Eyebrow>}
        <h1 className="max-w-3xl text-h1">{page.h1}</h1>
        <p className="mt-5 max-w-2xl text-body-lg text-secondary">{page.hero}</p>
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

      <Section tone="surface">
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

      <Section>
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

      <Section tone="sunken">
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

      {page.comingSoon && (
        <Section>
          <h2 className="mb-6 text-h2">Join the waitlist</h2>
          <WaitlistForm />
        </Section>
      )}

      <Section tone="surface">
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
    </>
  );
}
