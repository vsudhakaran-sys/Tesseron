import { cn } from "@/utils/utils";
import { ArrowUpRight } from "lucide-react";

export function KpiCard({
  title,
  value,
  subtitle,
  icon,
  accent = "primary",
  delay = 0,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: JSX.Element;
  accent?: "primary" | "amber" | "emerald" | "blue" | "violet";
  delay?: number;
}) {
  const accentMap: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    amber: "bg-amber-100 text-amber-600",
    emerald: "bg-emerald-100 text-emerald-600",
    blue: "bg-blue-100 text-blue-600",
    violet: "bg-violet-100 text-violet-600",
  };
  return (
    <div
      className="bg-card rounded-xl border border-border p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 animate-fade-up"
      style={{ animationDelay: `${delay}ms`, opacity: 0, animationFillMode: 'forwards' }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={cn("p-2.5 rounded-lg transition-transform duration-300", accentMap[accent])}>{icon}</div>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-40" />
      </div>
      <p className="text-2xl font-bold text-foreground leading-tight">{value}</p>
      <p className="text-xs font-semibold text-muted-foreground mt-0.5 uppercase tracking-wide">{title}</p>
      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
    </div>
  );
}

export function KpiCardSkeleton() {
  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="skeleton w-10 h-10 rounded-lg" />
        <div className="skeleton w-4 h-4 rounded" />
      </div>
      <div className="skeleton w-28 h-7 rounded mb-2" />
      <div className="skeleton w-20 h-3 rounded mb-1.5" />
      <div className="skeleton w-24 h-3 rounded" />
    </div>
  );
}
