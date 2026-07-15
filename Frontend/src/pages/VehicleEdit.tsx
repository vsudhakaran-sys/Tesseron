import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/common/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/common/ui/dialog";
import { VehicleForm } from "@/components/feature-specific/fleet/VehicleForm";
import { getVehicleById, updateVehicle, deleteVehicle } from "./Vehicles";

export default function VehicleEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const vehicle = getVehicleById(id ?? "");
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!vehicle) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" asChild className="mt-1">
            <Link to="/vehicles">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold text-foreground">Vehicle</h1>
        </div>
        <div className="bg-card rounded-xl border border-border border-dashed p-12 text-center">
          <p className="text-sm font-semibold text-foreground">Vehicle not found</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/vehicles")}>
            Back to Vehicles
          </Button>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    deleteVehicle(vehicle.id);
    setConfirmDelete(false);
    toast.success("Vehicle deleted.");
    navigate("/vehicles");
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" asChild className="mt-1">
          <Link to="/vehicles">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-semibold text-foreground">{vehicle.displayName}</h1>
          <p className="text-sm text-muted-foreground">
            {vehicle.manufacturer} {vehicle.model}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setConfirmDelete(true)}
          className="h-9 px-4 text-xs font-semibold tracking-wide border-border text-destructive hover:text-destructive hover:bg-destructive/5 shrink-0"
        >
          <Trash2 className="h-4 w-4 mr-1.5" />
          Delete
        </Button>
      </div>

      <VehicleForm
        vehicle={vehicle}
        onCancel={() => navigate("/vehicles")}
        onSaved={(v) => {
          updateVehicle(v);
          navigate("/vehicles");
        }}
      />

      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete vehicle?</DialogTitle>
            <DialogDescription>
              This permanently removes {vehicle.displayName} and its data. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
            <Button onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              <Trash2 className="h-4 w-4 mr-1.5" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
