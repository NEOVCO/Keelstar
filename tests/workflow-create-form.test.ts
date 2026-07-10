import { describe, expect, it } from "vitest";
import { getWorkflowCreateMode } from "@/lib/workflow/createFormConfig";
import { W9_WORKFLOW_TYPE } from "@/lib/w9/constants";
import { COI_WORKFLOW_TYPE } from "@/lib/coi/constants";
import { CONTRACT_WORKFLOW_TYPE } from "@/lib/contracts/constants";

describe("getWorkflowCreateMode", () => {
  it("maps module workflow types to form modes", () => {
    expect(getWorkflowCreateMode(W9_WORKFLOW_TYPE)).toBe("directory_request");
    expect(getWorkflowCreateMode(COI_WORKFLOW_TYPE)).toBe("directory_request");
    expect(getWorkflowCreateMode(CONTRACT_WORKFLOW_TYPE)).toBe("contract");
    expect(getWorkflowCreateMode("policy_acknowledgement")).toBe("people_request");
    expect(getWorkflowCreateMode("training_record")).toBe("people_request");
    expect(getWorkflowCreateMode("exclusion_screening")).toBe("exclusion");
    expect(getWorkflowCreateMode("operational_workflow")).toBe("generic");
  });
});
