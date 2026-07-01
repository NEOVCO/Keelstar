import { NextResponse } from "next/server";
import { getSeoPool } from "@/lib/seo-analytics/db";
import { getSeoStatus } from "@/lib/seo-analytics/overview";
import { requireSeoAdmin, SeoAdminError } from "@/lib/seo-analytics/platform-admin";

export async function GET() {
  try {
    await requireSeoAdmin();
    const pool = getSeoPool();
    const status = await getSeoStatus(pool);
    return NextResponse.json(status);
  } catch (e) {
    if (e instanceof SeoAdminError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
