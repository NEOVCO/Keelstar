export const VENDOR_PACKET_WORKFLOW_TYPE = "vendor_packet";
export const VENDOR_PACKET_MAGIC_LINK_PURPOSE = "vendor_packet_portal";
export const VENDOR_PACKET_MONITOR_TYPE = "vendor_packet_incomplete";
export const VENDOR_PACKET_ENTITLEMENT = "vendor_packet";

export const VENDOR_PACKET_DEFAULT_DUE_DAYS = 14;
export const VENDOR_PACKET_MAGIC_LINK_EXPIRY_DAYS = 30;
export const VENDOR_PACKET_MAGIC_LINK_MAX_USES = 50;

export const VENDOR_PACKET_STATUSES = [
  "draft",
  "sent",
  "opened",
  "in_progress",
  "review_needed",
  "completed",
  "overdue",
  "cancelled",
] as const;

export const ACTIVE_VENDOR_PACKET_STATUSES = [
  "draft",
  "sent",
  "opened",
  "in_progress",
  "review_needed",
  "overdue",
] as const;

export const PACKET_CHECKLIST_KEYS = ["w9", "coi", "msa", "banking"] as const;

export type PacketChecklistKey = (typeof PACKET_CHECKLIST_KEYS)[number];

export const PACKET_CHECKLIST_ITEMS: Array<{
  key: PacketChecklistKey;
  label: string;
  documentType: string;
  required: boolean;
  description: string;
}> = [
  {
    key: "w9",
    label: "W-9 tax form",
    documentType: "w9",
    required: true,
    description: "Signed IRS Form W-9",
  },
  {
    key: "coi",
    label: "Certificate of insurance",
    documentType: "coi",
    required: true,
    description: "Current certificate of insurance (PDF)",
  },
  {
    key: "msa",
    label: "Signed agreement",
    documentType: "contract",
    required: false,
    description: "Executed master service agreement or contract",
  },
  {
    key: "banking",
    label: "Banking / ACH details",
    documentType: "banking",
    required: false,
    description: "Voided check or bank letter for ACH setup",
  },
];

export const PACKET_ALLOWED_MIME = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
] as const;

export const PACKET_MAX_FILE_SIZE = 25 * 1024 * 1024;

export const PACKET_REQUEST_REMINDER_WINDOWS = [
  { window: "before_7d", daysOffset: -7, type: "vendor_packet_reminder" },
  { window: "on_due", daysOffset: 0, type: "vendor_packet_reminder" },
  { window: "after_7d", daysOffset: 7, type: "vendor_packet_overdue" },
] as const;

export function defaultPacketDueDate(): Date {
  const d = new Date();
  d.setDate(d.getDate() + VENDOR_PACKET_DEFAULT_DUE_DAYS);
  d.setHours(23, 59, 59, 999);
  return d;
}

export function getChecklistItem(key: string) {
  return PACKET_CHECKLIST_ITEMS.find((i) => i.key === key);
}
