import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { rejectTransaction, type TransactionRecord } from "@/store/transactionsStore";

interface Props {
  tx: TransactionRecord | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const RejectTransactionDialog = ({ tx, open, onOpenChange }: Props) => {
  const [reason, setReason] = useState("");
  const [mode, setMode] = useState<"reject" | "return">("reject");

  if (!tx) return null;

  const submit = () => {
    if (!reason.trim()) {
      toast.error("A rejection reason is required.");
      return;
    }
    rejectTransaction(tx.id, reason.trim(), mode);
    toast.success(
      mode === "reject"
        ? `Transaction ${tx.id} rejected.`
        : `Transaction ${tx.id} returned to counterparties for revision.`,
    );
    setReason("");
    setMode("reject");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="text-base">
            Reject Transaction <span className="font-mono">#{tx.id}</span>
          </DialogTitle>
          <DialogDescription className="text-xs">
            The reason is recorded on the audit trail and shared with both counterparties.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">
              Rejection reason <span className="text-[#C82333]">*</span>
            </Label>
            <Textarea
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe the grid capability, documentation or data issue…"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Outcome</Label>
            <RadioGroup
              value={mode}
              onValueChange={(v) => setMode(v as "reject" | "return")}
              className="gap-2"
            >
              <label className="flex items-start gap-2 rounded-md border border-[#D9D9D9] p-3 cursor-pointer">
                <RadioGroupItem value="reject" className="mt-0.5" />
                <span>
                  <span className="block text-sm font-medium">Reject outright</span>
                  <span className="block text-xs text-atmo-8">
                    Terminal state — status becomes Rejected.
                  </span>
                </span>
              </label>
              <label className="flex items-start gap-2 rounded-md border border-[#D9D9D9] p-3 cursor-pointer">
                <RadioGroupItem value="return" className="mt-0.5" />
                <span>
                  <span className="block text-sm font-medium">Return for revision</span>
                  <span className="block text-xs text-atmo-8">
                    Status returns to Review Needed; both counterparties must act again.
                  </span>
                </span>
              </label>
            </RadioGroup>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-md">
            Cancel
          </Button>
          <Button
            onClick={submit}
            disabled={!reason.trim()}
            className="rounded-md bg-[#C82333] text-white hover:bg-[#C82333]/90"
          >
            {mode === "reject" ? "Reject Transaction" : "Return for Revision"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectTransactionDialog;
