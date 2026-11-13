import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Clock } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "@/components/dashboard/Header";
import FileInspector from "@/components/dashboard/FileInspector";
import IssueSidebar from "@/components/dashboard/IssueSidebar";
import SupportingDocs from "@/components/dashboard/SupportingDocs";
import ActivitySheet from "@/components/shared/ActivitySheet";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { phases as phasesData, issues as initialIssues, supportingDocs as initialDocs, activityItems as initialActivity } from "@/components/dashboard/mockData";
import { Issue, ActivityItem, SupportingDoc, RecordType } from "@/components/dashboard/types";
import { hasReviewableIssues } from "@/components/submission/datasetStatus";
import { useChangesetRows } from "@/store/changesetStore";
import { setDatasetStatus, useDatasetStatus } from "@/store/datasetStatusStore";
import { markSubmittedAsIs, storeTopologyFile, useTopologySubmission } from "@/store/topologySubmissionStore";
import { countIssues, type ParsedPrj } from "@/lib/topologyPrj";
import ValidationSummaryBanner from "@/components/submission/ValidationSummaryBanner";
import ResubmitDialog from "@/components/submission/ResubmitDialog";
import AcceptResponsibilityDialog from "@/components/submission/AcceptResponsibilityDialog";
import { isDatasetStatus } from "@/components/submission/datasetStatus";
import { brand } from "@/config/brand";

const CURRENT_USER = "Eddie Lake";
const stamp = () =>
  new Date().toLocaleString("en-US", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });


