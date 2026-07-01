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
  teamMembers: 5,
} as const;

export const W9_ENTITLEMENT = "w9_collector";
export const COI_ENTITLEMENT = "coi_tracker";
export const CONTRACT_ENTITLEMENT = "contract_renewal";
export const VENDOR_PACKET_ENTITLEMENT = "vendor_packet";
export const EXCLUSION_ENTITLEMENT = "exclusion_monitor";
