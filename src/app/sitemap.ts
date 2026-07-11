import type { MetadataRoute } from "next";
import { buildSitemapEntries, absoluteUrl } from "@/lib/seo-config";
import { seoLandingSitemapPaths } from "@/lib/seo-landing/sitemap-routes";
import { industryWorkflowPages } from "@/lib/industry-workflows";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries = buildSitemapEntries();
  const seen = new Set(entries.map((e) => e.url));
  const now = new Date();

  for (const path of seoLandingSitemapPaths) {
    const url = absoluteUrl(path);
    if (seen.has(url)) continue;
    seen.add(url);
    entries.push({
      url,
      lastModified: now,
      changeFrequency: "monthly",
      priority: path.startsWith("/tools/") ? 0.82 : 0.88,
    });
  }

  for (const page of industryWorkflowPages) {
    const path = `/industries/${page.industrySlug}/${page.workflowSlug}/`;
    const url = absoluteUrl(path);
    if (seen.has(url)) continue;
    seen.add(url);
    entries.push({
      url,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.68,
    });
  }

  return entries;
}
