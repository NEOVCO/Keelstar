"use client";

import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/layout/AppSidebar";

export function AppShell({
  organizationName,
  organizations,
  children,
}: {
  organizationName: string;
  organizations: { id: string; name: string }[];
  children: React.ReactNode;
}) {
  const router = useRouter();

  async function handleSwitchOrg(orgId: string) {
    await fetch("/api/organizations/switch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ organizationId: orgId }),
    });
    router.refresh();
  }

  return (
    <div className="flex min-h-screen bg-bg">
      <AppSidebar
        organizationName={organizationName}
        organizations={organizations}
        onSwitchOrg={handleSwitchOrg}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
