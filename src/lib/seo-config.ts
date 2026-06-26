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
    "",
    ...sections,
  ].join("\n");
}
