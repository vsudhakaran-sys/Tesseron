import { useEffect, useState } from "react";
import { Building2, Landmark, Sliders, CalendarClock, Cog, Ruler, Gauge, BatteryCharging } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/common/ui/button";
import { Textarea } from "@/components/common/ui/textarea";
import { Field, DateField, SelectField, ComboField } from "./FormFields";
import { MANUFACTURER_OPTIONS, getModelOptions, getModelSpecs } from "./vehicleCatalog";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/common/ui/select";
import { SubtleSelectItem } from "../customers/SubtleSelectItem";
import { SectionHeader } from "../customers/SectionHeader";
import { OnboardingTips } from "../customers/OnboardingTips";
import { FleetCarousel } from "./FleetCarousel";

interface VehicleFormProps {
  vehicle: any | null; // null means "Create Mode"
  onSaved: (vehicle: any) => void;
  onCancel: () => void;
}

// Dropdown option sets for enumerable vehicle attributes.
const VEHICLE_TYPE_OPTIONS = [
  { value: "Sedan", label: "Sedan" },
  { value: "Hatchback", label: "Hatchback" },
  { value: "Station Wagon", label: "Station Wagon / Estate" },
  { value: "SUV", label: "SUV" },
  { value: "Coupé", label: "Coupé" },
  { value: "Convertible", label: "Convertible" },
  { value: "MPV / Van", label: "MPV / Van" },
  { value: "Pickup", label: "Pickup" },
  { value: "Truck (LCV)", label: "Truck / LCV" },
];

const EMISSION_CLASS_OPTIONS = [
  { value: "Euro 4", label: "Euro 4" },
  { value: "Euro 5", label: "Euro 5" },
  { value: "Euro 6", label: "Euro 6" },
  { value: "Euro 6d", label: "Euro 6d" },
  { value: "Zero Emission", label: "Zero Emission (Electric)" },
];

const FUEL_TYPE_OPTIONS = [
  { value: "Petrol", label: "Petrol" },
  { value: "Diesel", label: "Diesel" },
  { value: "Electric", label: "Electric (BEV)" },
  { value: "Plug-in Hybrid", label: "Plug-in Hybrid (PHEV)" },
  { value: "Hybrid", label: "Hybrid (HEV)" },
  { value: "LPG", label: "LPG" },
  { value: "CNG", label: "CNG" },
  { value: "Hydrogen", label: "Hydrogen (FCEV)" },
];

const TRANSMISSION_OPTIONS = [
  { value: "Manual", label: "Manual" },
  { value: "Automatic", label: "Automatic" },
  { value: "Semi-Automatic", label: "Semi-Automatic" },
  { value: "CVT", label: "CVT" },
  { value: "Dual-Clutch", label: "Dual-Clutch (DCT)" },
];

const DRIVE_TYPE_OPTIONS = [
  { value: "Front-Wheel Drive", label: "Front-Wheel Drive" },
  { value: "Rear-Wheel Drive", label: "Rear-Wheel Drive" },
  { value: "All-Wheel Drive", label: "All-Wheel Drive (4x4)" },
];

const TAXATION_OPTIONS = [
  { value: "Standard", label: "Standard" },
  { value: "Reduced", label: "Reduced" },
  { value: "Exempt", label: "Exempt" },
];

const CYLINDER_ARRANGEMENT_OPTIONS = [
  { value: "Inline", label: "Inline" },
  { value: "V-Type", label: "V-Type" },
  { value: "Boxer", label: "Boxer" },
  { value: "W-Type", label: "W-Type" },
  { value: "Rotary", label: "Rotary" },
  { value: "Electric", label: "Electric (None)" },
];

const INTERIOR_MATERIAL_OPTIONS = [
  { value: "Cloth", label: "Cloth" },
  { value: "Leather", label: "Leather" },
  { value: "Part-Leather", label: "Part-Leather" },
  { value: "Alcantara", label: "Alcantara" },
  { value: "Synthetic", label: "Synthetic" },
];

const LEASING_TYPE_OPTIONS = [
  { value: "Full-Service Leasing", label: "Full-Service Leasing" },
  { value: "Finance Leasing", label: "Finance Leasing" },
  { value: "Operating Leasing", label: "Operating Leasing" },
  { value: "Owned / Purchased", label: "Owned / Purchased" },
];

const TRANSFER_OPTIONS = [
  { value: "Employee Vehicle", label: "Employee Vehicle" },
  { value: "Pool Vehicle", label: "Pool Vehicle" },
  { value: "Service Vehicle", label: "Service Vehicle" },
  { value: "Replacement Vehicle", label: "Replacement Vehicle" },
];

type VehicleTab = "organisation" | "lifecycle" | "specs" | "technical" | "leasing";

