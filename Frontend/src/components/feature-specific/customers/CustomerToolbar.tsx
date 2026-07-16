import { Search, Users, Check } from "lucide-react";
import { Input } from "@/components/common/ui/input";
import type { CustomerCopy, Locale } from "./translations";

interface CustomerToolbarProps {
  t: CustomerCopy;
  locale: Locale;
  totalCount: number;
  activeCount: number;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

// Filters & Search bar with summary stats
export function CustomerToolbar({
  t,
  locale,
  totalCount,
  activeCount,
  searchQuery,
  onSearchChange,
}: CustomerToolbarProps) {
  return (
    <div className="flex items-center justify-between bg-card rounded-xl border border-border shadow-sm p-4">
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center shrink-0">
            <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-base font-bold text-foreground leading-none">{totalCount}</p>
            <p className="text-[10px] text-muted-foreground font-medium tracking-wider mt-0.5">{locale === "nl" ? "Totaal klanten" : "Total Customers"}</p>
          </div>
        </div>
        <div className="w-px h-9 bg-border" />
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center shrink-0">
            <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-base font-bold text-foreground leading-none">{activeCount}</p>
            <p className="text-[10px] text-muted-foreground font-medium tracking-wider mt-0.5">{locale === "nl" ? "Actief" : "Active"}</p>
          </div>
        </div>
      </div>
      <div className="relative w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-9 text-xs bg-white dark:bg-slate-900"
        />
      </div>
    </div>
  );
}
