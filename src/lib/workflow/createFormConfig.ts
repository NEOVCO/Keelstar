import { W9_WORKFLOW_TYPE } from "@/lib/w9/constants";
import { COI_WORKFLOW_TYPE } from "@/lib/coi/constants";
import { VENDOR_PACKET_WORKFLOW_TYPE } from "@/lib/vendor-packets/constants";
import { CONTRACT_WORKFLOW_TYPE } from "@/lib/contracts/constants";
import { EXCLUSION_WORKFLOW_TYPE } from "@/lib/exclusions/constants";
import { OPERATIONAL_WORKFLOW_TYPE } from "@/lib/workflow/constants";

export type WorkflowCreateMode =
  | "generic"
  | "directory_request"
  | "vendor_packet"
  | "contract"
  | "people_request"
  | "exclusion";

const DIRECTORY_REQUEST_TYPES = new Set([W9_WORKFLOW_TYPE, COI_WORKFLOW_TYPE]);
const PEOPLE_REQUEST_TYPES = new Set(["policy_acknowledgement", "training_record"]);

export function getWorkflowCreateMode(workflowType: string): WorkflowCreateMode {
  if (DIRECTORY_REQUEST_TYPES.has(workflowType)) return "directory_request";
  if (workflowType === VENDOR_PACKET_WORKFLOW_TYPE) return "vendor_packet";
  if (workflowType === CONTRACT_WORKFLOW_TYPE) return "contract";
  if (PEOPLE_REQUEST_TYPES.has(workflowType)) return "people_request";
  if (workflowType === EXCLUSION_WORKFLOW_TYPE || workflowType === "exclusion_monitoring") {
    return "exclusion";
  }
  return "generic";
}

export function usesAutoTitle(mode: WorkflowCreateMode): boolean {
  return mode !== "generic" && mode !== "contract";
}

export function defaultTitleForParty(
  workflowType: string,
  partyName: string
): string {
  switch (workflowType) {
    case W9_WORKFLOW_TYPE:
      return `W-9 — ${partyName}`;
    case COI_WORKFLOW_TYPE:
      return `COI — ${partyName}`;
    case VENDOR_PACKET_WORKFLOW_TYPE:
      return `Vendor packet — ${partyName}`;
    case "policy_acknowledgement":
      return `Policy acknowledgement — ${partyName}`;
    case "training_record":
      return `Training record — ${partyName}`;
    case EXCLUSION_WORKFLOW_TYPE:
    case "exclusion_monitoring":
      return `Exclusion check — ${partyName}`;
    default:
      return partyName;
  }
}

export { OPERATIONAL_WORKFLOW_TYPE };
