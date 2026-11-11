import StatusPill, { type StatusKey } from "@/components/shared/statusBadge";
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, FileText, Lock, MessageSquare, Send, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import SharedAssetBadge, { SharedFlag } from "./SharedAssetBadge";

export interface SubmissionHeaderProps {
  backTo: string;
  submittalId: string;
  name: string;
  subline?: string;
  reviewStatus: string;
  reviewStatusStyle?: { bg: string; fg: string };
  sharedFlags?: SharedFlag[];
  errorCount: number;
  onToggleActivity: () => void;
  onToggleDocs: () => void;
  onUploadUpdated: () => void;
  onSubmit?: () => void;
  extraActions?: ReactNode;
  hideDocs?: boolean;
}

const SubmissionHeader = ({
  backTo, submittalId, name, subline, reviewStatus, sharedFlags = [],
  errorCount, onToggleActivity, onToggleDocs, onUploadUpdated, onSubmit, extraActions, hideDocs = false,
}: SubmissionHeaderProps) => {
  const canSubmit = errorCount === 0;

  return (
    <header className="border-b bg-card px-6 py-3 flex items-center justify-between gap-6 shrink-0">
      <div className="flex items-center gap-2 min-w-0">
        <Button asChild variant="ghost" size="sm" className="h-8 px-2 shrink-0 text-atmo-8 hover:text-foreground gap-1.5">
          <Link to={backTo} aria-label="Back">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-xs font-medium">Back</span>
          </Link>
        </Button>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-base font-semibold truncate">{name}</h1>
            <StatusPill status={reviewStatus as StatusKey} className="text-[10px]" />
            {sharedFlags.map((f) => (<SharedAssetBadge key={f} flag={f} />))}
          </div>
          <div className="flex items-center gap-2.5 text-[11px] text-muted-foreground mt-0.5 font-mono">
            <span>{submittalId}</span>
            {subline && <span className="text-atmo-9 font-sans normal-case">· {subline}</span>}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <TooltipProvider>
          {!hideDocs && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onToggleDocs} aria-label="Documents">
                  <FileText className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Documents</TooltipContent>
            </Tooltip>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onToggleActivity} aria-label="Activity">
                <MessageSquare className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Activity</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {extraActions}

        <Button
          variant="outline"
          size="sm"
          onClick={onUploadUpdated}
          className="text-xs gap-1.5 h-8 ml-1 rounded-full px-4 border-[#222222] text-[#222222] bg-transparent hover:bg-[#222222] hover:text-atmo-0"
        >
          <Upload className="h-3.5 w-3.5" />
          Upload Updated File
        </Button>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span tabIndex={0}>
                <Button
                  size="sm"
                  disabled={!canSubmit}
                  onClick={onSubmit}
                  className="text-xs gap-1.5 h-8 rounded-full px-4 disabled:!bg-atmo-3 disabled:!text-secondary-60 disabled:!opacity-100 bg-neutral-950 text-white"
                >
                  {canSubmit ? <Send className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                  Submit for Review
                  {errorCount > 0 && (
                    <Badge className="ml-1 h-4 px-1.5 text-[10px] bg-destructive text-destructive-foreground hover:bg-destructive border-0">
                      {errorCount}
                    </Badge>
                  )}
                </Button>
              </span>
            </TooltipTrigger>
            {!canSubmit && (
              <TooltipContent>
                <p>Resolve all {errorCount} error{errorCount !== 1 ? "s" : ""} to enable submission.</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  );
};

export default SubmissionHeader;
