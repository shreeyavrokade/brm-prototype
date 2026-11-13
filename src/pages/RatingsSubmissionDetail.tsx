import { useEffect, useState } from "react";
import SubmissionShell from "@/components/submission/SubmissionShell";
import RatingsInspectorGrid from "@/components/topology/RatingsInspectorGrid";
import IssueFilterBar from "@/components/submission/IssueFilterBar";
import IssueResolutionPanel from "@/components/submission/IssueResolutionPanel";
import ValidationSummaryBanner from "@/components/submission/ValidationSummaryBanner";
import { ratingsIssues, type CellIssue, type IssueFilter } from "@/components/submission/validationIssues";
import { mockRatingsInspector } from "@/components/topology/mockRatingsInspector";
import { mockRatingsDirectory } from "@/components/topology/mockRatingsDirectory";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { deriveDatasetStatus, hasReviewableIssues } from "@/components/submission/datasetStatus";
import { setDatasetStatus } from "@/store/datasetStatusStore";
import { brand } from "@/config/brand";

const RatingsSubmissionDetail = () => {
  const { id = "" } = useParams();
  const row = mockRatingsDirectory.find((r) => r.id === id) ?? mockRatingsDirectory[0];

  const reviewMode = hasReviewableIssues(row.status);

  const [issues, setIssues] = useState<CellIssue[]>(reviewMode ? ratingsIssues : []);
  const [filter, setFilter] = useState<IssueFilter>("all");
  const [panelOpen, setPanelOpen] = useState(reviewMode);
  const [values, setValues] = useState<Record<string, Record<string, string>>>({});

  const errors = issues.filter((i) => i.severity === "error" && !i.dismissed).length;
  const warnings = issues.filter((i) => i.severity === "warning" && !i.dismissed).length;

  const status = deriveDatasetStatus(row.status, errors, warnings);

  useEffect(() => {
    setDatasetStatus(row.id, status);
  }, [row.id, status]);

  const clearIssue = (issueId: string) => {
    const remaining = issues.filter((i) => !i.dismissed && i.id !== issueId).length;
    setIssues((prev) => prev.filter((i) => i.id !== issueId));
    if (remaining === 0) {
      setPanelOpen(false);
      toast.success("All issues resolved!", {
        description: "Ratings dataset moved to Pending Submittal.",
      });
    }
  };

  const handleResolve = (issue: CellIssue, value: string) => {
    setValues((prev) => ({ ...prev, [issue.rowId]: { ...prev[issue.rowId], [issue.field]: value } }));
    clearIssue(issue.id);
  };

  const handleDismiss = (issueId: string, reason: string) => {
    setIssues((prev) =>
      prev.map((i) => (i.id === issueId ? { ...i, dismissed: true, dismissReason: reason || undefined } : i)),
    );
    toast.success("Warning dismissed", { description: reason || "No reason provided." });
    if (issues.filter((i) => !i.dismissed && i.id !== issueId).length === 0) {
      setPanelOpen(false);
      toast.success("All issues resolved!", { description: "Ratings dataset moved to Pending Submittal." });
    }
  };

  return (
    <SubmissionShell
      header={{
        backTo: "/?tab=ratings",
        submittalId: row.id,
        name: row.submissionName,
        subline: `Submission ID: ${row.submissionId}`,
        reviewStatus: status,
      }}
      validationWarnings={[]}
      blockingErrors={errors}
      hideIssuesToggle={!reviewMode}
      issuesOpen={panelOpen}
      onIssuesOpenChange={setPanelOpen}
      banner={
        <ValidationSummaryBanner
          status={status}
          errors={errors}
          warnings={warnings}
          datasetLabel="Ratings"
          onInspect={() => setPanelOpen(true)}
          onSubmit={() => toast.success("Submitted to " + brand.clientShortName + " Model Build")}
        />
      }
      sidePanel={
        !reviewMode ? undefined : (
        <IssueResolutionPanel
          sections={[{ key: "ratings", label: "Ratings", issues }]}
          activeSection="ratings"
          onDismiss={handleDismiss}
        />
        )
      }
      subTabs={[
        {
          key: "ratings",
          label: "Ratings",
          content: (
            <>
              {reviewMode && (
              <IssueFilterBar
                filter={filter}
                onChange={setFilter}
                total={mockRatingsInspector.length}
                errors={errors}
                warnings={warnings}
              />
              )}
              <RatingsInspectorGrid
                rows={mockRatingsInspector}
                issues={issues}
                filter={filter}
                values={values}
                onResolve={handleResolve}
                onIssueSelect={() => setPanelOpen(true)}
              />
            </>
          ),
        },
      ]}
    />
  );
};

export default RatingsSubmissionDetail;
