import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Building2, Check, Network, Save, ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/common/ui/button";
import { Input } from "@/components/common/ui/input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/common/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/common/ui/dialog";
import { useLanguage } from "@/hooks/useLanguage";
import { isTESSERONAdmin } from "@/utils/persona";
import {
  getCustomerCopy,
  getCustomerByClient,
  getCustomerOrg,
  updateCustomerRecord,
  deleteCustomerRecord,
  defaultModules,
  SubtleSelectItem,
  CustomerOrgStats,
  CustomerSubBranchesCard,
  CustomerUsersTable,
  type ModuleItem,
} from "@/components/feature-specific/customers";

// Prominent heading that marks each top-level domain of the page (replaces tabs).
function SectionHeading({
  icon: Icon,
  title,
  desc,
  badge,
}: {
  icon: any;
  title: string;
  desc?: string;
  badge?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary border border-primary/15 shrink-0">
        <Icon className="h-[18px] w-[18px]" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-base font-bold font-display text-foreground leading-tight">{title}</h2>
          {badge && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-primary/5 text-primary border border-primary/15 tracking-wide">
              <ShieldCheck className="h-3 w-3" />
              {badge}
            </span>
          )}
        </div>
        {desc && <p className="text-[11px] text-muted-foreground">{desc}</p>}
      </div>
    </div>
  );
}

