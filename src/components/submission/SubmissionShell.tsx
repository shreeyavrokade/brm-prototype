import { ReactNode, useRef, useState } from "react";
import { toast } from "sonner";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import ActivitySheet from "@/components/shared/ActivitySheet";
import SupportingDocs from "@/components/dashboard/SupportingDocs";
import { activityItems as initialActivity, supportingDocs as initialDocs } from "@/components/dashboard/mockData";
import type { ActivityItem, SupportingDoc } from "@/components/dashboard/types";
import SubmissionHeader, { SubmissionHeaderProps } from "./SubmissionHeader";
import ValidationLog from "./ValidationLog";
import type { ValidationWarning } from "./mockLogs";
import { SubmissionIssueProvider } from "./SubmissionIssueContext";

export interface SubTab {
  key: string;
  label: ReactNode;
  content: ReactNode;
}

interface Props {
  header: Omit<SubmissionHeaderProps, "errorCount" | "onToggleActivity" | "onToggleDocs" | "onUploadUpdated">;
  subTabs: SubTab[];
  validationWarnings?: ValidationWarning[];
  utilityBar?: ReactNode;
  subTabsPrefix?: ReactNode;
  banner?: ReactNode;
  blockingErrors?: number;
  /** replaces the default validation-log rail with a custom issue resolution panel */
  sidePanel?: ReactNode;
  /** controlled visibility for the right rail */
  issuesOpen?: boolean;
  onIssuesOpenChange?: (open: boolean) => void;
  /** hides the right-rail toggle entirely (datasets not in Review Needed) */
  hideIssuesToggle?: boolean;
  onSubTabChange?: (key: string) => void;
}


