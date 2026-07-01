import { NextResponse } from "next/server";
import { getSeoPool } from "@/lib/seo-analytics/db";
import { syncGsc } from "@/lib/seo-analytics/gsc-sync";
import { requireSeoAdmin, SeoAdminError } from "@/lib/seo-analytics/platform-admin";

export async function POST(request: Request) {
  try {
    await requireSeoAdmin();
    const { searchParams } = new URL(request.url);
    const days = Math.min(120, Math.max(1, Number(searchParams.get("days") ?? "15")));
    const end = new Date();
    const start = new Date();
    start.setUTCDate(end.getUTCDate() - (days - 1));
    const pool = getSeoPool();
    const result = await syncGsc(pool, start, end);
    return NextResponse.json(result);
  } catch (e) {
    if (e instanceof SeoAdminError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
