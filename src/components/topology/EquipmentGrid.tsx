import { Fragment, useRef, useState } from "react";
import { Lock, MessageSquare, MoreVertical, MessageCircle, Pencil, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import StatusBadge from "@/components/submission/StatusBadge";
import StatusPill from "@/components/shared/statusBadge";
import ActivitySheet from "@/components/shared/ActivitySheet";
import type { ActivityItem } from "@/components/dashboard/types";
import {
  type AuditLog, type BusRow, type GeneratorRow, FUEL_TYPES,
  validateBusName, validateBusNumber, validateInteger, validateNumber, validateComments,
  busNameMaxLen, commentsMaxLen,
} from "./equipmentSchemas";
import { toast } from "sonner";
import { brand } from "@/config/brand";

const seedActivity = (audit: AuditLog, comments: string): ActivityItem[] => {
  const items: ActivityItem[] = [
    { id: "created", type: "history", user: audit.createdBy, message: "created this row", timestamp: audit.createdDate },
    { id: "modified", type: "history", user: audit.modifiedBy, message: "last modified", timestamp: audit.modifiedDate },
  ];
  if (comments && comments.trim()) {
    items.push({
      id: "note",
      type: "comment",
      user: audit.modifiedBy,
      message: comments,
      timestamp: audit.modifiedDate,
    });
  }
  return items;
};

const RowActivitySheet = ({
  open, onOpenChange, title, description, items, onAddComment,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description?: string;
  items: ActivityItem[];
  onAddComment: (message: string) => void;
}) => (
  <ActivitySheet
    open={open}
    onOpenChange={onOpenChange}
    title={title}
    description={description}
    items={items}
    onAddComment={onAddComment}
  />
);

const READONLY_BG = "bg-[#F4F6F6]";
const TH = "h-9 px-3 text-xs font-semibold uppercase tracking-wide text-atmo-10 whitespace-nowrap text-left bg-atmo-1 border border-[#E2E8F0]";
const TD = "px-3 py-2 align-middle text-sm text-atmo-10 whitespace-nowrap border border-[#E2E8F0]";
// Sticky right-edge column (Actions). Includes a left divider line for separation.
const STICKY_RIGHT = "sticky right-0 z-10 bg-inherit shadow-[inset_1px_0_0_0_hsl(var(--border))]";

const RO = ({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" }) => (
  <span className={cn("text-atmo-10", align === "right" && "block text-right tabular-nums")}>
    {children}
  </span>
);

const CommentsCell = ({
  value, onChange, disabled,
}: { value: string; onChange: (v: string) => void; disabled?: boolean }) => {
  const err = validateComments(value);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "inline-flex items-center gap-1.5 h-7 px-2 rounded-sm border text-xs hover:bg-atmo-1 disabled:opacity-50",
            err ? "border-destructive text-destructive" : value ? "border-atmo-5 text-foreground" : "border-dashed border-atmo-5 text-atmo-8",
          )}
        >
          <MessageSquare className="h-3 w-3" />
          {value ? `${value.length} char${value.length === 1 ? "" : "s"}` : "Add comment"}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-3" align="start">
        <div className="text-[11px] font-semibold uppercase text-atmo-9 mb-1.5">Comments</div>
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={commentsMaxLen + 50}
          className={cn("min-h-[110px] text-xs", err && "border-destructive focus-visible:ring-destructive")}
          placeholder="Add reviewer note…"
          disabled={disabled}
        />
        <div className={cn("mt-1 flex justify-between text-[11px]", err ? "text-destructive" : "text-atmo-8")}>
          <span>{err ?? "Markdown not supported."}</span>
          <span>{value.length}/{commentsMaxLen}</span>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const EditableInput = ({
  value, onChange, error, disabled, max, align = "left", placeholder, dirty, onBlur,
}: {
  value: string; onChange: (v: string) => void; error: string | null;
  disabled?: boolean; max?: number; align?: "left" | "right"; placeholder?: string;
  dirty?: boolean; onBlur?: () => void;
}) => (
  <div>
    <Input
      value={value}
      maxLength={max}
      disabled={disabled}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      className={cn(
        "h-7 text-xs px-2 border-atmo-5 bg-atmo-0",
        align === "right" && "text-right tabular-nums",
        error && "border-destructive ring-1 ring-destructive focus-visible:ring-destructive",
        !error && dirty && "border-l-2 border-l-amber-500",
        disabled && READONLY_BG,
      )}
    />
    {error && <div className="mt-0.5 text-[10px] font-semibold text-destructive">{error}</div>}
  </div>
);

const AuditCell = ({ a }: { a: BusRow["audit"] }) => (
  <div className="text-[11px] leading-tight text-atmo-9">
    <div><span className="text-atmo-8">Created</span> {a.createdBy} · {a.createdDate}</div>
    <div><span className="text-atmo-8">Modified</span> {a.modifiedBy} · {a.modifiedDate}</div>
  </div>
);

/* ============================== BUS GRID ============================== */

const BUS_COLUMNS: { key: string; label: string; width: string; sticky?: boolean }[] = [
  { key: "id", label: "ID", width: "w-[7%]" },
  { key: "status", label: "Status", width: "w-[10%]" },
  { key: "busNumber", label: "Bus Number", width: "w-[9%]" },
  { key: "busName", label: "Bus Name", width: "w-[9%]" },
  { key: "voltage", label: "Voltage", width: "w-[8%]" },
  { key: "busLongName", label: "Expanded Name", width: "w-[14%]" },
  { key: "eiaPlantCode", label: "EIA Plant Code", width: "w-[10%]" },
  { key: "region", label: "Region Name", width: "w-[9%]" },
  { key: "areaId", label: "Area ID", width: "w-[7%]" },
  { key: "ownerName", label: "Owner Name", width: "w-[9%]" },
  { key: "actions", label: "Actions", width: "w-[80px]", sticky: true },
];


export const BusGrid = ({
  rows, onChange, locked,
}: { rows: BusRow[]; onChange: (i: number, patch: Partial<BusRow>) => void; locked: boolean }) => {
  const [activityRow, setActivityRow] = useState<BusRow | null>(null);
  const [open, setOpen] = useState(false);
  const [activityMap, setActivityMap] = useState<Record<string, ActivityItem[]>>({});
  const [dirty, setDirty] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<{ busLongName: string; eiaPlantCode: string } | null>(null);
  const initialRef = useRef<Map<string, string>>(
    new Map(rows.map((r) => [r.id, r.busLongName])),
  );

  const openActivity = (r: BusRow) => {
    setActivityRow(r);
    setActivityMap((prev) => (prev[r.id] ? prev : { ...prev, [r.id]: seedActivity(r.audit, r.comments) }));
    setOpen(true);
  };
  const addBusComment = (message: string) => {
    if (!activityRow) return;
    const id = activityRow.id;
    setActivityMap((prev) => ({
      ...prev,
      [id]: [
        ...(prev[id] ?? seedActivity(activityRow.audit, activityRow.comments)),
        { id: `c-${Date.now()}`, type: "comment", user: "You", message, timestamp: "just now" },
      ],
    }));
  };

  const startEdit = (r: BusRow) => {
    setEditingId(r.id);
    setDraft({ busLongName: r.busLongName, eiaPlantCode: r.eiaPlantCode });
  };
  const discardEdit = () => { setEditingId(null); setDraft(null); };
  const saveEdit = (i: number, r: BusRow) => {
    if (!draft) return;
    onChange(i, {
      busLongName: draft.busLongName,
      eiaPlantCode: draft.eiaPlantCode,
      status: "Pending Acceptance",
      audit: {
        ...r.audit,
        modifiedBy: "current.user",
        modifiedDate: new Date().toLocaleDateString("en-US"),
      },
    });
    initialRef.current.set(r.id, draft.busLongName);
    setDirty((prev) => { const n = new Set(prev); n.delete(r.id); return n; });
    setEditingId(null);
    setDraft(null);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-fixed border-collapse">
        <colgroup>
          {BUS_COLUMNS.map((c) => <col key={c.key} className={c.width} />)}
        </colgroup>
        <thead>
          <tr className="border-b border-atmo-4 bg-atmo-1">
            {BUS_COLUMNS.map((c) => (
              <th key={c.key} className={cn(TH, c.key === "actions" && "text-center", c.sticky && STICKY_RIGHT, c.sticky && "bg-atmo-1")}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const rowLocked = locked || r.locked;
            const numErr = validateBusNumber(r.busNumber, r.region);
            const isEditing = editingId === r.id;
            const rowBg = isEditing ? "bg-hitachi-interactive-primary" : cn("hover:bg-atmo-1/40", i % 2 === 1 ? "bg-zebra" : "bg-atmo-0");
            const nameErr = isEditing && draft ? validateBusName(draft.busLongName) : null;
            const eiaErr = isEditing && draft ? validateInteger(draft.eiaPlantCode) : null;
            const saveDisabled = !!(nameErr || eiaErr) || !draft?.busLongName.trim();
            return (
              <Fragment key={r.id}>
                <tr className={cn("border-b border-atmo-3", rowBg, isEditing && "border-b-0")}>
                  <td className={TD}><RO>{r.id}</RO></td>
                  <td className={TD}><StatusBadge status={r.status} /></td>
                  <td className={cn(TD, "font-mono tabular-nums")}>
                    <span className={cn("inline-flex items-center gap-1", numErr && "text-destructive")}>
                      {r.locked && <Lock className="h-3 w-3 text-atmo-8" />}
                      {r.busNumber}
                    </span>
                    {numErr && <div className="mt-0.5 text-[10px] font-semibold text-destructive">{numErr}</div>}
                  </td>
                  <td className={TD}><RO>{r.busName}</RO></td>
                  <td className={cn(TD, "tabular-nums")}><RO>{r.voltage}</RO></td>
                  <td className={TD}>
                    {isEditing && draft ? (
                      <div>
                        <Input
                          autoFocus
                          value={draft.busLongName}
                          maxLength={busNameMaxLen + 5}
                          placeholder="Enter text"
                          onChange={(e) => setDraft({ ...draft, busLongName: e.target.value })}
                          className={cn(
                            INLINE_INPUT,
                            nameErr && "border-destructive ring-1 ring-destructive focus-visible:ring-destructive",
                          )}
                        />
                        {nameErr && <div className="mt-0.5 text-[10px] font-semibold text-destructive">{nameErr}</div>}
                      </div>
                    ) : (
                      <span className={cn("text-atmo-10", dirty.has(r.id) && "border-l-2 border-l-amber-500 pl-1.5 -ml-1.5")}>
                        {r.busLongName || <span className="italic text-atmo-8">—</span>}
                      </span>
                    )}
                  </td>
                  <td className={TD}>
                    {isEditing && draft ? (
                      <div>
                        <Input
                          value={draft.eiaPlantCode}
                          placeholder="Enter text"
                          onChange={(e) => setDraft({ ...draft, eiaPlantCode: e.target.value })}
                          className={cn(
                            INLINE_INPUT,
                            eiaErr && "border-destructive ring-1 ring-destructive focus-visible:ring-destructive",
                          )}
                        />
                        {eiaErr && <div className="mt-0.5 text-[10px] font-semibold text-destructive">{eiaErr}</div>}
                      </div>
                    ) : (
                      <span className="text-atmo-10 tabular-nums">{r.eiaPlantCode || <span className="italic text-atmo-8">—</span>}</span>
                    )}
                  </td>
                  <td className={TD}><RO>{r.region}</RO></td>
                  <td className={cn(TD, "tabular-nums")}><RO>{r.areaId}</RO></td>
                  <td className={TD}><RO>{r.ownerName}</RO></td>
                  <td className={cn(TD, "text-center", STICKY_RIGHT)}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          aria-label="Row actions"
                          className="inline-flex h-7 w-7 items-center justify-center rounded-sm border border-transparent text-atmo-9 hover:bg-atmo-2 hover:border-atmo-4"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem
                          disabled={rowLocked}
                          onClick={() => startEdit(r)}
                          className="text-xs gap-2"
                        >
                          <Pencil className="h-3.5 w-3.5 text-atmo-9" />
                          <span className="tracking-wide">Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openActivity(r)}
                          className="text-xs gap-2"
                        >
                          <MessageCircle className="h-3.5 w-3.5 text-atmo-9" />
                          <span className="tracking-wide">View Activity</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
                {isEditing && (
                  <tr key={`${r.id}-edit-bar`} className="border-b border-atmo-3 bg-hitachi-interactive-primary">
                    <td colSpan={BUS_COLUMNS.length} className="px-3 py-2">
                      <div className="flex items-center justify-end gap-4">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs gap-1.5 text-foreground hover:bg-hitachi-informative-20"
                          disabled={saveDisabled}
                          onClick={() => saveEdit(i, r)}
                        >
                          <Check className="h-3.5 w-3.5" />
                          Save Changes
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 text-xs hover:bg-hitachi-informative-20" onClick={discardEdit}>
                          Discard
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
      <RowActivitySheet
        open={open}
        onOpenChange={setOpen}
        title={`Activity · ${activityRow ? `${activityRow.id} — Bus ${activityRow.busNumber}` : "—"}`}
        description="Chronological audit and reviewer notes for this asset row."
        items={activityRow ? (activityMap[activityRow.id] ?? seedActivity(activityRow.audit, activityRow.comments)) : []}
        onAddComment={addBusComment}
      />
    </div>
  );
};

/* ============================ GENERATOR GRID ============================ */

const INLINE_INPUT =
  "h-7 text-xs px-2 rounded-md border border-slate-600 bg-white " +
  "hover:border-slate-700 focus-visible:border-slate-800 " +
  "focus-visible:ring-1 focus-visible:ring-slate-700 focus-visible:ring-offset-0";

const GEN_COLUMNS: { key: keyof GeneratorRow | "actions"; label: string; minWidth: number; align?: "right" }[] = [
  { key: "busId",                 label: "Bus ID",                   minWidth: 110 },
  { key: "status",                label: "Status",                   minWidth: 140 },
  { key: "submittalYear",         label: "Submittal Year",           minWidth: 120 },
  { key: "responsibleEntity",     label: "Responsible Entity Name",  minWidth: 170 },
  { key: "region",                label: "Region Name",              minWidth: 110 },
  { key: "areaId",                label: "Area ID",                  minWidth:  90 },
  { key: "busKv",                 label: "Bus kV",                   minWidth:  90 },
  { key: "busNam",                label: "Bus Nam",                  minWidth: 100 },
  { key: "longName",              label: "Long Name",                minWidth: 200 },
  { key: "eiaPlantCode",          label: "EIA Plant Code",           minWidth: 130 },
  { key: "giGenNumber",           label: "GI Gen Number",            minWidth: 140 },
  { key: "pwrFlowRetirementDate", label: "Pwr Flow Retirement Date", minWidth: 170 },
  { key: "primaryFuelType",       label: "Primary Fuel Type",        minWidth: 160 },
  { key: "genId",                 label: "Gen ID",                   minWidth:  90 },
  { key: "secondaryFuelType",     label: "Secondary Fuel Type",      minWidth: 160 },
  { key: "aux1BusId",             label: "Aux Load 1 Bus ID",        minWidth: 140 },
  { key: "aux1Id",                label: "Aux Load 1 ID",            minWidth: 120 },
  { key: "aux2BusId",             label: "Aux Load 2 Bus ID",        minWidth: 140 },
  { key: "aux2Id",                label: "Aux Load 2 ID",            minWidth: 120 },
  { key: "aux3BusId",             label: "Aux Load 3 Bus ID",        minWidth: 140 },
  { key: "aux3Id",                label: "Aux Load 3 ID",            minWidth: 120 },
  { key: "aux4BusId",             label: "Aux Load 4 Bus ID",        minWidth: 140 },
  { key: "aux4Id",                label: "Aux Load 4 ID",            minWidth: 120 },
  { key: "aux5BusId",             label: "Aux Load 5 Bus ID",        minWidth: 140 },
  { key: "aux5Id",                label: "Aux Load 5 ID",            minWidth: 120 },
  { key: "actions",               label: "Actions",                  minWidth:  80 },
];

const GenStatusPill = ({ status }: { status: GeneratorRow["status"] }) => (
  <StatusPill
    status={status}
    label={status === "Pending Acceptance" ? "Pending Approval" : undefined}
  />
);

const cellValue = (v: unknown) =>
  v === "" || v === null || v === undefined ? <span className="italic text-atmo-8">—</span> : String(v);

type GenDraft = {
  longName: string;
  giGenNumber: string;
  pwrFlowRetirementDate: string;
  primaryFuelType: GeneratorRow["primaryFuelType"];
  secondaryFuelType: string;
  aux1BusId: string; aux1Id: string;
  aux2BusId: string; aux2Id: string;
  aux3BusId: string; aux3Id: string;
  aux4BusId: string; aux4Id: string;
  aux5BusId: string; aux5Id: string;
};

const s = (v: unknown) => (v === undefined || v === null ? "" : String(v));
const validateRetireDate = (v: string): string | null => {
  if (v === "" || v === "—") return null;
  return /^\d{2}\/\d{2}\/\d{4}$/.test(v) ? null : "Invalid Data Format · MM/DD/YYYY";
};

const SECONDARY_NONE = "__none__";

export const GeneratorGrid = ({
  rows, onChange, locked,
}: { rows: GeneratorRow[]; onChange: (i: number, patch: Partial<GeneratorRow>) => void; locked: boolean }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<GenDraft | null>(null);
  const [activityRow, setActivityRow] = useState<GeneratorRow | null>(null);
  const [activityOpen, setActivityOpen] = useState(false);
  const [activityMap, setActivityMap] = useState<Record<string, ActivityItem[]>>({});

  const openActivity = (r: GeneratorRow) => {
    setActivityRow(r);
    setActivityMap((prev) => (prev[r.generatorId] ? prev : { ...prev, [r.generatorId]: seedActivity(r.audit, r.comments) }));
    setActivityOpen(true);
  };
  const addGenComment = (message: string) => {
    if (!activityRow) return;
    const id = activityRow.generatorId;
    setActivityMap((prev) => ({
      ...prev,
      [id]: [
        ...(prev[id] ?? seedActivity(activityRow.audit, activityRow.comments)),
        { id: `c-${Date.now()}`, type: "comment", user: "You", message, timestamp: "just now" },
      ],
    }));
  };


  const startEdit = (r: GeneratorRow) => {
    setEditingId(r.generatorId);
    setDraft({
      longName: s(r.longName),
      giGenNumber: s(r.giGenNumber),
      pwrFlowRetirementDate: s(r.pwrFlowRetirementDate),
      primaryFuelType: r.primaryFuelType ?? "",
      secondaryFuelType: s(r.secondaryFuelType),
      aux1BusId: s(r.aux1BusId), aux1Id: s(r.aux1Id),
      aux2BusId: s(r.aux2BusId), aux2Id: s(r.aux2Id),
      aux3BusId: s(r.aux3BusId), aux3Id: s(r.aux3Id),
      aux4BusId: s(r.aux4BusId), aux4Id: s(r.aux4Id),
      aux5BusId: s(r.aux5BusId), aux5Id: s(r.aux5Id),
    });
  };
  const discardEdit = () => { setEditingId(null); setDraft(null); };
  const saveEdit = (i: number, r: GeneratorRow) => {
    if (!draft) return;
    onChange(i, {
      longName: draft.longName,
      giGenNumber: draft.giGenNumber,
      pwrFlowRetirementDate: draft.pwrFlowRetirementDate,
      primaryFuelType: draft.primaryFuelType,
      secondaryFuelType: draft.secondaryFuelType,
      aux1BusId: draft.aux1BusId, aux1Id: draft.aux1Id,
      aux2BusId: draft.aux2BusId, aux2Id: draft.aux2Id,
      aux3BusId: draft.aux3BusId, aux3Id: draft.aux3Id,
      aux4BusId: draft.aux4BusId, aux4Id: draft.aux4Id,
      aux5BusId: draft.aux5BusId, aux5Id: draft.aux5Id,
      status: "Pending Acceptance",
      audit: {
        ...r.audit,
        modifiedBy: "current.user",
        modifiedDate: new Date().toLocaleDateString("en-US"),
      },
    });
    setEditingId(null);
    setDraft(null);
    toast.success("Ancillary equipment details updated and sent to " + brand.clientShortName + " for review.");
  };

  const auxKeys: Array<["aux1BusId"|"aux2BusId"|"aux3BusId"|"aux4BusId"|"aux5BusId", "aux1Id"|"aux2Id"|"aux3Id"|"aux4Id"|"aux5Id"]> = [
    ["aux1BusId","aux1Id"],["aux2BusId","aux2Id"],["aux3BusId","aux3Id"],["aux4BusId","aux4Id"],["aux5BusId","aux5Id"],
  ];

  const editInput = (
    value: string,
    onChangeVal: (v: string) => void,
    opts: { placeholder?: string; align?: "left" | "right"; error?: string | null; maxLength?: number } = {},
  ) => (
    <div>
      <Input
        value={value}
        maxLength={opts.maxLength}
        placeholder={opts.placeholder}
        onChange={(e) => onChangeVal(e.target.value)}
        className={cn(
          INLINE_INPUT,
          opts.align === "right" && "text-right tabular-nums",
          opts.error && "border-destructive ring-1 ring-destructive focus-visible:ring-destructive",
        )}
      />
      {opts.error && <div className="mt-0.5 text-[10px] font-semibold text-destructive">{opts.error}</div>}
    </div>
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-max w-full border-collapse">
        <thead>
          <tr className="border-b border-atmo-4 bg-atmo-1">
            {GEN_COLUMNS.map((c) => (
              <th
                key={String(c.key)}
                className={cn(TH, c.align === "right" && "text-right", c.key === "actions" && cn(STICKY_RIGHT, "bg-atmo-1"))}
                style={{ minWidth: c.minWidth }}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const rowLocked = locked || r.locked || !r.isPrimaryOwner;
            const isEditing = editingId === r.generatorId;
            const editBg = isEditing ? "bg-hitachi-interactive-primary" : cn("hover:bg-atmo-1/40", i % 2 === 1 ? "bg-zebra" : "bg-atmo-0");
            const isJoint = !r.isPrimaryOwner;

            const nameErr = isEditing && draft && draft.longName.length > 45
              ? "Invalid Data Format · max 45 chars" : null;
            const retireErr = isEditing && draft ? validateRetireDate(draft.pwrFlowRetirementDate) : null;
            const auxErrs: Record<string, string | null> = {};
            if (isEditing && draft) {
              for (const [bk] of auxKeys) auxErrs[bk] = validateInteger(draft[bk]);
            }
            const anyAuxErr = Object.values(auxErrs).some(Boolean);
            const fuelMissing = isEditing && draft ? draft.primaryFuelType === "" : false;
            const saveDisabled =
              !draft ||
              !draft.longName.trim() ||
              !!nameErr || !!retireErr || anyAuxErr || fuelMissing;

            return (
              <Fragment key={r.generatorId}>
                <tr
                  className={cn(
                    "border-b border-atmo-3",
                    editBg,
                    isEditing && "border-b-0",
                  )}
                >
                  {/* BUS ID (RO) */}
                  <td className={TD}><RO>{r.busId}</RO></td>
                  {/* STATUS (RO) */}
                  <td className={TD}><GenStatusPill status={r.status} /></td>
                  {/* SUBMITTAL YEAR (RO) */}
                  <td className={TD}><RO>{r.submittalYear}</RO></td>
                  {/* RESPONSIBLE ENTITY (RO) */}
                  <td className={TD}><RO>{r.responsibleEntity}</RO></td>
                  {/* REGION (RO) */}
                  <td className={TD}><RO>{r.region}</RO></td>
                  {/* AREA ID (RO) */}
                  <td className={TD}><RO>{r.areaId}</RO></td>
                  {/* BUS KV (RO) */}
                  <td className={TD}><RO>{r.busKv}</RO></td>
                  {/* BUS NAM (RO) */}
                  <td className={TD}><RO>{r.busNam}</RO></td>
                  {/* LONG NAME (editable) */}
                  <td className={TD}>
                    {isEditing && draft
                      ? editInput(draft.longName, (v) => setDraft({ ...draft, longName: v }),
                          { placeholder: "Enter long name…", maxLength: 50, error: nameErr })
                      : <RO>{cellValue(r.longName)}</RO>}
                  </td>
                  {/* EIA PLANT CODE (RO) */}
                  <td className={TD}><RO>{cellValue(r.eiaPlantCode)}</RO></td>
                  {/* GI GEN NUMBER (editable) */}
                  <td className={TD}>
                    {isEditing && draft
                      ? editInput(draft.giGenNumber, (v) => setDraft({ ...draft, giGenNumber: v }),
                          { placeholder: "GI-YYYY-###" })
                      : <RO>{cellValue(r.giGenNumber)}</RO>}
                  </td>
                  {/* PWR FLOW RETIREMENT DATE (editable) */}
                  <td className={TD}>
                    {isEditing && draft
                      ? editInput(draft.pwrFlowRetirementDate,
                          (v) => setDraft({ ...draft, pwrFlowRetirementDate: v }),
                          { placeholder: "MM/DD/YYYY", error: retireErr })
                      : <RO>{cellValue(r.pwrFlowRetirementDate)}</RO>}
                  </td>
                  {/* PRIMARY FUEL TYPE (editable Select) */}
                  <td className={TD}>
                    {isEditing && draft ? (
                      <Select
                        value={draft.primaryFuelType || undefined}
                        onValueChange={(v) => setDraft({ ...draft, primaryFuelType: v as GeneratorRow["primaryFuelType"] })}
                      >
                        <SelectTrigger className={cn(INLINE_INPUT, "justify-between")}>
                          <SelectValue placeholder="Select fuel…" />
                        </SelectTrigger>
                        <SelectContent>
                          {FUEL_TYPES.map((f) => <SelectItem key={f} value={f} className="text-xs">{f}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    ) : (
                      <RO>{cellValue(r.primaryFuelType)}</RO>
                    )}
                  </td>
                  {/* GEN ID (RO) */}
                  <td className={TD}><RO>{cellValue(r.genId)}</RO></td>
                  {/* SECONDARY FUEL TYPE (editable Select) */}
                  <td className={TD}>
                    {isEditing && draft ? (
                      <Select
                        value={draft.secondaryFuelType === "" ? SECONDARY_NONE : draft.secondaryFuelType}
                        onValueChange={(v) => setDraft({ ...draft, secondaryFuelType: v === SECONDARY_NONE ? "" : v })}
                      >
                        <SelectTrigger className={cn(INLINE_INPUT, "justify-between")}>
                          <SelectValue placeholder="Select fuel…" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={SECONDARY_NONE} className="text-xs">— None —</SelectItem>
                          {FUEL_TYPES.map((f) => <SelectItem key={f} value={f} className="text-xs">{f}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    ) : (
                      <RO>{cellValue(r.secondaryFuelType)}</RO>
                    )}
                  </td>
                  {/* AUX LOADS 1-5 (editable) */}
                  {auxKeys.map(([bk, ik]) => (
                    <Fragment key={bk}>
                      <td className={TD}>
                        {isEditing && draft
                          ? editInput(draft[bk], (v) => setDraft({ ...draft, [bk]: v } as GenDraft),
                              { placeholder: "0", error: auxErrs[bk] })
                          : <RO>{cellValue(r[bk])}</RO>}
                      </td>
                      <td className={TD}>
                        {isEditing && draft
                          ? editInput(draft[ik], (v) => setDraft({ ...draft, [ik]: v } as GenDraft),
                              { placeholder: "AX#" })
                          : <RO>{cellValue(r[ik])}</RO>}
                      </td>
                    </Fragment>
                  ))}
                  {/* ACTIONS */}
                  <td className={cn(TD, "text-center", STICKY_RIGHT)}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          aria-label="Row actions"
                          className="inline-flex h-7 w-7 items-center justify-center rounded-sm border border-transparent text-atmo-9 hover:bg-atmo-2 hover:border-atmo-4"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem
                          disabled={rowLocked}
                          onClick={() => startEdit(r)}
                          className="text-xs gap-2"
                        >
                          <Pencil className="h-3.5 w-3.5 text-atmo-9" />
                          <span className="tracking-wide">Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openActivity(r)}
                          className="text-xs gap-2"
                        >
                          <MessageCircle className="h-3.5 w-3.5 text-atmo-9" />
                          <span className="tracking-wide">View Activity</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
                {isEditing && (
                  <tr className="border-b border-atmo-3 bg-hitachi-interactive-primary">
                    <td colSpan={GEN_COLUMNS.length} className="px-3 py-2">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={discardEdit}>
                          Discard
                        </Button>
                        <Button
                          size="sm"
                          className="h-7 text-xs gap-1.5"
                          disabled={saveDisabled}
                          onClick={() => saveEdit(i, r)}
                        >
                          <Check className="h-3.5 w-3.5" />
                          Save Changes
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}

        </tbody>
      </table>
      <RowActivitySheet
        open={activityOpen}
        onOpenChange={setActivityOpen}
        title={`Activity · ${activityRow ? `${activityRow.generatorId} — Bus ${activityRow.busId}` : "—"}`}
        description="Chronological audit and reviewer notes for this generator row."
        items={activityRow ? (activityMap[activityRow.generatorId] ?? seedActivity(activityRow.audit, activityRow.comments)) : []}
        onAddComment={addGenComment}
      />
    </div>
  );
};
