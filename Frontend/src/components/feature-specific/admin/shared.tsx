import { cn } from "@/utils/utils";
import { Construction } from "lucide-react";
import type { AdminStatus } from "./types";
import type { AdminCopy } from "./translations";

// Avatar gradient palette (mirrors the av-1..av-6 set from the design mock).
const AV_GRADIENTS: Record<number, string> = {
  1: "from-[#0F766E] to-[#0B5A54]",
  2: "from-[#1E40AF] to-[#1E3A8A]",
  3: "from-[#C9821A] to-[#8A5A12]",
  4: "from-[#6B21A8] to-[#4C1D95]",
  5: "from-[#15803D] to-[#166534]",
  6: "from-[#B91C1C] to-[#7F1D1D]",
};

export function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

interface AvatarProps {
  name: string;
  color?: number;
  className?: string;
}

export function Avatar({ name, color = 1, className }: AvatarProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full text-white font-bold shrink-0 bg-gradient-to-br",
        AV_GRADIENTS[color] ?? AV_GRADIENTS[1],
        className ?? "w-8 h-8 text-xs",
      )}
    >
      {initials(name)}
    </div>
  );
}

interface StatusPillProps {
  status: AdminStatus;
  t: AdminCopy;
}

export function StatusPill({ status, t }: StatusPillProps) {
  const map: Record<AdminStatus, { cls: string; label: string }> = {
    Active: { cls: "bg-emerald-50 text-emerald-600 border-emerald-100", label: t.statusActive },
    Invited: { cls: "bg-amber-50 text-amber-700 border-amber-100", label: t.statusInvited },
    Disabled: { cls: "bg-rose-50 text-rose-600 border-rose-100", label: t.statusDisabled },
  };
  const { cls, label } = map[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide border", cls)}>
      <span className={cn("w-1.5 h-1.5 rounded-full", status === "Active" ? "bg-emerald-500" : status === "Invited" ? "bg-amber-500" : "bg-rose-500")} />
      {label}
    </span>
  );
}

interface PanelHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  eyebrow?: React.ReactNode;
}

// Lightweight header used inside settings panels (the page-level PageHeader is
// reserved for the route itself).
export function PanelHeader({ title, description, actions, eyebrow }: PanelHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
      <div className="space-y-1 min-w-0">
        {eyebrow && <div className="text-xs font-medium">{eyebrow}</div>}
        <h2 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">{title}</h2>
        {description && <p className="text-sm font-medium text-slate-500 max-w-2xl">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

// Reusable scaffold for the fleet-configuration entries that are wired into the
// navigation but not yet built out.
export function PlaceholderPanel({ title, t }: { title: string; t: AdminCopy }) {
  return (
    <div>
      <PanelHeader title={title} />
      <div className="bg-card rounded-xl border border-border border-dashed shadow-sm p-12 flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-4">
          <Construction className="h-6 w-6" />
        </div>
        <p className="text-sm font-bold text-slate-700">{t.comingSoon}</p>
        <p className="text-sm text-slate-500 max-w-md mt-1.5">{t.scaffoldNote}</p>
      </div>
    </div>
  );
}
