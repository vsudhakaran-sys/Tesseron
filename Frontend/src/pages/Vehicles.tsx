import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiGet } from "@/services/api";
import { PageHeader } from "@/components/feature-specific/fleet/PageHeader";
import { VehicleIcon } from "@/components/feature-specific/fleet/VehicleIcon";
import { AssignDriverDialog } from "@/components/feature-specific/fleet/AssignDriverDialog";
import { FilterChip } from "@/components/feature-specific/fleet/FilterChip";
import { Button } from "@/components/common/ui/button";
import { Input } from "@/components/common/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/common/ui/dropdown-menu";
import { Plus, Search, MoreHorizontal, Download } from "lucide-react";

// Mock data for vehicles
const initialVehiclesDataRaw = [];

export const vehiclesData: any[] = initialVehiclesDataRaw.map((vehicle) => ({
  mileageRecordingDate: "2025-08-10",
  fuelConsumption: vehicle.manufacturer === "Tesla" ? "18 kWh/100km" : "6.5 L/100km",
  seating: "5",
  driveType: "Rear-Wheel Drive",
  taxation: "Standard",
  batteryCapacity: vehicle.manufacturer === "Tesla" ? "75 kWh" : "N/A",
  range: vehicle.manufacturer === "Tesla" ? "500 km" : "N/A",
  maxChargingPower: vehicle.manufacturer === "Tesla" ? "250 kW" : "N/A",
  co2Value: vehicle.manufacturer === "Tesla" ? "0" : "148",
  fuelType: vehicle.manufacturer === "Tesla" ? "Electric" : "Petrol",
  tankVolume: vehicle.manufacturer === "Tesla" ? "0" : "59",
  transmissionType: "Automatic",
  ratedPower: "135 kW / 184 hp",
  manufactureDate: "2023-11-01",
  manufactureCountry: "Germany",
  doorsNumber: "4",
  interiorPaint: "Black",
  interiorMaterial: "Leather",
  interiorPadding: "Sport",
  torque: "300 Nm",
  gearsCount: "8",
  cylindersCount: vehicle.manufacturer === "Tesla" ? "0" : "4",
  cylinderArrangement: vehicle.manufacturer === "Tesla" ? "None" : "Inline",
  topSpeed: "235 km/h",
  acceleration: "7.1s",
  engineDisplacement: vehicle.manufacturer === "Tesla" ? "0 cc" : "1998 cc",
  emptyWeight: "1500 kg",
  maxWeightAllowed: "2050 kg",
  payload: "550 kg",
  bootCapacity: "480 L",
  axesCount: "2",
  drivenAxlesCount: "1",
  wheelbase: "2851 mm",
  length: "4709 mm",
  width: "1827 mm",
  height: "1435 mm",
  tireSizeAxle1: "225/45 R18",
  tireSizeAxle2: "255/40 R18",
  roofLoad: "75 kg",
  brakedTrailerLoad: "1600 kg",
  unbrakedTrailerLoad: "750 kg",
  ...vehicle,
}));

export function getVehicleById(id: string | number): any | undefined {
  return vehiclesData.find((v) => String(v.id) === String(id));
}

export function addVehicle(vehicle: any): any {
  const nextId = vehiclesData.length ? Math.max(...vehiclesData.map((v) => Number(v.id))) + 1 : 1;
  const record = { ...vehicle, id: nextId };
  vehiclesData.push(record);
  return record;
}

export function updateVehicle(vehicle: any): void {
  const idx = vehiclesData.findIndex((v) => v.id === vehicle.id);
  if (idx >= 0) vehiclesData[idx] = vehicle;
}

export function deleteVehicle(id: string | number): void {
  const idx = vehiclesData.findIndex((v) => String(v.id) === String(id));
  if (idx >= 0) vehiclesData.splice(idx, 1);
}

// DB row shape from GET /api/vehicles
interface VehicleRow {
  vehicle_id: string;
  plate: string | null;
  make: string | null;
  model: string | null;
  year: number | null;
  type: string | null;
  status: string | null;
  odometer_km: number | null;
  assigned_driver_id: string | null;
}

// Status values stored in DB, with label + badge colors.
export const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-success/15 text-success" },
  idle: { label: "Idle", className: "bg-muted text-muted-foreground" },
  in_shop: { label: "In Shop", className: "bg-warning/15 text-warning" },
};

export function VehicleStatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status || "—", className: "bg-muted text-muted-foreground" };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

