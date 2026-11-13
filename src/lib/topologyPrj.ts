/**
 * Simulated topology project (.prj) intake for the sales demo.
 *
 * Reads the demo .prj text format used by the sample files in
 * `public/sample-submissions/` and runs a small set of illustrative reliability
 * rules in the browser. This is NOT a production PSS/E parser or validation
 * service. See `DEMO_SUBMISSIONS.md`.
 *
 * Two kinds of result:
 *  - fatal problems (wrong file type, naming convention, malformed structure):
 *    the file is rejected at upload and can't be submitted;
 *  - validation issues (errors / warnings on cells): found after submission
 *    and resolved in the submission detail screen.
 */
import type { FileRow, Issue, PhaseData, RecordType } from "@/components/dashboard/types";

export const PRJ_EXTENSION = ".prj";

/** [Area number]_[Owner abbreviation]_[Description], optional _v2/_v3 suffix. */
export const NAMING_PATTERN = /^(\d{3})_([A-Z]{2,6})_([A-Za-z0-9]+(?:_[A-Za-z0-9]+)*)$/;
export const NAMING_RULE = "[Area #]_[Owner abbreviation]_[Description].prj";
export const NAMING_EXAMPLE = "527_NRE_BoswellTap_Rebuild.prj";

export type FatalKind = "file-type" | "naming" | "format";

export interface FatalProblem {
  kind: FatalKind;
  title: string;
  messages: string[];
}

export interface ParsedPrj {
  fileName: string;
  /** File name without extension and without a trailing _vN version suffix. */
  projectName: string;
  version: number;
  area: string;
  effectiveDate: string;
  description: string;
  rawText: string;
  phases: Record<string, PhaseData>;
  issues: Issue[];
}

export type PrjResult =
  | { ok: true; parsed: ParsedPrj; problem?: undefined }
  | { ok: false; problem: FatalProblem; parsed?: undefined };

const SECTION_COLUMNS: Record<"BUS" | "GENERATOR" | "BRANCH", string[]> = {
  BUS: ["bus", "name", "baskv", "ide", "area", "zone", "vm", "va", "owner"],
  GENERATOR: ["busNumber", "genId", "pgen", "qgen", "pmax", "pmin", "mbase"],
  BRANCH: ["fromBus", "toBus", "circuit", "status", "resistance", "reactance", "charging", "rateA", "rateB", "length"],
};
const TEXT_COLUMNS = new Set(["name", "genId", "circuit"]);
const STANDARD_KV = [69, 115, 138, 161, 230, 345, 500, 765];

const stripExt = (name: string) => name.replace(/\.[^.]+$/, "");
const splitVersion = (base: string) => {
  const m = base.match(/^(.*)_v(\d+)$/i);
  return m ? { project: m[1], version: Number(m[2]) } : { project: base, version: 1 };
};

/** Check the file name only (type + naming convention). */
export function checkFileName(fileName: string): FatalProblem | null {
  if (!fileName.toLowerCase().endsWith(PRJ_EXTENSION)) {
    const ext = fileName.includes(".") ? fileName.slice(fileName.lastIndexOf(".")) : "no extension";
    return {
      kind: "file-type",
      title: "Unsupported file type",
      messages: [`"${fileName}" is a ${ext} file. Topology changesets must be uploaded as ${PRJ_EXTENSION} project files.`],
    };
  }
  const { project } = splitVersion(stripExt(fileName));
  if (!NAMING_PATTERN.test(project)) {
    const hints: string[] = [];
    if (/\s/.test(project)) hints.push("File names can't contain spaces — use underscores.");
    if (!/^\d{3}_/.test(project)) hints.push("Start with the 3-digit area/owner number, e.g. 527_.");
    if (!/^\d{3}_[A-Z]{2,6}_/.test(project)) hints.push("Follow the number with an upper-case owner abbreviation, e.g. 527_NRE_.");
    return {
      kind: "naming",
      title: "File name doesn't follow the naming convention",
      messages: [`Expected ${NAMING_RULE} — for example ${NAMING_EXAMPLE}.`, ...hints],
    };
  }
  return null;
}

const fmt = (msgs: string[]): FatalProblem => ({
  kind: "format",
  title: "Format validation failed",
  messages: msgs,
});

