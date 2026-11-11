import type { StatusKey } from "@/components/shared/statusBadge";

/** Six-state lifecycle shared by Topology, Ratings and Profiles datasets. */
export type DatasetStatus =
  | "Draft"
  | "Review Needed"
  | "Pending Validation"
  | "Pending Submittal"
  | "Accepted"
  | "Rejected";

export const isDatasetStatus = (s: string): s is DatasetStatus =>
  ["Draft", "Review Needed", "Pending Validation", "Pending Submittal", "Accepted", "Rejected"].includes(s);

/**
 * Status is always derived, never hand-set.
 * Any error or warning forces `Review Needed`; a clean dataset that was in
 * `Review Needed`/`Draft` moves on to `Pending Submittal`.
 */
export const deriveDatasetStatus = (
  base: string | undefined,
  errors: number,
  warnings: number,
): DatasetStatus => {
  const start: DatasetStatus = base && isDatasetStatus(base) ? base : "Draft";
  // Only datasets that are actively under review (or still drafting) participate in
  // issue-driven status derivation. Accepted / Rejected / Pending Validation /
  // Pending Submittal are terminal-ish and are never flipped by issue counts.
  if (start !== "Review Needed" && start !== "Draft") return start;
  if (errors + warnings >= 1) return "Review Needed";
  if (start === "Draft") return "Draft";
  return "Pending Submittal";
};

export const asStatusKey = (s: DatasetStatus): StatusKey => s as StatusKey;

/** Grid issue tints/icons are only allowed while the dataset still has issues. */
export const showsIssueStyling = (status: DatasetStatus) => status === "Review Needed";

/** Issue data is only ever loaded for datasets that are flagged for review. */
export const hasReviewableIssues = (base: string | undefined) => base === "Review Needed";