const SubmissionDetail = () => {
  const navigate = useNavigate();
  const { id = "" } = useParams();
  const changesetRows = useChangesetRows();
  const row = changesetRows.find((r) => r.id === id);
  // Uploaded demo .prj file for this submission, if any (otherwise the seeded mock data).
  const sub = useTopologySubmission(id);
  const baseStatus = useDatasetStatus(id, row?.reviewStatus ?? "Review Needed");
  const reviewMode = hasReviewableIssues(baseStatus);
  const phasesSource = sub?.parsed.phases ?? phasesData;

  const [issues, setIssues] = useState<Issue[]>(reviewMode ? (sub?.parsed.issues ?? initialIssues) : []);
  const [activityItems, setActivityItems] = useState<ActivityItem[]>(
    sub
      ? [{ id: "A-up-1", type: "history", user: "System", message: `${sub.parsed.fileName} uploaded by ${CURRENT_USER}`, timestamp: stamp() }]
      : initialActivity,
  );
  const [resubmitOpen, setResubmitOpen] = useState(false);
  const [responsibilityOpen, setResponsibilityOpen] = useState(false);
  const [docs, setDocs] = useState<SupportingDoc[]>(initialDocs);
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const [hoveredCellKey, setHoveredCellKey] = useState<string | null>(null);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [showActivity, setShowActivity] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  const [inspectorFullscreen, setInspectorFullscreen] = useState(false);
  const [activeRecordType, setActiveRecordType] = useState<RecordType>("BUS");
  const [showIssuePanel, setShowIssuePanel] = useState(reviewMode);
  const [activePhase, setActivePhase] = useState<string>("__all__");

  // Error count across ALL phases for submit gate
  const errorCount = issues.filter((i) => i.status === "error" && !i.dismissed).length;
  const warningCount = issues.filter((i) => i.status !== "error" && !i.dismissed).length;

  // Use first phase metadata for header (could be enhanced to show active phase)
  const firstPhaseKey = useMemo(() => Object.keys(phasesSource)[0], [phasesSource]);
  const currentPhaseMetadata = phasesSource[firstPhaseKey]?.metadata;

  const addActivityEntry = useCallback((type: "comment" | "history", user: string, message: string) => {
    const now = new Date();
    const timestamp = now.toLocaleString("en-US", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
    setActivityItems((prev) => [
      ...prev,
      { id: `A${Date.now()}`, type, user, message, timestamp },
    ]);
  }, []);

  const handleDismiss = useCallback((id: string, reason: string) => {
    setIssues((prev) =>
      prev.map((i) => (i.id === id ? { ...i, dismissed: true, dismissReason: reason || undefined } : i))
    );
    const issue = issues.find((i) => i.id === id);
    if (issue) {
      const reasonText = reason ? ` — Reason: "${reason}"` : "";
      addActivityEntry("history", "System", `Warning dismissed for "${issue.fieldName}" by J. Smith${reasonText}`);
    }
  }, [issues, addActivityEntry]);

  const handleAddComment = useCallback((message: string) => {
    addActivityEntry("comment", "J. Smith", message);
  }, [addActivityEntry]);

  const handleReplaceDoc = useCallback((docId: string) => {
    const doc = docs.find((d) => d.id === docId);
    setDocs((prev) => prev.map((d) => (d.id === docId ? { ...d, uploadedAt: "just now" } : d)));
    if (doc) {
      addActivityEntry("history", "System", `Document "${doc.name}" replaced by J. Smith`);
    }
  }, [docs, addActivityEntry]);

  const handleSelectRow = useCallback((rowId: string | null) => {
    setSelectedRowId(rowId);
    // Auto-show issue panel when selecting a row
    if (rowId && !showIssuePanel) setShowIssuePanel(true);
  }, [showIssuePanel]);

  const handleSelectIssue = useCallback((rowId: string | null) => {
    setSelectedRowId(rowId);
  }, []);

  const handleHoverIssue = useCallback((rowId: string | null, cellKey: string | null) => {
    setHoveredRowId(rowId);
    setHoveredCellKey(cellKey);
  }, []);

  // ---- Demo intake lifecycle for uploaded .prj files ----
  // Reload issues whenever a new version is validated or review mode changes.
  const revision = sub?.revision;
  const validating = sub?.validating ?? false;
  useEffect(() => {
    if (!sub) return;
    setIssues(reviewMode && !validating ? sub.parsed.issues : []);
    if (reviewMode && !validating) setShowIssuePanel(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revision, validating, reviewMode]);

  // Log each completed validation once.
  const loggedRevision = useRef<number | undefined>(sub && !sub.validating ? sub.revision : undefined);
  useEffect(() => {
    if (!sub || sub.validating || loggedRevision.current === sub.revision) return;
    loggedRevision.current = sub.revision;
    const c = countIssues(sub.parsed.issues);
    addActivityEntry("history", "System", `Validation completed for version ${sub.parsed.version}: ${c.errors} errors, ${c.warnings} warnings found`);
  }, [sub, addActivityEntry]);

  // Dismissing the last warning (with no errors left) moves the dataset on.
  useEffect(() => {
    if (!sub || validating || baseStatus !== "Review Needed") return;
    if (errorCount === 0 && warningCount === 0 && issues.length > 0) {
      setDatasetStatus(id, "Pending Submittal");
      addActivityEntry("history", "System", "All issues resolved — status changed to Pending Submittal");
      toast.success("All issues resolved — ready to submit for review.");
    }
  }, [sub, validating, baseStatus, errorCount, warningCount, issues.length, id, addActivityEntry]);

  const handleResubmit = useCallback(
    (parsed: ParsedPrj) => {
      setResubmitOpen(false);
      addActivityEntry("history", "System", `Version ${parsed.version} (${parsed.fileName}) uploaded by ${CURRENT_USER} — re-validation started`);
      storeTopologyFile(id, parsed, {
        validate: true,
        pendingStatus: "Pending Validation",
        onDone: (p) => {
          const c = countIssues(p.issues);
          if (c.errors > 0) {
            toast.error(`Re-validation failed: ${c.errors} required fix${c.errors !== 1 ? "es" : ""} remain. Correct them and upload version ${p.version + 1}.`);
          } else if (c.warnings > 0) {
            toast.warning(`Required fixes resolved. ${c.warnings} optional fix${c.warnings !== 1 ? "es" : ""} left — correct them in version ${p.version + 1}, or submit as-is and accept responsibility.`);
          } else {
            toast.success("Re-validation passed — no required or optional fixes. Ready to submit for review.");
          }
        },
      });
      toast.info(`Version ${parsed.version} received — re-validating (simulated).`);
    },
    [id, addActivityEntry],
  );

  const openWarnings = useMemo(() => issues.filter((i) => i.status === "warning" && !i.dismissed), [issues]);

  const handleSubmitForReview = useCallback(() => {
    setDatasetStatus(id, "Pending Acceptance");
    addActivityEntry("history", "System", `Submitted for ${brand.clientShortName} review by ${CURRENT_USER}`);
    toast.success(`Submitted to ${brand.clientShortName} for review. Status: Pending Acceptance.`);
  }, [id, addActivityEntry]);

  /** Submit button: with open optional fixes, ask the submitter to accept responsibility first. */
  const handleSubmitClick = useCallback(() => {
    if (sub && openWarnings.length > 0) setResponsibilityOpen(true);
    else handleSubmitForReview();
  }, [sub, openWarnings.length, handleSubmitForReview]);

  const handleConfirmAsIs = useCallback(() => {
    const n = openWarnings.length;
    setResponsibilityOpen(false);
    markSubmittedAsIs(id, n);
    setDatasetStatus(id, "Pending Acceptance");
    addActivityEntry(
      "history",
      "System",
      `Submitted as-is by ${CURRENT_USER} with ${n} optional fix${n !== 1 ? "es" : ""} open — submitter accepted responsibility for: ${openWarnings
        .map((w) => `${w.rowId.replace(/^[A-Z]+-/, "")} ${w.fieldName}`)
        .join(", ")}`,
    );
    toast.success(`Submitted to ${brand.clientShortName} with ${n} accepted optional fix${n !== 1 ? "es" : ""}. Status: Pending Acceptance.`);
  }, [id, openWarnings, addActivityEntry]);

  const handleDownloadCurrent = useCallback(() => {
    if (!sub) return toast.info("The original file isn't available in this preview.");
    const url = URL.createObjectURL(new Blob([sub.parsed.rawText], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = sub.parsed.fileName;
    a.click();
    URL.revokeObjectURL(url);
  }, [sub]);

  const submitDisabledReason = validating
    ? "Validation in progress…"
    : baseStatus === "Pending Acceptance" || baseStatus === "Accepted"
      ? "Already submitted for review."
      : sub && errorCount > 0
        ? `Resolve ${errorCount} required fix${errorCount !== 1 ? "es" : ""} by uploading a corrected version.`
        : undefined;

  const bannerStatus = baseStatus === "Validation in Progress" ? "Pending Validation" : baseStatus;
  const nextVersion = (sub?.parsed.version ?? 1) + 1;
  const reviewHint =
    errorCount > 0
      ? `Required fixes can't be accepted — correct them in your source data and upload version ${nextVersion}. Optional fixes can be corrected at the same time or accepted later.`
      : `Correct them in version ${nextVersion}, or submit as-is and accept responsibility for the flagged data.`;
  const accepted = sub?.acceptedWarnings ?? 0;

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <Header
        errorCount={errorCount}
        title={row?.projectName}
        submittalId={row?.id}
        reviewStatus={baseStatus}
        phaseMetadata={currentPhaseMetadata}
        onToggleActivity={() => setShowActivity(true)}
        onToggleDocs={() => setShowDocs(true)}
        onBack={() => navigate("/")}
        onUploadNewVersion={() => setResubmitOpen(true)}
        onSubmit={handleSubmitClick}
        onDownloadCurrent={handleDownloadCurrent}
        submitDisabledReason={submitDisabledReason}
      />

      {sub && (
        <div className="px-6 pt-4 shrink-0">
          {baseStatus === "Pending Acceptance" ? (
            <div role="status" className="rounded-xl p-4 mb-4 flex items-center gap-3 border bg-[#FCF2D9] border-[#FFBE2E]">
              <Clock className="h-5 w-5 text-[#6D4D09] shrink-0" />
              <div>
                <p className="text-sm font-bold text-[#222222]">Pending Acceptance</p>
                <p className="text-xs text-[#6C6B6B] mt-0.5">
                  Submitted to {brand.clientShortName}
                  {accepted > 0
                    ? ` with ${accepted} optional fix${accepted !== 1 ? "es" : ""} accepted as-is (submitter accepted responsibility)`
                    : ""}
                  . You'll see acceptance or a return note here.
                </p>
              </div>
            </div>
          ) : (
            isDatasetStatus(bannerStatus) && (
              <ValidationSummaryBanner
                status={bannerStatus}
                errors={errorCount}
                warnings={warningCount}
                datasetLabel="Topology changeset"
                reviewHint={reviewHint}
                onInspect={() => setShowIssuePanel(true)}
                onSubmit={handleSubmitForReview}
                onUploadNewVersion={() => setResubmitOpen(true)}
                onSubmitAsIs={() => setResponsibilityOpen(true)}
              />
            )
          )}
        </div>
      )}


      <div className="flex-1 overflow-hidden">
        {inspectorFullscreen ? (
          <FileInspector
            phases={phasesSource}
            activeRecordType={activeRecordType}
            onRecordTypeChange={setActiveRecordType}
            activePhase={activePhase}
            onPhaseChange={setActivePhase}
            hoveredRowId={hoveredRowId}
            hoveredCellKey={hoveredCellKey}
            selectedRowId={selectedRowId}
            onSelectRow={handleSelectRow}
            isFullscreen
            onToggleFullscreen={() => setInspectorFullscreen(false)}
            showIssuePanel={showIssuePanel}
            hideIssuePanelToggle={!reviewMode}
            suppressIssues={!reviewMode}
            onToggleIssuePanel={() => setShowIssuePanel((v) => !v)}
          />
        ) : (
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={showIssuePanel ? 70 : 100} minSize={40}>
              <FileInspector
                phases={phasesSource}
                activeRecordType={activeRecordType}
                onRecordTypeChange={setActiveRecordType}
                activePhase={activePhase}
                onPhaseChange={setActivePhase}
                hoveredRowId={hoveredRowId}
                hoveredCellKey={hoveredCellKey}
                selectedRowId={selectedRowId}
                onSelectRow={handleSelectRow}
                isFullscreen={false}
                onToggleFullscreen={() => setInspectorFullscreen(true)}
                showIssuePanel={showIssuePanel}
                hideIssuePanelToggle={!reviewMode}
                suppressIssues={!reviewMode}
                onToggleIssuePanel={() => setShowIssuePanel((v) => !v)}
              />
            </ResizablePanel>

            {showIssuePanel && reviewMode && (
              <>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
                  <IssueSidebar
                    issues={issues}
                    activeRecordType={activeRecordType}
                    selectedRowId={selectedRowId}
                    onDismiss={handleDismiss}
                    onHoverIssue={handleHoverIssue}
                    onSelectIssue={handleSelectIssue}
                  />
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        )}
      </div>

      <Sheet open={showDocs} onOpenChange={setShowDocs}>
        <SheetContent side="right" className="w-[420px] sm:max-w-[420px] flex flex-col p-0">
          <SheetHeader className="px-4 py-3 border-b">
            <SheetTitle className="text-sm">Supporting Documents</SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              Supplemental files attached to this submission.
            </SheetDescription>
          </SheetHeader>
          <SupportingDocs docs={docs} onReplace={handleReplaceDoc} />
        </SheetContent>
      </Sheet>

      {responsibilityOpen && (
        <AcceptResponsibilityDialog
          open={responsibilityOpen}
          onOpenChange={setResponsibilityOpen}
          projectName={sub?.parsed.projectName ?? row?.projectName ?? id}
          version={sub?.parsed.version ?? 1}
          warnings={openWarnings}
          onConfirm={handleConfirmAsIs}
          onUploadCorrected={() => {
            setResponsibilityOpen(false);
            setResubmitOpen(true);
          }}
        />
      )}

      {resubmitOpen && (
        <ResubmitDialog
          open={resubmitOpen}
          onOpenChange={setResubmitOpen}
          projectName={sub?.parsed.projectName ?? row?.projectName ?? id}
          currentVersion={sub?.parsed.version ?? 1}
          openErrors={errorCount}
          openWarnings={warningCount}
          onResubmit={handleResubmit}
          onDownloadCurrent={handleDownloadCurrent}
        />
      )}

      <ActivitySheet
        open={showActivity}
        onOpenChange={setShowActivity}
        items={activityItems}
        onAddComment={handleAddComment}
      />
    </div>
  );
};

export default SubmissionDetail;
