import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { apiGet } from "@/services/api";
import { PageHeader } from "@/components/feature-specific/fleet/PageHeader";
import { StatusBadge } from "@/components/feature-specific/fleet/StatusBadge";
import { FilterChip } from "@/components/feature-specific/fleet/FilterChip";
import { Button } from "@/components/common/ui/button";
import { Input } from "@/components/common/ui/input";
import { Avatar, AvatarFallback } from "@/components/common/ui/avatar";
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
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/common/ui/sheet";
import { DriverForm } from "@/components/feature-specific/fleet/DriverForm";
import { apiPost } from "@/services/api";
import { toast } from "sonner";

// Mock data for drivers
export const driversData: any[] = [
  {
    id: 1,
    salutation: "Mr.",
    name: "GP Sky",
    email: "gp.sky@company.com",
    phone: "+31 6 1234 5678",
    license: "B",
    licenseExpiry: "Dec 15, 2027",
    assignedVehicle: "34-CD-AB",
    status: "assigned" as const,
    department: "Sales",
    abbreviation: "GPS",
    remarks: "Preferred driver for electric vehicles.",
    address: "Main Street 12, Amsterdam",
    currentEfkm: "15000",
    birthDate: "1985-04-12",
    additionalEmail: "gp.sky.personal@example.com",
    emailToSupervisor: true,
    academicDegree: "M.Sc.",
    language: "EN",
    personnelNumber: "EMP-001",
    costCenter: "CC-8092",
    sapNumber: "SAP-100293",
    jobTitle: "Senior Sales Manager",
    entryDate: "2020-01-01",
    exitDate: "",
    reEmploymentDate: "",
    timeoutFrom: "",
    timeoutUntil: "",
    timeoutReason: "",
    vehicleFleet: "Premium Fleet",
    driverRegulation: "Regulation 2024-A",
    selfServiceAccess: true,
    accessSent: true,
    accessBlocked: false,
    transferType: "Permanent Assignment",
    kmAcceptance: "32450",
    kmPerYear: "25000",
    salaryDeduction: "150",
    handoverDate: "2024-02-15",
  },
  {
    id: 2,
    salutation: "Mr.",
    name: "John Doe",
    email: "john.doe@company.com",
    phone: "+31 6 2345 6789",
    license: "B",
    licenseExpiry: "Mar 20, 2026",
    assignedVehicle: "AB-12-CD",
    status: "assigned" as const,
    department: "Marketing",
    abbreviation: "JDO",
    remarks: "Requires winter tires year-round if possible.",
    address: "Keizersgracht 456, Amsterdam",
    currentEfkm: "12000",
    birthDate: "1990-08-24",
    additionalEmail: "john.doe.personal@example.com",
    emailToSupervisor: false,
    academicDegree: "B.A.",
    language: "NL",
    personnelNumber: "EMP-002",
    costCenter: "CC-4012",
    sapNumber: "SAP-100294",
    jobTitle: "Marketing Lead",
    entryDate: "2021-06-15",
    exitDate: "",
    reEmploymentDate: "",
    timeoutFrom: "",
    timeoutUntil: "",
    timeoutReason: "",
    vehicleFleet: "Standard Fleet",
    driverRegulation: "Regulation 2024-B",
    selfServiceAccess: true,
    accessSent: true,
    accessBlocked: false,
    transferType: "Permanent Assignment",
    kmAcceptance: "27800",
    kmPerYear: "20000",
    salaryDeduction: "120",
    handoverDate: "2024-09-01",
  },
  {
    id: 3,
    salutation: "Mrs.",
    name: "Sarah Johnson",
    email: "sarah.j@company.com",
    phone: "+31 6 3456 7890",
    license: "B, BE",
    licenseExpiry: "Aug 10, 2025",
    assignedVehicle: null,
    status: "available" as const,
    department: "Operations",
    abbreviation: "SJO",
    remarks: "Pending new vehicle delivery.",
    address: "Prinsengracht 789, Amsterdam",
    currentEfkm: "18000",
    birthDate: "1988-11-02",
    additionalEmail: "sarah.j.personal@example.com",
    emailToSupervisor: true,
    academicDegree: "M.B.A.",
    language: "EN",
    personnelNumber: "EMP-003",
    costCenter: "CC-9033",
    sapNumber: "SAP-100295",
    jobTitle: "Operations Specialist",
    entryDate: "2019-03-10",
    exitDate: "",
    reEmploymentDate: "",
    timeoutFrom: "",
    timeoutUntil: "",
    timeoutReason: "",
    vehicleFleet: "Eco Fleet",
    driverRegulation: "Regulation 2024-A",
    selfServiceAccess: true,
    accessSent: false,
    accessBlocked: false,
    transferType: "",
    kmAcceptance: "",
    kmPerYear: "30000",
    salaryDeduction: "",
    handoverDate: "",
  },
  {
    id: 4,
    salutation: "Mr.",
    name: "Marcus Wilson",
    email: "m.wilson@company.com",
    phone: "+31 6 4567 8901",
    license: "B",
    licenseExpiry: "Nov 30, 2026",
    assignedVehicle: null,
    status: "available" as const,
    department: "Engineering",
    abbreviation: "MWI",
    remarks: "Shared pool driver status.",
    address: "Lijnbaansgracht 12, Amsterdam",
    currentEfkm: "10000",
    birthDate: "1993-01-15",
    additionalEmail: "",
    emailToSupervisor: false,
    academicDegree: "B.Sc.",
    language: "EN",
    personnelNumber: "EMP-004",
    costCenter: "CC-1090",
    sapNumber: "SAP-100296",
    jobTitle: "Software Architect",
    entryDate: "2022-10-01",
    exitDate: "",
    reEmploymentDate: "",
    timeoutFrom: "",
    timeoutUntil: "",
    timeoutReason: "",
    vehicleFleet: "Standard Fleet",
    driverRegulation: "Regulation 2024-B",
    selfServiceAccess: true,
    accessSent: true,
    accessBlocked: false,
    transferType: "",
    kmAcceptance: "",
    kmPerYear: "15000",
    salaryDeduction: "",
    handoverDate: "",
  },
  {
    id: 5,
    salutation: "Ms.",
    name: "Emma Davis",
    email: "emma.d@company.com",
    phone: "+31 6 5678 9012",
    license: "B, C",
    licenseExpiry: "Feb 14, 2027",
    assignedVehicle: "KL-67-MN",
    status: "assigned" as const,
    department: "Logistics",
    abbreviation: "EDA",
    remarks: "Licensed to drive heavy goods vehicles if required.",
    address: "Haarlemmerdijk 88, Amsterdam",
    currentEfkm: "25000",
    birthDate: "1984-06-30",
    additionalEmail: "emma.d.personal@example.com",
    emailToSupervisor: true,
    academicDegree: "M.Sc.",
    language: "NL",
    personnelNumber: "EMP-005",
    costCenter: "CC-9033",
    sapNumber: "SAP-100297",
    jobTitle: "Logistics Dispatcher",
    entryDate: "2018-05-01",
    exitDate: "",
    reEmploymentDate: "",
    timeoutFrom: "",
    timeoutUntil: "",
    timeoutReason: "",
    vehicleFleet: "Eco Fleet",
    driverRegulation: "Regulation 2024-A",
    selfServiceAccess: true,
    accessSent: true,
    accessBlocked: false,
    transferType: "Permanent Assignment",
    kmAcceptance: "12400",
    kmPerYear: "35000",
    salaryDeduction: "160",
    handoverDate: "2025-02-15",
  },
  {
    id: 6,
    salutation: "Mr.",
    name: "Michael Brown",
    email: "m.brown@company.com",
    phone: "+31 6 6789 0123",
    license: "B",
    licenseExpiry: "Jul 05, 2025",
    assignedVehicle: null,
    status: "inactive" as const,
    department: "HR",
    abbreviation: "MBR",
    remarks: "On parental leave until September.",
    address: "Overtoom 202, Amsterdam",
    currentEfkm: "8000",
    birthDate: "1987-09-14",
    additionalEmail: "",
    emailToSupervisor: false,
    academicDegree: "B.A.",
    language: "NL",
    personnelNumber: "EMP-006",
    costCenter: "CC-1090",
    sapNumber: "SAP-100298",
    jobTitle: "HR Business Partner",
    entryDate: "2021-02-15",
    exitDate: "",
    reEmploymentDate: "",
    timeoutFrom: "2026-03-01",
    timeoutUntil: "2026-09-01",
    timeoutReason: "Parental Leave",
    vehicleFleet: "Standard Fleet",
    driverRegulation: "Regulation 2024-B",
    selfServiceAccess: false,
    accessSent: false,
    accessBlocked: true,
    transferType: "",
    kmAcceptance: "",
    kmPerYear: "10000",
    salaryDeduction: "",
    handoverDate: "",
  },
  {
    id: 7,
    salutation: "Mrs.",
    name: "Lisa Anderson",
    email: "l.anderson@company.com",
    phone: "+31 6 7890 1234",
    license: "B",
    licenseExpiry: "Sep 22, 2026",
    assignedVehicle: "HI-89-JK",
    status: "assigned" as const,
    department: "Finance",
    abbreviation: "LAN",
    remarks: "Requires charging point access card.",
    address: "De Clercqstraat 55, Amsterdam",
    currentEfkm: "14000",
    birthDate: "1982-12-05",
    additionalEmail: "lisa.a.personal@example.com",
    emailToSupervisor: true,
    academicDegree: "M.Sc.",
    language: "EN",
    personnelNumber: "EMP-007",
    costCenter: "CC-4012",
    sapNumber: "SAP-100299",
    jobTitle: "Financial Controller",
    entryDate: "2017-09-01",
    exitDate: "",
    reEmploymentDate: "",
    timeoutFrom: "",
    timeoutUntil: "",
    timeoutReason: "",
    vehicleFleet: "Standard Fleet",
    driverRegulation: "Regulation 2024-A",
    selfServiceAccess: true,
    accessSent: true,
    accessBlocked: false,
    transferType: "Permanent Assignment",
    kmAcceptance: "25000",
    kmPerYear: "20000",
    salaryDeduction: "135",
    handoverDate: "2024-08-01",
  },
  {
    id: 8,
    salutation: "Mr.",
    name: "David Martinez",
    email: "d.martinez@company.com",
    phone: "+31 6 8901 2345",
    license: "B, D",
    licenseExpiry: "Apr 18, 2027",
    assignedVehicle: null,
    status: "available" as const,
    department: "Operations",
    abbreviation: "DMA",
    remarks: "Licensed for bus transport duties.",
    address: "Wibautstraat 99, Amsterdam",
    currentEfkm: "22000",
    birthDate: "1986-03-22",
    additionalEmail: "",
    emailToSupervisor: false,
    academicDegree: "",
    language: "EN",
    personnelNumber: "EMP-008",
    costCenter: "CC-9033",
    sapNumber: "SAP-100300",
    jobTitle: "Operations Supervisor",
    entryDate: "2020-11-15",
    exitDate: "",
    reEmploymentDate: "",
    timeoutFrom: "",
    timeoutUntil: "",
    timeoutReason: "",
    vehicleFleet: "Eco Fleet",
    driverRegulation: "Regulation 2024-A",
    selfServiceAccess: true,
    accessSent: true,
    accessBlocked: false,
    transferType: "",
    kmAcceptance: "",
    kmPerYear: "28000",
    salaryDeduction: "",
    handoverDate: "",
  },
];

