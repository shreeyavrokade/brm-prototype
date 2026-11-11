import { useMemo, useState } from "react";
import { ArrowLeft, Check, Download, Pencil, Search, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { TABLE_SHELL, HEADER_ROW, HEADER_CELL, BODY_CELL, zebraRow } from "@/components/topology/tableBase";
import { FORECAST_ROWS, FORECAST_YEARS, sppChangeFor } from "./mockForecast";
import RowStatusPill from "./RowStatusPill";
import SppCellDot from "./SppCellDot";
import { getRowStatus, setRowStatus, useRowStatuses } from "@/store/rowReviewStore";

interface Props {
  stepTitle: string;
  onBack: () => void;
}

const DATASET_ID = "annual-load-factor-forecast";

const INPUT_BASE =
  "h-7 w-full rounded-md px-2 text-[13px] font-semibold text-foreground tabular-nums " +
  "focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0";

const ForecastGrid = ({ stepTitle, onBack }: Props) => {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [data, setData] = useState(FORECAST_ROWS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<string[]>([]);
  const statuses = useRowStatuses(DATASET_ID);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter(
      (r) =>
        r.demandGroup.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.parentArea.toLowerCase().includes(q),
    );
  }, [query, data]);

  const allChecked = rows.length > 0 && rows.every((r) => selected[r.id]);
  const toggleAll = () => {
    if (allChecked) {
      const next = { ...selected };
      rows.forEach((r) => delete next[r.id]);
      setSelected(next);
    } else {
      const next = { ...selected };
      rows.forEach((r) => (next[r.id] = true));
      setSelected(next);
    }
  };

  const editingRow = data.find((r) => r.id === editingId);

  const openRow = (id: string) => {
    const row = data.find((r) => r.id === id);
    if (!row) return;
    setDraft(row.values.map((v) => v.toFixed(2)));
    setEditingId(id);
  };
  const closeRow = () => {
    setEditingId(null);
    setDraft([]);
  };

  const isDirty = !!editingRow && editingRow.values.some((v, i) => v.toFixed(2) !== draft[i]);

  const accept = () => {
    if (!editingId) return;
    setRowStatus(DATASET_ID, editingId, "Accepted");
    closeRow();
  };
  const saveChanges = () => {
    if (!editingId) return;
    setData((rs) =>
      rs.map((r) =>
        r.id === editingId
          ? { ...r, values: draft.map((d) => (Number.isNaN(parseFloat(d)) ? 0 : parseFloat(d))) }
          : r,
      ),
    );
    setRowStatus(DATASET_ID, editingId, "Pending SPP Review");
    closeRow();
  };

  return (
    <div className="flex flex-col gap-4 pb-20">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm text-atmo-9 hover:text-foreground self-start"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Guided Checklist
      </button>

      <div>
        <h2 className="text-xl font-semibold text-foreground">{stepTitle}</h2>
      </div>

      <div className="bg-atmo-2 border border-atmo-3 rounded-md p-3 text-sm text-atmo-10">
        Tip: Review the Annual Load Factor basecase data below. Cells flagged with a red dot were
        modified by SPP in the prior pass — click Edit on a row to accept those values or revise them.
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="relative w-80">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-atmo-7" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by ID or Project Name..."
            className="pl-8 h-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button size="sm" className="gap-1.5 bg-primary-200 hover:bg-primary-180 text-white">
            <Upload className="h-4 w-4" /> Import to Bulk Revise
          </Button>
        </div>
      </div>

      <div className={cn(TABLE_SHELL, "overflow-x-auto")}>
        <Table>
          <TableHeader>
            <TableRow className={HEADER_ROW}>
              <TableHead className={cn(HEADER_CELL, "w-10 text-center")}>
                <Checkbox checked={allChecked} onCheckedChange={toggleAll} />
              </TableHead>
              <TableHead className={cn(HEADER_CELL, "whitespace-nowrap")}>Status</TableHead>
              <TableHead className={HEADER_CELL}>Submittal Year</TableHead>
              <TableHead className={HEADER_CELL}>Demand Group Name</TableHead>
              <TableHead className={HEADER_CELL}>Parent Area</TableHead>
              <TableHead className={HEADER_CELL}>Zone</TableHead>
              {FORECAST_YEARS.map((y) => (
                <TableHead key={y} className={cn(HEADER_CELL, "text-center")}>
                  {y}
                </TableHead>
              ))}
              <TableHead className={cn(HEADER_CELL, "text-center whitespace-nowrap")}>
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, idx) => {
              const status = getRowStatus(statuses, row.id);
              const isEditing = editingId === row.id;
              const showDots = status === "Review Needed";
              return (
                <TableRow
                  key={row.id}
                  className={cn(zebraRow(idx), isEditing && "bg-blue-50/50 hover:bg-blue-50/50")}
                >
                  <TableCell className={cn(BODY_CELL, "text-center align-top")}>
                    <Checkbox
                      checked={!!selected[row.id]}
                      onCheckedChange={(v) => setSelected((s) => ({ ...s, [row.id]: !!v }))}
                    />
                  </TableCell>
                  <TableCell className={cn(BODY_CELL, "whitespace-nowrap align-top")}>
                    <RowStatusPill status={status} />
                  </TableCell>
                  <TableCell className={cn(BODY_CELL, "tabular-nums align-top")}>
                    {row.submittalYear}
                  </TableCell>
                  <TableCell className={cn(BODY_CELL, "font-mono align-top")}>
                    {row.demandGroup}
                  </TableCell>
                  <TableCell className={cn(BODY_CELL, "align-top")}>{row.parentArea}</TableCell>
                  <TableCell className={cn(BODY_CELL, "align-top")}>{row.zone}</TableCell>
                  {row.values.map((v, i) => {
                    const change = sppChangeFor(row, i);
                    if (!isEditing) {
                      return (
                        <TableCell
                          key={i}
                          className={cn(
                            BODY_CELL,
                            "text-center font-semibold tabular-nums whitespace-nowrap align-top",
                          )}
                        >
                          {v.toFixed(2)}%
                          {showDots && change && <SppCellDot change={change} />}
                        </TableCell>
                      );
                    }
                    const was = change ? String(change.previous) : `${v.toFixed(2)}%`;
                    const changed = draft[i] !== v.toFixed(2);
                    return (
                      <TableCell key={i} className={cn(BODY_CELL, "align-top min-w-[92px] py-1.5")}>
                        <div className="text-[11px] text-atmo-9 mb-1 whitespace-nowrap">
                          WAS: <span className="font-mono">{was}</span>
                          {change && (
                            <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-[#C82333] align-middle" />
                          )}
                        </div>
                        <Input
                          value={draft[i] ?? ""}
                          onChange={(e) =>
                            setDraft((d) => d.map((x, j) => (j === i ? e.target.value : x)))
                          }
                          className={cn(
                            INPUT_BASE,
                            changed ? "border-amber-500" : "border-neutral-300",
                          )}
                        />
                      </TableCell>
                    );
                  })}
                  <TableCell className={cn(BODY_CELL, "text-center align-top whitespace-nowrap")}>
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
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-atmo-3 bg-atmo-0 py-3 px-6 flex items-center justify-between z-20">
        <Button variant="ghost" onClick={onBack}>
          Cancel
        </Button>
        <Button className="bg-primary-200 hover:bg-primary-180 text-white">Next →</Button>
      </div>
    </div>
  );
};

export default ForecastGrid;

