export type TrainingEmailVars = {
  organizationName: string;
  personName: string;
  courseName?: string;
  expirationDate?: string;
  workflowUrl?: string;
};

export function internalTrainingExpirationReminderEmail(vars: TrainingEmailVars) {
  return {
    subject: `Training expiring soon: ${vars.courseName} — ${vars.personName}`,
    html: `<p>The training certification <strong>${vars.courseName}</strong> for <strong>${vars.personName}</strong> is approaching expiration.</p>
      <p><strong>Expiration date:</strong> ${vars.expirationDate}</p>
      ${vars.workflowUrl ? `<p><a href="${vars.workflowUrl}">View training record</a></p>` : ""}`,
    templateKey: "internal_training_expiration_reminder",
  };
}
