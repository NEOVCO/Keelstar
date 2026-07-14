export type { ColonyDefinition, ColonyLink, ColonyPage, ColonyTier } from "./types";
export {
  oigColony,
  OIG_HUB_COLONY_GUIDES,
  OIG_PAGES,
} from "./oig-colony";
export {
  getOigColonyPage,
  getColonyFunnelForGuide,
  isOigColonyGuide,
} from "./oig-helpers";
export {
  w9Colony,
  W9_HUB_COLONY_GUIDES,
  W9_PAGES,
} from "./w9-colony";
export {
  W9_HUB,
  W9_PRODUCT,
  W9_HEAD_SOLUTION,
  W9_HEAD_TOOL,
} from "./w9";
export {
  getW9ColonyPage,
  getW9ColonyFunnelForGuide,
  isW9ColonyGuide,
} from "./w9-helpers";
export {
  coiColony,
  COI_HUB_COLONY_GUIDES,
  COI_PAGES,
} from "./coi-colony";
export {
  COI_HUB,
  COI_PRODUCT,
  COI_HEAD_SOLUTION,
  COI_HEAD_TOOL,
} from "./coi";
export {
  getCoiColonyPage,
  getCoiColonyFunnelForGuide,
  isCoiColonyGuide,
} from "./coi-helpers";
export {
  vendorColony,
  VENDOR_HUB_COLONY_GUIDES,
  VENDOR_PAGES,
} from "./vendor-colony";
export {
  VENDOR_HUB,
  VENDOR_PRODUCT,
  VENDOR_HEAD_SOLUTION,
  VENDOR_HEAD_TOOL,
} from "./vendor";
export {
  getVendorColonyPage,
  getVendorColonyFunnelForGuide,
  isVendorColonyGuide,
} from "./vendor-helpers";
export {
  contractColony,
  CONTRACT_HUB_COLONY_GUIDES,
  CONTRACT_PAGES,
} from "./contract-colony";
export {
  CONTRACT_HUB,
  CONTRACT_PRODUCT,
  CONTRACT_HEAD_SOLUTION,
  CONTRACT_HEAD_TOOL,
} from "./contract";
export {
  getContractColonyPage,
  getContractColonyFunnelForGuide,
  isContractColonyGuide,
} from "./contract-helpers";
export {
  portalColony,
  PORTAL_HUB_COLONY_GUIDES,
  PORTAL_PAGES,
} from "./portal-colony";
export {
  PORTAL_HUB,
  PORTAL_PRODUCT,
  PORTAL_HEAD_SOLUTION,
  PORTAL_HEAD_TOOL,
} from "./portal";
export {
  getPortalColonyPage,
  getPortalColonyFunnelForGuide,
  isPortalColonyGuide,
} from "./portal-helpers";
export {
  complianceColony,
  COMPLIANCE_HUB_COLONY_GUIDES,
  COMPLIANCE_PAGES,
} from "./compliance-colony";
export {
  COMPLIANCE_HUB,
  COMPLIANCE_PRODUCT,
  COMPLIANCE_HEAD_SOLUTION,
  COMPLIANCE_HEAD_TOOL,
} from "./compliance";
export {
  getComplianceColonyPage,
  getComplianceColonyFunnelForGuide,
  isComplianceColonyGuide,
} from "./compliance-helpers";
import type { ColonyLink } from "./types";
import { getColonyFunnelForGuide, isOigColonyGuide } from "./oig-helpers";
import { getCoiColonyFunnelForGuide, isCoiColonyGuide } from "./coi-helpers";
import { getW9ColonyFunnelForGuide, isW9ColonyGuide } from "./w9-helpers";
import { getVendorColonyFunnelForGuide, isVendorColonyGuide } from "./vendor-helpers";
import { getContractColonyFunnelForGuide, isContractColonyGuide } from "./contract-helpers";
import { getPortalColonyFunnelForGuide, isPortalColonyGuide } from "./portal-helpers";
import { getComplianceColonyFunnelForGuide, isComplianceColonyGuide } from "./compliance-helpers";

/** Resolve funnel links for any colony guide. */
export function getAnyColonyFunnelForGuide(slug: string): {
  title: string;
  links: ColonyLink[];
} | null {
  if (isOigColonyGuide(slug)) {
    return { title: "OIG colony funnel", links: getColonyFunnelForGuide(slug) };
  }
  if (isW9ColonyGuide(slug)) {
    return { title: "W-9 colony funnel", links: getW9ColonyFunnelForGuide(slug) };
  }
  if (isCoiColonyGuide(slug)) {
    return { title: "COI colony funnel", links: getCoiColonyFunnelForGuide(slug) };
  }
  // Portal and compliance before vendor — shared guide slugs prefer the more specific hub.
  if (isPortalColonyGuide(slug)) {
    return { title: "Vendor portal colony funnel", links: getPortalColonyFunnelForGuide(slug) };
  }
  if (isComplianceColonyGuide(slug)) {
    return { title: "Vendor compliance colony funnel", links: getComplianceColonyFunnelForGuide(slug) };
  }
  if (isVendorColonyGuide(slug)) {
    return { title: "Vendor colony funnel", links: getVendorColonyFunnelForGuide(slug) };
  }
  if (isContractColonyGuide(slug)) {
    return { title: "Contract colony funnel", links: getContractColonyFunnelForGuide(slug) };
  }
  return null;
}
