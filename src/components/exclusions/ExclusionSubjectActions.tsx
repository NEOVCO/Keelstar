"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function ExclusionSubjectActions({ subjectId }: { subjectId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function createMonitor() {
    setLoading("monitor");
    await fetch(`/api/exclusions/subjects/${subjectId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create_monitor" }),
    });
    setLoading(null);
    router.refresh();
  }

  async function exportEvidence() {
    setLoading("export");
    const res = await fetch(`/api/exclusions/subjects/${subjectId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "export" }),
    });
    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `exclusion-evidence-${subjectId}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
    setLoading(null);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="secondary" disabled={!!loading} onClick={createMonitor}>
        {loading === "monitor" ? "Creating…" : "Monitor monthly"}
      </Button>
      <Button variant="secondary" disabled={!!loading} onClick={exportEvidence}>
        {loading === "export" ? "Exporting…" : "Export evidence"}
      </Button>
    </div>
  );
}
