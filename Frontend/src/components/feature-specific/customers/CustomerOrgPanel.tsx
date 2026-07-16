import { Building2, Network, Users, Check } from "lucide-react";
import { cn } from "@/utils/utils";
import type { CustomerBranch, CustomerOrg, OrgEntityStatus } from "./types";
import type { CustomerCopy } from "./translations";

// Avatar gradient palette (mirrors the admin area's av-1..av-6 set).
const AV_GRADIENTS: Record<number, string> = {
  1: "from-emerald-500 to-teal-700",
  2: "from-blue-600 to-indigo-800",
  3: "from-amber-500 to-orange-700",
  4: "from-purple-600 to-violet-800",
  5: "from-green-600 to-emerald-800",
  6: "from-rose-500 to-red-700",
};

function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function UserAvatar({ name }: { name: string }) {
  return (
    <div
      className="flex items-center justify-center rounded-full bg-primary text-white font-bold shrink-0 text-[9px] tracking-wider transition-all duration-300 group-hover:scale-105"
      style={{ width: "24px", height: "24px" }}
    >
      {initials(name)}
    </div>
  );
}

function StatusPill({ status, t }: { status: OrgEntityStatus; t: CustomerCopy }) {
  const map: Record<OrgEntityStatus, { cls: string; dot: string; label: string }> = {
    Active: { cls: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 aria-glow-emerald", dot: "bg-emerald-500", label: t.statusActive },
    Inactive: { cls: "bg-rose-500/10 text-rose-600 border-rose-500/20 aria-glow-rose", dot: "bg-rose-500", label: t.statusInactive },
    Pending: { cls: "bg-amber-500/10 text-amber-600 border-amber-500/20 aria-glow-amber", dot: "bg-amber-500", label: t.statusPending },
  };
  const s = map[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wide border transition-all duration-300", s.cls)}>
      <span className={cn("w-1.5 h-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}

function RoleChip({ role }: { role: string }) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-primary/5 text-primary border border-primary/10 tracking-wide font-display">
      {role}
    </span>
  );
}

function StatCard({ value, label, icon: Icon, accentClass, bgClass }: { value: number; label: string; icon: any; accentClass: string; bgClass: string }) {
  return (
    <div className="aria-card p-5 rounded-2xl flex items-center gap-4 relative overflow-hidden group hover:-translate-y-0.5 transition-all duration-300">
      <div className={cn("absolute top-0 left-0 w-1.5 h-full", bgClass)} />
      <div className={cn("flex items-center justify-center w-10 h-10 rounded-xl transition-transform duration-300 group-hover:scale-105 shrink-0 shadow-sm", accentClass)}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-black font-display text-foreground leading-none mb-1 group-hover:translate-x-0.5 transition-transform duration-200">{value}</p>
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function BranchRow({ branch, t }: { branch: CustomerBranch; t: CustomerCopy }) {
  return (
    <div className="group/branch">
      <div className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-slate-50/60 dark:hover:bg-slate-900/40 border border-transparent hover:border-border/40 transition-all duration-200">
        <div className="flex items-center justify-center bg-teal-500/10 text-teal-600 border border-teal-500/10 p-2 rounded-lg shrink-0 group-hover/branch:scale-105 transition-transform duration-200">
          <Building2 className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-bold text-foreground truncate">{branch.name}</div>
          <div className="text-[10px] text-muted-foreground truncate">{branch.location}</div>
        </div>
        <div className="ml-auto flex items-center gap-3 shrink-0">
          <span className="text-[10px] font-mono text-muted-foreground bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
            {branch.userCount} {branch.userCount === 1 ? t.userSuffix : t.usersSuffix}
          </span>
          <StatusPill status={branch.status} t={t} />
        </div>
      </div>
      {branch.children?.length ? (
        <div className="border-l border-dashed border-teal-500/30 dark:border-teal-500/20 ml-[23px] pl-3.5 mt-1 space-y-1">
          {branch.children.map((child) => (
            <BranchRow key={child.id} branch={child} t={t} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function countBranches(branches: CustomerBranch[]): number {
  return branches.reduce((n, b) => n + 1 + (b.children ? countBranches(b.children) : 0), 0);
}

// ── 1. stats block component ──
export function CustomerOrgStats({ org, t }: { org: CustomerOrg; t: CustomerCopy }) {
  const branchCount = countBranches(org.branches);
  const userCount = org.users.length;
  const activeCount = org.users.filter((u) => u.status === "Active").length;

  return (
    <div className="grid grid-cols-3 gap-4 animate-fade-in">
      <StatCard value={branchCount} label={t.branchesStat} icon={Building2} accentClass="bg-teal-500/10 text-teal-600 border border-teal-500/20" bgClass="bg-teal-500" />
      <StatCard value={userCount} label={t.usersStat} icon={Users} accentClass="bg-blue-500/10 text-blue-600 border border-blue-500/20" bgClass="bg-blue-500" />
      <StatCard value={activeCount} label={t.activeStat} icon={Check} accentClass="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" bgClass="bg-emerald-500" />
    </div>
  );
}

// ── 2. Sub-branches component ──
export function CustomerSubBranchesCard({ org, t }: { org: CustomerOrg; t: CustomerCopy }) {
  return (
    <div className="aria-card rounded-2xl overflow-hidden flex flex-col min-h-[300px] animate-fade-in">
      {/* Consistent header styling matching screenshot */}
      <div className="px-5 py-4 border-b border-border/40 bg-slate-50/50 dark:bg-slate-900/30 shrink-0">
        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground font-display">{t.subBranches}</h3>
      </div>
      <div className="p-4 space-y-2 overflow-y-auto flex-1 custom-scrollbar">
        {org.branches.length ? (
          <div className="space-y-1">
            {org.branches.map((branch) => (
              <BranchRow key={branch.id} branch={branch} t={t} />
            ))}
          </div>
        ) : (
          <div className="text-xs text-muted-foreground text-center py-8">{t.noBranches}</div>
        )}
      </div>
    </div>
  );
}

// ── 3. Users Table component ──
export function CustomerUsersTable({ org, t }: { org: CustomerOrg; t: CustomerCopy }) {
  const userCount = org.users.length;
  return (
    <div className="aria-card rounded-2xl overflow-hidden flex flex-col animate-fade-in">
      {/* Consistent header styling matching screenshot */}
      <div className="px-6 py-4 border-b border-border/40 bg-slate-50/50 dark:bg-slate-900/30 shrink-0 flex items-center">
        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground font-display">{t.orgUsers}</h3>
        <span className="ml-auto text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full">{userCount}</span>
      </div>
      <div className="overflow-x-auto">
        {org.users.length ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/30 bg-slate-50/30 dark:bg-slate-900/10">
                <th className="px-6 py-3.5 text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground">{t.fullName}</th>
                <th className="px-6 py-3.5 text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground">{t.emailAddress}</th>
                <th className="px-6 py-3.5 text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground">{t.branchesStat}</th>
                <th className="px-6 py-3.5 text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground">{t.role}</th>
                <th className="px-6 py-3.5 text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground">{t.tableHeaderStatus}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/60 dark:divide-slate-800/60">
              {org.users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/20 transition-all duration-200 group">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <UserAvatar name={user.name} />
                      <span className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors duration-200">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-xs text-muted-foreground/85 font-mono">{user.email}</td>
                  <td className="px-6 py-3.5 text-xs text-muted-foreground/85">{user.branch}</td>
                  <td className="px-6 py-3.5"><RoleChip role={user.role} /></td>
                  <td className="px-6 py-3.5"><StatusPill status={user.status} t={t} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-xs text-muted-foreground text-center py-8">{t.noOrgUsers}</div>
        )}
      </div>
    </div>
  );
}
