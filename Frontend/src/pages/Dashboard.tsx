import { useEffect, useState } from "react";
import { cn } from "@/utils/utils";
import { apiGet } from "@/services/api";
import { PageHeader } from "@/components/feature-specific/fleet/PageHeader";
import {
  Fuel,
  Zap,
  Car,
  MapPin,
  TrendingUp,
  BarChart3,
  Clock,
  Gauge,
  ArrowUpRight,
  Loader2,
  AlertCircle,
  Activity,
  AreaChart as AreaChartIcon,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/common/ui/chart";
import { useLanguage } from "@/hooks/useLanguage";

// ──────────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────────

interface DashboardStats {
  totals: {
    total_transactions: number;
    unique_vehicles: number;
    unique_stations: number;
    total_spend: string;
    total_fuel_liters: string;
    avg_price_per_liter: string;
    total_kwh: string;
    avg_distance_between_fills: string;
  };
  energyBreakdown: Array<{
    energy_type: string;
    transactions: number;
    total_spend: string;
    total_quantity: string;
  }>;
  topVehicles: Array<{
    vehicle_number: string;
    transactions: number;
    total_spend: string;
    total_liters: string;
    total_kwh: string;
    last_transaction: string | null;
    last_odometer: number | null;
    avg_distance_fill: string;
  }>;
  topStations: Array<{
    station_name: string;
    location: string;
    visits: number;
    total_quantity: string;
    total_spend: string;
  }>;
  monthlyTrend: Array<{
    billing_date: string;
    transactions: number;
    net_purchase_value: string;
    fuel_liters: string;
  }>;
  recentTransactions: Array<{
    id?: number;
    vehicle_number: string;
    station_name: string;
    service_station_location: string;
    transaction_date: string;
    transaction_time: string;
    energy_type: string;
    product_type: string;
    quantity: string;
    unit: string;
    net_base_value: string;
    payment_currency: string;
    odometer: number | null;
    distance_since_last_fill: number | null;
  }>;
  productGroupBreakdown: Array<{
    product_group: string;
    transactions: number;
    total_spend: string;
  }>;
}

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────

const fmt = (n: number, locale: string, decimals = 2) =>
  n.toLocaleString(locale === "en" ? "en-GB" : "nl-NL", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

const fmtCurrency = (n: number, locale: string, currency = "EUR") => {
  // Ensure currency is a valid 3-letter ISO code, otherwise fallback to EUR
  const cleanCurrency = (typeof currency === 'string' && currency.length === 3) ? currency.toUpperCase() : "EUR";
  try {
    return new Intl.NumberFormat(locale === "en" ? "en-GB" : "nl-NL", {
      style: "currency",
      currency: cleanCurrency,
      maximumFractionDigits: 2
    }).format(n);
  } catch (e) {
    return new Intl.NumberFormat(locale === "en" ? "en-GB" : "nl-NL", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 2
    }).format(n);
  }
};

const fmtDate = (d: string | null, locale: string) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString(locale === "en" ? "en-GB" : "nl-NL", { day: "2-digit", month: "short", year: "numeric" });
};

const energyColor: Record<string, string> = {
  Fuel: "bg-amber-500",
  Electric: "bg-emerald-500",
  Service: "bg-blue-500",
  Unknown: "bg-slate-400",
};

const energyTextColor: Record<string, string> = {
  Fuel: "text-amber-600",
  Electric: "text-emerald-600",
  Service: "text-blue-600",
  Unknown: "text-slate-500",
};

const energyIcon: Record<string, JSX.Element> = {
  Fuel: <Fuel className="h-4 w-4" />,
  Electric: <Zap className="h-4 w-4" />,
  Service: <Activity className="h-4 w-4" />,
};

// ──────────────────────────────────────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────────────────────────────────────

function KpiCard({
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
        <div className={cn("p-2.5 rounded-lg transition-transform duration-300 group-hover:scale-110", accentMap[accent])}>{icon}</div>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-40" />
      </div>
      <p className="text-2xl font-bold text-foreground leading-tight">{value}</p>
      <p className="text-xs font-semibold text-muted-foreground mt-0.5 uppercase tracking-wide">{title}</p>
      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
    </div>
  );
}

