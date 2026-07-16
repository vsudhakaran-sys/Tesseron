import { useState } from "react";
import { Car, AlertTriangle, Receipt, User, ChevronRight } from "lucide-react";
import { cn } from "@/utils/utils";
import { VehicleRequestSheet } from "@/components/feature-specific/driver/VehicleRequestSheet";
import { DamageReportSheet } from "@/components/feature-specific/driver/DamageReportSheet";
import { BillUploadSheet } from "@/components/feature-specific/driver/BillUploadSheet";

type SheetType = "vehicle" | "damage" | "bill" | null;

const actionCards = [
  {
    id: "vehicle" as const,
    title: "Request Vehicle",
    description: "Book a pool vehicle for your trip",
    icon: Car,
    color: "bg-primary/10 text-primary",
  },
  {
    id: "damage" as const,
    title: "Report Damage",
    description: "Submit a damage report for your vehicle",
    icon: AlertTriangle,
    color: "bg-amber-500/10 text-amber-600",
  },
  {
    id: "bill" as const,
    title: "Upload Bill",
    description: "Submit fuel or expense receipts",
    icon: Receipt,
    color: "bg-emerald-500/10 text-emerald-600",
  },
];

export default function DriverPortal() {
  const [activeSheet, setActiveSheet] = useState<SheetType>(null);

  return (
    <div className="min-h-[100dvh] bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-4 pt-12 pb-8">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <User className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-primary-foreground/70">Welcome back,</p>
              <h1 className="text-xl font-semibold">Thomas Müller</h1>
            </div>
          </div>
          <p className="text-sm text-primary-foreground/70 mt-4">
            Vehicle: BMW 320d • B-TM 1234
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-4 -mt-4">
        <div className="max-w-lg mx-auto">
          <div className="bg-card rounded-xl border shadow-sm p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-semibold text-foreground">3</p>
                <p className="text-xs text-muted-foreground">Open Requests</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">12</p>
                <p className="text-xs text-muted-foreground">Trips This Month</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-emerald-600">✓</p>
                <p className="text-xs text-muted-foreground">License Valid</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="px-4 py-6">
        <div className="max-w-lg mx-auto space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
            Quick Actions
          </h2>
          {actionCards.map((card) => (
            <button
              key={card.id}
              onClick={() => setActiveSheet(card.id)}
              className="w-full bg-card hover:bg-accent/50 border rounded-xl p-4 flex items-center gap-4 transition-colors text-left group"
            >
              <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", card.color)}>
                <card.icon className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground">{card.title}</h3>
                <p className="text-sm text-muted-foreground truncate">{card.description}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-4 pb-8">
        <div className="max-w-lg mx-auto">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
            Recent Activity
          </h2>
          <div className="bg-card border rounded-xl divide-y">
            <div className="p-4 flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Receipt className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">Fuel receipt uploaded</p>
                <p className="text-xs text-muted-foreground">€45.80 • Shell Station</p>
              </div>
              <span className="text-xs text-muted-foreground">2h ago</span>
            </div>
            <div className="p-4 flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Car className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">Vehicle request approved</p>
                <p className="text-xs text-muted-foreground">VW Passat • Feb 5-7</p>
              </div>
              <span className="text-xs text-muted-foreground">1d ago</span>
            </div>
            <div className="p-4 flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">Damage report submitted</p>
                <p className="text-xs text-muted-foreground">Minor scratch • Under review</p>
              </div>
              <span className="text-xs text-muted-foreground">3d ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sheets */}
      <VehicleRequestSheet 
        open={activeSheet === "vehicle"} 
        onOpenChange={(open) => !open && setActiveSheet(null)} 
      />
      <DamageReportSheet 
        open={activeSheet === "damage"} 
        onOpenChange={(open) => !open && setActiveSheet(null)} 
      />
      <BillUploadSheet 
        open={activeSheet === "bill"} 
        onOpenChange={(open) => !open && setActiveSheet(null)} 
      />
    </div>
  );
}



