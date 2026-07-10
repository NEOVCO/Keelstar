"use client";

import { useMemo, useState } from "react";
import { DataTable, TableToolbar } from "@/components/tables";

export type AuditLogRow = {
  id: string;
  time: string;
  actor: string;
  action: string;
  object: string;
};

export function AuditLogTable({
  columns,
  rows,
}: {
  columns: Array<{ key: string; label: string }>;
  rows: AuditLogRow[];
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) =>
      [row.time, row.actor, row.action, row.object].some((value) => value.toLowerCase().includes(q))
    );
  }, [query, rows]);

  return (
    <>
      <TableToolbar searchPlaceholder="Filter audit events…" onSearchChange={setQuery} />
      <DataTable columns={columns} rows={filtered} />
      {query && filtered.length === 0 && (
        <p className="mt-3 text-body-sm text-secondary">No audit events match &ldquo;{query}&rdquo;.</p>
      )}
    </>
  );
}
