import { Check } from "lucide-react";
import { cn } from "@/utils/utils";

interface WizardStepperProps {
  steps: { label: string }[];
  currentStep: number;
  onStepClick: (idx: number) => void;
}

// Progressive stepper with clickable completed nodes and a fill line
export function WizardStepper({ steps, currentStep, onStepClick }: WizardStepperProps) {
  const lastIndex = steps.length - 1;

  return (
    <div className="px-10 mt-5 relative">
      <div className="relative flex items-center justify-between w-full">
        {/* Connecting Line Container */}
        <div className="absolute left-3 right-3 top-1/2 -translate-y-1/2 h-[2px] z-0">
          <div className="w-full h-full bg-slate-100 dark:bg-slate-800 relative">
            <div
              className="absolute left-0 top-0 h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${(currentStep / lastIndex) * 100}%` }}
            />
          </div>
        </div>

        {steps.map((step, idx) => {
          const isActive = currentStep === idx;
          const isDone = currentStep > idx;

          // Only allow clicking to steps that have already been completed/reached
          const canClick = idx <= currentStep || isDone;

          return (
            <div
              key={step.label}
              className="relative z-10 flex flex-col items-center group"
            >
              <button
                type="button"
                disabled={!canClick}
                onClick={() => onStepClick(idx)}
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center border text-[10px] font-bold transition-all duration-300 bg-card",
                  isActive
                    ? "border-primary text-primary shadow-[0_0_0_3px_rgba(32,80,236,0.15)] ring-2 ring-primary/10"
                    : isDone
                    ? "bg-primary border-primary text-white cursor-pointer hover:bg-primary/95"
                    : "border-slate-200 dark:border-slate-800 text-muted-foreground cursor-not-allowed bg-slate-50 dark:bg-slate-900"
                )}
              >
                {isDone ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : idx + 1}
              </button>

              {/* Step label below the node */}
              <span
                className={cn(
                  "absolute top-8 text-[9px] font-semibold tracking-wide whitespace-nowrap transition-colors duration-200",
                  isActive ? "text-foreground font-bold" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Spacer to push content below the absolute labels */}
      <div className="h-8" />
    </div>
  );
}
