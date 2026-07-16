import { cn } from "@/utils/utils";

interface VehicleIconProps {
  licensePlate: string;
  className?: string;
}

export function VehicleIcon({ licensePlate, className }: VehicleIconProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 rounded bg-primary/5 border-l-2 border-primary font-mono text-sm font-medium text-foreground",
        className
      )}
    >
      <span>{licensePlate}</span>
    </div>
  );
}



