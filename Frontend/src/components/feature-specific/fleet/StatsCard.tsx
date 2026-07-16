import { cn } from "@/utils/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "kpi-card group",
        className
      )}
    >
      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-1.5">
          <p className="text-xs font-bold text-slate-500 tracking-wider uppercase">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
            {trend && (
              <span
                className={cn(
                  "text-xs font-bold px-1.5 py-0.5 rounded-md",
                  trend.isPositive ? "status-active" : "status-critical"
                )}
              >
                {trend.isPositive ? "+" : "-"} {trend.value}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs font-medium text-slate-400">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-primary transition-all duration-200 group-hover:bg-primary group-hover:text-white group-hover:scale-105">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
}



