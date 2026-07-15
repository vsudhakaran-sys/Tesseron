import React from "react";
import { Gauge, Car, UserCheck } from "lucide-react";

export interface UtilizationData {
  total: number;
  active: number;
  activeWithDriver: number;
  utilizationPct: number;
}

export function UtilizationCard({ data, locale }: { data: UtilizationData; locale: string }) {
  const pct = Math.round(data.utilizationPct);
  // Calculate SVG stroke offset for gauge (semi-circle or full-circle)
  const radius = 45;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-4 border-b border-border/50 pb-2">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Gauge className="h-4 w-4 text-primary" />
          Fleet Utilization
        </h3>
        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
          Rule F4 Enforced
        </span>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative flex items-center justify-center">
          <svg height={100} width={100} className="transform -rotate-90">
            <circle
              stroke="hsl(var(--muted)/0.3)"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={50}
              cy={50}
            />
            <circle
              stroke="hsl(var(--primary))"
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={circumference + " " + circumference}
              style={{ strokeDashoffset }}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={50}
              cy={50}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute text-center">
            <span className="text-xl font-black text-foreground">{pct}%</span>
            <p className="text-[8px] text-muted-foreground uppercase font-bold tracking-wide">Utilized</p>
          </div>
        </div>

        <div className="space-y-2 flex-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Car className="h-3.5 w-3.5" /> Total Fleet
            </span>
            <span className="font-bold text-foreground">{data.total} vehicles</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <UserCheck className="h-3.5 w-3.5 text-success" /> Active Status
            </span>
            <span className="font-semibold text-slate-800">{data.active} active</span>
          </div>
          <div className="flex items-center justify-between border-t border-border/50 pt-1.5 mt-1.5">
            <span className="text-muted-foreground text-[10px]">Active & Assigned</span>
            <span className="font-semibold text-foreground">{data.activeWithDriver} driver-assigned</span>
          </div>
        </div>
      </div>
    </div>
  );
}
