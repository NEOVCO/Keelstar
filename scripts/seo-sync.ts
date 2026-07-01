#!/usr/bin/env tsx
/**
 * SEO control tower CLI — GSC + GA4 sync, catalog seed
 * Usage:
 *   npx tsx scripts/seo-sync.ts gsc --days=15
 *   npx tsx scripts/seo-sync.ts ga4 --days=15
 *   npx tsx scripts/seo-sync.ts seed-catalog
 *   npx tsx scripts/seo-sync.ts all --days=15
 */
import { readFileSync } from "fs";
import { resolve } from "path";

function loadEnv() {
  const envPath = resolve(process.cwd(), ".env");
  const text = readFileSync(envPath, "utf8");
  for (const line of text.split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  }
}

loadEnv();

function parseDays(argv: string[]): number {
  const flag = argv.find((a) => a.startsWith("--days="));
  return flag ? Math.min(120, Math.max(1, Number(flag.split("=")[1]))) : 15;
}

async function main() {
  const [, , cmd, ...rest] = process.argv;
  const days = parseDays(rest);
  const end = new Date();
  const start = new Date();
  start.setUTCDate(end.getUTCDate() - (days - 1));

  const { getSeoPool } = await import("../src/lib/seo-analytics/db");
  const pool = getSeoPool();

  if (cmd === "seed-catalog") {
    const { seedSeoPageCatalog } = await import("../src/lib/seo-analytics/seed-catalog");
    console.log(await seedSeoPageCatalog(pool));
    return;
  }

  if (cmd === "gsc" || cmd === "all") {
    const { syncGsc } = await import("../src/lib/seo-analytics/gsc-sync");
    console.log("GSC sync...", await syncGsc(pool, start, end));
  }

  if (cmd === "ga4" || cmd === "all") {
    const { syncGa4 } = await import("../src/lib/seo-analytics/ga4-sync");
    console.log("GA4 sync...", await syncGa4(pool, start, end));
  }

  if (!["gsc", "ga4", "all", "seed-catalog"].includes(cmd ?? "")) {
    console.error("Usage: seo-sync.ts <gsc|ga4|all|seed-catalog> [--days=15]");
    process.exit(1);
  }

  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
