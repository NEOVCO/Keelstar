/** Curated cross-links from static hub pages to /solutions/ cluster pages */
export type SolutionLink = { label: string; href: string };

const s = (slug: string) => `/solutions/${slug}/`;

export const HUB_SOLUTION_LINKS: Record<string, SolutionLink[]> = {
  "vendor-compliance": [
    { label: "W-9 collection software", href: s("w9-collection-software") },
    { label: "COI tracking software", href: s("coi-tracking-software") },
    { label: "OIG exclusion check", href: s("oig-exclusion-check") },
    { label: "Vendor packet software", href: s("vendor-packet-software") },
    { label: "Invoice approval workflow", href: s("invoice-approval-workflow") },
    { label: "Policy acknowledgment tracking", href: s("policy-acknowledgment-software") },
    { label: "All solutions", href: "/solutions/" },
  ],
  "w9-collection": [
    { label: "Request W-9 from vendor", href: s("w9-request-from-vendor") },
    { label: "Collect W-9 online", href: s("collect-w9-online") },
    { label: "Bulk W-9 request", href: s("bulk-w9-request") },
    { label: "W-9 reminder automation", href: s("w9-reminder-automation") },
    { label: "Stale W-9 alerts", href: s("stale-w9-alerts") },
    { label: "All W-9 solutions", href: "/solutions/" },
  ],
  "certificate-of-insurance": [
    { label: "COI tracking software", href: s("coi-tracking-software") },
    { label: "COI expiration alerts", href: s("coi-expiration-alerts") },
    { label: "ACORD 25 tracking", href: s("acord-25-tracking") },
    { label: "Certificate of insurance tracker", href: s("certificate-of-insurance-tracker") },
    { label: "COI renewal reminders", href: s("coi-renewal-reminders") },
    { label: "All COI solutions", href: "/solutions/" },
  ],
  "exclusion-monitoring": [
    { label: "OIG exclusion check", href: s("oig-exclusion-check") },
    { label: "OIG LEIE search", href: s("oig-leie-search") },
    { label: "LEIE screening software", href: s("leie-screening-software") },
    { label: "Healthcare OIG screening", href: s("healthcare-oig-screening") },
    { label: "Monthly OIG screening", href: s("monthly-oig-screening") },
    { label: "OIG exclusion audit trail", href: s("oig-exclusion-audit-trail") },
  ],
  "vendor-onboarding": [
    { label: "Vendor onboarding checklist", href: s("vendor-onboarding-checklist") },
    { label: "Vendor packet software", href: s("vendor-packet-software") },
    { label: "Supplier onboarding workflow", href: s("supplier-onboarding-workflow") },
    { label: "Vendor document collection", href: s("vendor-document-collection") },
    { label: "Vendor setup portal", href: s("vendor-setup-portal") },
  ],
  "vendor-portal": [
    { label: "Vendor setup portal", href: s("vendor-setup-portal") },
    { label: "Vendor document collection", href: s("vendor-document-collection") },
    { label: "Vendor information management", href: s("vendor-information-management") },
    { label: "Third-party vendor compliance", href: s("third-party-vendor-compliance") },
    { label: "Vendor packet software", href: s("vendor-packet-software") },
  ],
};

export function getHubSolutionLinks(hubSlug: string): SolutionLink[] {
  return HUB_SOLUTION_LINKS[hubSlug] ?? [];
}

/** Inject solutions index into dynamic page related links if missing */
export function withSolutionsIndex(links: SolutionLink[]): SolutionLink[] {
  const index = { label: "All solutions", href: "/solutions/" };
  if (links.some((l) => l.href === index.href)) return links;
  return [...links, index];
}
