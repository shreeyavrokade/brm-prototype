import { useState } from "react";
import { ChevronDown, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ValidationWarning } from "./mockLogs";
import { useSubmissionIssue } from "./SubmissionIssueContext";

const SEVERITY_CLS: Record<ValidationWarning["severity"], string> = {
  error: "bg-destructive/15 text-destructive",
  warning: "bg-[#FBF2D8] text-[#5C4A12]",
  info: "bg-atmo-2 text-atmo-10",
};

const ValidationLog = ({ warnings }: { warnings: ValidationWarning[] }) => {
  const [open, setOpen] = useState(true);
  const { setHoveredRef } = useSubmissionIssue();
  if (warnings.length === 0) return null;

  return (
    <div className="border border-[#B59A3A]/40 bg-[#FBF2D8]/40 rounded-md mb-3 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-[#FBF2D8]/70 transition-colors"
      >
        {open ? <ChevronDown className="h-3.5 w-3.5 text-[#5C4A12]" /> : <ChevronRight className="h-3.5 w-3.5 text-[#5C4A12]" />}
        <Sparkles className="h-4 w-4 text-[#5C4A12]" />
        <span className="text-xs font-semibold uppercase tracking-wide text-[#5C4A12]">AI Validation Log — Engineering Anomalies</span>
        <span className="text-[11px] text-[#5C4A12]/80 tabular-nums">{warnings.length} flagged</span>
      </button>
      {open && (
        <div className="border-t border-[#B59A3A]/30 divide-y divide-[#B59A3A]/20">
          {warnings.map((w) => (
            <div
              key={w.id}
              className="px-4 py-2 flex items-start gap-3 text-xs cursor-pointer hover:bg-[#FBF2D8]/70 transition-colors"
              onMouseEnter={() => w.rowRef && setHoveredRef(w.rowRef)}
              onMouseLeave={() => setHoveredRef(null)}
            >
              <span className={cn("shrink-0 rounded-full px-2 py-0.5 font-semibold uppercase tracking-wide", SEVERITY_CLS[w.severity])}>
                {w.severity}
              </span>
              <span className="shrink-0 w-24 font-mono text-[11px] text-atmo-8 uppercase">{w.category}</span>
              <span className="font-mono text-[11px] text-atmo-10 shrink-0 w-28">{w.asset ?? "—"}</span>
              <span className="text-foreground">{w.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ValidationLog;
