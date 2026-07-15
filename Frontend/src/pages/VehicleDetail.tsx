import { Link, useParams } from "react-router-dom";
import { PageHeader } from "@/components/feature-specific/fleet/PageHeader";
import { StatusBadge } from "@/components/feature-specific/fleet/StatusBadge";
import { StatsCard } from "@/components/feature-specific/fleet/StatsCard";
import { VehicleContracts } from "@/components/feature-specific/fleet/VehicleContracts";
import { VehicleDocuments } from "@/components/feature-specific/fleet/VehicleDocuments";
import { VehicleData } from "@/components/feature-specific/fleet/VehicleData";
import { VehicleTechnicalData } from "@/components/feature-specific/fleet/VehicleTechnicalData";
import { Button } from "@/components/common/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/common/ui/tabs";
import {
  Car,
  ArrowLeft,
  Edit,
  Plus,
  Calendar,
  MapPin,
  User,
  Gauge,
  FileText,
  CreditCard,
  AlertTriangle,
  Receipt,
  ClipboardList,
} from "lucide-react";

// Mock vehicle data
const vehicleData = {
  id: 1,
  displayName: "34-CD-AB",
  type: "Car",
  manufacturer: "BMW",
  model: "3 Series",
  status: "active" as const,
  internalId: "1d55869f-90b1-4023-9328-a7c402e42df4",
  organization: "Root Organization",
  isAvailable: true,
  currentDriver: "GP Sky",
  currentMileage: null,
  age: null,
  registrationDate: null,
  financing: null,
  activeInFleetSince: "Jul 22, 2020",
  monitoringEnabled: true,
  cost: 4.03,
  distance: 0,
  totalFuel: 0,
};

const vehicleHistory = [
  {
    id: 1,
    type: "damage",
    message: "Damage 2026-00002 happened with driver GP Sky.",
    date: "Jan 31, 2026",
    icon: AlertTriangle,
  },
  {
    id: 2,
    type: "driver",
    message: "New driver GP Sky was added.",
    date: "Jan 31, 2026",
    icon: User,
  },
  {
    id: 3,
    type: "license",
    message: "New license plate 34-CD-AB was added.",
    date: "Jul 22, 2020",
    icon: FileText,
  },
  {
    id: 4,
    type: "status",
    message: "Vehicle state changed to Active.",
    date: "Jul 22, 2020",
    icon: Car,
  },
];

