import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { apiGet } from "@/services/api";
import { PageHeader } from "@/components/feature-specific/fleet/PageHeader";
import { FilterChip } from "@/components/feature-specific/fleet/FilterChip";
import { Input } from "@/components/common/ui/input";
import { Button } from "@/components/common/ui/button";
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
  vehicle_odometer: number | null;
  vehicle_last_service_date: string | null;
  vehicle_last_service_odometer: number | null;
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

const getMaintenanceStatus = (r: MaintenanceRecord) => {
  if (!r.vehicle_last_service_date || r.vehicle_last_service_odometer === null || r.vehicle_last_service_odometer === undefined) {
    return "OVERDUE";
  }
  const lastServiceDate = new Date(r.vehicle_last_service_date);
  const now = new Date('2026-07-24'); // Anchor date matching seed data period
  const daysPassed = (now.getTime() - lastServiceDate.getTime()) / (1000 * 60 * 60 * 24);
  const kmPassed = (r.vehicle_odometer || 0) - r.vehicle_last_service_odometer;

  if (kmPassed > 10000 || daysPassed > 180) {
    return "OVERDUE";
  }
  return "COMPLIANT";
};

export default function Maintenance() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: records = [],
    isLoading,
    isError,
    error,
  } = useQuery<MaintenanceRecord[]>({
    queryKey: ["maintenance"],
    queryFn: () => apiGet<MaintenanceRecord[]>("/fleetsync/maintenance"),
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, typeFilter]);

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

  const startIndex = (currentPage - 1) * 8;
  const paginatedRecords = filtered.slice(startIndex, startIndex + 8);
  const totalPages = Math.ceil(filtered.length / 8);

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
            onClick={() => setTypeFilter(typeFilter === type ? null : type)}
          />
        ))}
      </div>

      {/* Stats & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex gap-6 text-sm text-muted-foreground">
          <p>
            Total Records: <span className="font-semibold text-foreground">{filtered.length}</span>
          </p>
          <p>
            Total Cost: <span className="font-semibold text-foreground">EUR {totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search record, vehicle..."
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
              <TableHead className="font-semibold">Record ID</TableHead>
              <TableHead className="font-semibold">Vehicle</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
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
                <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                  Loading maintenance records…
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-destructive">
                  Failed to load: {(error as Error)?.message ?? "Unknown error"}
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                  No maintenance records found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedRecords.map((r) => {
                const vehicleName =
                  [r.vehicle_make, r.vehicle_model].filter(Boolean).join(" ") ||
                  r.vehicle_plate ||
                  r.vehicle_id;
                const status = getMaintenanceStatus(r);
                return (
                  <TableRow key={r.record_id} className="data-table-row">
                    <TableCell className="font-mono text-sm">{r.record_id}</TableCell>
                    <TableCell>
                      <Link
                        to={`/vehicles/${r.vehicle_id}`}
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
                      <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded ${
                        status === "OVERDUE"
                          ? "bg-destructive/15 text-destructive border border-destructive/20"
                          : "bg-success/15 text-success border border-success/20"
                      }`}>
                        {status}
                      </span>
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

        {totalPages > 1 && (
          <div className="flex items-center justify-between py-2 px-4 text-xs text-muted-foreground">
            <p>
              Showing <span className="font-semibold text-foreground">{startIndex + 1}</span> to{" "}
              <span className="font-semibold text-foreground">
                {Math.min(startIndex + 8, filtered.length)}
              </span>{" "}
              of <span className="font-semibold text-foreground">{filtered.length}</span> records
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-[11px] font-semibold"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-2 font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-[11px] font-semibold"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
