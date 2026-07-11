#!/usr/bin/env tsx
/**
 * Phase 4 — surface GSC long-tail keyword candidates for new guide/solution pages.
 *
 * Usage:
 *   npm run seo:longtail
 *   npm run seo:longtail -- --min-impressions=50 --limit=100
 *
 * Requires: SEO database + prior `npm run seo:sync -- gsc`
 */
import { readFileSync } from "fs";
import { resolve } from "path";

function loadEnv() {
  const envPath = resolve(process.cwd(), ".env");
  try {
    const text = readFileSync(envPath, "utf8");
    for (const line of text.split("\n")) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m) process.env[m[1].trim()] = m[2].trim();
    }
  } catch {
    // optional .env
  }
}

loadEnv();

function parseArg(name: string, fallback: number): number {
  const flag = process.argv.find((a) => a.startsWith(`--${name}=`));
  return flag ? Number(flag.split("=")[1]) : fallback;
}

async function main() {
  const minImpressions = parseArg("min-impressions", 50);
  const limit = parseArg("limit", 100);

  const { getSeoPool } = await import("../src/lib/seo-analytics/db");
  const pool = getSeoPool();

  const { rows } = await pool.query<{
    query: string;
    page: string;
    impressions: string;
    clicks: string;
    position: string;
  }>(
    `SELECT query, page, SUM(impressions)::int AS impressions, SUM(clicks)::int AS clicks,
            ROUND(AVG(position)::numeric, 1) AS position
     FROM gsc_query_page_daily
     WHERE date >= CURRENT_DATE - INTERVAL '28 days'
     GROUP BY query, page
     HAVING SUM(impressions) >= $1
     ORDER BY SUM(impressions) DESC
     LIMIT $2`,
    [minImpressions, limit]
  );

  if (!rows.length) {
    console.log(
      JSON.stringify(
        {
          message: "No rows — run `npm run seo:sync -- gsc` after GSC is configured.",
          minImpressions,
          candidates: [],
        },
        null,
        2
      )
    );
    await pool.end();
    return;
  }

  const candidates = rows.map((r) => ({
    query: r.query,
    page: r.page,
    impressions: Number(r.impressions),
    clicks: Number(r.clicks),
    position: Number(r.position),
    suggestedRoute: r.page.includes("/guides/")
      ? "expand-existing-guide"
      : r.page.includes("/solutions/")
        ? "expand-solution-cluster"
        : "new-guide-or-glossary",
  }));

  console.log(JSON.stringify({ minImpressions, count: candidates.length, candidates }, null, 2));
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
