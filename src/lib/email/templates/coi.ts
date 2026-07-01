export type CoiEmailVars = {
  organizationName: string;
  vendorName: string;
  dueDate?: string;
  message?: string;
  magicLinkUrl?: string;
  requesterName?: string;
  rejectionReason?: string;
  workflowUrl?: string;
  expirationDate?: string;
};

export function vendorCoiRequestEmail(vars: CoiEmailVars) {
  return {
    subject: `${vars.organizationName} requests your certificate of insurance`,
    html: `<p>${vars.organizationName} needs your certificate of insurance for their records.</p>
      ${vars.message ? `<p>${vars.message}</p>` : ""}
      <p><strong>Due date:</strong> ${vars.dueDate}</p>
      <p><a href="${vars.magicLinkUrl}">Upload certificate securely</a></p>`,
    templateKey: "vendor_coi_request",
  };
}

export function vendorCoiReminderEmail(vars: CoiEmailVars) {
  return {
    subject: `Reminder: ${vars.organizationName} still needs your certificate of insurance`,
    html: `<p>This is a reminder that ${vars.organizationName} is still waiting for your certificate of insurance.</p>
      <p><strong>Due date:</strong> ${vars.dueDate}</p>
      <p><a href="${vars.magicLinkUrl}">Upload certificate securely</a></p>`,
    templateKey: "vendor_coi_reminder",
  };
}

export function vendorCoiOverdueEmail(vars: CoiEmailVars) {
  return {
    subject: `Overdue: COI request from ${vars.organizationName}`,
    html: `<p>Your certificate of insurance request from ${vars.organizationName} is now overdue.</p>
      <p>Please upload your certificate as soon as possible.</p>
      <p><a href="${vars.magicLinkUrl}">Upload certificate securely</a></p>`,
    templateKey: "vendor_coi_overdue",
  };
}

export function vendorCoiCorrectionEmail(vars: CoiEmailVars) {
  return {
    subject: `${vars.organizationName} requests an updated certificate of insurance`,
    html: `<p>${vars.organizationName} needs an updated certificate of insurance from you.</p>
      ${vars.rejectionReason ? `<p><strong>Reason:</strong> ${vars.rejectionReason}</p>` : ""}
      <p><a href="${vars.magicLinkUrl}">Upload updated certificate</a></p>`,
    templateKey: "vendor_coi_correction",
  };
}

export function internalCoiSubmissionReceivedEmail(vars: CoiEmailVars) {
  return {
    subject: `${vars.vendorName} submitted a COI for review`,
    html: `<p>${vars.vendorName} has submitted a certificate of insurance for ${vars.organizationName}.</p>
      ${vars.workflowUrl ? `<p><a href="${vars.workflowUrl}">Review submission</a></p>` : ""}`,
    templateKey: "internal_coi_submission_received",
  };
}

export function internalCoiExpirationReminderEmail(vars: CoiEmailVars) {
  return {
    subject: `COI expiring soon for ${vars.vendorName}`,
    html: `<p>The certificate of insurance for ${vars.vendorName} is approaching expiration.</p>
      <p><strong>Expiration date:</strong> ${vars.expirationDate}</p>
      ${vars.workflowUrl ? `<p><a href="${vars.workflowUrl}">View COI</a></p>` : ""}`,
    templateKey: "internal_coi_expiration_reminder",
  };
}

export function vendorCoiRenewalRequestEmail(vars: CoiEmailVars) {
  return {
    subject: `${vars.organizationName} requests an updated certificate of insurance`,
    html: `<p>${vars.organizationName} needs an updated certificate of insurance before your current coverage expires.</p>
      <p><strong>Expiration date:</strong> ${vars.expirationDate}</p>
      <p><a href="${vars.magicLinkUrl}">Upload updated certificate</a></p>`,
    templateKey: "vendor_coi_renewal_request",
  };
}
