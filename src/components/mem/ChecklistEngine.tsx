import { CheckCircle, Warning } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import type { ChecklistSection, ChecklistStep } from "./memChecklist";

export interface StepProgress {
  verified: number;
  total: number;
}

export type DatasetStatus =
  | "verified"
  | "in-progress"
  | "review-needed"
  | "not-started";

export interface DatasetMeta {
  id: string;
  name: string;
  viewOnly?: boolean;
}

interface Props {
  sections: ChecklistSection[];
  submittedIds?: Record<string, boolean>;
  progressById?: Record<string, StepProgress>;
  totalsById?: Record<string, number>;
  datasetsByStepId?: Record<string, DatasetMeta[]>;
  datasetStatusByStepId?: Record<string, Record<string, DatasetStatus>>;
  onStart: (step: ChecklistStep, datasetId?: string) => void;
}

const StatusPill = ({
  status,
  viewOnly,
}: {
  status: DatasetStatus;
  viewOnly?: boolean;
}) => {
  if (viewOnly || status === "verified") {
    return (
      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
        <CheckCircle weight="fill" className="h-3 w-3" />
        Complete
      </span>
    );
  }
  if (status === "review-needed") {
    return (
      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
        <Warning weight="fill" className="h-3 w-3" />
        Review Needed
      </span>
    );
  }
  if (status === "in-progress") {
    return (
      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        In Progress
      </span>
    );
  }
  return (
    <span className="inline-flex items-center bg-neutral-100 text-neutral-500 text-xs font-medium px-2.5 py-0.5 rounded-full">
      Not Started
    </span>
  );
};

const AccessBadge = ({ viewOnly }: { viewOnly?: boolean }) => (
  <span
    className={cn(
      "text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md",
      viewOnly
        ? "bg-slate-100 text-slate-500"
        : "bg-neutral-100 text-neutral-600",
    )}
  >
    {viewOnly ? "View-Only" : "Editable"}
  </span>
);

const DatasetCTA = ({
  status,
  viewOnly,
  onClick,
}: {
  status: DatasetStatus;
  viewOnly?: boolean;
  onClick: () => void;
}) => {
  const outline =
    "border border-neutral-300 hover:bg-neutral-50 text-neutral-800 text-xs font-semibold rounded-lg px-3.5 py-1.5 shadow-sm";
  const primary =
    "bg-[#222222] hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg px-3.5 py-1.5 shadow-sm";

  if (viewOnly || status === "verified") {
    return (
      <button onClick={onClick} className={outline}>
        View Dataset
      </button>
    );
  }
  if (status === "review-needed") {
    return (
      <button onClick={onClick} className={primary}>
        Review Dataset
      </button>
    );
  }
  if (status === "in-progress") {
    return (
      <button onClick={onClick} className={primary}>
        Review / Edit
      </button>
    );
  }
  return (
    <button onClick={onClick} className={primary}>
      Start
    </button>
  );
};

const StepCard = ({
  step,
  submitted,
  progress,
  total,
  datasets,
  datasetStatus,
  onStart,
}: {
  step: ChecklistStep;
  submitted: boolean;
  progress?: StepProgress;
  total: number;
  datasets: DatasetMeta[];
  datasetStatus: Record<string, DatasetStatus>;
  onStart: (s: ChecklistStep, dsId?: string) => void;
}) => {
  const viewOnlyStep = step.state === "view-only";
  const verified = progress?.verified ?? 0;
  const knownTotal = progress?.total ?? total;
  const allViewOnly =
    datasets.length > 0 && datasets.every((d) => d.viewOnly);
  const allDone =
    !viewOnlyStep &&
    ((knownTotal > 0 && verified >= knownTotal) || allViewOnly);
  const isComplete = submitted || allDone;
  const started = verified > 0;

  let pill: React.ReactNode;
  if (viewOnlyStep) {
    pill = (
      <button
        onClick={() => onStart(step)}
        className="inline-flex items-center h-9 px-5 text-sm font-medium rounded-full border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 transition-colors"
      >
        View-Only
      </button>
    );
  } else if (isComplete) {
    pill = (
      <button
        onClick={() => onStart(step)}
        className="inline-flex items-center gap-1.5 bg-[#146C2E] hover:bg-[#105323] text-white rounded-full px-5 py-1.5 text-sm font-medium transition-colors"
      >
        <CheckCircle weight="regular" className="h-4 w-4" />
        Complete
      </button>
    );
  } else {
    pill = (
      <button
        onClick={() => onStart(step)}
        className="inline-flex items-center bg-[#222222] hover:bg-neutral-800 text-white rounded-full px-5 py-1.5 text-sm font-medium transition-colors"
      >
        {started ? "Resume" : "Start"} ({verified}/{knownTotal} Complete)
      </button>
    );
  }

  return (
    <div className="bg-white border border-neutral-100 rounded-xl p-6 shadow-sm mb-4 flex flex-col">
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <h3 className="text-base font-bold text-neutral-900 mb-1">
            {step.title}
          </h3>
          <p className="text-sm text-neutral-500 max-w-2xl">
            {step.description}
          </p>
        </div>
        <div className="shrink-0">{pill}</div>
      </div>

      {datasets.length > 0 && (
        <div className="divide-y divide-neutral-100 mt-4">
          {datasets.map((ds) => {
            const status: DatasetStatus = ds.viewOnly
              ? "verified"
              : datasetStatus[ds.id] ?? "not-started";
            const needsAttention =
              !ds.viewOnly && status === "review-needed";
            return (
              <div
                key={ds.id}
                onClick={() => onStart(step, ds.id)}
                className={cn(
                  "flex items-center justify-between py-3.5 px-3 rounded-lg transition-colors cursor-pointer group",
                  needsAttention
                    ? "bg-amber-50/50 hover:bg-amber-50"
                    : "hover:bg-neutral-50/80",
                )}
              >
                <div className="min-w-0 flex items-center gap-2">
                  <span className="text-sm font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors truncate">
                    {ds.name}
                  </span>
                  <AccessBadge viewOnly={ds.viewOnly} />
                </div>
                <div className="shrink-0 flex items-center gap-6 justify-end">
                  <div className="w-32 flex justify-end">
                    <StatusPill status={status} viewOnly={ds.viewOnly} />
                  </div>
                  <div
                    className="w-36 flex justify-end"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DatasetCTA
                      status={status}
                      viewOnly={ds.viewOnly}
                      onClick={() => onStart(step, ds.id)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const ChecklistEngine = ({
  sections,
  submittedIds = {},
  progressById = {},
  totalsById = {},
  datasetsByStepId = {},
  datasetStatusByStepId = {},
  onStart,
}: Props) => {
  return (
    <div className="flex flex-col">
      {sections.map((section) => (
        <section key={section.header} className="flex flex-col">
          <h2 className="text-xs font-semibold tracking-wider text-neutral-500 uppercase mt-8 mb-3">
            {section.header}
          </h2>
          <div className="flex flex-col">
            {section.steps.map((step) => (
              <StepCard
                key={step.id}
                step={step}
                submitted={!!submittedIds[step.id]}
                progress={progressById[step.id]}
                total={totalsById[step.id] ?? 0}
                datasets={datasetsByStepId[step.id] ?? []}
                datasetStatus={datasetStatusByStepId[step.id] ?? {}}
                onStart={onStart}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default ChecklistEngine;
