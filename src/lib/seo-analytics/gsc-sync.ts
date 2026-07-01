import { google } from "googleapis";
import type { Pool } from "pg";
import { loadGoogleCredentials } from "./credentials";
import { getGscPropertyUrl } from "./config";

const ROW_LIMIT = 25000;
const BATCH = 400;

function* dateRange(start: Date, end: Date) {
  const d = new Date(start);
  while (d <= end) {
    yield new Date(d);
    d.setUTCDate(d.getUTCDate() + 1);
  }
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

async function markSync(
  pool: Pool,
  source: string,
  ok: boolean,
  rows: number,
  error: string | null
) {
  await pool.query(
    `INSERT INTO seo_sync_state (source, last_run_at, last_success_at, last_error, rows_upserted, updated_at)
     VALUES ($1, now(), $2, $3, $4, now())
     ON CONFLICT (source) DO UPDATE SET
       last_run_at = now(),
       last_success_at = CASE WHEN $5 THEN now() ELSE seo_sync_state.last_success_at END,
       last_error = $3,
       rows_upserted = $4,
       updated_at = now()`,
    [source, ok ? new Date() : null, error, rows, ok]
  );
}

async function fetchRows(
  service: ReturnType<typeof google.searchconsole>,
  siteUrl: string,
  day: string,
  dimensions: string[]
) {
  const out: Array<{
    dimensions: Record<string, string>;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }> = [];
  let startRow = 0;
  while (true) {
    const resp = await service.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate: day,
        endDate: day,
        dimensions,
        rowLimit: ROW_LIMIT,
        startRow,
        dataState: "all",
      },
    });
    const rows = resp.data.rows ?? [];
    for (const r of rows) {
      const keys = r.keys ?? [];
      const dimMap: Record<string, string> = {};
      dimensions.forEach((d, i) => {
        dimMap[d] = keys[i] ?? "";
      });
      out.push({
        dimensions: dimMap,
        clicks: r.clicks ?? 0,
        impressions: r.impressions ?? 0,
        ctr: r.ctr ?? 0,
        position: r.position ?? 0,
      });
    }
    if (rows.length < ROW_LIMIT) break;
    startRow += ROW_LIMIT;
  }
  return out;
}

export async function syncGsc(
  pool: Pool,
  startDate: Date,
  endDate: Date,
  options: { pages?: boolean; queryPages?: boolean } = {}
): Promise<Record<string, unknown>> {
  const propertyUrl = getGscPropertyUrl();
  if (!propertyUrl) return { ok: false, error: "GSC_PROPERTY_URL not set" };

  const auth = loadGoogleCredentials();
  const service = google.searchconsole({ version: "v1", auth: auth as never });
  const syncPages = options.pages !== false;
  const syncQueryPages = options.queryPages !== false;

  let totalPage = 0;
  let totalQp = 0;
  const errors: string[] = [];

  for (const day of dateRange(startDate, endDate)) {
    const dayS = isoDate(day);
    if (syncPages) {
      try {
        const rows = await fetchRows(service, propertyUrl, dayS, ["page"]);
        for (let i = 0; i < rows.length; i += BATCH) {
          const batch = rows.slice(i, i + BATCH);
          for (const r of batch) {
            const page = r.dimensions.page ?? "";
            if (!page) continue;
            await pool.query(
              `INSERT INTO gsc_page_daily (property_url, date, page_url, clicks, impressions, ctr, position, country_code, device_type, updated_at)
               VALUES ($1, $2, $3, $4, $5, $6, $7, '', '', now())
               ON CONFLICT (property_url, date, page_url, country_code, device_type)
               DO UPDATE SET clicks = EXCLUDED.clicks, impressions = EXCLUDED.impressions, ctr = EXCLUDED.ctr, position = EXCLUDED.position, updated_at = now()`,
              [propertyUrl, dayS, page, r.clicks, r.impressions, r.ctr, r.position]
            );
            totalPage++;
          }
        }
      } catch (e) {
        errors.push(`page ${dayS}: ${String(e)}`);
      }
    }

    if (syncQueryPages) {
      try {
        const rows = await fetchRows(service, propertyUrl, dayS, ["query", "page"]);
        for (const r of rows) {
          const q = (r.dimensions.query ?? "").trim();
          const page = r.dimensions.page ?? "";
          if (!q || !page) continue;
          await pool.query(
            `INSERT INTO gsc_query_page_daily (property_url, date, query, page_url, clicks, impressions, ctr, position, country_code, device_type, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, '', '', now())
             ON CONFLICT (property_url, date, query, page_url, country_code, device_type)
             DO UPDATE SET clicks = EXCLUDED.clicks, impressions = EXCLUDED.impressions, ctr = EXCLUDED.ctr, position = EXCLUDED.position, updated_at = now()`,
            [propertyUrl, dayS, q.slice(0, 5000), page, r.clicks, r.impressions, r.ctr, r.position]
          );
          totalQp++;
        }
      } catch (e) {
        errors.push(`query_page ${dayS}: ${String(e)}`);
      }
    }
  }

  const ok = errors.length === 0;
  if (syncPages) await markSync(pool, "gsc_page_daily", ok, totalPage, errors.join("; ") || null);
  if (syncQueryPages)
    await markSync(pool, "gsc_query_page_daily", ok, totalQp, errors.join("; ") || null);

  return {
    ok,
    property_url: propertyUrl,
    rows_page: totalPage,
    rows_query_page: totalQp,
    errors,
  };
}
