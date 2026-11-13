import { useState, useMemo, useEffect, useRef } from "react";
import { FileRow, RecordType, RECORD_COLUMNS, FieldStatus, PhaseData } from "./types";
import SeasonalRatingsPanel from "./SeasonalRatingsPanel";
// Sticky column widths (px)
const STICKY_BUS_W = 80;
const STICKY_NAME_W = 140;
// BRANCH sticky layout: chevron + From Bus + To Bus + CKT
const EXPANDER_W = 36;
const BRANCH_STICKY: Record<string, { left: number; width: number; last?: boolean }> = {
  __expander: { left: 0, width: EXPANDER_W },
  fromBus: { left: EXPANDER_W, width: 90 },
  toBus: { left: EXPANDER_W + 90, width: 90 },
  circuit: { left: EXPANDER_W + 180, width: 64, last: true },
};
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronLeft, ChevronRight, ChevronDown, XCircle, AlertTriangle, PanelRightOpen, PanelRightClose } from "lucide-react";

interface FileInspectorProps {
  phases: Record<string, PhaseData>;
  activeRecordType: RecordType;
  onRecordTypeChange: (type: RecordType) => void;
  activePhase: string;
  onPhaseChange: (phase: string) => void;
  hoveredRowId: string | null;
  hoveredCellKey: string | null;
  selectedRowId: string | null;
  onSelectRow: (rowId: string | null) => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  showIssuePanel: boolean;
  hideIssuePanelToggle?: boolean;
  /** strips all error/warning styling + badges (dataset not in Review Needed) */
  suppressIssues?: boolean;
  onToggleIssuePanel: () => void;
}

const PAGE_SIZE = 20;

const statusConfig: Record<FieldStatus, { label: string; className: string }> = {
  valid: { label: "Valid", className: "bg-success/10 text-success border-success/20" },
  // NEXT Semantic/*_20 fill + border + text pairs (≥4.5:1 text contrast).
  warning: { label: "Warning", className: "bg-[#FCF2D9] text-[#6D4D09] border-[#FFBE2E]" },
  error: { label: "Error", className: "bg-[#FBE5E8] text-[#A51C2A] border-[#C82333]" },
};

const getRowStatus = (row: FileRow): FieldStatus => {
  const statuses = Object.values(row.cellStatuses);
  if (statuses.some((s) => s.status === "error")) return "error";
  if (statuses.some((s) => s.status === "warning")) return "warning";
  return "valid";
};

const getRowStatusMessage = (row: FileRow): string => {
  const issues = Object.entries(row.cellStatuses).filter(([, cs]) => cs.status !== "valid");
  if (issues.length === 0) return "All fields valid";
  return issues.map(([, cs]) => cs.message).join("; ");
};

const RECORD_TYPES: RecordType[] = ["BUS", "GENERATOR", "BRANCH", "TRANSFORMER"];

