"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CcSenderOption } from "@/components/email/CcSenderOption";

export function PolicyWorkflowActions({
  workflowId,
  status,
  canSend,
  hasPolicyDocument,
  senderEmail,
}: {
  workflowId: string;
  status: string;
  canSend: boolean;
  hasPolicyDocument: boolean;
  senderEmail?: string | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [ccMe, setCcMe] = useState(false);
  const [showSend, setShowSend] = useState(false);

  async function action(name: string) {
    setLoading(name);
    const res = await fetch(`/api/policies/requests/${workflowId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: name, ccMe: ccMe || undefined }),
    });

    if (name === "export" && res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `policy-evidence-${workflowId}.csv`;
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

  return (
    <div className="flex flex-wrap items-center gap-2">
      {status === "draft" && canSend && (
        <>
          {!showSend ? (
            <Button
              size="sm"
              disabled={!hasPolicyDocument || !!loading}
              onClick={() => setShowSend(true)}
            >
              Send acknowledgement request
            </Button>
          ) : (
            <div className="flex w-full flex-wrap items-center gap-2 border-t border-border pt-3">
              <CcSenderOption checked={ccMe} onChange={setCcMe} senderEmail={senderEmail} />
              <Button size="sm" disabled={!!loading} onClick={() => action("send")}>
                Confirm send
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setShowSend(false)}>
                Cancel
              </Button>
            </div>
          )}
        </>
      )}
      {["sent", "opened", "overdue"].includes(status) && canSend && (
        <>
          <Button variant="secondary" size="sm" disabled={!!loading} onClick={() => action("resend")}>
            Resend request
          </Button>
          <Button variant="secondary" size="sm" disabled={!!loading} onClick={() => action("revoke")}>
            Revoke link
          </Button>
        </>
      )}
      {status === "completed" && (
        <Button variant="secondary" size="sm" disabled={!!loading} onClick={() => action("export")}>
          Export evidence
        </Button>
      )}
    </div>
  );
}
