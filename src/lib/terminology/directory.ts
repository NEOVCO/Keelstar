/** User-facing labels for the vendor directory (DB table remains `vendors`). */
export const DIRECTORY = {
  nav: "Directory",
  title: "Directory",
  description: "Companies and people you collect documents from.",
  singular: "entry",
  plural: "entries",
  add: "Add to directory",
  addTitle: "Add to directory",
  addDescription: "Add entries one at a time or import a spreadsheet.",
  emptyTitle: "No directory entries yet",
  emptyDescription:
    "Build your directory to send W-9 requests, track insurance certificates, and manage onboarding documents.",
  importCsv: "Import CSV",
  backTo: "Back to directory",
  columnName: "Name",
  columnType: "Type",
  usageLabel: "Directory records",
  searchPlaceholder: "Search documents, workflows, directory…",
  commandType: "Directory",
  addQuickAction: "Add to directory",
  viewEntry: "View in directory",
  editEntry: "Edit entry",
  archiveEntry: "Archive entry",
  archiveConfirm: "Archive this entry? It will be hidden from the default list.",
  failedCreate: "Failed to create directory entry",
  failedUpdate: "Failed to update directory entry",
  failedArchive: "Failed to archive directory entry",
  importCount: (n: number) => `Import ${n} ${n === 1 ? "entry" : "entries"}`,
  importAction: "Import entries",
} as const;

export const COI_DIRECTORY = {
  partyColumn: "Party",
  pendingLabel: "Pending response",
  emptyDescription:
    "Request a COI from a tenant or vendor in your directory, review the certificate, and get reminders before coverage expires.",
  linkedLabel: "Directory",
} as const;
