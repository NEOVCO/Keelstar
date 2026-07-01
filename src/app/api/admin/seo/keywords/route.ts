import { NextResponse } from "next/server";
import { getKeywordSearchVolume } from "@/lib/seo-analytics/dataforseo";
import { requireSeoAdmin, SeoAdminError } from "@/lib/seo-analytics/platform-admin";

export async function POST(request: Request) {
  try {
    await requireSeoAdmin();
    const body = await request.json();
    const keywords = (body.keywords as string[]) ?? [];
    if (!keywords.length) {
      return NextResponse.json({ error: "keywords array required" }, { status: 400 });
    }
    const result = await getKeywordSearchVolume(keywords.slice(0, 50));
    return NextResponse.json(result);
  } catch (e) {
    if (e instanceof SeoAdminError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
