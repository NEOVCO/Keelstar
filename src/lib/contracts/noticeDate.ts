export function parseNoticePeriodDays(fields: Record<string, string | null | undefined>): number | null {
  const raw = fields.notice_period_days ?? fields.termination_notice_days;
  if (!raw?.trim()) return null;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export function computeLatestNoticeDate(
  renewalDate: Date,
  noticePeriodDays: number
): Date {
  const d = new Date(renewalDate);
  d.setDate(d.getDate() - noticePeriodDays);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function daysUntilDate(target: Date, from = new Date()): number {
  const fromDay = new Date(from);
  fromDay.setHours(0, 0, 0, 0);
  const targetDay = new Date(target);
  targetDay.setHours(0, 0, 0, 0);
  const ms = targetDay.getTime() - fromDay.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export function parseAutoRenews(value: string | null | undefined): boolean {
  if (!value) return false;
  const v = value.toLowerCase().trim();
  return v === "true" || v === "yes" || v === "1";
}
