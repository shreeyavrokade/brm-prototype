import { useState } from "react";
import { Check, PencilSimple, Warning, WarningCircle, X } from "@phosphor-icons/react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { CellIssue } from "./validationIssues";

/** Renders a grid cell value wrapped in error/warning styling with a rule tooltip. */
const IssueCell = ({
  issue,
  children,
  onSelect,
  onResolve,
}: {
  issue: CellIssue;
  children: React.ReactNode;
  onSelect?: (issue: CellIssue) => void;
  /** When provided the cell becomes inline-editable; committing a value clears the issue. */
  onResolve?: (issue: CellIssue, value: string) => void;
}) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(
    children === null || children === undefined ? "" : String(children),
  );

  const commit = () => {
    setEditing(false);
    onResolve?.(issue, draft.trim());
  };

  if (editing) {
    return (
      <div className="flex items-center gap-1">
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") setEditing(false);
          }}
          className="w-full min-w-[64px] h-6 px-1.5 rounded border border-[#2064B4] font-mono text-sm outline-none"
        />
        <button type="button" onClick={commit} className="text-[#146C2E] shrink-0" aria-label="Save value">
          <Check size={14} weight="bold" />
        </button>
        <button type="button" onClick={() => setEditing(false)} className="text-[#6C6B6B] shrink-0" aria-label="Cancel">
          <X size={14} weight="bold" />
        </button>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => onSelect?.(issue)}
            onDoubleClick={() => onResolve && setEditing(true)}
            className={cn(
              "w-full flex items-center justify-between gap-1.5 rounded px-2 py-1 font-mono font-bold text-left cursor-pointer group",
              issue.severity === "error" ? "bg-[#FBE5E8] text-[#C82333]" : "bg-[#FCF2D9] text-[#6D4D09]",
            )}
          >
            <span className="truncate">
              {children === "" || children === null || children === undefined ? "—" : children}
            </span>
            <span className="flex items-center gap-1 shrink-0">
              {onResolve && (
                <PencilSimple
                  size={12}
                  weight="bold"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditing(true);
                  }}
                />
              )}
              {issue.severity === "error" ? (
                <WarningCircle size={14} weight="fill" className="text-[#C82333]" />
              ) : (
                <Warning size={14} weight="fill" className="text-[#FFBE2E]" />
              )}
            </span>
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[280px]">
          <p className="text-xs font-semibold">
            Rule {issue.code}: {issue.rule}
          </p>
          <p className="text-xs mt-0.5">{issue.description}</p>
          {onResolve && <p className="text-[10px] mt-1 opacity-70">Double-click to correct this value.</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default IssueCell;
