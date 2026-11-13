import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { usePassInfo } from "@/store/memPassStore";
import { brand } from "@/config/brand";

/**
 * Change log surfaced when a new participant pass opens after an SPP review.
 */
const SppModificationsCard = () => {
  const { passNumber, passState } = usePassInfo();
  if (passState !== "participant-after-spp") return null;

  const reviewedPass = passNumber - 1;

  return (
    <div className="bg-[#FFFBEB] border border-[#FEF3C7] rounded-xl p-5 mb-6">
      <div className="flex items-center gap-2">
        <Info size={20} className="text-[#D97706]" />
        <h3 className="text-sm font-bold text-neutral-900">
          {brand.clientShortName} Engineering Modifications (Pass {reviewedPass} Review)
        </h3>
      </div>
      <ul className="mt-3 space-y-1.5 text-sm text-neutral-700 list-disc pl-9">
        <li>
          Ratings: {brand.clientShortName} adjusted 2 line emergency ratings due to thermal limit checks.
        </li>
        <li>Transactions: {brand.clientShortName} validated 14 NSI profiles; 0 overrides applied.</li>
      </ul>
      <Button
        variant="outline"
        className="mt-4 border-[#D97706] text-[#92400E] hover:bg-[#FEF3C7]"
        onClick={() =>
          toast({
            title: brand.clientShortName + " Diff Log",
            description: "The detailed " + brand.clientShortName + " diff log is not available in this preview.",
          })
        }
      >
        View Detailed {brand.clientShortName} Diff Log →
      </Button>
    </div>
  );
};

export default SppModificationsCard;