const FileInspector = ({
  phases: rawPhases,
  activeRecordType,
  onRecordTypeChange,
  activePhase,
  onPhaseChange,
  hoveredRowId,
  hoveredCellKey,
  selectedRowId,
  onSelectRow,
  isFullscreen,
  onToggleFullscreen,
  showIssuePanel,
  hideIssuePanelToggle = false,
  suppressIssues = false,
  onToggleIssuePanel,
}: FileInspectorProps) => {
  // When the dataset is not in "Review Needed", every cell renders as valid —
  // no tints, left bars, badges or per-tab issue counts.
  const phases = useMemo(() => {
    if (!suppressIssues) return rawPhases;
    const clean: typeof rawPhases = {};
    Object.entries(rawPhases).forEach(([name, data]) => {
      clean[name] = {
        ...data,
        rows: data.rows.map((r) => ({
          ...r,
          cellStatuses: Object.fromEntries(
            Object.entries(r.cellStatuses).map(([k, cs]) => [k, { ...cs, status: "valid" as const }]),
          ),
        })),
      };
    });
    return clean;
  }, [rawPhases, suppressIssues]);

  const [page, setPage] = useState(0);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const tableRef = useRef<HTMLDivElement>(null);

  const columns = RECORD_COLUMNS[activeRecordType];
  const isBranch = activeRecordType === "BRANCH";
  const colCount = columns.length + (isBranch ? 1 : 0);

  const toggleExpanded = (id: string) =>
    setExpandedRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });


  const phaseNames = useMemo(() => Object.keys(phases), [phases]);
  const ALL_PHASES = "__all__";

  // Collect all rows of this record type, grouped by phase
  const rowsByPhase = useMemo(() => {
    const result: { phase: string; rows: FileRow[] }[] = [];
    Object.entries(phases).forEach(([phaseName, phaseData]) => {
      if (activePhase !== ALL_PHASES && phaseName !== activePhase) return;
      const matching = phaseData.rows.filter((r) => r.recordType === activeRecordType);
      if (matching.length > 0) {
        result.push({ phase: phaseName, rows: matching });
      }
    });
    return result;
  }, [phases, activeRecordType, activePhase]);

  // Flatten for filtering/search
  const allRows = useMemo(() => rowsByPhase.flatMap((g) => g.rows), [rowsByPhase]);

  // Reset page on type change
  useEffect(() => { setPage(0); }, [activeRecordType]);

  // Reset expansion when switching record type or phase
  useEffect(() => { setExpandedRows(new Set()); }, [activeRecordType, activePhase]);


  // Scroll to selected row
  useEffect(() => {
    if (selectedRowId && tableRef.current) {
      const el = tableRef.current.querySelector(`[data-row-id="${selectedRowId}"]`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [selectedRowId]);

  const filtered = allRows;

  // Re-group filtered rows by phase for rendering
  const filteredByPhase = useMemo(() => {
    const phaseOrder = Object.keys(phases);
    const map = new Map<string, FileRow[]>();
    filtered.forEach((row) => {
      const phase = row.phase || "Unknown";
      if (!map.has(phase)) map.set(phase, []);
      map.get(phase)!.push(row);
    });
    // Sort by original phase order
    return phaseOrder
      .filter((p) => map.has(p))
      .map((p) => ({ phase: p, rows: map.get(p)! }));
  }, [filtered, phases]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);

  // Paginate the flat filtered list then re-group
  const pagedRows = filtered.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);
  const pagedByPhase = useMemo(() => {
    const phaseOrder = Object.keys(phases);
    const map = new Map<string, FileRow[]>();
    pagedRows.forEach((row) => {
      const phase = row.phase || "Unknown";
      if (!map.has(phase)) map.set(phase, []);
      map.get(phase)!.push(row);
    });
    return phaseOrder
      .filter((p) => map.has(p))
      .map((p) => ({ phase: p, rows: map.get(p)! }));
  }, [pagedRows, phases]);

  // Count issues per record type for badges
  const recordTypeCounts = useMemo(() => {
    const counts: Record<RecordType, { errors: number; warnings: number }> = {
      BUS: { errors: 0, warnings: 0 },
      GENERATOR: { errors: 0, warnings: 0 },
      BRANCH: { errors: 0, warnings: 0 },
      TRANSFORMER: { errors: 0, warnings: 0 },
    };
    Object.values(phases).forEach((phaseData) => {
      phaseData.rows.forEach((row) => {
        Object.values(row.cellStatuses).forEach((cs) => {
          if (cs.status === "error") counts[row.recordType].errors++;
          else if (cs.status === "warning") counts[row.recordType].warnings++;
        });
      });
    });
    return counts;
  }, [phases]);

  const getCellHighlight = (row: FileRow, colKey: string) => {
    const cs = row.cellStatuses[colKey];
    const isHovered = hoveredRowId === row.id && (!hoveredCellKey || hoveredCellKey === colKey);
    const isSelected = selectedRowId === row.id;

    // Flagged cells: NEXT Semantic negative_20 / warning_20 tint, slightly deeper on hover/selection.
    if (cs && cs.status === "error") {
      if (isSelected || isHovered) return "!bg-[#F7D3D8]";
      return "!bg-[#FBE5E8]";
    }
    if (cs && cs.status === "warning") {
      if (isSelected || isHovered) return "!bg-[#F9E7BC]";
      return "!bg-[#FCF2D9]";
    }

    if (isHovered || isSelected) {
      const rowStatuses = Object.values(row.cellStatuses);
      const hasError = rowStatuses.some((s) => s.status === "error");
      const hasWarning = rowStatuses.some((s) => s.status === "warning");
      if (hasError) return "!bg-[hsl(0,86%,97%)]";
      if (hasWarning) return "!bg-[hsl(48,100%,96%)]";
    }

    return "";
  };

  const getSelectedBorder = (row: FileRow) => {
    if (selectedRowId !== row.id) return "";
    const status = getRowStatus(row);
    if (status === "error") return "border-l-[3px] border-l-destructive";
    if (status === "warning") return "border-l-[3px] border-l-warning";
    return "border-l-[3px] border-l-primary";
  };

  const handleRowClick = (row: FileRow) => {
    onSelectRow(selectedRowId === row.id ? null : row.id);
  };

  let globalRowIdx = 0;

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex flex-col h-full">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 px-4 py-2 border-b bg-card">
          <div className="flex items-center gap-3 min-w-0">
            <h2 className="text-sm font-semibold shrink-0">File Inspector</h2>

            {/* Equipment Toggle Group */}
            <ToggleGroup
              type="single"
              value={activeRecordType}
              onValueChange={(v) => v && onRecordTypeChange(v as RecordType)}
              variant="outline"
              size="sm"
              className="gap-0"
            >
              {RECORD_TYPES.map((rt) => {
                const { errors } = recordTypeCounts[rt];
                const label = rt.charAt(0) + rt.slice(1).toLowerCase();
                return (
                  <ToggleGroupItem
                    key={rt}
                    value={rt}
                    aria-label={label}
                    className="text-[11px] h-7 px-2.5 gap-1.5 rounded-none first:rounded-l-md last:rounded-r-md -ml-px first:ml-0"
                  >
                    {label}
                    {errors > 0 && (
                      <Badge variant="destructive" className="text-[9px] h-4 px-1.5">
                        {errors}
                      </Badge>
                    )}
                  </ToggleGroupItem>
                );
              })}
            </ToggleGroup>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {!hideIssuePanelToggle && (
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleIssuePanel}
              className="h-7 gap-1.5 text-xs rounded-full"
            >
              {showIssuePanel ? (
                <>
                  <PanelRightClose className="h-3.5 w-3.5" />
                  Hide Issues
                </>
              ) : (
                <>
                  <PanelRightOpen className="h-3.5 w-3.5" />
                  Show Issues
                </>
              )}
            </Button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto" ref={tableRef}>
          <Table className="table-auto min-w-max">
            <TableHeader>
              <TableRow className="border-b border-[hsl(var(--table-border))] bg-muted/50 hover:bg-muted/50 sticky top-0 z-10">
                {isBranch && (
                  <TableHead
                    className="sticky z-[11] bg-muted/50 px-0"
                    style={{ left: 0, width: EXPANDER_W, minWidth: EXPANDER_W }}
                  />
                )}
                {columns.map((col) => {
                  const branchSticky = isBranch ? BRANCH_STICKY[col.key] : undefined;
                  const isStickyBus = col.key === "bus";
                  const isStickyName = col.key === "name";
                  const stickyClass = branchSticky
                    ? `sticky z-[11] bg-muted/50 ${branchSticky.last ? "border-r border-[hsl(var(--table-border))] shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]" : ""}`
                    : isStickyBus
                    ? `sticky z-[11] bg-muted/50`
                    : isStickyName
                    ? `sticky z-[11] bg-muted/50 border-r border-[hsl(var(--table-border))] shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]`
                    : "";
                  const stickyStyle = branchSticky
                    ? { left: branchSticky.left, width: branchSticky.width, minWidth: branchSticky.width }
                    : isStickyBus
                    ? { left: 0, width: STICKY_BUS_W, minWidth: STICKY_BUS_W }
                    : isStickyName
                    ? { left: STICKY_BUS_W, width: STICKY_NAME_W, minWidth: STICKY_NAME_W }
                    : {};
                  return (
                    <TableHead
                      key={col.key}
                      className={`text-[11px] font-medium text-[hsl(var(--table-text))] px-3 py-2 ${col.numeric ? "text-right" : "text-left"} ${stickyClass}`}
                      style={stickyStyle}
                    >
                      {col.label}
                    </TableHead>
                  );
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagedByPhase.length === 0 && (
                <TableRow>
                  <TableCell colSpan={colCount} className="text-center py-8 text-xs text-muted-foreground">

                    No {activeRecordType.toLowerCase()} records found.
                  </TableCell>
                </TableRow>
              )}
              {pagedByPhase.map((group) => (
                <>
                  {/* Phase sub-header */}
                  <TableRow key={`phase-${group.phase}`} className="bg-muted/70 hover:bg-muted/70 border-b border-[hsl(var(--table-border))] sticky top-[33px] z-[5]">
                    <TableCell className="px-3 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider sticky left-0 z-[6] bg-muted/70" colSpan={colCount}>
                      {group.phase}
                      <span className="ml-2 font-normal normal-case tracking-normal">
                        ({group.rows.length} {group.rows.length === 1 ? "record" : "records"})
                      </span>
                      {phases[group.phase]?.metadata?.effectiveDate && (
                        <span className="ml-2 font-normal normal-case tracking-normal">
                          · Eff. {phases[group.phase].metadata.effectiveDate}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                  {group.rows.map((row) => {
                    const rowStatus = getRowStatus(row);
                    const idx = globalRowIdx++;
                    const rowBg = idx % 2 === 0 ? "bg-white" : "bg-zebra";
                    const isExpanded = expandedRows.has(row.id);
                    return (
                      <>
                      <TableRow
                        key={row.id}
                        data-row-id={row.id}
                        className={`border-b border-[hsl(var(--table-border))] transition-colors duration-150 cursor-pointer ${rowBg} ${getSelectedBorder(row)} ${selectedRowId === row.id ? "ring-1 ring-primary/20" : ""}`}
                        onClick={() => handleRowClick(row)}
                      >
                        {isBranch && (
                          <TableCell
                            className={`p-0 sticky z-[2] ${rowBg} ${getCellHighlight(row, "__expander")}`}
                            style={{ left: 0, width: EXPANDER_W, minWidth: EXPANDER_W }}
                          >
                            <button
                              type="button"
                              aria-label={isExpanded ? "Collapse seasonal ratings" : "Expand seasonal ratings"}
                              aria-expanded={isExpanded}
                              className="flex h-full w-full items-center justify-center py-2 text-muted-foreground hover:text-foreground"
                              onClick={(e) => { e.stopPropagation(); toggleExpanded(row.id); }}
                            >
                              {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                            </button>
                          </TableCell>
                        )}
                        {columns.map((col) => {

                          const cs = row.cellStatuses[col.key];
                          const hasIssue = cs && cs.status !== "valid";
                          const branchSticky = isBranch ? BRANCH_STICKY[col.key] : undefined;
                          const isStickyBus = col.key === "bus";
                          const isStickyName = col.key === "name";
                          const stickyClass = branchSticky
                            ? `sticky z-[2] ${rowBg} ${branchSticky.last ? "border-r border-[hsl(var(--table-border))] shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]" : ""}`
                            : isStickyBus
                            ? `sticky z-[2] ${rowBg}`
                            : isStickyName
                            ? `sticky z-[2] ${rowBg} border-r border-[hsl(var(--table-border))] shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]`
                            : "";
                          const stickyStyle = branchSticky
                            ? { left: branchSticky.left, width: branchSticky.width, minWidth: branchSticky.width }
                            : isStickyBus
                            ? { left: 0, width: STICKY_BUS_W, minWidth: STICKY_BUS_W }
                            : isStickyName
                            ? { left: STICKY_BUS_W, width: STICKY_NAME_W, minWidth: STICKY_NAME_W }
                            : {};


                          const isStatusPill = isBranch && col.key === "status";
                          const rawValue = row.data[col.key];
                          const cellContent = (
                            <span className="flex items-center gap-1.5 overflow-hidden" style={{ justifyContent: col.numeric ? "flex-end" : "flex-start" }}>
                              {isStickyBus && rowStatus !== "valid" && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="inline-flex shrink-0 cursor-help">
                                      {rowStatus === "error" ? (
                                        <XCircle className="h-4 w-4 text-[#C82333]" strokeWidth={2.25} aria-label="Has required fixes" />
                                      ) : (
                                        <AlertTriangle className="h-4 w-4 text-[#B7791F]" strokeWidth={2.25} aria-label="Has optional fixes" />
                                      )}
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent side="right" className="max-w-xs text-xs">
                                    {getRowStatusMessage(row)}
                                  </TooltipContent>
                                </Tooltip>
                              )}
                              {isStatusPill ? (
                                <span
                                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium whitespace-nowrap ${
                                    rawValue === "0"
                                      ? "bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1]"
                                      : "bg-[#DEEDE2] text-[#146C2E] border border-[#146C2E]/20"
                                  }`}
                                >
                                  {rawValue === "0" ? "Out-of-Service [0]" : "In-Service [1]"}
                                </span>
                              ) : (
                                <span className={`truncate ${hasIssue ? "font-semibold text-[#222222]" : ""}`}>{rawValue || "—"}</span>
                              )}
                              {hasIssue && (
                                <span
                                  className={`ml-1 inline-flex h-5 shrink-0 items-center gap-1 rounded-full border px-2 font-sans text-[11px] font-semibold leading-none ${statusConfig[cs.status].className}`}
                                >
                                  {cs.status === "error" ? (
                                    <XCircle className="h-3 w-3" strokeWidth={2.5} aria-hidden />
                                  ) : (
                                    <AlertTriangle className="h-3 w-3" strokeWidth={2.5} aria-hidden />
                                  )}
                                  {statusConfig[cs.status].label}
                                </span>
                              )}
                            </span>
                          );


                          return (
                            <TableCell
                              key={col.key}
                              className={`px-3 py-2 text-xs text-[hsl(var(--table-text))] transition-colors duration-150 ${col.numeric ? "text-right font-mono" : ""} ${getCellHighlight(row, col.key)} ${stickyClass}`}
                              style={stickyStyle}
                            >
                              {hasIssue ? (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="cursor-help">{cellContent}</span>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="max-w-xs text-xs">
                                    {cs.message}
                                  </TooltipContent>
                                </Tooltip>
                              ) : (
                                cellContent
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                      {isBranch && (
                        <TableRow key={`${row.id}-ratings`} className="hover:bg-transparent border-0">
                          <TableCell colSpan={colCount} className="p-0 border-0">
                            <div
                              className="grid transition-[grid-template-rows] duration-200 ease-out"
                              style={{ gridTemplateRows: isExpanded ? "1fr" : "0fr" }}
                            >
                              <div className="overflow-hidden">
                                <SeasonalRatingsPanel ratings={row.seasonalRatings ?? []} />
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                      </>
                    );
                  })}

                </>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-2 border-t bg-card text-xs text-muted-foreground">
          <span>{filtered.length} rows</span>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-6 w-6" disabled={safePage === 0} onClick={() => setPage(safePage - 1)}>
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <span className="px-2">{safePage + 1} / {totalPages}</span>
            <Button variant="ghost" size="icon" className="h-6 w-6" disabled={safePage >= totalPages - 1} onClick={() => setPage(safePage + 1)}>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default FileInspector;
