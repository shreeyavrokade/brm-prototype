import { STATUS_TOKENS, STATUS_PILL_CLASS } from "@/components/shared/statusBadge";
import { cn } from "@/lib/utils";
import type { RowReviewStatus } from "@/store/rowReviewStore";
import { brand } from "@/config/brand";
import StatusHelpTooltip, { type StatusHelp } from "@/components/shared/StatusHelpTooltip";

const ROW_HELP: Record<RowReviewStatus, StatusHelp> = {
  "Review Needed": {
    means: "This row's pre-populated values haven't been reviewed this pass.",
    next: "Accept the values or edit them.",
  },
  Accepted: {
    means: "You accepted this row's values for this pass.",
    next: "No action needed.",
  },
  "Pending SPP Review": {
    means: `Your edits were saved and are waiting for ${brand.clientShortName} review.`,
    next: `No action until ${brand.clientShortName} completes its review pass.`,
  },
};

/** Visible label; the stored key "Pending SPP Review" stays unchanged. */
const labelFor = (status: RowReviewStatus) =>
  status === "Pending SPP Review" ? `Pending ${brand.clientShortName} Review` : status;

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
    <StatusHelpTooltip label={labelFor(status)} help={ROW_HELP[status]}>
    <span
      className={cn(STATUS_PILL_CLASS, "inline-flex items-center", className)}
      style={{ backgroundColor: token.bg, color: token.fg, borderColor: token.border }}
    >
      {labelFor(status)}
    </span>
    </StatusHelpTooltip>
  );
};

export default RowStatusPill;
