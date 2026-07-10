export function resolveOutboundCc(
  ccMe: boolean | undefined,
  senderEmail: string | null | undefined
): string[] | undefined {
  const email = senderEmail?.trim();
  if (!ccMe || !email) return undefined;
  return [email];
}

export function parseStoredCcEmails(
  metadata: Record<string, unknown> | null | undefined
): string[] | undefined {
  if (!metadata) return undefined;

  const list = metadata.cc_emails;
  if (Array.isArray(list)) {
    const emails = list.filter((e): e is string => typeof e === "string" && e.includes("@"));
    if (emails.length) return emails;
  }

  const single = metadata.cc_sender_email;
  if (typeof single === "string" && single.includes("@")) {
    return [single.trim()];
  }

  return undefined;
}

export function resolveVendorOutboundCc(
  metadata: Record<string, unknown>,
  options: { ccMe?: boolean } | undefined,
  senderEmail: string | null | undefined
): string[] | undefined {
  return resolveOutboundCc(options?.ccMe, senderEmail) ?? parseStoredCcEmails(metadata);
}

export function withStoredCc(
  metadata: Record<string, unknown>,
  ccMe: boolean | undefined,
  senderEmail: string | null | undefined
): Record<string, unknown> {
  const cc = resolveOutboundCc(ccMe, senderEmail);
  if (!cc) return metadata;
  return { ...metadata, cc_emails: cc, cc_sender_email: cc[0] };
}

export type VendorOutboundEmailOptions = {
  userId?: string;
  skipAuth?: boolean;
  ccMe?: boolean;
};
