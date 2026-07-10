"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { MOCK_DOCUMENTS, MOCK_VENDORS, MOCK_WORKFLOWS } from "@/lib/mock-data";
import { DIRECTORY } from "@/lib/terminology/directory";

export function CommandMenu({
  open: controlledOpen,
  onClose,
}: {
  open?: boolean;
  onClose?: () => void;
} = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const close = () => {
    setInternalOpen(false);
    onClose?.();
  };
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setInternalOpen(true);
      }
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!open) return null;

  const q = query.toLowerCase();
  const results = [
    ...MOCK_WORKFLOWS.filter((w) => w.title.toLowerCase().includes(q)).map((w) => ({
      label: w.title,
      href: `/app/workflows/${w.id}`,
      type: "Workflow",
    })),
    ...MOCK_DOCUMENTS.filter((d) => d.name.toLowerCase().includes(q)).map((d) => ({
      label: d.name,
      href: `/app/documents/${d.id}`,
      type: "Document",
    })),
    ...MOCK_VENDORS.filter((v) => v.name.toLowerCase().includes(q)).map((v) => ({
      label: v.name,
      href: `/app/vendors/${v.id}`,
      type: DIRECTORY.commandType,
    })),
  ].slice(0, 8);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-ink/40 px-4 pt-[15vh]">
      <div className="w-full max-w-lg rounded-lg border border-border bg-surface shadow-md">
        <div className="flex items-center gap-2 border-b border-border px-3">
          <Search className="h-4 w-4 text-tertiary" />
          <input
            autoFocus
            className="flex-1 bg-transparent py-3 text-body-sm outline-none"
            placeholder={DIRECTORY.searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <ul className="max-h-64 overflow-y-auto py-2">
          {results.length === 0 ? (
            <li className="px-4 py-3 text-body-sm text-secondary">No results</li>
          ) : (
            results.map((r) => (
              <li key={r.href}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-4 py-2 text-left hover:bg-sunken"
                  onClick={() => {
                    close();
                    router.push(r.href);
                  }}
                >
                  <span className="text-body-sm text-primary">{r.label}</span>
                  <span className="text-caption text-tertiary">{r.type}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
      <button type="button" className="absolute inset-0 -z-10" onClick={close} aria-label="Close" />
    </div>
  );
}
