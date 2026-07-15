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
 * Read-only "Technical Data" view for a vehicle.
 * Mirrors the field groups of the Vehicle Edit form's "Technical" tab
 * (Motor & Drivetrain / Measurements & Weights) as a searchable spec sheet.
 * ──────────────────────────────────────────────────────────────────────────── */

// ── Motor & Drivetrain (single column) ──
const motorSpecs: Spec[] = [
  { label: "Rated Power (kW / hp)", value: "135 kW / 184 hp" },
  { label: "Torque", value: "300 Nm" },
  { label: "Number of Gears", value: "8" },
  { label: "Cylinders", value: "4" },
  { label: "Cyl. Arrangement", value: "Inline" },
  { label: "Top Speed", value: "235 km/h" },
  { label: "Acceleration", value: "7.1 s (0–100 km/h)" },
  { label: "Displacement", value: "1998 cc" },
];

// ── Measurements & Weights (two columns — left / right, matching the layout) ──
const measurementLeft: Spec[] = [
  { label: "Empty Weight", value: "1,500 kg" },
  { label: "Payload", value: "550 kg" },
  { label: "Boot Volume (Max)", value: "1,510 L" },
  { label: "No of Driven Axles", value: "1" },
  { label: "Length", value: "4,709 mm" },
  { label: "Height", value: "1,435 mm" },
  { label: "Tire Size (Axle 2)", value: "255/40 R18" },
  { label: "Towing Capacity – Braked", value: "1,600 kg" },
];

const measurementRight: Spec[] = [
  { label: "Max Weight", value: "2,050 kg" },
  { label: "Boot Volume (Normal)", value: "480 L" },
  { label: "Number of Axles", value: "2" },
  { label: "Wheelbase", value: "2,851 mm" },
  { label: "Width", value: "1,827 mm" },
  { label: "Tire Size (Axle 1)", value: "225/45 R18" },
  { label: "Roof Load", value: "75 kg" },
  { label: "Towing Capacity – Unbraked", value: "750 kg" },
];

export function VehicleTechnicalData() {
  const [query, setQuery] = useState("");

  const motor = useMemo(() => filterSpecs(motorSpecs, query), [query]);
  const measLeft = useMemo(() => filterSpecs(measurementLeft, query), [query]);
  const measRight = useMemo(() => filterSpecs(measurementRight, query), [query]);

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
                <SpecColumn items={motor} />
              </SpecCard>
            </div>
          )}

          {showMeasurements && (
            <div className={cn(showMotor ? "lg:col-span-7" : "lg:col-span-12")}>
              <SpecCard icon={Ruler} title="Measurements & Weights">
                <SpecTwoColumn left={measLeft} right={measRight} />
              </SpecCard>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