export function getDriverById(id: string | number): any | undefined {
  return driversData.find((d) => String(d.id) === String(id));
}

export function addDriver(driver: any): any {
  const nextId = driversData.length ? Math.max(...driversData.map((d) => Number(d.id))) + 1 : 1;
  const record = { ...driver, id: nextId };
  driversData.push(record);
  return record;
}

export function updateDriver(driver: any): void {
  const idx = driversData.findIndex((d) => d.id === driver.id);
  if (idx >= 0) driversData[idx] = driver;
}

export function deleteDriver(id: string | number): void {
  const idx = driversData.findIndex((d) => String(d.id) === String(id));
  if (idx >= 0) driversData.splice(idx, 1);
}

interface Driver {
  driver_id: string;
  name: string;
  license_class: string | null;
  hire_date: string | null;
  status: string;
  assigned_vehicle_id: string | null;
  vehicle_plate: string | null;
  vehicle_make: string | null;
  vehicle_model: string | null;
}

// StatusBadge only supports a known set; fall back to inactive styling otherwise.
type BadgeStatus = "active" | "inactive" | "maintenance" | "available" | "assigned";
const BADGE_STATUSES: BadgeStatus[] = [
  "active",
  "inactive",
  "maintenance",
  "available",
  "assigned",
];
const toBadgeStatus = (status: string): BadgeStatus =>
  (BADGE_STATUSES as string[]).includes(status)
    ? (status as BadgeStatus)
    : "inactive";

