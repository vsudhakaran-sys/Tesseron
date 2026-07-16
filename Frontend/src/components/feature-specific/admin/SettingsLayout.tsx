import { useSearchParams } from "react-router-dom";
import {
  ClipboardList,
  Coins,
  FileText,
  Folder,
  Fuel,
  KeyRound,
  LayoutGrid,
  Mail,
  Plug,
  ScrollText,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  TrendingDown,
  UserCircle,
  Users,
} from "lucide-react";
import { cn } from "@/utils/utils";
import type { AdminCopy } from "./translations";
import { PlaceholderPanel } from "./shared";
import { UsersPanel } from "./UsersPanel";
import { RolesPanel } from "./RolesPanel";
import { OrganizationsPanel } from "./OrganizationsPanel";
import { AuditPanel } from "./AuditPanel";
import { AccountPanel, GeneralPanel } from "./AccountPanels";

type SectionKey =
  | "account"
  | "general" | "users" | "roles" | "organizations" | "audit"
  | "leasing" | "insurance" | "fuel-cards" | "cost-types" | "custom-fields"
  | "depreciation" | "folders" | "task-templates" | "hr-integrations"
  | "owner-emails" | "invoices";

interface NavItem {
  key: SectionKey;
  label: (t: AdminCopy) => string;
  icon: React.ReactNode;
}

interface NavGroup {
  title: (t: AdminCopy) => string;
  items: NavItem[];
}

const ic = "h-4 w-4";

const NAV_GROUPS: NavGroup[] = [
  {
    title: (t) => t.secAccount,
    items: [
      { key: "account", label: (t) => t.navAccount, icon: <UserCircle className={ic} /> },
    ],
  },
  {
    title: (t) => t.secAdmin,
    items: [
      { key: "general", label: (t) => t.navGeneral, icon: <Settings2 className={ic} /> },
      { key: "users", label: (t) => t.navUsers, icon: <Users className={ic} /> },
      { key: "roles", label: (t) => t.navRoles, icon: <KeyRound className={ic} /> },
      { key: "organizations", label: (t) => t.navOrganizations, icon: <LayoutGrid className={ic} /> },
      { key: "audit", label: (t) => t.navAudit, icon: <ScrollText className={ic} /> },
    ],
  },
  {
    title: (t) => t.secFleet,
    items: [
      { key: "leasing", label: (t) => t.navLeasing, icon: <FileText className={ic} /> },
      { key: "insurance", label: (t) => t.navInsurance, icon: <ShieldCheck className={ic} /> },
      { key: "fuel-cards", label: (t) => t.navFuelCards, icon: <Fuel className={ic} /> },
      { key: "cost-types", label: (t) => t.navCostTypes, icon: <Coins className={ic} /> },
      { key: "custom-fields", label: (t) => t.navCustomFields, icon: <SlidersHorizontal className={ic} /> },
      { key: "depreciation", label: (t) => t.navDepreciation, icon: <TrendingDown className={ic} /> },
      { key: "folders", label: (t) => t.navFolders, icon: <Folder className={ic} /> },
      { key: "task-templates", label: (t) => t.navTaskTemplates, icon: <ClipboardList className={ic} /> },
      { key: "hr-integrations", label: (t) => t.navHrIntegrations, icon: <Plug className={ic} /> },
      { key: "owner-emails", label: (t) => t.navOwnerEmails, icon: <Mail className={ic} /> },
      { key: "invoices", label: (t) => t.navInvoices, icon: <FileText className={ic} /> },
    ],
  },
];

const ALL_ITEMS = NAV_GROUPS.flatMap((g) => g.items);
const DEFAULT_SECTION: SectionKey = "users";

function renderPanel(section: SectionKey, t: AdminCopy) {
  switch (section) {
    case "account": return <AccountPanel t={t} />;
    case "general": return <GeneralPanel t={t} />;
    case "users": return <UsersPanel t={t} />;
    case "roles": return <RolesPanel t={t} />;
    case "organizations": return <OrganizationsPanel t={t} />;
    case "audit": return <AuditPanel t={t} />;
    default: {
      const item = ALL_ITEMS.find((i) => i.key === section);
      return <PlaceholderPanel title={item ? item.label(t) : section} t={t} />;
    }
  }
}

export function SettingsLayout({ t }: { t: AdminCopy }) {
  const [params, setParams] = useSearchParams();
  const raw = params.get("section") as SectionKey | null;
  const section: SectionKey = ALL_ITEMS.some((i) => i.key === raw) ? (raw as SectionKey) : DEFAULT_SECTION;

  const setSection = (key: SectionKey) => {
    setParams({ section: key }, { replace: true });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
      {/* Mobile selector */}
      <div className="lg:hidden">
        <select
          value={section}
          onChange={(e) => setSection(e.target.value as SectionKey)}
          className="w-full h-10 rounded-xl border border-border bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
        >
          {NAV_GROUPS.map((g) => (
            <optgroup key={g.title(t)} label={g.title(t)}>
              {g.items.map((i) => (
                <option key={i.key} value={i.key}>{i.label(t)}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Desktop nav */}
      <aside className="hidden lg:block">
        <div className="sticky top-2 bg-card rounded-xl border border-border shadow-sm p-3 max-h-[calc(100dvh-140px)] overflow-y-auto">
          {NAV_GROUPS.map((g) => (
            <div key={g.title(t)} className="mb-4 last:mb-0">
              <div className="px-2.5 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">{g.title(t)}</div>
              <div className="space-y-0.5">
                {g.items.map((i) => {
                  const active = i.key === section;
                  return (
                    <button
                      key={i.key}
                      onClick={() => setSection(i.key)}
                      className={cn(
                        "w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors text-left",
                        active ? "bg-primary/10 text-primary font-semibold" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                      )}
                    >
                      <span className={cn("shrink-0", active ? "text-primary" : "text-slate-400")}>{i.icon}</span>
                      <span className="truncate">{i.label(t)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Active panel */}
      <div className="min-w-0">{renderPanel(section, t)}</div>
    </div>
  );
}
