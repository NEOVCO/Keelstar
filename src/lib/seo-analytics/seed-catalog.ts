import { absoluteUrl, buildSitemapEntries } from "@/lib/seo-config";
import { seoLandingSitemapPaths } from "@/lib/seo-landing/sitemap-routes";
import { getSeoPublicBaseUrl } from "./config";
import type { Pool } from "pg";

const STRATEGIC_PAGES: Array<{ path: string; page_type: string; title: string; priority: number }> = [
  { path: "/", page_type: "homepage", title: "Homepage", priority: 100 },
  { path: "/vendor-compliance/", page_type: "landing", title: "Vendor compliance", priority: 95 },
  { path: "/vendor-portal/", page_type: "landing", title: "Vendor portal", priority: 94 },
  { path: "/vendor-onboarding/", page_type: "landing", title: "Vendor onboarding", priority: 93 },
  { path: "/w9-collection/", page_type: "landing", title: "W-9 collection", priority: 92 },
  { path: "/certificate-of-insurance/", page_type: "landing", title: "Certificate of insurance", priority: 91 },
  { path: "/exclusion-monitoring/", page_type: "landing", title: "Exclusion monitoring", priority: 90 },
  { path: "/pricing/", page_type: "pricing", title: "Pricing", priority: 88 },
  { path: "/tools/", page_type: "hub", title: "Free tools", priority: 85 },
  { path: "/guides/", page_type: "hub", title: "Guides", priority: 82 },
];

function pathFromUrl(url: string, base: string): string {
  return url.replace(base, "").replace(/\/$/, "") || "/";
}

export async function seedSeoPageCatalog(pool: Pool) {
  const base = getSeoPublicBaseUrl();
  let inserted = 0;
  let updated = 0;

  const urls = new Map<string, { page_type: string; title: string; priority: number }>();

  for (const p of STRATEGIC_PAGES) {
    urls.set(`${base}${p.path.startsWith("/") ? p.path : `/${p.path}`}`.replace(/([^:]\/)\/+/g, "$1"), {
      page_type: p.page_type,
      title: p.title,
      priority: p.priority,
    });
  }

  for (const path of seoLandingSitemapPaths) {
    const url = absoluteUrl(path);
    if (!urls.has(url)) {
      urls.set(url, { page_type: "landing", title: path, priority: 80 });
    }
  }

  for (const entry of buildSitemapEntries()) {
    const url = entry.url;
    if (urls.has(url)) continue;
    const path = pathFromUrl(url, base);
    let page_type = "content";
    if (path.startsWith("/products/")) page_type = "product";
    else if (path.startsWith("/tools/")) page_type = "tool";
    else if (path.startsWith("/guides/")) page_type = "guide";
    else if (path.startsWith("/workflows/")) page_type = "workflow";
    urls.set(url, { page_type, title: path, priority: 50 });
  }

  for (const [pageUrl, meta] of urls) {
    const slug = pathFromUrl(pageUrl, base).replace(/^\//, "") || "home";
    const res = await pool.query(
      `INSERT INTO seo_page_catalog (page_url, page_type, slug, title, canonical_url, priority_score, is_active, updated_at)
       VALUES ($1, $2, $3, $4, $1, $5, true, now())
       ON CONFLICT (page_url) DO UPDATE SET
         page_type = EXCLUDED.page_type,
         slug = EXCLUDED.slug,
         title = EXCLUDED.title,
         canonical_url = EXCLUDED.canonical_url,
         priority_score = EXCLUDED.priority_score,
         is_active = true,
         updated_at = now()
       RETURNING (xmax = 0) AS inserted`,
      [pageUrl.slice(0, 2000), meta.page_type, slug.slice(0, 512), meta.title.slice(0, 500), meta.priority]
    );
    if (res.rows[0]?.inserted) inserted++;
    else updated++;
  }

  return { inserted, updated, total: urls.size };
}
