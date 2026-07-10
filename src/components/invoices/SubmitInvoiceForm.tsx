"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UsageLimitAlert } from "@/components/billing/UsageLimitAlert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type VendorOption = { id: string; name: string };
type ApproverOption = { id: string; label: string };

export function SubmitInvoiceForm({
  vendors,
  approvers,
  defaultApprovalDueDate,
}: {
  vendors: VendorOption[];
  approvers: ApproverOption[];
  defaultApprovalDueDate: string;
}) {
  const router = useRouter();
  const [vendorId, setVendorId] = useState(vendors[0]?.id ?? "");
  const [vendorName, setVendorName] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [approverMemberId, setApproverMemberId] = useState(approvers[0]?.id ?? "");
  const [approvalDueDate, setApprovalDueDate] = useState(defaultApprovalDueDate.slice(0, 10));
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [limitError, setLimitError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Upload the invoice document");
      return;
    }
    if (!approverMemberId) {
      setError("Select an approver");
      return;
    }
    if (!vendorId && !vendorName.trim()) {
      setError("Select a directory vendor or enter a vendor name");
      return;
    }

    setLoading(true);
    setError("");
    setLimitError("");

    const due = new Date(approvalDueDate);
    due.setHours(23, 59, 59, 999);

    const formData = new FormData();
    if (vendorId) formData.append("vendorId", vendorId);
    if (!vendorId && vendorName) formData.append("vendorName", vendorName);
    if (invoiceNumber) formData.append("invoiceNumber", invoiceNumber);
    formData.append("approverMemberId", approverMemberId);
    formData.append("approvalDueDate", due.toISOString());
    formData.append("file", file);

    const res = await fetch("/api/invoices/requests", { method: "POST", body: formData });
    const data = await res.json();

    if (!data.success) {
      if (res.status === 402) setLimitError(data.error ?? "Usage limit reached");
      else setError(data.error ?? "Failed to submit invoice");
      setLoading(false);
      return;
    }

    router.push(`/app/workflows/${data.data.workflow.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-body-sm text-secondary">Directory vendor (optional)</label>
        <select
          value={vendorId}
          onChange={(e) => setVendorId(e.target.value)}
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-body-sm"
        >
          <option value="">— Manual vendor name —</option>
          {vendors.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>
      </div>
      {!vendorId && (
        <div>
          <label className="mb-1 block text-body-sm text-secondary">Vendor name</label>
          <Input value={vendorName} onChange={(e) => setVendorName(e.target.value)} required />
        </div>
      )}
      <div>
        <label className="mb-1 block text-body-sm text-secondary">Invoice number (optional)</label>
        <Input value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
      </div>
      <div>
        <label className="mb-1 block text-body-sm text-secondary">Approver</label>
        <select
          value={approverMemberId}
          onChange={(e) => setApproverMemberId(e.target.value)}
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-body-sm"
          required
        >
          {approvers.map((a) => (
            <option key={a.id} value={a.id}>
              {a.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-body-sm text-secondary">Approval due date</label>
        <Input
          type="date"
          value={approvalDueDate}
          onChange={(e) => setApprovalDueDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-body-sm text-secondary">Invoice document</label>
        <input
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="w-full text-body-sm"
          required
        />
      </div>
      {limitError && <UsageLimitAlert message={limitError} />}
      {error && <p className="text-body-sm text-danger">{error}</p>}
      <Button type="submit" disabled={loading || !approvers.length}>
        {loading ? "Submitting…" : "Submit for approval"}
      </Button>
    </form>
  );
}
