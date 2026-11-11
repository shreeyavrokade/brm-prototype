import { useEffect, useMemo, useState } from "react";
import { MoreVertical, Check, X, Plus, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TABLE_SHELL,
  HEADER_ROW,
  HEADER_CELL,
  BODY_CELL,
  zebraRow,
} from "@/components/topology/tableBase";
import RowStatusPill from "./RowStatusPill";
import SppCellDot, { type SppChange } from "./SppCellDot";
import {
  getRowStatus,
  setRowStatus,
  useRowStatuses,
} from "@/store/rowReviewStore";
import type { ColumnDef, DatasetConfig } from "./genDatasets";

interface Props {
  dataset: DatasetConfig;
  onActivity: (rowLabel: string) => void;
  onErrorsChange?: (hasErrors: boolean) => void;
  onVerified?: () => void;
}

const alignClass = (c: ColumnDef) =>
  c.align === "right" ? "text-right tabular-nums" : c.align === "center" ? "text-center" : "";

const validateCell = (col: ColumnDef, val: any): string | null => {
  if (col.required && (val === "" || val === null || val === undefined)) {
    return "Value cannot be null";
  }
  if ((col.type === "percent" || col.type === "number" || col.type === "currency") && val !== "" && val != null) {
    const n = parseFloat(String(val));
    if (Number.isNaN(n)) return "Invalid number";
    if (col.max != null && n > col.max) return `Cannot exceed ${col.max}`;
  }
  if (col.type === "text" && col.max != null && val != null && String(val).length > col.max) {
    return `Max ${col.max} characters`;
  }
  if (col.type === "date" && val) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(val))) return "Use YYYY-MM-DD";
  }
  return null;
};

const displayValue = (col: ColumnDef, v: any) =>
  col.type === "currency" && v !== "" && v != null
    ? `$${v}`
    : col.type === "percent" && v !== "" && v != null
    ? `${v}%`
    : v ?? "";

const sppChangesOf = (row: Record<string, any>): Record<string, SppChange> =>
  (row._spp as Record<string, SppChange>) ?? {};

const INPUT_BASE =
  "h-7 w-full rounded-md px-2 text-[13px] font-semibold text-foreground tabular-nums " +
  "focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0";

