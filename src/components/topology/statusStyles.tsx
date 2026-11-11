import StatusPill, { STATUS_TOKENS } from "@/components/shared/statusBadge";
import type { ReviewStatus } from "./mockChangeset";

/** Legacy alias — kept so existing imports keep working. */
export const STATUS_STYLES = STATUS_TOKENS;

export const StatusBadge = ({ status }: { status: ReviewStatus }) => (
  <StatusPill status={status} />
);
