"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function VendorPacketPortalActions({ workflowId }: { workflowId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"resend" | "revoke" | null>(null);
  const [error, setError] = useState("");

  async function action(kind: "resend" | "revoke") {
    setLoading(kind);
    setError("");
    try {
      const res = await fetch(`/api/vendor-packets/requests/${workflowId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: kind }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false) {
        throw new Error(data.error ?? `Could not ${kind} portal link`);
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" size="sm" disabled={!!loading} onClick={() => action("resend")}>
          {loading === "resend" ? "Sending…" : "Resend portal link"}
        </Button>
        <Button variant="secondary" size="sm" disabled={!!loading} onClick={() => action("revoke")}>
          {loading === "revoke" ? "Revoking…" : "Revoke portal link"}
        </Button>
      </div>
      {error && <p className="text-body-sm text-error">{error}</p>}
    </div>
  );
}
