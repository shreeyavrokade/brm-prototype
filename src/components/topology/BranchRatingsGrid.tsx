import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useSubmissionIssue } from "@/components/submission/SubmissionIssueContext";
import { buildBranchRatings, type BranchRatingRow } from "./mockRatingsSubmission";

const COLS: { key: keyof BranchRatingRow; label: string; align?: "right"; mono?: boolean }[] = [
  { key: "branchId", label: "Branch ID", mono: true },
  { key: "fromBus", label: "From Bus", mono: true },
  { key: "toBus", label: "To Bus", mono: true },
  { key: "circuit", label: "Ckt" },
  { key: "owner", label: "Owner" },
  { key: "season", label: "Season" },
  { key: "lte", label: "LTE", align: "right" },
  { key: "norm", label: "Norm", align: "right" },
  { key: "ste", label: "STE", align: "right" },
  { key: "ld", label: "LD", align: "right" },
];

const BranchRatingsGrid = ({ rows = buildBranchRatings() }: { rows?: BranchRatingRow[] }) => {
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
                    c.align === "right" ? "text-right tabular-nums" : "text-left",
                  )}
                >
                  {c.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r, idx) => {
              const highlight = hoveredRef && hoveredRef === r.branchId;
              return (
                <TableRow
                  key={r.id}
                  data-row-ref={r.branchId}
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
                        c.align === "right" ? "text-right tabular-nums" : "text-left",
                        c.mono && "font-mono text-[13px]",
                      )}
                    >
                      {String(r[c.key])}
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

export default BranchRatingsGrid;
