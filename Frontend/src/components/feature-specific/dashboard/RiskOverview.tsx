import React from "react";
import { AlertCircle, Eye } from "lucide-react";
import { Button } from "@/components/common/ui/button";
import { Link } from "react-router-dom";

export interface RiskVehicle {
  vehicle_id: string;
  plate: string;
  make: string | null;
  model: string | null;
  riskScore: number;
  status: string | null;
}

export function RiskOverview({ data }: { data: RiskVehicle[] }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4 border-b border-border/50 pb-2">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-destructive" />
          Maintenance Risk Scores
        </h3>
        <span className="text-[10px] text-muted-foreground font-medium">
          Top 5 Critical Vehicles
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        {data.map((item, i) => {
          const isCritical = item.riskScore >= 75;
          const isMedium = item.riskScore >= 40 && item.riskScore < 75;

          const colorClass = isCritical
            ? "text-rose-600 bg-rose-50 dark:bg-rose-950/20"
            : isMedium
              ? "text-amber-600 bg-amber-50 dark:bg-amber-950/20"
              : "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20";

          return (
            <div key={item.vehicle_id} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className={`w-9 h-9 rounded-lg font-bold flex items-center justify-center text-sm ${colorClass}`}>
                  {item.riskScore}%
                </span>
                <div className="min-w-0">
                  <p className="font-mono font-bold text-slate-900 text-xs truncate">{item.plate}</p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {item.make} {item.model}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold capitalize ${
                  item.status === "active"
                    ? "bg-emerald-100 text-emerald-800"
                    : item.status === "in_shop"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-slate-100 text-slate-800"
                }`}>
                  {item.status === "in_shop" ? "in shop" : item.status}
                </span>

                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md" asChild>
                  <Link to={`/vehicles/${item.vehicle_id}`}>
                    <Eye className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
