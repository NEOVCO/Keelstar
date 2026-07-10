"use client";

import type { RiskFlag } from "@/lib/contracts-risk/constants";
import { StatusBadge } from "@/components/ui/badge";

export function RiskFlagsPanel({
  summary,
  flags,
  scanSource,
}: {
  summary?: string | null;
  flags: RiskFlag[];
  scanSource?: string | null;
}) {
  if (!flags.length && !summary) {
    return <p className="text-body-sm text-secondary">No risk flags yet. Upload and scan a contract.</p>;
  }

  return (
    <div className="space-y-4">
      {summary && (
        <div className="rounded-md bg-sunken/50 p-3 text-body-sm text-primary">
          <p className="font-medium">Summary</p>
          <p className="mt-1 text-secondary">{summary}</p>
          {scanSource && (
            <p className="mt-2 text-caption text-tertiary">Scan source: {scanSource.replace(/\+/g, " + ")}</p>
          )}
        </div>
      )}
      {flags.length > 0 && (
        <ul className="space-y-3">
          {flags.map((flag, i) => (
            <li key={i} className="rounded-md border border-border p-3 text-body-sm">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="font-medium text-primary">{flag.category.replace(/_/g, " ")}</span>
                <StatusBadge status={flag.severity} />
                <span className="text-caption text-tertiary">via {flag.source}</span>
              </div>
              <p className="text-secondary">{flag.excerpt}</p>
              <p className="mt-2 text-caption text-primary">{flag.recommendation}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
