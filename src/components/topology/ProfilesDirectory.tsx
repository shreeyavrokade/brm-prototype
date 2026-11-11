import { Link } from "react-router-dom";
import { useMemo } from "react";
import { ArrowUp, ChevronsUpDown } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import LiveStatusBadge from "@/components/submission/LiveStatusBadge";
import { cn } from "@/lib/utils";
import { mockProfileProjects, type ProfileKindLabel } from "./mockProfileSeries";
import { HEADER_CELL, HEADER_ROW, TABLE_SHELL, zebraRow } from "./tableBase";

const HeaderLabel = ({ children, sorted }: { children: React.ReactNode; sorted?: "asc" | "none" }) => (
  <div className="inline-flex items-center gap-1.5">
    <span>{children}</span>
    {sorted === "asc" ? (
      <ArrowUp className="h-3 w-3 text-foreground" />
    ) : sorted === "none" ? (
      <ChevronsUpDown className="h-3 w-3 text-atmo-7" />
    ) : null}
  </div>
);

const TD = "text-sm text-atmo-10 border border-[#E2E8F0]";

interface ProfilesDirectoryProps {
  query?: string;
  profileKind?: ProfileKindLabel;
}

const ProfilesDirectory = ({ query = "", profileKind }: ProfilesDirectoryProps) => {
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = [...mockProfileProjects].sort((a, b) =>
      a.submissionName.localeCompare(b.submissionName),
    );
    return base.filter((p) => {
      const matchesKind = !profileKind || p.profileKindLabel === profileKind;
      const matchesQuery =
        !q ||
        p.submissionId.toLowerCase().includes(q) ||
        p.submissionName.toLowerCase().includes(q);
      return matchesKind && matchesQuery;
    });
  }, [query, profileKind]);

  return (
    <div className={TABLE_SHELL}>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className={HEADER_ROW}>
              <TableHead className={cn(HEADER_CELL, "w-[220px]")}>
                <HeaderLabel sorted="asc">Submission Name</HeaderLabel>
              </TableHead>
              <TableHead className={cn(HEADER_CELL, "w-[110px]")}>ID</TableHead>
              <TableHead className={cn(HEADER_CELL, "w-[170px]")}>
                <HeaderLabel sorted="none">Status</HeaderLabel>
              </TableHead>
              <TableHead className={cn(HEADER_CELL, "w-[140px]")}>
                <HeaderLabel sorted="none">Study Type</HeaderLabel>
              </TableHead>
              <TableHead className={cn(HEADER_CELL, "w-[180px]")}>Base Profile Name</TableHead>
              <TableHead className={cn(HEADER_CELL, "w-[180px]")}>Submitter</TableHead>
              <TableHead className={cn(HEADER_CELL, "w-[150px]")}>Submission…</TableHead>
              <TableHead className={cn(HEADER_CELL, "w-[150px]")}>Profile Type</TableHead>
              
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r, idx) => (
              <TableRow key={`${r.id}-${r.submissionId}-${r.profileKindLabel}`} className={zebraRow(idx)}>
                <TableCell className={cn(TD, "text-foreground")}>
                  <Link to={`/profiles/${r.id}`} className="hover:underline">
                    {r.submissionName}
                  </Link>
                </TableCell>
                <TableCell className={cn(TD, "font-mono tabular-nums")}>{r.submissionId}</TableCell>
                <TableCell className={TD}>
                  <LiveStatusBadge id={r.submittalId ?? r.id} status={r.directoryStatus} />
                </TableCell>
                <TableCell className={TD}>{r.studyType}</TableCell>
                <TableCell className={cn(TD, "truncate max-w-[180px]")}>{r.baseProfileName}</TableCell>
                <TableCell className={cn(TD, "truncate max-w-[180px]")}>{r.submitter}</TableCell>
                <TableCell className={cn(TD, "tabular-nums")}>{r.submissionDate || ""}</TableCell>
                <TableCell className={TD}>{r.profileKindLabel}</TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-atmo-8 text-sm py-12 border border-[#E2E8F0]">
                  No profiles match the current filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProfilesDirectory;
