import type { SelectOption } from "./FormFields";

/**
 * Mock vehicle catalog (UI prototype only).
 * Picking a manufacturer filters the model list; picking a model auto-populates
 * the model-level spec/technical fields in the Vehicle drawer's Specs tab.
 */
export interface ModelSpecs {
  vehicleType?: string;
  fuelType?: string;
  emissionClass?: string;
  co2Value?: string;
  transmissionType?: string;
  driveType?: string;
  seating?: string;
  doorsNumber?: string;
  tankVolume?: string;
  fuelConsumption?: string;
  ratedPower?: string;
  torque?: string;
  engineDisplacement?: string;
  cylindersCount?: string;
  cylinderArrangement?: string;
  batteryCapacity?: string;
  range?: string;
  maxChargingPower?: string;
}

interface CatalogModel {
  value: string;
  label: string;
  specs: ModelSpecs;
}

// Internal-combustion default block — keeps EV fields explicitly "N/A".
const ice = (s: Omit<ModelSpecs, "batteryCapacity" | "range" | "maxChargingPower">): ModelSpecs => ({
  batteryCapacity: "N/A",
  range: "N/A",
  maxChargingPower: "N/A",
  ...s,
});

// Electric default block — zeroes the combustion fields.
const ev = (s: ModelSpecs): ModelSpecs => ({
  fuelType: "Electric",
  emissionClass: "Zero Emission",
  co2Value: "0",
  transmissionType: "Automatic",
  tankVolume: "0",
  engineDisplacement: "0 cc",
  cylindersCount: "0",
  cylinderArrangement: "Electric",
  ...s,
});

