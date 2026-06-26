"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { buildSearchIndex, type SearchItem } from "@/lib/search";

export function SearchResults() {
  const index = useMemo(() => buildSearchIndex(), []);
  const [q, setQ] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initial = params.get("q");
    if (initial) setQ(initial);
  }, []);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return index.filter((it) => it.title.toLowerCase().includes(term) || it.desc?.toLowerCase().includes(term)).slice(0, 40);
  }, [q, index]);

  const grouped = results.reduce<Record<string, SearchItem[]>>((acc, it) => {
    (acc[it.type] ||= []).push(it);
    return acc;
  }, {});

  return (
    <div>
      <div className="flex items-center gap-3 rounded-md border border-border-strong bg-surface px-4 focus-within:border-accent">
        <Search className="h-5 w-5 text-tertiary" aria-hidden />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoFocus
          placeholder="Search products, workflows, tools, guides…"
          aria-label="Search"
          className="h-12 w-full bg-transparent outline-none placeholder:text-tertiary"
        />
      </div>

      {q && results.length === 0 && <p className="mt-8 text-body-sm text-secondary">No results for “{q}”.</p>}

      <div className="mt-8 space-y-8">
        {Object.entries(grouped).map(([type, items]) => (
          <div key={type}>
            <p className="mb-2 text-caption font-semibold uppercase tracking-wide text-tertiary">{type}</p>
            <ul className="divide-y divide-border border-y border-border">
              {items.map((it) => (
                <li key={it.href}>
                  <Link href={it.href} className="flex items-baseline justify-between gap-3 py-3">
                    <span className="min-w-0">
                      <span className="block text-body-sm font-medium text-primary">{it.title}</span>
                      {it.desc && <span className="block truncate text-caption text-secondary">{it.desc}</span>}
                    </span>
                    <span className="shrink-0 rounded-sm border border-border bg-sunken px-1.5 py-0.5 text-caption text-tertiary">{it.type}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
