import { useEffect, useMemo, useRef } from "react";
import { MoreVertical } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSubmissionIssue } from "@/components/submission/SubmissionIssueContext";
import IssueCell from "@/components/submission/IssueCell";
import { buildIssueMap, rowSeverity, type CellIssue, type IssueFilter } from "@/components/submission/validationIssues";
import type { ProfilesInspectorRow } from "./mockProfilesInspector";

type Col = {
  key: keyof ProfilesInspectorRow;
  label: string;
  align?: "right" | "left";
  bold?: boolean;
  seq?: boolean;
};

const COLS: Col[] = [
  { key: "busI", label: "BUS (I)", bold: true },
  { key: "nameI", label: "NAME (I)" },
  { key: "name", label: "NAME" },
  { key: "status", label: "STATUS" },
  { key: "area", label: "AREA", align: "right" },
  { key: "zone", label: "ZONE", align: "right" },
  { key: "pl", label: "PL", align: "right" },
  { key: "ql", label: "QL", align: "right" },
  { key: "ip", label: "IP", align: "right" },
  { key: "iq", label: "IQ", align: "right" },
  { key: "yp", label: "YP", align: "right" },
  { key: "yq", label: "YQ", align: "right" },
  { key: "owner", label: "OWNER", align: "right" },
  { key: "scale", label: "SCALE", align: "right" },
  { key: "intrpt", label: "INTRPT", align: "right" },
  { key: "dgenp", label: "DGENP", align: "right" },
  { key: "dgenq", label: "DGENQ", align: "right" },
  { key: "dgenm", label: "DGENM", align: "right" },
  { key: "loadtype", label: "LOADTYPE" },
  { key: "compId", label: "COMP_ID" },
  { key: "pneg", label: "PNEG", align: "right", seq: true },
  { key: "qneg", label: "QNEG", align: "right", seq: true },
  { key: "grdflg", label: "GRDFLG", align: "right", seq: true },
  { key: "pzero", label: "PZERO", align: "right", seq: true },
  { key: "qzero", label: "QZERO", align: "right", seq: true },
];

const filled = (v: unknown) => v !== "" && v !== null && v !== undefined;

interface Props {
  rows: ProfilesInspectorRow[];
  issues?: CellIssue[];
  filter?: IssueFilter;
  focusRowId?: string | null;
  onIssueSelect?: (issue: CellIssue) => void;
  values?: Record<string, Record<string, string>>;
  onResolve?: (issue: CellIssue, value: string) => void;
}

const ProfilesInspectorGrid = ({ rows, issues = [], filter = "all", focusRowId = null, onIssueSelect, values = {}, onResolve }: Props) => {
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
                    c.seq &&
                      "bg-[#E0E6F5] text-[#2064B4] font-mono text-xs font-bold border-b border-[#D9D9D9]",
                  )}
                >
                  {c.label}
                </TableHead>
              ))}
              <TableHead className="w-10 text-xs font-semibold text-atmo-10 border border-[#E2E8F0] bg-atmo-1 text-center">
                <span className="sr-only">Actions</span>
                <MoreVertical className="h-3.5 w-3.5 mx-auto text-atmo-8" aria-hidden />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((r, idx) => {
              const rowRef = `${r.busI}-${r.name}`;
              const highlight = hoveredRef && hoveredRef === rowRef;
              const hasSeq =
                filled(r.pneg) || filled(r.qneg) || filled(r.pzero) || filled(r.qzero);
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
                    "border-[#E2E8F0] transition-colors",
                    idx % 2 === 1 ? "bg-[#FBFCFC]" : "bg-white",
                    hasSeq && !sev && "bg-[#E0E6F5]/20 hover:bg-[#E0E6F5]/40",
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
                    const text = v === "" || v === null || v === undefined ? "" : String(v);
                    return (
                      <TableCell
                        key={c.label}
                        className={cn(
                          "text-sm text-atmo-10 border border-[#E2E8F0] whitespace-nowrap py-1.5",
                          c.align === "right" ? "text-right tabular-nums" : "text-left",
                          c.bold && "font-semibold text-foreground",
                          c.seq && "bg-[#E0E6F5]/30 text-neutral-900 font-mono text-xs",
                          rowHovered && hoveredCellKey === c.key && "ring-1 ring-inset ring-[#2064B4]",
                        )}
                      >
                        {cellIssue ? <IssueCell issue={cellIssue} onResolve={onResolve} onSelect={(i) => { setSelectedRowId(i.rowId); onIssueSelect?.(i); }}>{values[r.id]?.[c.key as string] ?? text}</IssueCell> : (values[r.id]?.[c.key as string] ?? text)}
                      </TableCell>
                    );
                  })}
                  <TableCell className="border border-[#E2E8F0] p-0 text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-atmo-8 hover:text-atmo-10"
                      aria-label={`Actions for ${r.busI} ${r.name}`}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {visible.length === 0 && (
              <TableRow>
                <TableCell colSpan={COLS.length + 1} className="text-xs text-atmo-8 text-center py-8">
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

export default ProfilesInspectorGrid;
