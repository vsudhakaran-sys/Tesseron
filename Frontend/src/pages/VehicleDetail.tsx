import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiGet, apiPut } from "@/services/api";
import { VehicleStatusBadge, formatType } from "./Vehicles";
import { VehicleData } from "@/components/feature-specific/fleet/VehicleData";
import { VehicleTechnicalData } from "@/components/feature-specific/fleet/VehicleTechnicalData";
import { Button } from "@/components/common/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/common/ui/tabs";
import { toast } from "sonner";
import {
  Car,
  ArrowLeft,
  Route,
  MapPin,
  User,
  FileText,
  AlertTriangle,
} from "lucide-react";

// DB row shape from GET /api/vehicles/:id
interface VehicleRow {
  vehicle_id: string;
  plate: string | null;
  make: string | null;
  model: string | null;
  year: number | null;
  type: string | null;
  status: string | null;
  odometer_km: number | null;
  acquisition_date: string | null;
  last_service_date: string | null;
  last_service_odometer_km: number | null;
  assigned_driver_id: string | null;
  assigned_driver_name?: string | null;
}

// Trip row from GET /api/vehicles/:id/trips
interface Trip {
  trip_id: string;
  driver_id: string | null;
  trip_date: string | null;
  origin: string | null;
  destination: string | null;
  distance_km: string | null;
  duration_hr: string | null;
  fuel_liters: string | null;
  fuel_cost: string | null;
  purpose: string | null;
}

function fmtDate(d: string | null): string {
  if (!d) return "—";
  const date = new Date(d);
  return isNaN(date.getTime()) ? "—" : date.toLocaleDateString();
}

