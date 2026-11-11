import { useSyncExternalStore } from "react";
import { mockTransactions, type TransactionRow } from "@/components/topology/mockTransactions";

export interface SeasonalMW {
  s27G: number; s27S: number; s27F: number; s27W: number;
  s28G: number; s28L: number; s28S: number; s28F: number; s28W: number;
  s29L: number; s29S: number;
  s31L: number; s31S: number; s31SH: number; s31W: number;
}

export type AckState = "Action Needed" | "Acknowledged";

export interface TransactionRecord extends TransactionRow, SeasonalMW {
  isMirror?: boolean;
  mirrorOf?: string;
  hasProof?: boolean;
  counterOfferPending?: boolean;
  counterNote?: string;
  submittedBy?: string;
  confirmingEntity?: string;
  regionName?: string;
  fromAreaName?: string;
  fromAreaId?: string;
  toAreaName?: string;
  toAreaId?: string;
  oasisNumber?: string;
  linkNumber?: string;
  primaryFuel?: string;
  secondaryFuel?: string;
  plant?: string;
  rollOverRights?: boolean;
  scenario0Scalable?: boolean;
  relatedReference?: string;
  /** Per-party acknowledgment states. */
  cp1Ack: AckState;
  cp2Ack: AckState;
  /** Who instantiated the record. */
  origin: "non-firm" | "firm";
  rejectionReason?: string;
  /** Latest counter figures on the table (only the most recent turn is retained). */
  counterMW?: Partial<Record<keyof SeasonalMW, number>>;
  /** Party that submitted the most recent counter. */
  counterBy?: "cp1" | "cp2";
  /** Number of counter turns exchanged (infinite loop counter). */
  counterTurn?: number;
  /** Sequence & grounding parameters. */
  pneg: number;
  qneg: number;
  grdflg: string;
  pzero: number;
  qzero: number;
}

const REGIONS = ["Eastern", "Central", "Southern", "Northern"];
const FUELS = ["Natural Gas", "Coal", "Wind", "Solar", "Hydro", "Nuclear"];
const USERS = ["j.smith", "a.patel", "m.gonzalez", "k.chen", "r.taylor"];

/** Back-fill per-party ack states from a legacy row's macro status. */
const seedAcks = (r: TransactionRow): { cp1Ack: AckState; cp2Ack: AckState } => {
  switch (r.reviewStatus) {
    case "Review Needed":
    case "Acknowledgement Required":
      return { cp1Ack: "Acknowledged", cp2Ack: "Action Needed" };
    default:
      return { cp1Ack: "Acknowledged", cp2Ack: "Acknowledged" };
  }
};

const enrich = (r: TransactionRow, i: number): TransactionRecord => {
  const base = r.mwCapacity;
  const f = (mult: number) => Math.round(base * mult * 100) / 100;
  return {
    ...r,
    ...seedAcks(r),
    origin: r.firmType === "Firm" ? "firm" : "non-firm",
    submittedBy: USERS[i % USERS.length],
    confirmingEntity: r.toEntity,
    regionName: REGIONS[i % REGIONS.length],
    fromAreaName: `${r.fromEntity} Area`,
    fromAreaId: `A${100 + i}`,
    toAreaName: `${r.toEntity} Area`,
    toAreaId: `A${200 + i}`,
    oasisNumber: `OASIS-${70000 + i}`,
    linkNumber: `LNK-${500 + i}`,
    primaryFuel: FUELS[i % FUELS.length],
    secondaryFuel: FUELS[(i + 2) % FUELS.length],
    plant: `Plant ${String.fromCharCode(65 + (i % 26))}`,
    rollOverRights: i % 2 === 0,
    scenario0Scalable: i % 3 === 0,
    relatedReference: `REF-${i + 1}`,
    s27G: f(0.95), s27S: f(1.02), s27F: f(0.98), s27W: f(1.05),
    s28G: f(0.93), s28L: f(0.88), s28S: f(1.01), s28F: f(0.97), s28W: f(1.04),
    s29L: f(0.86), s29S: f(1.00),
    s31L: f(0.84), s31S: f(0.99), s31SH: f(0.92), s31W: f(1.03),
    pneg: Math.round(base * 0.12 * 100) / 100,
    qneg: Math.round(base * 0.05 * 100) / 100,
    grdflg: i % 4 === 0 ? "Y" : "N",
    pzero: Math.round(base * 0.08 * 100) / 100,
    qzero: Math.round(base * 0.03 * 100) / 100,
  };
};

let rows: TransactionRecord[] = mockTransactions.map(enrich);
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export const getTransactions = () => rows;

/**
 * Initial state pair for a newly instantiated transaction.
 * Non-Firm is created by CP1 (already acknowledged); Firm is uploaded by an
 * EP engineer, so both counterparties must act.
 */
export const initialAckState = (origin: "non-firm" | "firm") =>
  origin === "non-firm"
    ? {
        reviewStatus: "Review Needed" as const,
        cp1Ack: "Acknowledged" as AckState,
        cp2Ack: "Action Needed" as AckState,
        origin,
      }
    : {
        reviewStatus: "Review Needed" as const,
        cp1Ack: "Action Needed" as AckState,
        cp2Ack: "Action Needed" as AckState,
        origin,
      };

export const addPair = (
  primary: Partial<TransactionRecord> & TransactionRow,
  mirror: Partial<TransactionRecord> & TransactionRow,
) => {
  const p = enrich(primary as TransactionRow, rows.length);
  const m = enrich(mirror as TransactionRow, rows.length + 1);
  rows = [{ ...p, ...primary }, { ...m, ...mirror }, ...rows];
  emit();
};

/** Both parties acknowledged -> record enters the EP review queue. */
const withAutoTransition = (r: TransactionRecord): TransactionRecord =>
  r.cp1Ack === "Acknowledged" &&
  r.cp2Ack === "Acknowledged" &&
  (r.reviewStatus === "Review Needed" || r.reviewStatus === "Acknowledgement Required")
    ? { ...r, reviewStatus: "Pending Acceptance", counterOfferPending: false }
    : r;

export const updateTransaction = (id: string, patch: Partial<TransactionRecord>) => {
  rows = rows.map((r) => (r.id === id ? withAutoTransition({ ...r, ...patch }) : r));
  emit();
};

export const setAck = (
  id: string,
  party: "cp1" | "cp2",
  state: AckState,
  patch: Partial<TransactionRecord> = {},
) => {
  updateTransaction(id, { ...patch, [party === "cp1" ? "cp1Ack" : "cp2Ack"]: state });
};

export const approveTransaction = (id: string) =>
  updateTransaction(id, { reviewStatus: "Accepted" });

export const rejectTransaction = (
  id: string,
  reason: string,
  mode: "reject" | "return",
) => {
  rows = rows.map((r) =>
    r.id === id
      ? {
          ...r,
          rejectionReason: reason,
          reviewStatus: mode === "reject" ? "Rejected" : "Review Needed",
          ...(mode === "return"
            ? { cp1Ack: "Action Needed" as AckState, cp2Ack: "Action Needed" as AckState }
            : {}),
        }
      : r,
  );
  emit();
};

export const deleteTransaction = (id: string) => {
  rows = rows.filter((r) => r.id !== id);
  emit();
};


export const useTransactions = () =>
  useSyncExternalStore(subscribe, getTransactions, getTransactions);

export const nextTransactionId = () => {
  const year = new Date().getFullYear();
  const n = rows.filter((r) => r.id.startsWith(`NFT-${year}`)).length + 1;
  return `NFT-${year}-${String(10000 + n).padStart(5, "0")}`;
};
