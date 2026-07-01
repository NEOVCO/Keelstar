"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function WorkflowReviewActions({
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
  const [rejectReason, setRejectReason] = useState("");
  const [showReject, setShowReject] = useState(false);

  async function action(name: string, body: Record<string, unknown> = {}) {
    setLoading(name);
    const res = await fetch(`/api/w9/requests/${workflowId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: name, ...body }),
    });

    if (name === "export" && res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `w9-evidence-${workflowId}.csv`;
      a.click();
      setLoading(null);
      return;
    }

    setLoading(null);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-2">
      {["sent", "opened", "needs_correction", "overdue"].includes(status) && (
        <>
          <Button
            variant="secondary"
            size="sm"
            disabled={!!loading}
            onClick={() => action("resend")}
          >
            Resend request
          </Button>
          <Button
            variant="secondary"
            size="sm"
            disabled={!!loading}
            onClick={() => action("revoke")}
          >
            Revoke link
          </Button>
        </>
      )}
      {["submitted", "review_needed"].includes(status) && canApprove && (
        <>
          <Button size="sm" disabled={!!loading} onClick={() => action("approve")}>
            Approve W-9
          </Button>
          <Button
            variant="secondary"
            size="sm"
            disabled={!!loading}
            onClick={() => setShowReject(!showReject)}
          >
            Request correction
          </Button>
        </>
      )}
      {["completed", "approved"].includes(status) && canApprove && (
        <Button
          variant="secondary"
          size="sm"
          disabled={!!loading}
          onClick={() => action("export")}
        >
          Export evidence
        </Button>
      )}
      {showReject && (
        <div className="w-full space-y-2 border-t border-border pt-4">
          <textarea
            className="w-full rounded-md border border-border bg-surface p-2 text-body-sm"
            placeholder="Reason for correction (required)"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={3}
          />
          <Button
            size="sm"
            disabled={!rejectReason || !!loading}
            onClick={() => action("reject", { reason: rejectReason, resendLink: true })}
          >
            Send correction request
          </Button>
        </div>
      )}
    </div>
  );
}
