import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/feature-specific/fleet/PageHeader";
import { StatusBadge } from "@/components/feature-specific/fleet/StatusBadge";
import { VehicleIcon } from "@/components/feature-specific/fleet/VehicleIcon";
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
import { Plus, Search, MoreHorizontal, Filter, Download } from "lucide-react";

// Mock data for vehicles
const initialVehiclesDataRaw = [
  {
    id: 1,
    displayName: "34-CD-AB",
    manufacturer: "BMW",
    model: "BMW 3 Series",
    driver: "GP Sky",
    mileage: 32450,
    age: 2,
    vendor: "LeasePlan",
    contractEnd: "Dec 2025",
    status: "active" as const,
    fleet: "Premium Fleet",
    subFleet: "Executive Cars",
    costCenter: "CC-8092",
    sapOrderNumber: "SAP-998811",
    owner: "TESSERON Fleet Ltd",
    internalId: "V-BMW-001",
    orderDate: "2024-01-15",
    firstRegistration: "2024-02-10",
    constructionDate: "2023",
    nextMot: "2026-02-10",
    safetyInspection: "2025-08-10",
    deregistrationDate: "",
    tax: "140",
    tireType: "All-Season",
    parkingLocation: "Main HQ Garage",
    wrapping: "Glossy Metallic Wrap",
    supplier: "AutoDealer Amsterdam",
    privateUseRate: "220",
    remarks: "Assigned to VIP sales consultant.",
    modelVariant: "320i Sport Line",
    vehicleType: "Sedan",
    chassisNumber: "WBA1234567890BMW",
    color: "Sapphire Black",
    hsnTsn: "0005/CSX",
    emissionClass: "Euro 6d",
  },
  {
    id: 2,
    displayName: "45-ZA-BC",
    manufacturer: "Peugeot",
    model: "Peugeot 3008",
    driver: "Maria Santos",
    mileage: 10000,
    age: 1,
    vendor: "ALD Automotive",
    contractEnd: "Mar 2026",
    status: "active" as const,
    fleet: "Standard Fleet",
    subFleet: "Mid-size SUVs",
    costCenter: "CC-4011",
    sapOrderNumber: "SAP-554412",
    owner: "TESSERON Fleet Ltd",
    internalId: "V-PEU-002",
    orderDate: "2025-02-01",
    firstRegistration: "2025-03-01",
    constructionDate: "2024",
    nextMot: "2027-03-01",
    safetyInspection: "2026-03-01",
    deregistrationDate: "",
    tax: "98",
    tireType: "Summer",
    parkingLocation: "Rotterdam Depot",
    wrapping: "None",
    supplier: "Peugeot Rotterdam",
    privateUseRate: "180",
    remarks: "Regular regional client manager car.",
    modelVariant: "Allure Pack 1.2 PureTech",
    vehicleType: "SUV",
    chassisNumber: "VF33008PEU998811",
    color: "Artense Gray",
    hsnTsn: "3003/ATM",
    emissionClass: "Euro 6d-Temp",
  },
  {
    id: 3,
    displayName: "89-NP-QR",
    manufacturer: "Toyota",
    model: "Toyota Corolla",
    driver: "John Mitchell",
    mileage: 48200,
    age: 3,
    vendor: "Arval",
    contractEnd: "Jun 2025",
    status: "active" as const,
    fleet: "Eco Fleet",
    subFleet: "Hybrids division",
    costCenter: "CC-9033",
    sapOrderNumber: "SAP-112233",
    owner: "TESSERON Fleet Ltd",
    internalId: "V-TOY-003",
    orderDate: "2023-05-12",
    firstRegistration: "2023-06-15",
    constructionDate: "2023",
    nextMot: "2025-06-15",
    safetyInspection: "2024-12-15",
    deregistrationDate: "",
    tax: "50",
    tireType: "Winter",
    parkingLocation: "Utrecht Hub",
    wrapping: "Full TESSERON Branding Logo",
    supplier: "Toyota Utrecht Dealership",
    privateUseRate: "150",
    remarks: "Fuel-efficient hybrid pool vehicle.",
    modelVariant: "1.8 Hybrid Active Hatchback",
    vehicleType: "Hatchback",
    chassisNumber: "JTDKN31E10TOY9922",
    color: "Platinum White",
    hsnTsn: "5013/AJK",
    emissionClass: "Euro 6",
  },
  {
    id: 4,
    displayName: "AB-12-CD",
    manufacturer: "Volkswagen",
    model: "Volkswagen Golf",
    driver: "Emma Wilson",
    mileage: 27800,
    age: 2,
    vendor: "LeasePlan",
    contractEnd: "Sep 2025",
    status: "active" as const,
    fleet: "Standard Fleet",
    subFleet: "Compact Hatchbacks",
    costCenter: "CC-4012",
    sapOrderNumber: "SAP-776655",
    owner: "TESSERON Fleet Ltd",
    internalId: "V-VW-004",
    orderDate: "2024-08-01",
    firstRegistration: "2024-09-01",
    constructionDate: "2024",
    nextMot: "2026-09-01",
    safetyInspection: "2025-09-01",
    deregistrationDate: "",
    tax: "115",
    tireType: "All-Season",
    parkingLocation: "Main HQ Garage",
    wrapping: "None",
    supplier: "VW Center Amsterdam",
    privateUseRate: "200",
    remarks: "Daily commuter for office manager.",
    modelVariant: "Golf 8 1.5 eTSI Style",
    vehicleType: "Hatchback",
    chassisNumber: "WVWZZZCDZVW554432",
    color: "Reflex Silver",
    hsnTsn: "0603/CKZ",
    emissionClass: "Euro 6d",
  },
  {
    id: 5,
    displayName: "DE-67-FG",
    manufacturer: "Renault",
    model: "Renault Megane",
    driver: "Lucas Brown",
    mileage: 55600,
    age: 4,
    vendor: "Alphabet",
    contractEnd: "Jan 2025",
    status: "maintenance" as const,
    fleet: "Standard Fleet",
    subFleet: "Maintenance Pool",
    costCenter: "CC-1090",
    sapOrderNumber: "SAP-883377",
    owner: "TESSERON Fleet Ltd",
    internalId: "V-REN-005",
    orderDate: "2022-11-20",
    firstRegistration: "2022-12-18",
    constructionDate: "2022",
    nextMot: "2025-01-20",
    safetyInspection: "2024-11-20",
    deregistrationDate: "",
    tax: "130",
    tireType: "Summer",
    parkingLocation: "Workshop North",
    wrapping: "Rear Window Decal",
    supplier: "Renault Amsterdam",
    privateUseRate: "160",
    remarks: "In workshop for regular service and brake replacement.",
    modelVariant: "Megane Estate TCe 140",
    vehicleType: "Station Wagon",
    chassisNumber: "VF1RFB00REN776655",
    color: "Iron Blue",
    hsnTsn: "3333/BFX",
    emissionClass: "Euro 6",
  },
  {
    id: 6,
    displayName: "GH-45-IJ",
    manufacturer: "Audi",
    model: "Audi A4",
    driver: "Sophie Taylor",
    mileage: 18300,
    age: 1,
    vendor: "ALD Automotive",
    contractEnd: "Nov 2026",
    status: "active" as const,
    fleet: "Premium Fleet",
    subFleet: "Executive Cars",
    costCenter: "CC-8092",
    sapOrderNumber: "SAP-223399",
    owner: "TESSERON Fleet Ltd",
    internalId: "V-AUD-006",
    orderDate: "2025-10-05",
    firstRegistration: "2025-11-01",
    constructionDate: "2025",
    nextMot: "2028-11-01",
    safetyInspection: "2026-11-01",
    deregistrationDate: "",
    tax: "155",
    tireType: "All-Season",
    parkingLocation: "Main HQ Garage",
    wrapping: "None",
    supplier: "Audi Center The Hague",
    privateUseRate: "240",
    remarks: "Allocated to VP of Finance.",
    modelVariant: "A4 Sedan 35 TFSI S-line",
    vehicleType: "Sedan",
    chassisNumber: "WAUZZZF4AUD992211",
    color: "Daytona Gray",
    hsnTsn: "0588/BJE",
    emissionClass: "Euro 6d",
  },
  {
    id: 7,
    displayName: "HI-89-JK",
    manufacturer: "Skoda",
    model: "Skoda Octavia",
    driver: "David Chen",
    mileage: 25000,
    age: 2,
    vendor: "Arval",
    contractEnd: "Aug 2025",
    status: "active" as const,
    fleet: "Standard Fleet",
    subFleet: "Sales Pool",
    costCenter: "CC-4012",
    sapOrderNumber: "SAP-445566",
    owner: "TESSERON Fleet Ltd",
    internalId: "V-SKO-007",
    orderDate: "2024-07-10",
    firstRegistration: "2024-08-01",
    constructionDate: "2024",
    nextMot: "2026-08-01",
    safetyInspection: "2025-08-01",
    deregistrationDate: "",
    tax: "110",
    tireType: "Summer",
    parkingLocation: "Utrecht Hub",
    wrapping: "Full TESSERON Branding Logo",
    supplier: "Skoda Utrecht",
    privateUseRate: "190",
    remarks: "Highly reliable sales representative car.",
    modelVariant: "Octavia Combi 1.5 TSI Business",
    vehicleType: "Station Wagon",
    chassisNumber: "TMBJR7NKSKO445566",
    color: "Lava Blue",
    hsnTsn: "8004/AQX",
    emissionClass: "Euro 6d-Temp",
  },
  {
    id: 8,
    displayName: "KL-67-MN",
    manufacturer: "Tesla",
    model: "Tesla Model 3",
    driver: "Anna Kowalski",
    mileage: 12400,
    age: 1,
    vendor: "LeasePlan",
    contractEnd: "Feb 2027",
    status: "active" as const,
    fleet: "Eco Fleet",
    subFleet: "Electric Division",
    costCenter: "CC-9033",
    sapOrderNumber: "SAP-667788",
    owner: "TESSERON Fleet Ltd",
    internalId: "V-TSL-008",
    orderDate: "2025-01-10",
    firstRegistration: "2025-02-15",
    constructionDate: "2025",
    nextMot: "2028-02-15",
    safetyInspection: "2026-02-15",
    deregistrationDate: "",
    tax: "0",
    tireType: "All-Season",
    parkingLocation: "Main HQ Garage (EV Charger 3)",
    wrapping: "None",
    supplier: "Tesla Store Amsterdam",
    privateUseRate: "110",
    remarks: "Zero emission electric company vehicle.",
    modelVariant: "Model 3 Long Range AWD",
    vehicleType: "Electric Sedan",
    chassisNumber: "5YJ3E1EBTSL887766",
    color: "Solid Black",
    hsnTsn: "1480/AAT",
    emissionClass: "Zero Emission",
  },
  {
    id: 9,
    displayName: "ST-01-UV",
    manufacturer: "Volvo",
    model: "Volvo XC40",
    driver: "Michael Berg",
    mileage: 41200,
    age: 3,
    vendor: "Alphabet",
    contractEnd: "Apr 2024",
    status: "inactive" as const,
    fleet: "Premium Fleet",
    subFleet: "Retired Vehicles",
    costCenter: "CC-9099",
    sapOrderNumber: "SAP-331155",
    owner: "TESSERON Fleet Ltd",
    internalId: "V-VOL-009",
    orderDate: "2021-03-01",
    firstRegistration: "2021-04-10",
    constructionDate: "2021",
    nextMot: "2024-04-10",
    safetyInspection: "2023-10-10",
    deregistrationDate: "2024-04-15",
    tax: "160",
    tireType: "Summer",
    parkingLocation: "Storage Yard West",
    wrapping: "None",
    supplier: "Volvo Amsterdam West",
    privateUseRate: "230",
    remarks: "Contract completed. Pending return to lease company.",
    modelVariant: "XC40 T3 Momentum",
    vehicleType: "SUV",
    chassisNumber: "YV1XZ15VOL889900",
    color: "Thunder Grey",
    hsnTsn: "9101/BGL",
    emissionClass: "Euro 6",
  },
  {
    id: 10,
    displayName: "WX-23-YZ",
    manufacturer: "Mercedes-Benz",
    model: "Mercedes-Benz C-Class",
    driver: "Laura Fischer",
    mileage: 45000,
    age: 3,
    vendor: "ALD Automotive",
    contractEnd: "Jul 2025",
    status: "active" as const,
    fleet: "Premium Fleet",
    subFleet: "Executive Cars",
    costCenter: "CC-8092",
    sapOrderNumber: "SAP-448833",
    owner: "TESSERON Fleet Ltd",
    internalId: "V-MER-010",
    orderDate: "2022-06-15",
    firstRegistration: "2022-07-01",
    constructionDate: "2022",
    nextMot: "2025-07-01",
    safetyInspection: "2024-07-01",
    deregistrationDate: "",
    tax: "145",
    tireType: "All-Season",
    parkingLocation: "Main HQ Garage",
    wrapping: "None",
    supplier: "Mercedes-Benz Dealer Group",
    privateUseRate: "260",
    remarks: "Assigned to Senior Fleet Administrator.",
    modelVariant: "C 200 AMG Line Avantgarde",
    vehicleType: "Sedan",
    chassisNumber: "WDD20504MER334455",
    color: "Selenite Grey Metallic",
    hsnTsn: "1313/HUX",
    emissionClass: "Euro 6d",
  },
];

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

