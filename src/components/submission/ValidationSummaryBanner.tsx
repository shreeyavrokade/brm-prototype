import { CheckCircle, Eye, PaperPlaneTilt, Warning, WarningCircle, XCircle, Wrench } from "@phosphor-icons/react";
import type { DatasetStatus } from "./datasetStatus";

interface Props {
  status: DatasetStatus;
  errors: number;
  warnings: number;
  datasetLabel?: string;
  onInspect?: () => void;
  onSubmit?: () => void;
  onViewGrid?: () => void;
  rejectionNote?: string;
}

const shell = "rounded-xl p-4 mb-6 flex items-center justify-between shadow-sm gap-6 border";
const blackBtn =
  "shrink-0 inline-flex items-center gap-1.5 bg-[#222222] text-white hover:bg-[#4D4D4D] text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors";
const outlineBtn =
  "shrink-0 inline-flex items-center gap-1.5 border border-[#D9D9D9] bg-white hover:bg-[#F0F0F0] text-[#222222] text-xs font-semibold px-4 py-2 rounded-lg transition-colors";

const ValidationSummaryBanner = ({
  status,
  errors,
  warnings,
  datasetLabel = "Dataset",
  onInspect,
  onSubmit,
  onViewGrid,
  rejectionNote,
}: Props) => {
  if (status === "Draft") return null;

  if (status === "Review Needed") {
    return (
      <div className={`${shell} bg-[#FBE5E8] border-[#C82333]`}>
        <div className="flex items-start gap-3 min-w-0">
          <XCircle size={24} weight="fill" className="text-[#C82333] shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-bold text-[#222222]">
              Review Needed: {errors} Error{errors !== 1 ? "s" : ""}, {warnings} Warning
              {warnings !== 1 ? "s" : ""} Found
            </p>
            <p className="text-xs text-[#6C6B6B] mt-0.5">
              Resolve every flagged cell before this {datasetLabel.toLowerCase()} can be submitted to SPP model build.
            </p>
          </div>
        </div>
        <button type="button" onClick={onInspect} className={blackBtn}>
          <Wrench size={14} weight="bold" /> Inspect &amp; Resolve Issues
        </button>
      </div>
    );
  }

  if (status === "Pending Validation") {
    return (
      <div className={`${shell} bg-[#E0E6F5] border-[#2064B4]`}>
        <div className="flex items-start gap-3 min-w-0">
          <Warning size={24} weight="fill" className="text-[#2064B4] shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-bold text-[#222222]">Pending Validation</p>
            <p className="text-xs text-[#6C6B6B] mt-0.5">Running automated SPP validation rules...</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "Pending Submittal") {
    return (
      <div className={`${shell} bg-[#F0EAF8] border-[#5B2C6F]`}>
        <div className="flex items-start gap-3 min-w-0">
          <CheckCircle size={24} weight="fill" className="text-[#5B2C6F] shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-bold text-[#222222]">Ready for Submittal</p>
            <p className="text-xs text-[#6C6B6B] mt-0.5">
              0 Warnings, 0 Errors. {datasetLabel} passed all automated validation rules.
            </p>
          </div>
        </div>
        <button type="button" onClick={onSubmit} className={blackBtn}>
          <PaperPlaneTilt size={14} weight="bold" /> Submit to SPP Model Build
        </button>
      </div>
    );
  }

  if (status === "Accepted") {
    return (
      <div className={`${shell} bg-[#DEEDE2] border-[#146C2E]`}>
        <div className="flex items-start gap-3 min-w-0">
          <CheckCircle size={24} weight="fill" className="text-[#146C2E] shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-bold text-[#146C2E]">Dataset Accepted</p>
            <p className="text-xs text-[#146C2E]/80 mt-0.5">
              0 Warnings, 0 Errors. All parameters meet model build specifications.
            </p>
          </div>
        </div>
        {onViewGrid && (
          <button type="button" onClick={onViewGrid} className={outlineBtn}>
            <Eye size={14} weight="bold" /> View Verified Grid
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`${shell} bg-[#FBE5E8] border-[#C82333]`}>
      <div className="flex items-start gap-3 min-w-0">
        <WarningCircle size={24} weight="fill" className="text-[#C82333] shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-bold text-[#222222]">Dataset Rejected by EP Engineer</p>
          <p className="text-xs text-[#6C6B6B] mt-0.5">
            {rejectionNote ??
              "Returned for rework — see engineer notes in the activity log before resubmitting."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ValidationSummaryBanner;
