import { useState } from "react";
import { Check, CircleAlert, CircleCheck, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusPill from "@/components/shared/statusBadge";
import { setDatasetStatus, useDatasetStatus } from "@/store/datasetStatusStore";
import type { DatasetStatus } from "@/components/submission/datasetStatus";
import { intakeQueue, type Footprint, type IntakeRow } from "./intakeQueue";
import ReturnSubmissionModal from "./ReturnSubmissionModal";
import { toast } from "@/hooks/use-toast";

const HEAD =
  "h-12 px-4 text-left text-xs font-semibold uppercase tracking-wide text-atmo-9 border-b border-r border-atmo-3 last:border-r-0 bg-atmo-1";
const CELL = "px-4 py-1.5 text-sm text-foreground border-b border-r border-atmo-3 last:border-r-0";

const Row = ({
  row,
  index,
  onReturn,
}: {
  row: IntakeRow;
  index: number;
  onReturn: (r: IntakeRow) => void;
}) => {
  const status = useDatasetStatus(row.id, row.baseStatus) as DatasetStatus;
  return (
    <tr className={index % 2 ? "bg-[#FBFCFC]" : "bg-atmo-0"}>
      <td className={CELL}>
        <div className="font-medium">{row.fileName}</div>
        <div className="text-xs text-atmo-9">
          {row.id} · {row.submitter} · {row.submittedOn}
        </div>
      </td>
      <td className={CELL}>{row.kind}</td>
      <td className={CELL}>
        {row.validationError ? (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-[#BE123C]">
            <CircleAlert className="h-3.5 w-3.5" />
            {row.validationError}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-[#146C2E]">
            <CircleCheck className="h-3.5 w-3.5" />
            All Rows Valid
          </span>
        )}
      </td>
      <td className={CELL}>
        <StatusPill status={status} />
      </td>
      <td className={`${CELL} w-px`}>
        <div className="flex flex-col gap-1 whitespace-nowrap">
          <Button
            size="sm"
            onClick={() => {
              setDatasetStatus(row.id, "Accepted");
              toast({ title: "Dataset approved", description: row.fileName });
            }}
            className="h-8 gap-1 rounded-full bg-[#0F172A] px-3 text-xs text-white hover:bg-[#0F172A]/90"
          >
            Approve
            <Check className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onReturn(row)}
            className="h-8 gap-1 rounded-full border-atmo-5 bg-atmo-0 px-3 text-xs text-[#BE123C] hover:text-[#BE123C]"
          >
            Return
            <Undo2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </td>
    </tr>
  );
};

export const IntakeQueueTable = ({ footprint }: { footprint: Footprint | "ALL" }) => {
  const [pending, setPending] = useState<IntakeRow | null>(null);
  const rows = intakeQueue.filter((r) => footprint === "ALL" || r.footprint === footprint);

  return (
    <div className="rounded-lg border border-atmo-3 bg-atmo-0">
      <div className="flex items-center justify-between border-b border-atmo-3 px-4 py-3">
        <h2 className="text-sm font-semibold text-foreground">BRM Dataset Intake Queue</h2>
        <span className="text-xs text-atmo-9">{rows.length} files</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className={HEAD}>File</th>
              <th className={HEAD}>Type</th>
              <th className={HEAD}>Validation</th>
              <th className={HEAD}>Status</th>
              <th className={HEAD}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <Row key={r.id + r.fileName} row={r} index={i} onReturn={setPending} />
            ))}
          </tbody>
        </table>
      </div>

      <ReturnSubmissionModal
        open={!!pending}
        onOpenChange={(v) => !v && setPending(null)}
        subject={pending?.fileName ?? ""}
        onConfirm={(notes) => {
          if (!pending) return;
          setDatasetStatus(pending.id, "Review Needed");
          toast({ title: "Returned for revision", description: notes });
          setPending(null);
        }}
      />
    </div>
  );
};

export default IntakeQueueTable;
