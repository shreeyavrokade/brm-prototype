import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import { ACTIVITY_SHEET_CONTENT, ACTIVITY_SHEET_HEADER, ACTIVITY_SHEET_TITLE } from "@/components/shared/ActivitySheet";
import type { ActivityItem } from "@/components/dashboard/types";

const sppItems: ActivityItem[] = [
  { id: "s1", type: "comment", user: "SPP Reviewer", timestamp: "2h ago", message: "Please confirm the Q3 retirement date for this unit." },
  { id: "s2", type: "history", user: "SPP System", timestamp: "1d ago", message: "Row flagged for verification" },
];
const memberItems: ActivityItem[] = [
  { id: "m1", type: "comment", user: "You", timestamp: "10m ago", message: "Updated commissioning date per recent filing." },
];

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  rowLabel?: string;
}

const ActivityDrawer = ({ open, onOpenChange, rowLabel }: Props) => {
  const [tab, setTab] = useState("spp");
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className={ACTIVITY_SHEET_CONTENT}>
        <SheetHeader className={ACTIVITY_SHEET_HEADER}>
          <SheetTitle className={ACTIVITY_SHEET_TITLE}>
            Activity{rowLabel ? ` — ${rowLabel}` : ""}
          </SheetTitle>
        </SheetHeader>
        <Tabs value={tab} onValueChange={setTab} className="flex-1 flex flex-col min-h-0">
          <TabsList className="mx-4 mt-3 self-start">
            <TabsTrigger value="spp">SPP Comments</TabsTrigger>
            <TabsTrigger value="member">Member Comments</TabsTrigger>
          </TabsList>
          <TabsContent value="spp" className="flex-1 flex flex-col min-h-0 mt-0">
            <ActivityFeed items={sppItems} onAddComment={() => {}} />
          </TabsContent>
          <TabsContent value="member" className="flex-1 flex flex-col min-h-0 mt-0">
            <ActivityFeed items={memberItems} onAddComment={() => {}} />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default ActivityDrawer;
