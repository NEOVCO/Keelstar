export type SignerEmailVars = {
  organizationName: string;
  signerName: string;
  documentTitle?: string;
  dueDate?: string;
  message?: string;
  magicLinkUrl?: string;
  requesterName?: string;
  signedAt?: string;
  workflowUrl?: string;
};

export function signerRequestEmail(vars: SignerEmailVars) {
  return {
    subject: `${vars.organizationName} requests your signature`,
    html: `<p>${vars.organizationName} needs your signature on: <strong>${vars.documentTitle}</strong>.</p>
      ${vars.message ? `<p>${vars.message}</p>` : ""}
      <p><strong>Due date:</strong> ${vars.dueDate}</p>
      <p><a href="${vars.magicLinkUrl}">Review and sign document</a></p>`,
    templateKey: "signer_request",
  };
}

export function signerReminderEmail(vars: SignerEmailVars) {
  return {
    subject: `Reminder: sign ${vars.documentTitle} for ${vars.organizationName}`,
    html: `<p>This is a reminder to sign <strong>${vars.documentTitle}</strong> for ${vars.organizationName}.</p>
      <p><strong>Due date:</strong> ${vars.dueDate}</p>
      <p><a href="${vars.magicLinkUrl}">Review and sign document</a></p>`,
    templateKey: "signer_reminder",
  };
}

export function signerOverdueEmail(vars: SignerEmailVars) {
  return {
    subject: `Overdue: signature needed for ${vars.organizationName}`,
    html: `<p>Your signature on <strong>${vars.documentTitle}</strong> from ${vars.organizationName} is now overdue.</p>
      <p>Please sign as soon as possible.</p>
      <p><a href="${vars.magicLinkUrl}">Review and sign document</a></p>`,
    templateKey: "signer_overdue",
  };
}

export function internalDocumentSignedEmail(vars: SignerEmailVars) {
  return {
    subject: `${vars.signerName} signed ${vars.documentTitle}`,
    html: `<p><strong>${vars.signerName}</strong> has signed <strong>${vars.documentTitle}</strong> for ${vars.organizationName}.</p>
      <p><strong>Signed at:</strong> ${vars.signedAt}</p>
      ${vars.workflowUrl ? `<p><a href="${vars.workflowUrl}">View signed document</a></p>` : ""}`,
    templateKey: "internal_document_signed",
  };
}
