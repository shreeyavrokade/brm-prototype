import { useEffect, useState } from "react";
import { AlertTriangle, Send, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { Issue } from "@/components/dashboard/types";
import { brand } from "@/config/brand";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectName: string;
  version: number;
  /** Open (undismissed) warnings that will be submitted as-is. */
  warnings: Issue[];
  onConfirm: () => void;
  /** Take the other path: correct the file and upload a new version. */
  onUploadCorrected: () => void;
}

const MAX_LISTED = 5;

/**
 * Optional fixes, option B: submit as-is. The submitter must explicitly accept
 * responsibility for every warning that wasn't corrected.
 */
const AcceptResponsibilityDialog = ({ open, onOpenChange, projectName, version, warnings, onConfirm, onUploadCorrected }: Props) => {
  const [agreed, setAgreed] = useState(false);
  useEffect(() => {
    if (!open) setAgreed(false);
  }, [open]);
  const n = warnings.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-[#6D4D09]" />
            Submit with {n} optional fix{n !== 1 ? "es" : ""} open?
          </DialogTitle>
          <DialogDescription>
            {projectName} · version {version} has no required fixes left, but {n} warning{n !== 1 ? "s were" : " was"} not
            corrected.
          </DialogDescription>
        </DialogHeader>

        <ul className="rounded-md border border-[#FFBE2E] bg-[#FCF2D9] divide-y divide-[#F6E2B6] text-sm">
          {warnings.slice(0, MAX_LISTED).map((w) => (
            <li key={w.id} className="px-3 py-2">
              <span className="font-mono text-xs font-semibold text-[#6D4D09]">
                {w.rowId.replace(/^[A-Z]+-/, "")} · {w.fieldName}
              </span>
              <p className="text-[#4D4D4D] leading-snug">{w.message}</p>
            </li>
          ))}
          {n > MAX_LISTED && <li className="px-3 py-2 text-xs text-[#6D4D09]">+ {n - MAX_LISTED} more</li>}
        </ul>

        <div className="text-sm text-atmo-10 space-y-1.5">
          <p>
            <span className="font-semibold text-foreground">Reminder:</span> submitting as-is means you confirm this data is
            intentional and accurate. {brand.clientShortName} engineers will see these warnings, and your acceptance, during
            review.
          </p>
          <p>
            Prefer to fix them? Correct the file and upload version {version + 1} instead.
          </p>
        </div>

        <div className="flex items-start gap-2.5 rounded-md border border-atmo-4 p-3">
          <Checkbox id="accept-responsibility" checked={agreed} onCheckedChange={(v) => setAgreed(v === true)} className="mt-0.5" />
          <Label htmlFor="accept-responsibility" className="font-normal leading-snug cursor-pointer">
            I have reviewed the {n} optional fix{n !== 1 ? "es" : ""} above and accept responsibility for submitting this data
            as-is.
          </Label>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="outline" onClick={onUploadCorrected} className="rounded-full gap-1.5">
            <Upload className="h-4 w-4" />
            Upload corrected version
          </Button>
          <Button
            disabled={!agreed}
            onClick={onConfirm}
            className="bg-brand-secondary text-brand-secondary-invert hover:bg-brand-secondary/90 rounded-full gap-1.5"
          >
            <Send className="h-4 w-4" />
            Accept responsibility &amp; submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AcceptResponsibilityDialog;
