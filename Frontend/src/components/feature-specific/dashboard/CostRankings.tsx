import React from "react";
import { Coins, HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/common/ui/tooltip";

export interface CostVehicle {
  vehicle_id: string;
  plate: string | null;
  make: string | null;
  model: string | null;
  type: string | null;
  fuel: number;
  maintenance: number;
  insurance: number;
  leasing: number;
  overheads: number;
  total: number;
}

export function CostRankings({ data, locale }: { data: CostVehicle[]; locale: string }) {
  const fmtCurrency = (n: number) => {
    return new Intl.NumberFormat(locale === "en" ? "en-GB" : "nl-NL", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0
    }).format(n);
  };

  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4 border-b border-border/50 pb-2">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Coins className="h-4 w-4 text-emerald-600" />
          Top 5 Highest-Cost Vehicles
        </h3>
      </div>

      <div className="space-y-4">
        {data.map((item, idx) => {
          const fuelPct = (item.fuel / item.total) * 100;
          const maintPct = (item.maintenance / item.total) * 100;
          const insPct = (item.insurance / item.total) * 100;
          const leasePct = (item.leasing / item.total) * 100;
          const overPct = (item.overheads / item.total) * 100;

          return (
            <div key={item.vehicle_id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-muted flex items-center justify-center font-bold text-slate-500">
                    {idx + 1}
                  </span>
                  <span className="font-mono font-bold text-foreground">{item.plate || item.vehicle_id}</span>
                  <span className="text-muted-foreground text-[10px] hidden sm:inline">
                    {item.make} {item.model} ({item.type})
                  </span>
                </div>
                <span className="font-extrabold text-foreground">{fmtCurrency(item.total)}</span>
              </div>

              {/* Stacked Progress Bar */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-full h-3 rounded-full overflow-hidden flex cursor-pointer hover:scale-[1.01] transition-transform">
                      <div
                        style={{ width: `${fuelPct}%` }}
                        className="bg-amber-500 h-full transition-all"
                        title={`Fuel: ${fmtCurrency(item.fuel)}`}
                      />
                      <div
                        style={{ width: `${maintPct}%` }}
                        className="bg-blue-500 h-full transition-all"
                        title={`Maintenance: ${fmtCurrency(item.maintenance)}`}
                      />
                      <div
                        style={{ width: `${insPct}%` }}
                        className="bg-rose-500 h-full transition-all"
                        title={`Insurance: ${fmtCurrency(item.insurance)}`}
                      />
                      <div
                        style={{ width: `${leasePct}%` }}
                        className="bg-violet-500 h-full transition-all"
                        title={`Lease: ${fmtCurrency(item.leasing)}`}
                      />
                      <div
                        style={{ width: `${overPct}%` }}
                        className="bg-slate-400 h-full transition-all"
                        title={`Overheads: ${fmtCurrency(item.overheads)}`}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs p-3 space-y-1 bg-slate-900 text-white border-none shadow-xl rounded-lg">
                    <p className="font-bold border-b border-white/20 pb-1 mb-1 text-[11px] font-mono">Cost Distribution ({item.plate || item.vehicle_id})</p>
                    <div className="flex items-center gap-4 justify-between">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Fuel:</span>
                      <span className="font-bold">{fmtCurrency(item.fuel)}</span>
                    </div>
                    <div className="flex items-center gap-4 justify-between">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Maintenance:</span>
                      <span className="font-bold">{fmtCurrency(item.maintenance)}</span>
                    </div>
                    <div className="flex items-center gap-4 justify-between">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> Insurance:</span>
                      <span className="font-bold">{fmtCurrency(item.insurance)}</span>
                    </div>
                    <div className="flex items-center gap-4 justify-between">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-violet-500" /> Leasing:</span>
                      <span className="font-bold">{fmtCurrency(item.leasing)}</span>
                    </div>
                    <div className="flex items-center gap-4 justify-between">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-400" /> Overheads:</span>
                      <span className="font-bold">{fmtCurrency(item.overheads)}</span>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 pt-3 border-t border-border/40 text-[10px] text-muted-foreground justify-center">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-500" /> Fuel
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-blue-500" /> Maintenance
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-rose-500" /> Insurance
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-violet-500" /> Leasing
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-slate-400" /> Overheads
        </div>
      </div>
    </div>
  );
}