export default function Drivers() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const {
    data: drivers = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Driver[]>({
    queryKey: ["drivers"],
    queryFn: () => apiGet<Driver[]>("/fleetsync/drivers"),
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const filteredDrivers = drivers.filter((driver) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      driver.name.toLowerCase().includes(q) ||
      driver.driver_id.toLowerCase().includes(q);
    const matchesStatus = !statusFilter || driver.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const startIndex = (currentPage - 1) * 8;
  const paginatedDrivers = filteredDrivers.slice(startIndex, startIndex + 8);
  const totalPages = Math.ceil(filteredDrivers.length / 8);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

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

  return (
    <div className="space-y-6 animate-fade-in relative">
      <PageHeader
        title="Drivers"
        description="Manage fleet drivers and assignments"
        actions={
          <div className="flex items-center gap-3">
            <Button onClick={() => setIsAddOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Driver
            </Button>
          </div>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 py-2 border-b border-border">
        <FilterChip
          label="All"
          isActive={!statusFilter}
          onClick={() => setStatusFilter(null)}
        />
        <FilterChip
          label="Active"
          isActive={statusFilter === "active"}
          onClick={() => setStatusFilter("active")}
        />
        <FilterChip
          label="On Leave"
          isActive={statusFilter === "on_leave"}
          onClick={() => setStatusFilter("on_leave")}
        />
        <span className="w-px h-5 bg-border mx-1" />
        <FilterChip label="License" hasDropdown />
      </div>

      {/* Search and count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{filteredDrivers.length}</span> drivers
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
              <TableHead className="font-semibold">Driver</TableHead>
              <TableHead className="font-semibold">License Class</TableHead>
              <TableHead className="font-semibold">Hire Date</TableHead>
              <TableHead className="font-semibold">Assigned Vehicle</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  Loading drivers…
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-destructive">
                  Failed to load drivers: {(error as Error)?.message ?? "Unknown error"}
                </TableCell>
              </TableRow>
            ) : filteredDrivers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  No drivers found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedDrivers.map((driver) => (
                <TableRow
                  key={driver.driver_id}
                  className="data-table-row cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors"
                  onClick={() => navigate(`/drivers/${driver.driver_id}`)}
                  onDoubleClick={() => navigate(`/drivers/${driver.driver_id}`)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" className="rounded border-border" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {getInitials(driver.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{driver.name}</span>
                        <span className="text-xs text-muted-foreground font-mono">
                          {driver.driver_id}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground">
                    {driver.license_class || "—"}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {formatDate(driver.hire_date)}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    {driver.assigned_vehicle_id ? (
                      <Link
                        to={`/vehicles/${driver.assigned_vehicle_id}`}
                        className="text-primary hover:underline text-sm"
                      >
                        {[driver.vehicle_make, driver.vehicle_model]
                          .filter(Boolean)
                          .join(" ") ||
                          driver.vehicle_plate ||
                          driver.assigned_vehicle_id}
                        {driver.vehicle_plate && (
                          <span className="block text-xs text-muted-foreground font-mono">
                            {driver.vehicle_plate}
                          </span>
                        )}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={toBadgeStatus(driver.status)} />
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/drivers/${driver.driver_id}`)}>View Details</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/drivers/${driver.driver_id}/edit`)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Assign Vehicle</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => navigate(`/drivers/${driver.driver_id}/edit`)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between py-2 text-xs text-muted-foreground">
          <p>
            Showing <span className="font-semibold text-foreground">{startIndex + 1}</span> to{" "}
            <span className="font-semibold text-foreground">
              {Math.min(startIndex + 8, filteredDrivers.length)}
            </span>{" "}
            of <span className="font-semibold text-foreground">{filteredDrivers.length}</span> drivers
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
      <Sheet open={isAddOpen} onOpenChange={setIsAddOpen}>
        <SheetContent className="sm:max-w-2xl overflow-y-auto z-[100]">
          <SheetHeader className="mb-6">
            <SheetTitle>Add Driver</SheetTitle>
          </SheetHeader>
          <DriverForm
            driver={null}
            onCancel={() => setIsAddOpen(false)}
            onSaved={(newDriver) => {
              apiPost<any>("/fleetsync/drivers", {
                driver_id: newDriver.driver_id,
                name: newDriver.name,
                license_class: newDriver.license_class || null,
                status: newDriver.status || "active",
                hire_date: newDriver.hire_date || null,
              })
              .then((res) => {
                setIsAddOpen(false);
                refetch();
                toast.success("Driver added successfully");
                // Optional: navigate to edit details if extra fields are needed
                navigate(`/drivers/${res.driver_id}/edit`);
              })
              .catch((err) => toast.error(`Creation failed: ${err.message}`));
            }}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}



