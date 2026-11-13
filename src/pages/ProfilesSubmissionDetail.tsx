import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import SubmissionShell from "@/components/submission/SubmissionShell";
import ValidationSummaryBanner from "@/components/submission/ValidationSummaryBanner";
import { deriveDatasetStatus, hasReviewableIssues } from "@/components/submission/datasetStatus";
import { setDatasetStatus } from "@/store/datasetStatusStore";
import { getProjectById } from "@/components/topology/mockProfileSeries";
import ProfilesInspectorGrid from "@/components/topology/ProfilesInspectorGrid";
import IssueFilterBar from "@/components/submission/IssueFilterBar";
import IssueResolutionPanel from "@/components/submission/IssueResolutionPanel";
import { profilesIssues, type CellIssue, type IssueFilter } from "@/components/submission/validationIssues";
import {
  mockBusRows,
  mockGeneratorRows,
  mockLoadGenRows,
} from "@/components/topology/mockProfilesInspector";
import type { ProfilesInspectorRow } from "@/components/topology/mockProfilesInspector";
import { brand } from "@/config/brand";

const ProfilesSubmissionDetail = () => {
  const { id = "p4" } = useParams();
  const project = useMemo(() => getProjectById(id), [id]);

  const reviewMode = hasReviewableIssues(project.directoryStatus);

  const [issues, setIssues] = useState<CellIssue[]>(reviewMode ? profilesIssues : []);
  const [filter, setFilter] = useState<IssueFilter>("all");
  const [panelOpen, setPanelOpen] = useState(reviewMode);
  const [activeTab, setActiveTab] = useState("load-gen");
  const [values, setValues] = useState<Record<string, Record<string, string>>>({});

  const errors = issues.filter((i) => i.severity === "error" && !i.dismissed).length;
  const warnings = issues.filter((i) => i.severity === "warning" && !i.dismissed).length;

  const status = deriveDatasetStatus(project.directoryStatus, errors, warnings);

  useEffect(() => {
    setDatasetStatus(project.submittalId, status);
  }, [project.submittalId, status]);

  const announceIfClean = (remaining: number) => {
    if (remaining === 0) {
      setPanelOpen(false);
      toast.success("All issues resolved!", {
        description: "Profiles dataset moved to Pending Submittal.",
      });
    }
  };

  const handleResolve = (issue: CellIssue, value: string) => {
    setValues((prev) => ({ ...prev, [issue.rowId]: { ...prev[issue.rowId], [issue.field]: value } }));
    const remaining = issues.filter((i) => !i.dismissed && i.id !== issue.id).length;
    setIssues((prev) => prev.filter((i) => i.id !== issue.id));
    announceIfClean(remaining);
  };

  const handleDismiss = (issueId: string, reason: string) => {
    setIssues((prev) =>
      prev.map((i) => (i.id === issueId ? { ...i, dismissed: true, dismissReason: reason || undefined } : i)),
    );
    toast.success("Warning dismissed", { description: reason || "No reason provided." });
    announceIfClean(issues.filter((i) => !i.dismissed && i.id !== issueId).length);
  };

  const scopedIssues = (rows: ProfilesInspectorRow[]) => {
    const rowIds = new Set(rows.map((r) => r.id));
    return issues.filter((i) => rowIds.has(i.rowId));
  };

  const tabContent = (rows: ProfilesInspectorRow[]) => {
    const scoped = scopedIssues(rows);
    return (
      <>
        {reviewMode && (
        <IssueFilterBar
          filter={filter}
          onChange={setFilter}
          total={rows.length}
          errors={scoped.filter((i) => i.severity === "error" && !i.dismissed).length}
          warnings={scoped.filter((i) => i.severity === "warning" && !i.dismissed).length}
        />
        )}
        <ProfilesInspectorGrid
          rows={rows}
          issues={scoped}
          filter={filter}
          values={values}
          onResolve={handleResolve}
          onIssueSelect={() => setPanelOpen(true)}
        />
      </>
    );
  };

  return (
    <SubmissionShell
      header={{
        backTo: "/?tab=profiles",
        submittalId: project.submittalId,
        name: project.name,
        subline: `Submission ID: ${project.submittalId}`,
        reviewStatus: status,
        hideDocs: true,
      }}
      validationWarnings={[]}
      blockingErrors={errors}
      hideIssuesToggle={!reviewMode}
      issuesOpen={panelOpen}
      onIssuesOpenChange={setPanelOpen}
      onSubTabChange={setActiveTab}
      banner={
        <ValidationSummaryBanner
          status={status}
          errors={errors}
          warnings={warnings}
          datasetLabel="Profiles"
          onInspect={() => setPanelOpen(true)}
          onSubmit={() => toast.success("Submitted to " + brand.clientShortName + " Model Build")}
        />
      }
      sidePanel={
        !reviewMode ? undefined : (
        <IssueResolutionPanel
          sections={[
            { key: "load-gen", label: "Load Gen", issues: scopedIssues(mockLoadGenRows) },
            { key: "bus", label: "Bus", issues: scopedIssues(mockBusRows) },
            { key: "generator", label: "Generator", issues: scopedIssues(mockGeneratorRows) },
          ]}
          activeSection={activeTab}
          onDismiss={handleDismiss}
        />
        )
      }
      subTabsPrefix={<h2 className="text-sm font-semibold text-foreground whitespace-nowrap">File Inspector</h2>}
      subTabs={[
        { key: "load-gen", label: "Load Gen", content: tabContent(mockLoadGenRows) },
        { key: "bus", label: "Bus", content: tabContent(mockBusRows) },
        { key: "generator", label: "Generator", content: tabContent(mockGeneratorRows) },
      ]}
    />
  );
};

export default ProfilesSubmissionDetail;
