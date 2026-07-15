import type { LucideIcon } from "lucide-react";

// Section header with icon marker + label + gradient rule (unified blue scheme)
export function SectionHeader({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="flex items-center gap-3 pt-1 pb-0.5 group/header">
      <div className="flex items-center justify-center w-7 h-7 rounded-xl border text-primary bg-primary/5 border-primary/10 transition-transform duration-300 group-hover/header:scale-105 shadow-sm shrink-0">
        <Icon className="h-4 w-4" />
      </div>
      <span className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-250 font-display">
        {label}
      </span>
      <div className="flex-1 h-px bg-gradient-to-r from-border/80 to-transparent ml-2" />
    </div>
  );
}