function KpiCardSkeleton() {
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

function SectionSkeleton({ title, height = 120 }: { title?: string; height?: number }) {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      {title && (
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="skeleton w-32 h-4 rounded" />
          <div className="skeleton w-16 h-3 rounded" />
        </div>
      )}
      <div className="p-5 space-y-3">
        <div className="skeleton w-full rounded" style={{ height: `${height}px` }} />
        <div className="flex gap-2">
          {[40, 60, 30, 50, 45, 55].map((w, i) => (
            <div key={i} className="skeleton h-2 rounded" style={{ width: `${w}px` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border bg-slate-50/50">
        <div className="skeleton w-36 h-4 rounded" />
        <div className="skeleton w-20 h-3 rounded" />
      </div>
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3">
            <div className="skeleton w-6 h-6 rounded-full flex-shrink-0" />
            <div className="skeleton w-24 h-3 rounded" />
            <div className="skeleton w-12 h-3 rounded ml-auto" />
            <div className="skeleton w-20 h-3 rounded" />
            <div className="skeleton w-16 h-3 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Area chart using Recharts
function MonthlyAreaChart({ data, locale, t }: { data: DashboardStats["monthlyTrend"]; locale: string; t: any }) {
  if (!data.length) return <p className="text-sm text-muted-foreground p-4">{t.dashboard.noTrendData}</p>;

  // Transform data to ensure net_purchase_value is a number
  const chartData = data.map(d => ({
    ...d,
    net_purchase_value: parseFloat(d.net_purchase_value) || 0
  }));

  const chartConfig = {
    net_purchase_value: {
      label: t.dashboard.totalSpend,
      color: "hsl(var(--primary))",
    },
  };

  return (
    <div className="h-[130px] w-full pt-1">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
        >
          <defs>
            <linearGradient id="fillSpend" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-net_purchase_value)" stopOpacity={0.5} />
              <stop offset="95%" stopColor="var(--color-net_purchase_value)" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted/20" />
          <XAxis
            dataKey="billing_date"
            tickLine={false}
            axisLine={false}
            tickMargin={12}
            tickFormatter={(value) => {
              if (!value) return '';
              const d = new Date(value);
              if (isNaN(d.getTime())) return value;
              return d.toLocaleDateString(locale, { day: '2-digit', month: 'short' });
            }}
            fontSize={11}
          />
          <YAxis hide domain={['auto', 'auto']} />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Area
            dataKey="net_purchase_value"
            type="monotone"
            fill="url(#fillSpend)"
            stroke="var(--color-net_purchase_value)"
            strokeWidth={2.5}
            animationDuration={1500}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}

// Donut-style energy breakdown
function EnergyDonut({ data, locale, t }: { data: DashboardStats["energyBreakdown"]; locale: string; t: any }) {
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

// ──────────────────────────────────────────────────────────────────────────────
// Main Dashboard
// ──────────────────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { t: trans, locale } = useLanguage();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    apiGet<DashboardStats>("/fleetsync/dashboard-stats")
      .then((data) => {
        setStats(data);
        setLoading(false);
        setRefreshing(false);
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Unknown error");
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) {
    return (
      <div className="space-y-5">
        {/* Skeleton Header */}
        <div className="mb-8">
          <div className="skeleton w-48 h-9 rounded-lg mb-2" />
          <div className="skeleton w-96 h-4 rounded" />
        </div>
        {/* Skeleton KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map(i => <KpiCardSkeleton key={i} />)}
        </div>
        {/* Skeleton Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2"><SectionSkeleton title={trans.dashboard.monthlySpendTrend} height={110} /></div>
          <SectionSkeleton title={trans.dashboard.energyBreakdown} height={110} />
        </div>
        {/* Skeleton Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2"><TableSkeleton rows={5} /></div>
          <TableSkeleton rows={4} />
        </div>
        <TableSkeleton rows={6} />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-destructive">
        <AlertCircle className="h-8 w-8" />
        <p className="text-sm font-semibold">{trans.dashboard.loadingFailed} {error}</p>
        <p className="text-xs text-muted-foreground">{trans.dashboard.ensureRunning}</p>
      </div>
    );
  }

  const t = stats.totals;
  const totalSpend = parseFloat(t.total_spend);
  const fuelLiters = parseFloat(t.total_fuel_liters);
  const avgPrice = parseFloat(t.avg_price_per_liter);
  const avgDist = parseFloat(t.avg_distance_between_fills);

  return (
    <div className="space-y-5">
      <div
        className="animate-fade-up"
        style={{ animationDelay: '0ms', opacity: 0, animationFillMode: 'forwards' }}
      >
        <PageHeader
          title={trans.dashboard.title}
          description={trans.dashboard.description}
        />
      </div>

      {/* ── KPI Row 1 ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard
          title={trans.dashboard.totalSpend}
          value={fmtCurrency(totalSpend, locale)}
          subtitle={`${t.total_transactions} ${trans.dashboard.transactions}`}
          icon={<TrendingUp className="h-5 w-5" />}
          accent="primary"
          delay={80}
        />
        <KpiCard
          title={trans.dashboard.fuelVolume}
          value={`${fmt(fuelLiters, locale)} L`}
          subtitle={trans.common.avgPerLiter.replace("{price}", fmt(avgPrice, locale, 3))}
          icon={<Fuel className="h-5 w-5" />}
          accent="amber"
          delay={160}
        />
        <KpiCard
          title={trans.dashboard.activeVehicles}
          value={t.unique_vehicles}
          subtitle={trans.common.avgDistanceFills.replace("{km}", fmt(avgDist, locale, 0))}
          icon={<Car className="h-5 w-5" />}
          accent="blue"
          delay={240}
        />
        <KpiCard
          title={trans.dashboard.stationsUsed}
          value={t.unique_stations}
          subtitle={parseFloat(t.total_kwh) > 0 ? `${fmt(parseFloat(t.total_kwh), locale)} ${trans.dashboard.kwhElectric}` : trans.dashboard.fuelStations}
          icon={<MapPin className="h-5 w-5" />}
          accent="emerald"
          delay={320}
        />
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-fade-up" style={{ animationDelay: '400ms', opacity: 0, animationFillMode: 'forwards' }}>
        {/* Monthly Trend */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">{trans.dashboard.monthlySpendTrend}</h3>
              <p className="text-xs text-muted-foreground">{trans.dashboard.lastMonths.replace("{n}", stats.monthlyTrend.length.toString())}</p>
            </div>
            <AreaChartIcon className="h-4 w-4 text-muted-foreground" />
          </div>
          {stats.monthlyTrend.length > 0 ? (
            <MonthlyAreaChart data={stats.monthlyTrend} locale={locale} t={trans} />
          ) : (
            <div className="h-24 flex items-center justify-center text-sm text-muted-foreground text-center px-4">
              {trans.dashboard.noMonthlyData}
            </div>
          )}
        </div>

        {/* Energy Breakdown */}
        <div className="bg-card rounded-xl border border-border p-5 shadow-sm animate-scale-in" style={{ animationDelay: '500ms', opacity: 0, animationFillMode: 'forwards' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">{trans.dashboard.energyBreakdown}</h3>
              <p className="text-xs text-muted-foreground">{trans.dashboard.byTotalCost}</p>
            </div>
            <Gauge className="h-4 w-4 text-muted-foreground" />
          </div>
          {stats.energyBreakdown.length > 0 ? (
            <EnergyDonut data={stats.energyBreakdown} locale={locale} t={trans} />
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">{trans.dashboard.noData}</p>
          )}
        </div>
      </div>

      {/* ── Bottom Row: Vehicle Table + Stations + Recent Txns ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-fade-up" style={{ animationDelay: '560ms', opacity: 0, animationFillMode: 'forwards' }}>
        {/* Top Vehicles */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border overflow-hidden shadow-sm">
          <div className="flex items-center justify-between p-4 border-b border-border bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Car className="h-4 w-4 text-primary" />
              {trans.dashboard.vehicleOverview}
            </h3>
            <span className="text-xs text-muted-foreground">{trans.dashboard.byTotalSpend}</span>
          </div>
          {stats.topVehicles.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">{trans.dashboard.noVehicleData}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-slate-50/30">
                    <th className="text-left p-3 font-semibold text-muted-foreground">{trans.dashboard.vehicle}</th>
                    <th className="text-right p-3 font-semibold text-muted-foreground">{trans.dashboard.txns}</th>
                    <th className="text-right p-3 font-semibold text-muted-foreground">{trans.dashboard.totalSpend}</th>
                    <th className="text-right p-3 font-semibold text-muted-foreground">{trans.dashboard.fuel}</th>
                    <th className="text-right p-3 font-semibold text-muted-foreground hidden lg:table-cell">{trans.dashboard.odometer}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats.topVehicles.map((v, i) => (
                    <tr key={`${v.vehicle_number}-${i}`} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center bg-slate-100 text-slate-500 flex-shrink-0">
                            {i + 1}
                          </span>
                          <span className="font-semibold text-slate-900 font-mono">{v.vehicle_number}</span>
                        </div>
                      </td>
                      <td className="p-3 text-right text-slate-600">{v.transactions}</td>
                      <td className="p-3 text-right font-semibold text-slate-900">
                        {fmtCurrency(parseFloat(v.total_spend), locale)}
                      </td>
                      <td className="p-3 text-right font-medium">
                        {parseFloat(v.total_liters) > 0 ? (
                          <span className="text-amber-600">{fmt(parseFloat(v.total_liters), locale)} L</span>
                        ) : parseFloat(v.total_kwh) > 0 ? (
                          <span className="text-emerald-600">{fmt(parseFloat(v.total_kwh), locale)} kWh</span>
                        ) : (
                          <span className="text-amber-600 opacity-60 tooltip" title="Estimated based on spend">{fmt(parseFloat(v.total_spend) / (parseFloat(t.avg_price_per_liter) || 1.65), locale)} L</span>
                        )}
                      </td>
                      <td className="p-3 text-right text-slate-500 hidden lg:table-cell">
                        {v.last_odometer ? `${v.last_odometer.toLocaleString(locale === "en" ? "en-GB" : "nl-NL")} km` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right column: Top Stations + Recent Transactions */}
        <div className="flex flex-col gap-4">
          {/* Top Stations */}
          <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm flex-1">
            <div className="flex items-center justify-between p-4 border-b border-border bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-600" />
                {trans.dashboard.topStations}
              </h3>
            </div>
            <div className="divide-y divide-slate-100">
              {stats.topStations.length === 0 ? (
                <p className="p-4 text-xs text-muted-foreground text-center">No station data yet</p>
              ) : (
                stats.topStations.map((s, i) => (
                  <div key={`${s.station_name}-${s.location || ''}-${i}`} className="p-3 hover:bg-slate-50/60 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0 mr-2">
                        <p className="text-xs font-semibold text-slate-900 truncate">{s.station_name}</p>
                        <p className="text-xs text-muted-foreground truncate">{s.location || "Unknown location"}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs font-bold text-slate-900">{fmtCurrency(parseFloat(s.total_spend), locale)}</p>
                        <p className="text-xs text-muted-foreground">{s.visits} {trans.dashboard.visits}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Recent Transactions ── */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm animate-fade-up" style={{ animationDelay: '640ms', opacity: 0, animationFillMode: 'forwards' }}>
        <div className="flex items-center justify-between p-4 border-b border-border bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            {trans.dashboard.recentTransactions}
          </h3>
        </div>
        {stats.recentTransactions.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">{trans.dashboard.noTransactions}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-slate-50/30">
                  <th className="text-left p-3 font-semibold text-muted-foreground">{trans.dashboard.vehicle}</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground">{trans.dashboard.station}</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground hidden sm:table-cell">{trans.dashboard.type}</th>
                  <th className="text-right p-3 font-semibold text-muted-foreground">{trans.dashboard.qty}</th>
                  <th className="text-right p-3 font-semibold text-muted-foreground">{trans.dashboard.amount}</th>
                  <th className="text-right p-3 font-semibold text-muted-foreground hidden md:table-cell">{trans.dashboard.date}</th>
                  <th className="text-right p-3 font-semibold text-muted-foreground hidden lg:table-cell">{trans.dashboard.odometer}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.recentTransactions.map((txn, i) => (
                  <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3 font-mono font-semibold text-slate-900">{txn.vehicle_number ?? "—"}</td>
                    <td className="p-3">
                      <p className="font-medium text-slate-800 truncate max-w-[140px]">{txn.station_name}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[140px]">{txn.service_station_location}</p>
                    </td>
                    <td className="p-3 hidden sm:table-cell">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold",
                          txn.energy_type === "Fuel"
                            ? "bg-amber-100 text-amber-700"
                            : txn.energy_type === "Electric"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-blue-100 text-blue-700"
                        )}
                      >
                        {energyIcon[txn.energy_type] || <Activity className="h-4 w-4" />}
                        {txn.product_type || txn.energy_type || "Standard"}
                      </span>
                    </td>
                    <td className="p-3 text-right text-slate-600">
                      {isNaN(parseFloat(txn.quantity)) ? "0" : fmt(parseFloat(txn.quantity), locale)} {txn.unit || ""}
                    </td>
                    <td className="p-3 text-right font-semibold text-slate-900">
                      {isNaN(parseFloat(txn.net_base_value)) ? "—" : fmtCurrency(parseFloat(txn.net_base_value), locale, txn.payment_currency || "EUR")}
                    </td>
                    <td className="p-3 text-right text-slate-500 hidden md:table-cell">
                      {fmtDate(txn.transaction_date || new Date().toISOString(), locale)}
                    </td>
                    <td className="p-3 text-right text-slate-500 hidden lg:table-cell">
                      {txn.odometer ? `${txn.odometer.toLocaleString(locale === "en" ? "en-GB" : "nl-NL")} km` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
