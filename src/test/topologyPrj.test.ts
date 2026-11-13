import { readFileSync } from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { countIssues, parsePrj } from "@/lib/topologyPrj";

const SAMPLES = path.resolve(__dirname, "../../public/sample-submissions");
const load = (name: string) => parsePrj(name, readFileSync(path.join(SAMPLES, name), "utf8"));

describe("demo .prj sample files", () => {
  it("happy path passes every rule", () => {
    const r = load("527_NRE_BoswellTap_Rebuild.prj");
    expect(r.ok).toBe(true);
    if (r.ok) expect(countIssues(r.parsed.issues)).toEqual({ errors: 0, warnings: 0 });
  });

  it("version 1 needs review: required and optional fixes", () => {
    const r = load("612_CVP_Ashford_Reconductor.prj");
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(countIssues(r.parsed.issues)).toEqual({ errors: 4, warnings: 3 });
      expect(r.parsed.version).toBe(1);
    }
  });

  it("version 2 clears every required fix, optional fixes remain", () => {
    const r = load("612_CVP_Ashford_Reconductor_v2.prj");
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(countIssues(r.parsed.issues)).toEqual({ errors: 0, warnings: 3 });
      expect(r.parsed.projectName).toBe("612_CVP_Ashford_Reconductor");
      expect(r.parsed.version).toBe(2);
    }
  });

  it("version 3 corrects the optional fixes too", () => {
    const r = load("612_CVP_Ashford_Reconductor_v3.prj");
    expect(r.ok).toBe(true);
    if (r.ok) expect(countIssues(r.parsed.issues)).toEqual({ errors: 0, warnings: 0 });
  });

  it("rejects a file name that breaks the naming convention", () => {
    const r = load("Ashford reconductor FINAL.prj");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.problem.kind).toBe("naming");
  });

  it("rejects the wrong file type", () => {
    const r = load("612_CVP_Ashford_Reconductor.csv");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.problem.kind).toBe("file-type");
  });

  it("rejects a malformed file with line-level messages", () => {
    const r = load("614_CVP_Bellmont_Tap.prj");
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.problem.kind).toBe("format");
      expect(r.problem.messages.join(" ")).toMatch(/not a number/);
      expect(r.problem.messages.join(" ")).toMatch(/EFFECTIVE_DATE/);
    }
  });
});
