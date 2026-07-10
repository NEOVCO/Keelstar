"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app-shell/Sidebar";
import { TopBar } from "@/components/navigation/TopBar";
import { CommandMenu } from "@/components/navigation/CommandMenu";
import { ProductTourProvider } from "@/components/onboarding";
import { PRODUCT_TOUR_START_EVENT } from "@/lib/onboarding/constants";

export function AppShell({
  organizationName,
  organizations,
  userEmail,
  notifications = [],
  entitlements = [],
  onboardingCompleted = false,
  children,
}: {
  organizationName: string;
  organizations: { id: string; name: string }[];
  userEmail?: string;
  notifications?: Array<{ id: string; title: string; href: string; time?: string; unread?: boolean }>;
  entitlements?: string[];
  onboardingCompleted?: boolean;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const openMobileNav = () => setMobileOpen(true);
    window.addEventListener(PRODUCT_TOUR_START_EVENT, openMobileNav);
    return () => window.removeEventListener(PRODUCT_TOUR_START_EVENT, openMobileNav);
  }, []);

  async function handleSwitchOrg(orgId: string) {
    await fetch("/api/organizations/switch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ organizationId: orgId }),
    });
    router.refresh();
  }

  return (
    <ProductTourProvider onboardingCompleted={onboardingCompleted}>
      <div className="flex min-h-screen bg-bg">
      <AppSidebar
        organizationName={organizationName}
        organizations={organizations}
        onSwitchOrg={handleSwitchOrg}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((v) => !v)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        entitlements={entitlements}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          organizationName={organizationName}
          organizations={organizations}
          onSwitchOrg={handleSwitchOrg}
          onMenuClick={() => setMobileOpen(true)}
          onSearchClick={() => setSearchOpen(true)}
          userEmail={userEmail}
          notifications={notifications}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-4 py-6 lg:px-8 lg:py-8">{children}</div>
        </main>
      </div>
      {searchOpen && <CommandMenu open={searchOpen} onClose={() => setSearchOpen(false)} />}
    </div>
    </ProductTourProvider>
  );
}
