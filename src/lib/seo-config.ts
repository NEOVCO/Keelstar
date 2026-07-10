import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { allProducts } from "@/lib/products";
import { workflows, industries } from "@/lib/content";
import { tools } from "@/lib/tools";
import { glossary, compares, templates } from "@/lib/library";
import { guides } from "@/lib/guides";
import { allDocs } from "@/lib/docs";

export type SitemapTier = {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
};

/** Canonical absolute URL for a site path (always trailing slash except root). */
export function absoluteUrl(path: string): string {
  if (path === "/") return site.url;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const withSlash = normalized.endsWith("/") ? normalized : `${normalized}/`;
  return `${site.url}${withSlash}`;
}

const staticRoutes: SitemapTier[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/products/", priority: 0.9, changeFrequency: "weekly" },
  { path: "/tools/", priority: 0.9, changeFrequency: "weekly" },
  { path: "/workflows/", priority: 0.85, changeFrequency: "weekly" },
  { path: "/pricing/", priority: 0.85, changeFrequency: "monthly" },
  { path: "/industries/", priority: 0.8, changeFrequency: "monthly" },
  { path: "/guides/", priority: 0.8, changeFrequency: "weekly" },
  { path: "/compare/", priority: 0.75, changeFrequency: "monthly" },
  { path: "/templates/", priority: 0.75, changeFrequency: "monthly" },
  { path: "/glossary/", priority: 0.7, changeFrequency: "monthly" },
  { path: "/docs/", priority: 0.65, changeFrequency: "weekly" },
  { path: "/about/", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact/", priority: 0.6, changeFrequency: "monthly" },
  { path: "/trust/", priority: 0.6, changeFrequency: "monthly" },
  { path: "/security/", priority: 0.55, changeFrequency: "monthly" },
  { path: "/help/", priority: 0.55, changeFrequency: "monthly" },
  { path: "/api/", priority: 0.5, changeFrequency: "monthly" },
  { path: "/updates/", priority: 0.5, changeFrequency: "weekly" },
  { path: "/legal/privacy/", priority: 0.3, changeFrequency: "yearly" },
  { path: "/legal/terms/", priority: 0.3, changeFrequency: "yearly" },
];

type DynamicSection = {
  prefix: string;
  slugs: string[];
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
};

function dynamicSections(): DynamicSection[] {
  return [
    { prefix: "/products/", slugs: allProducts.map((p) => p.slug), priority: 0.85, changeFrequency: "monthly" },
    { prefix: "/tools/", slugs: tools.map((t) => t.slug), priority: 0.8, changeFrequency: "monthly" },
    { prefix: "/workflows/", slugs: workflows.map((w) => w.slug), priority: 0.75, changeFrequency: "monthly" },
    { prefix: "/guides/", slugs: guides.map((g) => g.slug), priority: 0.7, changeFrequency: "monthly" },
    { prefix: "/industries/", slugs: industries.map((i) => i.slug), priority: 0.7, changeFrequency: "monthly" },
    { prefix: "/compare/", slugs: compares.map((c) => c.slug), priority: 0.65, changeFrequency: "monthly" },
    { prefix: "/templates/", slugs: templates.map((t) => t.slug), priority: 0.65, changeFrequency: "monthly" },
    { prefix: "/glossary/", slugs: glossary.map((g) => g.slug), priority: 0.6, changeFrequency: "monthly" },
    { prefix: "/docs/", slugs: allDocs.map((d) => d.slug), priority: 0.55, changeFrequency: "weekly" },
  ];
}

export function buildSitemapEntries(): MetadataRoute.Sitemap {
  const now = new Date();
  const seen = new Set<string>();
  const entries: MetadataRoute.Sitemap = [];

  const push = (path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]) => {
    const url = absoluteUrl(path);
    if (seen.has(url)) return;
    seen.add(url);
    entries.push({ url, lastModified: now, changeFrequency, priority });
  };

  for (const route of staticRoutes) {
    push(route.path, route.priority, route.changeFrequency);
  }

  for (const section of dynamicSections()) {
    for (const slug of section.slugs) {
      push(`${section.prefix}${slug}/`, section.priority, section.changeFrequency);
    }
  }

  return entries;
}

type LlmsLink = { title: string; path: string; description: string };

function llmsSection(title: string, links: LlmsLink[]): string {
  if (!links.length) return "";
  const lines = links.map((l) => `- [${l.title}](${absoluteUrl(l.path)}): ${l.description}`);
  return `## ${title}\n${lines.join("\n")}\n`;
}

