import type { LucideIcon } from "lucide-react";
import { DIRECTORY } from "@/lib/terminology/directory";
import {
  LayoutDashboard,
  Inbox,
  GitBranch,
  FileText,
  Bell,
  Users,
  UserCircle,
  BarChart3,
  Shield,
  Settings,
  CreditCard,
} from "lucide-react";
import { MODULES } from "@/lib/modules/modules";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  section: "workspace" | "records" | "apps" | "admin";
  requiresEntitlement?: string;
};

export const WORKSPACE_NAV: NavItem[] = [
  { href: "/app", label: "Home", icon: LayoutDashboard, section: "workspace" },
  { href: "/app/inbox", label: "Inbox", icon: Inbox, section: "workspace" },
  { href: "/app/workflows", label: "Workflows", icon: GitBranch, section: "workspace" },
  { href: "/app/documents", label: "Documents", icon: FileText, section: "workspace" },
  { href: "/app/monitors", label: "Monitors", icon: Bell, section: "workspace" },
];

export const RECORDS_NAV: NavItem[] = [
  { href: "/app/vendors", label: DIRECTORY.nav, icon: Users, section: "records" },
  { href: "/app/people", label: "People", icon: UserCircle, section: "records" },
  { href: "/app/reports", label: "Reports", icon: BarChart3, section: "records" },
  { href: "/app/audit", label: "Audit Log", icon: Shield, section: "records" },
];

export const ADMIN_NAV: NavItem[] = [
  { href: "/app/settings", label: "Settings", icon: Settings, section: "admin" },
  { href: "/app/settings/billing", label: "Billing", icon: CreditCard, section: "admin" },
];

export function getAppsNav(): NavItem[] {
  return MODULES.filter((m) => m.status !== "coming_soon").map((mod) => ({
    href: mod.routes.app,
    label: mod.name,
    icon: mod.icon,
    section: "apps" as const,
    requiresEntitlement: mod.requiredEntitlement,
  }));
}

export const NAV_SECTIONS = [
  { id: "workspace" as const, label: "Workspace" },
  { id: "records" as const, label: "Records" },
  { id: "apps" as const, label: "Apps" },
  { id: "admin" as const, label: "Admin" },
];

export function isNavActive(pathname: string, href: string): boolean {
  if (href === "/app") return pathname === "/app";
  return pathname === href || pathname.startsWith(`${href}/`);
}
