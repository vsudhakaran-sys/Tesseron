import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/services/api";
import { StatusBadge } from "@/components/feature-specific/fleet/StatusBadge";
import { StatsCard } from "@/components/feature-specific/fleet/StatsCard";
import { Button } from "@/components/common/ui/button";
import { Avatar, AvatarFallback } from "@/components/common/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/common/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/ui/table";
import {
  ArrowLeft,
  Edit,
  Car,
  Route as RouteIcon,
  Fuel,
  Gauge,
} from "lucide-react";

interface DriverDetail {
  driver_id: string;
  name: string;
  license_class: string | null;
  hire_date: string | null;
  status: string;
  assigned_vehicle_id: string | null;
  vehicle_plate: string | null;
  vehicle_make: string | null;
  vehicle_model: string | null;
  vehicle_year: number | null;
  vehicle_type: string | null;
  vehicle_status: string | null;
  vehicle_odometer_km: number | null;
}

interface Trip {
  trip_id: string;
  vehicle_id: string;
  driver_id: string;
  trip_date: string | null;
  origin: string | null;
  destination: string | null;
  distance_km: string | number | null;
  duration_hr: string | number | null;
  fuel_liters: string | number | null;
  fuel_cost: string | number | null;
  purpose: string | null;
}

type BadgeStatus = "active" | "inactive" | "maintenance" | "available" | "assigned";
const BADGE_STATUSES: BadgeStatus[] = [
  "active",
  "inactive",
  "maintenance",
  "available",
  "assigned",
];
const toBadgeStatus = (status: string | null): BadgeStatus =>
  status && (BADGE_STATUSES as string[]).includes(status)
    ? (status as BadgeStatus)
    : "inactive";

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

const formatDate = (value: string | null) => {
  if (!value) return "—";
  const d = new Date(value);
  return isNaN(d.getTime())
    ? value
    : d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
};

const num = (v: string | number | null | undefined) => {
  if (v === null || v === undefined || v === "") return 0;
  const n = typeof v === "number" ? v : parseFloat(v);
  return isNaN(n) ? 0 : n;
};

