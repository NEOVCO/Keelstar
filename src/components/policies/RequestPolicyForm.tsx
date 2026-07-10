"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UsageLimitAlert } from "@/components/billing/UsageLimitAlert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CcSenderOption } from "@/components/email/CcSenderOption";

export function RequestPolicyForm({
  people,
  defaultPersonId,
  defaultDueDate,
  senderEmail,
}: {
  people: Array<{ id: string; name: string; email?: string | null }>;
  defaultPersonId?: string;
  defaultDueDate: string;
  senderEmail?: string | null;
}) {
  const router = useRouter();
  const [personId, setPersonId] = useState(defaultPersonId ?? people[0]?.id ?? "");
  const [policyTitle, setPolicyTitle] = useState("");
  const [policyVersion, setPolicyVersion] = useState("");
  const [email, setEmail] = useState(people.find((p) => p.id === (defaultPersonId ?? people[0]?.id))?.email ?? "");
  const [dueDate, setDueDate] = useState(defaultDueDate.slice(0, 10));
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [ccMe, setCcMe] = useState(false);
  const [sendImmediately, setSendImmediately] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [limitError, setLimitError] = useState("");

  function onPersonChange(id: string) {
    setPersonId(id);
    const person = people.find((p) => p.id === id);
    if (person?.email) setEmail(person.email);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file && sendImmediately) {
      setError("Upload the policy document before sending");
      return;
    }
    setLoading(true);
    setError("");
    setLimitError("");

    const due = new Date(dueDate);
    due.setHours(23, 59, 59, 999);

    const formData = new FormData();
    formData.append("vendorId", personId);
    formData.append("policyTitle", policyTitle);
    if (policyVersion) formData.append("policyVersion", policyVersion);
    formData.append("dueDate", due.toISOString());
    if (message) formData.append("message", message);
    if (email) formData.append("recipientEmail", email);
    formData.append("sendImmediately", String(sendImmediately));
    if (ccMe) formData.append("ccMe", "true");
    if (file) formData.append("file", file);

    const res = await fetch("/api/policies/requests", { method: "POST", body: formData });
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
      <div>
        <label className="mb-1 block text-body-sm text-secondary">Person</label>
        <select
          value={personId}
          onChange={(e) => onPersonChange(e.target.value)}
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-body-sm"
          required
        >
          {people.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-body-sm text-secondary">Policy title</label>
        <Input value={policyTitle} onChange={(e) => setPolicyTitle(e.target.value)} required />
      </div>
      <div>
        <label className="mb-1 block text-body-sm text-secondary">Policy version (optional)</label>
        <Input value={policyVersion} onChange={(e) => setPolicyVersion(e.target.value)} placeholder="e.g. 2026-01" />
      </div>
      <div>
        <label className="mb-1 block text-body-sm text-secondary">Policy document</label>
        <input
          type="file"
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="w-full text-body-sm"
          required={sendImmediately}
        />
      </div>
      <div>
        <label className="mb-1 block text-body-sm text-secondary">Recipient email</label>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
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
        Send acknowledgement request immediately
      </label>
      {limitError && <UsageLimitAlert message={limitError} />}
      {error && <p className="text-body-sm text-danger">{error}</p>}
      <Button type="submit" disabled={loading || !personId || !policyTitle.trim()}>
        {loading ? "Working…" : sendImmediately ? "Send acknowledgement request" : "Save draft"}
      </Button>
    </form>
  );
}
