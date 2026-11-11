import { useState } from "react";
import { Zap, Check, Undo2, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useTransactions,
  approveTransaction,
  rejectTransaction,
  type TransactionRecord,
} from "@/store/transactionsStore";
import ReturnSubmissionModal from "./ReturnSubmissionModal";
import { toast } from "@/hooks/use-toast";

export const BilateralTransactionsWidget = () => {
  const all = useTransactions();
  const [pending, setPending] = useState<TransactionRecord | null>(null);

  const ready = all.filter(
    (t) =>
      t.cp1Ack === "Acknowledged" &&
      t.cp2Ack === "Acknowledged" &&
      t.reviewStatus === "Pending Acceptance",
  );

  return (
    <div className="rounded-lg border border-atmo-3 bg-atmo-0">
      <div className="flex items-center justify-between border-b border-atmo-3 px-4 py-3">
        <h2 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-foreground">
          <Zap className="h-4 w-4 text-[#0958D9]" />
          Bilateral Transactions (Dual-Ack)
        </h2>
        <span className="rounded-full bg-[#0958D9] px-2 py-0.5 text-[11px] font-semibold text-white tabular-nums">
          {ready.length} Ready
        </span>
      </div>

      <div className="space-y-3 p-4">
        {ready.length === 0 && (
          <p className="text-sm text-atmo-9">No transactions are awaiting SPP approval.</p>
        )}

        {ready.map((t) => (
          <div key={t.id} className="rounded-lg border border-atmo-3 p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="font-mono text-sm tabular-nums text-foreground">{t.id}</div>
              <div className="text-sm font-semibold tabular-nums text-foreground">
                {t.mwCapacity.toFixed(2)} MW
              </div>
            </div>
            <div className="mt-1 text-xs text-atmo-9">
              {t.firmType} · {t.startDate} – {t.stopDate}
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-foreground">
              <span className="truncate">{t.fromEntity}</span>
              <ArrowLeftRight className="h-3.5 w-3.5 shrink-0 text-atmo-8" />
              <span className="truncate">{t.toEntity}</span>
            </div>
            <div className="mt-3 flex gap-2">
              <Button
                size="sm"
                onClick={() => {
                  approveTransaction(t.id);
                  toast({ title: "Transaction approved", description: t.id });
                }}
                className="h-8 flex-1 gap-1 rounded-full bg-[#0F172A] px-3 text-xs text-white hover:bg-[#0F172A]/90"
              >
                Approve Transaction
                <Check className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPending(t)}
                className="h-8 gap-1 rounded-full border-atmo-5 bg-atmo-0 px-3 text-xs text-[#BE123C] hover:text-[#BE123C]"
              >
                Review Needed
                <Undo2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <ReturnSubmissionModal
        open={!!pending}
        onOpenChange={(v) => !v && setPending(null)}
        subject={pending ? `Transaction ${pending.id}` : ""}
        isTransaction
        onConfirm={(notes) => {
          if (!pending) return;
          rejectTransaction(pending.id, notes, "return");
          toast({ title: "Transaction returned", description: notes });
          setPending(null);
        }}
      />
    </div>
  );
};

export default BilateralTransactionsWidget;
