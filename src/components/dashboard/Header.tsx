import { Upload, Send, MessageSquare, FileText, Download, Lock, X, ArrowLeft, FileDown, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PhaseMetadata } from "./types";
import { StatusPill } from "@/components/shared/statusBadge";

interface HeaderProps {
  errorCount: number;
  title?: string;
  submittalId?: string;
  reviewStatus?: string;
  phaseMetadata?: PhaseMetadata;
  onToggleActivity: () => void;
  onToggleDocs: () => void;
  onClose?: () => void;
  onBack?: () => void;
  onDownloadCurrent?: () => void;
  onDownloadRatings?: () => void;
  onUploadNewVersion?: () => void;
  onSubmit?: () => void;
  /** Overrides the default "errors must be 0" submit gate (e.g. while validating or after submittal). */
  submitDisabledReason?: string;
}

const Header = ({
  errorCount,
  title = "527_WFEC_BoswellTap",
  submittalId = "PRJ-2025-M7",
  reviewStatus = "Review Needed",
  phaseMetadata,
  onToggleActivity,
  onToggleDocs,
  onClose,
  onBack,
  onDownloadCurrent,
  onDownloadRatings,
  onUploadNewVersion,
  onSubmit,
  submitDisabledReason,
}: HeaderProps) => {
  const canSubmit = errorCount === 0 && !submitDisabledReason;
  const handleDownloadCurrent = onDownloadCurrent ?? (() => console.log("Download current file"));
  const handleDownloadRatings = onDownloadRatings ?? (() => console.log("Download ratings file"));

  return (
    <header className="border-b bg-card px-6 py-3 flex items-center justify-between gap-6 shrink-0">
      {/* Left: Back CTA + Project title + metadata stacked */}
      <div className="flex items-center gap-2 min-w-0">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 shrink-0 text-atmo-8 hover:text-foreground gap-1.5"
          onClick={onBack ?? onClose}
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-xs font-medium">Back</span>
        </Button>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold truncate">{title}</h1>
            <StatusPill status={reviewStatus as never} />
          </div>
          <div className="flex items-center gap-2.5 text-[11px] text-muted-foreground mt-0.5">
            <span>{submittalId}</span>
          </div>
        </div>
      </div>

      {/* Right: All user actions on a single row */}
      <div className="flex items-center gap-1 shrink-0">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onToggleDocs} aria-label="Documents">
                <FileText className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Documents</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onToggleActivity} aria-label="Activity">
                <MessageSquare className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Activity</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              aria-label="Download Files"
              className="h-8 w-8 bg-transparent text-[#222222] hover:bg-atmo-2"
            >
              <Download className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-atmo-0 min-w-[14rem]">
            <DropdownMenuItem onClick={handleDownloadCurrent} className="text-primary-200 gap-2 cursor-pointer">
              <FileDown className="h-4 w-4" />
              Download Current File
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDownloadRatings} className="text-primary-200 gap-2 cursor-pointer">
              <FileSpreadsheet className="h-4 w-4" />
              Download Ratings File
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" size="sm" onClick={onUploadNewVersion} className="text-xs gap-1.5 h-8 ml-1 rounded-full px-4 border-[#222222] text-[#222222] bg-transparent hover:bg-[#222222] hover:text-atmo-0">
          <Upload className="h-3.5 w-3.5" />
          Upload New Version
        </Button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span tabIndex={0}>
                <Button
                  size="sm"
                  variant="brand"
                  disabled={!canSubmit}
                  onClick={onSubmit}
                  className="text-xs gap-1.5 h-8 rounded-full px-4 disabled:!bg-atmo-3 disabled:!text-secondary-60 disabled:!opacity-100 bg-neutral-950"
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
                <p>
                  {submitDisabledReason ??
                    `Resolve all ${errorCount} error${errorCount !== 1 ? "s" : ""} to enable submission.`}
                </p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>

        {onClose && (
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 ml-1" onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
