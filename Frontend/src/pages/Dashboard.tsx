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
import { useLanguage } from "@/hooks/useLanguage";
import { KpiCard, KpiCardSkeleton } from "@/components/feature-specific/dashboard/KpiCard";
import { SectionSkeleton, TableSkeleton } from "@/components/feature-specific/dashboard/Skeletons";
import { MonthlyAreaChart } from "@/components/feature-specific/dashboard/MonthlyAreaChart";
import { EnergyDonut } from "@/components/feature-specific/dashboard/EnergyDonut";
import { UtilizationCard } from "@/components/feature-specific/dashboard/UtilizationCard";
import { OverdueCard } from "@/components/feature-specific/dashboard/OverdueCard";
import { CostRankings } from "@/components/feature-specific/dashboard/CostRankings";
import { RiskOverview } from "@/components/feature-specific/dashboard/RiskOverview";

// ──────────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────────

interface DashboardStats {
  kpiVehicles: {
    total: number;
    active: number;
    activeWithDriver: number;
    utilizationPct: number;
  };
  overdueCount: number;
  top5HighestCost: Array<{
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
  }>;
  top5Risk: Array<{
    vehicle_id: string;
    plate: string;
    make: string | null;
    model: string | null;
    riskScore: number;
    status: string | null;
  }>;
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

const energyIcon: Record<string, JSX.Element> = {
  Fuel: <Fuel className="h-4 w-4" />,
  Electric: <Zap className="h-4 w-4" />,
  Service: <Activity className="h-4 w-4" />,
};

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
        {/* Skeleton Utilization & Overdue Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SectionSkeleton height={100} />
          <SectionSkeleton height={100} />
        </div>
        {/* Skeleton Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2"><SectionSkeleton title={trans.dashboard.monthlySpendTrend} height={110} /></div>
          <SectionSkeleton title={trans.dashboard.energyBreakdown} height={110} />
        </div>
        {/* Skeleton Operational Insights Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SectionSkeleton title="Top 5 Highest-Cost Vehicles" height={150} />
          <SectionSkeleton title="Maintenance Risk Scores" height={150} />
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
  const totalSpend = parseFloat(t?.total_spend || "0");
  const fuelLiters = parseFloat(t?.total_fuel_liters || "0");
  const avgPrice = parseFloat(t?.avg_price_per_liter || "0");
  const avgDist = parseFloat(t?.avg_distance_between_fills || "0");
  const hasTelemetryData = t && parseInt(t.total_transactions || "0") > 0;

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

      {/* ── KPI Row 1 (Telemetry) ── */}
      {hasTelemetryData && (
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
      )}

      {/* ── Core Fleet KPI Row ── */}
      {!hasTelemetryData && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard
            title="Total Vehicles"
            value={stats.kpiVehicles.total}
            subtitle="Registered Fleet"
            icon={<Car className="h-5 w-5" />}
            accent="blue"
            delay={80}
          />
          <KpiCard
            title="Active Vehicles"
            value={stats.kpiVehicles.active}
            subtitle={`${stats.kpiVehicles.total - stats.kpiVehicles.active} Inactive/Idle`}
            icon={<Activity className="h-5 w-5" />}
            accent="emerald"
            delay={160}
          />
          <KpiCard
            title="Drivers Assigned"
            value={stats.kpiVehicles.activeWithDriver}
            subtitle={`${stats.kpiVehicles.active - stats.kpiVehicles.activeWithDriver} Vehicles Unassigned`}
            icon={<BarChart3 className="h-5 w-5" />}
            accent="primary"
            delay={240}
          />
          <KpiCard
            title="Overdue Service"
            value={stats.overdueCount}
            subtitle="Rule F3 Violation"
            icon={<AlertCircle className="h-5 w-5" />}
            accent="destructive"
            delay={320}
          />
        </div>
      )}

      {/* ── Utilization & Overdue Row ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-up" style={{ animationDelay: '200ms', opacity: 0, animationFillMode: 'forwards' }}>
        <UtilizationCard data={stats.kpiVehicles} locale={locale} />
        <OverdueCard count={stats.overdueCount} />
      </div>

      {/* ── Charts Row (Telemetry) ── */}
      {hasTelemetryData && (
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
      )}

      {/* ── Operational Insights (Costs & Risks) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fade-up" style={{ animationDelay: '500ms', opacity: 0, animationFillMode: 'forwards' }}>
        <CostRankings data={stats.top5HighestCost} locale={locale} />
        <RiskOverview data={stats.top5Risk} />
      </div>

      {/* ── Bottom Row: Vehicle Table + Stations + Recent Txns (Telemetry) ── */}
      {hasTelemetryData && (
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
      )}

      {/* ── Recent Transactions (Telemetry) ── */}
      {hasTelemetryData && (
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
      )}

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
