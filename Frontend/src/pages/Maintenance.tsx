import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { apiGet } from "@/services/api";
import { PageHeader } from "@/components/feature-specific/fleet/PageHeader";
import { FilterChip } from "@/components/feature-specific/fleet/FilterChip";
import { Input } from "@/components/common/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/ui/table";
import { Search, Wrench } from "lucide-react";

interface MaintenanceRecord {
  record_id: string;
  vehicle_id: string;
  service_date: string | null;
  odometer_km: number | null;
  service_type: string | null;
  cost: string | number | null;
  notes: string | null;
  vehicle_plate: string | null;
  vehicle_make: string | null;
  vehicle_model: string | null;
}

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

const prettyType = (t: string | null) =>
  t ? t.replace(/_/g, " ") : "—";

export default function Maintenance() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  const {
    data: records = [],
    isLoading,
    isError,
    error,
  } = useQuery<MaintenanceRecord[]>({
    queryKey: ["maintenance"],
    queryFn: () => apiGet<MaintenanceRecord[]>("/fleetsync/maintenance"),
  });

  // Distinct service types for filter chips.
  const serviceTypes = Array.from(
    new Set(records.map((r) => r.service_type).filter(Boolean))
  ) as string[];

  const filtered = records.filter((r) => {
    const q = searchQuery.toLowerCase();
    const vehicleName = [r.vehicle_make, r.vehicle_model]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    const matchesSearch =
      r.record_id.toLowerCase().includes(q) ||
      r.vehicle_id.toLowerCase().includes(q) ||
      (r.vehicle_plate ?? "").toLowerCase().includes(q) ||
      vehicleName.includes(q);
    const matchesType = !typeFilter || r.service_type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalCost = filtered.reduce((sum, r) => sum + num(r.cost), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Maintenance"
        description="Vehicle service and maintenance records"
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 py-2 border-b border-border">
        <FilterChip
          label="All"
          isActive={!typeFilter}
          onClick={() => setTypeFilter(null)}
        />
        {serviceTypes.map((type) => (
          <FilterChip
            key={type}
            label={prettyType(type)}
            isActive={typeFilter === type}
            onClick={() => setTypeFilter(type)}
          />
        ))}
      </div>

      {/* Search and count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
          records
          <span className="mx-2">•</span>
          Total cost{" "}
          <span className="font-semibold text-foreground">
            EUR {totalCost.toFixed(2)}
          </span>
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
              <TableHead className="font-semibold">Record</TableHead>
              <TableHead className="font-semibold">Vehicle</TableHead>
              <TableHead className="font-semibold">Service Type</TableHead>
              <TableHead className="font-semibold">Date</TableHead>
              <TableHead className="font-semibold text-right">Odometer</TableHead>
              <TableHead className="font-semibold text-right">Cost</TableHead>
              <TableHead className="font-semibold">Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  Loading maintenance records…
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-destructive">
                  Failed to load: {(error as Error)?.message ?? "Unknown error"}
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  No maintenance records found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((r) => {
                const vehicleName =
                  [r.vehicle_make, r.vehicle_model].filter(Boolean).join(" ") ||
                  r.vehicle_plate ||
                  r.vehicle_id;
                return (
                  <TableRow key={r.record_id} className="data-table-row">
                    <TableCell className="font-mono text-sm">{r.record_id}</TableCell>
                    <TableCell>
                      <Link
                        to="/vehicles"
                        className="text-primary hover:underline"
                      >
                        {vehicleName}
                      </Link>
                      {r.vehicle_plate && (
                        <span className="block text-xs text-muted-foreground font-mono">
                          {r.vehicle_plate}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 capitalize">
                        <Wrench className="h-3.5 w-3.5 text-muted-foreground" />
                        {prettyType(r.service_type)}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(r.service_date)}</TableCell>
                    <TableCell className="text-right">
                      {r.odometer_km != null
                        ? `${r.odometer_km.toLocaleString()} km`
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      EUR {num(r.cost).toFixed(2)}
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground">
                      {r.notes || "—"}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