export default function DriverDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const driverId = id ?? "";

  const {
    data: driver,
    isLoading,
    isError,
    error,
  } = useQuery<DriverDetail>({
    queryKey: ["driver", driverId],
    queryFn: () => apiGet<DriverDetail>(`/fleetsync/drivers/${driverId}`),
    enabled: !!driverId,
    retry: false,
  });

  const { data: trips = [], isLoading: tripsLoading } = useQuery<Trip[]>({
    queryKey: ["driver-trips", driverId],
    queryFn: () => apiGet<Trip[]>(`/fleetsync/drivers/${driverId}/trips`),
    enabled: !!driverId,
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="mt-1">
            <Link to="/drivers">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <p className="text-muted-foreground">Loading driver…</p>
        </div>
      </div>
    );
  }

  if (isError || !driver) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" asChild className="mt-1">
            <Link to="/drivers">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold text-foreground">Driver</h1>
        </div>
        <div className="bg-card rounded-xl border border-border border-dashed p-12 text-center">
          <p className="text-sm font-semibold text-foreground">
            {(error as Error)?.message ?? "Driver not found"}
          </p>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/drivers")}>
            Back to Drivers
          </Button>
        </div>
      </div>
    );
  }

  const vehicleName =
    [driver.vehicle_make, driver.vehicle_model].filter(Boolean).join(" ") ||
    driver.vehicle_plate ||
    driver.assigned_vehicle_id;

  const totalDistance = trips.reduce((sum, t) => sum + num(t.distance_km), 0);
  const totalFuelCost = trips.reduce((sum, t) => sum + num(t.fuel_cost), 0);
  const totalFuelLiters = trips.reduce((sum, t) => sum + num(t.fuel_liters), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" asChild className="mt-1">
          <Link to="/drivers">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Avatar className="h-11 w-11">
            <AvatarFallback className="bg-primary/10 text-primary text-sm">
              {getInitials(driver.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex items-center gap-3 mb-0.5">
              <h1 className="text-2xl font-semibold text-foreground truncate">
                {driver.name}
              </h1>
              <StatusBadge status={toBadgeStatus(driver.status)} />
            </div>
            <p className="text-sm text-muted-foreground font-mono">
              {driver.driver_id}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate(`/drivers/${driver.driver_id}/edit`)}
          className="shrink-0"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-muted/50 w-full justify-start">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trips">Trips ({trips.length})</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="mt-6">
          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatsCard title="Total Trips" value={trips.length} icon={RouteIcon} />
            <StatsCard
              title="Distance"
              value={`${totalDistance.toFixed(0)} km`}
              icon={Gauge}
            />
            <StatsCard
              title="Fuel Used"
              value={`${totalFuelLiters.toFixed(1)} L`}
              icon={Fuel}
            />
            <StatsCard
              title="Fuel Cost"
              value={`EUR ${totalFuelCost.toFixed(2)}`}
              icon={Fuel}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Driver details */}
            <div className="bg-card rounded-lg border border-border p-5 shadow-sm">
              <h3 className="font-semibold text-foreground mb-4">Driver Details</h3>
              <div className="space-y-3 text-sm">
                <Row label="Driver ID" value={driver.driver_id} mono />
                <Row label="Name" value={driver.name} />
                <Row label="License Class" value={driver.license_class || "—"} />
                <Row label="Hire Date" value={formatDate(driver.hire_date)} />
                <Row label="Status" value={driver.status} />
              </div>
            </div>

            {/* Assigned vehicle */}
            <div className="bg-card rounded-lg border border-border p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Car className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold text-foreground">Assigned Vehicle</h3>
              </div>
              {driver.assigned_vehicle_id ? (
                <div className="space-y-3 text-sm">
                  <Row
                    label="Vehicle"
                    valueNode={
                      <Link to="/vehicles" className="text-primary hover:underline">
                        {vehicleName}
                      </Link>
                    }
                  />
                  <Row label="Plate" value={driver.vehicle_plate || "—"} mono />
                  <Row label="Year" value={driver.vehicle_year ?? "—"} />
                  <Row label="Type" value={driver.vehicle_type || "—"} />
                  <Row
                    label="Odometer"
                    value={
                      driver.vehicle_odometer_km != null
                        ? `${driver.vehicle_odometer_km.toLocaleString()} km`
                        : "—"
                    }
                  />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No vehicle assigned.</p>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Trips */}
        <TabsContent value="trips" className="mt-6">
          <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="data-table-header">
                  <TableHead className="font-semibold">Trip</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold">Route</TableHead>
                  <TableHead className="font-semibold text-right">Distance</TableHead>
                  <TableHead className="font-semibold text-right">Fuel</TableHead>
                  <TableHead className="font-semibold text-right">Cost</TableHead>
                  <TableHead className="font-semibold">Purpose</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tripsLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                      Loading trips…
                    </TableCell>
                  </TableRow>
                ) : trips.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                      No trips recorded.
                    </TableCell>
                  </TableRow>
                ) : (
                  trips.map((trip) => (
                    <TableRow key={trip.trip_id} className="data-table-row">
                      <TableCell className="font-mono text-sm">{trip.trip_id}</TableCell>
                      <TableCell>{formatDate(trip.trip_date)}</TableCell>
                      <TableCell>
                        <span className="text-foreground">{trip.origin}</span>
                        <span className="text-muted-foreground"> → </span>
                        <span className="text-foreground">{trip.destination}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        {num(trip.distance_km).toFixed(1)} km
                      </TableCell>
                      <TableCell className="text-right">
                        {num(trip.fuel_liters).toFixed(1)} L
                      </TableCell>
                      <TableCell className="text-right">
                        EUR {num(trip.fuel_cost).toFixed(2)}
                      </TableCell>
                      <TableCell className="capitalize">{trip.purpose}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Row({
  label,
  value,
  valueNode,
  mono,
}: {
  label: string;
  value?: string | number;
  valueNode?: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      {valueNode ?? (
        <span className={`text-foreground ${mono ? "font-mono text-xs" : ""}`}>
          {value}
        </span>
      )}
    </div>
  );
}
