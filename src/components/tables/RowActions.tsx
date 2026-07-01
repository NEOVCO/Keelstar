"use client";

import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RowActions({ items }: { items: { label: string; href: string }[] }) {
  if (!items.length) return null;
  return (
    <div className="relative group">
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label="Row actions">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
      <div className="invisible absolute right-0 top-full z-10 mt-1 min-w-[140px] rounded-md border border-border bg-surface py-1 opacity-0 shadow-md group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
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

export function ResponsiveTable({
  children,
  mobileCards,
}: {
  children: React.ReactNode;
  mobileCards: React.ReactNode;
}) {
  return (
    <>
      <div className="hidden md:block">{children}</div>
      <div className="space-y-3 md:hidden">{mobileCards}</div>
    </>
  );
}
