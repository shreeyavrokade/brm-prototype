import { useState, useCallback, useMemo } from "react";
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


const SubmissionDetail = () => {
  const navigate = useNavigate();
  const { id = "" } = useParams();
  const changesetRows = useChangesetRows();
  const row = changesetRows.find((r) => r.id === id);
  const baseStatus = row?.reviewStatus ?? "Review Needed";
  const reviewMode = hasReviewableIssues(baseStatus);

  const [issues, setIssues] = useState<Issue[]>(reviewMode ? initialIssues : []);
  const [activityItems, setActivityItems] = useState<ActivityItem[]>(initialActivity);
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
  const firstPhaseKey = useMemo(() => Object.keys(phasesData)[0], []);
  const currentPhaseMetadata = phasesData[firstPhaseKey]?.metadata;

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
      />


      <div className="flex-1 overflow-hidden">
        {inspectorFullscreen ? (
          <FileInspector
            phases={phasesData}
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
                phases={phasesData}
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
