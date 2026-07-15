import { useEffect, useState } from "react";
import { PageHeader } from "@/components/feature-specific/fleet/PageHeader";
import { StatusBadge } from "@/components/feature-specific/fleet/StatusBadge";
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
import { Plus, Search, MoreHorizontal, Download, Building2, Globe, Phone, Mail } from "lucide-react";

// Mock data for vendors
const vendorsData = [
  {
    id: 1,
    name: "AutoLease Pro",
    type: "Leasing",
    contact: "Mark Stevens",
    email: "mark@autoleasepro.com",
    phone: "+31 20 123 4567",
    website: "www.autoleasepro.com",
    activeContracts: 12,
    totalValue: "€45,000",
    status: "active" as const,
  },
  {
    id: 2,
    name: "FleetCare Services",
    type: "Maintenance",
    contact: "Sarah Miller",
    email: "sarah@fleetcare.nl",
    phone: "+31 20 234 5678",
    website: "www.fleetcare.nl",
    activeContracts: 8,
    totalValue: "€18,500",
    status: "active" as const,
  },
  {
    id: 3,
    name: "EuroFuel Cards",
    type: "Fuel",
    contact: "Tom Hansen",
    email: "t.hansen@eurofuel.eu",
    phone: "+31 20 345 6789",
    website: "www.eurofuel.eu",
    activeContracts: 42,
    totalValue: "€8,200",
    status: "active" as const,
  },
  {
    id: 4,
    name: "InsureFleet NL",
    type: "Insurance",
    contact: "Anna de Vries",
    email: "anna@insurefleet.nl",
    phone: "+31 20 456 7890",
    website: "www.insurefleet.nl",
    activeContracts: 15,
    totalValue: "€32,000",
    status: "active" as const,
  },
  {
    id: 5,
    name: "TireWorld Express",
    type: "Tires",
    contact: "Peter Brown",
    email: "p.brown@tireworld.com",
    phone: "+31 20 567 8901",
    website: "www.tireworld.com",
    activeContracts: 3,
    totalValue: "€5,400",
    status: "active" as const,
  },
  {
    id: 6,
    name: "CleanDrive Wash",
    type: "Cleaning",
    contact: "Lisa White",
    email: "lisa@cleandrive.nl",
    phone: "+31 20 678 9012",
    website: "www.cleandrive.nl",
    activeContracts: 1,
    totalValue: "€1,200",
    status: "inactive" as const,
  },
];

export default function Vendors() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, typeFilter]);

  const filteredVendors = vendorsData.filter((vendor) => {
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !typeFilter || vendor.type.toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesType;
  });

  const startIndex = (currentPage - 1) * 8;
  const paginatedVendors = filteredVendors.slice(startIndex, startIndex + 8);
  const totalPages = Math.ceil(filteredVendors.length / 8);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Vendors"
        description="Manage fleet service providers and contracts"
        actions={
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Vendor
            </Button>
          </div>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 py-2 border-b border-border">
        <FilterChip
          label="All"
          isActive={!typeFilter}
          onClick={() => setTypeFilter(null)}
        />
        <FilterChip
          label="Leasing"
          isActive={typeFilter === "Leasing"}
          onClick={() => setTypeFilter(typeFilter === "Leasing" ? null : "Leasing")}
        />
        <FilterChip
          label="Maintenance"
          isActive={typeFilter === "Maintenance"}
          onClick={() => setTypeFilter(typeFilter === "Maintenance" ? null : "Maintenance")}
        />
        <FilterChip
          label="Fuel"
          isActive={typeFilter === "Fuel"}
          onClick={() => setTypeFilter(typeFilter === "Fuel" ? null : "Fuel")}
        />
        <FilterChip
          label="Insurance"
          isActive={typeFilter === "Insurance"}
          onClick={() => setTypeFilter(typeFilter === "Insurance" ? null : "Insurance")}
        />
      </div>

      {/* Search and count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{filteredVendors.length}</span> vendors
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
              <TableHead className="font-semibold">Vendor</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Contact</TableHead>
              <TableHead className="font-semibold">Active Contracts</TableHead>
              <TableHead className="font-semibold">Total Value</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedVendors.map((vendor) => (
              <TableRow key={vendor.id} className="data-table-row">
                <TableCell>
                  <input type="checkbox" className="rounded border-border" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{vendor.name}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Globe className="h-3 w-3" />
                        {vendor.website}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                    {vendor.type}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">{vendor.contact}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {vendor.email}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {vendor.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-foreground font-medium">
                  {vendor.activeContracts}
                </TableCell>
                <TableCell className="text-foreground font-medium">
                  {vendor.totalValue}
                </TableCell>
                <TableCell>
                  <StatusBadge status={vendor.status} />
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>View Contracts</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between py-2 text-xs text-muted-foreground">
          <p>
            Showing <span className="font-semibold text-foreground">{startIndex + 1}</span> to{" "}
            <span className="font-semibold text-foreground">
              {Math.min(startIndex + 8, filteredVendors.length)}
            </span>{" "}
            of <span className="font-semibold text-foreground">{filteredVendors.length}</span> vendors
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
  );
}



