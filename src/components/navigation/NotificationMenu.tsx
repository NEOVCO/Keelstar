"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotificationMenu({
  items,
}: {
  items: Array<{ id: string; title: string; href: string; time?: string; unread?: boolean }>;
}) {
  const unreadCount = items.filter((i) => i.unread !== false).length;

  async function markRead(id: string) {
    await fetch(`/api/notifications/${id}`, { method: "PATCH" });
  }

  return (
    <div className="group relative">
      <Button variant="ghost" size="sm" className="relative text-secondary" aria-label="Notifications">
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-medium text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>
      <div className="invisible absolute right-0 top-full z-30 mt-1 w-80 rounded-md border border-border bg-surface opacity-0 shadow-md group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <p className="text-caption font-medium text-secondary">Notifications</p>
          <Link href="/app/notifications" className="text-caption text-accent hover:underline">
            View all
          </Link>
        </div>
        {items.length === 0 ? (
          <p className="px-3 py-4 text-body-sm text-secondary">No new notifications</p>
        ) : (
          <ul className="max-h-64 overflow-y-auto">
            {items.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className="block px-3 py-2 hover:bg-sunken"
                  onClick={() => void markRead(item.id)}
                >
                  <p className={`text-body-sm ${item.unread ? "font-medium text-primary" : "text-secondary"}`}>
                    {item.title}
                  </p>
                  {item.time && <p className="text-caption text-tertiary">{item.time}</p>}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