const SubmissionShell = ({
  header,
  subTabs,
  validationWarnings = [],
  utilityBar,
  subTabsPrefix,
  banner,
  blockingErrors = 0,
  sidePanel,
  issuesOpen,
  onIssuesOpenChange,
  hideIssuesToggle = false,
  onSubTabChange,
}: Props) => {

  const [showActivity, setShowActivity] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  const [activity, setActivity] = useState<ActivityItem[]>(initialActivity);
  const [docs, setDocs] = useState<SupportingDoc[]>(initialDocs);
  const [active, setActive] = useState(subTabs[0]?.key ?? "");
  const [internalShowIssues, setInternalShowIssues] = useState(true);
  const showIssues = issuesOpen ?? internalShowIssues;
  const setShowIssues = (v: boolean) => {
    if (onIssuesOpenChange) onIssuesOpenChange(v);
    else setInternalShowIssues(v);
  };
  const fileRef = useRef<HTMLInputElement>(null);

  const errorCount = validationWarnings.filter((w) => w.severity === "error").length + blockingErrors;
  const warningCount = validationWarnings.filter((w) => w.severity === "warning").length;
  const issueCount = validationWarnings.length;

  const addActivity = (type: "comment" | "history", user: string, message: string) => {
    const ts = new Date().toLocaleString("en-US", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
    setActivity((p) => [...p, { id: `A${Date.now()}`, type, user, message, timestamp: ts }]);
  };

  const onUploadUpdated = () => fileRef.current?.click();
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    addActivity("history", "System", `Updated file "${f.name}" uploaded — draft overwritten.`);
    toast.success("Updated file received", { description: `${f.name} replaced the prior draft. Re-parsing...` });
    e.target.value = "";
  };

  const onSubmit = () => {
    if (errorCount > 0) return;
    addActivity("history", "System", "Submission sent for review — AI validation queued.");
    toast.success("Submitted for review", { description: "AI Validation queued." });
  };

  const showIssuesButton = (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setShowIssues(!showIssues)}
      className="h-9 gap-1.5 text-xs rounded-full shrink-0"
    >
      {showIssues ? <PanelRightClose className="h-3.5 w-3.5" /> : <PanelRightOpen className="h-3.5 w-3.5" />}
      {showIssues ? "Hide Issues" : "Show Issues"}
      {!showIssues && issueCount > 0 && (
        <Badge className="ml-1 h-4 px-1.5 text-[10px] bg-[#FBF2D8] text-[#5C4A12] border-0 hover:bg-[#FBF2D8]">
          {issueCount}
        </Badge>
      )}
    </Button>
  );

  const mainContent = (
    <div className="h-full overflow-auto px-6 py-4">
      {banner}
      {utilityBar && (

        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex-1 min-w-0">{utilityBar}</div>
        </div>
      )}

      <Tabs
        value={active}
        onValueChange={(k) => {
          setActive(k);
          onSubTabChange?.(k);
        }}
        className="w-full"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            {subTabsPrefix}
            {subTabs.length > 1 && (
              <TabsList className="bg-transparent border-0 p-0 h-9 gap-1">
                {subTabs.map((t) => (
                  <TabsTrigger
                    key={t.key}
                    value={t.key}
                    className="text-xs px-4 h-9 rounded-full border border-transparent data-[state=active]:bg-atmo-0 data-[state=active]:text-foreground data-[state=active]:border-atmo-4 data-[state=active]:shadow-sm text-atmo-9"
                  >
                    {t.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            )}
          </div>
          {!hideIssuesToggle && showIssuesButton}
        </div>
        {subTabs.map((t) => (
          <TabsContent key={t.key} value={t.key} className="mt-4">
            {t.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );



  const issuesRail = (
    <aside className="flex flex-col h-full bg-atmo-2 border-l">
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b bg-atmo-2">
        <h2 className="text-xs font-semibold">Issue Resolution</h2>
        <div className="flex items-center gap-1.5 text-[10px]">
          {errorCount > 0 && (
            <Badge variant="destructive" className="h-4 px-1.5 text-[10px]">{errorCount} error{errorCount !== 1 ? "s" : ""}</Badge>
          )}
          {warningCount > 0 && (
            <Badge className="h-4 px-1.5 text-[10px] bg-[#FBF2D8] text-[#5C4A12] border-0 hover:bg-[#FBF2D8]">
              {warningCount} warning{warningCount !== 1 ? "s" : ""}
            </Badge>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-auto p-3">
        {issueCount === 0 ? (
          <p className="text-xs text-atmo-8 text-center mt-8">No engineering anomalies detected.</p>
        ) : (
          <ValidationLog warnings={validationWarnings} />
        )}
      </div>
    </aside>
  );

  return (
    <SubmissionIssueProvider>
      <div className="flex flex-col h-screen bg-background overflow-hidden">
        <SubmissionHeader
          {...header}
          errorCount={errorCount}
          onToggleActivity={() => setShowActivity(true)}
          onToggleDocs={() => setShowDocs(true)}
          onUploadUpdated={onUploadUpdated}
          onSubmit={onSubmit}
        />
        <input ref={fileRef} type="file" className="hidden" onChange={handleFile} />

        <div className="flex-1 overflow-hidden">
          {showIssues && !hideIssuesToggle ? (
            <ResizablePanelGroup direction="horizontal" className="h-full">
              <ResizablePanel defaultSize={70} minSize={40}>
                {mainContent}
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
                {sidePanel ?? issuesRail}
              </ResizablePanel>
            </ResizablePanelGroup>
          ) : (
            mainContent
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
            <SupportingDocs docs={docs} onReplace={(id) => {
              const d = docs.find((x) => x.id === id);
              setDocs((p) => p.map((x) => x.id === id ? { ...x, uploadedAt: "just now" } : x));
              if (d) addActivity("history", "System", `Document "${d.name}" replaced.`);
            }} />
          </SheetContent>
        </Sheet>

        <ActivitySheet
          open={showActivity}
          onOpenChange={setShowActivity}
          items={activity}
          onAddComment={(m) => addActivity("comment", "J. Smith", m)}
        />
      </div>
    </SubmissionIssueProvider>
  );
};

export default SubmissionShell;
