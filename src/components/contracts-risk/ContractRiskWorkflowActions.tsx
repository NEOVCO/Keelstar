"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function ContractRiskWorkflowActions({
  workflowId,
  status,
  canApprove,
  canScan,
  hasDocument,
}: {
  workflowId: string;
  status: string;
  canApprove: boolean;
  canScan: boolean;
  hasDocument: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showReject, setShowReject] = useState(false);

  async function action(name: string, body: Record<string, unknown> = {}) {
    setLoading(name);
    const res = await fetch(`/api/contracts-risk/scans/${workflowId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: name, ...body }),
    });

    if (name === "export" && res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `contract-risk-evidence-${workflowId}.csv`;
      a.click();
      setLoading(null);
      return;
    }

    if (!res.ok) {
      const data = await res.json();
      alert(data.error ?? "Action failed");
    }

    setLoading(null);
    setShowReject(false);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {canScan && hasDocument && ["uploaded", "draft"].includes(status) && (
          <Button size="sm" disabled={!!loading} onClick={() => action("scan")}>
            Run risk scan
          </Button>
        )}
        {canApprove && status === "review_needed" && (
          <>
            <Button size="sm" disabled={!!loading} onClick={() => action("approve")}>
              Approve review
            </Button>
            <Button variant="secondary" size="sm" disabled={!!loading} onClick={() => setShowReject(true)}>
              Reject / renegotiate
            </Button>
          </>
        )}
        {["approved", "rejected", "review_needed"].includes(status) && (
          <Button variant="secondary" size="sm" disabled={!!loading} onClick={() => action("export")}>
            Export evidence
          </Button>
        )}
        {!["approved", "cancelled"].includes(status) && canScan && (
          <Button variant="ghost" size="sm" disabled={!!loading} onClick={() => action("cancel")}>
            Cancel
          </Button>
        )}
      </div>

      {showReject && (
        <div className="space-y-2 border-t border-border pt-3">
          <textarea
            className="w-full rounded-md border border-border bg-surface p-2 text-body-sm"
            placeholder="Reason for rejection or renegotiation"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={3}
          />
          <Button
            size="sm"
            disabled={!rejectReason.trim() || !!loading}
            onClick={() => action("reject", { reason: rejectReason })}
          >
            Confirm rejection
          </Button>
        </div>
      )}
    </div>
  );
}
