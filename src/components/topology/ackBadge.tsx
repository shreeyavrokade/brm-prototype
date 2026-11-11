import type { TransactionRecord } from "@/store/transactionsStore";
import { cn } from "@/lib/utils";
import { CURRENT_ROLE, roleAckState, type AckState } from "./ackRole";
import { TxStatusBadge } from "./txStatusBadge";

/* ---------------- Strict 2-state acknowledgment ---------------- */

const ACK_COLORS: Record<AckState, string> = {
  "Action Needed": "#C82333",
  Acknowledged: "#146C2E",
};

export const AckStatePill = ({
  state,
  className,
}: {
  state: AckState;
  className?: string;
}) => (
  <span
    className={cn(
      "inline-flex items-center gap-2 text-sm font-normal whitespace-nowrap",
      className,
    )}
    style={{ color: ACK_COLORS[state] }}
  >
    <span
      aria-hidden
      className="h-1.5 w-1.5 shrink-0 rounded-full"
      style={{ backgroundColor: ACK_COLORS[state] }}
    />
    {state}
  </span>
);


/**
 * Counterparties see only their own acknowledgment state.
 * EP / SPP staff instead see the macro model-build status.
 */
export const RoleAckBadge = ({
  tx,
  onAct,
}: {
  tx: TransactionRecord;
  onAct?: (tx: TransactionRecord) => void;
}) => {
  if (CURRENT_ROLE === "EP") return <TxStatusBadge status={tx.reviewStatus} />;

  const state = roleAckState(tx);
  if (!state) return null;

  const actionable =
    state === "Action Needed" &&
    tx.reviewStatus !== "Rejected" &&
    tx.reviewStatus !== "Accepted" &&
    !!onAct;

  if (!actionable) return <AckStatePill state={state} />;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onAct?.(tx);
      }}
      aria-label={`Action needed — review counter offer for ${tx.id}`}
      className="focus:outline-none focus-visible:ring-1 focus-visible:ring-[#2064B4] rounded-sm"
    >
      <AckStatePill state={state} className="cursor-pointer hover:underline" />
    </button>

  );
};

export default RoleAckBadge;
