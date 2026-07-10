export const FREE_TIER_LIMITS = {
  vendors: 5,
  w9RequestsPerMonth: 5,
  coiRequestsPerMonth: 3,
  coiActiveRecords: 3,
  contractActiveRecords: 3,
  vendorPacketRequestsPerMonth: 3,
  vendorPacketActive: 3,
  exclusionChecksPerMonth: 5,
  exclusionActiveMonitors: 1,
  policyRequestsPerMonth: 3,
  policyActiveRecords: 5,
  trainingActiveRecords: 5,
  invoiceActiveRecords: 5,
  invoiceSubmissionsPerMonth: 5,
  signerRequestsPerMonth: 3,
  signerActiveRecords: 5,
  contractRiskScansPerMonth: 3,
  contractRiskActiveRecords: 5,
  teamMembers: 1,
} as const;

export const PAID_TIER_LIMITS = {
  vendors: Infinity,
  w9RequestsPerMonth: Infinity,
  coiRequestsPerMonth: Infinity,
  coiActiveRecords: Infinity,
  contractActiveRecords: Infinity,
  vendorPacketRequestsPerMonth: Infinity,
  vendorPacketActive: Infinity,
  exclusionChecksPerMonth: Infinity,
  exclusionActiveMonitors: Infinity,
  policyRequestsPerMonth: Infinity,
  policyActiveRecords: Infinity,
  trainingActiveRecords: Infinity,
  invoiceActiveRecords: Infinity,
  invoiceSubmissionsPerMonth: Infinity,
  signerRequestsPerMonth: Infinity,
  signerActiveRecords: Infinity,
  contractRiskScansPerMonth: Infinity,
  contractRiskActiveRecords: Infinity,
  teamMembers: 5,
} as const;

export const W9_ENTITLEMENT = "w9_collector";
export const COI_ENTITLEMENT = "coi_tracker";
export const CONTRACT_ENTITLEMENT = "contract_renewal";
export const VENDOR_PACKET_ENTITLEMENT = "vendor_packet";
export const EXCLUSION_ENTITLEMENT = "exclusion_monitor";
export const POLICY_ENTITLEMENT = "policy_acknowledgement";
export const TRAINING_ENTITLEMENT = "training_record";
export const INVOICE_ENTITLEMENT = "invoice_approval";
export const SIGNER_ENTITLEMENT = "simple_signer";
export const CONTRACT_RISK_ENTITLEMENT = "contract_risk_scanner";
