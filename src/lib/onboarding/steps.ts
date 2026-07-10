import type { DriveStep } from "driver.js";
import { TOUR_TARGETS } from "@/lib/onboarding/constants";

export type ProductTourStep = DriveStep;

export const PRODUCT_TOUR_STEPS: ProductTourStep[] = [
  {
    element: `#${TOUR_TARGETS.navHome}`,
    popover: {
      title: "Home",
      description:
        "Your dashboard shows what needs attention — overdue workflows, items waiting on others, and recent activity.",
      side: "right",
      align: "start",
    },
  },
  {
    element: `#${TOUR_TARGETS.navInbox}`,
    popover: {
      title: "Inbox",
      description:
        "Tasks assigned to you land here. Review submissions, approve documents, and clear your queue.",
      side: "right",
      align: "start",
    },
  },
  {
    element: `#${TOUR_TARGETS.navWorkflows}`,
    popover: {
      title: "Workflows",
      description:
        "Track every request end to end — W-9 collection, COI tracking, contract renewals, and more.",
      side: "right",
      align: "start",
    },
  },
  {
    element: `#${TOUR_TARGETS.navDocuments}`,
    popover: {
      title: "Documents",
      description:
        "Uploaded files, parsed fields, and versions live here. Review extractions before approving.",
      side: "right",
      align: "start",
    },
  },
  {
    element: `#${TOUR_TARGETS.createMenu}`,
    popover: {
      title: "Create",
      description:
        "Start a workflow, upload a document, add to your directory, or invite a teammate — all from one menu.",
      side: "bottom",
      align: "end",
    },
  },
  {
    element: `#${TOUR_TARGETS.search}`,
    popover: {
      title: "Search",
      description:
        "Jump to workflows, documents, or directory entries instantly. Press ⌘K (or Ctrl+K) from anywhere in the app.",
      side: "bottom",
      align: "end",
    },
  },
];
