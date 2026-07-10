import { describe, expect, it } from "vitest";
import { createTrainingRecordSchema } from "@/lib/training/createRecord";
import { TRAINING_WORKFLOW_TYPE, TRAINING_ENTITLEMENT } from "@/lib/training/constants";
import { computeTrainingMonitoringStatus } from "@/lib/training/expirationMonitor";

describe("training record module", () => {
  it("exports stable workflow constants", () => {
    expect(TRAINING_WORKFLOW_TYPE).toBe("training_record");
    expect(TRAINING_ENTITLEMENT).toBe("training_record");
  });

  it("validates create record input", () => {
    const parsed = createTrainingRecordSchema.parse({
      vendorId: "550e8400-e29b-41d4-a716-446655440000",
      courseName: "HIPAA Privacy",
      provider: "Compliance Co",
    });
    expect(parsed.courseName).toBe("HIPAA Privacy");
  });

  it("computes monitoring status from expiration date", () => {
    const far = new Date();
    far.setDate(far.getDate() + 90);
    expect(computeTrainingMonitoringStatus(far)).toBe("active_monitoring");

    const soon = new Date();
    soon.setDate(soon.getDate() + 10);
    expect(computeTrainingMonitoringStatus(soon)).toBe("expiring_soon");

    const past = new Date();
    past.setDate(past.getDate() - 1);
    expect(computeTrainingMonitoringStatus(past)).toBe("expired");
  });
});
