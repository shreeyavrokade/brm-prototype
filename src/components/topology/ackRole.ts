import type { TransactionRecord } from "@/store/transactionsStore";

export type AckState = "Action Needed" | "Acknowledged";
export type UserRole = "CP1" | "CP2" | "EP";

/**
 * Fixed demo role. Flip this constant to view the Transactions module as
 * Counterparty 1 (submitting entity), Counterparty 2 (confirming entity)
 * or the EP / SPP Engineering staff reviewer.
 */
export const CURRENT_ROLE = "CP2" as UserRole;

export type Party = "cp1" | "cp2";

/** Which party the current role acts as (null for EP staff). */
export const currentParty = (): Party | null =>
  CURRENT_ROLE === "CP1" ? "cp1" : CURRENT_ROLE === "CP2" ? "cp2" : null;

export const partyLabel = (tx: TransactionRecord, party: Party) =>
  party === "cp1" ? tx.fromEntity : tx.toEntity;

/** Ack state visible to the current role, or null when EP staff. */
export const roleAckState = (tx: TransactionRecord): AckState | null => {
  const p = currentParty();
  if (!p) return null;
  return p === "cp1" ? tx.cp1Ack : tx.cp2Ack;
};

/** The current role can act on this row when its own ack is outstanding. */
export const canActNow = (tx: TransactionRecord) =>
  roleAckState(tx) === "Action Needed" &&
  tx.reviewStatus !== "Rejected" &&
  tx.reviewStatus !== "Accepted";

export const isEpReviewer = () => CURRENT_ROLE === "EP";
