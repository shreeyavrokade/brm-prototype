import { useState } from "react";
import { MoreVertical, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface CommentItem {
  id: string;
  author: string;
  body: React.ReactNode;
  date: string;
}

interface Props {
  comments: CommentItem[];
  onAdd: (text: string) => void;
}

const CommentsThread = ({ comments, onAdd }: Props) => {
  const [draft, setDraft] = useState("");

  const submit = () => {
    if (!draft.trim()) return;
    onAdd(draft.trim());
    setDraft("");
  };

  return (
    <div className="bg-atmo-2 rounded-md overflow-hidden">
      {comments.length === 0 ? (
        <div className="py-12 text-center text-atmo-8 text-sm">Add the first comment</div>
      ) : (
        <div className="p-4">
          <div className="text-sm font-semibold text-foreground mb-3">
            Comments ({comments.length})
          </div>
          <div className="space-y-3">
            {comments.map((c) => (
              <div key={c.id} className="bg-atmo-0 rounded-md p-3 border border-atmo-3">
                <div className="flex items-start justify-between">
                  <div className="text-sm font-semibold text-foreground">{c.author}</div>
                  <button className="text-atmo-8 hover:text-foreground" aria-label="More">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
                <div className="text-sm text-atmo-10 mt-1 leading-relaxed">{c.body}</div>
                <div className="text-xs text-atmo-8 mt-2">{c.date}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-atmo-0 p-3 border-t border-atmo-3">
        <div className="relative">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value.slice(0, 500))}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Enter comment"
            maxLength={500}
            className="pr-10 bg-atmo-0 border-atmo-3"
          />
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={submit}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-atmo-8 hover:text-foreground"
            aria-label="Send comment"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-xs text-atmo-8 text-right mt-1.5">{draft.length} / 500 characters</div>
      </div>
    </div>
  );
};

export default CommentsThread;