const DatasetGrid = ({ dataset, onActivity, onErrorsChange, onVerified }: Props) => {
  const [rows, setRows] = useState(dataset.rows);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const statuses = useRowStatuses(dataset.id);

  useEffect(() => {
    setRows(dataset.rows);
    setEditingId(null);
    setDraft({});
    setErrors({});
  }, [dataset]);

  const editableCols = useMemo(
    () => dataset.columns.filter((c) => c.editable && !dataset.viewOnly),
    [dataset],
  );
  const editableKeys = useMemo(
    () => new Set(editableCols.map((c) => c.key)),
    [editableCols],
  );

  const canReview = !dataset.viewOnly;
  const showActions = canReview || !dataset.hideActions;

  const openRow = (rowId: string) => {
    const row = rows.find((r) => r.id === rowId);
    if (!row) return;
    const d: Record<string, any> = {};
    editableCols.forEach((c) => (d[c.key] = row[c.key] ?? ""));
    setDraft(d);
    setErrors({});
    setEditingId(rowId);
  };

  const closeRow = () => {
    setEditingId(null);
    setDraft({});
    setErrors({});
    onErrorsChange?.(false);
  };

  const editingRow = rows.find((r) => r.id === editingId);

  /** Baseline for the WAS line: the SPP previous value when present. */
  const baselineFor = (row: Record<string, any>, key: string) => {
    const change = sppChangesOf(row)[key];
    return change ? change.previous : row[key];
  };

  const isDirty = useMemo(() => {
    if (!editingRow) return false;
    return editableCols.some(
      (c) => String(draft[c.key] ?? "") !== String(editingRow[c.key] ?? ""),
    );
  }, [draft, editingRow, editableCols]);

  const accept = () => {
    if (!editingId) return;
    setRowStatus(dataset.id, editingId, "Accepted");
    closeRow();
    onVerified?.();
  };

  const saveChanges = () => {
    if (!editingId) return;
    const errs: Record<string, string> = {};
    editableCols.forEach((c) => {
      const msg = validateCell(c, draft[c.key]);
      if (msg) errs[c.key] = msg;
    });
    if (Object.keys(errs).length) {
      setErrors(errs);
      onErrorsChange?.(true);
      return;
    }
    setRows((rs) => rs.map((r) => (r.id === editingId ? { ...r, ...draft } : r)));
    setRowStatus(dataset.id, editingId, "Pending SPP Review");
    closeRow();
    onVerified?.();
  };

  const addRow = () => {
    const id = `new-${Date.now()}`;
    const base = { id, ...(dataset.newRowDefaults ?? {}) };
    setRows((rs) => [...rs, base]);
    const d: Record<string, any> = {};
    editableCols.forEach((c) => (d[c.key] = (base as any)[c.key] ?? ""));
    setDraft(d);
    setErrors({});
    setEditingId(id);
  };

  const deleteRow = (rowId: string) => {
    setRows((rs) => rs.filter((r) => r.id !== rowId));
    if (editingId === rowId) closeRow();
  };

  return (
    <div className="space-y-2">
      {dataset.crud && !dataset.viewOnly && (
        <div className="flex justify-end">
          <Button
            size="sm"
            variant="outline"
            onClick={addRow}
            disabled={!!editingId}
            className="h-8 text-xs"
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Add {dataset.name} Record
          </Button>
        </div>
      )}
      <div className={cn(TABLE_SHELL, "overflow-x-auto")}>
        <Table>
          <TableHeader>
            <TableRow className={HEADER_ROW}>
              {canReview && (
                <TableHead className={cn(HEADER_CELL, "whitespace-nowrap")}>
                  Status
                </TableHead>
              )}
              {dataset.columns.map((c) => (
                <TableHead key={c.key} className={cn(HEADER_CELL, alignClass(c), "whitespace-nowrap")}>
                  {c.label}
                </TableHead>
              ))}
              {showActions && (
                <TableHead className={cn(HEADER_CELL, "text-center whitespace-nowrap")}>
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, idx) => {
              const isEditing = editingId === row.id;
              const status = getRowStatus(statuses, row.id);
              const changes = sppChangesOf(row);
              const showDots = canReview && status === "Review Needed";
              return (
                <TableRow
                  key={row.id}
                  className={cn(
                    zebraRow(idx),
                    isEditing && "bg-blue-50/50 hover:bg-blue-50/50",
                  )}
                >
                  {canReview && (
                    <TableCell className={cn(BODY_CELL, "whitespace-nowrap align-top")}>
                      <RowStatusPill status={status} />
                    </TableCell>
                  )}
                  {dataset.columns.map((c) => {
                    const inlineEdit = isEditing && editableKeys.has(c.key);
                    if (!inlineEdit) {
                      return (
                        <TableCell
                          key={c.key}
                          className={cn(BODY_CELL, alignClass(c), "whitespace-nowrap align-top")}
                        >
                          <span>{displayValue(c, row[c.key])}</span>
                          {showDots && changes[c.key] && (
                            <SppCellDot change={changes[c.key]} />
                          )}
                        </TableCell>
                      );
                    }
                    const was = baselineFor(row, c.key);
                    const changed = String(draft[c.key] ?? "") !== String(row[c.key] ?? "");
                    const err = errors[c.key];
                    return (
                      <TableCell
                        key={c.key}
                        className={cn(BODY_CELL, "align-top min-w-[110px] py-1.5")}
                      >
                        <div className="text-[11px] text-atmo-9 mb-1 whitespace-nowrap">
                          WAS:{" "}
                          <span className="font-mono">{String(was ?? "") || "—"}</span>
                          {changes[c.key] && (
                            <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-[#C82333] align-middle" />
                          )}
                        </div>
                        {c.type === "select" ? (
                          <Select
                            value={draft[c.key] ?? ""}
                            onValueChange={(v) => setDraft((d) => ({ ...d, [c.key]: v }))}
                          >
                            <SelectTrigger
                              className={cn(
                                INPUT_BASE,
                                changed ? "border-amber-500" : "border-neutral-300",
                                err && "border-red-500",
                              )}
                            >
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              {c.options?.map((o) => (
                                <SelectItem key={o || "_blank"} value={o}>
                                  {o || "—"}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            type={c.type === "date" ? "date" : "text"}
                            value={draft[c.key] ?? ""}
                            onChange={(e) =>
                              setDraft((d) => ({ ...d, [c.key]: e.target.value }))
                            }
                            className={cn(
                              INPUT_BASE,
                              changed ? "border-amber-500" : "border-neutral-300",
                              err && "border-red-500",
                            )}
                          />
                        )}
                        {err && (
                          <div className="text-[10px] text-red-600 mt-0.5">{err}</div>
                        )}
                      </TableCell>
                    );
                  })}
                  {showActions && (
                    <TableCell
                      className={cn(BODY_CELL, "text-center align-top whitespace-nowrap")}
                    >
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            className="h-7 px-2 text-xs bg-[#146C2E] hover:bg-[#105323] text-white"
                            onClick={accept}
                          >
                            <Check className="h-3.5 w-3.5 mr-1" /> Accept
                          </Button>
                          {isDirty && (
                            <Button
                              size="sm"
                              className="h-7 px-2 text-xs bg-foreground text-background hover:bg-foreground/90"
                              onClick={saveChanges}
                            >
                              Save Changes
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 text-xs"
                            onClick={closeRow}
                          >
                            <X className="h-3.5 w-3.5 mr-1" /> Cancel
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1">
                          {canReview && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2 text-xs"
                              disabled={!!editingId}
                              onClick={() => openRow(row.id)}
                            >
                              <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                            </Button>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-1 hover:bg-atmo-2 rounded">
                                <MoreVertical className="h-4 w-4 text-atmo-9" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  onActivity(
                                    (row.unitName as string) ??
                                      (row.demandGroup as string) ??
                                      (row.id as string),
                                  )
                                }
                              >
                                View Activity
                              </DropdownMenuItem>
                              {dataset.crud && !dataset.viewOnly && (
                                <DropdownMenuItem
                                  className="text-red-600 focus:text-red-700"
                                  onClick={() => deleteRow(row.id)}
                                >
                                  Delete Row
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DatasetGrid;
