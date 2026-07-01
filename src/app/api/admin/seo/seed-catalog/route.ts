import { NextResponse } from "next/server";
import { getSeoPool } from "@/lib/seo-analytics/db";
import { seedSeoPageCatalog } from "@/lib/seo-analytics/seed-catalog";
import { requireSeoAdmin, SeoAdminError } from "@/lib/seo-analytics/platform-admin";

export async function POST() {
  try {
    await requireSeoAdmin();
    const pool = getSeoPool();
    const result = await seedSeoPageCatalog(pool);
    return NextResponse.json(result);
  } catch (e) {
    if (e instanceof SeoAdminError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
