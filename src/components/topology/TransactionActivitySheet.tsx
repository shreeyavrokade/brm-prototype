import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { X, FilePdf, LockKey, Eye } from "@phosphor-icons/react";
import { TxStatusBadge } from "./txStatusBadge";
import { RoleAckBadge } from "./ackBadge";
import { isEpReviewer } from "./ackRole";
import RejectTransactionDialog from "./RejectTransactionDialog";
import { approveTransaction, type TransactionRecord } from "@/store/transactionsStore";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  tx: TransactionRecord | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const SPP_MEMBERS = new Set([
  "AEP", "SPP", "WFEC", "Westar", "OG&E", "KCP&L", "Sunflower Electric",
  "City of Wichita", "City of Topeka", "City of Liberal", "Tri-State G&T",
  "AECI", "Springfield Util",
]);

const KV = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <div className="text-[11px] uppercase tracking-wide text-atmo-8 font-medium mb-1">{label}</div>
    <div className="text-sm text-foreground font-medium">{value}</div>
  </div>
);

const fmt = (d: Date) =>
  d.toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

const TransactionActivitySheet = ({ tx, open, onOpenChange }: Props) => {
  const [rejectOpen, setRejectOpen] = useState(false);
  if (!tx) return null;

  const epCanReview = isEpReviewer() && tx.reviewStatus === "Pending Acceptance";

  const isExternal =
    !SPP_MEMBERS.has(tx.fromEntity) || !SPP_MEMBERS.has(tx.toEntity);
  const isLocked =
    tx.reviewStatus === "Pending Acceptance" ||
    tx.reviewStatus === "Validation in Progress";
  const submitted = new Date(tx.submissionTimestamp);


  const audit = [
    {
      t: fmt(submitted),
      title: `Submitted by ${tx.fromEntity}`,
      detail: `Transaction routed to ${tx.toEntity}`,
      complete: true,
    },
    {
      t: fmt(new Date(tx.submissionTimestamp + 60_000)),
      title: `Mirror record generated for ${tx.toEntity}`,
      complete: true,
    },
    ...(tx.counterOfferPending
      ? [{
          t: fmt(new Date(tx.submissionTimestamp + 3_600_000)),
          title: `Counter offer submitted by ${tx.toEntity}`,
          detail: tx.counterNote,
          complete: true,
        }]
      : []),
    {
      t: "Pending",
      title: `Journey stage: ${tx.reviewStatus === "Pending Acceptance" ? "Pending Approval" : tx.reviewStatus}`,
      complete: false,
    },
  ];

  const threads = [
    {
      user: `${tx.toEntity} Reviewer`,
      time: "2h ago",
      message: "Please confirm the requested capacity for the second half of the window.",
    },
    ...(tx.counterNote
      ? [{ user: `${tx.toEntity}`, time: "1h ago", message: tx.counterNote }]
      : []),
    {
      user: "You",
      time: "20m ago",
      message: "Reviewing constraint data now — will respond shortly.",
    },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[520px] sm:max-w-[560px] sm:w-[560px] bg-card h-full border-l border-atmo-3 shadow-2xl p-0 z-50 flex flex-col"
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-atmo-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-foreground font-mono truncate">
                Activity &amp; History — #{tx.id}
              </h2>
              <p className="text-xs text-atmo-8 mt-1">
                Submitted {fmt(submitted)} by {tx.fromEntity}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <TxStatusBadge status={tx.reviewStatus} />
                <RoleAckBadge tx={tx} />
              </div>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              aria-label="Close"
              className="h-8 w-8 flex items-center justify-center text-atmo-9 hover:text-foreground rounded-md hover:bg-atmo-1"
            >
              <X weight="bold" size={16} />
            </button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            {isLocked && (
              <div className="bg-[#E0E6F5] text-[#222222] p-3 rounded-lg text-xs font-medium flex items-start gap-2 mb-4">
                <LockKey weight="bold" size={16} className="shrink-0 mt-0.5" />
                <span>
                  <span className="font-semibold">Transaction Locked in SPP Review:</span>{" "}
                  Both counterparties have acknowledged these terms. SPP Staff is currently
                  reviewing the submission for grid capability and proof of coordination.
                  Further commercial revisions are disabled.
                </span>
              </div>
            )}

            <div>
              <div className="text-[11px] uppercase tracking-wide text-atmo-8 font-semibold mb-2">
                Transaction Parameters
              </div>
              <div className="bg-muted/40 border border-atmo-3 rounded-xl p-4 grid grid-cols-2 gap-4 text-sm">
                <KV
                  label="Submitting Area"
                  value={
                    <>
                      {tx.fromEntity}
                      {!SPP_MEMBERS.has(tx.fromEntity) && (
                        <span className="text-atmo-8 font-normal"> (External)</span>
                      )}
                    </>
                  }
                />
                <KV
                  label="Confirming Area"
                  value={
                    <>
                      {tx.toEntity}
                      {!SPP_MEMBERS.has(tx.toEntity) && (
                        <span className="text-atmo-8 font-normal"> (External)</span>
                      )}
                    </>
                  }
                />
                <KV label="Capacity Type" value={tx.firmType} />
                <KV
                  label="Contracted Capacity"
                  value={`${tx.mwCapacity.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MW`}
                />
                <KV label="Start Date" value={tx.startDate} />
                <KV label="Stop Date" value={tx.stopDate} />
              </div>
            </div>

            {/* Proof of Coordination */}
            {isExternal && (
              <div>
                <div className="text-[11px] uppercase tracking-wide text-atmo-8 font-semibold mb-2">
                  Proof of Coordination
                </div>
                <div className="border border-atmo-3 rounded-xl p-4 flex items-center justify-between bg-white gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <FilePdf size={28} className="text-[#CC0000] shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">
                        Proof_of_Coordination_{tx.toEntity.replace(/\s+/g, "")}.pdf
                      </div>
                      <div className="text-xs text-atmo-8 mt-0.5 flex items-center gap-2">
                        <span>1.2 MB</span>
                        <span className="text-atmo-6">•</span>
                        <span className="inline-flex items-center gap-1 text-atmo-9">
                          <LockKey weight="bold" size={12} />
                          Restricted Access
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 gap-1.5 rounded-md text-xs shrink-0">
                    <Eye size={14} />
                    Preview
                  </Button>
                </div>
              </div>
            )}

            {/* Audit */}
            <section>
              <div className="text-[11px] uppercase tracking-wide text-atmo-8 font-semibold mb-3">
                Audit Log
              </div>
              <ol className="relative border-l border-atmo-3 ml-2 space-y-4">
                {audit.map((a, i) => (
                  <li key={i} className="ml-4">
                    <span
                      className={`absolute -left-1.5 flex h-3 w-3 items-center justify-center rounded-full border-2 border-card ${
                        a.complete ? "bg-emerald-500" : "bg-atmo-5"
                      }`}
                    />
                    <div className="text-[11px] text-atmo-8 font-mono">{a.t}</div>
                    <div className="text-sm text-foreground font-medium mt-0.5">{a.title}</div>
                    {a.detail && <div className="text-xs text-atmo-9 mt-0.5">{a.detail}</div>}
                  </li>
                ))}
              </ol>
            </section>

            {/* Discussion */}
            <section>
              <div className="text-[11px] uppercase tracking-wide text-atmo-8 font-semibold mb-3">
                Discussion
              </div>
              <div className="space-y-3">
                {threads.map((c, i) => (
                  <div key={i} className="min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-medium">{c.user}</span>
                      <span className="text-[10px] text-muted-foreground">{c.time}</span>
                    </div>
                    <div className="mt-1 rounded-lg bg-muted/60 border px-3 py-2 text-xs leading-relaxed">
                      {c.message}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </ScrollArea>

        {epCanReview && (
          <div className="border-t border-atmo-3 px-4 py-3 flex items-center justify-between gap-2 bg-card">
            <Button
              variant="outline"
              onClick={() => setRejectOpen(true)}
              className="rounded-md text-[#C82333] border-[#C82333] hover:bg-[#C82333]/5 hover:text-[#C82333]"
            >
              Reject Transaction
            </Button>
            <Button
              onClick={() => {
                approveTransaction(tx.id);
                toast.success(`Transaction ${tx.id} approved for model build.`);
                onOpenChange(false);
              }}
              className="rounded-md bg-[#146C2E] text-white hover:bg-[#146C2E]/90"
            >
              Approve for Model Build
            </Button>
          </div>
        )}

        <RejectTransactionDialog
          tx={tx}
          open={rejectOpen}
          onOpenChange={(v) => {
            setRejectOpen(v);
            if (!v) onOpenChange(false);
          }}
        />
      </SheetContent>
    </Sheet>
  );
};

export default TransactionActivitySheet;
