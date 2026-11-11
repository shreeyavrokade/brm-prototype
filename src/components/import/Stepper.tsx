import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepperProps {
  steps: string[];
  current: number; // 0-indexed
}

const Stepper = ({ steps, current }: StepperProps) => {
  return (
    <div className="flex items-start justify-center w-full max-w-3xl mx-auto">
      {steps.map((label, idx) => {
        const isCompleted = idx < current;
        const isActive = idx === current;
        const isLast = idx === steps.length - 1;
        return (
          <div key={label} className={cn("flex items-start", !isLast && "flex-1")}>
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold",
                  isCompleted && "bg-base-positive text-atmo-10",
                  isActive && "bg-brand-secondary text-brand-secondary-invert",
                  !isCompleted && !isActive && "bg-atmo-4 text-atmo-0"
                )}
              >
                {isCompleted ? <Check className="h-3.5 w-3.5 text-success" /> : idx + 1}
              </div>
              <div
                className={cn(
                  "mt-2 text-sm whitespace-nowrap pb-1",
                  isActive
                    ? "font-semibold text-primary-200 border-b-2 border-brand"
                    : "text-atmo-9 border-b-2 border-transparent"
                )}
              >
                {label}
              </div>
            </div>
            {!isLast && (
              <div className="flex-1 h-px mt-3.5 mx-2">
                <div
                  className={cn(
                    "h-px w-full",
                    idx < current ? "bg-base-positive" : "bg-atmo-4"
                  )}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;
