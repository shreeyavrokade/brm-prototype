import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import StatusPill from "@/components/shared/statusBadge";

const MEMBERS: { name: string; footprint: string; state: "Accepted" | "Review Needed" | "Draft" }[] = [
  { name: "Westar Energy", footprint: "East (EDST)", state: "Accepted" },
  { name: "OG&E", footprint: "East (EDST)", state: "Review Needed" },
  { name: "KCP&L", footprint: "East (EDST)", state: "Accepted" },
  { name: "WFEC", footprint: "East (EDST)", state: "Review Needed" },
  { name: "Sunflower Electric", footprint: "West (Workbook)", state: "Accepted" },
  { name: "Tri-State G&T", footprint: "West (Workbook)", state: "Draft" },
  { name: "GRDA", footprint: "West (Workbook)", state: "Accepted" },
  { name: "City of Wichita", footprint: "West (Workbook)", state: "Draft" },
];

export const ReportCardBar = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-atmo-3 bg-atmo-0 p-4">
        <div className="flex flex-wrap gap-8">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-atmo-9">
              East (EDST)
            </div>
            <div className="mt-1 text-sm text-foreground">
              42 Members Responded <span className="text-atmo-8">|</span> 12 Pending Review
            </div>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-atmo-9">
              West (Workbook)
            </div>
            <div className="mt-1 text-sm text-foreground">
              23 Members Responded <span className="text-atmo-8">|</span> 23 Confirmed No Change
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          className="h-9 gap-1.5 rounded-full border-atmo-5 bg-atmo-0 px-4 text-foreground"
        >
          Full Member Report Card
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-[420px] sm:max-w-[420px]">
          <SheetHeader>
            <SheetTitle>Member Report Card</SheetTitle>
          </SheetHeader>
          <div className="mt-4 divide-y divide-atmo-3 border-y border-atmo-3">
            {MEMBERS.map((m) => (
              <div key={m.name} className="flex items-center justify-between py-2.5">
                <div>
                  <div className="text-sm text-foreground">{m.name}</div>
                  <div className="text-xs text-atmo-9">{m.footprint}</div>
                </div>
                <StatusPill status={m.state} />
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ReportCardBar;
