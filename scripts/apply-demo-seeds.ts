/**
 * Apply demo seed SQL files to remote Supabase via DATABASE_URL.
 * Usage: npx tsx scripts/apply-demo-seeds.ts
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

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL not set in .env");
  process.exit(1);
}

const seedFiles = [
  "supabase/seed/demo_org.sql",
  "supabase/seed/w9_demo.sql",
  "supabase/seed/coi_demo.sql",
  "supabase/seed/contracts_demo.sql",
];

async function main() {
  const { default: pg } = await import("pg");
  const client = new pg.Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();

  const orgId = "a0000000-0000-4000-8000-000000000001";

  console.log("Preparing org for demo data and E2E...");
  await client.query(`
    INSERT INTO organization_entitlements (organization_id, product_id, is_enabled, source)
    SELECT $1::uuid, id, true, 'trial' FROM products
    ON CONFLICT (organization_id, product_id) DO UPDATE SET is_enabled = true, source = 'trial';
  `, [orgId]);

  await client.query(`DELETE FROM usage_tracking WHERE organization_id = $1`, [orgId]);
  await client.query(
    `UPDATE vendors SET status = 'archived' WHERE organization_id = $1 AND name LIKE 'E2E %'`,
    [orgId]
  );

  for (const file of seedFiles) {
    const sql = readFileSync(resolve(process.cwd(), file), "utf8");
    console.log(`Applying ${file}...`);
    await client.query(sql);
  }

  const { rows } = await client.query(
    `SELECT
      (SELECT COUNT(*) FROM vendors WHERE organization_id = $1 AND status != 'archived') AS vendors,
      (SELECT COUNT(*) FROM workflow_instances WHERE organization_id = $1) AS workflows,
      (SELECT COUNT(*) FROM organization_entitlements WHERE organization_id = $1 AND is_enabled) AS entitlements`,
    [orgId]
  );

  console.log("Demo seed applied:", rows[0]);
  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
