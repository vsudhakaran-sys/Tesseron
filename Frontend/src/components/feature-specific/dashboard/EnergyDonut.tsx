import { cn } from "@/utils/utils";

export interface EnergyBreakdownItem {
  energy_type: string;
  transactions: number;
  total_spend: string;
  total_quantity: string;
}

const energyColor: Record<string, string> = {
  Fuel: "bg-amber-500",
  Electric: "bg-emerald-500",
  Service: "bg-blue-500",
  Unknown: "bg-slate-400",
};

const fmtCurrency = (n: number, locale: string) => {
  return new Intl.NumberFormat(locale === "en" ? "en-GB" : "nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2
  }).format(n);
};

export function EnergyDonut({
  data,
  locale,
  t
}: {
  data: EnergyBreakdownItem[];
  locale: string;
  t: any;
}) {
  const total = data.reduce((s, d) => s + parseFloat(d.total_spend), 0);
  if (total === 0) return <p className="text-sm text-muted-foreground p-4">{t.dashboard.noData}</p>;
  let cumulPct = 0;
  const radius = 50;
  const cx = 60, cy = 60;
  const circumference = 2 * Math.PI * radius;
  const colorMap: Record<string, string> = {
    Fuel: "#f59e0b",
    Electric: "#10b981",
    Service: "#3b82f6",
    Unknown: "#94a3b8",
  };

  return (
    <div className="flex items-center gap-4">
      <svg width="120" height="120" viewBox="0 0 120 120">
        {data.map((d, i) => {
          const pct = parseFloat(d.total_spend) / total;
          const offset = circumference * (1 - pct);
          const rotation = cumulPct * 360 - 90;
          cumulPct += pct;
          const color = colorMap[d.energy_type] || "#94a3b8";
          return (
            <circle
              key={d.energy_type}
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth="18"
              strokeDasharray={`${pct * circumference} ${(1 - pct) * circumference}`}
              strokeDashoffset={circumference * 0.25}
              transform={`rotate(${rotation} ${cx} ${cy})`}
              className="transition-all duration-500"
            />
          );
        })}
        <circle cx={cx} cy={cy} r={34} fill="white" />
        <text x={cx} y={cy - 4} textAnchor="middle" className="text-xs" fill="#0f172a" fontSize="9" fontWeight="700">
          {data.length} {t.common.types}
        </text>
        <text x={cx} y={cy + 8} textAnchor="middle" fill="#64748b" fontSize="7">
          {t.common.energy}
        </text>
      </svg>
      <div className="flex flex-col gap-2 flex-1">
        {data.map((d, i) => (
          <div key={`${d.energy_type}-${i}`} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <div className={cn("w-2.5 h-2.5 rounded-full", energyColor[d.energy_type] || "bg-slate-400")} />
              <span className="text-xs font-medium text-slate-700">{d.energy_type}</span>
            </div>
            <span className="text-xs font-bold text-slate-900">{fmtCurrency(parseFloat(d.total_spend), locale)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
