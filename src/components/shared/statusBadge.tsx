import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { brand } from "@/config/brand";
import StatusHelpTooltip, { type StatusHelp } from "@/components/shared/StatusHelpTooltip";

/**
 * Canonical submission/transaction status pill.
 * Single source of truth for status tag UI across every tab and module.
 */
export type StatusKey =
  | "Review Needed"
  | "Validation in Progress"
  | "Pending Validation"
  | "Pending Submittal"
  | "Draft"
  | "Pending Acceptance"
  | "Acknowledgement Required"
  | "Accepted"
  | "Approved"
  | "Rejected";

export const STATUS_TOKENS: Record<StatusKey, { bg: string; fg: string; border: string }> = {
  Draft: { bg: "#F1F5F9", fg: "#1E293B", border: "#CBD5E1" },
  "Review Needed": { bg: "#FBE5E8", fg: "#C82333", border: "#C82333" },
  "Validation in Progress": { bg: "#FCF2D9", fg: "#6D4D09", border: "#FFBE2E" },
  "Pending Validation": { bg: "#E0E6F5", fg: "#2064B4", border: "#2064B4" },
  "Pending Submittal": { bg: "#F0EAF8", fg: "#5B2C6F", border: "#5B2C6F" },
  "Pending Acceptance": { bg: "#FCF2D9", fg: "#6D4D09", border: "#FFBE2E" },
  "Acknowledgement Required": { bg: "#F1DFEC", fg: "#921581", border: "#921581" },
  Accepted: { bg: "#DEEDE2", fg: "#146C2E", border: "#146C2E" },
  Approved: { bg: "#DEEDE2", fg: "#146C2E", border: "#146C2E" },
  Rejected: { bg: "#222222", fg: "#FBFCFC", border: "#222222" },
};


/** Plain-language meaning + next step for every status, shown on hover/focus/tap. */
const C = brand.clientShortName;
export const STATUS_HELP: Record<StatusKey, StatusHelp> = {
  Draft: {
    means: "Saved but not submitted yet. Only your organization can see it.",
    next: "Finish the details and submit it for validation.",
  },
  "Validation in Progress": {
    means: "Automated rules are checking the uploaded file.",
    next: "No action needed — results appear in a few moments.",
  },
  "Review Needed": {
    means: "Validation found errors or warnings that need attention.",
    next: "Open it, fix the errors by uploading a corrected version, and review the warnings.",
  },
  "Pending Validation": {
    means: "A corrected version was received and is being re-validated.",
    next: "No action needed — results appear shortly.",
  },
  "Pending Submittal": {
    means: "Passed validation and is ready to send.",
    next: `Submit it for ${C} review.`,
  },
  "Pending Acceptance": {
    means: `Submitted and waiting for ${C} to review it.`,
    next: "Watch for acceptance or a return note in Activity.",
  },
  "Acknowledgement Required": {
    means: "A counterparty must confirm the terms before it can be reviewed.",
    next: "Acknowledge the terms or send a counter-offer.",
  },
  Accepted: {
    means: `${C} accepted it for the model build.`,
    next: "Nothing further this cycle.",
  },
  Approved: {
    means: `${C} approved it for the model build.`,
    next: "Nothing further this cycle — it's locked.",
  },
  Rejected: {
    means: `${C} returned it with notes.`,
    next: "Read the notes in Activity, correct the submission and resubmit.",
  },
};

export const STATUS_PILL_CLASS =
  "border rounded-full font-medium gap-1 px-2.5 py-0.5 text-xs whitespace-nowrap hover:opacity-90";

interface Props {
  status: StatusKey;
  /** Optional label override (e.g. Transactions renders "Accepted" as "Approved"). */
  label?: string;
  className?: string;
  /** Show the meaning/next-step tooltip (default true). */
  showHelp?: boolean;
}

export const StatusPill = ({ status, label, className, showHelp = true }: Props) => {
  const token = STATUS_TOKENS[status] ?? STATUS_TOKENS.Draft;
  const text = label ?? status;
  const pill = (
    <Badge
      className={cn(STATUS_PILL_CLASS, className)}
      style={{ backgroundColor: token.bg, color: token.fg, borderColor: token.border }}
    >
      {text}
    </Badge>
  );
  if (!showHelp) return pill;
  return (
    <StatusHelpTooltip label={text} help={STATUS_HELP[status]}>
      {pill}
    </StatusHelpTooltip>
  );
};

export default StatusPill;
