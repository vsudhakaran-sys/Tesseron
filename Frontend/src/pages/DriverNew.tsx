import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/common/ui/button";
import { DriverForm } from "@/components/feature-specific/fleet/DriverForm";
import { addDriver } from "./Drivers";

export default function DriverNew() {
  const navigate = useNavigate();
  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" asChild className="mt-1">
          <Link to="/drivers">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-foreground">Add New Driver</h1>
          <p className="text-sm text-muted-foreground">Register a new driver with minimal details.</p>
        </div>
      </div>

      <DriverForm
        driver={null}
        onCancel={() => navigate("/drivers")}
        onSaved={(d) => {
          const rec = addDriver(d);
          navigate(`/drivers/${rec.id}/edit`);
        }}
      />
    </div>
  );
}
