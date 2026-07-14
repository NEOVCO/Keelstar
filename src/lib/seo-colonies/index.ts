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
import type { ColonyLink } from "./types";
import { getColonyFunnelForGuide, isOigColonyGuide } from "./oig-helpers";
import { getW9ColonyFunnelForGuide, isW9ColonyGuide } from "./w9-helpers";

/** Resolve funnel links for any colony guide (OIG or W-9). */
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
  return null;
}
