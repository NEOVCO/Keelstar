"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function EvidenceExportPanel({
  workflowId,
  exportPath,
}: {
  workflowId?: string;
  exportPath?: string;
}) {
  const [loading, setLoading] = useState(false);
  const apiPath = exportPath ?? (workflowId ? `/api/w9/requests/${workflowId}` : undefined);

  async function handleExport() {
    if (!apiPath) return;
    setLoading(true);
    const res = await fetch(apiPath, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "export" }),
    });
    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `evidence-${workflowId}.csv`;
      a.click();
    }
    setLoading(false);
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <p className="text-body-sm font-medium text-primary">Export evidence</p>
      <p className="mt-1 text-caption text-secondary">
        Download a CSV packet with workflow summary, documents, and audit events.
      </p>
      {workflowId && apiPath && (
        <Button variant="secondary" size="sm" className="mt-3" disabled={loading} onClick={handleExport}>
          {loading ? "Exporting…" : "Export CSV"}
        </Button>
      )}
    </div>
  );
}
