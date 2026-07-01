"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const MONITORED = [
  "renewal_monitoring",
  "notice_window_open",
  "renewal_approaching",
  "auto_renew_risk",
  "active_monitoring",
  "expiring_soon",
  "expired",
];

export function ContractWorkflowActions({
  workflowId,
  status,
  canApprove,
}: {
  workflowId: string;
  status: string;
  canApprove: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [renewalDate, setRenewalDate] = useState("");
  const [showRenewForm, setShowRenewForm] = useState(false);

  async function action(name: string, body: Record<string, unknown> = {}) {
    setLoading(name);
    const res = await fetch(`/api/contracts/requests/${workflowId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: name, ...body }),
    });

    if (name === "export" && res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `contract-evidence-${workflowId}.csv`;
      a.click();
      setLoading(null);
      return;
    }

    if (!res.ok) {
      const data = await res.json();
      alert(data.error ?? "Action failed");
    }

    setLoading(null);
    setShowRenewForm(false);
    router.refresh();
  }

  if (!canApprove) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {["review_needed", "metadata_needed", "uploaded"].includes(status) && (
          <Button size="sm" disabled={!!loading} onClick={() => action("activate")}>
            Create renewal tracker
          </Button>
        )}
        {MONITORED.includes(status) && (
          <>
            <Button variant="secondary" size="sm" disabled={!!loading} onClick={() => action("export")}>
              Export evidence
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={!!loading}
              onClick={() => setShowRenewForm((v) => !v)}
            >
              Mark renewed
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={!!loading}
              onClick={() => action("mark_terminated")}
            >
              Mark terminated
            </Button>
            <Button variant="secondary" size="sm" disabled={!!loading} onClick={() => action("archive")}>
              Archive
            </Button>
          </>
        )}
        {["draft", "review_needed"].includes(status) && (
          <Button variant="ghost" size="sm" disabled={!!loading} onClick={() => action("cancel")}>
            Cancel
          </Button>
        )}
      </div>

      {showRenewForm && (
        <div className="flex flex-wrap items-end gap-2 rounded-md border border-border p-3">
          <div>
            <label className="mb-1 block text-caption text-secondary">New renewal date</label>
            <input
              type="date"
              className="rounded-md border border-border bg-surface px-3 py-2 text-body-sm"
              value={renewalDate}
              onChange={(e) => setRenewalDate(e.target.value)}
            />
          </div>
          <Button
            size="sm"
            disabled={!renewalDate || !!loading}
            onClick={() => action("mark_renewed", { newRenewalDate: renewalDate })}
          >
            Confirm renewal
          </Button>
        </div>
      )}
    </div>
  );
}
