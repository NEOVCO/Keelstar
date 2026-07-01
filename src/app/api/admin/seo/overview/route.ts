import { NextResponse } from "next/server";
import { getSeoPool } from "@/lib/seo-analytics/db";
import { getSeoOverview } from "@/lib/seo-analytics/overview";
import { requireSeoAdmin, SeoAdminError } from "@/lib/seo-analytics/platform-admin";

export async function GET(request: Request) {
  try {
    await requireSeoAdmin();
    const { searchParams } = new URL(request.url);
    const days = Number(searchParams.get("days") ?? "28");
    const pool = getSeoPool();
    const overview = await getSeoOverview(pool, days);
    return NextResponse.json(overview);
  } catch (e) {
    if (e instanceof SeoAdminError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
