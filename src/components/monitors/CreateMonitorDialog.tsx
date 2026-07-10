"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GENERIC_MONITOR_TYPES } from "@/lib/monitors/constants";

export function CreateMonitorDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [monitorType, setMonitorType] = useState<string>(GENERIC_MONITOR_TYPES[0].value);
  const [targetId, setTargetId] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const config: Record<string, unknown> = {};
      if (expirationDate) config.expirationDate = new Date(expirationDate).toISOString();

      const body: Record<string, unknown> = {
        name,
        monitorType,
        config,
      };

      if (targetId.trim()) {
        body.targetId = targetId.trim();
        body.targetType =
          monitorType === "document_expiration" ? "document" : "workflow_instance";
      }

      const res = await fetch("/api/monitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error ?? "Failed to create monitor");
      setOpen(false);
      setName("");
      setTargetId("");
      setExpirationDate("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create monitor");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return <Button onClick={() => setOpen(true)}>Create monitor</Button>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
      <div className="w-full max-w-md rounded-lg border border-border bg-surface p-6 shadow-lg">
        <h2 className="text-body font-medium text-primary">Create monitor</h2>
        <p className="mt-1 text-body-sm text-secondary">
          Set up a recurring rule to watch documents or workflow deadlines.
        </p>
        <form onSubmit={submit} className="mt-4 space-y-4">
          <div>
            <label className="text-caption text-secondary">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required className="mt-1" />
          </div>
          <div>
            <label className="text-caption text-secondary">Rule type</label>
            <select
              value={monitorType}
              onChange={(e) => setMonitorType(e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-body-sm"
            >
              {GENERIC_MONITOR_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-caption text-secondary">Target ID (optional)</label>
            <Input
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              placeholder="Workflow or document UUID"
              className="mt-1 font-mono text-caption"
            />
          </div>
          {monitorType === "document_expiration" && (
            <div>
              <label className="text-caption text-secondary">Expiration date</label>
              <Input
                type="date"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                className="mt-1"
              />
            </div>
          )}
          {error && <p className="text-body-sm text-error">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !name.trim()}>
              {loading ? "Creating…" : "Create monitor"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
