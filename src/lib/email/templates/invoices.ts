export type InvoiceEmailVars = {
  organizationName: string;
  vendorName: string;
  invoiceAmount?: string;
  approvalDueDate?: string;
  requesterName?: string;
  workflowUrl?: string;
  rejectionReason?: string;
};

export function invoiceApprovalRequestEmail(vars: InvoiceEmailVars) {
  return {
    subject: `Invoice approval requested — ${vars.vendorName}`,
    html: `<p>${vars.requesterName ?? "A teammate"} submitted an invoice from <strong>${vars.vendorName}</strong> for your approval.</p>
      <p><strong>Amount:</strong> ${vars.invoiceAmount}</p>
      <p><strong>Approval due:</strong> ${vars.approvalDueDate}</p>
      ${vars.workflowUrl ? `<p><a href="${vars.workflowUrl}">Review invoice</a></p>` : ""}`,
    templateKey: "invoice_approval_request",
  };
}

export function invoiceApprovalReminderEmail(vars: InvoiceEmailVars) {
  return {
    subject: `Reminder: approve invoice from ${vars.vendorName}`,
    html: `<p>This invoice from <strong>${vars.vendorName}</strong> (${vars.invoiceAmount}) is still awaiting your approval.</p>
      <p><strong>Due:</strong> ${vars.approvalDueDate}</p>
      ${vars.workflowUrl ? `<p><a href="${vars.workflowUrl}">Review invoice</a></p>` : ""}`,
    templateKey: "invoice_approval_reminder",
  };
}

export function invoiceApprovalOverdueEmail(vars: InvoiceEmailVars) {
  return {
    subject: `Overdue: invoice approval for ${vars.vendorName}`,
    html: `<p>The invoice from <strong>${vars.vendorName}</strong> (${vars.invoiceAmount}) is overdue for approval.</p>
      ${vars.workflowUrl ? `<p><a href="${vars.workflowUrl}">Review invoice now</a></p>` : ""}`,
    templateKey: "invoice_approval_overdue",
  };
}

export function invoiceApprovedEmail(vars: InvoiceEmailVars) {
  return {
    subject: `Invoice approved — ${vars.vendorName}`,
    html: `<p>Your invoice submission for <strong>${vars.vendorName}</strong> (${vars.invoiceAmount}) was approved.</p>
      ${vars.workflowUrl ? `<p><a href="${vars.workflowUrl}">View record</a></p>` : ""}`,
    templateKey: "invoice_approved",
  };
}

export function invoiceRejectedEmail(vars: InvoiceEmailVars) {
  return {
    subject: `Invoice rejected — ${vars.vendorName}`,
    html: `<p>Your invoice submission for <strong>${vars.vendorName}</strong> (${vars.invoiceAmount}) was rejected.</p>
      ${vars.rejectionReason ? `<p><strong>Reason:</strong> ${vars.rejectionReason}</p>` : ""}
      ${vars.workflowUrl ? `<p><a href="${vars.workflowUrl}">View record</a></p>` : ""}`,
    templateKey: "invoice_rejected",
  };
}
