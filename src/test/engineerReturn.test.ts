import { readFileSync } from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { parsePrj } from "@/lib/topologyPrj";
import { getDatasetStatus, setDatasetStatus } from "@/store/datasetStatusStore";
import {
  acceptSubmission,
  getTopologySubmission,
  markSubmittedAsIs,
  returnSubmission,
  storeTopologyFile,
} from "@/store/topologySubmissionStore";

const file = "612_CVP_Ashford_Reconductor_v2.prj";
const parsed = () => {
  const r = parsePrj(file, readFileSync(path.resolve(__dirname, "../../public/sample-submissions", file), "utf8"));
  if (!r.ok) throw new Error("sample should parse");
  return r.parsed;
};

describe("engineer review of a submission with accepted warnings", () => {
  it("returns it to Review Needed with a traceable comment", () => {
    storeTopologyFile("T-RET", parsed(), { validate: false });
    markSubmittedAsIs("T-RET", 3);
    setDatasetStatus("T-RET", "Pending Acceptance");

    returnSubmission("T-RET", "Confirm the 61205 voltage setpoint with operations.", "Engineer");

    expect(getDatasetStatus("T-RET")).toBe("Review Needed");
    const sub = getTopologySubmission("T-RET")!;
    expect(sub.returnNote?.note).toMatch(/61205 voltage/);
    expect(sub.returnNote?.revision).toBe(sub.revision);
    expect(sub.activity.some((a) => a.type === "comment" && a.user === "Engineer")).toBe(true);
  });

  it("accepts it for the model build", () => {
    storeTopologyFile("T-ACC", parsed(), { validate: false });
    setDatasetStatus("T-ACC", "Pending Acceptance");
    acceptSubmission("T-ACC", "Engineer");
    expect(getDatasetStatus("T-ACC")).toBe("Accepted");
    expect(getTopologySubmission("T-ACC")!.activity.at(-1)?.message).toMatch(/Accepted/);
  });
});
