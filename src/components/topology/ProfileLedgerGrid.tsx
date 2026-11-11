import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useSubmissionIssue } from "@/components/submission/SubmissionIssueContext";
import type { ProfileInterval } from "./mockProfileSeries";

type Align = "left" | "right";
type Col = {
  key: keyof ProfileInterval | "interval";
  label: string;
  align: Align;
  mono?: boolean;
};

const COLS: Col[] = [
  { key: "timestamp", label: "INTERVAL / TIMESTAMP", align: "right", mono: true },
  { key: "hour", label: "HOUR", align: "right" },
  { key: "dayType", label: "DAY TYPE", align: "left" },
  { key: "assetId", label: "ASSET ID", align: "left", mono: true },
  { key: "owningEntity", label: "OWNING ENTITY", align: "left" },
  { key: "controlArea", label: "CONTROL AREA", align: "left" },
  { key: "scalingFactor", label: "SCALING FACTOR", align: "right" },
  { key: "mwTarget", label: "MW TARGET", align: "right" },
  { key: "mvarComponent", label: "MVAR COMPONENT", align: "right" },
];

const alignCls = (a: Align) => (a === "right" ? "text-right tabular-nums" : "text-left");

const fmt = (col: Col, row: ProfileInterval) => {
  const v = row[col.key as keyof ProfileInterval];
  if (col.key === "scalingFactor") return (v as number).toFixed(2);
  if (col.key === "mwTarget" || col.key === "mvarComponent") return (v as number).toFixed(1);
  return String(v);
};

const ProfileLedgerGrid = ({ rows }: { rows: ProfileInterval[] }) => {
  const { hoveredRef } = useSubmissionIssue();
  return (
    <div className="bg-atmo-0 border border-atmo-4 rounded-md overflow-hidden">
      <div className="overflow-x-auto max-h-[640px] overflow-y-auto">
        <Table>
          <TableHeader className="sticky top-0 z-10">
            <TableRow className="bg-atmo-1 hover:bg-atmo-1 border-[#E2E8F0]">
              {COLS.map((c) => (
                <TableHead
                  key={c.label}
                  className={cn(
                    "text-[11px] font-semibold text-atmo-10 border border-[#E2E8F0] whitespace-nowrap uppercase tracking-wide bg-atmo-1",
                    alignCls(c.align),
                  )}
                >
                  {c.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r, idx) => {
              const highlight = hoveredRef && hoveredRef === r.assetId;
              return (
                <TableRow
                  key={r.index}
                  data-row-ref={r.assetId}
                  className={cn(
                    "border-[#E2E8F0]",
                    idx % 2 === 1 && "bg-zebra",
                    r.sharedAsset && "!bg-[#FBF2D8]/50 border-l-2 border-l-[#B59A3A]",
                    highlight && "!bg-destructive/15 outline outline-2 outline-destructive",
                  )}
                >
                  {COLS.map((c) => (
                    <TableCell
                      key={c.label}
                      className={cn(
                        "text-sm text-atmo-10 border border-[#E2E8F0] whitespace-nowrap py-1.5",
                        alignCls(c.align),
                        c.mono && "font-mono text-[13px]",
                      )}
                    >
                      {fmt(c, r)}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProfileLedgerGrid;
