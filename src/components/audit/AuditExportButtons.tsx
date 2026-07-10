"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

async function downloadExport(href: string, fallbackFilename: string) {
  const res = await fetch(href);
  if (!res.ok) {
    const json = await res.json().catch(() => null);
    throw new Error(json?.error ?? "Export failed");
  }
  const blob = await res.blob();
  const disposition = res.headers.get("Content-Disposition");
  const match = disposition?.match(/filename="([^"]+)"/);
  const filename = match?.[1] ?? fallbackFilename;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function AuditExportButtons() {
  const [loading, setLoading] = useState<"pdf" | "csv" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function exportPdf() {
    setLoading("pdf");
    setError(null);
    try {
      await downloadExport("/api/reports/audit-pdf", "audit-trail.pdf");
    } catch (e) {
      setError(e instanceof Error ? e.message : "PDF export failed");
    } finally {
      setLoading(null);
    }
  }

  async function exportCsv() {
    setLoading("csv");
    setError(null);
    try {
      await downloadExport("/api/reports/audit-export", "audit-export.csv");
    } catch (e) {
      setError(e instanceof Error ? e.message : "CSV export failed");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={!!loading}
          onClick={exportPdf}
        >
          {loading === "pdf" ? "Generating…" : "Download PDF"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          disabled={!!loading}
          onClick={exportCsv}
        >
          {loading === "csv" ? "Exporting…" : "CSV"}
        </Button>
      </div>
      {error && <p className="text-caption text-error">{error}</p>}
    </div>
  );
}
