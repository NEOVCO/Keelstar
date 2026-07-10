"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StatusBadge } from "@/components/ui/badge";
import { VendorPacketPortalActions } from "./VendorPacketPortalActions";

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
      <VendorPacketPortalActions workflowId={workflowId} />
    </div>
  );
}
