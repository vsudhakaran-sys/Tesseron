import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  BarChart3,
  Building2,
  Car,
  Check,
  FileText,
  KeyRound,
  LayoutDashboard,
  Plus,
  ScrollText,
  User,
  Users,
  Wrench,
} from "lucide-react";
import { cn } from "@/utils/utils";
import { Button } from "@/components/common/ui/button";
import { Input } from "@/components/common/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/ui/table";
import {
  PERMISSION_AREAS,
  TOTAL_PERMISSIONS,
  countPermissions,
  initialRoles,
  initialUsers,
} from "./data";
import { PERMISSION_ACTIONS, type PermissionAction, type Role } from "./types";
import type { AdminCopy } from "./translations";
import { Avatar, PanelHeader } from "./shared";

const ACTION_LABEL = (t: AdminCopy): Record<PermissionAction, string> => ({
  view: t.actView,
  create: t.actCreate,
  edit: t.actEdit,
  delete: t.actDelete,
  manage: t.actManage,
});

// Icon per permission area, used to give the matrix rows some visual anchoring.
const AREA_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  dashboard: LayoutDashboard,
  organizations: Building2,
  users: Users,
  roles: KeyRound,
  vehicles: Car,
  drivers: User,
  contracts: FileText,
  maintenance: Wrench,
  reports: BarChart3,
  audit: ScrollText,
};

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "role";

const BLANK_ROLE: Role = {
  id: "",
  name: "",
  description: "",
  type: "Custom",
  permissions: {},
  userCount: 0,
  updated: "—",
};

