import { useEffect, useMemo, useRef } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useSubmissionIssue } from "@/components/submission/SubmissionIssueContext";
import IssueCell from "@/components/submission/IssueCell";
import { buildIssueMap, rowSeverity, type CellIssue, type IssueFilter } from "@/components/submission/validationIssues";
import { mockRatingsInspector, type RatingsInspectorRow } from "./mockRatingsInspector";

type Col = {
  key: keyof RatingsInspectorRow;
  label: string;
  align?: "right" | "left";
  mono?: boolean;
  bold?: boolean;
};

const COLS: Col[] = [
  { key: "ratingName", label: "RATING NAME", mono: true, bold: true },
  { key: "busI", label: "BUS (I)", mono: true },
  { key: "busJ", label: "BUS (J)", mono: true },
  { key: "busK", label: "BUS (K)", mono: true },
  { key: "ckt", label: "CKT", align: "right", mono: true },
  { key: "norm1", label: "NORM1", align: "right", mono: true },
  { key: "lte1", label: "LTE1", align: "right", mono: true },
  { key: "ste1", label: "STE1", align: "right", mono: true },
  { key: "ld1", label: "LD1", align: "right", mono: true },
  { key: "norm2", label: "NORM2", align: "right", mono: true },
  { key: "lte2", label: "LTE2", align: "right", mono: true },
  { key: "ste2", label: "STE2", align: "right", mono: true },
  { key: "ld2", label: "LD2", align: "right", mono: true },
  { key: "norm3", label: "NORM3", align: "right", mono: true },
  { key: "lte3", label: "LTE3", align: "right", mono: true },
  { key: "ste3", label: "STE3", align: "right", mono: true },
  { key: "ld3", label: "LD3", align: "right", mono: true },
  { key: "equipName", label: "EQUIPNAME", mono: true },
];

interface Props {
  rows?: RatingsInspectorRow[];
  issues?: CellIssue[];
  filter?: IssueFilter;
  focusRowId?: string | null;
  onIssueSelect?: (issue: CellIssue) => void;
  /** Corrected values keyed by rowId -> field. */
  values?: Record<string, Record<string, string>>;
  onResolve?: (issue: CellIssue, value: string) => void;
}

const RatingsInspectorGrid = ({ rows = mockRatingsInspector, issues = [], filter = "all", focusRowId = null, onIssueSelect, values = {}, onResolve }: Props) => {
  const { hoveredRef, hoveredRowId, hoveredCellKey, selectedRowId, setSelectedRowId } = useSubmissionIssue();
  const issueMap = useMemo(() => buildIssueMap(issues), [issues]);
  const focusRef = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    if (focusRowId || selectedRowId) focusRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [focusRowId, selectedRowId]);

  const visible = rows.filter((r) => {
    const sev = rowSeverity(issueMap, r.id);
    if (filter === "errors") return sev === "error";
    if (filter === "warnings") return sev === "warning";
    if (filter === "valid") return sev === null;
    return true;
  });

  return (
    <div className="bg-atmo-0 border border-atmo-4 rounded-md overflow-hidden">
      <div className="px-4 py-2.5 border-b border-[#E2E8F0]">
        <h2 className="text-sm font-semibold text-foreground">File Inspector</h2>
      </div>
      <div className="overflow-x-auto max-h-[640px] overflow-y-auto">
        <Table>
          <TableHeader className="sticky top-0 z-10">
            <TableRow className="bg-atmo-1 hover:bg-atmo-1 border-[#E2E8F0]">
              {COLS.map((c) => (
                <TableHead
                  key={c.label}
                  className={cn(
                    "text-xs font-semibold text-atmo-10 border border-[#E2E8F0] bg-atmo-1 whitespace-nowrap uppercase tracking-wide",
                    c.align === "right" ? "text-right" : "text-left",
                  )}
                >
                  {c.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((r, idx) => {
              const rowRef = `${r.ratingName}-${r.busI}-${r.busJ}`;
              const highlight = hoveredRef && hoveredRef === rowRef;
              const sev = rowSeverity(issueMap, r.id);
              const focused = focusRowId === r.id || selectedRowId === r.id;
              const rowHovered = hoveredRowId === r.id;
              return (
                <TableRow
                  key={r.id}
                  ref={focused ? focusRef : undefined}
                  onClick={() => setSelectedRowId(selectedRowId === r.id ? null : r.id)}
                  data-row-ref={rowRef}
                  className={cn(
                    "border-[#E2E8F0]",
                    idx % 2 === 1 && "bg-zebra",
                    sev === "error" && "border-l-4 border-l-[#C82333] bg-[#FBE5E8]/20 hover:bg-[#FBE5E8]/40",
                    sev === "warning" && "border-l-4 border-l-[#FFBE2E] bg-[#FCF2D9]/20 hover:bg-[#FCF2D9]/40",
                    "cursor-pointer",
                    focused && "outline outline-2 outline-[#2064B4] ring-1 ring-[#2064B4]/20",
                    rowHovered && "!bg-[#E0E6F5]/60",
                    highlight && "!bg-destructive/15 outline outline-2 outline-destructive",
                  )}
                >
                  {COLS.map((c) => {
                    const v = r[c.key];
                    const cellIssue = issueMap.get(r.id)?.get(c.key as string);
                    const override = values[r.id]?.[c.key as string];
                    const text =
                      override !== undefined
                        ? override
                        : v === "" || v === null || v === undefined
                          ? ""
                          : String(v);
                    return (
                      <TableCell
                        key={c.label}
                        className={cn(
                          "text-sm text-atmo-10 border border-[#E2E8F0] whitespace-nowrap py-1.5",
                          c.align === "right" ? "text-right tabular-nums" : "text-left",
                          c.mono && "font-mono text-[13px]",
                          c.bold && "font-semibold text-foreground",
                          rowHovered && hoveredCellKey === c.key && "ring-1 ring-inset ring-[#2064B4]",
                        )}
                      >
                        {cellIssue ? (
                          <IssueCell
                            issue={cellIssue}
                            onResolve={onResolve}
                            onSelect={(i) => {
                              setSelectedRowId(i.rowId);
                              onIssueSelect?.(i);
                            }}
                          >
                            {text}
                          </IssueCell>
                        ) : (
                          text
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
            {visible.length === 0 && (
              <TableRow>
                <TableCell colSpan={COLS.length} className="text-xs text-atmo-8 text-center py-8">
                  No records match this filter.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RatingsInspectorGrid;
