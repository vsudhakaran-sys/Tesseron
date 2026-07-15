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
 * Read-only "Vehicle Data" view — the read-side of the Vehicle Edit form's
 * Organisation / Lifecycle / Specs tabs, rendered as a searchable spec sheet.
 * ──────────────────────────────────────────────────────────────────────────── */

// ── Organisation & Fleet Data (two columns) ──
const orgLeft: Spec[] = [
  { label: "License Plate", value: "34-CD-AB" },
  { label: "Branch", value: "TESSERON (entire organization)" },
  { label: "SAP Order Number", value: "SAP-8829102" },
  { label: "Registered Owner", value: "TESSERON Fleet Ltd" },
  { label: "Internal Asset ID", value: "V-1" },
];
const orgRight: Spec[] = [
  { label: "Status", value: "Active" },
  { label: "Cost Center", value: "CC-8092" },
  { label: "Vehicle Fleet", value: "Main Fleet" },
  { label: "Supplier / Retailer", value: "AutoDealer BV" },
  { label: "Customer", value: "TESSERON" },
];

// ── Lifecycle, Compliance & Costs (single column) ──
const lifecycle: Spec[] = [
  { label: "Next HU Inspection Date", value: "2026-02-10" },
  { label: "Last Vehicle UVV Inspection", value: "2025-02-10" },
  { label: "Recorded Mileage", value: "42,150 km" },
  { label: "Date of Recording KM", value: "2025-08-10" },
  { label: "Order Date", value: "2024-01-15" },
  { label: "First Registration", value: "2024-02-10" },
  { label: "Manufacturing Date", value: "2023-11-01" },
  { label: "Deregistration", value: "" },
  { label: "Vehicle Road Tax (€/year)", value: "€ 120" },
  { label: "Insurance Number", value: "INS-7823456" },
  { label: "Tire Type", value: "All-Season" },
  { label: "Vehicle Branding / Decals", value: "Partially Wrapped" },
  { label: "Parking Location", value: "Main HQ Garage" },
  { label: "Vehicle Wrapping / Branding", value: "None" },
  { label: "Private Use Flat Rate (€/month)", value: "€ 250" },
];

// ── Manufacturer (two columns) ──
const mfrLeft: Spec[] = [
  { label: "Manufacturer", value: "BMW" },
  { label: "Model Variant / Trim", value: "Sport Line" },
  { label: "Vehicle Identification Number (VIN)", value: "WBA1234567890" },
  { label: "Type Key Number (TSN)", value: "CSX" },
  { label: "CO₂ Value (g/km)", value: "148" },
];
const mfrRight: Spec[] = [
  { label: "Model", value: "3 Series" },
  { label: "Vehicle Type / Category", value: "Sedan" },
  { label: "Vehicle Color", value: "Sapphire Black" },
  { label: "Emission Class", value: "Euro 6d" },
  { label: "Propulsion Type", value: "Petrol" },
];

// ── Energy, Drive & Capacity (two columns) ──
const energyLeft: Spec[] = [
  { label: "Fuel Type", value: "Petrol" },
  { label: "Fuel Consumption (NEDC/WLTP)", value: "6.5 L/100km" },
  { label: "Drive Type", value: "Rear-Wheel Drive" },
  { label: "Seating (incl. driver)", value: "5" },
  { label: "Date of Manufacture", value: "2023-11-01" },
  { label: "Interior Paint", value: "Black" },
  { label: "Padding", value: "Sport" },
];
const energyRight: Spec[] = [
  { label: "Tank Volume (L)", value: "59" },
  { label: "Type of Transmission", value: "Automatic" },
  { label: "Taxation", value: "Standard" },
  { label: "Number of Doors", value: "4" },
  { label: "Country of Manufacture", value: "Germany" },
  { label: "Interior Material", value: "Leather" },
];

// ── Electric / Hybrid Attributes (single column) ──
const electric: Spec[] = [
  { label: "Battery (kWh)", value: "N/A" },
  { label: "Range", value: "N/A" },
  { label: "Max Charging", value: "N/A" },
];

export function VehicleData() {
  const [query, setQuery] = useState("");

  const fOrgL = useMemo(() => filterSpecs(orgLeft, query), [query]);
  const fOrgR = useMemo(() => filterSpecs(orgRight, query), [query]);
  const fLife = useMemo(() => filterSpecs(lifecycle, query), [query]);
  const fMfrL = useMemo(() => filterSpecs(mfrLeft, query), [query]);
  const fMfrR = useMemo(() => filterSpecs(mfrRight, query), [query]);
  const fEnergyL = useMemo(() => filterSpecs(energyLeft, query), [query]);
  const fEnergyR = useMemo(() => filterSpecs(energyRight, query), [query]);
  const fElectric = useMemo(() => filterSpecs(electric, query), [query]);

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
                <SpecTwoColumn left={fOrgL} right={fOrgR} />
              </SpecCard>
            )}
            {showMfr && (
              <SpecCard icon={Sliders} title="Manufacturer">
                <SpecTwoColumn left={fMfrL} right={fMfrR} />
              </SpecCard>
            )}
            {showEnergy && (
              <SpecCard icon={Gauge} title="Energy, Drive & Capacity">
                <SpecTwoColumn left={fEnergyL} right={fEnergyR} />
              </SpecCard>
            )}
          </div>

          {/* Right column — the tall, single-column cards */}
          <div className="lg:col-span-5 space-y-5">
            {showLife && (
              <SpecCard icon={CalendarClock} title="Lifecycle, Compliance & Costs">
                <SpecColumn items={fLife} />
              </SpecCard>
            )}
            {showElectric && (
              <SpecCard icon={BatteryCharging} title="Electric / Hybrid Attributes">
                <SpecColumn items={fElectric} />
              </SpecCard>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


