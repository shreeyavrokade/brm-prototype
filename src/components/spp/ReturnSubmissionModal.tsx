import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  /** Label of the item being returned (file name or transaction id). */
  subject: string;
  /** Transactions show the dual-ack reset notice. */
  isTransaction?: boolean;
  onConfirm: (notes: string) => void;
}

export const ReturnSubmissionModal = ({
  open,
  onOpenChange,
  subject,
  isTransaction,
  onConfirm,
}: Props) => {
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (open) setNotes("");
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Return Submission for Revision</DialogTitle>
          <DialogDescription>{subject}</DialogDescription>
        </DialogHeader>

        {isTransaction && (
          <div className="flex gap-2 rounded-md border border-[#FDA4AF] bg-[#FFF1F2] p-3 text-xs text-[#BE123C]">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>
              Returning this transaction resets Acknowledgement state to Action Needed for both
              counterparties.
            </span>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="spp-return-notes" className="text-xs font-semibold">
            SPP Engineer Revision Notes <span className="text-[#C82333]">*</span>
          </Label>
          <Textarea
            id="spp-return-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={5}
            placeholder="Describe the corrections the submitting member must make…"
            className="text-sm"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-full">
            Cancel
          </Button>
          <Button
            disabled={!notes.trim()}
            onClick={() => {
              onConfirm(notes.trim());
              onOpenChange(false);
            }}
            className="rounded-full bg-[#0F172A] text-white hover:bg-[#0F172A]/90"
          >
            Confirm Return
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReturnSubmissionModal;
