"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { buildSearchIndex, type SearchItem } from "@/lib/search";

const samplePrompts = ["collect w-9s", "track coi expirations", "contract notice period", "route invoice approvals"];

export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const index = useMemo(() => buildSearchIndex(), []);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return index
      .filter((it) => it.title.toLowerCase().includes(term) || it.desc?.toLowerCase().includes(term))
      .slice(0, 12);
  }, [q, index]);

  useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((a) => Math.min(a + 1, results.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
      }
      if (e.key === "Enter" && results[active]) {
        onClose();
        router.push(results[active].href);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, results, active, onClose, router]);

  if (!open) return null;

  const grouped = results.reduce<Record<string, SearchItem[]>>((acc, it) => {
    (acc[it.type] ||= []).push(it);
    return acc;
  }, {});

  let runningIndex = -1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Site search"
    >
      <button aria-label="Close search" className="absolute inset-0 bg-[rgba(20,23,26,0.4)]" onClick={onClose} />
      <div className="relative w-full max-w-[640px] overflow-hidden rounded-lg border border-border bg-surface shadow-md">
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="h-4 w-4 text-tertiary" aria-hidden />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setActive(0);
            }}
            placeholder="Search products, workflows, tools, guides…"
            className="h-12 w-full bg-transparent text-body outline-none placeholder:text-tertiary"
            aria-label="Search"
          />
          <button onClick={onClose} aria-label="Close" className="text-tertiary hover:text-primary">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[50vh] overflow-y-auto p-2">
          {!q && (
            <div className="px-3 py-3">
              <p className="mb-2 text-caption uppercase tracking-wide text-tertiary">Try</p>
              <div className="flex flex-wrap gap-2">
                {samplePrompts.map((s) => (
                  <button
                    key={s}
                    onClick={() => setQ(s)}
                    className="rounded-sm border border-border bg-sunken px-2.5 py-1 font-mono text-caption text-secondary hover:border-border-strong"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {q && results.length === 0 && (
            <p className="px-3 py-6 text-body-sm text-secondary">No results for “{q}”.</p>
          )}

          {Object.entries(grouped).map(([type, items]) => (
            <div key={type} className="mb-1">
              <p className="px-3 py-1.5 text-caption uppercase tracking-wide text-tertiary">{type}</p>
              {items.map((it) => {
                runningIndex += 1;
                const idx = runningIndex;
                return (
                  <button
                    key={it.href}
                    onMouseEnter={() => setActive(idx)}
                    onClick={() => {
                      onClose();
                      router.push(it.href);
                    }}
                    className={`flex w-full items-center justify-between gap-3 rounded-sm px-3 py-2 text-left ${
                      active === idx ? "bg-accent-subtle" : ""
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-body-sm font-medium text-primary">{it.title}</span>
                      {it.desc && <span className="block truncate text-caption text-secondary">{it.desc}</span>}
                    </span>
                    <span className="shrink-0 rounded-sm border border-border bg-sunken px-1.5 py-0.5 text-caption text-tertiary">
                      {it.type}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
