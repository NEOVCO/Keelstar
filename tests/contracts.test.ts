import { describe, it, expect } from "vitest";
import {
  CONTRACT_WORKFLOW_TYPE,
  CONTRACT_DOCUMENT_TYPE,
  CONTRACT_MONITOR_TYPE,
  CONTRACT_REQUIRED_FIELDS,
  CONTRACT_RENEWAL_APPROACHING_DAYS,
  CONTRACT_NOTICE_WINDOW_DAYS,
  CONTRACT_RENEWAL_REMINDER_WINDOWS,
  CONTRACT_NOTICE_REMINDER_WINDOWS,
} from "@/lib/contracts/constants";
import { buildContractStoragePath } from "@/lib/contracts/uploadContract";
import {
  daysUntilRenewal,
  computeContractMonitoringStatus,
  normalizeContractStatus,
} from "@/lib/contracts/renewalMonitor";
import {
  computeLatestNoticeDate,
  daysUntilDate,
  parseAutoRenews,
  parseNoticePeriodDays,
} from "@/lib/contracts/noticeDate";
import { FREE_TIER_LIMITS, CONTRACT_ENTITLEMENT } from "@/lib/billing/limits";

describe("Contract constants", () => {
  it("defines workflow and monitor types", () => {
    expect(CONTRACT_WORKFLOW_TYPE).toBe("contract_renewal");
    expect(CONTRACT_DOCUMENT_TYPE).toBe("contract");
    expect(CONTRACT_MONITOR_TYPE).toBe("contract_renewal");
  });

  it("requires renewal_date and contract_name", () => {
    expect(CONTRACT_REQUIRED_FIELDS).toContain("renewal_date");
    expect(CONTRACT_REQUIRED_FIELDS).toContain("contract_name");
  });

  it("defines dual reminder pipelines with 6 windows each", () => {
    expect(CONTRACT_RENEWAL_REMINDER_WINDOWS).toHaveLength(6);
    expect(CONTRACT_NOTICE_REMINDER_WINDOWS).toHaveLength(6);
    expect(CONTRACT_RENEWAL_REMINDER_WINDOWS[0].type).toBe("contract_renewal_internal");
    expect(CONTRACT_NOTICE_REMINDER_WINDOWS[0].type).toBe("contract_notice_internal");
  });
});

describe("Contract storage path", () => {
  it("builds tenant-scoped path", () => {
    const path = buildContractStoragePath("org", "wf", "doc", 1, "agreement.pdf");
    expect(path).toContain("organizations/org/contracts");
  });
});

describe("Notice date computation", () => {
  it("calculates latest_notice_date from renewal and notice period", () => {
    const renewal = new Date(2027, 0, 1);
    const notice = computeLatestNoticeDate(renewal, 60);
    expect(notice.getFullYear()).toBe(2026);
    expect(notice.getMonth()).toBe(10);
    expect(notice.getDate()).toBe(2);
  });

  it("parses notice period from either field key", () => {
    expect(parseNoticePeriodDays({ notice_period_days: "30" })).toBe(30);
    expect(parseNoticePeriodDays({ termination_notice_days: "45" })).toBe(45);
  });

  it("parses auto-renewal boolean strings", () => {
    expect(parseAutoRenews("yes")).toBe(true);
    expect(parseAutoRenews("no")).toBe(false);
  });
});

describe("Contract renewal status", () => {
  it("marks renewal approaching within 30 days", () => {
    const d = new Date();
    d.setDate(d.getDate() + CONTRACT_RENEWAL_APPROACHING_DAYS - 5);
    expect(computeContractMonitoringStatus(d, null, false)).toBe("renewal_approaching");
  });

  it("marks expired after renewal date", () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    expect(computeContractMonitoringStatus(d, null, false)).toBe("expired");
    expect(daysUntilRenewal(d)).toBeLessThan(0);
  });

  it("marks notice_window_open when notice date within 30 days", () => {
    const renewal = new Date();
    renewal.setDate(renewal.getDate() + 90);
    const notice = new Date();
    notice.setDate(notice.getDate() + CONTRACT_NOTICE_WINDOW_DAYS - 3);
    expect(computeContractMonitoringStatus(renewal, notice, false)).toBe("notice_window_open");
  });

  it("marks auto_renew_risk when notice passed and auto-renews", () => {
    const renewal = new Date();
    renewal.setDate(renewal.getDate() + 30);
    const notice = new Date();
    notice.setDate(notice.getDate() - 1);
    expect(computeContractMonitoringStatus(renewal, notice, true)).toBe("auto_renew_risk");
  });

  it("normalizes legacy statuses", () => {
    expect(normalizeContractStatus("active_monitoring")).toBe("renewal_monitoring");
    expect(normalizeContractStatus("expiring_soon")).toBe("renewal_approaching");
    expect(normalizeContractStatus("completed")).toBe("renewed");
  });
});

describe("Contract billing", () => {
  it("defines free tier limits", () => {
    expect(FREE_TIER_LIMITS.contractActiveRecords).toBe(3);
    expect(CONTRACT_ENTITLEMENT).toBe("contract_renewal");
  });
});

describe("daysUntilDate", () => {
  it("returns positive days for future dates", () => {
    const future = new Date();
    future.setDate(future.getDate() + 10);
    expect(daysUntilDate(future)).toBe(10);
  });
});
