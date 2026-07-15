import { AlertTriangle, Flag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/common/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/common/ui/alert";

interface TCOWarning {
  title: string;
  description: string;
  actionLabel?: string;
}

interface TCOWarningsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehiclePlate: string;
  warnings: TCOWarning[];
}

export function TCOWarningsDialog({
  open,
  onOpenChange,
  vehiclePlate,
  warnings,
}: TCOWarningsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Vehicle TCO warnings — {vehiclePlate}</DialogTitle>
        </DialogHeader>

        <Alert variant="destructive" className="border-amber-500/50 bg-amber-50 text-amber-900 dark:bg-amber-950/30 dark:text-amber-200 [&>svg]:text-amber-600">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="font-semibold">
            Attention, the TCO calculation for this vehicle is very likely inaccurate!
          </AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-300">
            If any of these warnings are not applicable, please review monitoring settings for this vehicle:
            <br />
            <button className="text-primary hover:underline font-medium mt-1">
              Review monitoring settings
            </button>
          </AlertDescription>
        </Alert>

        <div className="space-y-0 divide-y divide-border">
          {warnings.map((warning, index) => (
            <div key={index} className="py-4 first:pt-2">
              <div className="flex items-start gap-3">
                <Flag className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <h4 className="font-semibold text-foreground">{warning.title}</h4>
                  <p className="text-sm text-muted-foreground">{warning.description}</p>
                  {warning.actionLabel && (
                    <button className="text-sm text-primary hover:underline font-medium">
                      {warning.actionLabel}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}



