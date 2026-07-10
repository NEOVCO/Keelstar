import { getEmailHealth } from "@/lib/email/config";

export async function GET() {
  const email = getEmailHealth();

  return Response.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "keelstar-web",
    email: {
      configured: email.configured,
      from: email.from,
      warnings: email.warnings,
    },
  });
}
