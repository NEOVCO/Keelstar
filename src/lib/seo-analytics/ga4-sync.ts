import { google } from "googleapis";
import type { Pool } from "pg";
import { loadGoogleCredentials } from "./credentials";
import { getGa4PropertyId } from "./config";

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

async function markSync(pool: Pool, ok: boolean, rows: number, error: string | null) {
  await pool.query(
    `INSERT INTO seo_sync_state (source, last_run_at, last_success_at, last_error, rows_upserted, updated_at)
     VALUES ('ga4_landing_page_daily', now(), $1, $2, $3, now())
     ON CONFLICT (source) DO UPDATE SET
       last_run_at = now(),
       last_success_at = CASE WHEN $4 THEN now() ELSE seo_sync_state.last_success_at END,
       last_error = $2,
       rows_upserted = $3,
       updated_at = now()`,
    [ok ? new Date() : null, error, rows, ok]
  );
}

export async function syncGa4(pool: Pool, startDate: Date, endDate: Date) {
  const propertyId = getGa4PropertyId();
  if (!propertyId) return { ok: false, error: "GA4_PROPERTY_ID not set" };

  const auth = loadGoogleCredentials();
  const analytics = google.analyticsdata({ version: "v1beta", auth: auth as never });
  const property = `properties/${propertyId}`;

  let total = 0;
  const errors: string[] = [];

  for (const day of dateRange(startDate, endDate)) {
    const dayS = isoDate(day);
    try {
      let includeConversions = true;
      let offset = 0;
      const limit = 100000;

      while (true) {
        const metrics = [
          { name: "sessions" },
          { name: "totalUsers" },
          { name: "engagedSessions" },
          { name: "engagementRate" },
          { name: "bounceRate" },
        ];
        if (includeConversions) metrics.push({ name: "conversions" });

        let resp;
        try {
          resp = await analytics.properties.runReport({
            property,
            requestBody: {
              dateRanges: [{ startDate: dayS, endDate: dayS }],
              dimensions: [{ name: "landingPagePlusQueryString" }],
              metrics,
              limit: String(limit),
              offset: String(offset),
            },
          });
        } catch (e) {
          if (includeConversions && offset === 0) {
            includeConversions = false;
            continue;
          }
          throw e;
        }

        const rows = resp.data.rows ?? [];
        for (const row of rows) {
          const path = row.dimensionValues?.[0]?.value?.trim() ?? "";
          if (!path) continue;
          const m = row.metricValues ?? [];
          const sessions = Number(m[0]?.value ?? 0);
          const users = m[1]?.value != null ? Number(m[1].value) : null;
          const engaged = m[2]?.value != null ? Number(m[2].value) : null;
          const engRate = m[3]?.value != null ? Number(m[3].value) : null;
          const bounce = m[4]?.value != null ? Number(m[4].value) : null;
          const conv =
            includeConversions && m[5]?.value != null ? Number(m[5].value) : null;

          await pool.query(
            `INSERT INTO ga4_landing_page_daily (property_id, date, landing_page, sessions, users, engaged_sessions, engagement_rate, bounce_rate, conversions, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, now())
             ON CONFLICT (property_id, date, landing_page)
             DO UPDATE SET sessions = EXCLUDED.sessions, users = EXCLUDED.users, engaged_sessions = EXCLUDED.engaged_sessions,
               engagement_rate = EXCLUDED.engagement_rate, bounce_rate = EXCLUDED.bounce_rate, conversions = EXCLUDED.conversions, updated_at = now()`,
            [propertyId, dayS, path.slice(0, 8000), sessions, users, engaged, engRate, bounce, conv]
          );
          total++;
        }

        if (rows.length < limit) break;
        offset += limit;
      }
    } catch (e) {
      errors.push(`${dayS}: ${String(e)}`);
    }
  }

  const ok = errors.length === 0;
  await markSync(pool, ok, total, errors.join("; ") || null);
  return { ok, property_id: propertyId, rows: total, errors };
}
