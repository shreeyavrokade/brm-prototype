import { Clock, Lock } from "lucide-react";
import { usePassInfo } from "@/store/memPassStore";
import { brand } from "@/config/brand";

/**
 * State-aware pass handoff banner for the MEM Overview.
 * Participant turn = active edit window. SPP turn = read-only inspection.
 */
const PassHandoffBanner = () => {
  const { passNumber, passState } = usePassInfo();
  const isSpp = passState === "spp-review";

  if (isSpp) {
    return (
      <div className="w-full rounded-2xl p-6 shadow-sm mb-6 bg-[#F8FAFC] border-2 border-[#94A3B8]">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="bg-[#475569] text-white font-bold px-3 py-1 rounded-full text-xs">
            PASS {passNumber} — IN {brand.clientShortName.toUpperCase()} REVIEW
          </span>
          <h2 className="text-base font-bold text-neutral-900">
            Pass Locked — Under {brand.clientShortName} Engineering Review
          </h2>
        </div>
        <div className="flex items-center gap-2 mt-3 text-sm font-medium text-[#334155]">
          <Lock size={18} className="text-[#64748B]" />
          <span>{brand.clientShortName} Window Closes: Sept 04, 2026</span>
        </div>
        <p className="text-sm text-neutral-600 mt-2 leading-relaxed">
          Participant editing is currently locked while {brand.clientShortName} Engineers conduct powerflow
          and model integration. You have full read-only access to inspect Pass{" "}
          {passNumber} data.
        </p>
        <p className="text-sm text-neutral-700 mt-3 border-t border-[#CBD5E1] pt-3">
          Pass {passNumber + 1} Participant Review Window opens automatically on{" "}
          <span className="font-bold text-neutral-900">
            Sept 05, 2026 at 08:00 AM CST
          </span>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl p-6 shadow-sm mb-6 bg-[#F0F9FF] border-2 border-[#0284c7]">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="bg-[#0284c7] text-white font-bold px-3 py-1 rounded-full text-xs">
          PASS {passNumber} ACTIVE
        </span>
        <h2 className="text-base font-bold text-neutral-900">
          Market Participant Review Window Is Open
        </h2>
      </div>
      <div className="flex items-center gap-2 mt-3 text-sm font-medium text-[#0369a1]">
        <Clock size={18} className="text-[#0369a1] animate-pulse" />
        <span>Window Closes In: 04 Days 12 Hours 30 Mins</span>
      </div>
      <p className="text-sm text-neutral-600 mt-2 leading-relaxed">
        You have edit access across all dataset modules. Opening or editing a dataset
        automatically updates its status to Complete for {brand.clientShortName} tracking.
      </p>
    </div>
  );
};

export default PassHandoffBanner;
