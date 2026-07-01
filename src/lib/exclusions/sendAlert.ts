import { sendEmail } from "@/lib/email/sendEmail";
import { createAuditLog } from "@/lib/audit/createAuditLog";

export async function sendPotentialMatchAlert(args: {
  organizationId: string;
  subjectName: string;
  resultId: string;
  ownerEmail: string;
}) {
  const resultUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "https://www.keelstar.com"}/app/exclusions/results/${args.resultId}`;

  await sendEmail({
    organizationId: args.organizationId,
    to: args.ownerEmail,
    templateKey: "monitor_alert",
    subject: `Potential exclusion match found for ${args.subjectName}`,
    variables: {
      organizationName: "your organization",
      monitorName: "Exclusion screening",
      message: `A potential match was found for ${args.subjectName}. Review: ${resultUrl}`,
    },
  });

  await createAuditLog({
    organizationId: args.organizationId,
    actorType: "system",
    action: "exclusion_alert.sent",
    targetType: "screening_result",
    targetId: args.resultId,
    metadata: { recipient: args.ownerEmail },
  });
}
