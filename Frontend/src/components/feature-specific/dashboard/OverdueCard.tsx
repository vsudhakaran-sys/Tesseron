import React from "react";
import { AlertTriangle, Wrench, Calendar, Milestone } from "lucide-react";

export function OverdueCard({ count }: { count: number }) {
  const isHighAlert = count > 10;

  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-4 border-b border-border/50 pb-2">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Wrench className="h-4 w-4 text-warning" />
          Maintenance Compliance
        </h3>
        <span className="text-[10px] bg-warning/10 text-warning px-2 py-0.5 rounded-full font-bold">
          Rule F3 Enforced
        </span>
      </div>

      <div className="flex items-start gap-4">
        <div className={`p-4 rounded-xl flex-shrink-0 flex items-center justify-center ${
          isHighAlert ? "bg-destructive/10 text-destructive animate-pulse" : "bg-warning/10 text-warning"
        }`}>
          <AlertTriangle className="h-7 w-7" />
        </div>

        <div className="flex-1 space-y-2">
          <div>
            <span className="text-2xl font-black text-foreground">{count}</span>
            <span className="text-xs text-muted-foreground ml-1.5">overdue for service</span>
          </div>

          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Rule F3 states a vehicle is overdue if never serviced, or if <span className="font-semibold text-foreground">&gt; 10,000 km</span> or <span className="font-semibold text-foreground">&gt; 180 days</span> have elapsed since the last service.
          </p>

          <div className="grid grid-cols-2 gap-2 text-[10px] pt-1 text-muted-foreground">
            <span className="flex items-center gap-1">
              <Milestone className="h-3 w-3 text-primary" /> Interval: 10,000 km
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-primary" /> Max Time: 180 Days
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
