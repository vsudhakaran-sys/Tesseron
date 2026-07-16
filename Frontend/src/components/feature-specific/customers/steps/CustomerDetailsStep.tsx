import { Building2, Landmark } from "lucide-react";
import { Input } from "@/components/common/ui/input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/common/ui/select";
import { SectionHeader } from "../SectionHeader";
import { SubtleSelectItem } from "../SubtleSelectItem";
import type { CustomerDetails } from "../types";
import type { CustomerCopy, Locale } from "../translations";

interface CustomerDetailsStepProps {
  t: CustomerCopy;
  locale: Locale;
  details: CustomerDetails;
  onChange: (patch: Partial<CustomerDetails>) => void;
}

// Step 1: Customer Details
export function CustomerDetailsStep({ t, locale, details, onChange }: CustomerDetailsStepProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* ── Section: Company Information ── */}
      <div className="space-y-4">
        <SectionHeader icon={Building2} label={locale === "nl" ? "Bedrijfsinformatie" : "Customer Information"} />
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground opacity-85" htmlFor="cust-name">
            {t.customerName}
          </label>
          <Input
            id="cust-name"
            placeholder="e.g. Nexus Logistics"
            value={details.customerName}
            onChange={(e) => onChange({ customerName: e.target.value })}
            className="h-9 text-xs"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground opacity-85" htmlFor="client-num">
              {t.clientNumber}
            </label>
            <Input
              id="client-num"
              placeholder="CLI-0822-XP"
              value={details.clientNumber}
              onChange={(e) => onChange({ clientNumber: e.target.value })}
              className="h-9 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground opacity-85" htmlFor="country">
              {t.tableHeaderCountry}
            </label>
            <Select value={details.country} onValueChange={(country) => onChange({ country })}>
              <SelectTrigger id="country" className="h-9 text-xs bg-white dark:bg-slate-900 rounded-lg">
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent className="z-[110] rounded-xl border border-border shadow-lg">
                <SubtleSelectItem value="Netherlands">Netherlands</SubtleSelectItem>
                <SubtleSelectItem value="United States">United States</SubtleSelectItem>
                <SubtleSelectItem value="Germany">Germany</SubtleSelectItem>
                <SubtleSelectItem value="United Kingdom">United Kingdom</SubtleSelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* ── Section: Financial Settings ── */}
      <div className="space-y-4">
        <SectionHeader icon={Landmark} label={locale === "nl" ? "Financiële instellingen" : "Financial Settings"} />
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground opacity-85" htmlFor="currency">
              {t.tableHeaderCurrency}
            </label>
            <Select value={details.currency} onValueChange={(currency) => onChange({ currency })}>
              <SelectTrigger id="currency" className="h-9 text-xs bg-white dark:bg-slate-900 rounded-lg">
                <SelectValue placeholder="Select Currency" />
              </SelectTrigger>
              <SelectContent className="z-[110] rounded-xl border border-border shadow-lg">
                <SubtleSelectItem value="EUR">EUR (€)</SubtleSelectItem>
                <SubtleSelectItem value="USD">USD ($)</SubtleSelectItem>
                <SubtleSelectItem value="GBP">GBP (£)</SubtleSelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground opacity-85" htmlFor="tax-treatment">
              {t.taxTreatment}
            </label>
            <Select value={details.taxTreatment} onValueChange={(taxTreatment) => onChange({ taxTreatment })}>
              <SelectTrigger id="tax-treatment" className="h-9 text-xs bg-white dark:bg-slate-900 rounded-lg">
                <SelectValue placeholder="Select Tax Treatment" />
              </SelectTrigger>
              <SelectContent className="z-[110] rounded-xl border border-border shadow-lg">
                <SubtleSelectItem value="Standard">{t.standard}</SubtleSelectItem>
                <SubtleSelectItem value="Exempt">{t.exempt}</SubtleSelectItem>
                <SubtleSelectItem value="Reverse charge">{t.reverseCharge}</SubtleSelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
