import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { allProducts } from "@/lib/products";
import { workflows, industries } from "@/lib/content";
import { tools } from "@/lib/tools";
import { glossary, compares, templates } from "@/lib/library";
import { guides } from "@/lib/guides";
import { allDocs } from "@/lib/docs";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const now = new Date();

  const staticPaths = [
    "/",
    "/products/",
    "/workflows/",
    "/industries/",
    "/tools/",
    "/templates/",
    "/glossary/",
    "/compare/",
    "/guides/",
    "/docs/",
    "/help/",
    "/api/",
    "/pricing/",
    "/security/",
    "/trust/",
    "/about/",
    "/contact/",
    "/updates/",
    "/legal/privacy/",
    "/legal/terms/",
  ];

  const entries: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: p === "/" ? 1 : 0.7,
  }));

  const add = (prefix: string, slugs: string[], priority = 0.6) => {
    for (const slug of slugs) {
      entries.push({ url: `${base}${prefix}${slug}/`, lastModified: now, changeFrequency: "monthly", priority });
    }
  };

  add("/products/", allProducts.map((p) => p.slug), 0.8);
  add("/workflows/", workflows.map((w) => w.slug), 0.7);
  add("/industries/", industries.map((i) => i.slug), 0.7);
  add("/tools/", tools.map((t) => t.slug), 0.8);
  add("/templates/", templates.map((t) => t.slug));
  add("/glossary/", glossary.map((g) => g.slug));
  add("/compare/", compares.map((c) => c.slug));
  add("/guides/", guides.map((g) => g.slug));
  add("/docs/", allDocs.map((d) => d.slug), 0.5);

  return entries;
}
