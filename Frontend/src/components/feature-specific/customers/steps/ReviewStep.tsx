import { Building2, LayoutGrid, Users } from "lucide-react";
import { Button } from "@/components/common/ui/button";
import { SectionHeader } from "../SectionHeader";
import type { CustomerDetails, InvitedUser, ModuleItem } from "../types";
import type { CustomerCopy } from "../translations";

interface ReviewStepProps {
  t: CustomerCopy;
  details: CustomerDetails;
  invitedUsers: InvitedUser[];
  modules: ModuleItem[];
  onEditStep: (index: number) => void;
}

// Step 4: Review
export function ReviewStep({ t, details, invitedUsers, modules, onEditStep }: ReviewStepProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* ── Section: Customer Details ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <SectionHeader icon={Building2} label={t.customerDetails} />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditStep(0)}
            className="h-6 text-[10px] font-semibold text-primary hover:bg-blue-50 dark:hover:bg-blue-900/50 shrink-0 ml-2"
          >
            {t.edit}
          </Button>
        </div>
        <div className="p-4 bg-slate-50/70 dark:bg-slate-900/50 border border-border rounded-lg">
          <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-xs">
            <div>
              <span className="text-muted-foreground font-medium">Name:</span>
              <p className="font-semibold text-foreground mt-0.5">{details.customerName}</p>
            </div>
            <div>
              <span className="text-muted-foreground font-medium">Client Number:</span>
              <p className="font-semibold text-foreground mt-0.5">{details.clientNumber || "—"}</p>
            </div>
            <div>
              <span className="text-muted-foreground font-medium">Country:</span>
              <p className="font-semibold text-foreground mt-0.5">{details.country}</p>
            </div>
            <div>
              <span className="text-muted-foreground font-medium">Currency:</span>
              <p className="font-semibold text-foreground mt-0.5">{details.currency}</p>
            </div>
            <div className="col-span-2">
              <span className="text-muted-foreground font-medium">Tax Treatment:</span>
              <p className="font-semibold text-foreground mt-0.5">{details.taxTreatment}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section: Users & Access ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <SectionHeader icon={Users} label={t.usersAccess} />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditStep(1)}
            className="h-6 text-[10px] font-semibold text-primary hover:bg-blue-50 dark:hover:bg-blue-900/50 shrink-0 ml-2"
          >
            {t.edit}
          </Button>
        </div>
        <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
          {invitedUsers.length === 0 ? (
            <p className="text-xs text-muted-foreground bg-slate-50/70 dark:bg-slate-900/50 p-3 rounded-lg border border-border">{t.noUsers}</p>
          ) : (
            invitedUsers.map((user, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center bg-slate-50/70 dark:bg-slate-900/50 p-3 border border-border rounded-lg"
              >
                <div>
                  <span className="text-xs font-bold text-foreground">{user.name}</span>
                  <span className="text-[10px] text-muted-foreground ml-2">{user.role}</span>
                </div>
                <span className="text-[9px] font-bold bg-blue-50 dark:bg-blue-900/30 text-primary border border-blue-100 dark:border-blue-900/45 px-2 py-0.5 rounded-full">
                  {user.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Section: Active Modules ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <SectionHeader icon={LayoutGrid} label={t.selectedModules} />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditStep(2)}
            className="h-6 text-[10px] font-semibold text-primary hover:bg-blue-50 dark:hover:bg-blue-900/50 shrink-0 ml-2"
          >
            {t.edit}
          </Button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {modules
            .filter(m => m.checked)
            .map(m => (
              <span
                key={m.name}
                className="inline-flex items-center text-[10.5px] font-medium bg-blue-50/80 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/50 px-2.5 py-1 rounded-md"
              >
                {m.name}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
}
