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
import { DriverForm } from "@/components/feature-specific/fleet/DriverForm";
import { getDriverById, updateDriver, deleteDriver } from "./Drivers";

export default function DriverEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const driver = getDriverById(id ?? "");
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!driver) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" asChild className="mt-1">
            <Link to="/drivers">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold text-foreground">Driver</h1>
        </div>
        <div className="bg-card rounded-xl border border-border border-dashed p-12 text-center">
          <p className="text-sm font-semibold text-foreground">Driver not found</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/drivers")}>
            Back to Drivers
          </Button>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    deleteDriver(driver.id);
    setConfirmDelete(false);
    toast.success("Driver deleted.");
    navigate("/drivers");
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" asChild className="mt-1">
          <Link to="/drivers">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-semibold text-foreground">{driver.name}</h1>
          <p className="text-sm text-muted-foreground">{driver.email}</p>
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

      <DriverForm
        driver={driver}
        onCancel={() => navigate("/drivers")}
        onSaved={(d) => {
          updateDriver(d);
          navigate("/drivers");
        }}
      />

      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete driver?</DialogTitle>
            <DialogDescription>
              This permanently removes {driver.name} and their data. This action cannot be undone.
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
