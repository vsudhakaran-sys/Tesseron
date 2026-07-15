import { useEffect, useState } from "react";
import { User, Shield, Key, BadgeCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/common/ui/button";
import { Textarea } from "@/components/common/ui/textarea";
import { Checkbox } from "@/components/common/ui/checkbox";
import { Field, DateField, SelectField } from "./FormFields";
import { SectionHeader } from "../customers/SectionHeader";
import { OnboardingTips } from "../customers/OnboardingTips";
import { FleetCarousel } from "./FleetCarousel";

interface DriverFormProps {
  driver: any | null; // null means "Create Mode"
  onSaved: (driver: any) => void;
  onCancel: () => void;
}

// Dropdown option sets for enumerable driver attributes.
const SALUTATION_OPTIONS = [
  { value: "Mr.", label: "Mr." },
  { value: "Mrs.", label: "Mrs." },
  { value: "Ms.", label: "Ms." },
  { value: "Dr.", label: "Dr." },
];

const STATUS_OPTIONS = [
  { value: "available", label: "Available" },
  { value: "assigned", label: "Assigned" },
  { value: "inactive", label: "Inactive" },
];

const LANGUAGE_OPTIONS = [
  { value: "NL", label: "Dutch (NL)" },
  { value: "EN", label: "English (EN)" },
  { value: "DE", label: "German (DE)" },
];

const TRAINING_OPTIONS = [
  { value: "Completed", label: "Completed" },
  { value: "Pending", label: "Pending" },
  { value: "Overdue", label: "Overdue" },
  { value: "Not Required", label: "Not Required" },
];

const FS_CHECK_OPTIONS = [
  { value: "Valid", label: "Valid" },
  { value: "Due Soon", label: "Due Soon" },
  { value: "Expired", label: "Expired" },
];

const TRANSFER_TYPE_OPTIONS = [
  { value: "Company Car", label: "Company Car" },
  { value: "Permanent Assignment", label: "Permanent Assignment" },
  { value: "Pool Vehicle", label: "Pool Vehicle" },
  { value: "Service Vehicle", label: "Service Vehicle" },
  { value: "Replacement Vehicle", label: "Replacement Vehicle" },
];

type DriverTab = "personal" | "org" | "handover";

export function DriverForm({ driver, onSaved, onCancel }: DriverFormProps) {
  const isEdit = !!driver;

  // Tabs inside edit mode
  const [activeTab, setActiveTab] = useState<DriverTab>("personal");

  // Common/Minimal Fields (Form States)
  const [salutation, setSalutation] = useState("Mr.");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"assigned" | "available" | "inactive">("available");

  // Tab 1: Identity & Personal (Form States)
  const [abbreviation, setAbbreviation] = useState("");
  const [remarks, setRemarks] = useState("");
  const [address, setAddress] = useState("");
  const [currentEfkm, setCurrentEfkm] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [additionalEmail, setAdditionalEmail] = useState("");
  const [emailToSupervisor, setEmailToSupervisor] = useState(false);
  const [phone, setPhone] = useState("");
  const [privatePhone, setPrivatePhone] = useState("");
  const [academicDegree, setAcademicDegree] = useState("");
  const [language, setLanguage] = useState("EN");

  // Licensing & Compliance (now part of the Personal tab)
  const [licenseClass, setLicenseClass] = useState("");
  const [licenseExpiry, setLicenseExpiry] = useState("");
  const [driverTraining, setDriverTraining] = useState("Completed");
  const [fsCheck, setFsCheck] = useState("Valid");

  // Tab 2: Organisation & Access (Form States)
  const [personnelNumber, setPersonnelNumber] = useState("");
  const [costCenter, setCostCenter] = useState("");
  const [sapNumber, setSapNumber] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [pursue, setPursue] = useState("");
  const [companyLocation, setCompanyLocation] = useState("");
  const [entryDate, setEntryDate] = useState("");
  const [exitDate, setExitDate] = useState("");
  const [reEmploymentDate, setReEmploymentDate] = useState("");
  const [timeoutFrom, setTimeoutFrom] = useState("");
  const [timeoutUntil, setTimeoutUntil] = useState("");
  const [timeoutReason, setTimeoutReason] = useState("");
  const [vehicleFleet, setVehicleFleet] = useState("");
  const [driverRegulation, setDriverRegulation] = useState("");
  const [selfServiceAccess, setSelfServiceAccess] = useState(true);
  const [accessSent, setAccessSent] = useState(false);
  const [accessBlocked, setAccessBlocked] = useState(false);

  // Tab 3: Vehicle Handover (Form States)
  const [handoverVehiclePlate, setHandoverVehiclePlate] = useState("");
  const [transferType, setTransferType] = useState("");
  const [kmAcceptance, setKmAcceptance] = useState("");
  const [kmPerYear, setKmPerYear] = useState("");
  const [salaryDeduction, setSalaryDeduction] = useState("");
  const [handoverDate, setHandoverDate] = useState("");
  const [assumptionDate, setAssumptionDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  // Populate/Reset states on open/change
  useEffect(() => {
    {
      setActiveTab("personal");
      if (driver) {
        // Splitting full name if possible
        const names = driver.name.split(" ");
        setFirstName(names[0] || "");
        setLastName(names.slice(1).join(" ") || "");

        setSalutation(driver.salutation || "Mr.");
        setEmail(driver.email || "");
        setStatus(driver.status || "available");
        setAbbreviation(driver.abbreviation || (names[0] ? names[0].slice(0, 3).toUpperCase() : ""));
        setRemarks(driver.remarks || "");
        setAddress(driver.address || "Main Street 123, Amsterdam");
        setCurrentEfkm(driver.currentEfkm || "15000");
        setBirthDate(driver.birthDate || "1988-05-15");
        setAdditionalEmail(driver.additionalEmail || "");
        setEmailToSupervisor(driver.emailToSupervisor || false);
        setPhone(driver.phone || "");
        setPrivatePhone(driver.privatePhone || "");
        setAcademicDegree(driver.academicDegree || "");
        setLanguage(driver.language || "NL");

        setLicenseClass(driver.license || "B");
        setLicenseExpiry(driver.licenseExpiry || "Dec 15, 2027");
        setDriverTraining(driver.driverTraining || "Completed");
        setFsCheck(driver.fsCheck || "Valid");

        setPersonnelNumber(driver.personnelNumber || `EMP-${driver.id}`);
        setCostCenter(driver.costCenter || driver.department || "Sales");
        setSapNumber(driver.sapNumber || "");
        setJobTitle(driver.jobTitle || "Account Manager");
        setPursue(driver.pursue || "Internal");
        setCompanyLocation(driver.companyLocation || "Amsterdam HQ");
        setEntryDate(driver.entryDate || "2023-08-01");
        setExitDate(driver.exitDate || "");
        setReEmploymentDate(driver.reEmploymentDate || "");
        setTimeoutFrom(driver.timeoutFrom || "");
        setTimeoutUntil(driver.timeoutUntil || "");
        setTimeoutReason(driver.timeoutReason || "");
        setVehicleFleet(driver.vehicleFleet || "Standard Fleet");
        setDriverRegulation(driver.driverRegulation || "Core Policy v2");
        setSelfServiceAccess(driver.selfServiceAccess !== false);
        setAccessSent(driver.accessSent || false);
        setAccessBlocked(driver.accessBlocked || false);

        setHandoverVehiclePlate(driver.assignedVehicle || "");
        setTransferType(driver.transferType || "Company Car");
        setKmAcceptance(driver.kmAcceptance || "1200");
        setKmPerYear(driver.kmPerYear || "25000");
        setSalaryDeduction(driver.salaryDeduction || "150");
        setHandoverDate(driver.handoverDate || "2023-08-02");
        setAssumptionDate(driver.assumptionDate || "2023-08-02");
        setReturnDate(driver.returnDate || "");
      } else {
        setFirstName("");
        setLastName("");
        setSalutation("Mr.");
        setEmail("");
        setStatus("available");
        setAbbreviation("");
        setRemarks("");
        setAddress("");
        setCurrentEfkm("");
        setBirthDate("");
        setAdditionalEmail("");
        setEmailToSupervisor(false);
        setPhone("");
        setPrivatePhone("");
        setAcademicDegree("");
        setLanguage("NL");
        setLicenseClass("");
        setLicenseExpiry("");
        setDriverTraining("Completed");
        setFsCheck("Valid");
        setPersonnelNumber("");
        setCostCenter("");
        setSapNumber("");
        setJobTitle("");
        setPursue("");
        setCompanyLocation("");
        setEntryDate("");
        setExitDate("");
        setReEmploymentDate("");
        setTimeoutFrom("");
        setTimeoutUntil("");
        setTimeoutReason("");
        setVehicleFleet("");
        setDriverRegulation("");
        setSelfServiceAccess(true);
        setAccessSent(false);
        setAccessBlocked(false);
        setHandoverVehiclePlate("");
        setTransferType("");
        setKmAcceptance("");
        setKmPerYear("");
        setSalaryDeduction("");
        setHandoverDate("");
        setAssumptionDate("");
        setReturnDate("");
      }
    }
  }, [driver]);

  const handleSave = () => {
    if (!firstName.trim()) {
      toast.error("Please enter a First Name");
      return;
    }
    if (!lastName.trim()) {
      toast.error("Please enter a Last Name");
      return;
    }
    if (!email.trim()) {
      toast.error("Please enter an Email Address");
      return;
    }

    const payload = {
      ...(driver || {}),
      name: `${firstName} ${lastName}`.trim(),
      salutation,
      email,
      phone,
      privatePhone,
      status,
      abbreviation,
      remarks,
      address,
      currentEfkm,
      birthDate,
      additionalEmail,
      emailToSupervisor,
      academicDegree,
      language,
      // Licensing & compliance
      license: licenseClass || "B",
      licenseExpiry: licenseExpiry || "Dec 15, 2027",
      driverTraining,
      fsCheck,
      // Org fields
      personnelNumber,
      costCenter,
      department: costCenter || "Sales",
      sapNumber,
      jobTitle,
      pursue,
      companyLocation,
      entryDate,
      exitDate,
      reEmploymentDate,
      timeoutFrom,
      timeoutUntil,
      timeoutReason,
      vehicleFleet,
      driverRegulation,
      selfServiceAccess,
      accessSent,
      accessBlocked,
      // Handover fields
      assignedVehicle: handoverVehiclePlate || null,
      transferType,
      kmAcceptance,
      kmPerYear,
      salaryDeduction,
      handoverDate,
      assumptionDate,
      returnDate,
    };

    onSaved(payload);
    toast.success(isEdit ? "Driver updated successfully!" : "Driver created successfully!");
  };

  const tabs: { key: DriverTab; label: string; icon: typeof User }[] = [
    { key: "personal", label: "Personal", icon: User },
    { key: "org", label: "Organisation", icon: Shield },
    { key: "handover", label: "Handover", icon: Key },
  ];

  return (
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        {/* Tabs for Edit mode */}
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

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {!isEdit ? (
            <div className="flex flex-col min-h-full">
              <div className="space-y-4">
                <SectionHeader icon={User} label="Core Details" />

                <div className="grid grid-cols-3 gap-4">
                  <SelectField label="Salutation" id="salute" value={salutation} onChange={setSalutation} options={SALUTATION_OPTIONS} />
                  <Field label="First Name" id="fname" value={firstName} onChange={setFirstName} placeholder="e.g. John" required />
                  <Field label="Last Name" id="lname" value={lastName} onChange={setLastName} placeholder="e.g. Doe" required />
                </div>

                <Field label="Email Address" id="email" value={email} onChange={setEmail} placeholder="e.g. john.doe@company.com" type="email" required />

                <SelectField label="Driver Status" id="status" value={status} onChange={(v) => setStatus(v as any)} options={STATUS_OPTIONS} />
              </div>

              <div className="space-y-4 mt-2">
                <OnboardingTips
                  tip={{
                    title: "Quick Registration Guidelines",
                    tips: [
                      "Required fields: Salutation, First Name, Last Name, and Email are required to initialize the driver record.",
                      "Detailed options: Organisational mappings, personal contacts, licensing, absence logs, and vehicle handover profiles can be configured under Edit afterwards.",
                      "Self-service portal: Creating a record with a valid email allows dispatching portal credentials later."
                    ]
                  }}
                />
                <FleetCarousel />
              </div>
            </div>
          ) : (
            <div className="flex flex-col min-h-full">
              {/* ============== PERSONAL TAB (incl. Licensing) ============== */}
              {activeTab === "personal" && (
                <div className="flex flex-col flex-1 animate-in fade-in duration-200">
                  <div className="space-y-5">
                    <SectionHeader icon={User} label="Identity & Personal Details" />

                    <div className="grid grid-cols-3 gap-4">
                      <SelectField label="Salutation" id="d-salutation" value={salutation} onChange={setSalutation} options={SALUTATION_OPTIONS} />
                      <Field label="First Name" id="d-first" value={firstName} onChange={setFirstName} required />
                      <Field label="Last Name" id="d-last" value={lastName} onChange={setLastName} required />

                      <Field label="Abbreviation / Short Code" id="d-abbr" value={abbreviation} onChange={setAbbreviation} className="uppercase" maxLength={4} />
                      <DateField label="Birth Date" id="d-birth" value={birthDate} onChange={setBirthDate} />
                      <SelectField label="Preferred Language" id="d-lang" value={language} onChange={setLanguage} options={LANGUAGE_OPTIONS} />

                      <Field label="Primary Email" id="d-email" value={email} onChange={setEmail} type="email" required />
                      <Field label="Secondary Email" id="d-email2" value={additionalEmail} onChange={setAdditionalEmail} type="email" />
                      <Field label="Academic Degree / Title" id="d-degree" value={academicDegree} onChange={setAcademicDegree} placeholder="e.g. MBA" />

                      <Field label="Mobile Phone" id="d-mobile" value={phone} onChange={setPhone} />
                      <Field label="Telephone (Private)" id="d-phone" value={privatePhone} onChange={setPrivatePhone} />
                      <Field label="Effective Mileage (EFKM)" id="d-efkm" value={currentEfkm} onChange={setCurrentEfkm} />

                      <div className="col-span-3">
                        <Field label="Home Address (Street / Postal / City)" id="d-address" value={address} onChange={setAddress} />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground opacity-85" htmlFor="d-remarks">
                        Remarks
                      </label>
                      <Textarea
                        id="d-remarks"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        rows={3}
                        placeholder="Add any additional notes about this driver…"
                        className="min-h-[72px] text-xs resize-none"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="supervisor-copy"
                        checked={emailToSupervisor}
                        onCheckedChange={(checked: boolean) => setEmailToSupervisor(checked)}
                      />
                      <label htmlFor="supervisor-copy" className="text-xs font-medium text-foreground cursor-pointer">
                        Send copy of notifications to supervisor
                      </label>
                    </div>

                    <SectionHeader icon={BadgeCheck} label="Licensing & Compliance" />

                    <div className="grid grid-cols-3 gap-4">
                      <Field label="Driver Class (License)" id="d-class" value={licenseClass} onChange={setLicenseClass} placeholder="e.g. B, BE" />
                      <Field label="License Expiry" id="d-expiry" value={licenseExpiry} onChange={setLicenseExpiry} placeholder="e.g. Dec 15, 2027" />
                      <SelectField label="Driver Training (OWL-01)" id="d-training" value={driverTraining} onChange={setDriverTraining} options={TRAINING_OPTIONS} />
                      <SelectField label="FS Check / License Check (OWL-03)" id="d-fscheck" value={fsCheck} onChange={setFsCheck} options={FS_CHECK_OPTIONS} />
                    </div>
                  </div>
                  <div className="mt-auto pt-6">
                    <FleetCarousel />
                  </div>
                </div>
              )}

              {/* ============== ORGANISATION & ACCESS TAB ============== */}
              {activeTab === "org" && (
                <div className="flex flex-col flex-1 animate-in fade-in duration-200">
                  <div className="space-y-5">
                    <SectionHeader icon={Shield} label="Organisational & Access Data" />

                    <div className="grid grid-cols-3 gap-4">
                      <Field label="Personnel Number (HR)" id="d-personnel" value={personnelNumber} onChange={setPersonnelNumber} mono />
                      <SelectField label="Driver Status" id="d-status" value={status} onChange={(v) => setStatus(v as any)} options={STATUS_OPTIONS} />
                      <Field label="Cost Center" id="d-cc" value={costCenter} onChange={setCostCenter} />

                      <Field label="SAP Number" id="d-sap" value={sapNumber} onChange={setSapNumber} mono />
                      <Field label="Job Title" id="d-job" value={jobTitle} onChange={setJobTitle} />
                      <Field label="Pursue" id="d-pursue" value={pursue} onChange={setPursue} placeholder="Responsible unit" />

                      <Field label="Company Location" id="d-location" value={companyLocation} onChange={setCompanyLocation} />
                      <Field label="Vehicle Fleet" id="d-fleet" value={vehicleFleet} onChange={setVehicleFleet} />
                      <Field label="Driver Policy Regulation" id="d-regulation" value={driverRegulation} onChange={setDriverRegulation} />

                      <DateField label="Entry Date" id="d-entry" value={entryDate} onChange={setEntryDate} />
                      <DateField label="Exit Date" id="d-exit" value={exitDate} onChange={setExitDate} />
                      <DateField label="Re-employment" id="d-reemploy" value={reEmploymentDate} onChange={setReEmploymentDate} />

                      <DateField label="Absence: From" id="d-absence-from" value={timeoutFrom} onChange={setTimeoutFrom} />
                      <DateField label="Absence: Until" id="d-absence-until" value={timeoutUntil} onChange={setTimeoutUntil} />
                      <Field label="Reason for Absence" id="d-absence-reason" value={timeoutReason} onChange={setTimeoutReason} placeholder="e.g. Parental leave" />
                    </div>

                    <div className="space-y-2 pt-2 border-t border-border">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="self-service-opt"
                          checked={selfServiceAccess}
                          onCheckedChange={(checked: boolean) => setSelfServiceAccess(checked)}
                        />
                        <label htmlFor="self-service-opt" className="text-xs font-medium text-foreground cursor-pointer">
                          Allow driver self-service portal access
                        </label>
                      </div>

                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="access-sent-opt"
                          checked={accessSent}
                          onCheckedChange={(checked: boolean) => setAccessSent(checked)}
                        />
                        <label htmlFor="access-sent-opt" className="text-xs font-medium text-foreground cursor-pointer">
                          Access invitation has been sent
                        </label>
                      </div>

                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="access-blocked-opt"
                          checked={accessBlocked}
                          onCheckedChange={(checked: boolean) => setAccessBlocked(checked)}
                        />
                        <label htmlFor="access-blocked-opt" className="text-xs font-medium text-destructive cursor-pointer">
                          Block driver self-service access
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="mt-auto pt-6">
                    <FleetCarousel />
                  </div>
                </div>
              )}

              {/* ============== VEHICLE HANDOVER TAB ============== */}
              {activeTab === "handover" && (
                <div className="flex flex-col flex-1 animate-in fade-in duration-200">
                  <div className="space-y-5">
                    <SectionHeader icon={Key} label="Vehicle Handover & Finance" />

                    <div className="grid grid-cols-3 gap-4">
                      <Field label="Handed-over Vehicle (Mark)" id="d-handover-plate" value={handoverVehiclePlate} onChange={setHandoverVehiclePlate} placeholder="e.g. 34-CD-AB" mono />
                      <SelectField label="Transfer Type" id="d-transfer" value={transferType} onChange={setTransferType} options={TRANSFER_TYPE_OPTIONS} />
                      <Field label="KM at Acceptance / Drop-off" id="d-km-accept" value={kmAcceptance} onChange={setKmAcceptance} />

                      <Field label="Contracted KM / Year" id="d-km-year" value={kmPerYear} onChange={setKmPerYear} />
                      <Field label="Monthly Gross Salary Deduction (€)" id="d-salary" value={salaryDeduction} onChange={setSalaryDeduction} />
                      <DateField label="Contract Handover" id="d-handover-date" value={handoverDate} onChange={setHandoverDate} />

                      <DateField label="Assumption" id="d-assumption" value={assumptionDate} onChange={setAssumptionDate} />
                      <DateField label="Return" id="d-return" value={returnDate} onChange={setReturnDate} />
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
            {isEdit ? "Save Changes" : "Add Driver"}
          </Button>
        </div>
      </div>
  );
}
