"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, FileSpreadsheet, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UsageLimitAlert } from "@/components/billing/UsageLimitAlert";
import {
  parseVendorImportCsv,
  VENDOR_IMPORT_CSV_HEADERS,
  VENDOR_IMPORT_MAX_ROWS,
  type ParsedVendorImportRow,
} from "@/lib/vendors/importCsv";
import { VENDOR_RECORD_TYPE_LABELS } from "@/lib/vendors/types";
import { DIRECTORY } from "@/lib/terminology/directory";
import { cn } from "@/lib/utils/cn";

export function VendorImportPanel() {
  const router = useRouter();
  const [csvText, setCsvText] = useState("");
  const [registerForScreening, setRegisterForScreening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [limitError, setLimitError] = useState("");

  const parsed = useMemo(() => parseVendorImportCsv(csvText), [csvText]);
  const validRows = parsed.filter((row): row is ParsedVendorImportRow & { data: NonNullable<ParsedVendorImportRow["data"]> } => !!row.data);
  const invalidRows = parsed.filter((row) => row.error);

  async function handleFile(file: File) {
    setError("");
    const text = await file.text();
    setCsvText(text);
  }

  async function handleImport() {
    if (!validRows.length) return;
    setLoading(true);
    setError("");
    setLimitError("");

    const res = await fetch("/api/vendors/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vendors: validRows.map((row) => row.data),
        registerForScreening,
      }),
    });
    const data = await res.json();
    setLoading(false);

    if (!data.success) {
      if (res.status === 402) setLimitError(data.error ?? "Usage limit reached");
      else setError(data.error ?? "Import failed");
      return;
    }

    router.push("/app/vendors");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <a
          href="/api/vendors/import/template"
          className="flex items-start gap-3 rounded-lg border border-border bg-surface p-4 transition-colors hover:border-accent/40 hover:bg-accent-subtle/40"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent-subtle text-accent">
            <Download className="h-4 w-4" aria-hidden />
          </span>
          <span>
            <span className="block text-body-sm font-medium text-primary">Download template</span>
            <span className="mt-0.5 block text-caption text-secondary">
              CSV with columns: {VENDOR_IMPORT_CSV_HEADERS.replace(/,/g, ", ")}
            </span>
          </span>
        </a>

        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-dashed border-border bg-sunken/40 p-4 transition-colors hover:border-accent/40 hover:bg-accent-subtle/30">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-surface text-accent">
            <Upload className="h-4 w-4" aria-hidden />
          </span>
          <span>
            <span className="block text-body-sm font-medium text-primary">Upload spreadsheet</span>
            <span className="mt-0.5 block text-caption text-secondary">.csv up to {VENDOR_IMPORT_MAX_ROWS} rows</span>
          </span>
          <input
            type="file"
            accept=".csv,text/csv"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
            }}
          />
        </label>
      </div>

      <div>
        <label htmlFor="vendor-csv" className="mb-2 flex items-center gap-2 text-body-sm font-medium text-primary">
          <FileSpreadsheet className="h-4 w-4 text-secondary" aria-hidden />
          Or paste CSV rows
        </label>
        <textarea
          id="vendor-csv"
          value={csvText}
          onChange={(e) => setCsvText(e.target.value)}
          placeholder={`${VENDOR_IMPORT_CSV_HEADERS}\nAcme Supplies LLC,company,billing@acme.example,(555) 555-0100,,,\nSunrise Retail LLC,tenant,leasing@sunrise.example,,,,\nJane Smith,individual,jane@example.com,,Jane,Smith,1234567893`}
          rows={8}
          className="w-full rounded-md border border-border bg-surface px-3 py-2 font-mono text-caption text-primary shadow-sm placeholder:text-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        />
        <p className="mt-1.5 text-caption text-tertiary">
          Set <code className="text-secondary">type</code> to <code className="text-secondary">tenant</code>,{" "}
          <code className="text-secondary">individual</code>, <code className="text-secondary">contractor</code>, or{" "}
          <code className="text-secondary">employee</code>. Use <code className="text-secondary">first_name</code>,{" "}
          <code className="text-secondary">last_name</code>, and <code className="text-secondary">npi</code> for OIG
          screening. Omit <code className="text-secondary">type</code> to default to company.
        </p>
      </div>

      {parsed.length > 0 && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3 text-body-sm">
            <span className="font-medium text-primary">{validRows.length} ready to import</span>
            {invalidRows.length > 0 && (
              <span className="text-warning">{invalidRows.length} with errors (will be skipped)</span>
            )}
          </div>

          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[36rem] text-left text-caption">
              <thead className="bg-sunken text-secondary">
                <tr>
                  <th className="px-3 py-2 font-medium">Row</th>
                  <th className="px-3 py-2 font-medium">Type</th>
                  <th className="px-3 py-2 font-medium">Name</th>
                  <th className="px-3 py-2 font-medium">Email</th>
                  <th className="px-3 py-2 font-medium">NPI</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {parsed.map((row) => (
                  <tr key={row.rowNumber} className="border-t border-border">
                    <td className="px-3 py-2 text-tertiary">{row.rowNumber}</td>
                    <td className="px-3 py-2">
                      {row.data?.recordType ? VENDOR_RECORD_TYPE_LABELS[row.data.recordType] : "—"}
                    </td>
                    <td className="px-3 py-2">{row.data?.name ?? "—"}</td>
                    <td className="px-3 py-2">{row.data?.email || "—"}</td>
                    <td className="px-3 py-2">{row.data?.npi || "—"}</td>
                    <td className={cn("px-3 py-2", row.error ? "text-error" : "text-success")}>
                      {row.error ?? "Ready"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <label className="flex cursor-pointer items-start gap-2.5 text-body-sm text-secondary">
        <input
          type="checkbox"
          className="mt-0.5"
          checked={registerForScreening}
          onChange={(e) => setRegisterForScreening(e.target.checked)}
        />
        <span>
          Also add imported entries to OIG screening roster
          <span className="mt-0.5 block text-caption text-tertiary">
            Links each row to a screening subject for exclusions monitoring.
          </span>
        </span>
      </label>

      {limitError && <UsageLimitAlert message={limitError} />}
      {error && <p className="text-body-sm text-error">{error}</p>}

      <Button type="button" disabled={loading || validRows.length === 0} onClick={() => void handleImport()}>
        {loading
          ? "Importing…"
          : validRows.length > 0
            ? DIRECTORY.importCount(validRows.length)
            : DIRECTORY.importAction}
      </Button>
    </div>
  );
}
