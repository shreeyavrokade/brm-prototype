import { useState, useEffect, useMemo } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  PaperPlaneRight,
  X,
  ArrowsLeftRight,
  PencilSimple,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import {
  updateTransaction,
  type TransactionRecord,
  type SeasonalMW,
} from "@/store/transactionsStore";
import { currentParty, partyLabel } from "./ackRole";
import { AckStatePill } from "./ackBadge";
import { cn } from "@/lib/utils";

interface Props {
  tx: TransactionRecord | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const SEASON_KEYS: Array<keyof SeasonalMW> = [
  "s27G", "s27S", "s27F", "s27W",
  "s28G", "s28L", "s28S", "s28F", "s28W",
  "s29L", "s29S",
  "s31L", "s31S", "s31SH", "s31W",
];

const SEASON_META: Record<string, string> = {
  G: "Shoulder",
  S: "Summer Peak",
  F: "Fall",
  W: "Winter",
  L: "Light Load",
  SH: "Shoulder",
};
const readable = (k: keyof SeasonalMW) => {
  const raw = k.slice(1);
  const yearDigits = raw.slice(0, 2);
  const code = raw.slice(2);
  return { year: `20${yearDigits}`, code: raw, label: SEASON_META[code] ?? code };
};

const CounterOfferDialog = ({ tx, open, onOpenChange }: Props) => {
  const [editing, setEditing] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const [justification, setJustification] = useState("");

  const acting = currentParty();
  const other = acting === "cp1" ? "cp2" : "cp1";

  /** Most recent counter on the table: stored values, else a mock first counter. */
  const latestCounter = useMemo(() => {
    const map: Record<string, number> = {};
    if (!tx) return map;
    SEASON_KEYS.forEach((k) => {
      const stored = tx.counterMW?.[k];
      map[k] =
        typeof stored === "number"
          ? stored
          : Math.round((tx[k] as number) * 0.92 * 100) / 100;
    });
    return map;
  }, [tx]);

  useEffect(() => {
    if (tx && open) {
      setEditing(false);
      setJustification("");
      const seed: Record<string, string> = {};
      SEASON_KEYS.forEach((k) => {
        seed[k] = latestCounter[k].toFixed(2);
      });
      setValues(seed);
    }
  }, [tx, open, latestCounter]);

  if (!tx) return null;

  const counterpartyName = acting === "cp1" ? tx.toEntity : tx.fromEntity;
  const turn = tx.counterTurn ?? 1;

  /** Accept the most recent counter: acting party acknowledges.
   *  Store auto-advances to Pending Approval once both parties agree. */
  const handleAccept = () => {
    const patch: Partial<TransactionRecord> = {
      counterOfferPending: false,
      ...(acting ? { [acting === "cp1" ? "cp1Ack" : "cp2Ack"]: "Acknowledged" as const } : {}),
    };
    SEASON_KEYS.forEach((k) => {
      (patch as any)[k] = latestCounter[k];
    });
    updateTransaction(tx.id, patch);
    toast.success(`Counter accepted — ${tx.id}.`);
    onOpenChange(false);
  };

  /** Counter again: overwrite the most recent counter and flip the turn. */
  const handleSendCounter = () => {
    if (justification.trim().length === 0) {
      toast.error("Justification is required.");
      return;
    }
    const counterMW: Partial<Record<keyof SeasonalMW, number>> = {};
    SEASON_KEYS.forEach((k) => {
      const n = Number(values[k]);
      if (!Number.isNaN(n)) counterMW[k] = n;
    });
    updateTransaction(tx.id, {
      counterOfferPending: true,
      counterNote: justification.trim(),
      counterMW,
      counterBy: acting ?? undefined,
      counterTurn: turn + 1,
      reviewStatus: "Review Needed",
      ...(acting
        ? {
            [acting === "cp1" ? "cp1Ack" : "cp2Ack"]: "Acknowledged" as const,
            [other === "cp1" ? "cp1Ack" : "cp2Ack"]: "Action Needed" as const,
          }
        : {}),
    });
    toast.success(`New counter offer sent to ${counterpartyName} for approval`);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[640px] sm:max-w-[640px] sm:w-[640px] bg-white h-full border-l border-[#D9D9D9] shadow-2xl p-0 z-50 flex flex-col"
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-[#D9D9D9] flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-foreground">
              Counter Offer — <span className="font-mono">Transaction #{tx.id}</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Submitting Entity: {tx.fromEntity} | Counterparty: {tx.toEntity}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium bg-[#FCF2D9] text-[#6D4D09]">
                <ArrowsLeftRight size={12} weight="bold" />
                Negotiation turn {turn}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                {partyLabel(tx, "cp1")}: <AckStatePill state={tx.cp1Ack} />
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                {partyLabel(tx, "cp2")}: <AckStatePill state={tx.cp2Ack} />
              </span>
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold mb-2">
              Seasonal Capacity Comparison (Out-Year MW)
            </div>
            <div className="border border-[#D9D9D9] rounded-md overflow-hidden">
              <div className="max-h-[420px] overflow-auto">
                <table className="w-full text-xs">
                  <thead className="bg-atmo-1 sticky top-0 z-10">
                    <tr>
                      <th className="text-left px-2 py-2 font-semibold text-atmo-10 border-b border-[#E2E8F0]">
                        Season / Code
                      </th>
                      <th className="text-right px-2 py-2 font-semibold text-atmo-10 border-b border-[#E2E8F0]">
                        Original Value (MW)
                      </th>
                      <th
                        className={cn(
                          "text-right px-2 py-2 font-semibold text-atmo-10 border-b border-[#E2E8F0]",
                          editing && "bg-[#E0E6F5]/60",
                        )}
                      >
                        Most Recent Counter (MW)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {SEASON_KEYS.map((k, i) => {
                      const orig = tx[k] as number;
                      const meta = readable(k);
                      return (
                        <tr key={k} className={i % 2 === 1 ? "bg-zebra" : ""}>
                          <td className="px-2 py-1.5 text-atmo-10 border-b border-[#EEF1F5]">
                            <span className="font-medium">
                              {meta.year} {meta.label}
                            </span>{" "}
                            <span className="font-mono text-muted-foreground">[{meta.code}]</span>
                          </td>
                          <td className="px-2 py-1.5 text-right font-mono tabular-nums text-atmo-10 border-b border-[#EEF1F5]">
                            {orig.toFixed(2)}
                          </td>
                          {editing ? (
                            <td className="px-2 py-1 text-right border-b border-[#EEF1F5]">
                              <input
                                type="number"
                                step="0.01"
                                value={values[k] ?? ""}
                                onChange={(e) =>
                                  setValues((v) => ({ ...v, [k]: e.target.value }))
                                }
                                className="w-24 text-right bg-[#E0E6F5]/50 border border-[#4D4D4D] rounded px-2 py-1 text-xs font-mono tabular-nums focus:bg-white focus:border-[#222222] focus:outline-none"
                              />
                            </td>
                          ) : (
                            <td className="px-2 py-1.5 text-right font-mono tabular-nums text-atmo-10 border-b border-[#EEF1F5]">
                              {latestCounter[k].toFixed(2)}
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {editing && (
            <div className="space-y-1.5">
              <Label className="text-xs">
                Notes / Justification for Counter Offer{" "}
                <span className="text-[#C82333]">*</span>
              </Label>
              <Textarea
                rows={3}
                placeholder="Explain why the seasonal allocations are being revised…"
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#D9D9D9] px-6 py-4 flex items-center justify-between gap-2 bg-white">
          {editing ? (
            <>
              <Button variant="outline" onClick={() => setEditing(false)} className="rounded-md">
                Cancel / Reset
              </Button>
              <Button
                onClick={handleSendCounter}
                disabled={justification.trim().length === 0}
                className="bg-[#222222] text-white hover:bg-[#222222]/90 gap-1.5 rounded-md"
              >
                <PaperPlaneRight weight="fill" size={14} />
                Send Counter for Approval
              </Button>
            </>
          ) : (
            <>
              <span className="text-[11px] text-muted-foreground">
                Review the most recent counter, then accept or counter again.
              </span>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleAccept}
                  className="bg-[#146C2E] text-white hover:bg-[#146C2E]/90 rounded-md"
                >
                  Accept Counter
                </Button>
                <Button
                  onClick={() => setEditing(true)}
                  className="bg-[#222222] text-white hover:bg-[#222222]/90 gap-1.5 rounded-md"
                >
                  <PencilSimple weight="fill" size={14} />
                  Counter Again
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CounterOfferDialog;
