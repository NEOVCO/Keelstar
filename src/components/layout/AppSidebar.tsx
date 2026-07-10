"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  GitBranch,
  CheckSquare,
  Bell,
  Shield,
  Settings,
  CreditCard,
  ChevronDown,
  LogOut,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { MODULES } from "@/lib/modules/modules";

const coreNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/vendors", label: "Directory", icon: Users },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/workflows", label: "Workflows", icon: GitBranch },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/monitors", label: "Monitors", icon: Bell },
  { href: "/audit", label: "Audit Log", icon: Shield },
];

const bottomNav = [
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/billing", label: "Billing", icon: CreditCard },
];

type OrgOption = { id: string; name: string };

export function AppSidebar({
  organizationName,
  organizations = [],
  onSwitchOrg,
}: {
  organizationName: string;
  organizations?: OrgOption[];
  onSwitchOrg?: (orgId: string) => void;
}) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-border bg-surface">
      <div className="border-b border-border p-4">
        <Link href="/dashboard" className="text-h4 font-semibold text-primary">
          Keelstar
        </Link>
        {organizations.length > 0 ? (
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
        ) : (
          <p className="mt-2 truncate text-caption text-secondary">{organizationName}</p>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <div className="mb-4">
          <p className="mb-2 px-2 text-overline text-tertiary">Platform</p>
          <ul className="space-y-0.5">
            {coreNav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-2 py-2 text-body-sm transition-colors",
                      active
                        ? "bg-accent-subtle font-medium text-accent"
                        : "text-secondary hover:bg-sunken hover:text-primary"
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <p className="mb-2 px-2 text-overline text-tertiary">Modules</p>
          <ul className="space-y-0.5">
            {MODULES.filter((m) => m.status !== "coming_soon").map((mod) => {
              const href = `/${mod.slug}`;
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <li key={mod.id}>
                  <Link
                    href={href}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-2 py-2 text-body-sm transition-colors",
                      active
                        ? "bg-accent-subtle font-medium text-accent"
                        : "text-secondary hover:bg-sunken hover:text-primary"
                    )}
                  >
                    <mod.icon className="h-4 w-4 shrink-0" />
                    {mod.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <div className="border-t border-border p-3">
        <ul className="space-y-0.5">
          {bottomNav.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-2 py-2 text-body-sm transition-colors",
                    active
                      ? "bg-sunken font-medium text-primary"
                      : "text-secondary hover:bg-sunken hover:text-primary"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              </li>
            );
          })}
          <li>
            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-body-sm text-secondary transition-colors hover:bg-sunken hover:text-primary"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                Sign out
              </button>
            </form>
          </li>
        </ul>
      </div>
    </aside>
  );
}
