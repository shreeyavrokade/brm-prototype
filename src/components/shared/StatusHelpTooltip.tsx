import { useEffect, useRef, useState, type ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export interface StatusHelp {
  /** What the status means, in one sentence. */
  means: string;
  /** What the viewer should expect or do next. */
  next: string;
}

interface Props {
  label: string;
  help?: StatusHelp;
  children: ReactNode;
}

/**
 * Explains a status on hover, keyboard focus (Tab) and touch (tap to toggle).
 * Used by every status pill so the meaning and next step are always one
 * gesture away during a demo.
 */
const StatusHelpTooltip = ({ label, help, children }: Props) => {
  const [open, setOpen] = useState(false);
  const pointerType = useRef<string>("mouse");
  const wasOpen = useRef(false);
  const triggerRef = useRef<HTMLSpanElement>(null);

  // A touch-opened tooltip closes when the user taps anywhere else.
  useEffect(() => {
    if (!open || pointerType.current !== "touch") return;
    const close = (e: PointerEvent) => {
      if (!triggerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  if (!help) return <>{children}</>;

  return (
    <Tooltip open={open} onOpenChange={setOpen} delayDuration={150}>
      <TooltipTrigger asChild>
        <span
          ref={triggerRef}
          tabIndex={0}
          aria-label={`${label}: ${help.means} Next step: ${help.next}`}
          className="inline-flex rounded-full cursor-help focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
          onPointerDown={(e) => {
            pointerType.current = e.pointerType;
            wasOpen.current = open;
          }}
          onClick={(e) => {
            if (pointerType.current !== "touch") return;
            e.preventDefault();
            e.stopPropagation(); // a tap explains the status instead of opening the row
            setOpen(!wasOpen.current);
          }}
        >
          {children}
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[280px] px-3.5 py-3 text-left">
        <p className="text-xs font-semibold text-foreground">{label}</p>
        <p className="mt-1.5 text-xs leading-snug text-[#4D4D4D]">
          <span className="font-semibold text-foreground">What it means: </span>
          {help.means}
        </p>
        <p className="mt-1 text-xs leading-snug text-[#4D4D4D]">
          <span className="font-semibold text-foreground">Next step: </span>
          {help.next}
        </p>
      </TooltipContent>
    </Tooltip>
  );
};

export default StatusHelpTooltip;
