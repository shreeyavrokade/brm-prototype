import { useMemo, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DotsThreeVertical,
  ChatDots,
  ArrowsLeftRight,
  Trash,
  CheckCircle,
  XCircle,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import {
  useTransactions,
  deleteTransaction,
  approveTransaction,
  type TransactionRecord,
  type SeasonalMW,
} from "@/store/transactionsStore";
import { TxStatusBadge } from "./txStatusBadge";
import { RoleAckBadge } from "./ackBadge";
import { isEpReviewer } from "./ackRole";
import RejectTransactionDialog from "./RejectTransactionDialog";
import type { ReviewStatus } from "./mockChangeset";
import TransactionActivitySheet from "./TransactionActivitySheet";
import CounterOfferDialog from "./CounterOfferDialog";
import { toast } from "sonner";

const STATUS_WEIGHT: Record<ReviewStatus, number> = {
  "Review Needed": 1,
  "Validation in Progress": 2,
  Draft: 3, // legacy — no longer produced
  "Pending Acceptance": 4,
  "Acknowledgement Required": 4,
  Accepted: 5,
  Rejected: 6,
};

const fmtMW = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const parseDDMMMYYYY = (s: string) => {
  const d = new Date(s);
  if (isNaN(d.getTime())) return s;
  return d.toISOString().slice(0, 10);
};

const fmtSubDate = (ts: number) =>
  new Date(ts).toISOString().slice(0, 10);

interface Props {
  query?: string;
}

const TH_BASE =
  "h-12 px-4 text-xs font-semibold text-atmo-10 border-r border-b border-[#E2E8F0] bg-atmo-1 align-middle whitespace-nowrap";
const TD_BASE =
  "text-sm text-atmo-10 border-r border-b border-[#E2E8F0] px-4 py-1.5 align-middle whitespace-nowrap";

// Deletion is restricted to rejected transactions (drafts no longer exist).
const DELETABLE = new Set<ReviewStatus>(["Rejected"]);
const COUNTER_ELIGIBLE = new Set<ReviewStatus>([
  "Acknowledgement Required",
  "Review Needed",
]);


const SEASON_KEYS: Array<keyof SeasonalMW> = [
  "s27G", "s27S", "s27F", "s27W",
  "s28G", "s28L", "s28S", "s28F", "s28W",
  "s29L", "s29S",
  "s31L", "s31S", "s31SH", "s31W",
];
const seasonLabel = (k: keyof SeasonalMW) => k.slice(1);

/** Sequence & grounding block — visually grouped by a soft blue tint. */
const SEQ_KEYS: Array<{ key: "pneg" | "qneg" | "grdflg" | "pzero" | "qzero"; label: string; numeric: boolean }> = [
  { key: "pneg", label: "PNEG", numeric: true },
  { key: "qneg", label: "QNEG", numeric: true },
  { key: "grdflg", label: "GRDFLG", numeric: false },
  { key: "pzero", label: "PZERO", numeric: true },
  { key: "qzero", label: "QZERO", numeric: true },
];
const SEQ_HEAD = "bg-[#E0E6F5] text-[#2064B4] font-mono text-xs font-bold border-b border-[#D9D9D9]";
const SEQ_CELL = "bg-[#E0E6F5]/30 text-neutral-900 font-mono text-xs tabular-nums";

const TransactionsTable = ({ query = "" }: Props) => {
  const [activityFor, setActivityFor] = useState<TransactionRecord | null>(null);
  const [counterFor, setCounterFor] = useState<TransactionRecord | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<TransactionRecord | null>(null);
  const [rejectFor, setRejectFor] = useState<TransactionRecord | null>(null);
  const isEp = isEpReviewer();

  const all = useTransactions();
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? all.filter(
          (r) =>
            r.id.toLowerCase().includes(q) ||
            r.fromEntity.toLowerCase().includes(q) ||
            r.toEntity.toLowerCase().includes(q),
        )
      : all;
    return [...filtered].sort((a, b) => {
      const w = STATUS_WEIGHT[a.reviewStatus] - STATUS_WEIGHT[b.reviewStatus];
      if (w !== 0) return w;
      return b.submissionTimestamp - a.submissionTimestamp;
    });
  }, [query, all]);

  const handleDelete = () => {
    if (!confirmDelete) return;
    const id = confirmDelete.id;
    deleteTransaction(id);
    toast.success(`Transaction ${id} deleted.`);
    setConfirmDelete(null);
  };

  // sticky offsets
  const stickyId = "sticky left-0 z-20 bg-white border-r border-[#E2E8F0]";
  const stickyIdHead = "sticky left-0 z-30 bg-atmo-1 border-r border-[#E2E8F0]";
  const stickyStatus = "sticky left-[140px] z-20 bg-white border-r border-[#E2E8F0]";
  const stickyStatusHead = "sticky left-[140px] z-30 bg-atmo-1 border-r border-[#E2E8F0]";
  const stickyAction = "sticky right-0 z-20 bg-white border-[#E2E8F0]";
  const stickyActionHead = "sticky right-0 z-30 bg-atmo-1 border-[#E2E8F0]";

  return (
    <TooltipProvider delayDuration={150}>
      <div className="bg-atmo-0 border border-atmo-4 rounded-md overflow-hidden">
        <div className="overflow-x-auto max-w-full">
          <table className="border-separate border-spacing-0 text-left w-max min-w-full">
            <thead>
              <tr>
                <th className={cn(TH_BASE, stickyIdHead, "w-[140px]")}>ID</th>
                <th className={cn(TH_BASE, stickyStatusHead, "w-[170px]")}>Status</th>
                <th className={TH_BASE}>To</th>
                <th className={TH_BASE}>From</th>
                <th className={TH_BASE}>Firm or Non-Firm</th>
                <th className={cn(TH_BASE, "text-right")}>MW Capacity</th>
                <th className={TH_BASE}>Start Time</th>
                <th className={TH_BASE}>Stop Time</th>
                <th className={TH_BASE}>Submitted By</th>
                <th className={TH_BASE}>Submission Date</th>
                <th className={TH_BASE}>Acknowledgment State</th>
                <th className={TH_BASE}>Confirming Entity</th>
                <th className={TH_BASE}>Region Name</th>
                <th className={TH_BASE}>From Area Name</th>
                <th className={TH_BASE}>From Area ID</th>
                <th className={TH_BASE}>To Area Name</th>
                <th className={TH_BASE}>To Area ID</th>
                <th className={TH_BASE}>Oasis Number</th>
                <th className={TH_BASE}>Link Number</th>
                <th className={TH_BASE}>Primary Fuel Type</th>
                <th className={TH_BASE}>Secondary Fuel Type</th>
                <th className={TH_BASE}>Plant</th>
                <th className={TH_BASE}>Roll Over Rights</th>
                <th className={TH_BASE}>Scenario 0 Scalable</th>
                <th className={TH_BASE}>Related Reference</th>
                {SEASON_KEYS.map((k) => (
                  <th key={k} className={cn(TH_BASE, "text-right font-mono")}>
                    {seasonLabel(k)}
                  </th>
                ))}
                {SEQ_KEYS.map((s) => (
                  <th
                    key={s.key}
                    className={cn(
                      TH_BASE,
                      SEQ_HEAD,
                      s.numeric ? "text-right" : "text-left",
                    )}
                  >
                    {s.label}
                  </th>
                ))}
                <th className={cn(TH_BASE, stickyActionHead, "text-center w-12")}>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => {
                const zebra = idx % 2 === 1;
                const rowBg = zebra ? "bg-[#FBFCFC]" : "bg-white";
                const canDelete = DELETABLE.has(row.reviewStatus);
                const canCounter = COUNTER_ELIGIBLE.has(row.reviewStatus);

                const cellBg = zebra ? "bg-[#FBFCFC]" : "bg-white";
                return (
                  <tr
                    key={row.id}
                    onClick={() => setActivityFor(row)}
                    className={cn("cursor-pointer transition-colors hover:bg-[#E0E6F5]/40", rowBg)}
                  >
                    <td className={cn(TD_BASE, stickyId, cellBg, "font-mono tabular-nums")}>
                      {row.id}
                    </td>
                    <td className={cn(TD_BASE, stickyStatus, cellBg)}>
                      <TxStatusBadge status={row.reviewStatus} />
                    </td>

                    <td className={TD_BASE}>{row.toEntity}</td>
                    <td className={TD_BASE}>{row.fromEntity}</td>
                    <td className={TD_BASE}>{row.firmType}</td>
                    <td className={cn(TD_BASE, "text-right font-mono tabular-nums text-neutral-800")}>
                      {fmtMW(row.mwCapacity)}
                    </td>
                    <td className={cn(TD_BASE, "font-mono")}>{parseDDMMMYYYY(row.startDate)}</td>
                    <td className={cn(TD_BASE, "font-mono")}>{parseDDMMMYYYY(row.stopDate)}</td>
                    <td className={TD_BASE}>{row.submittedBy}</td>
                    <td className={cn(TD_BASE, "font-mono")}>{fmtSubDate(row.submissionTimestamp)}</td>
                    <td className={TD_BASE}>
                      <RoleAckBadge tx={row} onAct={setCounterFor} />
                    </td>
                    <td className={TD_BASE}>{row.confirmingEntity}</td>
                    <td className={TD_BASE}>{row.regionName}</td>
                    <td className={TD_BASE}>{row.fromAreaName}</td>
                    <td className={cn(TD_BASE, "font-mono")}>{row.fromAreaId}</td>
                    <td className={TD_BASE}>{row.toAreaName}</td>
                    <td className={cn(TD_BASE, "font-mono")}>{row.toAreaId}</td>
                    <td className={cn(TD_BASE, "font-mono")}>{row.oasisNumber}</td>
                    <td className={cn(TD_BASE, "font-mono")}>{row.linkNumber}</td>
                    <td className={TD_BASE}>{row.primaryFuel}</td>
                    <td className={TD_BASE}>{row.secondaryFuel}</td>
                    <td className={TD_BASE}>{row.plant}</td>
                    <td className={TD_BASE}>{row.rollOverRights ? "Yes" : "No"}</td>
                    <td className={TD_BASE}>{row.scenario0Scalable ? "Yes" : "No"}</td>
                    <td className={cn(TD_BASE, "font-mono")}>{row.relatedReference}</td>
                    {SEASON_KEYS.map((k) => (
                      <td
                        key={k}
                        className={cn(TD_BASE, "text-right font-mono tabular-nums text-neutral-800")}
                      >
                        {(row[k] as number).toFixed(2)}
                      </td>
                    ))}
                    {SEQ_KEYS.map((s) => (
                      <td
                        key={s.key}
                        className={cn(TD_BASE, SEQ_CELL, s.numeric ? "text-right" : "text-left")}
                      >
                        {s.numeric
                          ? (row[s.key] as number).toFixed(2)
                          : (row[s.key] as string)}
                      </td>
                    ))}
                    <td
                      className={cn(TD_BASE, stickyAction, cellBg, "text-center")}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          className="h-7 w-7 inline-flex items-center justify-center rounded-md text-atmo-9 hover:bg-atmo-2 hover:text-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-[#2064B4]"
                          aria-label="Row actions"
                        >
                          <DotsThreeVertical weight="bold" size={16} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuItem
                            onSelect={() => setActivityFor(row)}
                            className="gap-2"
                          >
                            <ChatDots size={16} />
                            View Activity &amp; History
                          </DropdownMenuItem>

                          {isEp && row.reviewStatus === "Pending Acceptance" && (
                            <>
                              <DropdownMenuItem
                                onSelect={() => {
                                  approveTransaction(row.id);
                                  toast.success(`Transaction ${row.id} approved for model build.`);
                                }}
                                className="gap-2 text-[#146C2E] focus:text-[#146C2E]"
                              >
                                <CheckCircle size={16} className="text-[#146C2E]" />
                                Approve for Model Build
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onSelect={() => setRejectFor(row)}
                                className="gap-2 text-[#C82333] focus:text-[#C82333]"
                              >
                                <XCircle size={16} className="text-[#C82333]" />
                                Reject Transaction
                              </DropdownMenuItem>
                            </>
                          )}

                          {canCounter ? (
                            <DropdownMenuItem
                              onSelect={() => setCounterFor(row)}
                              className="gap-2"
                            >
                              <ArrowsLeftRight size={16} />
                              Counter Offer
                            </DropdownMenuItem>
                          ) : (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm opacity-40 cursor-not-allowed select-none"
                                  aria-disabled
                                >
                                  <ArrowsLeftRight size={16} />
                                  Counter Offer
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="left" className="max-w-[240px] text-xs">
                                Counter offers are locked while the transaction is in SPP Review or finalized.
                              </TooltipContent>
                            </Tooltip>
                          )}


                          {canDelete ? (
                            <DropdownMenuItem
                              onSelect={() => setConfirmDelete(row)}
                              className="gap-2 text-[#C82333] focus:text-[#C82333]"
                            >
                              <Trash size={16} className="text-[#C82333]" />
                              Delete Transaction
                            </DropdownMenuItem>
                          ) : (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-[#C82333] opacity-40 cursor-not-allowed select-none"
                                  aria-disabled
                                >
                                  <Trash size={16} className="text-[#C82333]" />
                                  Delete Transaction
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="left" className="max-w-[240px] text-xs">
                                Only rejected transactions can be deleted.
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <TransactionActivitySheet
          tx={activityFor}
          open={!!activityFor}
          onOpenChange={(v) => !v && setActivityFor(null)}
        />
        <RejectTransactionDialog
          tx={rejectFor}
          open={!!rejectFor}
          onOpenChange={(v) => !v && setRejectFor(null)}
        />
        <CounterOfferDialog
          tx={counterFor}
          open={!!counterFor}
          onOpenChange={(v) => !v && setCounterFor(null)}
        />
        <AlertDialog
          open={!!confirmDelete}
          onOpenChange={(v) => !v && setConfirmDelete(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete transaction?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete Transaction #{confirmDelete?.id}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-[#C82333] text-white hover:bg-[#C82333]/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
};

export default TransactionsTable;