export function VehicleForm({ vehicle, onSaved, onCancel }: VehicleFormProps) {
  const isEdit = !!vehicle;

  // Active tab state in edit mode
  const [activeTab, setActiveTab] = useState<VehicleTab>("organisation");

  // Minimal / Common fields (Form States)
  const [displayName, setDisplayName] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");
  const [status, setStatus] = useState<"active" | "maintenance" | "inactive">("active");

  // Organisation
  const [fleet, setFleet] = useState("");
  const [subFleet, setSubFleet] = useState("");
  const [costCenter, setCostCenter] = useState("");
  const [sapOrderNumber, setSapOrderNumber] = useState("");
  const [owner, setOwner] = useState("");
  const [internalId, setInternalId] = useState("");

  // Lifecycle, compliance & costs
  const [orderDate, setOrderDate] = useState("");
  const [firstRegistration, setFirstRegistration] = useState("");
  const [constructionDate, setConstructionDate] = useState("");
  const [nextMot, setNextMot] = useState("");
  const [safetyInspection, setSafetyInspection] = useState("");
  const [deregistrationDate, setDeregistrationDate] = useState("");
  const [tax, setTax] = useState("");
  const [tireType, setTireType] = useState("All-Season");
  const [parkingLocation, setParkingLocation] = useState("");
  const [mileage, setMileage] = useState("");
  const [mileageRecordingDate, setMileageRecordingDate] = useState("");
  const [wrapping, setWrapping] = useState("");
  const [supplier, setSupplier] = useState("");
  const [privateUseRate, setPrivateUseRate] = useState("");
  const [remarks, setRemarks] = useState("");

  // Manufacturer's specifications
  const [modelVariant, setModelVariant] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [chassisNumber, setChassisNumber] = useState("");
  const [color, setColor] = useState("");
  const [hsnTsn, setHsnTsn] = useState("");
  const [emissionClass, setEmissionClass] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [tankVolume, setTankVolume] = useState("");
  const [fuelConsumption, setFuelConsumption] = useState("");
  const [co2Value, setCo2Value] = useState("");
  const [seating, setSeating] = useState("");
  const [doorsNumber, setDoorsNumber] = useState("");
  const [driveType, setDriveType] = useState("");
  const [taxation, setTaxation] = useState("");
  const [transmissionType, setTransmissionType] = useState("");
  const [manufactureDate, setManufactureDate] = useState("");
  const [manufactureCountry, setManufactureCountry] = useState("");
  const [interiorPaint, setInteriorPaint] = useState("");
  const [interiorMaterial, setInteriorMaterial] = useState("");
  const [interiorPadding, setInteriorPadding] = useState("");
  const [batteryCapacity, setBatteryCapacity] = useState("");
  const [range, setRange] = useState("");
  const [maxChargingPower, setMaxChargingPower] = useState("");

  // Technical data (motor, drive, measurements & weights)
  const [ratedPower, setRatedPower] = useState("");
  const [torque, setTorque] = useState("");
  const [gearsCount, setGearsCount] = useState("");
  const [cylindersCount, setCylindersCount] = useState("");
  const [cylinderArrangement, setCylinderArrangement] = useState("");
  const [topSpeed, setTopSpeed] = useState("");
  const [acceleration, setAcceleration] = useState("");
  const [engineDisplacement, setEngineDisplacement] = useState("");
  const [emptyWeight, setEmptyWeight] = useState("");
  const [maxWeightAllowed, setMaxWeightAllowed] = useState("");
  const [payloadWeight, setPayloadWeight] = useState("");
  const [bootCapacity, setBootCapacity] = useState("");
  const [axesCount, setAxesCount] = useState("");
  const [drivenAxlesCount, setDrivenAxlesCount] = useState("");
  const [wheelbase, setWheelbase] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [tireSizeAxle1, setTireSizeAxle1] = useState("");
  const [tireSizeAxle2, setTireSizeAxle2] = useState("");
  const [roofLoad, setRoofLoad] = useState("");
  const [brakedTrailerLoad, setBrakedTrailerLoad] = useState("");
  const [unbrakedTrailerLoad, setUnbrakedTrailerLoad] = useState("");

  // Leasing / contract & assignment (list-view) fields
  const [leasingPartner, setLeasingPartner] = useState("");
  const [leasingType, setLeasingType] = useState("");
  const [contractNumber, setContractNumber] = useState("");
  const [leasePayment, setLeasePayment] = useState("");
  const [leaseStart, setLeaseStart] = useState("");
  const [leaseEnd, setLeaseEnd] = useState("");
  const [transfer, setTransfer] = useState("");
  const [currentDriver, setCurrentDriver] = useState("");
  const [driverCostCenter, setDriverCostCenter] = useState("");

  // Initialize or reset states
  useEffect(() => {
    {
      setActiveTab("organisation");
      if (vehicle) {
        setDisplayName(vehicle.displayName || "");
        setManufacturer(vehicle.manufacturer || "");
        setModel(vehicle.model || "");
        setStatus(vehicle.status || "active");
        setFleet(vehicle.fleet || "Main Fleet");
        setSubFleet(vehicle.subFleet || "Delivery Division");
        setCostCenter(vehicle.costCenter || "CC-8092");
        setSapOrderNumber(vehicle.sapOrderNumber || "");
        setOwner(vehicle.owner || "TESSERON Fleet Ltd");
        setInternalId(vehicle.internalId || `V-${vehicle.id}`);

        setOrderDate(vehicle.orderDate || "2024-01-15");
        setFirstRegistration(vehicle.firstRegistration || "2024-02-10");
        setConstructionDate(vehicle.constructionDate || "2023");
        setNextMot(vehicle.nextMot || "2026-02-10");
        setSafetyInspection(vehicle.safetyInspection || "2025-02-10");
        setDeregistrationDate(vehicle.deregistrationDate || "");
        setTax(vehicle.tax || "120");
        setTireType(vehicle.tireType || "All-Season");
        setParkingLocation(vehicle.parkingLocation || "Main HQ Garage");
        setMileage(vehicle.mileage ? String(vehicle.mileage) : "");
        setMileageRecordingDate(vehicle.mileageRecordingDate || "2025-08-10");
        setWrapping(vehicle.wrapping || "None");
        setSupplier(vehicle.supplier || "AutoDealer BV");
        setPrivateUseRate(vehicle.privateUseRate || "250");
        setRemarks(vehicle.remarks || "");

        setModelVariant(vehicle.modelVariant || "Sport Line");
        setVehicleType(vehicle.vehicleType || "Sedan");
        setChassisNumber(vehicle.chassisNumber || "WBA1234567890");
        setColor(vehicle.color || "Sapphire Black");
        setHsnTsn(vehicle.hsnTsn || "0005/CSX");
        setEmissionClass(vehicle.emissionClass || "Euro 6");
        setFuelType(vehicle.fuelType || "Petrol");
        setTankVolume(vehicle.tankVolume || "59");
        setFuelConsumption(vehicle.fuelConsumption || "6.5 L/100km");
        setCo2Value(vehicle.co2Value || "148");
        setSeating(vehicle.seating || "5");
        setDoorsNumber(vehicle.doorsNumber || "4");
        setDriveType(vehicle.driveType || "Rear-Wheel Drive");
        setTaxation(vehicle.taxation || "Standard");
        setTransmissionType(vehicle.transmissionType || "Automatic");
        setManufactureDate(vehicle.manufactureDate || "2023-11-01");
        setManufactureCountry(vehicle.manufactureCountry || "Germany");
        setInteriorPaint(vehicle.interiorPaint || "Black");
        setInteriorMaterial(vehicle.interiorMaterial || "Leather");
        setInteriorPadding(vehicle.interiorPadding || "Sport");
        setBatteryCapacity(vehicle.batteryCapacity || "N/A");
        setRange(vehicle.range || "N/A");
        setMaxChargingPower(vehicle.maxChargingPower || "N/A");

        setRatedPower(vehicle.ratedPower || "135 kW / 184 hp");
        setTorque(vehicle.torque || "300 Nm");
        setGearsCount(vehicle.gearsCount || "8");
        setCylindersCount(vehicle.cylindersCount || "4");
        setCylinderArrangement(vehicle.cylinderArrangement || "Inline");
        setTopSpeed(vehicle.topSpeed || "235 km/h");
        setAcceleration(vehicle.acceleration || "7.1s");
        setEngineDisplacement(vehicle.engineDisplacement || "1998 cc");
        setEmptyWeight(vehicle.emptyWeight || "1500 kg");
        setMaxWeightAllowed(vehicle.maxWeightAllowed || "2050 kg");
        setPayloadWeight(vehicle.payload || "550 kg");
        setBootCapacity(vehicle.bootCapacity || "480 L");
        setAxesCount(vehicle.axesCount || "2");
        setDrivenAxlesCount(vehicle.drivenAxlesCount || "1");
        setWheelbase(vehicle.wheelbase || "2851 mm");
        setLength(vehicle.length || "4709 mm");
        setWidth(vehicle.width || "1827 mm");
        setHeight(vehicle.height || "1435 mm");
        setTireSizeAxle1(vehicle.tireSizeAxle1 || "225/45 R18");
        setTireSizeAxle2(vehicle.tireSizeAxle2 || "255/40 R18");
        setRoofLoad(vehicle.roofLoad || "75 kg");
        setBrakedTrailerLoad(vehicle.brakedTrailerLoad || "1600 kg");
        setUnbrakedTrailerLoad(vehicle.unbrakedTrailerLoad || "750 kg");

        setLeasingPartner(vehicle.leasingPartner || vehicle.vendor || "LeasePlan");
        setLeasingType(vehicle.leasingType || "Full-Service Leasing");
        setContractNumber(vehicle.contractNumber || `LC-${vehicle.id || "0000"}-88`);
        setLeasePayment(vehicle.leasePayment || "499");
        setLeaseStart(vehicle.leaseStart || vehicle.firstRegistration || "2024-02-10");
        setLeaseEnd(vehicle.leaseEnd || "2027-02-10");
        setTransfer(vehicle.transfer || "Employee Vehicle");
        setCurrentDriver(vehicle.driver || "");
        setDriverCostCenter(vehicle.driverCostCenter || vehicle.costCenter || "CC-8092");
      } else {
        setDisplayName("");
        setManufacturer("");
        setModel("");
        setStatus("active");
        setFleet("");
        setSubFleet("");
        setCostCenter("");
        setSapOrderNumber("");
        setOwner("");
        setInternalId("");
        setOrderDate("");
        setFirstRegistration("");
        setConstructionDate("");
        setNextMot("");
        setSafetyInspection("");
        setDeregistrationDate("");
        setTax("");
        setTireType("All-Season");
        setParkingLocation("");
        setMileage("");
        setMileageRecordingDate("");
        setWrapping("");
        setSupplier("");
        setPrivateUseRate("");
        setRemarks("");
        setModelVariant("");
        setVehicleType("");
        setChassisNumber("");
        setColor("");
        setHsnTsn("");
        setEmissionClass("");
        setFuelType("");
        setTankVolume("");
        setFuelConsumption("");
        setCo2Value("");
        setSeating("");
        setDoorsNumber("");
        setDriveType("");
        setTaxation("");
        setTransmissionType("");
        setManufactureDate("");
        setManufactureCountry("");
        setInteriorPaint("");
        setInteriorMaterial("");
        setInteriorPadding("");
        setBatteryCapacity("");
        setRange("");
        setMaxChargingPower("");
        setRatedPower("");
        setTorque("");
        setGearsCount("");
        setCylindersCount("");
        setCylinderArrangement("");
        setTopSpeed("");
        setAcceleration("");
        setEngineDisplacement("");
        setEmptyWeight("");
        setMaxWeightAllowed("");
        setPayloadWeight("");
        setBootCapacity("");
        setAxesCount("");
        setDrivenAxlesCount("");
        setWheelbase("");
        setLength("");
        setWidth("");
        setHeight("");
        setTireSizeAxle1("");
        setTireSizeAxle2("");
        setRoofLoad("");
        setBrakedTrailerLoad("");
        setUnbrakedTrailerLoad("");
        setLeasingPartner("");
        setLeasingType("");
        setContractNumber("");
        setLeasePayment("");
        setLeaseStart("");
        setLeaseEnd("");
        setTransfer("");
        setCurrentDriver("");
        setDriverCostCenter("");
      }
    }
  }, [vehicle]);

  const handleSave = () => {
    if (!displayName.trim()) {
      toast.error("Please enter a License Plate / Display Name");
      return;
    }
    if (!manufacturer.trim()) {
      toast.error("Please enter a Manufacturer");
      return;
    }
    if (!model.trim()) {
      toast.error("Please enter a Model");
      return;
    }

    const payload = {
      ...(vehicle || {}),
      displayName,
      manufacturer,
      model,
      status,
      // Organisation
      fleet,
      subFleet,
      costCenter,
      sapOrderNumber,
      owner,
      internalId,
      // Lifecycle, compliance & costs
      orderDate,
      firstRegistration,
      constructionDate,
      nextMot,
      safetyInspection,
      deregistrationDate,
      tax,
      tireType,
      parkingLocation,
      mileage: mileage ? parseInt(mileage, 10) : 0,
      mileageRecordingDate,
      wrapping,
      supplier,
      privateUseRate,
      remarks,
      // Manufacturer's specifications
      modelVariant,
      vehicleType,
      chassisNumber,
      color,
      hsnTsn,
      emissionClass,
      fuelType,
      tankVolume,
      fuelConsumption,
      co2Value,
      seating,
      doorsNumber,
      driveType,
      taxation,
      transmissionType,
      manufactureDate,
      manufactureCountry,
      interiorPaint,
      interiorMaterial,
      interiorPadding,
      batteryCapacity,
      range,
      maxChargingPower,
      // Technical data
      ratedPower,
      torque,
      gearsCount,
      cylindersCount,
      cylinderArrangement,
      topSpeed,
      acceleration,
      engineDisplacement,
      emptyWeight,
      maxWeightAllowed,
      payload: payloadWeight,
      bootCapacity,
      axesCount,
      drivenAxlesCount,
      wheelbase,
      length,
      width,
      height,
      tireSizeAxle1,
      tireSizeAxle2,
      roofLoad,
      brakedTrailerLoad,
      unbrakedTrailerLoad,
      // Leasing / contract & assignment
      leasingPartner,
      leasingType,
      contractNumber,
      leasePayment,
      leaseStart,
      leaseEnd,
      transfer,
      driverCostCenter,
      vendor: leasingPartner || vehicle?.vendor || "LeasePlan",
      contractEnd: vehicle?.contractEnd || "Dec 2025",
      age: vehicle?.age || 2,
      driver: vehicle?.driver || null,
    };

    onSaved(payload);
    toast.success(isEdit ? "Vehicle updated successfully!" : "Vehicle created successfully!");
  };

  // Auto-populate the model-level spec/technical fields when a catalog model is picked.
  const applyModelSpecs = (mfr: string, modelName: string) => {
    const specs = getModelSpecs(mfr, modelName);
    if (!specs) return;
    const setters: Record<string, (v: string) => void> = {
      vehicleType: setVehicleType,
      fuelType: setFuelType,
      emissionClass: setEmissionClass,
      co2Value: setCo2Value,
      transmissionType: setTransmissionType,
      driveType: setDriveType,
      seating: setSeating,
      doorsNumber: setDoorsNumber,
      tankVolume: setTankVolume,
      fuelConsumption: setFuelConsumption,
      ratedPower: setRatedPower,
      torque: setTorque,
      engineDisplacement: setEngineDisplacement,
      cylindersCount: setCylindersCount,
      cylinderArrangement: setCylinderArrangement,
      batteryCapacity: setBatteryCapacity,
      range: setRange,
      maxChargingPower: setMaxChargingPower,
    };
    (Object.entries(specs) as [string, string | undefined][]).forEach(([key, val]) => {
      if (val !== undefined) setters[key]?.(val);
    });
  };

  const tabs: { key: VehicleTab; label: string; icon: typeof Building2 }[] = [
    { key: "organisation", label: "Organisation", icon: Building2 },
    { key: "lifecycle", label: "Lifecycle", icon: CalendarClock },
    { key: "specs", label: "Specs", icon: Sliders },
    { key: "technical", label: "Technical", icon: Cog },
    { key: "leasing", label: "Leasing", icon: Landmark },
  ];

  return (
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        {/* Tab switch layout inside Edit mode */}
        {isEdit && (
          <div className="flex border-b border-border bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md p-1.5 gap-1">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg whitespace-nowrap transition-all duration-200 ${
                  activeTab === key
                    ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/50 dark:border-slate-700/50"
                    : "text-muted-foreground hover:text-foreground hover:bg-slate-100/50 dark:hover:bg-slate-800/30"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 shrink-0 transition-colors ${activeTab === key ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"}`} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {!isEdit ? (
            <div className="flex flex-col min-h-full">
              <div className="space-y-4">
                <SectionHeader icon={Building2} label="Core Details" />

                <Field label="License Plate / Display Name" id="plate" value={displayName} onChange={setDisplayName} placeholder="e.g. 34-CD-AB" mono required />

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Manufacturer" id="mfr" value={manufacturer} onChange={setManufacturer} placeholder="e.g. BMW" required />
                  <Field label="Model" id="model" value={model} onChange={setModel} placeholder="e.g. 3 Series" required />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground opacity-85" htmlFor="status">
                    Status
                  </label>
                  <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                    <SelectTrigger id="status" className="h-9 text-xs bg-white dark:bg-slate-900 rounded-lg">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent className="z-[110] rounded-xl border border-border shadow-lg">
                      <SubtleSelectItem value="active">Active</SubtleSelectItem>
                      <SubtleSelectItem value="maintenance">Maintenance</SubtleSelectItem>
                      <SubtleSelectItem value="inactive">Inactive</SubtleSelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4 mt-2">
                <OnboardingTips
                  tip={{
                    title: "Quick Registration Guidelines",
                    tips: [
                      "Required fields: Licence plate, manufacturer, and model are required to create the core record.",
                      "Detailed options: Detailed specs, technical data, financial setups, and contract items can be fully configured in the Edit screen afterwards.",
                      "Fleet allocation: Setting the status to Active prepares the vehicle to be assigned to active drivers."
                    ]
                  }}
                />
                <FleetCarousel />
              </div>
            </div>
          ) : (
            <div className="flex flex-col min-h-full">
              {/* ============== ORGANISATION TAB ============== */}
              {activeTab === "organisation" && (
                <div className="flex flex-col flex-1 animate-in fade-in duration-200">
                  <div className="space-y-5">
                    <SectionHeader icon={Building2} label="Organisation & Fleet Data" />

                    <div className="grid grid-cols-3 gap-4">
                      <Field label="License Plate (Mark)" id="edit-plate" value={displayName} onChange={setDisplayName} mono required />
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-foreground opacity-85" htmlFor="edit-status">
                          Status
                        </label>
                        <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                          <SelectTrigger id="edit-status" className="h-9 text-xs bg-white dark:bg-slate-900 rounded-lg">
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                          <SelectContent className="z-[110] rounded-xl border border-border shadow-lg">
                            <SubtleSelectItem value="active">Active</SubtleSelectItem>
                            <SubtleSelectItem value="maintenance">Maintenance</SubtleSelectItem>
                            <SubtleSelectItem value="inactive">Inactive</SubtleSelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Field label="Vehicle Fleet" id="edit-fleet" value={fleet} onChange={setFleet} />
                      <Field label="Vehicle Sub-Fleet" id="edit-subfleet" value={subFleet} onChange={setSubFleet} />
                      <Field label="Cost Center" id="edit-cc" value={costCenter} onChange={setCostCenter} />
                      <Field label="SAP Order Number" id="edit-sap" value={sapOrderNumber} onChange={setSapOrderNumber} mono />
                      <Field label="Vehicle Owner" id="edit-owner" value={owner} onChange={setOwner} />
                      <Field label="Internal Asset ID" id="edit-internal" value={internalId} onChange={setInternalId} mono />
                      <Field label="Supplier / Retailer" id="edit-supplier" value={supplier} onChange={setSupplier} />
                    </div>
                  </div>
                  <div className="mt-auto pt-6">
                    <FleetCarousel />
                  </div>
                </div>
              )}

              {/* ============== LIFECYCLE, COMPLIANCE & COSTS TAB ============== */}
              {activeTab === "lifecycle" && (
                <div className="flex flex-col flex-1 animate-in fade-in duration-200">
                  <div className="space-y-5">
                    <SectionHeader icon={CalendarClock} label="Lifecycle, Compliance & Costs" />

                    <div className="grid grid-cols-3 gap-4">
                      <DateField label="Order Date" id="edit-order-date" value={orderDate} onChange={setOrderDate} />
                      <DateField label="First Registration" id="edit-reg-date" value={firstRegistration} onChange={setFirstRegistration} />
                      <Field label="Construction Date" id="edit-build-date" value={constructionDate} onChange={setConstructionDate} />
                      <DateField label="Next MOT" id="edit-mot" value={nextMot} onChange={setNextMot} />
                      <DateField label="Safety Insp. (UVV)" id="edit-safety" value={safetyInspection} onChange={setSafetyInspection} />
                      <DateField label="Deregistration" id="edit-dereg" value={deregistrationDate} onChange={setDeregistrationDate} />
                      <Field label="Vehicle Road Tax (€/year)" id="edit-tax" value={tax} onChange={setTax} />
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-foreground opacity-85" htmlFor="edit-tires">
                          Tire Type
                        </label>
                        <Select value={tireType} onValueChange={setTireType}>
                          <SelectTrigger id="edit-tires" className="h-9 text-xs bg-white dark:bg-slate-900 rounded-lg">
                            <SelectValue placeholder="Select Tire Type" />
                          </SelectTrigger>
                          <SelectContent className="z-[110] rounded-xl border border-border shadow-lg">
                            <SubtleSelectItem value="Summer">Summer Tires</SubtleSelectItem>
                            <SubtleSelectItem value="Winter">Winter Tires</SubtleSelectItem>
                            <SubtleSelectItem value="All-Season">All-Season Tires</SubtleSelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Field label="Parking Location" id="edit-location" value={parkingLocation} onChange={setParkingLocation} />
                      <Field label="Odometer / Mileage (KM)" id="edit-mileage" value={mileage} onChange={setMileage} />
                      <DateField label="Date of Recording KM" id="edit-km-date" value={mileageRecordingDate} onChange={setMileageRecordingDate} />
                      <Field label="Vehicle Wrapping / Branding" id="edit-wrapping" value={wrapping} onChange={setWrapping} />
                      <Field label="Private Use Flat Rate (€/month)" id="edit-bik" value={privateUseRate} onChange={setPrivateUseRate} />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground opacity-85" htmlFor="edit-remarks">
                        Remarks
                      </label>
                      <Textarea
                        id="edit-remarks"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        rows={3}
                        placeholder="Add any additional notes about this vehicle…"
                        className="min-h-[72px] text-xs resize-none"
                      />
                    </div>
                  </div>
                  <div className="mt-auto pt-6">
                    <FleetCarousel />
                  </div>
                </div>
              )}

              {/* ============== MANUFACTURER SPECS TAB ============== */}
              {activeTab === "specs" && (
                <div className="flex flex-col flex-1 animate-in fade-in duration-200">
                  <div className="space-y-5">
                    <SectionHeader icon={Sliders} label="Manufacturer Specifications" />

                    <div className="grid grid-cols-3 gap-4">
                      <ComboField label="Manufacturer" id="edit-mfr" value={manufacturer} options={MANUFACTURER_OPTIONS} onChange={setManufacturer} onPick={() => setModel("")} required />
                      <ComboField label="Model" id="edit-model" value={model} options={getModelOptions(manufacturer)} onChange={setModel} onPick={(v) => applyModelSpecs(manufacturer, v)} disabled={!manufacturer} required />
                      <Field label="Model Variant / Trim" id="edit-variant" value={modelVariant} onChange={setModelVariant} />
                      <SelectField label="Vehicle Type / Category" id="edit-type" value={vehicleType} onChange={setVehicleType} options={VEHICLE_TYPE_OPTIONS} />
                      <Field label="Chassis Number (VIN)" id="edit-vin" value={chassisNumber} onChange={setChassisNumber} mono className="uppercase" />
                      <Field label="Vehicle Color" id="edit-color" value={color} onChange={setColor} />
                      <Field label="HSN / TSN Key Codes" id="edit-hsn-tsn" value={hsnTsn} onChange={setHsnTsn} mono />
                      <SelectField label="Emission Class" id="edit-emission" value={emissionClass} onChange={setEmissionClass} options={EMISSION_CLASS_OPTIONS} />
                      <Field label="CO₂ Value (g/km)" id="edit-co2" value={co2Value} onChange={setCo2Value} />
                    </div>

                    <SectionHeader icon={Gauge} label="Energy, Drive & Capacity" />

                    <div className="grid grid-cols-3 gap-4">
                      <SelectField label="Fuel Type" id="edit-fueltype" value={fuelType} onChange={setFuelType} options={FUEL_TYPE_OPTIONS} />
                      <Field label="Tank Volume (L)" id="edit-tank" value={tankVolume} onChange={setTankVolume} />
                      <Field label="Fuel Consumption (NEDC/WLTP)" id="edit-consumption" value={fuelConsumption} onChange={setFuelConsumption} />
                      <SelectField label="Type of Transmission" id="edit-transmission" value={transmissionType} onChange={setTransmissionType} options={TRANSMISSION_OPTIONS} />
                      <SelectField label="Drive Type" id="edit-drivetype" value={driveType} onChange={setDriveType} options={DRIVE_TYPE_OPTIONS} />
                      <SelectField label="Taxation" id="edit-taxation" value={taxation} onChange={setTaxation} options={TAXATION_OPTIONS} />
                      <Field label="Seating (incl. driver)" id="edit-seating" value={seating} onChange={setSeating} />
                      <Field label="Number of Doors" id="edit-doors" value={doorsNumber} onChange={setDoorsNumber} />
                      <DateField label="Date of Manufacture" id="edit-mfg-date" value={manufactureDate} onChange={setManufactureDate} />
                      <Field label="Country of Manufacture" id="edit-mfg-country" value={manufactureCountry} onChange={setManufactureCountry} />
                      <Field label="Interior Paint" id="edit-int-paint" value={interiorPaint} onChange={setInteriorPaint} />
                      <SelectField label="Interior Material" id="edit-int-material" value={interiorMaterial} onChange={setInteriorMaterial} options={INTERIOR_MATERIAL_OPTIONS} />
                      <Field label="Padding" id="edit-int-padding" value={interiorPadding} onChange={setInteriorPadding} />
                    </div>

                    <SectionHeader icon={BatteryCharging} label="Electric / Hybrid Attributes" />

                    <div className="grid grid-cols-3 gap-4">
                      <Field label="Battery (kWh)" id="edit-battery" value={batteryCapacity} onChange={setBatteryCapacity} />
                      <Field label="Range" id="edit-range" value={range} onChange={setRange} />
                      <Field label="Max Charging" id="edit-charge" value={maxChargingPower} onChange={setMaxChargingPower} />
                    </div>
                  </div>
                  <div className="mt-auto pt-6">
                    <FleetCarousel />
                  </div>
                </div>
              )}

              {/* ============== TECHNICAL DATA TAB ============== */}
              {activeTab === "technical" && (
                <div className="flex flex-col flex-1 animate-in fade-in duration-200">
                  <div className="space-y-5">
                    <SectionHeader icon={Cog} label="Motor & Drivetrain" />

                    <div className="grid grid-cols-3 gap-4">
                      <Field label="Rated Power (kW / hp)" id="edit-power" value={ratedPower} onChange={setRatedPower} />
                      <Field label="Torque" id="edit-torque" value={torque} onChange={setTorque} />
                      <Field label="Number of Gears" id="edit-gears" value={gearsCount} onChange={setGearsCount} />
                      <Field label="Cylinders" id="edit-cylinders" value={cylindersCount} onChange={setCylindersCount} />
                      <SelectField label="Cyl. Arrangement" id="edit-cyl-arr" value={cylinderArrangement} onChange={setCylinderArrangement} options={CYLINDER_ARRANGEMENT_OPTIONS} />
                      <Field label="Top Speed" id="edit-topspeed" value={topSpeed} onChange={setTopSpeed} />
                      <Field label="Acceleration" id="edit-accel" value={acceleration} onChange={setAcceleration} />
                      <Field label="Displacement" id="edit-displacement" value={engineDisplacement} onChange={setEngineDisplacement} />
                    </div>

                    <SectionHeader icon={Ruler} label="Measurements & Weights" />

                    <div className="grid grid-cols-3 gap-4">
                      <Field label="Empty Weight" id="edit-empty-weight" value={emptyWeight} onChange={setEmptyWeight} />
                      <Field label="Max Weight" id="edit-max-weight" value={maxWeightAllowed} onChange={setMaxWeightAllowed} />
                      <Field label="Payload" id="edit-payload" value={payloadWeight} onChange={setPayloadWeight} />
                      <Field label="Boot (norm/max)" id="edit-boot" value={bootCapacity} onChange={setBootCapacity} />
                      <Field label="Number of Axles" id="edit-axes" value={axesCount} onChange={setAxesCount} />
                      <Field label="Driven Axles" id="edit-driven-axles" value={drivenAxlesCount} onChange={setDrivenAxlesCount} />
                      <Field label="Wheelbase" id="edit-wheelbase" value={wheelbase} onChange={setWheelbase} />
                      <Field label="Length" id="edit-length" value={length} onChange={setLength} />
                      <Field label="Width" id="edit-width" value={width} onChange={setWidth} />
                      <Field label="Height" id="edit-height" value={height} onChange={setHeight} />
                      <Field label="Tire Size (Axle 1)" id="edit-tire1" value={tireSizeAxle1} onChange={setTireSizeAxle1} />
                      <Field label="Tire Size (Axle 2)" id="edit-tire2" value={tireSizeAxle2} onChange={setTireSizeAxle2} />
                      <Field label="Roof Load" id="edit-roof" value={roofLoad} onChange={setRoofLoad} />
                      <Field label="Braked Trailer" id="edit-braked" value={brakedTrailerLoad} onChange={setBrakedTrailerLoad} />
                      <Field label="Unbraked Trailer" id="edit-unbraked" value={unbrakedTrailerLoad} onChange={setUnbrakedTrailerLoad} />
                    </div>
                  </div>
                  <div className="mt-auto pt-6">
                    <FleetCarousel />
                  </div>
                </div>
              )}

              {/* ============== LEASING & CONTRACT TAB ============== */}
              {activeTab === "leasing" && (
                <div className="flex flex-col flex-1 animate-in fade-in duration-200">
                  <div className="space-y-5">
                    <SectionHeader icon={Landmark} label="Leasing & Finance Contract" />

                    <div className="grid grid-cols-3 gap-4">
                      <Field label="Leasing Partner" id="edit-leasepartner" value={leasingPartner} onChange={setLeasingPartner} />
                      <SelectField label="Leasing Type" id="edit-leasetype" value={leasingType} onChange={setLeasingType} options={LEASING_TYPE_OPTIONS} />
                      <Field label="Contract Number" id="edit-contractnum" value={contractNumber} onChange={setContractNumber} mono />
                      <Field label="Lease Payment (€/month)" id="edit-leasepay" value={leasePayment} onChange={setLeasePayment} />
                      <DateField label="Lease Start" id="edit-leasestart" value={leaseStart} onChange={setLeaseStart} />
                      <DateField label="Lease End" id="edit-leaseend" value={leaseEnd} onChange={setLeaseEnd} />
                    </div>

                    <SectionHeader icon={Building2} label="Assignment (List View)" />

                    <div className="grid grid-cols-3 gap-4">
                      <SelectField label="Transfer / Assignment Type" id="edit-transfer" value={transfer} onChange={setTransfer} options={TRANSFER_OPTIONS} />
                      <Field label="Current / Last Driver" id="edit-curdriver" value={currentDriver} onChange={setCurrentDriver} />
                      <Field label="Driver Cost Center (KSt.)" id="edit-driver-cc" value={driverCostCenter} onChange={setDriverCostCenter} />
                    </div>
                  </div>
                  <div className="mt-auto pt-6">
                    <FleetCarousel />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-background flex items-center justify-end gap-3.5">
          <Button
            variant="outline"
            onClick={onCancel}
            className="h-9 px-4 text-xs font-semibold tracking-wide border-border"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="h-9 px-5 text-xs font-semibold tracking-wide bg-primary text-primary-foreground hover:opacity-95 shadow-sm"
          >
            {isEdit ? "Save Changes" : "Add Vehicle"}
          </Button>
        </div>
      </div>
  );
}