// Human-friendly vehicle type label (cargo_van -> Cargo Van).
export function formatType(type: string | null): string {
  if (!type) return "—";
  return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// Map a DB row to the shape the table renders.
function mapVehicle(row: VehicleRow) {
  const currentYear = new Date().getFullYear();
  return {
    id: row.vehicle_id,
    displayName: row.plate || row.vehicle_id,
    manufacturer: row.make || "—",
    model: row.model || "—",
    type: row.type || "",
    driver: row.assigned_driver_id || "",
    mileage: row.odometer_km ?? 0,
    age: row.year ? currentYear - row.year : 0,
    status: row.status || "",
  };
}

export default function Vehicles() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>("active");
  const [assignTarget, setAssignTarget] = useState<any | null>(null);

  useEffect(() => {
    apiGet<VehicleRow[]>("/vehicles")
      .then((rows) => setVehicles(rows.map(mapVehicle)))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Reflect a new assignment in the table without a full refetch.
  const handleAssigned = (vehicleId: string, driverId: string) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === vehicleId ? { ...v, driver: driverId } : v))
    );
  };

  const handleUnassigned = (vehicleId: string) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === vehicleId ? { ...v, driver: "" } : v))
    );
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || vehicle.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in relative">
      <PageHeader
        title="Vehicles"
        description="Manage your fleet vehicles"
        actions={
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => navigate("/vehicles/new")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
          </div>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 py-2 border-b border-border">
        <FilterChip
          label="All"
          isActive={statusFilter === null}
          onClick={() => setStatusFilter(null)}
        />
        <span className="w-px h-5 bg-border mx-1" />
        {Object.entries(STATUS_CONFIG).map(([value, cfg]) => (
          <FilterChip
            key={value}
            label={cfg.label}
            isActive={statusFilter === value}
            onClick={() => setStatusFilter(statusFilter === value ? null : value)}
          />
        ))}
      </div>

      {/* Search and count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {loading ? (
            "Loading…"
          ) : error ? (
            <span className="text-destructive">Failed to load: {error}</span>
          ) : (
            <>
              <span className="font-semibold text-foreground">{filteredVehicles.length}</span> vehicles
            </>
          )}
        </p>
        <div className="relative w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="data-table-header">
              <TableHead className="w-12">
                <input type="checkbox" className="rounded border-border" />
              </TableHead>
              <TableHead className="font-semibold">Display Name</TableHead>
              <TableHead className="font-semibold">Manufacturer</TableHead>
              <TableHead className="font-semibold">Model</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Driver: Name</TableHead>
              <TableHead className="font-semibold">Mileage</TableHead>
              <TableHead className="font-semibold">Age (Years)</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVehicles.map((vehicle) => (
              <TableRow
                key={vehicle.id}
                className="data-table-row cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors"
                onClick={() => navigate(`/vehicles/${vehicle.id}/edit`)}
                onDoubleClick={() => navigate(`/vehicles/${vehicle.id}/edit`)}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <input type="checkbox" className="rounded border-border" />
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Link to={`/vehicles/${vehicle.id}`} className="group">
                    <VehicleIcon licensePlate={vehicle.displayName} className="group-hover:border-primary transition-colors" />
                  </Link>
                </TableCell>
                <TableCell className="text-foreground">{vehicle.manufacturer}</TableCell>
                <TableCell className="text-foreground">{vehicle.model}</TableCell>
                <TableCell className="text-foreground">{formatType(vehicle.type)}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  {vehicle.driver ? (
                    <Link to="/drivers" className="text-primary hover:underline">
                      {vehicle.driver}
                    </Link>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {vehicle.mileage ? (
                    <span className="text-foreground">{vehicle.mileage.toLocaleString()} km</span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {vehicle.age ? (
                    <span className="text-foreground">{vehicle.age}</span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <VehicleStatusBadge status={vehicle.status} />
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={`/vehicles/${vehicle.id}`}>View Details</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/vehicles/${vehicle.id}/edit`)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setAssignTarget(vehicle)}>Assign Driver</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => navigate(`/vehicles/${vehicle.id}/edit`)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {assignTarget && (
        <AssignDriverDialog
          open={!!assignTarget}
          onOpenChange={(open) => !open && setAssignTarget(null)}
          vehicleId={assignTarget.id}
          vehicleName={assignTarget.displayName}
          vehicleStatus={assignTarget.status}
          currentDriverId={assignTarget.driver || undefined}
          onAssigned={handleAssigned}
          onUnassigned={handleUnassigned}
        />
      )}
    </div>
  );
}





