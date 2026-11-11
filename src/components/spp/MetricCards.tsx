import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDown, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const PROJECT_TYPES: [string, number][] = [
  ["Approved Upgrades", 18],
  ["Planned Upgrades", 25],
  ["GI", 9],
  ["Attachment AQ", 14],
  ["Modeling Corrections", 6],
  ["Intact", 3],
  ["Status Changes", 3],
];

const Card = ({
  label,
  value,
  sub,
  alert,
  children,
}: {
  label: string;
  value: string;
  sub?: string;
  alert?: boolean;
  children?: React.ReactNode;
}) => (
  <div
    className={cn(
      "rounded-lg border p-4 bg-atmo-0 border-atmo-3",
      alert && "bg-[#FFF1F2] border-[#FDA4AF]",
    )}
  >
    <div className="text-[11px] font-semibold uppercase tracking-wide text-atmo-9">{label}</div>
    <div
      className={cn(
        "mt-2 flex items-center gap-2 text-2xl font-semibold tabular-nums text-foreground",
        alert && "text-[#BE123C]",
      )}
    >
      {alert && <AlertTriangle className="h-5 w-5" />}
      {value}
    </div>
    {sub && <div className="mt-1 text-xs text-atmo-9">{sub}</div>}
    {children}
  </div>
);

export const MetricCards = ({ exceptions }: { exceptions: number }) => (
  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
    <Card label="Topology Submissions" value="78 .prj Files">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="mt-3 h-8 rounded-full border-atmo-5 bg-atmo-0 px-3 text-xs gap-1"
          >
            View 7 Project Types
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-64 p-3">
          <div className="mb-2 text-xs font-semibold text-foreground">Breakdown by project type</div>
          <ul className="space-y-1">
            {PROJECT_TYPES.map(([t, n]) => (
              <li key={t} className="flex justify-between text-xs text-atmo-10">
                <span>{t}</span>
                <span className="font-semibold tabular-nums">{n}</span>
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>
    </Card>

    <Card label="Profiles & Base Ratings" value="127 Datasets" sub="107 BLG Profiles | 20 Ratings CSVs" />

    <Card
      label="Validation Exceptions"
      value={`${exceptions} Files Flagged`}
      sub="Blocking model build until resolved"
      alert
    />

    <Card label="Member Participation" value="65% (65 / 100)" sub="65 Active | 35 No Submissions Yet" />
  </div>
);

export default MetricCards;
