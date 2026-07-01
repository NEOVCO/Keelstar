"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UsageLimitAlert } from "@/components/billing/UsageLimitAlert";

export function EditVendorForm({
  vendorId,
  initialName,
  initialEmail,
  initialPhone,
}: {
  vendorId: string;
  initialName: string;
  initialEmail?: string | null;
  initialPhone?: string | null;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail ?? "");
  const [phone, setPhone] = useState(initialPhone ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [limitError, setLimitError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setLimitError("");

    const res = await fetch(`/api/vendors/${vendorId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email: email || undefined, phone: phone || undefined }),
    });
    const data = await res.json();

    if (!data.success) {
      if (res.status === 402) setLimitError(data.error ?? "Usage limit reached");
      else setError(data.error ?? "Failed to update vendor");
      setLoading(false);
      return;
    }

    router.refresh();
    setLoading(false);
  }

  async function handleArchive() {
    if (!confirm("Archive this vendor? They will be hidden from the default list.")) return;
    setLoading(true);
    const res = await fetch(`/api/vendors/${vendorId}`, { method: "DELETE" });
    const data = await res.json();
    if (!data.success) {
      setError(data.error ?? "Failed to archive vendor");
      setLoading(false);
      return;
    }
    router.push("/app/vendors");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-body-sm text-secondary">Vendor name</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label className="mb-1 block text-body-sm text-secondary">Email</label>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label className="mb-1 block text-body-sm text-secondary">Phone</label>
        <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
      {limitError && <UsageLimitAlert message={limitError} />}
      {error && <p className="text-body-sm text-error">{error}</p>}
      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : "Save changes"}
        </Button>
        <Button type="button" variant="secondary" disabled={loading} onClick={handleArchive}>
          Archive vendor
        </Button>
      </div>
    </form>
  );
}
