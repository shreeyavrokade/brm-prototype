import { cn } from "@/lib/utils";
import type { IssueFilter } from "./validationIssues";

interface Props {
  filter: IssueFilter;
  onChange: (f: IssueFilter) => void;
  total: number;
  errors: number;
  warnings: number;
}

const base = "rounded-full px-3 py-1 text-xs transition-colors border";

const IssueFilterBar = ({ filter, onChange, total, errors, warnings }: Props) => {
  const valid = total - errors - warnings;
  const items: { key: IssueFilter; label: string; cls: string; active: string }[] = [
    {
      key: "all",
      label: `All Records (${total})`,
      cls: "bg-atmo-1 text-atmo-10 border-atmo-4 font-medium",
      active: "bg-[#222222] text-white border-[#222222]",
    },
    {
      key: "errors",
      label: `Errors (${errors})`,
      cls: "bg-[#FBE5E8] text-[#C82333] font-semibold border-transparent",
      active: "ring-2 ring-[#C82333] ring-offset-1",
    },
    {
      key: "warnings",
      label: `Warnings (${warnings})`,
      cls: "bg-[#FCF2D9] text-[#6D4D09] font-semibold border-transparent",
      active: "ring-2 ring-[#FFBE2E] ring-offset-1",
    },
    {
      key: "valid",
      label: `Valid (${valid})`,
      cls: "bg-[#DEEDE2] text-[#146C2E] font-semibold border-transparent",
      active: "ring-2 ring-[#146C2E] ring-offset-1",
    },
  ];

  return (
    <div className="flex items-center gap-2 mb-4">
      {items.map((i) => (
        <button
          key={i.key}
          type="button"
          aria-pressed={filter === i.key}
          onClick={() => onChange(i.key)}
          className={cn(base, i.cls, filter === i.key && i.active)}
        >
          {i.label}
        </button>
      ))}
    </div>
  );
};

export default IssueFilterBar;
