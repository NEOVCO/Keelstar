"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function MonitorRunNowButton({ monitorId }: { monitorId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function runNow() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/monitors/${monitorId}/run`, { method: "POST" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error ?? "Run failed");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not run monitor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button onClick={runNow} disabled={loading}>
        {loading ? "Running…" : "Run now"}
      </Button>
      {error && <p className="text-caption text-error">{error}</p>}
    </div>
  );
}
