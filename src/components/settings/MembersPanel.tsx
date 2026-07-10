"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

type Member = {
  id: string;
  invited_email: string | null;
  status: string;
  member_roles: Array<{ roles: { key: string; name: string } }>;
};

type Invitation = {
  id: string;
  email: string;
  status: string;
  expires_at: string;
  roles: { key: string; name: string };
};

export function MembersPanel({
  initialMembers,
  initialInvitations,
}: {
  initialMembers: Member[];
  initialInvitations: Invitation[];
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [roleKey, setRoleKey] = useState<"admin" | "manager" | "member" | "viewer">("member");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function invite(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/organizations/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, roleKey }),
    });
    const json = await res.json();
    setLoading(false);
    if (!json.success) {
      setError(json.error ?? "Invite failed");
      return;
    }
    setEmail("");
    router.refresh();
  }

  async function revoke(id: string) {
    await fetch(`/api/organizations/invitations/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <form onSubmit={invite} className="flex flex-wrap items-end gap-3">
        <div className="min-w-[200px] flex-1 space-y-2">
          <Label htmlFor="invite-email">Email</Label>
          <Input
            id="invite-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="invite-role">Role</Label>
          <select
            id="invite-role"
            className="h-9 rounded-md border border-border bg-surface px-3 text-body-sm"
            value={roleKey}
            onChange={(e) => setRoleKey(e.target.value as typeof roleKey)}
          >
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="member">Member</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Sending…" : "Invite"}
        </Button>
      </form>
      {error && <p className="text-body-sm text-error">{error}</p>}

      <div>
        <h2 className="mb-3 text-h4 text-primary">Team members</h2>
        <ul className="divide-y divide-border rounded-lg border border-border">
          {initialMembers.map((m) => (
            <li key={m.id} className="flex items-center justify-between px-4 py-3 text-body-sm">
              <span>{m.invited_email ?? "Member"}</span>
              <span className="text-secondary">
                {m.member_roles?.map((r) => r.roles?.name).filter(Boolean).join(", ") || m.status}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {initialInvitations.length > 0 && (
        <div>
          <h2 className="mb-3 text-h4 text-primary">Pending invitations</h2>
          <ul className="divide-y divide-border rounded-lg border border-border">
            {initialInvitations.map((inv) => (
              <li key={inv.id} className="flex items-center justify-between px-4 py-3 text-body-sm">
                <span>
                  {inv.email} · {inv.roles?.name}
                </span>
                <Button variant="ghost" size="sm" onClick={() => revoke(inv.id)}>
                  Revoke
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
