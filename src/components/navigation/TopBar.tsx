"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { UserMenu } from "@/components/navigation/UserMenu";
import { NotificationMenu } from "@/components/navigation/NotificationMenu";
import { TOUR_TARGETS } from "@/lib/onboarding/constants";
import { DIRECTORY } from "@/lib/terminology/directory";
import { PEOPLE } from "@/lib/terminology/people";

export function TopBar({
  organizationName,
  organizations,
  onSwitchOrg,
  onMenuClick,
  onSearchClick,
  userEmail,
  notifications = [],
}: {
  organizationName: string;
  organizations: { id: string; name: string }[];
  onSwitchOrg?: (orgId: string) => void;
  onMenuClick?: () => void;
  onSearchClick?: () => void;
  userEmail?: string;
  notifications?: Array<{ id: string; title: string; href: string; time?: string; unread?: boolean }>;
}) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-surface px-4 lg:px-6">
      <button
        type="button"
        className="rounded-md p-2 text-secondary hover:bg-sunken lg:hidden"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden min-w-0 flex-1 md:block">
        {pathname !== "/app" && (
          <p className="truncate text-body-sm text-secondary">{organizationName}</p>
        )}
      </div>

      <div className="flex flex-1 items-center justify-end gap-2 md:flex-none">
        {organizations.length > 1 && (
          <select
            className="hidden max-w-[180px] truncate rounded-md border border-border bg-sunken px-2 py-1.5 text-body-sm md:block"
            value={organizations.find((o) => o.name === organizationName)?.id ?? ""}
            onChange={(e) => onSwitchOrg?.(e.target.value)}
          >
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        )}

        <Button
          id={TOUR_TARGETS.search}
          variant="ghost"
          size="sm"
          className="gap-2 text-secondary"
          onClick={onSearchClick}
        >
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden rounded border border-border bg-sunken px-1.5 py-0.5 text-caption sm:inline">
            ⌘K
          </kbd>
        </Button>

        <CreateMenu />

        <NotificationMenu items={notifications} />

        <UserMenu email={userEmail} />
      </div>
    </header>
  );
}

function CreateMenu() {
  const items = [
    { label: "Upload document", href: "/app/documents?action=upload" },
    { label: "Start workflow", href: "/app/workflows?action=create" },
    { label: DIRECTORY.addQuickAction, href: "/app/vendors/new" },
    { label: PEOPLE.add, href: "/app/people/new" },
    { label: "Invite member", href: "/app/settings/members" },
  ];

  return (
    <div id={TOUR_TARGETS.createMenu} className="group relative">
      <Button size="sm" className="gap-1">
        <Plus className="h-4 w-4" />
        <span className="hidden sm:inline">Create</span>
      </Button>
      <div
        className={cn(
          "invisible absolute right-0 top-full z-30 mt-1 min-w-[200px] rounded-md border border-border bg-surface py-1 shadow-md",
          "opacity-0 transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100"
        )}
      >
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block px-3 py-2 text-body-sm text-primary hover:bg-sunken"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
