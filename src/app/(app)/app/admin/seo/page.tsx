"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { isSeoAdminUiEnabled } from "@/lib/seo-analytics/seoAdminEnabled";

export default function SeoAdminPage() {
  const [overview, setOverview] = useState<Record<string, unknown> | null>(null);
  const [status, setStatus] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isSeoAdminUiEnabled()) {
    return (
      <div className="mx-auto max-w-lg p-8">
        <h1 className="text-h3 text-primary">SEO analytics (disabled)</h1>
        <p className="mt-2 text-body-sm text-secondary">
          Set NEXT_PUBLIC_ENABLE_SEO_ADMIN=true and ENABLE_SEO_ANALYTICS=true in .env
        </p>
      </div>
    );
  }

  async function load() {
    const [ov, st] = await Promise.all([
      fetch("/api/admin/seo/overview").then((r) => r.json()),
      fetch("/api/admin/seo/status").then((r) => r.json()),
    ]);
    if (ov.error) setError(String(ov.error));
    else setOverview(ov);
    if (!st.error) setStatus(st);
  }

  useEffect(() => {
    load();
  }, []);

  async function run(path: string, label: string) {
    setLoading(label);
    const res = await fetch(path, { method: "POST" });
    const json = await res.json();
    setLoading(null);
    if (!res.ok) setError(String(json.error ?? "Failed"));
    else await load();
  }

  const totals = overview?.totals as { impressions?: number; clicks?: number; ctr?: number } | undefined;
  const topPages = (overview?.top_pages as Array<Record<string, unknown>>) ?? [];

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-8">
      <Link href="/app" className="text-caption text-secondary hover:text-accent">← App</Link>
      <h1 className="text-h2 text-primary">SEO control tower</h1>
      {error && <p className="text-body-sm text-error">{error}</p>}
      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={!!loading} onClick={() => run("/api/admin/seo/sync/gsc?days=15", "gsc")} className="rounded-md bg-accent px-3 py-2 text-body-sm text-white">Sync GSC</button>
        <button type="button" disabled={!!loading} onClick={() => run("/api/admin/seo/sync/ga4?days=15", "ga4")} className="rounded-md border border-border px-3 py-2 text-body-sm">Sync GA4</button>
        <button type="button" disabled={!!loading} onClick={() => run("/api/admin/seo/seed-catalog", "seed")} className="rounded-md border border-border px-3 py-2 text-body-sm">Seed catalog</button>
      </div>
      {status && <pre className="overflow-auto rounded-md bg-sunken/50 p-3 text-caption">{JSON.stringify(status, null, 2)}</pre>}
      {totals && (
        <p className="text-body-sm text-primary">
          28d: {totals.impressions?.toLocaleString()} impressions · {totals.clicks?.toLocaleString()} clicks · {((totals.ctr ?? 0) * 100).toFixed(2)}% CTR
        </p>
      )}
      <ul className="space-y-1 text-body-sm">
        {topPages.slice(0, 15).map((p) => (
          <li key={String(p.page_url)} className="truncate">{String(p.page_url)} — {String(p.impressions)} impr.</li>
        ))}
      </ul>
    </div>
  );
}
