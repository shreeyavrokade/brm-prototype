import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useSubmissionIssue } from "./SubmissionIssueContext";
import type { CellIssue } from "./validationIssues";

interface Props {
  /** all issues for the dataset, keyed by section */
  sections: { key: string; label: string; issues: CellIssue[] }[];
  /** section currently visible in the grid — its issues are shown */
  activeSection: string;
  onDismiss: (id: string, reason: string) => void;
}

const IssueResolutionPanel = ({ sections, activeSection, onDismiss }: Props) => {
  const { selectedRowId, setSelectedRowId, setHovered } = useSubmissionIssue();
  const [dismissingId, setDismissingId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const section = sections.find((s) => s.key === activeSection) ?? sections[0];
  const sectionIssues = section?.issues ?? [];

  const displayed = useMemo(
    () => (selectedRowId ? sectionIssues.filter((i) => i.rowId === selectedRowId) : sectionIssues),
    [sectionIssues, selectedRowId],
  );

  useEffect(() => {
    if (!selectedRowId || !scrollRef.current) return;
    const el = scrollRef.current.querySelector(`[data-issue-row="${selectedRowId}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selectedRowId]);

  const grouped = useMemo(() => {
    return displayed.reduce<Record<string, CellIssue[]>>((acc, i) => {
      (acc[i.category] ??= []).push(i);
      return acc;
    }, {});
  }, [displayed]);

  const counts = (list: CellIssue[]) => ({
    errors: list.filter((i) => i.severity === "error" && !i.dismissed).length,
    warnings: list.filter((i) => i.severity === "warning" && !i.dismissed).length,
  });

  const total = counts(sectionIssues);
  const selectedLabel = selectedRowId
    ? sectionIssues.find((i) => i.rowId === selectedRowId)?.rowIndex
    : null;

  const card = (issue: CellIssue) => (
    <Card
      key={issue.id}
      data-issue-row={issue.rowId}
      onMouseEnter={() => setHovered(issue.rowId, issue.field)}
      onMouseLeave={() => setHovered(null, null)}
      onClick={() => setSelectedRowId(issue.rowId)}
      className={cn(
        "text-xs cursor-pointer transition-all border-l-4 rounded-xl shadow-sm hover:border-[#2064B4]",
        issue.dismissed && "opacity-40",
        issue.severity === "error"
          ? "border-l-[#C82333] border-y-[#C82333]/30 border-r-[#C82333]/30 bg-white"
          : "border-l-[#B7791F] border-y-[#B7791F]/40 border-r-[#B7791F]/40 bg-white",
      )}
    >
      <CardHeader className="p-3 pb-1.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-semibold text-[#222222]">Row {issue.rowIndex}</span>
            <span className="text-[#6C6B6B]">|</span>
            <span className="font-mono font-semibold text-[#222222] truncate">{issue.field.toUpperCase()}</span>
          </div>
          <Badge
            className={cn(
              "text-[11px] font-semibold shrink-0 inline-flex items-center gap-1 border-0 rounded",
              issue.dismissed
                ? "bg-transparent border border-[#D9D9D9] text-[#6C6B6B]"
                : issue.severity === "error"
                  ? "bg-[#C82333] text-white hover:bg-[#C82333]"
                  : "bg-[#FFBE2E] text-[#222222] hover:bg-[#FFBE2E]",
            )}
          >
            {!issue.dismissed &&
              (issue.severity === "error" ? (
                <XCircle className="h-3 w-3 shrink-0" />
              ) : (
                <AlertTriangle className="h-3 w-3 shrink-0" />
              ))}
            {issue.dismissed ? "Dismissed" : issue.severity === "error" ? "Required Fix" : "Optional Fix"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="px-3 pb-2 pt-0">
        <p className="text-[11px] font-mono font-bold text-[#222222]">{issue.code}</p>
        <p className="text-xs font-semibold text-[#222222] mt-0.5">{issue.rule}</p>
        <p className="text-[#6C6B6B] leading-relaxed mt-1">{issue.description}</p>
      </CardContent>

      {issue.severity === "warning" && !issue.dismissed && (
        <CardFooter className="px-3 pb-2 pt-0">
          {dismissingId === issue.id ? (
            <div className="space-y-2 w-full" onClick={(e) => e.stopPropagation()}>
              <Textarea
                placeholder="Reason for dismissal (optional)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="text-xs min-h-[48px] resize-none bg-white"
              />
              <div className="flex gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-[11px] h-6 px-2"
                  onClick={() => {
                    onDismiss(issue.id, reason);
                    setDismissingId(null);
                    setReason("");
                  }}
                >
                  Save
                </Button>
                <Button size="sm" variant="ghost" className="text-[11px] h-6 px-2" onClick={() => setDismissingId(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              className="text-[11px] h-6 px-2 text-[#6C6B6B]"
              onClick={(e) => {
                e.stopPropagation();
                setDismissingId(issue.id);
              }}
            >
              Dismiss
            </Button>
          )}
        </CardFooter>
      )}

      {issue.dismissed && (
        <CardFooter className="px-3 pb-2 pt-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <Badge variant="outline" className="text-[11px] border-[#D9D9D9] text-[#6C6B6B]">
              Dismissed by J. Smith
            </Badge>
            {issue.dismissReason && (
              <span className="text-[11px] text-[#6C6B6B] italic truncate">— {issue.dismissReason}</span>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );

  return (
    <aside className="flex flex-col h-full bg-atmo-2 border-l border-[#D9D9D9]">
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b bg-atmo-2 sticky top-0 z-10">
        <h2 className="text-xs font-semibold text-[#222222] shrink-0">
          {selectedRowId ? `Issues for Row ${selectedLabel ?? selectedRowId}` : "Issue Resolution"}
        </h2>
        <div className="flex items-center gap-1.5">
          {total.errors > 0 && (
            <Badge className="h-5 px-2 text-[11px] font-semibold bg-[#C82333] text-white border-0 hover:bg-[#C82333]">
              {total.errors} error{total.errors !== 1 ? "s" : ""}
            </Badge>
          )}
          {total.warnings > 0 && (
            <Badge className="h-5 px-2 text-[11px] font-semibold bg-[#FCF2D9] text-[#6D4D09] border-0 hover:bg-[#FCF2D9]">
              {total.warnings} warning{total.warnings !== 1 ? "s" : ""}
            </Badge>
          )}
          {selectedRowId && (
            <Button variant="ghost" size="sm" className="text-[11px] h-6 px-2" onClick={() => setSelectedRowId(null)}>
              Show All
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1" ref={scrollRef}>
        {displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
            <CheckCircle2 className="h-8 w-8 text-[#146C2E] mb-2" />
            <p className="text-sm font-medium text-[#6C6B6B]">
              {selectedRowId ? "No issues for this row" : "No issues found"}
            </p>
          </div>
        ) : (
          <Accordion type="multiple" defaultValue={[section.key]} className="px-2 py-1">
            <AccordionItem value={section.key} className="border-none">
              <AccordionTrigger className="py-2 px-2 text-xs font-semibold text-[#6C6B6B] hover:no-underline">
                <span className="flex items-center gap-2">
                  {section.label}
                  {total.errors + total.warnings === 0 ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#146C2E]" />
                  ) : (
                    <span className="flex items-center gap-1">
                      {total.errors > 0 && (
                        <Badge className="h-5 px-2 text-[11px] font-semibold bg-[#C82333] text-white border-0 hover:bg-[#C82333]">
                          {total.errors} error{total.errors !== 1 ? "s" : ""}
                        </Badge>
                      )}
                      {total.warnings > 0 && (
                        <Badge className="h-5 px-2 text-[11px] font-semibold bg-[#FCF2D9] text-[#6D4D09] border-0 hover:bg-[#FCF2D9]">
                          {total.warnings} warning{total.warnings !== 1 ? "s" : ""}
                        </Badge>
                      )}
                    </span>
                  )}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-1">
                <Accordion type="multiple" defaultValue={Object.keys(grouped)}>
                  {Object.entries(grouped).map(([category, list]) => (
                    <AccordionItem key={category} value={category} className="border-none ml-1">
                      <AccordionTrigger className="py-1.5 px-2 text-xs font-medium hover:no-underline">
                        <span className="flex items-center gap-2">
                          {category}
                          <span className="text-[11px] text-[#6C6B6B] font-normal">({list.length})</span>
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="pb-1 pl-2">
                        <div className="space-y-2">{list.map(card)}</div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </ScrollArea>
    </aside>
  );
};

export default IssueResolutionPanel;
