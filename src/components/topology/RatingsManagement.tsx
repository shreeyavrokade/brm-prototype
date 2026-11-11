import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Search, Plus, Download, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useRatings, addRating, nextRatingId } from "@/store/ratingsStore";
import type { RatingRow, RatingStatus, Season } from "./mockRatings";
import { toast } from "@/hooks/use-toast";
import { STATUS_TOKENS, STATUS_PILL_CLASS } from "@/components/shared/statusBadge";

const STATUS_STYLES: Record<RatingStatus, { bg: string; fg: string; border: string }> = {
  Active: STATUS_TOKENS.Accepted,
  Pending: STATUS_TOKENS["Pending Acceptance"],
  Retired: STATUS_TOKENS.Draft,
};

const SEASONS: Season[] = ["Summer", "Winter", "Spring", "Fall"];
const BASES = ["Normal", "Emergency", "Load Shed"] as const;

const COLS: { key: keyof RatingRow; label: string }[] = [
  { key: "tieLineId", label: "Tie-Line ID" },
  { key: "fromBus", label: "From Bus" },
  { key: "toBus", label: "To Bus" },
  { key: "circuit", label: "Circuit" },
  { key: "owner", label: "Owner" },
  { key: "normalMva", label: "Normal (MVA)" },
  { key: "emergencyMva", label: "Emergency (MVA)" },
  { key: "lteMva", label: "LTE (MVA)" },
  { key: "steMva", label: "STE (MVA)" },
  { key: "season", label: "Season" },
  { key: "effectiveDate", label: "Effective Date" },
  { key: "status", label: "Status" },
];

