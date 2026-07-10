"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UsageLimitAlert } from "@/components/billing/UsageLimitAlert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CcSenderOption } from "@/components/email/CcSenderOption";

export function SendSignerForm({
  vendors,
  defaultDueDate,
  senderEmail,
}: {
  vendors: Array<{ id: string; name: string; email?: string | null }>;
  defaultDueDate: string;
  senderEmail?: string | null;
}) {
  const router = useRouter();
  const [useDirectory, setUseDirectory] = useState(vendors.length > 0);
  const [vendorId, setVendorId] = useState(vendors[0]?.id ?? "");
  const [signerName, setSignerName] = useState("");
  const [signerEmail, setSignerEmail] = useState(vendors[0]?.email ?? "");
  const [documentTitle, setDocumentTitle] = useState("");
  const [dueDate, setDueDate] = useState(defaultDueDate.slice(0, 10));
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [ccMe, setCcMe] = useState(false);
  const [sendImmediately, setSendImmediately] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [limitError, setLimitError] = useState("");

  function onVendorChange(id: string) {
    setVendorId(id);
    const vendor = vendors.find((v) => v.id === id);
    if (vendor) {
      setSignerName(vendor.name);
      if (vendor.email) setSignerEmail(vendor.email);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file && sendImmediately) {
      setError("Upload the document before sending");
      return;
    }
    setLoading(true);
    setError("");
    setLimitError("");

    const due = new Date(dueDate);
    due.setHours(23, 59, 59, 999);

    const formData = new FormData();
    if (useDirectory && vendorId) formData.append("vendorId", vendorId);
    if (!useDirectory && signerName) formData.append("signerName", signerName);
    formData.append("signerEmail", signerEmail);
    formData.append("documentTitle", documentTitle);
    formData.append("dueDate", due.toISOString());
    if (message) formData.append("message", message);
    formData.append("sendImmediately", String(sendImmediately));
    if (ccMe) formData.append("ccMe", "true");
    if (file) formData.append("file", file);

    const res = await fetch("/api/signer/requests", { method: "POST", body: formData });
    const data = await res.json();

    if (!data.success) {
      if (res.status === 402) setLimitError(data.error ?? "Usage limit reached");
      else setError(data.error ?? "Failed to create request");
      setLoading(false);
      return;
    }

    router.push(`/app/workflows/${data.data.workflow.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {vendors.length > 0 && (
        <label className="flex items-center gap-2 text-body-sm text-secondary">
          <input
            type="checkbox"
            checked={useDirectory}
            onChange={(e) => setUseDirectory(e.target.checked)}
          />
          Select from directory
        </label>
      )}

      {useDirectory && vendors.length > 0 ? (
        <div>
          <label className="mb-1 block text-body-sm text-secondary">Signer</label>
          <select
            value={vendorId}
            onChange={(e) => onVendorChange(e.target.value)}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-body-sm"
            required
          >
            {vendors.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div>
          <label className="mb-1 block text-body-sm text-secondary">Signer name</label>
          <Input value={signerName} onChange={(e) => setSignerName(e.target.value)} />
        </div>
      )}

      <div>
        <label className="mb-1 block text-body-sm text-secondary">Document title</label>
        <Input value={documentTitle} onChange={(e) => setDocumentTitle(e.target.value)} required />
      </div>
      <div>
        <label className="mb-1 block text-body-sm text-secondary">Document (PDF)</label>
        <input
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="w-full text-body-sm"
          required={sendImmediately}
        />
      </div>
      <div>
        <label className="mb-1 block text-body-sm text-secondary">Signer email</label>
        <Input type="email" value={signerEmail} onChange={(e) => setSignerEmail(e.target.value)} required />
      </div>
      <div>
        <label className="mb-1 block text-body-sm text-secondary">Due date</label>
        <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
      </div>
      <div>
        <label className="mb-1 block text-body-sm text-secondary">Message (optional)</label>
        <Input value={message} onChange={(e) => setMessage(e.target.value)} />
      </div>
      <CcSenderOption checked={ccMe} onChange={setCcMe} senderEmail={senderEmail} />
      <label className="flex items-center gap-2 text-body-sm text-secondary">
        <input
          type="checkbox"
          checked={sendImmediately}
          onChange={(e) => setSendImmediately(e.target.checked)}
        />
        Send signature request immediately
      </label>
      {limitError && <UsageLimitAlert message={limitError} />}
      {error && <p className="text-body-sm text-danger">{error}</p>}
      <Button type="submit" disabled={loading || !documentTitle.trim() || !signerEmail.trim()}>
        {loading ? "Working…" : sendImmediately ? "Send for signature" : "Save draft"}
      </Button>
    </form>
  );
}
