import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { brand } from "@/config/brand";

export interface SppChange {
  previous: string | number;
  current: string | number;
}

/**
 * Red indicator dot rendered inside a cell SPP modified during the prior pass.
 * Hovering reveals a micro-card with the baseline → SPP updated values.
 */
const SppCellDot = ({ change }: { change: SppChange }) => (
  <HoverCard openDelay={80} closeDelay={40}>
    <HoverCardTrigger asChild>
      <span
        role="img"
        aria-label={`Modified by ${brand.clientShortName}`}
        className="ml-1.5 inline-block h-2 w-2 rounded-full bg-[#C82333] align-middle cursor-help"
      />
    </HoverCardTrigger>
    <HoverCardContent side="top" align="start" className="w-64 p-3">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-[#C82333] mb-1.5">
        {brand.clientShortName} Update
      </div>
      <div className="text-xs text-atmo-10 flex items-center gap-1.5 flex-wrap">
        <span className="text-atmo-9">Baseline</span>
        <span className="font-mono line-through text-atmo-9">
          {String(change.previous) || "—"}
        </span>
        <span className="text-atmo-9">→</span>
        <span className="text-atmo-9">{brand.clientShortName} Updated</span>
        <span className="font-mono font-semibold text-foreground">
          {String(change.current)}
        </span>
      </div>
    </HoverCardContent>
  </HoverCard>
);

export default SppCellDot;
