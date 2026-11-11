import type { SeasonalRating } from "./types";

/**
 * Nested read-only "Seasonal Ratings" sub-grid rendered inside an expanded
 * BRANCH row in the File Inspector.
 */
const SeasonalRatingsPanel = ({ ratings }: { ratings: SeasonalRating[] }) => (
  <div className="bg-[#F8FAFC] border-t border-b border-[#E2E8F0] p-4 pl-12">
    <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-2">
      Seasonal Ratings
    </div>
    {ratings.length === 0 ? (
      <div className="text-xs text-muted-foreground">No seasonal ratings recorded for this branch.</div>
    ) : (
      <div className="bg-white border border-[#E2E8F0] rounded-sm overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#F1F5F9]">
              <th className="text-left text-[10px] font-semibold text-[#64748B] uppercase tracking-wider px-3 py-2 border-b border-[#E2E8F0]">
                Season
              </th>
              <th className="text-right text-[10px] font-semibold text-[#64748B] uppercase tracking-wider px-3 py-2 border-b border-[#E2E8F0]">
                Normal High
              </th>
              <th className="text-right text-[10px] font-semibold text-[#64748B] uppercase tracking-wider px-3 py-2 border-b border-[#E2E8F0]">
                Emergency High
              </th>
            </tr>
          </thead>
          <tbody>
            {ratings.map((r, i) => (
              <tr key={r.season} className={i % 2 === 1 ? "bg-zebra" : "bg-white"}>
                <td className="px-3 py-2 text-xs font-medium text-[hsl(var(--table-text))] border-b border-[#E2E8F0] last:border-b-0">
                  {r.season}
                </td>
                <td className="px-3 py-2 text-xs font-mono tabular-nums text-right text-[hsl(var(--table-text))] border-b border-[#E2E8F0]">
                  {r.normalHigh.toFixed(1)}
                </td>
                <td className="px-3 py-2 text-xs font-mono tabular-nums text-right text-[hsl(var(--table-text))] border-b border-[#E2E8F0]">
                  {r.emergencyHigh.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

export default SeasonalRatingsPanel;
