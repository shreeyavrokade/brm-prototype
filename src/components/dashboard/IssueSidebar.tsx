import { useState, useMemo, useEffect, useRef } from "react";
import { Issue, RecordType, RECORD_COLUMNS } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, XCircle, Layers, CheckCircle2 } from "lucide-react";
import transformerAllGood from "@/assets/status-allgood.png";

interface IssueSidebarProps {
  issues: Issue[];
  activeRecordType: RecordType;
  selectedRowId: string | null;
  onDismiss: (id: string, reason: string) => void;
  onHoverIssue: (rowId: string | null, cellKey: string | null) => void;
  onSelectIssue: (rowId: string | null) => void;
}

const getFieldLabel = (cellKey: string): string => {
  for (const cols of Object.values(RECORD_COLUMNS)) {
    const col = cols.find((c) => c.key === cellKey);
    if (col) return col.label;
  }
  return cellKey;
};

const IssueSidebar = ({ issues, activeRecordType, selectedRowId, onDismiss, onHoverIssue, onSelectIssue }: IssueSidebarProps) => {
  const [dismissingId, setDismissingId] = useState<string | null>(null);
  const [dismissReason, setDismissReason] = useState("");
  const [expandedBulkGroups, setExpandedBulkGroups] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);

  // Filter by active equipment tab first, then by selected row
  const displayedIssues = useMemo(() => {
    let filtered = issues.filter((i) => i.recordType === activeRecordType);
    if (selectedRowId) filtered = filtered.filter((i) => i.rowId === selectedRowId);
    return filtered;
  }, [issues, activeRecordType, selectedRowId]);

  // Auto-scroll to issue card when a row is selected in the table
  useEffect(() => {
    if (selectedRowId && scrollRef.current) {
      const el = scrollRef.current.querySelector(`[data-issue-row="${selectedRowId}"]`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [selectedRowId]);

  // Group by phase > category
  const grouped = useMemo(() => {
    return displayedIssues.reduce<Record<string, Record<string, Issue[]>>>((acc, issue) => {
      if (!acc[issue.phase]) acc[issue.phase] = {};
      if (!acc[issue.phase][issue.category]) acc[issue.phase][issue.category] = [];
      acc[issue.phase][issue.category].push(issue);
      return acc;
    }, {});
  }, [displayedIssues]);

  const phaseIssueCounts = (phaseName: string) => {
    const phaseIssues = displayedIssues.filter((i) => i.phase === phaseName && !i.dismissed);
    const errors = phaseIssues.filter((i) => i.status === "error").length;
    const warnings = phaseIssues.filter((i) => i.status === "warning").length;
    return { errors, warnings, total: errors + warnings };
  };

  const handleDismiss = (id: string) => {
    onDismiss(id, dismissReason);
    setDismissingId(null);
    setDismissReason("");
  };

  const handleIssueClick = (issue: Issue) => {
    onSelectIssue(issue.rowId);
  };

  const toggleBulkGroup = (groupKey: string) => {
    setExpandedBulkGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupKey)) next.delete(groupKey);
      else next.add(groupKey);
      return next;
    });
  };

  const renderIssueCard = (issue: Issue) => (
    <Card
      key={issue.id}
      data-issue-row={issue.rowId}
      className={`text-xs transition-all cursor-pointer border-l-4 ${
        issue.dismissed ? "opacity-40" : ""
      } ${
        issue.status === "error"
          ? "border-l-[#C82333] border-y-[#C82333]/30 border-r-[#C82333]/30 bg-white"
          : "border-l-[#B7791F] border-y-[#B7791F]/40 border-r-[#B7791F]/40 bg-white"
      }`}
      onMouseEnter={() => onHoverIssue(issue.rowId, issue.cellKey)}
      onMouseLeave={() => onHoverIssue(null, null)}
      onClick={() => handleIssueClick(issue)}
    >
      <CardHeader className="p-3 pb-1.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="font-medium">Row {issue.rowId}</span>
            <span className="text-muted-foreground">|</span>
            <span className="font-medium">{getFieldLabel(issue.cellKey)}</span>
          </div>
          <Badge
            variant={issue.status === "error" && !issue.dismissed ? "destructive" : "outline"}
            className={`text-[11px] font-semibold shrink-0 inline-flex items-center gap-1 ${
              issue.dismissed
                ? "border-muted-foreground/30 text-muted-foreground bg-transparent"
                : issue.status === "error"
                ? "bg-[#C82333] hover:bg-[#C82333]"
                : "border-[#B7791F] text-[#6D4D09] bg-[#FCF2D9]"
            }`}
          >
            {!issue.dismissed && (
              issue.status === "error" ? (
                <XCircle className="h-3 w-3 shrink-0" />
              ) : (
                <AlertTriangle className="h-3 w-3 shrink-0" />
              )
            )}
            {issue.dismissed ? "Dismissed" : issue.status === "error" ? "Required Fix" : "Optional Fix"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="px-3 pb-2 pt-0">
        <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-0.5">
          <li>{issue.message}</li>
        </ul>
      </CardContent>

      {issue.status === "warning" && !issue.dismissed && (
        <CardFooter className="px-3 pb-2 pt-0">
          {dismissingId === issue.id ? (
            <div className="space-y-2 w-full" onClick={(e) => e.stopPropagation()}>
              <Textarea
                placeholder="Reason for dismissal (optional)"
                value={dismissReason}
                onChange={(e) => setDismissReason(e.target.value)}
                className="text-xs min-h-[48px] resize-none"
              />
              <div className="flex gap-1.5">
                <Button size="sm" variant="outline" className="text-[11px] h-6 px-2" onClick={() => handleDismiss(issue.id)}>
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
              className="text-[11px] h-6 px-2 text-muted-foreground"
              onClick={(e) => { e.stopPropagation(); setDismissingId(issue.id); }}
            >
              Dismiss
            </Button>
          )}
        </CardFooter>
      )}

      {issue.dismissed && (
        <CardFooter className="px-3 pb-2 pt-0">
          <div className="flex items-center gap-1.5">
            <Badge variant="outline" className="text-[11px] border-muted-foreground/30 text-muted-foreground">
              Dismissed by J. Smith
            </Badge>
            {issue.dismissReason && (
              <span className="text-[11px] text-muted-foreground italic truncate">
                — {issue.dismissReason}
              </span>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );

  const renderCategoryIssues = (catIssues: Issue[]) => {
    const bulkGroups: Record<string, Issue[]> = {};
    const standalone: Issue[] = [];

    catIssues.forEach((issue) => {
      if (issue.bulkGroup) {
        if (!bulkGroups[issue.bulkGroup]) bulkGroups[issue.bulkGroup] = [];
        bulkGroups[issue.bulkGroup].push(issue);
      } else {
        standalone.push(issue);
      }
    });

    return (
      <div className="space-y-2">
        {standalone.map(renderIssueCard)}

        {Object.entries(bulkGroups).map(([groupName, groupIssues]) => {
          const isExpanded = expandedBulkGroups.has(groupName);
          const errorCount = groupIssues.filter((i) => i.status === "error" && !i.dismissed).length;
          const warningCount = groupIssues.filter((i) => i.status === "warning" && !i.dismissed).length;
          const dismissedCount = groupIssues.filter((i) => i.dismissed).length;

          return (
            <div key={groupName} className="border rounded-md bg-muted/30 overflow-hidden">
              <button
                className="w-full flex items-center justify-between gap-2 px-3 py-2 text-xs hover:bg-muted/50 transition-colors"
                onClick={() => toggleBulkGroup(groupName)}
                onMouseEnter={() => {
                  groupIssues.forEach((i) => onHoverIssue(i.rowId, i.cellKey));
                }}
                onMouseLeave={() => onHoverIssue(null, null)}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Layers className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="font-semibold truncate">{groupName}</span>
                  <span className="text-[11px] text-muted-foreground">
                    ({groupIssues.length} issues)
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {errorCount > 0 && (
                    <Badge variant="destructive" className="text-[11px] font-semibold h-5 px-2 bg-[#C82333] hover:bg-[#C82333]">
                      {errorCount} error{errorCount !== 1 ? "s" : ""}
                    </Badge>
                  )}
                  {warningCount > 0 && (
                    <Badge variant="outline" className="text-[11px] font-semibold h-5 px-2 border-[#B7791F] text-[#6D4D09] bg-[#FCF2D9]">
                      {warningCount}
                    </Badge>
                  )}
                  {dismissedCount > 0 && (
                    <Badge variant="outline" className="text-[11px] font-semibold h-5 px-2 border-muted-foreground/30 text-muted-foreground">
                      {dismissedCount} dismissed
                    </Badge>
                  )}
                  <span className="text-muted-foreground text-[11px]">
                    {isExpanded ? "▾" : "▸"}
                  </span>
                </div>
              </button>

              {isExpanded && (
                <div className="px-2 pb-2 space-y-2">
                  {groupIssues.map(renderIssueCard)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-atmo-2">
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b bg-atmo-2 sticky top-0 z-10">
        <h2 className="text-xs font-medium shrink-0">
          {selectedRowId ? `Issues for Row ${selectedRowId}` : "Issue Resolution"}
        </h2>
        <div className="flex items-center gap-1.5">
          {selectedRowId && (
            <Button variant="ghost" size="sm" className="text-[11px] h-6 px-2" onClick={() => onSelectIssue(null)}>
              Show All
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1" ref={scrollRef}>
        {displayedIssues.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
            {activeRecordType === "TRANSFORMER" && !selectedRowId ? (
              <>
                <img
                  src={transformerAllGood}
                  alt="Happy transformer mascot giving a thumbs up"
                  width={96}
                  height={96}
                  loading="lazy"
                  className="mb-3"
                />
                <p className="text-sm font-semibold text-foreground">
                  All transformers look great!
                </p>
                <p className="text-xs text-muted-foreground mt-1 max-w-[220px]">
                  No errors or warnings detected. Tap ratios, windings, and ratings are within spec.
                </p>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-8 w-8 text-success mb-2" />
                <p className="text-sm font-medium text-muted-foreground">
                  {selectedRowId ? "No issues for this row" : `No ${activeRecordType.toLowerCase()} issues found`}
                </p>
              </>
            )}
          </div>
        ) : (
          <Accordion type="multiple" defaultValue={Object.keys(grouped)} className="px-2 py-1">
            {Object.entries(grouped).map(([phase, categories]) => {
              const { errors, warnings, total } = phaseIssueCounts(phase);
              return (
                <AccordionItem key={phase} value={phase} className="border-none">
                  <AccordionTrigger className="py-2 px-2 text-xs font-semibold text-muted-foreground hover:no-underline">
                    <span className="flex items-center gap-2">
                      {phase}
                      {total === 0 ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                      ) : (
                        <span className="flex items-center gap-1">
                          {errors > 0 && (
                            <Badge variant="destructive" className="text-[11px] font-semibold h-5 px-2 bg-[#C82333] hover:bg-[#C82333]">
                              {errors} error{errors !== 1 ? "s" : ""}
                            </Badge>
                          )}
                          {warnings > 0 && (
                            <Badge variant="outline" className="text-[11px] font-semibold h-5 px-2 border-[#B7791F] text-[#6D4D09] bg-[#FCF2D9]">
                              {warnings} warning{warnings !== 1 ? "s" : ""}
                            </Badge>
                          )}
                        </span>
                      )}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-1">
                    <Accordion type="multiple" defaultValue={Object.keys(categories)}>
                      {Object.entries(categories).map(([category, catIssues]) => (
                        <AccordionItem key={category} value={category} className="border-none ml-1">
                          <AccordionTrigger className="py-1.5 px-2 text-xs font-medium hover:no-underline">
                            <span className="flex items-center gap-2">
                              {category}
                              <span className="text-[11px] text-muted-foreground font-normal">
                                ({catIssues.length})
                              </span>
                            </span>
                          </AccordionTrigger>
                          <AccordionContent className="pb-1 pl-2">
                            {renderCategoryIssues(catIssues)}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </ScrollArea>
    </div>
  );
};

export default IssueSidebar;