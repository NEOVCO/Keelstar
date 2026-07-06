"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BULK_IMPORT_CSV_HEADERS } from "@/lib/exclusions/bulkImportCsv";

const SAMPLE_CSV = `${BULK_IMPORT_CSV_HEADERS}
employee,Jane Smith,Jane,Smith,,,
vendor,Acme Medical LLC,,,,,Acme Medical LLC
person,John Doe,John,Doe,,1234567893,`;

export function BulkImportSubjectsForm({ vendorCount }: { vendorCount: number }) {
  const router = useRouter();
  const [csv, setCsv] = useState("");
  const [runScreening, setRunScreening] = useState(true);
  const [createMonitor, setCreateMonitor] = useState(true);
  const [includeSam, setIncludeSam] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);

  async function runImport(payload: Record<string, unknown>) {
    setLoading("import");
    setError(null);
    setSummary(null);
    const res = await fetch("/api/exclusions/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        runScreening,
        createMonthlyMonitor: createMonitor,
        sources: includeSam ? ["oig", "sam"] : ["oig"],
      }),
    });
    const json = await res.json();
    setLoading(null);
    if (!res.ok) {
      setError(json.error ?? "Import failed");
      return;
    }
    const d = json.data as {
      imported: number;
      skipped: number;
      screened: number;
      matches: number;
      errors: string[];
    };
    setSummary(
      `Imported ${d.imported}, skipped ${d.skipped} duplicates` +
        (runScreening ? `, screened ${d.screened}, ${d.matches} potential match(es)` : "") +
        (d.errors.length ? `. ${d.errors.length} warning(s).` : ".")
    );
    if (d.errors.length) setError(d.errors.slice(0, 3).join(" · "));
    router.refresh();
  }

  return (
    <div className="space-y-4 rounded-lg border border-border bg-surface p-6">
      <p className="text-caption text-secondary">
        Bulk-add vendors and employees to your screening roster. Subjects stay in your workspace for
        re-checks and monthly monitors. Paste CSV or import all active vendors.
      </p>

      {error && <p className="text-body-sm text-error">{error}</p>}
      {summary && <p className="text-body-sm text-success">{summary}</p>}

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={!!loading || vendorCount === 0}
          onClick={() => runImport({ importExistingVendors: true })}
        >
          {loading === "import" ? "Working…" : `Import ${vendorCount} vendor(s)`}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setCsv(SAMPLE_CSV)}
        >
          Load sample CSV
        </Button>
      </div>

      <div>
        <label className="mb-1 block text-caption font-medium text-secondary">CSV paste</label>
        <textarea
          value={csv}
          onChange={(e) => setCsv(e.target.value)}
          rows={6}
          placeholder={BULK_IMPORT_CSV_HEADERS}
          className="w-full rounded-md border border-border-strong bg-bg px-3 py-2 font-mono text-caption"
        />
        <p className="mt-1 text-caption text-tertiary">
          Columns: {BULK_IMPORT_CSV_HEADERS}. Max 200 rows per import.
        </p>
      </div>

      <label className="flex items-center gap-2 text-body-sm text-secondary">
        <input type="checkbox" checked={runScreening} onChange={(e) => setRunScreening(e.target.checked)} />
        Run OIG screen immediately after import
      </label>
      <label className="flex items-center gap-2 text-body-sm text-secondary">
        <input type="checkbox" checked={createMonitor} onChange={(e) => setCreateMonitor(e.target.checked)} />
        Create monthly monitor for each new subject
      </label>
      <label className="flex items-center gap-2 text-body-sm text-secondary">
        <input type="checkbox" checked={includeSam} onChange={(e) => setIncludeSam(e.target.checked)} />
        Include SAM (if configured)
      </label>

      <Button
        type="button"
        disabled={!!loading || !csv.trim()}
        onClick={() => runImport({ csv })}
      >
        {loading === "import" ? "Importing…" : "Import CSV"}
      </Button>
    </div>
  );
}