export default function VehicleDetail() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState<VehicleRow | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [tripsLoading, setTripsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    apiGet<VehicleRow>(`/vehicles/${id}`)
      .then(setVehicle)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    apiGet<Trip[]>(`/vehicles/${id}/trips?limit=25`)
      .then(setTrips)
      .catch(() => setTrips([]))
      .finally(() => setTripsLoading(false));
  }, [id]);

  if (loading) {
    return <div className="p-8 text-muted-foreground text-xs">Loading…</div>;
  }
  if (error || !vehicle) {
    return (
      <div className="p-8">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link to="/vehicles">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Link>
        </Button>
        <p className="text-destructive text-xs">{error || "Vehicle not found"}</p>
      </div>
    );
  }

  const displayName = vehicle.plate || vehicle.vehicle_id;
  const age = vehicle.year ? new Date().getFullYear() - vehicle.year : null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back button and header */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" asChild className="mt-1">
          <Link to="/vehicles">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-semibold text-foreground">
              {displayName}
            </h1>
            <VehicleStatusBadge status={vehicle.status || ""} />
          </div>
          <p className="text-sm text-muted-foreground">
            {vehicle.make || "—"} {vehicle.model || ""} • {formatType(vehicle.type)}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-muted/50 w-full justify-start">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vehicle-data">Vehicle Data</TabsTrigger>
          <TabsTrigger value="technical">Technical Data</TabsTrigger>
          <TabsTrigger value="drivers">Drivers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - KPIs and Overview */}
            <div className="lg:col-span-2 space-y-6">
              {/* KPIs */}
              <div className="bg-card rounded-lg border border-border p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="font-semibold text-foreground text-xs">KPIs</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-muted/30">
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                      Odometer
                    </p>
                    <p className="text-lg font-semibold text-primary">
                      {vehicle.odometer_km != null ? `${vehicle.odometer_km.toLocaleString()} km` : "—"}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30">
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                      Age
                    </p>
                    <p className="text-lg font-semibold text-foreground">
                      {age != null ? `${age} yr` : "—"}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-[10px] text-muted-foreground">
                      <span>Year {vehicle.year ?? "—"}</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30">
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                      Last Service
                    </p>
                    <p className="text-lg font-semibold text-foreground">
                      {fmtDate(vehicle.last_service_date)}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-[10px] text-muted-foreground">
                      <span>
                        {vehicle.last_service_odometer_km != null
                          ? `${vehicle.last_service_odometer_km.toLocaleString()} km`
                          : "—"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Overview Details */}
              <div className="bg-card rounded-lg border border-border p-5 shadow-sm">
                <h3 className="font-semibold text-foreground mb-4 text-xs">Overview</h3>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start text-xs h-8">
                    <MapPin className="h-4 w-4 mr-2" />
                    Address book
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-xs">
                    <div className="flex justify-between py-0.5 border-b border-border/40">
                      <span className="text-muted-foreground">Vehicle ID</span>
                      <span className="text-foreground font-mono text-xs">{vehicle.vehicle_id}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/40">
                      <span className="text-muted-foreground">License plate</span>
                      <span className="text-foreground">{vehicle.plate || "—"}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/40">
                      <span className="text-muted-foreground">Type</span>
                      <span className="text-foreground">{formatType(vehicle.type)}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/40">
                      <span className="text-muted-foreground">Status</span>
                      <VehicleStatusBadge status={vehicle.status || ""} />
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/40">
                      <span className="text-muted-foreground">Assigned driver</span>
                      {vehicle.assigned_driver_id ? (
                        <Link to={`/drivers/${vehicle.assigned_driver_id}`} className="text-primary hover:underline">
                          {vehicle.assigned_driver_name || vehicle.assigned_driver_id}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">Unassigned</span>
                      )}
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/40">
                      <span className="text-muted-foreground">Odometer</span>
                      <span className="text-foreground">
                        {vehicle.odometer_km != null ? `${vehicle.odometer_km.toLocaleString()} km` : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/40">
                      <span className="text-muted-foreground">Model year</span>
                      <span className="text-foreground">{vehicle.year ?? "—"}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/40">
                      <span className="text-muted-foreground">Acquisition date</span>
                      <span className="text-foreground">{fmtDate(vehicle.acquisition_date)}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/40">
                      <span className="text-muted-foreground">Last service date</span>
                      <span className="text-foreground">{fmtDate(vehicle.last_service_date)}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/40">
                      <span className="text-muted-foreground">Last service odometer</span>
                      <span className="text-foreground">
                        {vehicle.last_service_odometer_km != null
                          ? `${vehicle.last_service_odometer_km.toLocaleString()} km`
                          : "—"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Add-ons */}
              <div className="bg-card rounded-lg border border-border p-5 shadow-sm">
                <h3 className="font-semibold text-foreground mb-4 text-xs">Add-ons</h3>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Mileage Integration</span>
                  <span className="text-muted-foreground">✕ Not eligible</span>
                </div>
              </div>
            </div>

            {/* Right column - This week and History */}
            <div className="space-y-6">
              {/* This week */}
              <div className="bg-card rounded-lg border border-border p-5 shadow-sm">
                <h3 className="font-semibold text-foreground mb-4 text-xs">This week</h3>
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <FileText className="h-5 w-5 text-warning" />
                  <span className="text-xs text-muted-foreground">
                    Exact vehicle model unknown
                  </span>
                </div>
              </div>

              {/* Vehicle history — trip timeline */}
              <div className="bg-card rounded-lg border border-border p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground text-xs">Vehicle history</h3>
                  <span className="text-[10px] text-muted-foreground">{trips.length} trips</span>
                </div>

                {tripsLoading ? (
                  <p className="text-xs text-muted-foreground">Loading trips…</p>
                ) : trips.length === 0 ? (
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">No trips recorded</span>
                  </div>
                ) : (
                  <div className="relative max-h-[480px] overflow-y-auto pr-1">
                    {/* Timeline line */}
                    <div className="absolute left-[5px] top-2 bottom-2 w-px bg-border" />

                    <div className="space-y-4">
                      {trips.map((trip, index) => (
                        <div key={trip.trip_id} className="flex gap-4 relative">
                          <div
                            className={`w-3 h-3 rounded-full mt-1.5 z-10 ${
                              index === 0 ? "bg-primary" : "bg-muted-foreground"
                            }`}
                          />
                          <div className="flex-1 pb-4">
                            <div className="flex items-start gap-2">
                              <Route className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                              <div className="min-w-0 flex-1">
                                <p className="text-xs text-foreground">
                                  {trip.origin || "—"} → {trip.destination || "—"}
                                </p>
                                <p className="text-[10px] text-muted-foreground mt-1">
                                  {fmtDate(trip.trip_date)}
                                  {trip.purpose ? ` • ${formatType(trip.purpose)}` : ""}
                                  {trip.driver_id ? ` • ${trip.driver_id}` : ""}
                                </p>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-[10px] text-muted-foreground">
                                  <span>{Number(trip.distance_km ?? 0).toLocaleString()} km</span>
                                  <span>{Number(trip.duration_hr ?? 0)} hr</span>
                                  <span>${Number(trip.fuel_cost ?? 0).toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="vehicle-data" className="mt-6">
          <VehicleData 
            vehicle={vehicle} 
            onUpdate={(fieldKey, val) => {
              apiPut<VehicleRow>(`/vehicles/${id}`, { [fieldKey]: val })
                .then(setVehicle)
                .then(() => toast.success("Field updated successfully"))
                .catch((err) => toast.error(`Update failed: ${err.message}`));
            }} 
          />
        </TabsContent>

        <TabsContent value="technical" className="mt-6">
          <VehicleTechnicalData 
            vehicle={vehicle} 
            onUpdate={(fieldKey, val) => {
              apiPut<VehicleRow>(`/vehicles/${id}`, { [fieldKey]: val })
                .then(setVehicle)
                .then(() => toast.success("Field updated successfully"))
                .catch((err) => toast.error(`Update failed: ${err.message}`));
            }} 
          />
        </TabsContent>

        <TabsContent value="drivers" className="mt-6">
          <div className="bg-card rounded-lg border border-border p-8 text-center">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2 text-xs">Driver History</h3>
            <p className="text-muted-foreground text-xs">
              View and manage driver assignments for this vehicle.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
