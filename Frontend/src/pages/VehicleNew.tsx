import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/common/ui/button";
import { VehicleForm } from "@/components/feature-specific/fleet/VehicleForm";
import { addVehicle } from "./Vehicles";

export default function VehicleNew() {
  const navigate = useNavigate();
  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" asChild className="mt-1">
          <Link to="/vehicles">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-foreground">Add New Vehicle</h1>
          <p className="text-sm text-muted-foreground">Create a new vehicle record with minimal required details.</p>
        </div>
      </div>

      <VehicleForm
        vehicle={null}
        onCancel={() => navigate("/vehicles")}
        onSaved={(v) => {
          const rec = addVehicle(v);
          navigate(`/vehicles/${rec.id}/edit`);
        }}
      />
    </div>
  );
}
