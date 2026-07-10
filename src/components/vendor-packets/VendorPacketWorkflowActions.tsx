"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CcSenderOption } from "@/components/email/CcSenderOption";

export function VendorPacketWorkflowActions({
  workflowId,
  status,
  canSend,
  canApprove,
  senderEmail,
}: {
  workflowId: string;
  status: string;
  canSend: boolean;
  canApprove: boolean;
  senderEmail?: string | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [ccMe, setCcMe] = useState(false);

  async function action(name: string) {
    setLoading(name);
    setError("");

    try {
      const res = await fetch(`/api/vendor-packets/requests/${workflowId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: name, ccMe: ccMe || undefined }),
      });

      if (name === "export" && res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `vendor-packet-evidence-${workflowId}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false) {
        setError(data.error ?? "Action failed");
        return;
      }

      router.refresh();
    } catch {
      setError("Could not reach the server. Try again.");
    } finally {
      setLoading(null);
    }
  }

  if (!canSend && !canApprove) return null;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-wrap gap-2">
        {status === "draft" && canSend && (
          <Button size="sm" disabled={!!loading} onClick={() => action("send")}>
            {loading === "send" ? "Sending…" : "Send portal link"}
          </Button>
        )}
        {["review_needed", "in_progress", "overdue", "opened", "sent"].includes(status) && canApprove && (
          <>
            <Button size="sm" disabled={!!loading} onClick={() => action("complete")}>
              {loading === "complete" ? "Saving…" : "Mark packet complete"}
            </Button>
            <Button variant="secondary" size="sm" disabled={!!loading} onClick={() => action("export")}>
              Export evidence
            </Button>
          </>
        )}
        {status === "completed" && canApprove && (
          <Button variant="secondary" size="sm" disabled={!!loading} onClick={() => action("export")}>
            Export evidence
          </Button>
        )}
        {!["completed", "cancelled"].includes(status) && canSend && (
          <Button variant="ghost" size="sm" disabled={!!loading} onClick={() => action("cancel")}>
            Cancel
          </Button>
        )}
        </div>
        {status === "draft" && canSend && (
          <CcSenderOption checked={ccMe} onChange={setCcMe} senderEmail={senderEmail} />
        )}
      </div>
      {error && <p className="text-body-sm text-error">{error}</p>}
    </div>
  );
}