export default function Vehicles() {
  const navigate = useNavigate();
  const [vehicles] = useState<any[]>(() => [...vehiclesData]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>("active");

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
          label="Active"
          isActive={statusFilter === "active"}
          onClick={() => setStatusFilter(statusFilter === "active" ? null : "active")}
        />
        <span className="w-px h-5 bg-border mx-1" />
        <FilterChip label="Type" hasDropdown />
        <FilterChip label="Driver" hasDropdown />
        <FilterChip label="Manufacturer" hasDropdown />
        <FilterChip label="Model" hasDropdown />
        <FilterChip label="Location" hasDropdown />
      </div>

      {/* Search and count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{filteredVehicles.length}</span> vehicles
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
              <TableHead className="font-semibold">Driver: Name</TableHead>
              <TableHead className="font-semibold">Mileage</TableHead>
              <TableHead className="font-semibold">Age (Years)</TableHead>
              <TableHead className="font-semibold">Financing: Vendor</TableHead>
              <TableHead className="font-semibold">Contract End</TableHead>
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
                  {vehicle.vendor ? (
                    <span className="text-foreground">{vehicle.vendor}</span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {vehicle.contractEnd ? (
                    <span className="text-foreground">{vehicle.contractEnd}</span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
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
                      <DropdownMenuItem>Assign Driver</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => navigate(`/vehicles/${vehicle.id}/edit`)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

    </div>
  );
}





