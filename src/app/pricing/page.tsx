import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { Container, Eyebrow, Button, Badge } from "@/components/ui";
import { Section, Breadcrumbs, CtaBand } from "@/components/sections";
import { Faq } from "@/components/Faq";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Pricing",
  description: "Simple, self-serve pricing. Start with free tools, add a workflow when you need it, and scale across the platform without an enterprise contract.",
  path: "/pricing/",
});

const plans = [
  {
    name: "Free tools",
    price: "$0",
    cadence: "forever",
    for: "Anyone who needs a one-time result.",
    cta: { label: "Browse free tools", href: "/tools/" },
    featured: false,
    features: ["Every free tool, no account", "One-time results in your browser", "Private, signed share links", "Upgrade to monitoring anytime"],
  },
  {
    name: "Team",
    price: "$49",
    cadence: "per workflow / month",
    for: "A team adopting one or two workflows.",
    cta: { label: "Start free", href: "https://app.keelstar.com/sign-up" },
    featured: true,
    features: ["One application, fully monitored", "Reminders before every deadline", "Audit trail and version history", "Role-based permissions", "Exports on demand", "Up to 10 seats"],
  },
  {
    name: "Business",
    price: "Custom",
    cadence: "platform pricing",
    for: "Teams standardizing on multiple workflows.",
    cta: { label: "Contact sales", href: "/contact/" },
    featured: false,
    features: ["Every application on one platform", "Shared audit logging and permissions", "Priority support", "Volume and multi-workflow pricing", "Security documentation on request", "Unlimited seats"],
  },
];

const faqs = [
  { q: "How does per-workflow pricing work?", a: "Each application is priced on its own, so you only pay for the workflows you use. Add COI Tracking or contract renewals when you need them, on the same platform and login." },
  { q: "Is there a setup fee or implementation project?", a: "No. Keelstar is self-serve and live the same day. There are no consultants and no implementation fees." },
  { q: "Can I start for free?", a: "Yes. Every free tool works with no account. You only create an account when you want a workflow monitored with reminders and an audit trail." },
  { q: "Do you offer volume pricing?", a: "Yes. Business pricing covers multiple workflows and higher volumes. Contact us and we'll put together platform pricing." },
];

export default function PricingPage() {
  return (
    <>
      <Container className="py-12">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Pricing", href: "/pricing/" }]} />
        <div className="max-w-2xl">
          <Eyebrow className="mb-3">Pricing</Eyebrow>
          <h1 className="text-h1">Pay for the workflows you use</h1>
          <p className="mt-4 text-body-lg text-secondary">
            Start with free tools. Add a monitored workflow when you need it. Standardize across the platform when
            you&apos;re ready — no enterprise contract required.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col rounded-lg border bg-surface p-7 ${plan.featured ? "border-accent shadow-sm" : "border-border"}`}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-h4 text-primary">{plan.name}</h2>
                {plan.featured && <Badge tone="accent">Most popular</Badge>}
              </div>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="text-h1 text-primary">{plan.price}</span>
                <span className="text-body-sm text-tertiary">{plan.cadence}</span>
              </div>
              <p className="mt-2 text-body-sm text-secondary">{plan.for}</p>
              <div className="mt-6">
                <Button href={plan.cta.href} variant={plan.featured ? "primary" : "secondary"} className="w-full">
                  {plan.cta.label}
                </Button>
              </div>
              <ul className="mt-6 space-y-2.5 border-t border-border pt-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2.5 text-body-sm text-secondary">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-6 text-caption text-tertiary">
          Pricing shown is representative launch pricing. See{" "}
          <Link href="/contact/" className="text-accent hover:underline">
            contact
          </Link>{" "}
          for a tailored quote.
        </p>
      </Container>

      <Section tone="surface">
        <h2 className="mb-8 text-h2">Pricing questions</h2>
        <Faq items={faqs} />
      </Section>

      <CtaBand
        title="Start with one workflow today"
        primary={{ label: "Start free", href: "https://app.keelstar.com/sign-up" }}
        secondary={{ label: "Try a free tool", href: "/tools/" }}
      />
    </>
  );
}
