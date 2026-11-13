import { readFileSync } from "fs";
import path from "path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { parsePrj } from "@/lib/topologyPrj";
import { getDatasetStatus, setDatasetStatus } from "@/store/datasetStatusStore";
import {
  AUTO_ACCEPT_ON_SUBMIT,
  SIMULATED_VALIDATION_MS,
  getTopologySubmission,
  storeTopologyFile,
  submitForReview,
} from "@/store/topologySubmissionStore";

const load = (file: string) => {
  const r = parsePrj(file, readFileSync(path.resolve(__dirname, "../../public/sample-submissions", file), "utf8"));
  if (!r.ok) throw new Error("sample should parse");
  return r.parsed;
};

describe("simulated acceptance after submit", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("is on by default for the demo", () => {
    expect(AUTO_ACCEPT_ON_SUBMIT).toBe(true);
  });

  it("moves a clean v3 from Pending Acceptance to Accepted after the validation delay", () => {
    storeTopologyFile("T-AUTO", load("612_CVP_Ashford_Reconductor_v3.prj"), { validate: false });
    const onAccepted = vi.fn();
    submitForReview("T-AUTO", 0, { reviewer: "Engineering", onAccepted });
    expect(getDatasetStatus("T-AUTO")).toBe("Pending Acceptance");

    vi.advanceTimersByTime(SIMULATED_VALIDATION_MS - 1);
    expect(getDatasetStatus("T-AUTO")).toBe("Pending Acceptance");
    vi.advanceTimersByTime(1);
    expect(getDatasetStatus("T-AUTO")).toBe("Accepted");
    expect(onAccepted).toHaveBeenCalledOnce();
    expect(getTopologySubmission("T-AUTO")!.activity.at(-1)?.message).toMatch(/Accepted .* by Engineering/);
  });

  it("does not accept if the status changed first", () => {
    storeTopologyFile("T-AUTO-2", load("612_CVP_Ashford_Reconductor_v2.prj"), { validate: false });
    submitForReview("T-AUTO-2", 3, { reviewer: "Engineering" });
    setDatasetStatus("T-AUTO-2", "Review Needed");
    vi.advanceTimersByTime(SIMULATED_VALIDATION_MS);
    expect(getDatasetStatus("T-AUTO-2")).toBe("Review Needed");
  });

  it("can be turned off for manual engineer review", () => {
    storeTopologyFile("T-MANUAL", load("612_CVP_Ashford_Reconductor_v3.prj"), { validate: false });
    submitForReview("T-MANUAL", 0, { reviewer: "Engineering", autoAccept: false });
    vi.advanceTimersByTime(SIMULATED_VALIDATION_MS * 2);
    expect(getDatasetStatus("T-MANUAL")).toBe("Pending Acceptance");
  });
});
