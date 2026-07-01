"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, LogOut, PanelLeftClose, PanelLeft, Lock } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { NAV_HREF_TOUR_IDS } from "@/lib/onboarding/constants";
import {
  WORKSPACE_NAV,
  RECORDS_NAV,
  ADMIN_NAV,
  NAV_SECTIONS,
  getAppsNav,
  isNavActive,
} from "@/lib/navigation/app-nav";

export function AppSidebar({
  organizationName,
  organizations = [],
  onSwitchOrg,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onMobileClose,
  entitlements = [],
}: {
  organizationName: string;
  organizations?: { id: string; name: string }[];
  onSwitchOrg?: (orgId: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  entitlements?: string[];
}) {
  const pathname = usePathname();
  const appsNav = getAppsNav();

  const sections = [
    { ...NAV_SECTIONS[0], items: WORKSPACE_NAV },
    { ...NAV_SECTIONS[1], items: RECORDS_NAV },
    { ...NAV_SECTIONS[2], items: appsNav },
    { ...NAV_SECTIONS[3], items: ADMIN_NAV },
  ];

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-ink/40 lg:hidden"
          onClick={onMobileClose}
          aria-label="Close menu"
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex h-screen flex-col border-r border-border bg-surface transition-transform lg:static lg:translate-x-0",
          collapsed ? "w-16" : "w-60",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="border-b border-border p-4">
          <Link href="/app" className="block text-h4 font-semibold text-primary" onClick={onMobileClose}>
            {collapsed ? "K" : "Keelstar"}
          </Link>
          {!collapsed && organizations.length > 0 && (
            <div className="relative mt-3">
              <select
                className="w-full appearance-none rounded-md border border-border bg-sunken px-3 py-2 pr-8 text-body-sm text-primary"
                value={organizations.find((o) => o.name === organizationName)?.id ?? ""}
                onChange={(e) => onSwitchOrg?.(e.target.value)}
              >
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-tertiary" />
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          {sections.map((section) => (
            <div key={section.id} className="mb-4">
              {!collapsed && (
                <p className="mb-2 px-2 text-overline text-tertiary">{section.label}</p>
              )}
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const active = isNavActive(pathname ?? "", item.href);
                  const locked =
                    item.requiresEntitlement && !entitlements.includes(item.requiresEntitlement);
                  return (
                    <li key={item.href}>
                      <Link
                        id={NAV_HREF_TOUR_IDS[item.href]}
                        href={locked ? "/app/settings/billing" : item.href}
                        onClick={onMobileClose}
                        title={collapsed ? item.label : locked ? `${item.label} (upgrade)` : undefined}
                        className={cn(
                          "flex items-center gap-2.5 rounded-md px-2 py-2 text-body-sm transition-colors",
                          active
                            ? "bg-accent-subtle font-medium text-accent"
                            : "text-secondary hover:bg-sunken hover:text-primary",
                          locked && "opacity-60"
                        )}
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!collapsed && (
                          <>
                            {item.label}
                            {locked && <Lock className="ml-auto h-3.5 w-3.5" />}
                          </>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-border p-3">
          <button
            type="button"
            onClick={onToggleCollapse}
            className="mb-2 hidden w-full items-center gap-2 rounded-md px-2 py-2 text-body-sm text-secondary hover:bg-sunken lg:flex"
          >
            {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            {!collapsed && "Collapse"}
          </button>
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-body-sm text-secondary hover:bg-sunken hover:text-primary"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              {!collapsed && "Sign out"}
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
