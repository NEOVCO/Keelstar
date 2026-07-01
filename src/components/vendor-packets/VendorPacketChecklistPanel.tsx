"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function VendorPacketChecklistPanel({
  workflowId,
  items,
}: {
  workflowId: string;
  items: Array<{
    key: string;
    label: string;
    required: boolean;
    status: "pending" | "uploaded";
    submittedAt?: string;
  }>;
}) {
  const router = useRouter();
  const [resending, setResending] = useState(false);

  async function resend() {
    setResending(true);
    await fetch(`/api/vendor-packets/requests/${workflowId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "send" }),
    });
    setResending(false);
    router.refresh();
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.key}
          className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-body-sm"
        >
          <span>
            {item.label}
            {item.required && <span className="text-secondary"> (required)</span>}
          </span>
          <StatusBadge status={item.status === "uploaded" ? "completed" : "pending"} />
        </div>
      ))}
      <Button variant="secondary" size="sm" disabled={resending} onClick={resend}>
        {resending ? "Sending…" : "Resend portal link"}
      </Button>
    </div>
  );
}
