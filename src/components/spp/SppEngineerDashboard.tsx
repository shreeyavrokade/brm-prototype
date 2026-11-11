import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import MilestoneStepper from "./MilestoneStepper";
import MetricCards from "./MetricCards";
import IntakeQueueTable from "./IntakeQueueTable";
import BilateralTransactionsWidget from "./BilateralTransactionsWidget";
import ReportCardBar from "./ReportCardBar";
import { exceptionCount, type Footprint } from "./intakeQueue";

const FOOTPRINTS: { key: Footprint | "ALL"; label: string }[] = [
  { key: "ALL", label: "All Footprint" },
  { key: "EAST", label: "East (EDST)" },
  { key: "WEST", label: "West (Workbook)" },
];

export const SppEngineerDashboard = () => {
  const [cycle, setCycle] = useState("2028");
  const [footprint, setFootprint] = useState<Footprint | "ALL">("ALL");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-foreground">
          Base Reliability Model — Build &amp; Review
        </h1>
        <div className="flex items-center gap-3">
          <Select value={cycle} onValueChange={setCycle}>
            <SelectTrigger className="h-9 w-[140px] rounded-full border-atmo-4 bg-atmo-0 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["2026", "2027", "2028", "2029"].map((y) => (
                <SelectItem key={y} value={y}>{`Cycle: ${y}`}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-1 rounded-lg bg-[#E2E8F0] p-1">
            {FOOTPRINTS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFootprint(f.key)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  footprint === f.key
                    ? "bg-atmo-0 text-foreground shadow-sm"
                    : "text-atmo-9 hover:text-foreground",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <MilestoneStepper activeIndex={0} />

      <MetricCards exceptions={exceptionCount} />

      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="lg:w-2/3">
          <IntakeQueueTable footprint={footprint} />
        </div>
        <div className="lg:w-1/3">
          <BilateralTransactionsWidget />
        </div>
      </div>

      <ReportCardBar />
    </div>
  );
};

export default SppEngineerDashboard;