export default function VehicleDetail() {
  const { id } = useParams();

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
              {vehicleData.displayName}
            </h1>
            <StatusBadge status={vehicleData.status} />
          </div>
          <p className="text-sm text-muted-foreground">
            {vehicleData.manufacturer} {vehicleData.model} • {vehicleData.type}
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
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="fuel-cards">Fuel cards</TabsTrigger>
          <TabsTrigger value="damages">Damages</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - KPIs and Overview */}
            <div className="lg:col-span-2 space-y-6">
              {/* KPIs */}
              <div className="bg-card rounded-lg border border-border p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="font-semibold text-foreground">KPIs</h3>
                  <span className="text-sm text-muted-foreground">•</span>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    From Aug, 2025 Until Jan, 2026
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-muted/30">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                      Cost
                    </p>
                    <p className="text-xl font-semibold text-primary">
                      EUR {vehicleData.cost.toFixed(2)}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                      Distance
                    </p>
                    <p className="text-xl font-semibold text-foreground">
                      {vehicleData.distance} km
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>Mileage</span>
                      <span>Lifetime</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                      Total Fuel
                    </p>
                    <p className="text-xl font-semibold text-foreground">
                      {vehicleData.totalFuel.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Overview Details */}
              <div className="bg-card rounded-lg border border-border p-5 shadow-sm">
                <h3 className="font-semibold text-foreground mb-4">Overview</h3>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <MapPin className="h-4 w-4 mr-2" />
                    Address book
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Internal ID</span>
                      <span className="text-foreground font-mono text-xs">{vehicleData.internalId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Organization</span>
                      <span className="text-foreground">{vehicleData.organization}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Vehicle available</span>
                      <span className="text-foreground">{vehicleData.isAvailable ? "Yes" : "No"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Current driver</span>
                      <Link to="/drivers" className="text-primary hover:underline">
                        {vehicleData.currentDriver}
                      </Link>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Current mileage</span>
                      <div className="text-right">
                        <span className="text-warning">No mileage entries</span>
                        <br />
                        <Link to="#" className="text-primary hover:underline text-xs">
                          Add mileage
                        </Link>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Age</span>
                      <div className="text-right">
                        <span className="text-warning">Unknown registration date</span>
                        <br />
                        <Link to="#" className="text-primary hover:underline text-xs">
                          Edit reference data
                        </Link>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Financing</span>
                      <div className="text-right">
                        <span className="text-warning">No active financing contract</span>
                        <br />
                        <Link to="#" className="text-primary hover:underline text-xs">
                          Edit contracts
                        </Link>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Active in fleet since</span>
                      <span className="text-foreground">{vehicleData.activeInFleetSince}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monitoring settings</span>
                      <span className="text-success flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-success" />
                        Fully enabled
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Add-ons */}
              <div className="bg-card rounded-lg border border-border p-5 shadow-sm">
                <h3 className="font-semibold text-foreground mb-4">Add-ons</h3>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Mileage Integration</span>
                  <span className="text-muted-foreground">✕ Not eligible</span>
                </div>
              </div>
            </div>

            {/* Right column - This week and History */}
            <div className="space-y-6">
              {/* This week */}
              <div className="bg-card rounded-lg border border-border p-5 shadow-sm">
                <h3 className="font-semibold text-foreground mb-4">This week</h3>
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <FileText className="h-5 w-5 text-warning" />
                  <span className="text-sm text-muted-foreground">
                    Exact vehicle model unknown
                  </span>
                </div>
              </div>

              {/* Vehicle history */}
              <div className="bg-card rounded-lg border border-border p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Vehicle history</h3>
                  <Button variant="ghost" size="sm" className="text-primary">
                    <Plus className="h-4 w-4 mr-1" />
                    Add note
                  </Button>
                </div>
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-[5px] top-2 bottom-2 w-px bg-border" />
                  
                  <div className="space-y-4">
                    {vehicleHistory.map((event, index) => (
                      <div key={event.id} className="flex gap-4 relative">
                        <div
                          className={`w-3 h-3 rounded-full mt-1.5 z-10 ${
                            index === 0 ? "bg-primary" : "bg-muted-foreground"
                          }`}
                        />
                        <div className="flex-1 pb-4">
                          <div className="flex items-start gap-2">
                            <event.icon className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="text-sm text-foreground">{event.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {event.date}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="vehicle-data" className="mt-6">
          <VehicleData />
        </TabsContent>

        <TabsContent value="technical" className="mt-6">
          <VehicleTechnicalData />
        </TabsContent>

        <TabsContent value="drivers" className="mt-6">
          <div className="bg-card rounded-lg border border-border p-8 text-center">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Driver History</h3>
            <p className="text-muted-foreground">
              View and manage driver assignments for this vehicle.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <VehicleDocuments />
        </TabsContent>

        <TabsContent value="contracts" className="mt-6">
          <VehicleContracts />
        </TabsContent>

        <TabsContent value="fuel-cards" className="mt-6">
          <div className="bg-card rounded-lg border border-border p-8 text-center">
            <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Fuel Cards</h3>
            <p className="text-muted-foreground">
              Linked fuel cards and transaction history.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="damages" className="mt-6">
          <div className="bg-card rounded-lg border border-border p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Damages</h3>
            <p className="text-muted-foreground">
              Record and track vehicle damage incidents.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="invoices" className="mt-6">
          <div className="bg-card rounded-lg border border-border p-8 text-center">
            <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Invoices</h3>
            <p className="text-muted-foreground">
              View all invoices related to this vehicle.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="mt-6">
          <div className="bg-card rounded-lg border border-border p-8 text-center">
            <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Tasks</h3>
            <p className="text-muted-foreground">
              Manage pending and completed tasks for this vehicle.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}