const exportCsv = (rows: RatingRow[]) => {
  const header = COLS.map((c) => c.label).join(",");
  const lines = rows.map((r) =>
    COLS.map((c) => String(r[c.key]).split(",").join(" ")).join(","),
  );
  const csv = [header, ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "tie-line-ratings.csv";
  a.click();
  URL.revokeObjectURL(url);
};

const initialDraft = (): Omit<RatingRow, "id" | "createdTimestamp"> => ({
  tieLineId: "",
  fromBus: "",
  toBus: "",
  circuit: "1",
  owner: "",
  normalMva: 0,
  emergencyMva: 0,
  lteMva: 0,
  steMva: 0,
  season: "Summer",
  effectiveDate: format(new Date(), "dd MMM yyyy"),
  status: "Pending",
});

const RatingsManagement = () => {
  const data = useRatings();
  const [query, setQuery] = useState("");
  const [season, setSeason] = useState<string>("all");
  const [basis, setBasis] = useState<string>("Normal");
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(initialDraft);
  const [effDate, setEffDate] = useState<Date | undefined>(new Date());

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.filter((r) => {
      const matchesQ =
        !q ||
        r.tieLineId.toLowerCase().includes(q) ||
        r.fromBus.toLowerCase().includes(q) ||
        r.toBus.toLowerCase().includes(q);
      const matchesSeason = season === "all" || r.season === season;
      return matchesQ && matchesSeason;
    });
  }, [data, query, season]);

  const handleSave = () => {
    if (!draft.tieLineId || !draft.fromBus || !draft.toBus) {
      toast({ title: "Missing fields", description: "Tie-Line ID, From Bus, and To Bus are required.", variant: "destructive" });
      return;
    }
    const dateStr = effDate ? format(effDate, "dd MMM yyyy") : draft.effectiveDate;
    addRating({
      ...draft,
      effectiveDate: dateStr,
      id: nextRatingId(),
      createdTimestamp: Date.now(),
    });
    toast({ title: "Tie-line added", description: `${draft.tieLineId} saved to ratings.` });
    setOpen(false);
    setDraft(initialDraft());
    setEffDate(new Date());
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-atmo-8 pointer-events-none" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by Tie-Line ID or Element Name"
              className="h-9 pl-9 rounded-full border-atmo-4 bg-atmo-0 text-sm"
            />
          </div>
          <Select value={season} onValueChange={setSeason}>
            <SelectTrigger className="h-9 w-36 rounded-full border-atmo-4 bg-atmo-0 text-sm">
              <SelectValue placeholder="Season" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Seasons</SelectItem>
              {SEASONS.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={basis} onValueChange={setBasis}>
            <SelectTrigger className="h-9 w-40 rounded-full border-atmo-4 bg-atmo-0 text-sm">
              <SelectValue placeholder="Rating Basis" />
            </SelectTrigger>
            <SelectContent>
              {BASES.map((b) => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => exportCsv(rows)} className="gap-1.5 h-9">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button
            onClick={() => setOpen(true)}
            className="bg-brand-secondary text-brand-secondary-invert hover:bg-brand-secondary/90 rounded-full px-4 h-9 gap-1.5"
          >
            <Plus className="h-4 w-4" />
            New Tie-Line
          </Button>
        </div>
      </div>

      <div className="bg-atmo-0 border border-atmo-4 rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-atmo-1 hover:bg-atmo-1 border-[#E2E8F0]">
                {COLS.map((c) => (
                  <TableHead key={String(c.key)} className="text-xs font-semibold text-atmo-10 border border-[#E2E8F0] whitespace-nowrap">
                    {c.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r, idx) => {
                const s = STATUS_STYLES[r.status];
                return (
                  <TableRow key={r.id} className={cn("border-[#E2E8F0]", idx % 2 === 1 && "bg-zebra")}>
                    <TableCell className="text-sm text-foreground font-mono border border-[#E2E8F0]">{r.tieLineId}</TableCell>
                    <TableCell className="text-sm text-atmo-10 border border-[#E2E8F0]">{r.fromBus}</TableCell>
                    <TableCell className="text-sm text-atmo-10 border border-[#E2E8F0]">{r.toBus}</TableCell>
                    <TableCell className="text-sm text-atmo-10 border border-[#E2E8F0]">{r.circuit}</TableCell>
                    <TableCell className="text-sm text-atmo-10 border border-[#E2E8F0]">{r.owner}</TableCell>
                    <TableCell className="text-sm text-atmo-10 border border-[#E2E8F0] tabular-nums">{r.normalMva}</TableCell>
                    <TableCell className="text-sm text-atmo-10 border border-[#E2E8F0] tabular-nums">{r.emergencyMva}</TableCell>
                    <TableCell className="text-sm text-atmo-10 border border-[#E2E8F0] tabular-nums">{r.lteMva}</TableCell>
                    <TableCell className="text-sm text-atmo-10 border border-[#E2E8F0] tabular-nums">{r.steMva}</TableCell>
                    <TableCell className="text-sm text-atmo-10 border border-[#E2E8F0]">{r.season}</TableCell>
                    <TableCell className="text-sm text-atmo-10 border border-[#E2E8F0] whitespace-nowrap">{r.effectiveDate}</TableCell>
                    <TableCell className="border border-[#E2E8F0]">
                      <Badge
                        className={STATUS_PILL_CLASS}
                        style={{ backgroundColor: s.bg, color: s.fg, borderColor: s.border }}
                      >
                        {r.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={COLS.length} className="text-center text-atmo-8 text-sm py-12 border border-[#E2E8F0]">
                    No tie-lines match the current filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>New Tie-Line Rating</SheetTitle>
          </SheetHeader>
          <div className="grid gap-4 py-6">
            <div className="grid gap-2">
              <Label htmlFor="tieLineId">Tie-Line ID</Label>
              <Input id="tieLineId" value={draft.tieLineId} onChange={(e) => setDraft({ ...draft, tieLineId: e.target.value })} placeholder="TL-000-000" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="fromBus">From Bus</Label>
                <Input id="fromBus" value={draft.fromBus} onChange={(e) => setDraft({ ...draft, fromBus: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="toBus">To Bus</Label>
                <Input id="toBus" value={draft.toBus} onChange={(e) => setDraft({ ...draft, toBus: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="circuit">Circuit</Label>
                <Input id="circuit" value={draft.circuit} onChange={(e) => setDraft({ ...draft, circuit: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="owner">Owner</Label>
                <Input id="owner" value={draft.owner} onChange={(e) => setDraft({ ...draft, owner: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="normalMva">Normal (MVA)</Label>
                <Input id="normalMva" type="number" value={draft.normalMva} onChange={(e) => setDraft({ ...draft, normalMva: Number(e.target.value) })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="emergencyMva">Emergency (MVA)</Label>
                <Input id="emergencyMva" type="number" value={draft.emergencyMva} onChange={(e) => setDraft({ ...draft, emergencyMva: Number(e.target.value) })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lteMva">LTE (MVA)</Label>
                <Input id="lteMva" type="number" value={draft.lteMva} onChange={(e) => setDraft({ ...draft, lteMva: Number(e.target.value) })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="steMva">STE (MVA)</Label>
                <Input id="steMva" type="number" value={draft.steMva} onChange={(e) => setDraft({ ...draft, steMva: Number(e.target.value) })} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Season</Label>
              <Select value={draft.season} onValueChange={(v) => setDraft({ ...draft, season: v as Season })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SEASONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Effective Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    {effDate ? format(effDate, "dd MMM yyyy") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={effDate} onSelect={setEffDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select value={draft.status} onValueChange={(v) => setDraft({ ...draft, status: v as RatingStatus })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Retired">Retired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <SheetFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} className="bg-brand-secondary text-brand-secondary-invert hover:bg-brand-secondary/90">Save Tie-Line</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default RatingsManagement;
