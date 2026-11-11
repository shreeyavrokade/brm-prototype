import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import type { ActivityItem } from "@/components/dashboard/types";
import { cn } from "@/lib/utils";

/** Canonical activity panel styling shared across every tab/module. */
export const ACTIVITY_SHEET_CONTENT =
  "w-[420px] sm:max-w-[420px] p-0 flex flex-col";
export const ACTIVITY_SHEET_HEADER = "px-4 py-3 border-b border-atmo-3";
export const ACTIVITY_SHEET_TITLE = "text-sm font-semibold text-foreground";
export const ACTIVITY_SHEET_DESCRIPTION = "text-xs text-muted-foreground";

interface ActivitySheetProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title?: string;
  description?: string;
  items: ActivityItem[];
  onAddComment?: (message: string) => void;
  className?: string;
}

const ActivitySheet = ({
  open,
  onOpenChange,
  title = "Activity",
  description = "System history and team comments.",
  items,
  onAddComment,
  className,
}: ActivitySheetProps) => (
  <Sheet open={open} onOpenChange={onOpenChange}>
    <SheetContent side="right" className={cn(ACTIVITY_SHEET_CONTENT, className)}>
      <SheetHeader className={ACTIVITY_SHEET_HEADER}>
        <SheetTitle className={ACTIVITY_SHEET_TITLE}>{title}</SheetTitle>
        {description && (
          <SheetDescription className={ACTIVITY_SHEET_DESCRIPTION}>{description}</SheetDescription>
        )}
      </SheetHeader>
      <ActivityFeed items={items} onAddComment={onAddComment} />
    </SheetContent>
  </Sheet>
);

export default ActivitySheet;
