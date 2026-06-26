"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
import { buildSearchIndex } from "@/lib/search";

const prompts = ["collect w-9s", "track coi expirations", "contract notice period", "route invoice approvals"];

export function HeroSearch() {
  const router = useRouter();
  const index = useMemo(() => buildSearchIndex(), []);
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return index
      .filter((it) => it.title.toLowerCase().includes(term) || it.desc?.toLowerCase().includes(term))
      .slice(0, 6);
  }, [q, index]);

  function go() {
    if (results[0]) router.push(results[0].href);
    else router.push("/tools/");
  }

  return (
    <div className="relative max-w-xl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          go();
        }}
        className="flex items-center gap-2 rounded-md border border-border-strong bg-accent-subtle p-2 focus-within:border-accent"
      >
        <Search className="ml-2 h-5 w-5 text-secondary" aria-hidden />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="What do you need to handle?"
          aria-label="Describe what you need to do"
          className="h-9 w-full bg-transparent text-body outline-none placeholder:text-tertiary"
        />
        <button
          type="submit"
          className="inline-flex h-9 items-center gap-1.5 rounded-sm bg-accent px-3 text-body-sm font-semibold text-white hover:bg-accent-hover"
        >
          Go <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      {focused && results.length > 0 && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-md border border-border bg-surface shadow-md">
          {results.map((r) => (
            <button
              key={r.href}
              onMouseDown={() => router.push(r.href)}
              className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left hover:bg-accent-subtle"
            >
              <span className="truncate text-body-sm font-medium text-primary">{r.title}</span>
              <span className="shrink-0 rounded-sm border border-border bg-sunken px-1.5 py-0.5 text-caption text-tertiary">
                {r.type}
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-caption text-tertiary">Try:</span>
        {prompts.map((p) => (
          <button
            key={p}
            onClick={() => setQ(p)}
            className="rounded-sm border border-border bg-surface px-2.5 py-1 font-mono text-caption text-secondary hover:border-border-strong"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
