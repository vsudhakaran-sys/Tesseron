import { useMemo, useState } from "react";
import { Cog, Ruler } from "lucide-react";
import { cn } from "@/utils/utils";
import {
  type Spec,
  SpecCard,
  SpecColumn,
  SpecTwoColumn,
  FindFieldInput,
  NoFieldsFound,
  filterSpecs,
} from "./SpecSheet";

/* ────────────────────────────────────────────────────────────────────────────
 * Dynamic "Technical Data" view — read & inline-edit specs sheet.
 * ──────────────────────────────────────────────────────────────────────────── */

interface VehicleTechnicalDataProps {
  vehicle: any;
  onUpdate?: (fieldKey: string, newValue: any) => void;
}

export function VehicleTechnicalData({ vehicle, onUpdate }: VehicleTechnicalDataProps) {
  const [query, setQuery] = useState("");

  // ── Motor & Drivetrain ──
  const motorSpecs: Spec[] = useMemo(() => [
    { label: "Rated Power (kW / hp)", value: vehicle.ratedPower || "135 kW / 184 hp", fieldKey: "ratedPower" },
    { label: "Torque", value: vehicle.torque || "300 Nm", fieldKey: "torque" },
    { label: "Number of Gears", value: vehicle.gearsCount || "8", fieldKey: "gearsCount" },
    { label: "Cylinders", value: vehicle.cylindersCount || "4", fieldKey: "cylindersCount" },
    { label: "Cyl. Arrangement", value: vehicle.cylinderArrangement || "Inline", fieldKey: "cylinderArrangement" },
    { label: "Top Speed", value: vehicle.topSpeed || "235 km/h", fieldKey: "topSpeed" },
    { label: "Acceleration", value: vehicle.acceleration || "7.1s", fieldKey: "acceleration" },
    { label: "Displacement", value: vehicle.engineDisplacement || "1998 cc", fieldKey: "engineDisplacement" },
  ], [vehicle]);

  // ── Measurements & Weights ──
  const measurementLeft: Spec[] = useMemo(() => [
    { label: "Empty Weight", value: vehicle.emptyWeight || "1,500 kg", fieldKey: "emptyWeight" },
    { label: "Payload", value: vehicle.payload || "550 kg", fieldKey: "payload" },
    { label: "Boot Volume (Max)", value: vehicle.bootCapacity || "1,510 L", fieldKey: "bootCapacity" },
    { label: "No of Driven Axles", value: vehicle.drivenAxlesCount || "1", fieldKey: "drivenAxlesCount" },
    { label: "Length", value: vehicle.length || "4,709 mm", fieldKey: "length" },
    { label: "Height", value: vehicle.height || "1,435 mm", fieldKey: "height" },
    { label: "Tire Size (Axle 2)", value: vehicle.tireSizeAxle2 || "255/40 R18", fieldKey: "tireSizeAxle2" },
    { label: "Towing Capacity – Braked", value: vehicle.brakedTrailerLoad || "1,600 kg", fieldKey: "brakedTrailerLoad" },
  ], [vehicle]);

  const measurementRight: Spec[] = useMemo(() => [
    { label: "Max Weight", value: vehicle.maxWeightAllowed || "2,050 kg", fieldKey: "maxWeightAllowed" },
    { label: "Boot Volume (Normal)", value: vehicle.bootCapacity || "480 L", fieldKey: "bootCapacity" },
    { label: "Number of Axles", value: vehicle.axesCount || "2", fieldKey: "axesCount" },
    { label: "Wheelbase", value: vehicle.wheelbase || "2,851 mm", fieldKey: "wheelbase" },
    { label: "Width", value: vehicle.width || "1,827 mm", fieldKey: "width" },
    { label: "Tire Size (Axle 1)", value: vehicle.tireSizeAxle1 || "225/45 R18", fieldKey: "tireSizeAxle1" },
    { label: "Roof Load", value: vehicle.roofLoad || "75 kg", fieldKey: "roofLoad" },
    { label: "Towing Capacity – Unbraked", value: vehicle.unbrakedTrailerLoad || "750 kg", fieldKey: "unbrakedTrailerLoad" },
  ], [vehicle]);

  const motor = useMemo(() => filterSpecs(motorSpecs, query), [motorSpecs, query]);
  const measLeft = useMemo(() => filterSpecs(measurementLeft, query), [measurementLeft, query]);
  const measRight = useMemo(() => filterSpecs(measurementRight, query), [measurementRight, query]);

  const showMotor = motor.length > 0;
  const showMeasurements = measLeft.length > 0 || measRight.length > 0;
  const noResults = !showMotor && !showMeasurements;

  return (
    <div className="aria-card rounded-2xl p-5 sm:p-6 space-y-6 animate-fade-in">
      <FindFieldInput value={query} onChange={setQuery} />

      {noResults ? (
        <NoFieldsFound query={query} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {showMotor && (
            <div className="lg:col-span-5">
              <SpecCard icon={Cog} title="Motor & Drivetrain">
                <SpecColumn items={motor} onSave={onUpdate} />
              </SpecCard>
            </div>
          )}

          {showMeasurements && (
            <div className={cn(showMotor ? "lg:col-span-7" : "lg:col-span-12")}>
              <SpecCard icon={Ruler} title="Measurements & Weights">
                <SpecTwoColumn left={measLeft} right={measRight} onSave={onUpdate} />
              </SpecCard>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
