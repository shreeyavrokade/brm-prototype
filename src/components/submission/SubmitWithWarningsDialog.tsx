import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { brand } from "@/config/brand";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Number of open optional fixes (warnings). */
  warningCount: number;
  onConfirm: () => void;
}

/**
 * Optional fixes, option B: submit as-is. Matches the "Submit File with
 * Unresolved Warnings?" design. Confirming means the submitter takes
 * responsibility for the flagged data; engineers may still return the file.
 */
const SubmitWithWarningsDialog = ({ open, onOpenChange, warningCount, onConfirm }: Props) => {
  const C = brand.clientShortName;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] gap-5">
        <DialogHeader className="space-y-3 text-left">
          <DialogTitle className="text-base font-semibold text-[#222222]">Submit File with Unresolved Warnings?</DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-4 text-sm leading-relaxed text-[#6C6B6B]">
              <p>
                Your file has passed critical error checks, but {warningCount} warning{warningCount !== 1 ? "s were" : " was"}{" "}
                detected.
              </p>
              <p>
                You may proceed with submitting this file to {C} Engineering for review. Please note that {C} Engineers will
                evaluate these warnings and may return the file if updates are required.
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-[#D9D9D9]">
            Cancel
          </Button>
          <Button onClick={onConfirm} className="bg-[#222222] text-white hover:bg-[#4D4D4D]">
            Submit for {C} Review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubmitWithWarningsDialog;