// ─── Role detail / permission matrix ─────────────────────────────────────────
function RoleDetail({
  role,
  isNew,
  t,
  onBack,
  onSave,
}: {
  role: Role;
  isNew: boolean;
  t: AdminCopy;
  onBack: () => void;
  onSave: (role: Role, isNew: boolean) => void;
}) {
  const [name, setName] = useState(role.name);
  const [description, setDescription] = useState(role.description);
  // Local editable copy of the permission grid: "area.action" -> enabled.
  const [grid, setGrid] = useState<Set<string>>(() => {
    const s = new Set<string>();
    Object.entries(role.permissions).forEach(([area, acts]) =>
      acts.forEach((a) => s.add(`${area}.${a}`)),
    );
    return s;
  });

  const labels = ACTION_LABEL(t);
  const enabledCount = grid.size;

  const toggle = (key: string) =>
    setGrid((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  const setMany = (keys: string[], on: boolean) =>
    setGrid((prev) => {
      const next = new Set(prev);
      keys.forEach((k) => (on ? next.add(k) : next.delete(k)));
      return next;
    });

  const applyPreset = (preset: "full" | "read" | "clear") =>
    setGrid(() => {
      const s = new Set<string>();
      if (preset === "full")
        PERMISSION_AREAS.forEach((a) => a.applicable.forEach((act) => s.add(`${a.key}.${act}`)));
      if (preset === "read")
        PERMISSION_AREAS.forEach((a) => {
          if (a.applicable.includes("view")) s.add(`${a.key}.view`);
        });
      return s;
    });

  const roleUsers = useMemo(
    () => initialUsers.filter((u) => u.roleIds.includes(role.id)),
    [role.id],
  );

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error(t.roleNameRequired);
      return;
    }
    const permissions: Role["permissions"] = {};
    PERMISSION_AREAS.forEach((area) => {
      const acts = PERMISSION_ACTIONS.filter((a) => grid.has(`${area.key}.${a}`));
      if (acts.length) permissions[area.key] = acts;
    });
    onSave(
      {
        ...role,
        id: role.id || slugify(trimmed),
        name: trimmed,
        description: description.trim(),
        permissions,
        updated: "Just now",
      },
      isNew,
    );
    toast.success(isNew ? t.roleCreated : t.savePermissions);
  };

  const heading = name.trim() || t.newRole;
  const pct = Math.round((enabledCount / TOTAL_PERMISSIONS) * 100);

  return (
    <div className="animate-fade-in">
      <PanelHeader
        eyebrow={
          <span className="text-slate-400">
            <button onClick={onBack} className="underline hover:text-slate-600">{t.navRoles}</button>
            {" / "}
            <span className="text-slate-600">{heading}</span>
          </span>
        }
        title={heading}
        description={description.trim() || undefined}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={onBack}>{t.cancel}</Button>
            <Button size="sm" onClick={handleSave}>{isNew ? t.createRole : t.savePermissions}</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4 items-start">
        {/* Matrix */}
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-border">
            <div className="flex items-center gap-3 min-w-0">
              <h3 className="text-sm font-bold text-slate-800">{t.permMatrix}</h3>
              <span className="text-xs font-medium text-slate-400">{t.enabledOfTotal(enabledCount, TOTAL_PERMISSIONS)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <PresetButton onClick={() => applyPreset("read")}>{t.presetReadOnly}</PresetButton>
              <PresetButton onClick={() => applyPreset("full")}>{t.presetFull}</PresetButton>
              <PresetButton onClick={() => applyPreset("clear")} muted>{t.presetClear}</PresetButton>
            </div>
          </div>

          {/* Progress bar of how many permissions are granted */}
          <div className="h-1 w-full bg-slate-100">
            <div className="h-full bg-primary transition-all duration-300" style={{ width: `${pct}%` }} />
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80 border-b border-border hover:bg-slate-50/80">
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-500 py-2.5 px-4 w-[260px]">{t.colArea}</TableHead>
                {PERMISSION_ACTIONS.map((a) => {
                  const colKeys = PERMISSION_AREAS.filter((ar) => ar.applicable.includes(a)).map((ar) => `${ar.key}.${a}`);
                  const allOn = colKeys.length > 0 && colKeys.every((k) => grid.has(k));
                  return (
                    <TableHead key={a} className="py-2 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => setMany(colKeys, !allOn)}
                        title={`${allOn ? "Clear" : "Select"} all · ${labels[a]}`}
                        className={cn(
                          "mx-auto block rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors",
                          allOn ? "text-primary hover:bg-primary/10" : "text-slate-500 hover:bg-slate-100 hover:text-slate-700",
                        )}
                      >
                        {labels[a]}
                      </button>
                    </TableHead>
                  );
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              {PERMISSION_AREAS.map((area) => {
                const AreaIcon = AREA_ICON[area.key];
                const rowKeys = area.applicable.map((act) => `${area.key}.${act}`);
                const rowOn = rowKeys.filter((k) => grid.has(k)).length;
                const rowAllOn = rowOn === rowKeys.length;
                return (
                  <TableRow key={area.key} className="border-b border-border last:border-0 hover:bg-slate-50/60">
                    <TableCell className="py-2.5 px-4">
                      <button
                        type="button"
                        onClick={() => setMany(rowKeys, !rowAllOn)}
                        title={`${rowAllOn ? "Clear" : "Grant all"} · ${area.name}`}
                        className="group flex items-center gap-3 text-left w-full"
                      >
                        <span className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors",
                          rowOn > 0 ? "border-primary/20 bg-primary/10 text-primary" : "border-slate-200 bg-slate-50 text-slate-400 group-hover:border-primary/30 group-hover:text-primary",
                        )}>
                          {AreaIcon && <AreaIcon className="h-4 w-4" />}
                        </span>
                        <span className="min-w-0">
                          <span className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-slate-800">{area.name}</span>
                            <span className={cn(
                              "rounded-full px-1.5 py-px text-[10px] font-bold tabular-nums",
                              rowOn > 0 ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-400",
                            )}>{rowOn}/{rowKeys.length}</span>
                          </span>
                          <span className="block text-[11px] text-slate-400">{area.desc}</span>
                        </span>
                      </button>
                    </TableCell>
                    {PERMISSION_ACTIONS.map((action) => {
                      const applicable = area.applicable.includes(action);
                      const key = `${area.key}.${action}`;
                      const on = grid.has(key);
                      return (
                        <TableCell key={action} className="py-2.5 px-2 text-center">
                          {applicable ? (
                            <button
                              type="button"
                              onClick={() => toggle(key)}
                              aria-pressed={on}
                              className={cn(
                                "inline-flex h-[24px] w-[24px] items-center justify-center rounded-[7px] border-[1.5px] transition-all active:scale-90",
                                on
                                  ? "border-primary bg-primary text-white shadow-sm shadow-primary/20"
                                  : "border-slate-200 bg-white text-transparent hover:border-primary hover:bg-primary/5",
                              )}
                            >
                              <Check className="h-3.5 w-3.5" strokeWidth={3} />
                            </button>
                          ) : (
                            <span className="inline-block text-slate-300 select-none">–</span>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          {!isNew && (
            <div className="bg-card rounded-xl border border-border shadow-sm p-5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">{t.usersWithRole(roleUsers.length)}</p>
              <div className="space-y-0.5">
                {roleUsers.map((u) => (
                  <div key={u.id} className="flex items-center gap-2.5 py-2 border-b border-slate-100 last:border-0">
                    <Avatar name={u.name} color={u.avatarColor} className="w-7 h-7 text-[11px]" />
                    <div>
                      <div className="text-sm font-semibold text-slate-800 leading-tight">{u.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{u.orgPath}</div>
                    </div>
                  </div>
                ))}
                {roleUsers.length === 0 && <p className="text-xs text-slate-400 py-2">—</p>}
              </div>
              {role.userCount > 0 && (
                <div className="mt-3 rounded-lg bg-amber-50 text-amber-700 px-3 py-2.5 text-xs leading-relaxed">
                  <b>{t.headsUp}</b> {t.roleImpact(role.userCount)}
                </div>
              )}
            </div>
          )}

          <div className="bg-card rounded-xl border border-border shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-800 mb-3">{t.roleMetadata}</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t.roleName}</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.roleName}
                  className="h-9"
                  autoFocus={isNew}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t.description}</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t.description}
                  rows={2}
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t.colType}</label>
                <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold", role.type === "System" ? "bg-slate-100 text-slate-600" : "bg-teal-50 text-teal-700")}>
                  {role.type === "System" ? t.typeSystem : t.typeCustom}
                </span>
                {role.type === "System" && <p className="text-[11px] text-slate-400 mt-2">{t.systemRoleNote}</p>}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function PresetButton({ children, onClick, muted }: { children: React.ReactNode; onClick: () => void; muted?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors",
        muted
          ? "border-border text-slate-500 hover:bg-slate-50 hover:text-slate-700"
          : "border-primary/20 bg-primary/5 text-primary hover:bg-primary/10",
      )}
    >
      {children}
    </button>
  );
}

// ─── Panel ───────────────────────────────────────────────────────────────────
type View = { mode: "list" } | { mode: "edit"; id: string } | { mode: "create" };

export function RolesPanel({ t }: { t: AdminCopy }) {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [view, setView] = useState<View>({ mode: "list" });

  if (view.mode !== "list") {
    const isNew = view.mode === "create";
    const role = isNew ? BLANK_ROLE : roles.find((r) => r.id === view.id);
    if (role) {
      return (
        <RoleDetail
          key={isNew ? "new" : view.mode === "edit" ? view.id : "x"}
          role={role}
          isNew={isNew}
          t={t}
          onBack={() => setView({ mode: "list" })}
          onSave={(saved, created) => {
            setRoles((prev) => {
              if (!created) return prev.map((r) => (r.id === saved.id ? saved : r));
              let id = saved.id;
              let n = 2;
              while (prev.some((r) => r.id === id)) id = `${saved.id}-${n++}`;
              return [...prev, { ...saved, id }];
            });
            setView({ mode: "list" });
          }}
        />
      );
    }
  }

  return (
    <div className="animate-fade-in">
      <PanelHeader
        title={t.rolesTitle}
        description={t.rolesDesc}
        actions={
          <Button size="sm" className="gap-1.5" onClick={() => setView({ mode: "create" })}>
            <Plus className="h-3.5 w-3.5" strokeWidth={2.5} /> {t.createRole}
          </Button>
        }
      />

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 border-b border-border hover:bg-slate-50">
              <TableHead className="text-[10px] font-semibold tracking-wider py-3 px-5">{t.colRole}</TableHead>
              <TableHead className="text-[10px] font-semibold tracking-wider py-3 px-5">{t.colType}</TableHead>
              <TableHead className="text-[10px] font-semibold tracking-wider py-3 px-5">{t.colPermissions}</TableHead>
              <TableHead className="text-[10px] font-semibold tracking-wider py-3 px-5">{t.colUsers}</TableHead>
              <TableHead className="text-[10px] font-semibold tracking-wider py-3 px-5">{t.colUpdated}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((r) => (
              <TableRow
                key={r.id}
                onClick={() => setView({ mode: "edit", id: r.id })}
                className="cursor-pointer hover:bg-primary/[0.02] border-b border-border last:border-0"
              >
                <TableCell className="py-3 px-5">
                  <div className="font-bold text-sm text-slate-800">{r.name}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{r.description}</div>
                </TableCell>
                <TableCell className="py-3 px-5">
                  <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold", r.type === "System" ? "bg-slate-100 text-slate-600" : "bg-teal-50 text-teal-700")}>
                    {r.type === "System" ? t.typeSystem : t.typeCustom}
                  </span>
                </TableCell>
                <TableCell className="py-3 px-5 font-mono text-sm font-bold text-slate-700">{countPermissions(r)} / {TOTAL_PERMISSIONS}</TableCell>
                <TableCell className="py-3 px-5 text-sm text-slate-600 font-medium">{r.userCount}</TableCell>
                <TableCell className="py-3 px-5 text-xs text-slate-500 font-medium">{r.updated}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
