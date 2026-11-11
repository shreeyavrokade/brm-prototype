import { Network, Gauge, LineChart, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatVisitTime, type MemModuleId } from "@/store/memPassStore";

const ICONS: Record<MemModuleId, typeof Network> = {
  topology: Network,
  ratings: Gauge,
  profiles: LineChart,
  transactions: ArrowLeftRight,
};

interface Props {
  id: MemModuleId;
  label: string;
  /** Middle info line, e.g. "0 Errors, 0 Warnings". */
  summary: string;
  /** Visit timestamp for the current pass; undefined = Incomplete. */
  visitedAt?: number;
  onOpen: () => void;
}

const ModuleActivityCard = ({ id, label, summary, visitedAt, onOpen }: Props) => {
  const Icon = ICONS[id];
  const complete = !!visitedAt;

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-5 flex flex-col gap-3 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Icon className="h-4 w-4 text-neutral-500 shrink-0" />
          <span className="text-sm font-bold text-neutral-900 truncate">{label}</span>
        </div>
        <span
          className={cn(
            "text-[11px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap",
            complete
              ? "bg-[#DEEDE2] text-[#146C2E] border border-[#146C2E]/30"
              : "bg-[#FBE5E8] text-[#C82333] border border-[#C82333]/30",
          )}
        >
          {complete ? "Complete" : "Incomplete"}
        </span>
      </div>

      <p className="text-xs text-neutral-500">
        {complete
          ? `Inspected / Updated on ${formatVisitTime(visitedAt!)}`
          : "Attention Needed — Module not yet inspected."}
      </p>

      <div className="text-sm text-neutral-700 border-t border-neutral-100 pt-3">
        {summary}
      </div>

      <Button
        variant="outline"
        className="w-full justify-center mt-auto"
        onClick={onOpen}
      >
        Open &amp; Inspect Grid →
      </Button>
    </div>
  );
};

export default ModuleActivityCard;
