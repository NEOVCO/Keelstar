export type ContractEmailVars = {
  organizationName: string;
  contractName: string;
  counterparty?: string;
  renewalDate?: string;
  noticeDeadline?: string;
  workflowUrl?: string;
};

function cta(url?: string) {
  return url ? `<p><a href="${url}">View contract</a></p>` : "";
}

export function contractRenewalReminderEmail(vars: ContractEmailVars) {
  return {
    subject: `Contract renewal approaching: ${vars.contractName}`,
    html: `<p>The contract <strong>${vars.contractName}</strong>${vars.counterparty ? ` with <strong>${vars.counterparty}</strong>` : ""} is approaching its renewal date.</p>
      <p><strong>Renewal date:</strong> ${vars.renewalDate ?? "—"}</p>
      ${cta(vars.workflowUrl)}`,
    templateKey: "contract-renewal-reminder",
  };
}

/** @deprecated */
export const internalContractRenewalReminderEmail = contractRenewalReminderEmail;

export function contractNoticeDeadlineReminderEmail(vars: ContractEmailVars) {
  return {
    subject: `Contract notice deadline approaching: ${vars.contractName}`,
    html: `<p>The notice deadline for <strong>${vars.contractName}</strong>${vars.counterparty ? ` with <strong>${vars.counterparty}</strong>` : ""} is approaching.</p>
      <p><strong>Latest notice date:</strong> ${vars.noticeDeadline ?? "—"}</p>
      ${cta(vars.workflowUrl)}`,
    templateKey: "contract-notice-deadline-reminder",
  };
}

export function contractAutoRenewRiskEmail(vars: ContractEmailVars) {
  return {
    subject: `Auto-renewal risk: ${vars.contractName}`,
    html: `<p><strong>Auto-renewal risk:</strong> The notice window for <strong>${vars.contractName}</strong>${vars.counterparty ? ` with <strong>${vars.counterparty}</strong>` : ""} may have passed.</p>
      <p><strong>Renewal date:</strong> ${vars.renewalDate ?? "—"}</p>
      <p>Review termination options before the contract auto-renews.</p>
      ${cta(vars.workflowUrl)}`,
    templateKey: "contract-auto-renew-risk",
  };
}

export function contractExpiredAlertEmail(vars: ContractEmailVars) {
  return {
    subject: `Contract renewal date passed: ${vars.contractName}`,
    html: `<p>The renewal date for <strong>${vars.contractName}</strong>${vars.counterparty ? ` with <strong>${vars.counterparty}</strong>` : ""} has passed.</p>
      <p><strong>Renewal date:</strong> ${vars.renewalDate ?? "—"}</p>
      ${cta(vars.workflowUrl)}`,
    templateKey: "contract-expired-alert",
  };
}

export function contractOwnerAssignedEmail(vars: ContractEmailVars) {
  return {
    subject: `You have been assigned as owner of ${vars.contractName}`,
    html: `<p>You are now the owner of <strong>${vars.contractName}</strong> at ${vars.organizationName}.</p>
      ${cta(vars.workflowUrl)}`,
    templateKey: "contract-owner-assigned",
  };
}
