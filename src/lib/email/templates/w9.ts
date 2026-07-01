export type W9EmailVars = {
  organizationName: string;
  vendorName: string;
  dueDate: string;
  message?: string;
  magicLinkUrl: string;
  requesterName?: string;
  rejectionReason?: string;
  workflowUrl?: string;
};

export function vendorW9RequestEmail(vars: W9EmailVars) {
  return {
    subject: `${vars.organizationName} requests your W-9 form`,
    html: `<p>${vars.organizationName} needs your completed W-9 for their records.</p>
      ${vars.message ? `<p>${vars.message}</p>` : ""}
      <p><strong>Due date:</strong> ${vars.dueDate}</p>
      <p><a href="${vars.magicLinkUrl}">Upload W-9 securely</a></p>`,
    templateKey: "vendor_w9_request",
  };
}

export function vendorW9ReminderEmail(vars: W9EmailVars) {
  return {
    subject: `Reminder: ${vars.organizationName} still needs your W-9 form`,
    html: `<p>This is a reminder that ${vars.organizationName} is still waiting for your completed W-9.</p>
      <p><strong>Due date:</strong> ${vars.dueDate}</p>
      <p><a href="${vars.magicLinkUrl}">Upload W-9 securely</a></p>`,
    templateKey: "vendor_w9_reminder",
  };
}

export function vendorW9OverdueEmail(vars: W9EmailVars) {
  return {
    subject: `Overdue: W-9 request from ${vars.organizationName}`,
    html: `<p>Your W-9 request from ${vars.organizationName} is now overdue.</p>
      <p>Please upload your completed W-9 as soon as possible.</p>
      <p><a href="${vars.magicLinkUrl}">Upload W-9 securely</a></p>`,
    templateKey: "vendor_w9_overdue",
  };
}

export function vendorW9CorrectionEmail(vars: W9EmailVars) {
  return {
    subject: `${vars.organizationName} requests an updated W-9 form`,
    html: `<p>${vars.organizationName} needs an updated W-9 from you.</p>
      ${vars.rejectionReason ? `<p><strong>Reason:</strong> ${vars.rejectionReason}</p>` : ""}
      <p><a href="${vars.magicLinkUrl}">Upload updated W-9</a></p>`,
    templateKey: "vendor_w9_correction",
  };
}

export function internalSubmissionReceivedEmail(vars: W9EmailVars & { vendorName: string }) {
  return {
    subject: `${vars.vendorName} submitted a W-9 for review`,
    html: `<p>${vars.vendorName} has submitted a W-9 for ${vars.organizationName}.</p>
      ${vars.workflowUrl ? `<p><a href="${vars.workflowUrl}">Review submission</a></p>` : ""}`,
    templateKey: "internal_submission_received",
  };
}
