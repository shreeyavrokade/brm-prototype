export type ReviewStatus =
  | "Review Needed"
  | "Validation in Progress"
  | "Draft"
  | "Pending Acceptance"
  | "Acknowledgement Required"
  | "Accepted"
  | "Rejected";

export interface ChangesetRow {
  id: string;
  projectName: string;
  reviewStatus: ReviewStatus;
  type: string;
  subtype: string;
  submitter: string;
  submissionDate: string;
  submissionTimestamp: number;
}

const types = ["Modeling Correction", "Network Status"];
const subtypes = ["Network", "Modeling"];

const baseNames = [
  "527_WFEC_BoswellTap",
  "524 Delay Mountain_Burg OK Rebuild",
  "612 Sunflower_Topeka KS Reconductor",
  "489 Cimarron_Liberal Tap",
  "701 Comanche_Pueblo CO Upgrade",
  "318 Ozark_Springfield MO Tie",
  "245 Red River_Wichita Falls Loop",
  "892 Panhandle_Amarillo TX Sub",
  "133 Flint Hills_Manhattan KS Line",
  "566 Black Mesa_Tulsa OK Phase",
  "402 Cherokee_Joplin MO Switch",
  "778 Mustang_Norman OK Reactor",
];

const SEED_BASE = new Date("2024-01-14T12:00:00Z").getTime();

const cycle: ReviewStatus[] = [
  "Pending Acceptance",
  "Accepted",
  "Rejected",
  "Draft",
];

export const mockChangeset: ChangesetRow[] = baseNames.map((name, i) => ({
  id: `M806${75 + i}`,
  projectName: name,
  reviewStatus: i === 0 ? "Review Needed" : cycle[(i - 1) % cycle.length],
  type: types[i % types.length],
  subtype: subtypes[i % subtypes.length],
  submitter: ["J. Smith", "A. Patel", "M. Chen", "R. Davis"][i % 4],
  submissionDate: "14 Jan 2024",
  submissionTimestamp: SEED_BASE - i * 60_000,
}));
