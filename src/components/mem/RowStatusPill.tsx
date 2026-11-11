import { STATUS_TOKENS, STATUS_PILL_CLASS } from "@/components/shared/statusBadge";
import { cn } from "@/lib/utils";
import type { RowReviewStatus } from "@/store/rowReviewStore";

/** Row-level review pill — reuses the canonical status tokens. */
const TOKEN_BY_STATUS: Record<RowReviewStatus, { bg: string; fg: string; border: string }> = {
  "Review Needed": STATUS_TOKENS["Review Needed"],
  Accepted: STATUS_TOKENS.Accepted,
  "Pending SPP Review": STATUS_TOKENS["Pending Submittal"],
};

const RowStatusPill = ({
  status,
  className,
}: {
  status: RowReviewStatus;
  className?: string;
}) => {
  const token = TOKEN_BY_STATUS[status];
  return (
    <span
      className={cn(STATUS_PILL_CLASS, "inline-flex items-center", className)}
      style={{ backgroundColor: token.bg, color: token.fg, borderColor: token.border }}
    >
      {status}
    </span>
  );
};

export default RowStatusPill;
