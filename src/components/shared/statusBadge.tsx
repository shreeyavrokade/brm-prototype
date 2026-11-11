import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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


export const STATUS_PILL_CLASS =
  "border rounded-full font-medium gap-1 px-2.5 py-0.5 text-xs whitespace-nowrap hover:opacity-90";

interface Props {
  status: StatusKey;
  /** Optional label override (e.g. Transactions renders "Accepted" as "Approved"). */
  label?: string;
  className?: string;
}

export const StatusPill = ({ status, label, className }: Props) => {
  const token = STATUS_TOKENS[status] ?? STATUS_TOKENS.Draft;
  return (
    <Badge
      className={cn(STATUS_PILL_CLASS, className)}
      style={{ backgroundColor: token.bg, color: token.fg, borderColor: token.border }}
    >
      {label ?? status}
    </Badge>
  );
};

export default StatusPill;
