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
import type { ColonyLink } from "./types";
import { getColonyFunnelForGuide, isOigColonyGuide } from "./oig-helpers";
import { getCoiColonyFunnelForGuide, isCoiColonyGuide } from "./coi-helpers";
import { getW9ColonyFunnelForGuide, isW9ColonyGuide } from "./w9-helpers";
import { getVendorColonyFunnelForGuide, isVendorColonyGuide } from "./vendor-helpers";

/** Resolve funnel links for any colony guide (OIG, W-9, COI, or Vendor). */
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
  if (isVendorColonyGuide(slug)) {
    return { title: "Vendor colony funnel", links: getVendorColonyFunnelForGuide(slug) };
  }
  return null;
}