const CATALOG: Record<string, CatalogModel[]> = {
  BMW: [
    { value: "3 Series", label: "3 Series", specs: ice({ vehicleType: "Sedan", fuelType: "Petrol", emissionClass: "Euro 6d", co2Value: "148", transmissionType: "Automatic", driveType: "Rear-Wheel Drive", seating: "5", doorsNumber: "4", tankVolume: "59", fuelConsumption: "6.5 L/100km", ratedPower: "135 kW / 184 hp", torque: "300 Nm", engineDisplacement: "1998 cc", cylindersCount: "4", cylinderArrangement: "Inline" }) },
    { value: "X3", label: "X3", specs: ice({ vehicleType: "SUV", fuelType: "Diesel", emissionClass: "Euro 6d", co2Value: "165", transmissionType: "Automatic", driveType: "All-Wheel Drive", seating: "5", doorsNumber: "5", tankVolume: "65", fuelConsumption: "6.8 L/100km", ratedPower: "140 kW / 190 hp", torque: "400 Nm", engineDisplacement: "1995 cc", cylindersCount: "4", cylinderArrangement: "Inline" }) },
    { value: "i4", label: "i4 (Electric)", specs: ev({ vehicleType: "Sedan", driveType: "Rear-Wheel Drive", seating: "5", doorsNumber: "4", fuelConsumption: "16 kWh/100km", ratedPower: "250 kW / 340 hp", torque: "430 Nm", batteryCapacity: "80 kWh", range: "520 km", maxChargingPower: "200 kW" }) },
  ],
  Peugeot: [
    { value: "3008", label: "3008", specs: ice({ vehicleType: "SUV", fuelType: "Petrol", emissionClass: "Euro 6d-Temp", co2Value: "130", transmissionType: "Automatic", driveType: "Front-Wheel Drive", seating: "5", doorsNumber: "5", tankVolume: "53", fuelConsumption: "6.0 L/100km", ratedPower: "96 kW / 131 hp", torque: "230 Nm", engineDisplacement: "1199 cc", cylindersCount: "3", cylinderArrangement: "Inline" }) },
    { value: "208", label: "208", specs: ice({ vehicleType: "Hatchback", fuelType: "Petrol", emissionClass: "Euro 6d", co2Value: "108", transmissionType: "Manual", driveType: "Front-Wheel Drive", seating: "5", doorsNumber: "5", tankVolume: "44", fuelConsumption: "5.0 L/100km", ratedPower: "74 kW / 100 hp", torque: "205 Nm", engineDisplacement: "1199 cc", cylindersCount: "3", cylinderArrangement: "Inline" }) },
  ],
  Toyota: [
    { value: "Corolla", label: "Corolla", specs: ice({ vehicleType: "Hatchback", fuelType: "Hybrid", emissionClass: "Euro 6", co2Value: "102", transmissionType: "CVT", driveType: "Front-Wheel Drive", seating: "5", doorsNumber: "5", tankVolume: "43", fuelConsumption: "4.5 L/100km", ratedPower: "90 kW / 122 hp", torque: "142 Nm", engineDisplacement: "1798 cc", cylindersCount: "4", cylinderArrangement: "Inline" }) },
    { value: "RAV4", label: "RAV4", specs: ice({ vehicleType: "SUV", fuelType: "Hybrid", emissionClass: "Euro 6", co2Value: "126", transmissionType: "CVT", driveType: "All-Wheel Drive", seating: "5", doorsNumber: "5", tankVolume: "55", fuelConsumption: "5.6 L/100km", ratedPower: "160 kW / 218 hp", torque: "221 Nm", engineDisplacement: "2487 cc", cylindersCount: "4", cylinderArrangement: "Inline" }) },
  ],
  Volkswagen: [
    { value: "Golf", label: "Golf", specs: ice({ vehicleType: "Hatchback", fuelType: "Petrol", emissionClass: "Euro 6d", co2Value: "120", transmissionType: "Dual-Clutch", driveType: "Front-Wheel Drive", seating: "5", doorsNumber: "5", tankVolume: "50", fuelConsumption: "5.5 L/100km", ratedPower: "110 kW / 150 hp", torque: "250 Nm", engineDisplacement: "1498 cc", cylindersCount: "4", cylinderArrangement: "Inline" }) },
    { value: "Passat", label: "Passat", specs: ice({ vehicleType: "Station Wagon", fuelType: "Diesel", emissionClass: "Euro 6d", co2Value: "125", transmissionType: "Dual-Clutch", driveType: "Front-Wheel Drive", seating: "5", doorsNumber: "5", tankVolume: "66", fuelConsumption: "4.8 L/100km", ratedPower: "110 kW / 150 hp", torque: "360 Nm", engineDisplacement: "1968 cc", cylindersCount: "4", cylinderArrangement: "Inline" }) },
    { value: "ID.4", label: "ID.4 (Electric)", specs: ev({ vehicleType: "SUV", driveType: "Rear-Wheel Drive", seating: "5", doorsNumber: "5", fuelConsumption: "17 kWh/100km", ratedPower: "150 kW / 204 hp", torque: "310 Nm", batteryCapacity: "77 kWh", range: "520 km", maxChargingPower: "135 kW" }) },
  ],
  Renault: [
    { value: "Megane", label: "Megane", specs: ice({ vehicleType: "Station Wagon", fuelType: "Petrol", emissionClass: "Euro 6", co2Value: "132", transmissionType: "Automatic", driveType: "Front-Wheel Drive", seating: "5", doorsNumber: "5", tankVolume: "50", fuelConsumption: "5.8 L/100km", ratedPower: "103 kW / 140 hp", torque: "260 Nm", engineDisplacement: "1332 cc", cylindersCount: "4", cylinderArrangement: "Inline" }) },
    { value: "Clio", label: "Clio", specs: ice({ vehicleType: "Hatchback", fuelType: "Petrol", emissionClass: "Euro 6d", co2Value: "110", transmissionType: "Manual", driveType: "Front-Wheel Drive", seating: "5", doorsNumber: "5", tankVolume: "42", fuelConsumption: "5.2 L/100km", ratedPower: "67 kW / 90 hp", torque: "160 Nm", engineDisplacement: "999 cc", cylindersCount: "3", cylinderArrangement: "Inline" }) },
  ],
  Audi: [
    { value: "A4", label: "A4", specs: ice({ vehicleType: "Sedan", fuelType: "Petrol", emissionClass: "Euro 6d", co2Value: "138", transmissionType: "Dual-Clutch", driveType: "Front-Wheel Drive", seating: "5", doorsNumber: "4", tankVolume: "54", fuelConsumption: "6.0 L/100km", ratedPower: "110 kW / 150 hp", torque: "270 Nm", engineDisplacement: "1984 cc", cylindersCount: "4", cylinderArrangement: "Inline" }) },
    { value: "Q5", label: "Q5", specs: ice({ vehicleType: "SUV", fuelType: "Diesel", emissionClass: "Euro 6d", co2Value: "160", transmissionType: "Automatic", driveType: "All-Wheel Drive", seating: "5", doorsNumber: "5", tankVolume: "70", fuelConsumption: "6.5 L/100km", ratedPower: "150 kW / 204 hp", torque: "400 Nm", engineDisplacement: "1968 cc", cylindersCount: "4", cylinderArrangement: "Inline" }) },
  ],
  Skoda: [
    { value: "Octavia", label: "Octavia", specs: ice({ vehicleType: "Station Wagon", fuelType: "Petrol", emissionClass: "Euro 6d-Temp", co2Value: "118", transmissionType: "Dual-Clutch", driveType: "Front-Wheel Drive", seating: "5", doorsNumber: "5", tankVolume: "50", fuelConsumption: "5.3 L/100km", ratedPower: "110 kW / 150 hp", torque: "250 Nm", engineDisplacement: "1498 cc", cylindersCount: "4", cylinderArrangement: "Inline" }) },
    { value: "Superb", label: "Superb", specs: ice({ vehicleType: "Sedan", fuelType: "Diesel", emissionClass: "Euro 6d", co2Value: "125", transmissionType: "Automatic", driveType: "Front-Wheel Drive", seating: "5", doorsNumber: "5", tankVolume: "66", fuelConsumption: "4.9 L/100km", ratedPower: "110 kW / 150 hp", torque: "340 Nm", engineDisplacement: "1968 cc", cylindersCount: "4", cylinderArrangement: "Inline" }) },
  ],
  Tesla: [
    { value: "Model 3", label: "Model 3", specs: ev({ vehicleType: "Sedan", driveType: "Rear-Wheel Drive", seating: "5", doorsNumber: "4", fuelConsumption: "18 kWh/100km", ratedPower: "208 kW / 283 hp", torque: "420 Nm", batteryCapacity: "75 kWh", range: "500 km", maxChargingPower: "250 kW" }) },
    { value: "Model Y", label: "Model Y", specs: ev({ vehicleType: "SUV", driveType: "All-Wheel Drive", seating: "5", doorsNumber: "5", fuelConsumption: "19 kWh/100km", ratedPower: "324 kW / 440 hp", torque: "493 Nm", batteryCapacity: "75 kWh", range: "480 km", maxChargingPower: "250 kW" }) },
  ],
  Volvo: [
    { value: "XC40", label: "XC40", specs: ice({ vehicleType: "SUV", fuelType: "Petrol", emissionClass: "Euro 6", co2Value: "144", transmissionType: "Automatic", driveType: "Front-Wheel Drive", seating: "5", doorsNumber: "5", tankVolume: "54", fuelConsumption: "6.8 L/100km", ratedPower: "120 kW / 163 hp", torque: "265 Nm", engineDisplacement: "1477 cc", cylindersCount: "3", cylinderArrangement: "Inline" }) },
    { value: "XC60", label: "XC60", specs: ice({ vehicleType: "SUV", fuelType: "Diesel", emissionClass: "Euro 6d", co2Value: "150", transmissionType: "Automatic", driveType: "All-Wheel Drive", seating: "5", doorsNumber: "5", tankVolume: "60", fuelConsumption: "6.0 L/100km", ratedPower: "145 kW / 197 hp", torque: "420 Nm", engineDisplacement: "1969 cc", cylindersCount: "4", cylinderArrangement: "Inline" }) },
  ],
  "Mercedes-Benz": [
    { value: "C-Class", label: "C-Class", specs: ice({ vehicleType: "Sedan", fuelType: "Petrol", emissionClass: "Euro 6d", co2Value: "145", transmissionType: "Automatic", driveType: "Rear-Wheel Drive", seating: "5", doorsNumber: "4", tankVolume: "66", fuelConsumption: "6.4 L/100km", ratedPower: "150 kW / 204 hp", torque: "300 Nm", engineDisplacement: "1496 cc", cylindersCount: "4", cylinderArrangement: "Inline" }) },
    { value: "E-Class", label: "E-Class", specs: ice({ vehicleType: "Sedan", fuelType: "Diesel", emissionClass: "Euro 6d", co2Value: "140", transmissionType: "Automatic", driveType: "Rear-Wheel Drive", seating: "5", doorsNumber: "4", tankVolume: "66", fuelConsumption: "5.0 L/100km", ratedPower: "143 kW / 194 hp", torque: "400 Nm", engineDisplacement: "1993 cc", cylindersCount: "4", cylinderArrangement: "Inline" }) },
    { value: "GLC", label: "GLC", specs: ice({ vehicleType: "SUV", fuelType: "Diesel", emissionClass: "Euro 6d", co2Value: "155", transmissionType: "Automatic", driveType: "All-Wheel Drive", seating: "5", doorsNumber: "5", tankVolume: "50", fuelConsumption: "5.5 L/100km", ratedPower: "145 kW / 197 hp", torque: "400 Nm", engineDisplacement: "1993 cc", cylindersCount: "4", cylinderArrangement: "Inline" }) },
  ],
  Ford: [
    { value: "Focus", label: "Focus", specs: ice({ vehicleType: "Hatchback", fuelType: "Petrol", emissionClass: "Euro 6d", co2Value: "125", transmissionType: "Manual", driveType: "Front-Wheel Drive", seating: "5", doorsNumber: "5", tankVolume: "52", fuelConsumption: "5.5 L/100km", ratedPower: "92 kW / 125 hp", torque: "210 Nm", engineDisplacement: "1497 cc", cylindersCount: "3", cylinderArrangement: "Inline" }) },
    { value: "Kuga", label: "Kuga", specs: ice({ vehicleType: "SUV", fuelType: "Plug-in Hybrid", emissionClass: "Euro 6d", co2Value: "32", transmissionType: "Automatic", driveType: "Front-Wheel Drive", seating: "5", doorsNumber: "5", tankVolume: "45", fuelConsumption: "1.4 L/100km", ratedPower: "165 kW / 225 hp", torque: "200 Nm", engineDisplacement: "2488 cc", cylindersCount: "4", cylinderArrangement: "Inline" }) },
  ],
  Nissan: [
    { value: "Qashqai", label: "Qashqai", specs: ice({ vehicleType: "SUV", fuelType: "Petrol", emissionClass: "Euro 6d", co2Value: "138", transmissionType: "Automatic", driveType: "Front-Wheel Drive", seating: "5", doorsNumber: "5", tankVolume: "55", fuelConsumption: "6.0 L/100km", ratedPower: "116 kW / 158 hp", torque: "270 Nm", engineDisplacement: "1332 cc", cylindersCount: "4", cylinderArrangement: "Inline" }) },
    { value: "Leaf", label: "Leaf (Electric)", specs: ev({ vehicleType: "Hatchback", driveType: "Front-Wheel Drive", seating: "5", doorsNumber: "5", fuelConsumption: "17 kWh/100km", ratedPower: "110 kW / 150 hp", torque: "320 Nm", batteryCapacity: "40 kWh", range: "270 km", maxChargingPower: "50 kW" }) },
  ],
};

export const MANUFACTURER_OPTIONS: SelectOption[] = Object.keys(CATALOG)
  .sort((a, b) => a.localeCompare(b))
  .map((m) => ({ value: m, label: m }));

/** Models available for a given manufacturer (empty if unknown / none selected). */
export function getModelOptions(manufacturer: string): SelectOption[] {
  return (CATALOG[manufacturer] ?? []).map((m) => ({ value: m.value, label: m.label }));
}

/** Spec defaults for a manufacturer + model pairing, or null if not in the catalog. */
export function getModelSpecs(manufacturer: string, model: string): ModelSpecs | null {
  return CATALOG[manufacturer]?.find((m) => m.value === model)?.specs ?? null;
}
