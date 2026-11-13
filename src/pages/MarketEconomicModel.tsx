import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { X } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/layout/AppSidebar";
import GlobalHeader from "@/components/layout/GlobalHeader";
import { Button } from "@/components/ui/button";

import ChecklistEngine from "@/components/mem/ChecklistEngine";
import SectionWorkspace from "@/components/mem/SectionWorkspace";
import {
  LOAD_CHECKLIST,
  GEN_CHECKLIST,
  type TrackKey,
  type ChecklistStep,
} from "@/components/mem/memChecklist";
import { GEN_SECTIONS } from "@/components/mem/genDatasets";
import { LOAD_SECTIONS } from "@/components/mem/loadDatasets";
import PassHandoffBanner from "@/components/mem/PassHandoffBanner";
import SppModificationsCard from "@/components/mem/SppModificationsCard";
import { usePassInfo } from "@/store/memPassStore";



const MarketEconomicModel = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const trackParam = searchParams.get("track");
  const openParam = searchParams.get("open");
  const [track, setTrack] = useState<TrackKey>(trackParam === "load" ? "load" : "gen");

  useEffect(() => {
    if (trackParam === "gen" || trackParam === "load") {
      if (trackParam !== track) {
        setTrack(trackParam);
        setFocusIdx(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackParam]);

  // null = checklist hub; number = index into datasetSections (focus mode)
  const [focusIdx, setFocusIdx] = useState<number | null>(null);
  const [focusDatasetId, setFocusDatasetId] = useState<string | undefined>();
  const [submittedGen, setSubmittedGen] = useState<Record<string, boolean>>({});
  const [submittedLoad, setSubmittedLoad] = useState<Record<string, boolean>>({});
  const [progressGen, setProgressGen] = useState<Record<string, { verified: number; total: number }>>({});
  const [progressLoad, setProgressLoad] = useState<Record<string, { verified: number; total: number }>>({});
  // Per-step per-dataset status: 'verified' | 'in-progress' | 'review-needed' | 'not-started'
  type DsStatusMap = Record<string, Record<string, "verified" | "in-progress" | "review-needed" | "not-started">>;
  const [dsStatusGen, setDsStatusGen] = useState<DsStatusMap>({});
  // Seed load track: Section 1 datasets are all view-only (auto-verified);
  // Section 2 has Annual Loss Factor verified and Annual Load Factor flagged for review.
  const [dsStatusLoad, setDsStatusLoad] = useState<DsStatusMap>({
    "load-s2": {
      "annual-loss-factor": "verified",
      "annual-load-factor": "review-needed",
    },
  });



  // A new pass (SPP closes and reopens the window) resets every module back to
  // "Review Needed".
  const { passNumber } = usePassInfo();
  useEffect(() => {
    setDsStatusGen({});
    setDsStatusLoad({});
    setSubmittedGen({});
    setSubmittedLoad({});
    setProgressGen({});
    setProgressLoad({});
  }, [passNumber]);

  const sections = track === "load" ? LOAD_CHECKLIST : GEN_CHECKLIST;
  const datasetSections = track === "load" ? LOAD_SECTIONS : GEN_SECTIONS;
  const submitted = track === "load" ? submittedLoad : submittedGen;
  const setSubmitted = track === "load" ? setSubmittedLoad : setSubmittedGen;
  const progress = track === "load" ? progressLoad : progressGen;
  const setProgress = track === "load" ? setProgressLoad : setProgressGen;
  const dsStatus = track === "load" ? dsStatusLoad : dsStatusGen;
  const setDsStatus = track === "load" ? setDsStatusLoad : setDsStatusGen;

  // Flatten checklist steps in display order to map step → dataset section.
  const flatSteps: ChecklistStep[] = sections.flatMap((s) => s.steps);

  // Auto-focus a dataset when `?open=<datasetId>` is supplied (from Load Review).
  useEffect(() => {
    if (!openParam) return;
    const idx = datasetSections.findIndex((sec) =>
      sec.datasets.some((d) => d.id === openParam),
    );
    if (idx >= 0) {
      setFocusIdx(idx);
      setFocusDatasetId(openParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openParam, track]);

  const title =
    track === "gen"
      ? "Market Economic Model — Generation"
      : "Market Economic Model — Load";

  const handleStart = (step: ChecklistStep, datasetId?: string) => {
    const idx = flatSteps.findIndex((s) => s.id === step.id);
    setFocusDatasetId(datasetId);
    setFocusIdx(Math.min(idx, datasetSections.length - 1));
  };

  const exitFocus = () => {
    setFocusIdx(null);
    setFocusDatasetId(undefined);
  };

  const handleAdvanceSection = () => {
    if (focusIdx == null) return;
    // Mark current step submitted (skip if it's a view-only reference step).
    const step = flatSteps[focusIdx];
    if (step && step.state !== "view-only") {
      setSubmitted((prev) => ({ ...prev, [step.id]: true }));
      setProgress((prev) => {
        const { [step.id]: _drop, ...rest } = prev;
        return rest;
      });
      // Mark every dataset in that step as verified.
      const sec = datasetSections[focusIdx];
      if (sec) {
        setDsStatus((prev) => {
          const next: DsStatusMap = { ...prev, [step.id]: { ...(prev[step.id] ?? {}) } };
          sec.datasets.forEach((d) => (next[step.id][d.id] = "verified"));
          return next;
        });
      }
    }
    const nextIdx = focusIdx + 1;
    if (nextIdx < datasetSections.length) {
      setFocusIdx(nextIdx);
      setFocusDatasetId(undefined);
    } else {
      exitFocus();
    }
  };

  const handleProgressChange = (sectionId: string, verified: number, total: number) => {
    setProgress((prev) => {
      const existing = prev[sectionId];
      if (existing && existing.verified === verified && existing.total === total) return prev;
      return { ...prev, [sectionId]: { verified, total } };
    });
  };

  // Opening (or viewing) a dataset marks its module Complete for this pass.
  const handleDatasetVisited = (sectionId: string, datasetId: string) => {
    setDsStatus((prev) => {
      if (prev[sectionId]?.[datasetId] === "verified") return prev;
      return {
        ...prev,
        [sectionId]: { ...(prev[sectionId] ?? {}), [datasetId]: "verified" },
      };
    });
  };

  const handleDatasetVerified = (sectionId: string, datasetId: string) => {
    setDsStatus((prev) => ({
      ...prev,
      [sectionId]: { ...(prev[sectionId] ?? {}), [datasetId]: "verified" },
    }));
  };

  // Build datasetsByStepId + status map for the checklist hub.
  const datasetsByStepId: Record<string, { id: string; name: string; viewOnly?: boolean }[]> = {};
  const datasetStatusByStepId: Record<string, Record<string, "verified" | "in-progress" | "review-needed" | "not-started">> = {};
  flatSteps.forEach((s, i) => {
    const sec = datasetSections[Math.min(i, datasetSections.length - 1)];
    if (!sec) return;
    datasetsByStepId[s.id] = sec.datasets.map((d) => ({
      id: d.id,
      name: d.name,
      viewOnly: d.viewOnly,
    }));
    const secStatus = dsStatus[s.id] ?? {};
    const submittedStep = submitted[s.id];
    datasetStatusByStepId[s.id] = Object.fromEntries(
      sec.datasets.map((d) => {
        if (d.viewOnly) return [d.id, "verified" as const];
        if (submittedStep) return [d.id, "verified" as const];
        return [d.id, secStatus[d.id] ?? ("review-needed" as const)];
      }),
    );
  });

  // FOCUS MODE — sidebar hidden, full-width takeover.
  if (focusIdx != null) {
    const section = datasetSections[focusIdx];
    const isLast = focusIdx === datasetSections.length - 1;
    const step = flatSteps[focusIdx];
    const checklistHeader =
      sections.find((s) => s.steps.some((st) => st.id === step?.id))?.header ??
      section.label;
    return (
      <div className="min-h-screen flex flex-col w-full bg-white">
        <GlobalHeader />
        <main className="flex-1 px-8 pt-6 overflow-auto">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <div className="text-xs text-neutral-500 mb-1">{title}</div>
              <h1 className="text-xl font-medium text-foreground">
                {checklistHeader}
              </h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Close focus mode"
              onClick={exitFocus}
              className="text-neutral-500 hover:bg-neutral-100"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <SectionWorkspace
            key={`${track}-${section.id}`}
            section={section}
            initialDatasetId={focusDatasetId}
            initialVerifiedIds={Object.entries(dsStatus[section.id] ?? {})
              .filter(([, v]) => v === "verified")
              .map(([k]) => k)}
            onCancel={exitFocus}
            onAdvanceSection={handleAdvanceSection}
            advanceLabel={isLast ? "Finish Review" : "Next →"}
            onProgressChange={handleProgressChange}
            onDatasetVisited={handleDatasetVisited}
            onDatasetVerified={handleDatasetVerified}
          />

        </main>
      </div>
    );
  }

  // CHECKLIST HUB — sidebar visible.
  return (
    <div className="h-screen flex flex-col w-full bg-atmo-1 overflow-hidden">
      <GlobalHeader />
      <SidebarProvider className="min-h-0 flex-1">
        <div className="flex flex-1 w-full min-h-0">
          <AppSidebar />
          <main className="flex-1 p-8 overflow-auto">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h1 className="text-2xl font-medium text-foreground">{title}</h1>
            </div>

            <PassHandoffBanner />
            <SppModificationsCard />

            <ChecklistEngine

              sections={sections}
              submittedIds={submitted}
              progressById={Object.fromEntries(
                flatSteps.map((s, i) => {
                  const sec = datasetSections[Math.min(i, datasetSections.length - 1)];
                  const editable = sec?.datasets.filter((d) => !d.viewOnly) ?? [];
                  const total = editable.length;
                  const secStatus = dsStatus[s.id] ?? {};
                  const derivedVerified = submitted[s.id]
                    ? total
                    : editable.filter((d) => secStatus[d.id] === "verified").length;
                  const live = progress[s.id];
                  return [s.id, live ?? { verified: derivedVerified, total }];
                }),
              )}
              totalsById={Object.fromEntries(
                flatSteps.map((s) => {
                  const idx = flatSteps.findIndex((x) => x.id === s.id);
                  const ds = datasetSections[Math.min(idx, datasetSections.length - 1)];
                  const total = ds?.datasets.filter((d) => !d.viewOnly).length ?? 0;
                  return [s.id, total];
                }),
              )}
              datasetsByStepId={datasetsByStepId}
              datasetStatusByStepId={datasetStatusByStepId}
              onStart={handleStart}
            />

          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default MarketEconomicModel;
