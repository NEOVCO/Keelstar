import { site } from "@/lib/site";

const DEFAULT_FROM = `Keelstar <no-reply@mail.${site.domain}>`;

export function getEmailFrom(): string {
  return process.env.EMAIL_FROM?.trim() || DEFAULT_FROM;
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

export type EmailHealth = {
  configured: boolean;
  from: string;
  resendKeySet: boolean;
  warnings: string[];
};

export function getEmailHealth(): EmailHealth {
  const from = getEmailFrom();
  const resendKeySet = Boolean(process.env.RESEND_API_KEY?.trim());
  const warnings: string[] = [];

  if (!resendKeySet) {
    warnings.push("RESEND_API_KEY is not set — transactional emails will not send");
  }

  if (!process.env.EMAIL_FROM?.trim()) {
    warnings.push(`EMAIL_FROM not set — using default ${DEFAULT_FROM}`);
  }

  if (from.includes("tenderledger") && site.domain === "keelstar.com") {
    warnings.push(
      "EMAIL_FROM uses tenderledger.co.uk — switch to no-reply@mail.keelstar.com (dedicated Keelstar Resend domain)"
    );
  }

  return {
    configured: resendKeySet,
    from,
    resendKeySet,
    warnings,
  };
}
