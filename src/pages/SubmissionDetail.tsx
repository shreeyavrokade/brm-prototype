import { useState, useCallback, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { CheckCircle2, Clock, MessageSquare, Undo2, UploadCloud, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import {
  AUTO_ACCEPT_ON_SUBMIT,
  DEMO_SUBMITTER,
  acceptSubmission,
  addSubmissionActivity,
  returnSubmission,
  submitForReview,
  storeTopologyFile,
  useTopologySubmission,
} from "@/store/topologySubmissionStore";
import { setPortalView, usePortalView } from "@/store/portalContextStore";
import { ReturnSubmissionModal } from "@/components/spp/ReturnSubmissionModal";
import { countIssues, type ParsedPrj } from "@/lib/topologyPrj";
import ValidationSummaryBanner from "@/components/submission/ValidationSummaryBanner";
import ResubmitDialog from "@/components/submission/ResubmitDialog";
import SubmitWithWarningsDialog from "@/components/submission/SubmitWithWarningsDialog";
import { isDatasetStatus } from "@/components/submission/datasetStatus";
import { brand } from "@/config/brand";
import { VALIDATION_FEEDBACK } from "@/config/ui";
import NextNotification from "@/components/ui/next-notification";

const CURRENT_USER = DEMO_SUBMITTER;
const ENGINEER = `${brand.clientShortName} Engineer (M. Torres)`;
/** Reviewer named in the trail when the demo auto-accepts a submission. */
const AUTO_REVIEWER = `${brand.clientShortName} Engineering`;
const onAutoAccepted = () => toast.success(`Accepted by ${AUTO_REVIEWER} for the model build.`);


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
  // Uploaded files keep a shared, traceable activity trail in the store; seeded rows use mock activity.
  const [localActivity, setLocalActivity] = useState<ActivityItem[]>(initialActivity);
  const activityItems = sub ? sub.activity : localActivity;
  const [resubmitOpen, setResubmitOpen] = useState(false);
  const [warningsDialogOpen, setWarningsDialogOpen] = useState(false);
  const [returnOpen, setReturnOpen] = useState(false);
  const portalView = usePortalView();
  const isEngineer = portalView === "SPP_ENGINEER";
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

  const hasSub = !!sub;
  const addActivityEntry = useCallback((type: "comment" | "history", user: string, message: string) => {
    if (hasSub) return addSubmissionActivity(id, type, user, message);
    const timestamp = new Date().toLocaleString("en-US", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
    setLocalActivity((prev) => [...prev, { id: `A${Date.now()}`, type, user, message, timestamp }]);
  }, [hasSub, id]);

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
    [id],
  );

  const openWarnings = useMemo(() => issues.filter((i) => i.status === "warning" && !i.dismissed), [issues]);

  const handleSubmitForReview = useCallback(() => {
    addActivityEntry("history", "System", `Submitted for ${brand.clientShortName} review by ${CURRENT_USER}`);
    submitForReview(id, 0, { reviewer: AUTO_REVIEWER, onAccepted: onAutoAccepted });
    toast.success(`Submitted to ${brand.clientShortName} for review. Status: Pending Acceptance.`);
  }, [id, addActivityEntry]);

  /** Submit button: with open optional fixes, ask the submitter to accept responsibility first. */
  const handleSubmitClick = useCallback(() => {
    if (sub && openWarnings.length > 0) setWarningsDialogOpen(true);
    else handleSubmitForReview();
  }, [sub, openWarnings.length, handleSubmitForReview]);

  const handleConfirmAsIs = useCallback(() => {
    const n = openWarnings.length;
    setWarningsDialogOpen(false);
    addActivityEntry(
      "history",
      "System",
      `Submitted for ${brand.clientShortName} review by ${CURRENT_USER} with ${n} unresolved warning${n !== 1 ? "s" : ""} — submitter accepted responsibility for: ${openWarnings
        .map((w) => `${w.rowId.replace(/^[A-Z]+-/, "")} ${w.fieldName}`)
        .join(", ")}`,
    );
    submitForReview(id, n, { reviewer: AUTO_REVIEWER, onAccepted: onAutoAccepted });
    toast.success(`Submitted to ${brand.clientShortName} with ${n} unresolved warning${n !== 1 ? "s" : ""}. Status: Pending Acceptance.`);
  }, [id, openWarnings, addActivityEntry]);

  // ---- Engineer review (demo: same page, engineer perspective) ----
  const handleReturn = useCallback((notes: string) => {
    setReturnOpen(false);
    returnSubmission(id, notes, ENGINEER);
    toast.success("Returned to the submitter — status changed to Review Needed.");
  }, [id]);

  const handleAccept = useCallback(() => {
    acceptSubmission(id, ENGINEER);
    toast.success("Submission accepted for the model build.");
  }, [id]);

  const activeReturn = sub?.returnNote && sub.returnNote.revision === sub.revision && baseStatus === "Review Needed" ? sub.returnNote : undefined;

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

      {sub && VALIDATION_FEEDBACK === "toast" && activeReturn && (
        <div className="px-6 pt-4 shrink-0">
          <NextNotification
            status="error"
            title={`Returned by ${brand.clientShortName} Engineering:`}
            actions={[{ label: "View Comments", onClick: () => setShowActivity(true) }]}
          >
            &ldquo;{activeReturn.note}&rdquo; Correct the file and upload version {nextVersion}.
          </NextNotification>
        </div>
      )}

      {sub && (baseStatus === "Pending Acceptance" && isEngineer && !AUTO_ACCEPT_ON_SUBMIT || VALIDATION_FEEDBACK === "banner") && (
        <div className="px-6 pt-4 shrink-0">
          {baseStatus === "Pending Acceptance" && isEngineer && !AUTO_ACCEPT_ON_SUBMIT && (
            <div className="rounded-xl p-4 mb-4 border bg-white border-[#5B78BE] shadow-sm space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <UserCog className="h-5 w-5 text-[#2064B4] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-[#222222]">{brand.clientShortName} engineering review</p>
                    <p className="text-xs text-[#6C6B6B] mt-0.5">
                      Version {sub.parsed.version} submitted by {CURRENT_USER}.{" "}
                      {accepted > 0
                        ? `Submitted with ${accepted} unresolved warning${accepted !== 1 ? "s" : ""} — the submitter accepted responsibility.`
                        : "No open warnings."}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => setReturnOpen(true)} className="rounded-full gap-1.5 border-[#C82333] text-[#C82333] hover:bg-[#FBE5E8] hover:text-[#C82333]">
                    <Undo2 className="h-3.5 w-3.5" /> Return to Submitter
                  </Button>
                  <Button size="sm" onClick={handleAccept} className="rounded-full gap-1.5 bg-[#146C2E] hover:bg-[#0F4F22] text-white">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Accept
                  </Button>
                </div>
              </div>
              {accepted > 0 && (
                <ul className="rounded-md border border-[#FFBE2E] bg-[#FCF2D9] divide-y divide-[#F6E2B6] text-xs">
                  {sub.parsed.issues.filter((i) => i.status === "warning").map((w) => (
                    <li key={w.id} className="px-3 py-1.5">
                      <span className="font-mono font-semibold text-[#6D4D09]">{w.rowId.replace(/^[A-Z]+-/, "")} · {w.fieldName}</span>{" "}
                      <span className="text-[#4D4D4D]">{w.message}</span>
                    </li>
                  ))}
                </ul>
              )}
              <button type="button" onClick={() => setPortalView("STAKEHOLDER")} className="text-xs text-[#2064B4] underline underline-offset-2">
                Demo: back to participant view
              </button>
            </div>
          )}

          {VALIDATION_FEEDBACK === "banner" && baseStatus === "Pending Acceptance" && (!isEngineer || AUTO_ACCEPT_ON_SUBMIT) && (
            <div role="status" className="rounded-xl p-4 mb-4 flex flex-wrap items-center justify-between gap-3 border bg-[#FCF2D9] border-[#FFBE2E]">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-[#6D4D09] shrink-0" />
                <div>
                  <p className="text-sm font-bold text-[#222222]">Pending Acceptance</p>
                  <p className="text-xs text-[#6C6B6B] mt-0.5">
                    Submitted to {brand.clientShortName}
                    {accepted > 0
                      ? ` with ${accepted} unresolved warning${accepted !== 1 ? "s" : ""} (you accepted responsibility)`
                      : ""}
                    .{" "}
                    {AUTO_ACCEPT_ON_SUBMIT
                      ? `${brand.clientShortName} Engineering is reviewing it.`
                      : `${brand.clientShortName} Engineers may accept it or return it with comments.`}
                  </p>
                </div>
              </div>
              {!AUTO_ACCEPT_ON_SUBMIT && (
                <button type="button" onClick={() => setPortalView("SPP_ENGINEER")} className="text-xs font-medium text-[#2064B4] underline underline-offset-2">
                  Demo: review as {brand.clientShortName} engineer
                </button>
              )}
            </div>
          )}

          {VALIDATION_FEEDBACK === "banner" && activeReturn && (
            <div role="alert" className="rounded-xl p-4 mb-4 border bg-[#FBE5E8] border-[#C82333] flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <Undo2 className="h-5 w-5 text-[#C82333] shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#222222]">Returned by {brand.clientShortName} Engineering</p>
                  <p className="text-sm text-[#4D4D4D] mt-1">&ldquo;{activeReturn.note}&rdquo;</p>
                  <p className="text-xs text-[#6C6B6B] mt-1">
                    {activeReturn.by} · {activeReturn.at}. Review the comments, correct the file and upload version {nextVersion}.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowActivity(true)} className="rounded-full gap-1.5 bg-white">
                  <MessageSquare className="h-3.5 w-3.5" /> View Comments
                </Button>
                <Button size="sm" onClick={() => setResubmitOpen(true)} className="rounded-full gap-1.5 bg-[#222222] hover:bg-[#4D4D4D] text-white">
                  <UploadCloud className="h-3.5 w-3.5" /> Upload Corrected Version
                </Button>
              </div>
            </div>
          )}

          {VALIDATION_FEEDBACK === "banner" &&
            baseStatus !== "Pending Acceptance" &&
            isDatasetStatus(bannerStatus) &&
            !(activeReturn && errorCount + warningCount === 0) && (
              <ValidationSummaryBanner
                status={bannerStatus}
                errors={errorCount}
                warnings={warningCount}
                datasetLabel="Topology changeset"
                reviewHint={reviewHint}
                acceptedWarnings={accepted}
                onInspect={() => setShowIssuePanel(true)}
                onSubmit={handleSubmitForReview}
                onUploadNewVersion={() => setResubmitOpen(true)}
                onSubmitAsIs={() => setWarningsDialogOpen(true)}
              />
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

      <SubmitWithWarningsDialog
        open={warningsDialogOpen}
        onOpenChange={setWarningsDialogOpen}
        warningCount={openWarnings.length}
        onConfirm={handleConfirmAsIs}
      />

      <ReturnSubmissionModal
        open={returnOpen}
        onOpenChange={setReturnOpen}
        subject={`${sub?.parsed.fileName ?? row?.projectName ?? id} — version ${sub?.parsed.version ?? 1}`}
        onConfirm={handleReturn}
      />

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
