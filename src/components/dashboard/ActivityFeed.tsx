import { useState } from "react";
import { ActivityItem } from "./types";
import { Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ActivityFeedProps {
  items: ActivityItem[];
  onAddComment?: (message: string) => void;
}

const ActivityFeed = ({ items, onAddComment }: ActivityFeedProps) => {
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (!comment.trim() || !onAddComment) return;
    onAddComment(comment.trim());
    setComment("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {items.map((item) =>
            item.type === "history" ? (
              <div key={item.id} className="flex items-start gap-2 text-[11px] text-muted-foreground italic">
                <Clock className="h-3 w-3 mt-0.5 shrink-0" />
                <span>{item.user}: {item.message} — {item.timestamp}</span>
              </div>
            ) : (
              <div key={item.id} className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-medium">{item.user}</span>
                  <span className="text-[10px] text-muted-foreground">{item.timestamp}</span>
                </div>
                <div className="mt-1 rounded-lg bg-muted/60 border px-3 py-2 text-xs leading-relaxed">
                  {item.message}
                </div>
              </div>
            )
          )}
        </div>
      </ScrollArea>

      {/* Sticky comment input */}
      <div className="border-t bg-card p-3 shrink-0">
        <div className="flex gap-2">
          <Textarea
            placeholder="Add a comment…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={500}
            className="text-xs min-h-[40px] max-h-[100px] resize-none flex-1"
            rows={1}
          />
          <Button
            size="icon"
            className="h-9 w-9 shrink-0"
            disabled={!comment.trim()}
            onClick={handleSubmit}
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
        <div
          className={`mt-1 text-right text-[10px] ${
            comment.length >= 480 ? "text-destructive" : "text-muted-foreground"
          }`}
        >
          {comment.length} / 500
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;