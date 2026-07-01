import type { Pool } from "pg";
import { getGscPropertyUrl, getGa4PropertyId } from "./config";

export async function getSeoStatus(pool: Pool) {
  const { rows } = await pool.query(`SELECT * FROM seo_sync_state ORDER BY source`);
  return {
    sources: Object.fromEntries(
      rows.map((x) => [
        x.source,
        {
          last_run_at: x.last_run_at,
          last_success_at: x.last_success_at,
          last_error: x.last_error,
          rows_upserted: x.rows_upserted,
        },
      ])
    ),
    config: {
      gsc_property_url: getGscPropertyUrl() || null,
      ga4_property_id: getGa4PropertyId() || null,
      dataforseo_configured: Boolean(process.env.DATAFORSEO_LOGIN && process.env.DATAFORSEO_PASSWORD),
    },
  };
}

export async function getSeoOverview(pool: Pool, days = 28) {
  const propertyUrl = getGscPropertyUrl();
  if (!propertyUrl) {
    return { empty: true, message: "Set GSC_PROPERTY_URL to see metrics." };
  }

  const end = new Date();
  const start = new Date();
  start.setUTCDate(end.getUTCDate() - (days - 1));

  const { rows: pages } = await pool.query(
    `SELECT page_url,
            SUM(clicks)::int AS clicks,
            SUM(impressions)::int AS impressions,
            CASE WHEN SUM(impressions) > 0 THEN SUM(clicks)::float / SUM(impressions) ELSE 0 END AS ctr,
            CASE WHEN SUM(impressions) > 0 THEN SUM(position * impressions) / SUM(impressions) ELSE 0 END AS avg_position
     FROM gsc_page_daily
     WHERE property_url = $1 AND date >= $2 AND date <= $3 AND country_code = '' AND device_type = ''
     GROUP BY page_url
     ORDER BY impressions DESC
     LIMIT 50`,
    [propertyUrl, start.toISOString().slice(0, 10), end.toISOString().slice(0, 10)]
  );

  const { rows: queries } = await pool.query(
    `SELECT query,
            SUM(clicks)::int AS clicks,
            SUM(impressions)::int AS impressions,
            CASE WHEN SUM(impressions) > 0 THEN SUM(clicks)::float / SUM(impressions) ELSE 0 END AS ctr,
            CASE WHEN SUM(impressions) > 0 THEN SUM(position * impressions) / SUM(impressions) ELSE 0 END AS avg_position
     FROM gsc_query_page_daily
     WHERE property_url = $1 AND date >= $2 AND date <= $3 AND country_code = '' AND device_type = ''
     GROUP BY query
     ORDER BY impressions DESC
     LIMIT 50`,
    [propertyUrl, start.toISOString().slice(0, 10), end.toISOString().slice(0, 10)]
  );

  const totals = pages.reduce(
    (acc, p) => ({
      clicks: acc.clicks + Number(p.clicks),
      impressions: acc.impressions + Number(p.impressions),
    }),
    { clicks: 0, impressions: 0 }
  );

  return {
    empty: false,
    days,
    totals: {
      ...totals,
      ctr: totals.impressions ? totals.clicks / totals.impressions : 0,
    },
    top_pages: pages,
    top_queries: queries,
  };
}
