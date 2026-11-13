import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import DatasetGrid from "./DatasetGrid";
import ActivityDrawer from "./ActivityDrawer";
import { type SectionConfig } from "./genDatasets";
import { brand } from "@/config/brand";

interface Props {
  section: SectionConfig;
  initialDatasetId?: string;
  initialVerifiedIds?: string[];
  onCancel: () => void;
  onAdvanceSection: () => void;
  advanceLabel?: string;
  onProgressChange?: (sectionId: string, verifiedCount: number, total: number) => void;
  onDatasetVisited?: (sectionId: string, datasetId: string) => void;
  onDatasetVerified?: (sectionId: string, datasetId: string) => void;
}


const SectionWorkspace = ({
  section,
  initialDatasetId,
  initialVerifiedIds,
  onCancel,
  onAdvanceSection,
  advanceLabel = "Next →",
  onProgressChange,
  onDatasetVisited,
  onDatasetVerified,
}: Props) => {
  const firstDsId =
    initialDatasetId && section.datasets.some((d) => d.id === initialDatasetId)
      ? initialDatasetId
      : section.datasets[0].id;
  const [activeDsId, setActiveDsId] = useState(firstDsId);
  const [hasErrors, setHasErrors] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const [activityLabel, setActivityLabel] = useState<string | undefined>();

  // View-only datasets + upstream-verified ids count as auto-verified.
  const initialVerified = useMemo(() => {
    const s = new Set<string>();
    section.datasets.forEach((d) => {
      if (d.viewOnly) s.add(d.id);
    });
    (initialVerifiedIds ?? []).forEach((id) => s.add(id));
    return s;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section.id, (initialVerifiedIds ?? []).join(",")]);

  const [verifiedDs, setVerifiedDs] = useState<Set<string>>(initialVerified);

  // Reset when section changes
  useEffect(() => {
    setActiveDsId(firstDsId);
    
    setHasErrors(false);
    setVerifiedDs(initialVerified);
    // Mark initial dataset as visited upstream
    onDatasetVisited?.(section.id, firstDsId);
    // Mark view-only datasets as verified upstream
    section.datasets.forEach((d) => {
      if (d.viewOnly) onDatasetVerified?.(section.id, d.id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section.id, initialVerified]);

  // Report progress upward
  useEffect(() => {
    if (!onProgressChange) return;
    const nonView = section.datasets.filter((d) => !d.viewOnly);
    const verifiedNonView = nonView.filter((d) => verifiedDs.has(d.id)).length;
    onProgressChange(section.id, verifiedNonView, nonView.length);
  }, [verifiedDs, section.id, onProgressChange, section.datasets]);

  const activeIdx = section.datasets.findIndex((d) => d.id === activeDsId);
  const activeDs = section.datasets[activeIdx];

  const handleNext = () => {
    if (hasErrors) return;
    onAdvanceSection();
  };

  return (
    <div className="flex gap-6 pb-24">
      {/* Vertical sub-nav */}
      <aside className="w-60 shrink-0">
        <div className="bg-white border border-neutral-200 rounded-lg p-2 sticky top-4">
          <div className="text-xs font-medium text-neutral-400 px-2 py-1.5 mb-1">
            Datasets
          </div>
          {section.datasets.map((d) => {
            const isActive = activeDsId === d.id;
            return (
              <button
                key={d.id}
                onClick={() => {
                  setActiveDsId(d.id);
                  setHasErrors(false);
                  onDatasetVisited?.(section.id, d.id);
                }}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm rounded-md relative",
                  isActive
                    ? "bg-blue-50 text-neutral-900 font-medium border-l-2 border-blue-700 pl-[10px]"
                    : "text-neutral-700 hover:bg-neutral-50",
                )}
              >
                <span className="truncate block">{d.name}</span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Canvas */}
      <div className="flex-1 min-w-0 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-medium text-foreground">{activeDs.name}</h2>
          {activeDs.viewOnly && (
            <span className="text-[10px] uppercase tracking-wide bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded">
              View-Only
            </span>
          )}
        </div>

        <div className="bg-blue-50/60 border border-blue-100 rounded-lg p-4 flex gap-3 text-sm text-neutral-700">
          <Info className="text-blue-500 w-5 h-5 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="font-medium">Tip:</span>{" "}
            {activeDs.viewOnly
              ? "This section is complete and pending " + brand.clientShortName + " review. You have view-only access to these tables. Use the Activity Panel to review row-level comments."
              : activeDs.tip}
          </p>
        </div>


        <DatasetGrid
          key={activeDs.id}
          dataset={activeDs}
          onActivity={(label) => {
            setActivityLabel(label);
            setActivityOpen(true);
          }}
          onErrorsChange={setHasErrors}
          onVerified={() => {
            setVerifiedDs((prev) => {
              const next = new Set(prev);
              next.add(activeDs.id);
              return next;
            });
            onDatasetVerified?.(section.id, activeDs.id);
          }}
        />

        {hasErrors && (
          <div className="text-xs text-red-600">
            Fix validation errors above before advancing.
          </div>
        )}
      </div>

      <ActivityDrawer
        open={activityOpen}
        onOpenChange={setActivityOpen}
        rowLabel={activityLabel}
      />

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-atmo-10 text-atmo-0 py-3 px-6 flex items-center justify-between gap-4 z-20">
        <Button
          variant="ghost"
          className="text-atmo-0 hover:bg-atmo-9 hover:text-atmo-0"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          disabled={hasErrors}
          onClick={handleNext}
          className="bg-atmo-0 text-atmo-10 hover:bg-atmo-2"
        >
          {advanceLabel}
        </Button>
      </div>
    </div>
  );
};

export default SectionWorkspace;