/** Curated llms.txt index for AI crawlers and agents (not a full sitemap mirror). */
export function buildLlmsTxt(): string {
  const featuredTools = [
    "w9-request-generator",
    "acord-analyzer",
    "oig-search",
    "contract-renewal-extractor",
    "vendor-onboarding-packet-generator",
    "policy-acknowledgment-link-maker",
  ];

  const featuredWorkflows = [
    "collect-w9s",
    "track-coi-expirations",
    "monitor-contract-renewals",
    "screen-vendors-against-exclusion-lists",
    "send-policy-acknowledgments",
    "route-invoice-approvals",
  ];

  const featuredGuides = guides.slice(0, 8);

  const sections = [
    llmsSection(
      "Platform",
      [
        { title: "Home", path: "/", description: site.tagline },
        { title: "About Keelstar", path: "/about/", description: "Mission, positioning, and who the platform is for." },
        { title: "Pricing", path: "/pricing/", description: "Self-serve plans from free tools to monitored workflows." },
        { title: "Trust & reliability", path: "/trust/", description: "Exportability, audit trails, and platform principles." },
        { title: "Security", path: "/security/", description: "Application security, privacy, and data handling." },
        { title: "Contact", path: "/contact/", description: "Sales, support, and security inquiries." },
      ]
    ),
    llmsSection(
      "Products",
      allProducts.map((p) => ({
        title: p.name,
        path: `/products/${p.slug}/`,
        description: p.job.slice(0, 120),
      }))
    ),
    llmsSection(
      "Workflows",
      featuredWorkflows
        .map((slug) => workflows.find((w) => w.slug === slug))
        .filter(Boolean)
        .map((w) => ({
          title: w!.title,
          path: `/workflows/${w!.slug}/`,
          description: w!.summary.slice(0, 120),
        }))
    ),
    llmsSection(
      "Free tools",
      featuredTools
        .map((slug) => tools.find((t) => t.slug === slug))
        .filter(Boolean)
        .map((t) => ({
          title: t!.name,
          path: `/tools/${t!.slug}/`,
          description: t!.outcome.slice(0, 120),
        }))
    ),
    llmsSection(
      "Guides",
      featuredGuides.map((g) => ({
        title: g.title,
        path: `/guides/${g.slug}/`,
        description: g.summary.slice(0, 120),
      }))
    ),
    llmsSection(
      "Reference",
      [
        { title: "Glossary", path: "/glossary/", description: "Definitions for vendor compliance and contract operations terms." },
        { title: "Compare", path: "/compare/", description: "Keelstar vs spreadsheets, email, ERPs, and point tools." },
        { title: "Templates", path: "/templates/", description: "Starter templates for compliance and operations workflows." },
        { title: "Documentation", path: "/docs/", description: "Product documentation and getting-started guides." },
        { title: "Industries", path: "/industries/", description: "How Keelstar maps to healthcare, construction, staffing, and more." },
      ]
    ),
    llmsSection(
      "Solutions",
      [
        { title: "All solutions", path: "/solutions/", description: "Index of operational guides for W-9, COI, exclusion screening, and vendor workflows." },
        { title: "Vendor compliance", path: "/vendor-compliance/", description: "Collect W-9s and COIs, automate reminders, and maintain audit trails across your vendor roster." },
        { title: "W-9 collection", path: "/w9-collection/", description: "Request W-9s with secure links, validate fields, and keep dated tax records." },
        { title: "Certificate of insurance", path: "/certificate-of-insurance/", description: "Track ACORD certificates, monitor expirations, and alert before coverage lapses." },
        { title: "Exclusion monitoring", path: "/exclusion-monitoring/", description: "Screen vendors and contractors against OIG LEIE and related exclusion lists." },
        { title: "Vendor onboarding", path: "/vendor-onboarding/", description: "Checklists and portals to collect documents before vendors are approved to work or get paid." },
        { title: "Vendor portal", path: "/vendor-portal/", description: "Self-service portal for vendors to upload W-9s, insurance, and compliance documents." },
        { title: "Request W-9 from vendor", path: "/solutions/w9-request-from-vendor/", description: "Send a tracked W-9 request link with field validation and audit history." },
        { title: "Collect W-9 online", path: "/solutions/collect-w9-online/", description: "Browser-based W-9 collection without vendor accounts or email attachments." },
        { title: "Bulk W-9 request", path: "/solutions/bulk-w9-request/", description: "Request W-9s from an entire vendor list with automated reminders." },
        { title: "W-9 reminder automation", path: "/solutions/w9-reminder-automation/", description: "Automated nudges until every active vendor submits a current W-9." },
        { title: "COI tracking software", path: "/solutions/coi-tracking-software/", description: "Track certificates of insurance with expiration monitoring and requirement checks." },
        { title: "COI expiration alerts", path: "/solutions/coi-expiration-alerts/", description: "Lead-time alerts before vendor insurance certificates lapse." },
        { title: "ACORD 25 tracking", path: "/solutions/acord-25-tracking/", description: "Extract and monitor ACORD 25 certificate fields and expiration dates." },
        { title: "Certificate of insurance tracker", path: "/solutions/certificate-of-insurance-tracker/", description: "Central tracker for vendor insurance certificates and renewal history." },
        { title: "OIG exclusion check", path: "/solutions/oig-exclusion-check/", description: "Screen payees against the OIG LEIE before payment or enrollment." },
        { title: "OIG LEIE search", path: "/solutions/oig-leie-search/", description: "Search and document LEIE exclusion results with dated audit records." },
        { title: "LEIE screening software", path: "/solutions/leie-screening-software/", description: "Scheduled LEIE screening with match review and evidence exports." },
        { title: "Healthcare OIG screening", path: "/solutions/healthcare-oig-screening/", description: "OIG screening workflows for healthcare vendors, contractors, and individuals." },
        { title: "Vendor onboarding checklist", path: "/solutions/vendor-onboarding-checklist/", description: "Document checklist for supplier onboarding before approval and payment." },
        { title: "Vendor packet software", path: "/solutions/vendor-packet-software/", description: "Single portal to collect W-9s, insurance, contracts, and questionnaires." },
        { title: "Supplier onboarding workflow", path: "/solutions/supplier-onboarding-workflow/", description: "Route new suppliers through document collection and approval steps." },
        { title: "Vendor document collection", path: "/solutions/vendor-document-collection/", description: "Collect compliance documents from vendors through a tracked portal." },
        { title: "Contract renewal tracking", path: "/solutions/contract-renewal-tracking/", description: "Track renewal windows and notice periods across vendor agreements." },
        { title: "Contract risk review software", path: "/solutions/contract-risk-review-software/", description: "Flag renewal dates, notice periods, and risk clauses before they take effect." },
        { title: "Contract expiration alerts", path: "/solutions/contract-expiration-alerts/", description: "Reminders ahead of contract expiration and auto-renewal deadlines." },
        { title: "Invoice approval workflow", path: "/solutions/invoice-approval-workflow/", description: "Route invoices through approval chains with audit-ready records." },
        { title: "Invoice approval software", path: "/solutions/invoice-approval-software/", description: "Software to submit, route, and approve vendor invoices before payment." },
        { title: "Accounts payable invoice approval", path: "/solutions/accounts-payable-invoice-approval/", description: "AP-focused invoice approval with visibility into overdue sign-offs." },
        { title: "Policy acknowledgment tracking", path: "/solutions/policy-acknowledgment-tracking/", description: "Distribute policies and track employee attestations with version history." },
        { title: "Employee policy acknowledgment", path: "/solutions/employee-policy-acknowledgment/", description: "Tracked links for employees to acknowledge policies without paper sign-in sheets." },
        { title: "Policy version control", path: "/solutions/policy-version-control/", description: "Publish policy updates and prove which version each employee attested to." },
      ]
    ),
    llmsSection(
      "Optional",
      [
        { title: "XML sitemap", path: "/sitemap.xml", description: "Machine-readable list of all public URLs for search engines." },
        { title: "Robots rules", path: "/robots.txt", description: "Crawler access policy for this site." },
        { title: "Privacy policy", path: "/legal/privacy/", description: "How Keelstar collects and uses customer data." },
        { title: "Terms of service", path: "/legal/terms/", description: "Terms governing use of the Keelstar website and services." },
      ]
    ),
  ].filter(Boolean);

  return [
    `# ${site.name}`,
    `> ${site.description}`,
    "",
    "Important notes:",
    `- ${site.name} is a U.S.-focused operational workflow platform for business documents (W-9s, COIs, contracts, policies, invoices).`,
    "- Free tools work without an account; monitored workflows require a Keelstar workspace.",
    `- Canonical site URL: ${site.url}`,
    `- Contact: ${site.contactEmail}`,
    "",
    ...sections,
  ].join("\n");
}
