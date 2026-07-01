/** Stable DOM ids for product tour anchors — keep in sync with nav/shell markup. */
export const TOUR_TARGETS = {
  navHome: "tour-nav-home",
  navInbox: "tour-nav-inbox",
  navWorkflows: "tour-nav-workflows",
  navDocuments: "tour-nav-documents",
  navMonitors: "tour-nav-monitors",
  createMenu: "tour-create-menu",
  search: "tour-search",
  dashboardMain: "tour-dashboard-main",
} as const;

export type TourTargetId = (typeof TOUR_TARGETS)[keyof typeof TOUR_TARGETS];

export const PRODUCT_TOUR_START_EVENT = "keelstar:product-tour-start";

/** Map primary workspace nav hrefs to tour anchor ids. */
export const NAV_HREF_TOUR_IDS: Record<string, TourTargetId> = {
  "/app": TOUR_TARGETS.navHome,
  "/app/inbox": TOUR_TARGETS.navInbox,
  "/app/workflows": TOUR_TARGETS.navWorkflows,
  "/app/documents": TOUR_TARGETS.navDocuments,
  "/app/monitors": TOUR_TARGETS.navMonitors,
};
