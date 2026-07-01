import { readFileSync } from "fs";
import { resolve } from "path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function loadEnv() {
  const envPath = resolve(process.cwd(), ".env");
  try {
    const text = readFileSync(envPath, "utf8");
    for (const line of text.split("\n")) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m) process.env[m[1].trim()] = m[2].trim();
    }
  } catch {
    // .env optional when vars are already set
  }
}

export function createServiceSupabase(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export function testPdfBuffer(label = "e2e"): Buffer {
  return Buffer.from(`%PDF-1.4 ${label} test document\n`);
}

export async function getDemoOrg(supabase: SupabaseClient) {
  const { data: org } = await supabase
    .from("organizations")
    .select("id, name")
    .or("slug.eq.acme-operations,name.ilike.%acme%")
    .limit(1)
    .maybeSingle();
  return org;
}

export async function getAdminUser(supabase: SupabaseClient) {
  const { data: adminList } = await supabase.auth.admin.listUsers();
  return adminList.users.find((u) => u.email === "admin@keelstar.test");
}

export function fail(msg: string): never {
  console.error("FAIL:", msg);
  process.exit(1);
}
