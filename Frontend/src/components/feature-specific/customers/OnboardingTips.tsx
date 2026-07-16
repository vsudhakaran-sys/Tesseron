import { HelpCircle } from "lucide-react";
import type { OnboardingTip } from "./translations";

// Contextual "Helpful Tips" panel shown at the bottom of each wizard step
export function OnboardingTips({ tip }: { tip: OnboardingTip }) {
  return (
    <div className="mt-8 p-4 rounded-xl bg-blue-50/40 dark:bg-blue-950/10 border border-blue-100/60 dark:border-blue-900/30 text-xs space-y-2.5 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center gap-2 text-primary font-bold">
        <HelpCircle className="h-4 w-4 stroke-[2.5]" />
        <span>{tip.title}</span>
      </div>
      <ul className="space-y-2.5 text-muted-foreground font-medium">
        {tip.tips.map((t, idx) => (
          <li key={idx} className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 dark:bg-blue-600 mt-[5px] shrink-0" />
            <span className="text-xs leading-[1.6]">{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