export default function CustomerDetail() {
  const { clientNumber } = useParams();
  const clientId = clientNumber ?? "";
  const navigate = useNavigate();
  const { locale } = useLanguage();
  const t = getCustomerCopy(locale);

  const customer = getCustomerByClient(clientId);
  const org = getCustomerOrg(clientId);
  const showOrg = isTESSERONAdmin() && (org.branches.length > 0 || org.users.length > 0);

  const [name, setName] = useState("");
  const [country, setCountry] = useState("Netherlands");
  const [currency, setCurrency] = useState("EUR");
  const [tax, setTax] = useState("Standard");
  const [status, setStatus] = useState("Active");
  const [modules, setModules] = useState<ModuleItem[]>(defaultModules);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Seed the form whenever the routed customer changes.
  useEffect(() => {
    const c = getCustomerByClient(clientId);
    if (!c) return;
    setName(c.name);
    setCountry(c.country);
    setCurrency(c.currency);
    setTax(c.tax);
    setStatus(c.status);
    setModules(defaultModules.map((m, idx) => ({ ...m, checked: idx < c.modulesCount })));
  }, [clientId]);

  const handleToggleModule = (index: number) =>
    setModules((prev) => prev.map((m, i) => (i === index ? { ...m, checked: !m.checked } : m)));

  const handleSave = () => {
    if (!name.trim()) {
      toast.error(t.invalidName);
      return;
    }
    if (!customer) return;
    updateCustomerRecord({
      ...customer,
      name,
      country,
      currency,
      tax,
      status,
      modulesCount: modules.filter((m) => m.checked).length,
    });
    toast.success(t.customerUpdated);
  };

  const handleDelete = () => {
    if (!customer) return;
    deleteCustomerRecord(customer.clientNumber);
    setConfirmDelete(false);
    toast.success(t.customerDeleted);
    navigate("/customers");
  };

  // ── Not found ──────────────────────────────────────────────────────────────
  if (!customer) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" asChild className="h-9 w-9 rounded-full mt-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200">
            <Link to="/customers">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold font-display text-foreground">{clientId}</h1>
        </div>
        <div className="bg-card rounded-2xl border border-border border-dashed p-12 text-center shadow-inner">
          <p className="text-sm font-semibold text-foreground">Customer not found</p>
          <p className="text-sm text-muted-foreground mt-1">
            No customer matches <span className="font-mono">{clientId}</span>.
          </p>
          <Button variant="outline" className="mt-4 rounded-xl" onClick={() => navigate("/customers")}>
            {t.cancel}
          </Button>
        </div>
      </div>
    );
  }

  // ── Details form (Profile card only) ────────────────────
  const profileCard = (
    <div className="aria-card rounded-2xl overflow-hidden flex flex-col h-full">
      {/* Consistent header styling matching screenshot */}
      <div className="px-5 py-4 border-b border-border/40 bg-slate-50/50 dark:bg-slate-900/30 shrink-0">
        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground font-display">
          {locale === "nl" ? "Bedrijfsinformatie & Instellingen" : "Customer Profile & Settings"}
        </h3>
      </div>
      
      <div className="p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="sm:col-span-3 space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground" htmlFor="cust-name">
              {t.customerName}
            </label>
            <Input id="cust-name" value={name} onChange={(e) => setName(e.target.value)} className="aria-input h-10 text-xs rounded-xl border-border/80 shadow-sm" />
          </div>

          <div className="sm:col-span-1 space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground" htmlFor="cust-client">
              {t.clientNumber}
            </label>
            <Input id="cust-client" value={customer.clientNumber} disabled className="h-10 text-xs font-mono opacity-60 bg-slate-50 dark:bg-slate-900/50 rounded-xl" />
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground" htmlFor="cust-country">
              {t.tableHeaderCountry}
            </label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger id="cust-country" className="aria-input h-10 text-xs bg-white/70 dark:bg-slate-900/70 rounded-xl border border-border/80 shadow-sm">
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent className="z-[110] rounded-xl border border-border shadow-lg bg-white/95 dark:bg-slate-950/95 backdrop-blur-md">
                <SubtleSelectItem value="Netherlands">Netherlands</SubtleSelectItem>
                <SubtleSelectItem value="United States">United States</SubtleSelectItem>
                <SubtleSelectItem value="Germany">Germany</SubtleSelectItem>
                <SubtleSelectItem value="United Kingdom">United Kingdom</SubtleSelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground" htmlFor="cust-currency">
              {t.tableHeaderCurrency}
            </label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger id="cust-currency" className="aria-input h-10 text-xs bg-white/70 dark:bg-slate-900/70 rounded-xl border border-border/80 shadow-sm">
                <SelectValue placeholder="Select Currency" />
              </SelectTrigger>
              <SelectContent className="z-[110] rounded-xl border border-border shadow-lg bg-white/95 dark:bg-slate-950/95 backdrop-blur-md">
                <SubtleSelectItem value="EUR">EUR (€)</SubtleSelectItem>
                <SubtleSelectItem value="USD">USD ($)</SubtleSelectItem>
                <SubtleSelectItem value="GBP">GBP (£)</SubtleSelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground" htmlFor="cust-tax">
              {t.taxTreatment}
            </label>
            <Select value={tax} onValueChange={setTax}>
              <SelectTrigger id="cust-tax" className="aria-input h-10 text-xs bg-white/70 dark:bg-slate-900/70 rounded-xl border border-border/80 shadow-sm">
                <SelectValue placeholder="Select Tax Treatment" />
              </SelectTrigger>
              <SelectContent className="z-[110] rounded-xl border border-border shadow-lg bg-white/95 dark:bg-slate-950/95 backdrop-blur-md">
                <SubtleSelectItem value="Standard">{t.standard}</SubtleSelectItem>
                <SubtleSelectItem value="Exempt">{t.exempt}</SubtleSelectItem>
                <SubtleSelectItem value="Reverse charge">{t.reverseCharge}</SubtleSelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground" htmlFor="cust-status">
              {t.tableHeaderStatus}
            </label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="cust-status" className="aria-input h-10 text-xs bg-white/70 dark:bg-slate-900/70 rounded-xl border border-border/80 shadow-sm">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent className="z-[110] rounded-xl border border-border shadow-lg bg-white/95 dark:bg-slate-950/95 backdrop-blur-md">
                <SubtleSelectItem value="Active">{t.statusActive}</SubtleSelectItem>
                <SubtleSelectItem value="Inactive">{t.statusInactive}</SubtleSelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );

  // ── Modules form ────────────────────
  const modulesCard = (
    <div className="aria-card rounded-2xl overflow-hidden flex flex-col h-full">
      {/* Consistent header styling matching screenshot */}
      <div className="px-5 py-4 border-b border-border/40 bg-slate-50/50 dark:bg-slate-900/30 shrink-0">
        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground font-display">
          {t.modules}
        </h3>
      </div>

      <div className="p-6 space-y-4">
        <p className="text-xs text-muted-foreground">{t.modulesDesc}</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {modules.map((m, idx) => (
            <div
              key={idx}
              onClick={() => handleToggleModule(idx)}
              className={`flex items-center justify-between p-3 h-[60px] rounded-xl border cursor-pointer transition-all duration-300 hover:-translate-y-0.5 ${
                m.checked
                  ? "border-primary/50 bg-primary/[0.03] dark:bg-primary/[0.05] aria-glow-blue shadow-sm"
                  : "border-border/60 hover:border-slate-300 dark:hover:border-slate-700 bg-white/40 dark:bg-slate-900/40"
              }`}
            >
              <div className="space-y-0.5 pr-2">
                <div className="text-xs font-bold text-foreground">{m.name}</div>
                <div className="text-[10px] font-medium text-muted-foreground leading-normal">{m.desc}</div>
              </div>
              <div
                className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-all duration-300 ${
                  m.checked ? "bg-primary border-primary text-primary-foreground scale-100 shadow-md shadow-primary/20" : "border-muted-foreground/30 scale-95"
                }`}
              >
                {m.checked && <Check className="h-3 w-3 stroke-[3]" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const isActive = status === "Active";

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Back button + header */}
      <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap bg-white/40 dark:bg-slate-950/20 backdrop-blur-md p-4 rounded-2xl border border-border/20 shadow-sm">
        <Button variant="ghost" size="icon" asChild className="h-9 w-9 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-all duration-200 active:scale-90">
          <Link to="/customers">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-0.5 flex-wrap">
            <h1 className="text-2xl font-bold font-display text-foreground leading-tight">{name || customer.name}</h1>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[9px] font-bold tracking-wide border transition-all duration-300 ${
                isActive
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 aria-glow-emerald"
                  : "bg-rose-500/10 text-rose-600 border-rose-500/20 aria-glow-rose"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-rose-500"}`} />
              {isActive ? t.statusActive : t.statusInactive}
            </span>
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-2">
            <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">{customer.clientNumber}</span>
            <span>•</span>
            <span>{customer.country}</span>
            <span>•</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {customer.fleetSize}{" "}
              {customer.fleetSize === 1 ? (locale === "nl" ? "voertuig" : "vehicle") : locale === "nl" ? "voertuigen" : "vehicles"}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end mt-3 sm:mt-0">
          <Button
            variant="outline"
            onClick={() => setConfirmDelete(true)}
            className="aria-btn-secondary h-9 px-4 text-xs font-bold tracking-wide border-border/80 text-destructive hover:text-destructive hover:bg-destructive/5 rounded-xl"
          >
            <Trash2 className="h-4 w-4 mr-1.5" />
            {t.deleteAction}
          </Button>
          <Button onClick={handleSave} className="aria-btn-primary h-9 px-5 text-xs font-bold tracking-wide bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl shadow-md">
            <Save className="h-4 w-4 mr-1.5" />
            {t.saveChanges}
          </Button>
        </div>
      </div>

      {/* ════════ SECTION 1 · CUSTOMER DETAILS ════════ */}
      <section className="space-y-4">
        <SectionHeading
          icon={Building2}
          title={locale === "nl" ? "Klantgegevens" : "Customer Details"}
          desc={locale === "nl" ? "Profiel, financiële instellingen en geactiveerde modules" : "Profile, financial settings & enabled modules"}
        />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-6 h-full">{profileCard}</div>
          <div className="lg:col-span-6 h-full">{modulesCard}</div>
        </div>
      </section>

      {showOrg && (
        <>
          {/* Divider separating the two domains */}
          <div className="border-t border-dashed border-border/50" />

          {/* ════════ SECTION 2 · ORGANISATION DETAILS ════════ */}
          <section className="space-y-4">
            <SectionHeading
              icon={Network}
              title={locale === "nl" ? "Organisatiegegevens" : "Organisation Details"}
              desc={locale === "nl" ? "Sub-vestigingen, gebruikers, rollen en status" : "Sub-branches, users, roles & status"}
              badge={t.TESSERONAdminOnly}
            />
            <CustomerOrgStats org={org} t={t} />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-8">
                <CustomerUsersTable org={org} t={t} />
              </div>
              <div className="lg:col-span-4">
                <CustomerSubBranchesCard org={org} t={t} />
              </div>
            </div>
          </section>
        </>
      )}

      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent className="max-w-md rounded-2xl bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border border-border shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-lg">{t.deleteTitle}</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-normal mt-1">{t.deleteDesc}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button variant="outline" onClick={() => setConfirmDelete(false)} className="rounded-xl h-9 text-xs">
              {t.cancel}
            </Button>
            <Button onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/95 rounded-xl h-9 text-xs font-bold">
              <Trash2 className="h-4 w-4 mr-1.5" />
              {t.deleteAction}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


