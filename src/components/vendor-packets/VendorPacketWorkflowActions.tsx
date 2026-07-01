"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function VendorPacketWorkflowActions({
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

  async function action(name: string) {
    setLoading(name);
    const res = await fetch(`/api/vendor-packets/requests/${workflowId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: name }),
    });

    if (name === "export" && res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `vendor-packet-evidence-${workflowId}.csv`;
      a.click();
      setLoading(null);
      return;
    }

    if (!res.ok) {
      const data = await res.json();
      alert(data.error ?? "Action failed");
    }

    setLoading(null);
    router.refresh();
  }

  if (!canApprove) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {status === "draft" && (
        <Button size="sm" disabled={!!loading} onClick={() => action("send")}>
          Send portal link
        </Button>
      )}
      {["review_needed", "in_progress", "overdue", "opened", "sent"].includes(status) && (
        <>
          <Button size="sm" disabled={!!loading} onClick={() => action("complete")}>
            Mark packet complete
          </Button>
          <Button variant="secondary" size="sm" disabled={!!loading} onClick={() => action("export")}>
            Export evidence
          </Button>
        </>
      )}
      {status === "completed" && (
        <Button variant="secondary" size="sm" disabled={!!loading} onClick={() => action("export")}>
          Export evidence
        </Button>
      )}
      {!["completed", "cancelled"].includes(status) && (
        <Button variant="ghost" size="sm" disabled={!!loading} onClick={() => action("cancel")}>
          Cancel
        </Button>
      )}
    </div>
  );
}
