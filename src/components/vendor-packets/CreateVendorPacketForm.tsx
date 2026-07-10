"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UsageLimitAlert } from "@/components/billing/UsageLimitAlert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PACKET_CHECKLIST_ITEMS } from "@/lib/vendor-packets/constants";

import { CcSenderOption } from "@/components/email/CcSenderOption";

export function CreateVendorPacketForm({
  vendorId,
  vendorEmail,
  defaultDueDate,
  senderEmail,
}: {
  vendorId: string;
  vendorEmail?: string | null;
  defaultDueDate: string;
  senderEmail?: string | null;
}) {
  const router = useRouter();
  const [email, setEmail] = useState(vendorEmail ?? "");
  const [dueDate, setDueDate] = useState(defaultDueDate.slice(0, 10));
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState<Record<string, boolean>>({
    w9: true,
    coi: true,
    msa: false,
    banking: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [limitError, setLimitError] = useState("");
  const [ccMe, setCcMe] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setLimitError("");

    const checklistKeys = Object.entries(selected)
      .filter(([, v]) => v)
      .map(([k]) => k);

    if (!checklistKeys.length) {
      setError("Select at least one document");
      setLoading(false);
      return;
    }

    const due = new Date(dueDate);
    due.setHours(23, 59, 59, 999);

    const res = await fetch("/api/vendor-packets/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vendorId,
        recipientEmail: email,
        dueDate: due.toISOString(),
        message: message || undefined,
        checklistKeys,
        sendImmediately: true,
        ccMe: ccMe || undefined,
      }),
    });
    const data = await res.json();

    if (!data.success) {
      if (res.status === 402) setLimitError(data.error ?? "Usage limit reached");
      else setError(data.error ?? "Failed to send packet");
      setLoading(false);
      return;
    }

    router.push(`/app/workflows/${data.data.workflow.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-body-sm text-secondary">Recipient email</label>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <label className="mb-1 block text-body-sm text-secondary">Due date</label>
        <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
      </div>
      <div>
        <label className="mb-2 block text-body-sm text-secondary">Required documents</label>
        <div className="space-y-2">
          {PACKET_CHECKLIST_ITEMS.map((item) => (
            <label key={item.key} className="flex items-center gap-2 text-body-sm">
              <input
                type="checkbox"
                checked={selected[item.key] ?? false}
                onChange={(e) => setSelected((p) => ({ ...p, [item.key]: e.target.checked }))}
              />
              {item.label}
              {item.required && <span className="text-caption text-secondary">(recommended)</span>}
            </label>
          ))}
        </div>
      </div>
      <div>
        <label className="mb-1 block text-body-sm text-secondary">Message (optional)</label>
        <Input value={message} onChange={(e) => setMessage(e.target.value)} />
      </div>
      <CcSenderOption checked={ccMe} onChange={setCcMe} senderEmail={senderEmail} />
      {limitError && <UsageLimitAlert message={limitError} />}
      {error && <p className="text-body-sm text-error">{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? "Sending…" : "Send vendor packet"}
      </Button>
    </form>
  );
}
