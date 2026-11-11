import { useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, FileText, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import TransactionLedgerGrid from "@/components/topology/TransactionLedgerGrid";
import { StatusBadge } from "@/components/topology/statusStyles";
import { mockTransactions } from "@/components/topology/mockTransactions";
import SupportingDocs from "@/components/dashboard/SupportingDocs";
import ActivitySheet from "@/components/shared/ActivitySheet";
import { supportingDocs as initialDocs, activityItems as initialActivity } from "@/components/dashboard/mockData";
import { ActivityItem, SupportingDoc } from "@/components/dashboard/types";

const TransactionDetail = () => {
  const navigate = useNavigate();
  const { id: rawId } = useParams();
  const id = rawId ? decodeURIComponent(rawId) : "";
  const tx = mockTransactions.find((t) => t.id === id);

  const [showActivity, setShowActivity] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  const [docs, setDocs] = useState<SupportingDoc[]>(initialDocs);
  const [activityItems, setActivityItems] = useState<ActivityItem[]>(initialActivity);

  const handleAddComment = useCallback((message: string) => {
    const now = new Date();
    const timestamp = now.toLocaleString("en-US", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
    setActivityItems((prev) => [...prev, { id: `A${Date.now()}`, type: "comment", user: "J. Smith", message, timestamp }]);
  }, []);

  const handleReplaceDoc = useCallback((docId: string) => {
    setDocs((prev) => prev.map((d) => (d.id === docId ? { ...d, uploadedAt: "just now" } : d)));
  }, []);

  return (
    <div className="flex flex-col h-screen bg-atmo-1 overflow-hidden">
      <header className="border-b bg-card px-6 py-3 flex items-center justify-between gap-6 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 shrink-0 text-atmo-8 hover:text-foreground gap-1.5"
            onClick={() => navigate("/?tab=transactions")}
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-xs font-medium">Back</span>
          </Button>
          <div className="min-w-0 flex items-center gap-2">
            <h1 className="text-base font-semibold truncate font-mono">{id}</h1>
            {tx && <StatusBadge status={tx.reviewStatus} />}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowDocs(true)} aria-label="Documents">
                  <FileText className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Documents</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowActivity(true)} aria-label="Activity">
                  <MessageSquare className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Activity</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </header>

      {id && (
        <div className="px-6 py-2 border-b border-atmo-3 bg-atmo-0 shrink-0">
          <div className="text-[11px] text-atmo-8 font-mono">Submission ID: {id}</div>
        </div>
      )}

      <div className="flex-1 overflow-hidden p-3">
        <TransactionLedgerGrid />
      </div>

      <Sheet open={showDocs} onOpenChange={setShowDocs}>
        <SheetContent side="right" className="w-[420px] sm:max-w-[420px] flex flex-col p-0">
          <SheetHeader className="px-4 py-3 border-b">
            <SheetTitle className="text-sm">Supporting Documents</SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              Supplemental files attached to this transaction.
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

export default TransactionDetail;
