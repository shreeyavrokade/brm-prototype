import StatusPill from "@/components/shared/statusBadge";
import type { ReviewStatus } from "./mockChangeset";

/**
 * Macro "Model Build Journey" status for transactions.
 * Review Needed -> Pending Approval -> Accepted / Rejected.
 */
export const TxStatusBadge = ({ status }: { status: ReviewStatus }) => (
  <StatusPill
    status={status}
    label={status === "Pending Acceptance" ? "Pending Approval" : undefined}
  />
);

export default TxStatusBadge;
