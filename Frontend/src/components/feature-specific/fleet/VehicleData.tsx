import { useMemo, useState } from "react";
import { Building2, CalendarClock, Sliders, Gauge, BatteryCharging } from "lucide-react";
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
 * Dynamic "Vehicle Data" view — read & inline-edit specs sheet.
 * ──────────────────────────────────────────────────────────────────────────── */

interface VehicleDataProps {
  vehicle: any;
  onUpdate?: (fieldKey: string, newValue: any) => void;
}

export function VehicleData({ vehicle, onUpdate }: VehicleDataProps) {
  const [query, setQuery] = useState("");

  // ── Organisation & Fleet Data (two columns) ──
  const orgLeft: Spec[] = useMemo(() => [
    { label: "License Plate", value: vehicle.displayName, fieldKey: "displayName" },
    { label: "Branch", value: vehicle.fleet || "TESSERON (entire organization)", fieldKey: "fleet" },
    { label: "SAP Order Number", value: vehicle.sapOrderNumber, fieldKey: "sapOrderNumber" },
    { label: "Registered Owner", value: vehicle.owner || "TESSERON Fleet Ltd", fieldKey: "owner" },
    { label: "Internal Asset ID", value: vehicle.internalId, fieldKey: "internalId" },
  ], [vehicle]);

  const orgRight: Spec[] = useMemo(() => [
    { label: "Status", value: vehicle.status ? vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1) : "Active", fieldKey: "status" },
    { label: "Cost Center", value: vehicle.costCenter || "CC-8092", fieldKey: "costCenter" },
    { label: "Vehicle Fleet", value: vehicle.fleet || "Main Fleet", fieldKey: "fleet" },
    { label: "Supplier / Retailer", value: vehicle.supplier || "AutoDealer BV", fieldKey: "supplier" },
    { label: "Customer", value: vehicle.owner || "TESSERON", fieldKey: "owner" },
  ], [vehicle]);

  // ── Lifecycle, Compliance & Costs ──
  const lifecycle: Spec[] = useMemo(() => [
    { label: "Next HU Inspection Date", value: vehicle.nextMot || "2026-02-10", fieldKey: "nextMot" },
    { label: "Last Vehicle UVV Inspection", value: vehicle.safetyInspection || "2025-02-10", fieldKey: "safetyInspection" },
    { label: "Recorded Mileage", value: vehicle.mileage ? `${Number(vehicle.mileage).toLocaleString()} km` : "—", fieldKey: "mileage" },
    { label: "Date of Recording KM", value: vehicle.mileageRecordingDate || "2025-08-10", fieldKey: "mileageRecordingDate" },
    { label: "Order Date", value: vehicle.orderDate || "2024-01-15", fieldKey: "orderDate" },
    { label: "First Registration", value: vehicle.firstRegistration || "2024-02-10", fieldKey: "firstRegistration" },
    { label: "Manufacturing Date", value: vehicle.manufactureDate || "2023-11-01", fieldKey: "manufactureDate" },
    { label: "Deregistration", value: vehicle.deregistrationDate || "", fieldKey: "deregistrationDate" },
    { label: "Vehicle Road Tax (€/year)", value: vehicle.tax ? `€ ${vehicle.tax}` : "—", fieldKey: "tax" },
    { label: "Insurance Number", value: vehicle.insuranceNumber || "INS-7823456", fieldKey: "insuranceNumber" },
    { label: "Tire Type", value: vehicle.tireType || "All-Season", fieldKey: "tireType" },
    { label: "Vehicle Branding / Decals", value: vehicle.wrapping || "None", fieldKey: "wrapping" },
    { label: "Parking Location", value: vehicle.parkingLocation || "Main HQ Garage", fieldKey: "parkingLocation" },
    { label: "Private Use Flat Rate (€/month)", value: vehicle.privateUseRate ? `€ ${vehicle.privateUseRate}` : "—", fieldKey: "privateUseRate" },
  ], [vehicle]);

  // ── Manufacturer ──
  const mfrLeft: Spec[] = useMemo(() => [
    { label: "Manufacturer", value: vehicle.manufacturer, fieldKey: "manufacturer" },
    { label: "Model Variant / Trim", value: vehicle.modelVariant || "Sport Line", fieldKey: "modelVariant" },
    { label: "Vehicle Identification Number (VIN)", value: vehicle.chassisNumber || "WBA1234567890", fieldKey: "chassisNumber" },
    { label: "Type Key Number (TSN)", value: vehicle.hsnTsn || "CSX", fieldKey: "hsnTsn" },
    { label: "CO₂ Value (g/km)", value: vehicle.co2Value || "148", fieldKey: "co2Value" },
  ], [vehicle]);

  const mfrRight: Spec[] = useMemo(() => [
    { label: "Model", value: vehicle.model, fieldKey: "model" },
    { label: "Vehicle Type / Category", value: vehicle.vehicleType || "Sedan", fieldKey: "vehicleType" },
    { label: "Vehicle Color", value: vehicle.color || "Sapphire Black", fieldKey: "color" },
    { label: "Emission Class", value: vehicle.emissionClass || "Euro 6d", fieldKey: "emissionClass" },
    { label: "Propulsion Type", value: vehicle.fuelType || "Petrol", fieldKey: "fuelType" },
  ], [vehicle]);

  // ── Energy, Drive & Capacity ──
  const energyLeft: Spec[] = useMemo(() => [
    { label: "Fuel Type", value: vehicle.fuelType || "Petrol", fieldKey: "fuelType" },
    { label: "Fuel Consumption (NEDC/WLTP)", value: vehicle.fuelConsumption || "6.5 L/100km", fieldKey: "fuelConsumption" },
    { label: "Drive Type", value: vehicle.driveType || "Rear-Wheel Drive", fieldKey: "driveType" },
    { label: "Seating (incl. driver)", value: vehicle.seating || "5", fieldKey: "seating" },
    { label: "Date of Manufacture", value: vehicle.manufactureDate || "2023-11-01", fieldKey: "manufactureDate" },
    { label: "Interior Paint", value: vehicle.interiorPaint || "Black", fieldKey: "interiorPaint" },
    { label: "Padding", value: vehicle.interiorPadding || "Sport", fieldKey: "interiorPadding" },
  ], [vehicle]);

  const energyRight: Spec[] = useMemo(() => [
    { label: "Tank Volume (L)", value: vehicle.tankVolume || "59", fieldKey: "tankVolume" },
    { label: "Type of Transmission", value: vehicle.transmissionType || "Automatic", fieldKey: "transmissionType" },
    { label: "Taxation", value: vehicle.taxation || "Standard", fieldKey: "taxation" },
    { label: "Number of Doors", value: vehicle.doorsNumber || "4", fieldKey: "doorsNumber" },
    { label: "Country of Manufacture", value: vehicle.manufactureCountry || "Germany", fieldKey: "manufactureCountry" },
    { label: "Interior Material", value: vehicle.interiorMaterial || "Leather", fieldKey: "interiorMaterial" },
  ], [vehicle]);

  // ── Electric / Hybrid Attributes ──
  const electric: Spec[] = useMemo(() => [
    { label: "Battery (kWh)", value: vehicle.batteryCapacity || "N/A", fieldKey: "batteryCapacity" },
    { label: "Range", value: vehicle.range || "N/A", fieldKey: "range" },
    { label: "Max Charging", value: vehicle.maxChargingPower || "N/A", fieldKey: "maxChargingPower" },
  ], [vehicle]);

  const fOrgL = useMemo(() => filterSpecs(orgLeft, query), [orgLeft, query]);
  const fOrgR = useMemo(() => filterSpecs(orgRight, query), [orgRight, query]);
  const fLife = useMemo(() => filterSpecs(lifecycle, query), [lifecycle, query]);
  const fMfrL = useMemo(() => filterSpecs(mfrLeft, query), [mfrLeft, query]);
  const fMfrR = useMemo(() => filterSpecs(mfrRight, query), [mfrRight, query]);
  const fEnergyL = useMemo(() => filterSpecs(energyLeft, query), [energyLeft, query]);
  const fEnergyR = useMemo(() => filterSpecs(energyRight, query), [energyRight, query]);
  const fElectric = useMemo(() => filterSpecs(electric, query), [electric, query]);

  const showOrg = fOrgL.length + fOrgR.length > 0;
  const showLife = fLife.length > 0;
  const showMfr = fMfrL.length + fMfrR.length > 0;
  const showEnergy = fEnergyL.length + fEnergyR.length > 0;
  const showElectric = fElectric.length > 0;
  const noResults = !showOrg && !showLife && !showMfr && !showEnergy && !showElectric;

  return (
    <div className="aria-card rounded-2xl p-5 sm:p-6 space-y-6 animate-fade-in">
      <FindFieldInput value={query} onChange={setQuery} />

      {noResults ? (
        <NoFieldsFound query={query} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left column — the wide, two-column cards */}
          <div className="lg:col-span-7 space-y-5">
            {showOrg && (
              <SpecCard icon={Building2} title="Organisation & Fleet Data">
                <SpecTwoColumn left={fOrgL} right={fOrgR} onSave={onUpdate} />
              </SpecCard>
            )}
            {showMfr && (
              <SpecCard icon={Sliders} title="Manufacturer">
                <SpecTwoColumn left={fMfrL} right={fMfrR} onSave={onUpdate} />
              </SpecCard>
            )}
            {showEnergy && (
              <SpecCard icon={Gauge} title="Energy, Drive & Capacity">
                <SpecTwoColumn left={fEnergyL} right={fEnergyR} onSave={onUpdate} />
              </SpecCard>
            )}
          </div>

          {/* Right column — the tall, single-column cards */}
          <div className="lg:col-span-5 space-y-5">
            {showLife && (
              <SpecCard icon={CalendarClock} title="Lifecycle, Compliance & Costs">
                <SpecColumn items={fLife} onSave={onUpdate} />
              </SpecCard>
            )}
            {showElectric && (
              <SpecCard icon={BatteryCharging} title="Electric / Hybrid Attributes">
                <SpecColumn items={fElectric} onSave={onUpdate} />
              </SpecCard>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


