import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/common/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { getCustomerCopy, addCustomerRecord, type Customer } from "@/components/feature-specific/customers";
import { WizardStepper } from "@/components/feature-specific/customers/WizardStepper";
import { OnboardingTips } from "@/components/feature-specific/customers/OnboardingTips";
import { CustomerDetailsStep } from "@/components/feature-specific/customers/steps/CustomerDetailsStep";
import { UsersAccessStep } from "@/components/feature-specific/customers/steps/UsersAccessStep";
import { ModulesStep } from "@/components/feature-specific/customers/steps/ModulesStep";
import { ReviewStep } from "@/components/feature-specific/customers/steps/ReviewStep";
import { getOnboardingTips } from "@/components/feature-specific/customers/translations";
import { defaultCustomerDetails, defaultInvitedUsers, defaultModules } from "@/components/feature-specific/customers/data";
import type { CustomerDetails, InvitedUser, ModuleItem } from "@/components/feature-specific/customers/types";

export default function CustomerNew() {
  const navigate = useNavigate();
  const { locale } = useLanguage();
  const t = getCustomerCopy(locale);

  const [currentStep, setCurrentStep] = useState(0);
  const [details, setDetails] = useState<CustomerDetails>(defaultCustomerDetails);
  const [invitedUsers, setInvitedUsers] = useState<InvitedUser[]>(defaultInvitedUsers);
  const [modules, setModules] = useState<ModuleItem[]>(defaultModules);

  const updateDetails = (patch: Partial<CustomerDetails>) => setDetails((prev) => ({ ...prev, ...patch }));
  const handleAddUser = (user: InvitedUser) => setInvitedUsers((prev) => [...prev, user]);
  const handleRemoveUser = (index: number) => setInvitedUsers((prev) => prev.filter((_, i) => i !== index));
  const handleToggleModule = (index: number) =>
    setModules((prev) => prev.map((m, i) => (i === index ? { ...m, checked: !m.checked } : m)));

  const handleGoToStep = (stepIdx: number) => {
    if (stepIdx > 0 && !details.customerName.trim()) {
      toast.error(t.invalidName);
      return;
    }
    setCurrentStep(stepIdx);
  };

  const handleContinue = () => {
    if (currentStep === 0 && !details.customerName.trim()) {
      toast.error(t.invalidName);
      return;
    }

    if (currentStep === 3) {
      const generatedClientNum =
        details.clientNumber.trim() ||
        `CLI-0${Math.floor(Math.random() * 900) + 100}-${details.country.slice(0, 2).toUpperCase()}`;
      const customer: Customer = {
        name: details.customerName,
        clientNumber: generatedClientNum,
        country: details.country,
        currency: details.currency,
        tax: details.taxTreatment,
        fleetSize: 0,
        modulesCount: modules.filter((m) => m.checked).length,
        createdDate: new Date().toISOString().split("T")[0],
        status: "Active",
      };
      addCustomerRecord(customer);
      toast.success(t.customerCreated);
      navigate(`/customers/${encodeURIComponent(generatedClientNum)}`);
      return;
    }

    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
    else navigate("/customers");
  };

  const steps = [
    { label: t.customerDetails },
    { label: t.usersAccess },
    { label: t.modules },
    { label: t.review },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      {/* Back button + header */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" asChild className="mt-1">
          <Link to="/customers">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-foreground">{t.addCustomerTitle}</h1>
          <p className="text-sm text-muted-foreground">{t.addCustomerDesc}</p>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <WizardStepper steps={steps} currentStep={currentStep} onStepClick={handleGoToStep} />

        <div className="p-6 space-y-5">
          {currentStep === 0 && (
            <CustomerDetailsStep t={t} locale={locale} details={details} onChange={updateDetails} />
          )}
          {currentStep === 1 && (
            <UsersAccessStep
              t={t}
              locale={locale}
              invitedUsers={invitedUsers}
              onAddUser={handleAddUser}
              onRemoveUser={handleRemoveUser}
            />
          )}
          {currentStep === 2 && <ModulesStep t={t} locale={locale} modules={modules} onToggle={handleToggleModule} />}
          {currentStep === 3 && (
            <ReviewStep t={t} details={details} invitedUsers={invitedUsers} modules={modules} onEditStep={handleGoToStep} />
          )}

          <OnboardingTips tip={getOnboardingTips(locale, currentStep)} />
        </div>

        {/* Footer buttons */}
        <div className="p-6 border-t border-border bg-background flex items-center justify-end gap-3.5">
          <Button variant="outline" onClick={handleBack} className="h-9 px-4 text-xs font-semibold tracking-wide border-border">
            {currentStep === 0 ? (
              t.cancel
            ) : (
              <>
                <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                {t.back}
              </>
            )}
          </Button>
          <Button
            onClick={handleContinue}
            className="h-9 px-5 text-xs font-semibold tracking-wide bg-primary text-primary-foreground hover:opacity-95 shadow-sm"
          >
            {currentStep === 3 ? (
              <>
                {t.finishSetup}
                <Check className="h-3.5 w-3.5 ml-1.5" />
              </>
            ) : (
              <>
                {t.continue}
                <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
