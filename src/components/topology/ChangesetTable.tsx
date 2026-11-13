import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpDown, ArrowUp, ArrowDown, ExternalLink, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { type ChangesetRow, type ReviewStatus } from "./mockChangeset";
import { useChangesetRows } from "@/store/changesetStore";
import LiveStatusBadge from "@/components/submission/LiveStatusBadge";
import { cn } from "@/lib/utils";

type SortKey = keyof ChangesetRow | null;
type SortDir = "asc" | "desc";

const STATUS_WEIGHT: Record<ReviewStatus, number> = {
  "Review Needed": 1,
  "Validation in Progress": 2,
  Draft: 3,
  "Pending Acceptance": 4,
  "Acknowledgement Required": 4,
  Accepted: 5,
  Rejected: 6,
};


interface SortHeaderProps {
  label: string;
  sortKey: keyof ChangesetRow;
  current: SortKey;
  dir: SortDir;
  onSort: (k: keyof ChangesetRow) => void;
  className?: string;
}

const SortHeader = ({ label, sortKey, current, dir, onSort, className }: SortHeaderProps) => {
  const active = current === sortKey;
  const Icon = !active ? ArrowUpDown : dir === "asc" ? ArrowUp : ArrowDown;
  return (
    <button
      type="button"
      onClick={() => onSort(sortKey)}
      className={cn("inline-flex items-center gap-1.5 text-xs font-semibold text-atmo-10 hover:text-foreground", className)}
    >
      {label}
      <Icon className={cn("h-3 w-3", active ? "text-foreground" : "text-atmo-7")} />
    </button>
  );
};

interface ChangesetTableProps {
  query?: string;
}

const ChangesetTable = ({ query = "" }: ChangesetTableProps) => {
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const handleSort = (key: keyof ChangesetRow) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const data = useChangesetRows();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter(
      (r) =>
        r.id.toLowerCase().includes(q) ||
        r.projectName.toLowerCase().includes(q),
    );
  }, [data, query]);

  const rows = useMemo(() => {
    if (!sortKey) {
      return [...filtered].sort((a, b) => {
        const w = STATUS_WEIGHT[a.reviewStatus] - STATUS_WEIGHT[b.reviewStatus];
        if (w !== 0) return w;
        return b.submissionTimestamp - a.submissionTimestamp;
      });
    }
    if (sortKey === "reviewStatus") {
      return [...filtered].sort((a, b) => {
        const w = STATUS_WEIGHT[a.reviewStatus] - STATUS_WEIGHT[b.reviewStatus];
        const primary = sortDir === "asc" ? w : -w;
        if (primary !== 0) return primary;
        return b.submissionTimestamp - a.submissionTimestamp;
      });
    }
    const sorted = [...filtered].sort((a, b) => {
      const av = String(a[sortKey]);
      const bv = String(b[sortKey]);
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });
    return sorted;
  }, [filtered, sortKey, sortDir]);

  return (
    <div className="bg-atmo-0 border border-atmo-4 rounded-md overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-atmo-1 hover:bg-atmo-1 border-[#E2E8F0]">
              <TableHead className="text-xs font-semibold text-atmo-10 border border-[#E2E8F0]">ID</TableHead>
              <TableHead className="border border-[#E2E8F0]">
                <SortHeader label="Submission Name" sortKey="projectName" current={sortKey} dir={sortDir} onSort={handleSort} />
              </TableHead>
              <TableHead className="border border-[#E2E8F0]">
                <SortHeader label="Review Status" sortKey="reviewStatus" current={sortKey} dir={sortDir} onSort={handleSort} />
              </TableHead>
              <TableHead className="border border-[#E2E8F0]">
                <SortHeader label="Type" sortKey="type" current={sortKey} dir={sortDir} onSort={handleSort} />
              </TableHead>
              <TableHead className="text-xs font-semibold text-atmo-10 border border-[#E2E8F0]">Submitter</TableHead>
              <TableHead className="border border-[#E2E8F0]">
                <SortHeader label="Submission Date" sortKey="submissionDate" current={sortKey} dir={sortDir} onSort={handleSort} />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, idx) => (
              <TableRow key={row.id} className={cn("border-[#E2E8F0]", idx % 2 === 1 && "bg-zebra")}>
                <TableCell className="text-sm text-atmo-10 font-mono border border-[#E2E8F0]">{row.id}</TableCell>
                <TableCell className="border border-[#E2E8F0]">
                  <Link
                    to={`/submission/${row.id}`}
                    className="inline-flex items-center gap-1.5 text-sm text-foreground hover:text-brand underline-offset-2 hover:underline"
                  >
                    {row.projectName}
                    {idx === 0 && <ExternalLink className="h-3 w-3 text-muted-foreground" />}
                  </Link>
                </TableCell>
                <TableCell className="border border-[#E2E8F0]"><LiveStatusBadge id={row.id} status={row.reviewStatus} /></TableCell>
                <TableCell className="text-sm text-atmo-10 border border-[#E2E8F0]">{row.type}</TableCell>
                <TableCell className="text-sm text-atmo-10 border border-[#E2E8F0]">{row.submitter}</TableCell>
                <TableCell className="text-sm text-atmo-10 border border-[#E2E8F0]">{row.submissionDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t border-atmo-3 text-xs text-atmo-9">
        <div className="flex items-center gap-2">
          <span>25 ▾</span>
          <span>of {rows.length * 17} rows</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7"><ChevronsLeft className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="icon" className="h-7 w-7"><ChevronLeft className="h-3.5 w-3.5" /></Button>
          <span className="px-2 py-0.5 border border-atmo-4 rounded text-foreground">1</span>
          <span>/ 8</span>
          <Button variant="ghost" size="icon" className="h-7 w-7"><ChevronRight className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="icon" className="h-7 w-7"><ChevronsRight className="h-3.5 w-3.5" /></Button>
        </div>
      </div>
    </div>
  );
};

export default ChangesetTable;
