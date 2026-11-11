import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

const MILESTONES = [
  "Pass 1 Review",
  "Pass 2 Review",
  "Pass 3 Review",
  "Initial Final Case",
  "Final Model Commit",
];

export const MilestoneStepper = ({ activeIndex = 0 }: { activeIndex?: number }) => (
  <div className="flex items-center gap-1 overflow-x-auto">
    {MILESTONES.map((m, i) => (
      <div key={m} className="flex items-center gap-1">
        <div
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap",
            i === activeIndex
              ? "bg-[#0F172A] text-white"
              : "bg-atmo-2 text-atmo-9 border border-atmo-3",
          )}
        >
          {m}
          {i === activeIndex && (
            <span className="rounded-full bg-[#DEEDE2] px-1.5 py-0.5 text-[10px] font-bold text-[#146C2E]">
              ACTIVE
            </span>
          )}
        </div>
        {i < MILESTONES.length - 1 && <ChevronRight className="h-3.5 w-3.5 text-atmo-7" />}
      </div>
    ))}
  </div>
);

export default MilestoneStepper;