/** Parse and validate a demo .prj file. */
export function parsePrj(fileName: string, text: string): PrjResult {
  const nameProblem = checkFileName(fileName);
  if (nameProblem) return { ok: false, problem: nameProblem };

  const { project, version } = splitVersion(stripExt(fileName));
  const header: Record<string, string> = {};
  const sections: Partial<Record<keyof typeof SECTION_COLUMNS, Record<string, string>[]>> = {};
  const lineOf = new Map<Record<string, string>, number>();
  const problems: string[] = [];

  let current: keyof typeof SECTION_COLUMNS | null = null;
  let expectHeaderRow = false;

  text.split(/\r?\n/).forEach((rawLine, i) => {
    const line = rawLine.trim();
    const n = i + 1;
    if (!line || line.startsWith("#")) return;

    const sec = line.match(/^\[([A-Z]+)\]$/);
    if (sec) {
      if (!(sec[1] in SECTION_COLUMNS)) {
        problems.push(`Line ${n}: unknown section [${sec[1]}]. Allowed: [BUS], [GENERATOR], [BRANCH].`);
        current = null;
        return;
      }
      current = sec[1] as keyof typeof SECTION_COLUMNS;
      sections[current] = [];
      expectHeaderRow = true;
      return;
    }

    if (!current) {
      const kv = line.match(/^([A-Z_]+)=(.*)$/);
      if (kv) header[kv[1]] = kv[2].trim();
      else problems.push(`Line ${n}: expected KEY=value header or a [SECTION], found "${line.slice(0, 40)}".`);
      return;
    }

    const cells = line.split(",").map((c) => c.trim());
    const cols = SECTION_COLUMNS[current];
    if (expectHeaderRow) {
      expectHeaderRow = false;
      if (cells.join(",") !== cols.join(",")) {
        problems.push(`Line ${n}: [${current}] columns must be: ${cols.join(", ")}.`);
      }
      return;
    }
    if (cells.length !== cols.length) {
      problems.push(`Line ${n}: [${current}] record has ${cells.length} values, expected ${cols.length}.`);
      return;
    }
    const rec: Record<string, string> = {};
    cols.forEach((c, idx) => {
      rec[c] = cells[idx];
      if (!TEXT_COLUMNS.has(c) && !Number.isFinite(Number(cells[idx]))) {
        problems.push(`Line ${n}: "${cells[idx]}" in ${c} is not a number.`);
      }
    });
    sections[current]!.push(rec);
    lineOf.set(rec, n);
  });

  for (const key of ["PROJECT", "AREA", "EFFECTIVE_DATE"]) {
    if (!header[key]) problems.push(`Missing required header ${key}=… at the top of the file.`);
  }
  if (header.PROJECT && header.PROJECT !== project) {
    problems.push(`Header PROJECT=${header.PROJECT} doesn't match the file name (${project}).`);
  }
  const areaFromName = project.slice(0, 3);
  if (header.AREA && header.AREA !== areaFromName) {
    problems.push(`Header AREA=${header.AREA} doesn't match the area number in the file name (${areaFromName}).`);
  }
  if (!sections.BUS?.length) problems.push("No [BUS] records found — at least one bus is required.");
  if (!sections.BRANCH?.length) problems.push("No [BRANCH] records found — at least one branch is required.");

  if (problems.length) return { ok: false, problem: fmt(problems.slice(0, 6)) };

  // ---------- Build grid rows + validation issues ----------
  const phaseName = project;
  const rows: FileRow[] = [];
  const busIds = new Set((sections.BUS ?? []).map((b) => b.bus));

  const mark = (row: FileRow, key: string, status: "error" | "warning", message: string) => {
    if (row.cellStatuses[key]?.status === "error") return; // keep the stronger finding
    row.cellStatuses[key] = { status, message };
  };

  (sections.BUS ?? []).forEach((b, idx) => {
    const row: FileRow = {
      id: `BUS-${b.bus}`,
      recordType: "BUS",
      phase: phaseName,
      category: "Bus Data",
      data: {
        cell: String(idx + 1), action: "ADD", bus: b.bus, name: b.name, baskv: Number(b.baskv).toFixed(2),
        ide: b.ide, area: b.area, zone: b.zone, vm: Number(b.vm).toFixed(4), va: Number(b.va).toFixed(2),
        owner: b.owner, nvhi: "1.0500", nvlo: "0.9500", evhi: "1.1000", evlo: "0.9000",
        longName: `${b.name} ${b.baskv}KV`, longitude: "", gneg: "0.0000", bneg: "0.0000",
      },
      cellStatuses: {},
    };
    const vm = Number(b.vm);
    const kv = Number(b.baskv);
    if (!STANDARD_KV.includes(kv)) mark(row, "baskv", "error", `Base kV ${b.baskv} is not a standard nominal voltage (${STANDARD_KV.join(", ")}).`);
    if (vm < 0.95) mark(row, "vm", "error", "Voltage below 0.95 PU violates NERC TPL-001 steady-state criteria");
    else if (vm < 0.97) mark(row, "vm", "warning", "Voltage approaching the 0.95 PU lower limit");
    else if (vm > 1.05) mark(row, "vm", "warning", "Voltage exceeds 1.05 PU upper operating limit");
    rows.push(row);
  });

  (sections.GENERATOR ?? []).forEach((g) => {
    const row: FileRow = {
      id: `GEN-${g.busNumber}-${g.genId}`,
      recordType: "GENERATOR",
      phase: phaseName,
      category: "Generator Data",
      data: { ...g },
      cellStatuses: {},
    };
    const pgen = Number(g.pgen), pmax = Number(g.pmax), pmin = Number(g.pmin), qgen = Number(g.qgen), mbase = Number(g.mbase);
    if (!busIds.has(g.busNumber)) mark(row, "busNumber", "error", `Generator is connected to bus ${g.busNumber}, which is not defined in this project.`);
    if (pgen > pmax) mark(row, "pgen", "error", `PGEN exceeds PMAX by ${pgen - pmax} MW — generator dispatch infeasible`);
    if (pmin > pmax) mark(row, "pmin", "error", "PMIN is greater than PMAX");
    if (qgen > 0.3 * mbase) mark(row, "qgen", "warning", "Reactive output near capability curve limit at this MW dispatch");
    rows.push(row);
  });

  (sections.BRANCH ?? []).forEach((br) => {
    const rateA = Number(br.rateA), rateB = Number(br.rateB);
    const row: FileRow = {
      id: `BR-${br.fromBus}-${br.toBus}-${br.circuit}`,
      recordType: "BRANCH",
      phase: phaseName,
      category: "Branch Data",
      data: { ...br, r0: "", x0: "", b0: "", meteredEnd: "From" },
      cellStatuses: {},
      seasonalRatings: [
        { season: "Summer", normalHigh: rateA, emergencyHigh: rateB },
        { season: "Winter", normalHigh: +(rateA * 1.08).toFixed(1), emergencyHigh: +(rateB * 1.08).toFixed(1) },
        { season: "Shoulder (Sp/Fa)", normalHigh: +(rateA * 1.03).toFixed(1), emergencyHigh: +(rateB * 1.03).toFixed(1) },
      ],
    };
    if (!busIds.has(br.fromBus)) mark(row, "fromBus", "error", `From bus ${br.fromBus} is not defined in this project.`);
    if (!busIds.has(br.toBus)) mark(row, "toBus", "error", `To bus ${br.toBus} is not defined in this project.`);
    if (br.status !== "0" && br.status !== "1") mark(row, "status", "error", "Status must be 1 (in service) or 0 (out of service).");
    if (rateB < rateA) mark(row, "rateB", "error", "Emergency rating (Rate B) is below the normal rating (Rate A).");
    const x = Number(br.reactance);
    if (x > 0 && Number(br.resistance) / x > 0.12) mark(row, "resistance", "warning", "R/X ratio exceeds typical range for this voltage class");
    rows.push(row);
  });

  const issues: Issue[] = rows.flatMap((row) =>
    Object.entries(row.cellStatuses).map(([key, cs]) => ({
      id: `ISS-${row.id}-${key}`,
      rowId: row.id,
      cellKey: key,
      recordType: row.recordType as RecordType,
      phase: phaseName,
      category: row.category!,
      fieldName: key,
      status: cs.status as "error" | "warning",
      message: cs.message ?? "",
      dismissed: false,
    })),
  );

  const phases: Record<string, PhaseData> = {
    [phaseName]: {
      metadata: {
        name: phaseName,
        effectiveDate: header.EFFECTIVE_DATE,
        comments: header.DESCRIPTION ?? "",
      },
      rows,
    },
  };

  return {
    ok: true,
    parsed: {
      fileName,
      projectName: project,
      version,
      area: header.AREA,
      effectiveDate: header.EFFECTIVE_DATE,
      description: header.DESCRIPTION ?? "",
      rawText: text,
      phases,
      issues,
    },
  };
}

export const countIssues = (issues: Issue[]) => ({
  errors: issues.filter((i) => i.status === "error" && !i.dismissed).length,
  warnings: issues.filter((i) => i.status === "warning" && !i.dismissed).length,
});
