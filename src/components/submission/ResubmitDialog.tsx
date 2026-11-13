import { useEffect, useState } from "react";
import { CheckCircle2, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FileDropzone from "@/components/import/FileDropzone";
import UploadErrorCard from "@/components/import/UploadErrorCard";
import { countIssues, parsePrj, type FatalProblem, type ParsedPrj } from "@/lib/topologyPrj";

interface ResubmitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectName: string;
  currentVersion: number;
  openErrors: number;
  openWarnings: number;
  onResubmit: (parsed: ParsedPrj) => void;
  /** Download the current version to correct it offline. */
  onDownloadCurrent?: () => void;
}

/**
 * Explains the resubmission process and runs the same intake checks as the
 * import flow before a corrected version is accepted for re-validation.
 */
const ResubmitDialog = ({
  open,
  onOpenChange,
  projectName,
  currentVersion,
  openErrors,
  openWarnings,
  onResubmit,
  onDownloadCurrent,
}: ResubmitDialogProps) => {
  const [problem, setProblem] = useState<FatalProblem | null>(null);
  const [candidate, setCandidate] = useState<ParsedPrj | null>(null);
  const nextVersion = currentVersion + 1;
  const expectedName = `${projectName}_v${nextVersion}.prj`;

  useEffect(() => {
    if (!open) {
      setProblem(null);
      setCandidate(null);
    }
  }, [open]);

  const handleFiles = async (files: File[]) => {
    const f = files[0];
    setCandidate(null);
    const result = parsePrj(f.name, await f.text());
    if (!result.ok) return setProblem(result.problem);
    const p = result.parsed;
    if (p.projectName !== projectName) {
      return setProblem({
        kind: "naming",
        title: "This file belongs to a different project",
        messages: [`"${f.name}" is for ${p.projectName}. A new version of this submission must be named ${expectedName}.`],
      });
    }
    if (p.version <= currentVersion) {
      return setProblem({
        kind: "naming",
        title: "Version already submitted",
        messages: [`Version ${p.version} is already on file. Add a version suffix, e.g. ${expectedName}.`],
      });
    }
    setProblem(null);
    setCandidate(p);
  };

  const preview = candidate ? countIssues(candidate.issues) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Upload a corrected version</DialogTitle>
          <DialogDescription>
            Version {currentVersion} has {openErrors} required fix{openErrors !== 1 ? "es" : ""} (errors) and {openWarnings}{" "}
            optional fix{openWarnings !== 1 ? "es" : ""} (warnings).
          </DialogDescription>
        </DialogHeader>

        <ul className="text-sm text-atmo-10 space-y-2 list-disc pl-5">
          <li>
            <span className="font-semibold text-foreground">Correct offline:</span>{" "}
            {onDownloadCurrent ? (
              <button type="button" onClick={onDownloadCurrent} className="text-[#2064B4] underline underline-offset-2">
                download version {currentVersion}
              </button>
            ) : (
              <>take version {currentVersion}</>
            )}
            , fix the flagged values in your source data and export a new file. Required fixes must be corrected; optional
            fixes are up to you.
          </li>
          <li>
            <span className="font-semibold text-foreground">What happens:</span> the new file replaces version {currentVersion}{" "}
            and is re-validated against the same rules. The status shows Pending Validation while it runs.
          </li>
          <li>
            <span className="font-semibold text-foreground">Required:</span> same project, next version number —{" "}
            <span className="font-mono text-xs bg-atmo-2 px-1.5 py-0.5 rounded">{expectedName}</span>
          </li>
          <li>
            <span className="font-semibold text-foreground">Expected outcome:</span> no fixes left → ready to submit. Only
            optional fixes left → submit as-is with a responsibility acknowledgement, or correct them in another version.
            Required fixes left → stays in Review Needed.
          </li>
        </ul>

        <FileDropzone accept=".prj" hint="Max. file size 10MB (.prj)" label="Corrected file" onFiles={handleFiles} />

        {problem && (
          <UploadErrorCard
            title={problem.title}
            messages={problem.messages}
            nextStep="Fix the file and drop it here again. Nothing was replaced."
          />
        )}
        {candidate && preview && (
          <div role="status" className="rounded-md border border-[#146C2E]/40 bg-[#DEEDE2] px-4 py-3 text-sm flex gap-3">
            <CheckCircle2 className="h-5 w-5 text-[#146C2E] shrink-0" />
            <div>
              <p className="font-semibold text-[#146C2E]">{candidate.fileName} is ready to resubmit</p>
              <p className="text-[#0F4F22]">File checks passed. Reliability rules run when you resubmit.</p>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={!candidate}
            onClick={() => candidate && onResubmit(candidate)}
            className="bg-brand-secondary text-brand-secondary-invert hover:bg-brand-secondary/90 rounded-full gap-1.5"
          >
            <RefreshCw className="h-4 w-4" />
            Resubmit for validation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResubmitDialog;
