import { LayoutGrid } from "lucide-react";
import { Switch } from "@/components/common/ui/switch";
import { SectionHeader } from "../SectionHeader";
import type { ModuleItem } from "../types";
import type { CustomerCopy, Locale } from "../translations";

interface ModulesStepProps {
  t: CustomerCopy;
  locale: Locale;
  modules: ModuleItem[];
  onToggle: (index: number) => void;
}

// Step 3: Modules
export function ModulesStep({ t, locale, modules, onToggle }: ModulesStepProps) {
  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="space-y-3">
        <SectionHeader icon={LayoutGrid} label={locale === "nl" ? "Beschikbare modules" : "Available Modules"} />
        <p className="text-xs text-muted-foreground">{t.modulesDesc}</p>
      </div>
      <div className="divide-y divide-border border border-border rounded-lg bg-background overflow-hidden">
        {modules.map((mod, idx) => (
          <div
            key={mod.name}
            className="flex items-center justify-between p-4 bg-card"
          >
            <div className="space-y-0.5 mr-4">
              <p className="text-xs font-bold text-foreground">{mod.name}</p>
              <p className="text-[10.5px] text-muted-foreground font-medium">{mod.desc}</p>
            </div>
            <Switch
              checked={mod.checked}
              onCheckedChange={() => onToggle(idx)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
