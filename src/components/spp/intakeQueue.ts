import { mockChangeset } from "@/components/topology/mockChangeset";
import { mockRatingsDirectory } from "@/components/topology/mockRatingsDirectory";
import { mockProfileProjects } from "@/components/topology/mockProfileSeries";
import type { DatasetStatus } from "@/components/submission/datasetStatus";

export type Footprint = "EAST" | "WEST";

export interface IntakeRow {
  /** Submission id shared with the participant directories. */
  id: string;
  fileName: string;
  kind: "Topology (.prj)" | "BLG Profile (.raw)" | "Ratings (.csv)";
  submitter: string;
  submittedOn: string;
  footprint: Footprint;
  /** Null when the file passed validation. */
  validationError: string | null;
  baseStatus: DatasetStatus;
}

const toStatus = (s: string): DatasetStatus =>
  s === "Accepted" || s === "Rejected" || s === "Draft" ? (s as DatasetStatus) : "Review Needed";

/** Deterministic validation exceptions seeded onto three incoming files. */
const TOPOLOGY_ERRORS: Record<number, string> = { 1: "Line 42 Reactance Error" };
const PROFILE_ERRORS: Record<number, string> = { 0: "Line 118 Missing Bus Reference" };
const RATINGS_ERRORS: Record<number, string> = { 0: "Line 9 Season Code Mismatch" };

const topology: IntakeRow[] = mockChangeset.slice(0, 5).map((r, i) => ({
  id: r.id,
  fileName: `${r.projectName}.prj`,
  kind: "Topology (.prj)",
  submitter: r.submitter,
  submittedOn: r.submissionDate,
  footprint: i % 2 === 0 ? "EAST" : "WEST",
  validationError: TOPOLOGY_ERRORS[i] ?? null,
  baseStatus: toStatus(r.reviewStatus),
}));

const profiles: IntakeRow[] = mockProfileProjects.slice(0, 3).map((p, i) => ({
  id: p.submittalId,
  fileName: `${p.submissionName}_BLG.raw`,
  kind: "BLG Profile (.raw)",
  submitter: p.submitter,
  submittedOn: p.submissionDate || "—",
  footprint: i % 2 === 0 ? "WEST" : "EAST",
  validationError: PROFILE_ERRORS[i] ?? null,
  baseStatus: toStatus(p.directoryStatus),
}));

const ratings: IntakeRow[] = mockRatingsDirectory.slice(0, 3).map((r, i) => ({
  id: r.id,
  fileName: `${r.submissionName}_ratings.csv`,
  kind: "Ratings (.csv)",
  submitter: r.submitter,
  submittedOn: r.submissionDate || "—",
  footprint: i % 2 === 0 ? "EAST" : "WEST",
  validationError: RATINGS_ERRORS[i] ?? null,
  baseStatus: toStatus(r.status),
}));

export const intakeQueue: IntakeRow[] = [...topology, ...profiles, ...ratings];

export const exceptionCount = intakeQueue.filter((r) => r.validationError).length;
