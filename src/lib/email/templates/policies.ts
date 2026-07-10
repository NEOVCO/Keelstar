export type PolicyEmailVars = {
  organizationName: string;
  personName: string;
  policyTitle?: string;
  dueDate?: string;
  message?: string;
  magicLinkUrl?: string;
  requesterName?: string;
  acknowledgedAt?: string;
  workflowUrl?: string;
};

export function policyAcknowledgementRequestEmail(vars: PolicyEmailVars) {
  return {
    subject: `${vars.organizationName} requests your policy acknowledgement`,
    html: `<p>${vars.organizationName} needs you to read and acknowledge: <strong>${vars.policyTitle}</strong>.</p>
      ${vars.message ? `<p>${vars.message}</p>` : ""}
      <p><strong>Due date:</strong> ${vars.dueDate}</p>
      <p><a href="${vars.magicLinkUrl}">Review and acknowledge policy</a></p>`,
    templateKey: "policy_ack_request",
  };
}

export function policyAcknowledgementReminderEmail(vars: PolicyEmailVars) {
  return {
    subject: `Reminder: acknowledge ${vars.policyTitle} for ${vars.organizationName}`,
    html: `<p>This is a reminder to acknowledge <strong>${vars.policyTitle}</strong> for ${vars.organizationName}.</p>
      <p><strong>Due date:</strong> ${vars.dueDate}</p>
      <p><a href="${vars.magicLinkUrl}">Review and acknowledge policy</a></p>`,
    templateKey: "policy_ack_reminder",
  };
}

export function policyAcknowledgementOverdueEmail(vars: PolicyEmailVars) {
  return {
    subject: `Overdue: policy acknowledgement for ${vars.organizationName}`,
    html: `<p>Your policy acknowledgement for <strong>${vars.policyTitle}</strong> from ${vars.organizationName} is now overdue.</p>
      <p>Please acknowledge as soon as possible.</p>
      <p><a href="${vars.magicLinkUrl}">Review and acknowledge policy</a></p>`,
    templateKey: "policy_ack_overdue",
  };
}

export function internalPolicyAcknowledgedEmail(vars: PolicyEmailVars) {
  return {
    subject: `${vars.personName} acknowledged ${vars.policyTitle}`,
    html: `<p><strong>${vars.personName}</strong> has acknowledged <strong>${vars.policyTitle}</strong> for ${vars.organizationName}.</p>
      <p><strong>Acknowledged at:</strong> ${vars.acknowledgedAt}</p>
      ${vars.workflowUrl ? `<p><a href="${vars.workflowUrl}">View acknowledgement record</a></p>` : ""}`,
    templateKey: "internal_policy_acknowledged",
  };
}
