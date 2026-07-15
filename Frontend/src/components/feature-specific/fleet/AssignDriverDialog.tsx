import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiGet, apiPost } from "@/services/api";
import { Link } from "react-router-dom";
import { Button } from "@/components/common/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/common/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common/ui/select";

interface Driver {
  driver_id: string;
  name: string | null;
  license_class: string | null;
  status: string | null;
}

interface AssignDriverDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicleId: string;
  vehicleName: string;
  vehicleStatus: string;
  currentDriverId?: string;
  onAssigned: (vehicleId: string, driverId: string) => void;
  onUnassigned?: (vehicleId: string) => void;
}

export function AssignDriverDialog({
  open,
  onOpenChange,
  vehicleId,
  vehicleName,
  vehicleStatus,
  currentDriverId,
  onAssigned,
  onUnassigned,
}: AssignDriverDialogProps) {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  // F2: a driver can only be assigned to an active vehicle.
  const vehicleAssignable = vehicleStatus === "active";
  const alreadyAssigned = !!currentDriverId;

  useEffect(() => {
    // Only load the driver pool when the vehicle can actually take one.
    if (!open || !vehicleAssignable || alreadyAssigned) return;
    setSelected("");
    setLoading(true);
    // Backend returns only active, unassigned drivers (F2).
    apiGet<Driver[]>("/drivers/assignable")
      .then(setDrivers)
      .catch((err) => toast.error(`Failed to load drivers: ${err.message}`))
      .finally(() => setLoading(false));
  }, [open, vehicleAssignable, alreadyAssigned]);

  const handleAssign = async () => {
    if (!selected) return;
    setSubmitting(true);
    try {
      await apiPost(`/vehicles/${vehicleId}/assign`, { driver_id: selected });
      toast.success(`Driver ${selected} assigned to ${vehicleName}`);
      onAssigned(vehicleId, selected);
      onOpenChange(false);
    } catch (err) {
      toast.error((err as Error).message || "Assignment failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnassign = async () => {
    setSubmitting(true);
    try {
      await apiPost(`/vehicles/${vehicleId}/unassign`);
      toast.success(`Driver unassigned from ${vehicleName}`);
      onUnassigned?.(vehicleId);
      onOpenChange(false);
    } catch (err) {
      toast.error((err as Error).message || "Unassign failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Driver</DialogTitle>
          <DialogDescription>
            Assign an active driver to <span className="font-medium text-foreground">{vehicleName}</span>.
          </DialogDescription>
        </DialogHeader>

        {!vehicleAssignable ? (
          <p className="text-sm text-destructive py-2">
            Only active vehicles can be assigned a driver. This vehicle is {vehicleStatus || "not active"}.
          </p>
        ) : alreadyAssigned ? (
          <p className="text-sm text-muted-foreground py-2">
            Already assigned to{" "}
            <Link to="/drivers" className="text-primary hover:underline">
              {currentDriverId}
            </Link>
            . Unassign first to assign a different driver.
          </p>
        ) : loading ? (
          <p className="text-sm text-muted-foreground py-2">Loading available drivers…</p>
        ) : drivers.length === 0 ? (
          <p className="text-sm text-muted-foreground py-2">
            No active, unassigned drivers available.
          </p>
        ) : (
          <div className="py-2">
            <Select value={selected} onValueChange={setSelected}>
              <SelectTrigger>
                <SelectValue placeholder="Select a driver" />
              </SelectTrigger>
              <SelectContent>
                {drivers.map((d) => (
                  <SelectItem key={d.driver_id} value={d.driver_id}>
                    {d.driver_id} — {d.name || "Unnamed"}
                    {d.license_class ? ` (${d.license_class})` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {alreadyAssigned ? (
            <Button variant="destructive" onClick={handleUnassign} disabled={submitting}>
              {submitting ? "Unassigning…" : "Unassign"}
            </Button>
          ) : (
            <Button
              onClick={handleAssign}
              disabled={!vehicleAssignable || !selected || submitting}
            >
              {submitting ? "Assigning…" : "Assign"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
