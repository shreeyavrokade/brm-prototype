import { Link2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type SharedFlag = "tie-line" | "topology" | "generator" | "transformer";

const LABELS: Record<SharedFlag, string> = {
  "tie-line": "Shared Tie Line",
  topology: "Shared Topology",
  generator: "Shared Generator",
  transformer: "Shared Transformer",
};

const SharedAssetBadge = ({ flag, className }: { flag: SharedFlag; className?: string }) => (
  <Badge
    variant="outline"
    className={cn(
      "gap-1 rounded-full border-[#B59A3A] bg-[#FBF2D8] text-[#5C4A12] text-[10px] font-medium px-2 py-0.5 whitespace-nowrap",
      className,
    )}
  >
    <Link2 className="h-3 w-3" />
    {LABELS[flag]}
  </Badge>
);

export default SharedAssetBadge;
