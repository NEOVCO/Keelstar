"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

export function TableToolbar({
  searchPlaceholder = "Search…",
  onSearchChange,
  children,
}: {
  searchPlaceholder?: string;
  onSearchChange?: (q: string) => void;
  children?: React.ReactNode;
}) {
  const [q, setQ] = useState("");

  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <input
        type="search"
        placeholder={searchPlaceholder}
        className="w-full max-w-sm rounded-md border border-border bg-surface px-3 py-2 text-body-sm outline-none focus:ring-2 focus:ring-accent"
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          onSearchChange?.(e.target.value);
        }}
      />
      {children && <div className="flex gap-2">{children}</div>}
    </div>
  );
}

export function OwnerCell({ name, initials }: { name: string; initials: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sunken text-caption font-medium text-secondary">
        {initials}
      </span>
      <span className="text-body-sm text-primary">{name}</span>
    </div>
  );
}

export function DueDateCell({ date, overdue }: { date: string; overdue?: boolean }) {
  const formatted = new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return (
    <span className={cn("text-body-sm", overdue ? "text-error" : "text-secondary")}>{formatted}</span>
  );
}

export { DataTable } from "@/components/ui/empty-state";
