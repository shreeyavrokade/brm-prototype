import StatusPill, { STATUS_TOKENS, type StatusKey } from "@/components/shared/statusBadge";

export type SubmissionStatus = StatusKey;

export const STATUS_STYLES = STATUS_TOKENS;

const StatusBadge = ({ status }: { status: SubmissionStatus }) => (
  <StatusPill status={status} />
);

export default StatusBadge;
