export type VendorPacketEmailVars = {
  organizationName: string;
  vendorName: string;
  dueDate?: string;
  message?: string;
  portalUrl?: string;
  itemCount?: number;
  itemLabel?: string;
  workflowUrl?: string;
  progressPercent?: number;
};

export function vendorPacketPortalEmail(vars: VendorPacketEmailVars) {
  return {
    subject: `${vars.organizationName} — vendor onboarding documents requested`,
    html: `<p><strong>${vars.organizationName}</strong> has requested onboarding documents from you.</p>
      <p>Please upload ${vars.itemCount ?? "the required"} document(s) through the secure vendor portal.</p>
      ${vars.dueDate ? `<p><strong>Due date:</strong> ${vars.dueDate}</p>` : ""}
      ${vars.message ? `<p>${vars.message}</p>` : ""}
      ${vars.portalUrl ? `<p><a href="${vars.portalUrl}">Open vendor portal</a></p>` : ""}`,
    templateKey: "vendor-packet-portal-request",
  };
}

export function vendorPacketReminderEmail(vars: VendorPacketEmailVars) {
  return {
    subject: `Reminder: vendor documents due for ${vars.organizationName}`,
    html: `<p>This is a reminder to complete your vendor onboarding documents for <strong>${vars.organizationName}</strong>.</p>
      ${vars.dueDate ? `<p><strong>Due date:</strong> ${vars.dueDate}</p>` : ""}
      ${vars.portalUrl ? `<p><a href="${vars.portalUrl}">Open vendor portal</a></p>` : ""}`,
    templateKey: "vendor-packet-reminder",
  };
}

export function vendorPacketOverdueEmail(vars: VendorPacketEmailVars) {
  return {
    subject: `Overdue: vendor documents for ${vars.organizationName}`,
    html: `<p>Your vendor onboarding documents for <strong>${vars.organizationName}</strong> are overdue.</p>
      ${vars.dueDate ? `<p><strong>Due date was:</strong> ${vars.dueDate}</p>` : ""}
      ${vars.portalUrl ? `<p><a href="${vars.portalUrl}">Open vendor portal</a></p>` : ""}`,
    templateKey: "vendor-packet-overdue",
  };
}

export function internalVendorPacketItemUploadedEmail(vars: VendorPacketEmailVars) {
  return {
    subject: `Vendor uploaded: ${vars.itemLabel} (${vars.vendorName})`,
    html: `<p><strong>${vars.vendorName}</strong> uploaded <strong>${vars.itemLabel}</strong>.</p>
      ${vars.progressPercent != null ? `<p>Packet progress: ${vars.progressPercent}%</p>` : ""}
      ${vars.workflowUrl ? `<p><a href="${vars.workflowUrl}">Review packet</a></p>` : ""}`,
    templateKey: "vendor-packet-item-uploaded",
  };
}

export function internalVendorPacketCompleteEmail(vars: VendorPacketEmailVars) {
  return {
    subject: `Vendor packet complete: ${vars.vendorName}`,
    html: `<p>All required documents have been uploaded for <strong>${vars.vendorName}</strong>.</p>
      ${vars.workflowUrl ? `<p><a href="${vars.workflowUrl}">Review and complete packet</a></p>` : ""}`,
    templateKey: "vendor-packet-complete",
  };
}
