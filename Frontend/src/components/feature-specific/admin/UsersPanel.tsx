import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Check, KeyRound, Plus, Search, UserPlus } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/common/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/common/ui/tabs";
import {
  initialUsers,
  initialRoles,
  flattenOrgs,
  countPermissions,
  TOTAL_PERMISSIONS,
} from "./data";
import type { AdminUser } from "./types";
import type { AdminCopy } from "./translations";
import { Avatar, PanelHeader, StatusPill } from "./shared";

const orgOptions = flattenOrgs();
const roleById = Object.fromEntries(initialRoles.map((r) => [r.id, r]));

// Small native-styled select to match the toolbar look without extra ceremony.
function FilterSelect({
  value,
  onChange,
  children,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "h-9 rounded-lg border border-border bg-white px-3 text-xs font-medium text-slate-700 outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-colors",
        className,
      )}
    >
      {children}
    </select>
  );
}

function RoleChip({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors",
        on
          ? "border-primary bg-primary/10 text-primary"
          : "border-border bg-white text-slate-600 hover:border-primary/40",
      )}
    >
      <span
        className={cn(
          "flex h-3.5 w-3.5 items-center justify-center rounded-[4px] border",
          on ? "border-primary bg-primary text-white" : "border-slate-300 text-transparent",
        )}
      >
        <Check className="h-2.5 w-2.5" strokeWidth={3} />
      </span>
      {label}
    </button>
  );
}

// ─── User detail ─────────────────────────────────────────────────────────────
function UserDetail({ user, t, onBack }: { user: AdminUser; t: AdminCopy; onBack: () => void }) {
  const [roleIds, setRoleIds] = useState<string[]>(user.roleIds);
  const effectivePerms = useMemo(() => {
    const enabled = new Set<string>();
    roleIds.forEach((rid) => {
      const role = roleById[rid];
      if (!role) return;
      Object.entries(role.permissions).forEach(([area, acts]) =>
        acts.forEach((a) => enabled.add(`${area}.${a}`)),
      );
    });
    return enabled.size;
  }, [roleIds]);

  const toggleRole = (id: string) =>
    setRoleIds((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]));

  return (
    <div className="animate-fade-in">
      <PanelHeader
        eyebrow={
          <span className="text-slate-400">
            <button onClick={onBack} className="underline hover:text-slate-600">{t.navUsers}</button>
            {" / "}
            <span className="text-slate-600">{user.name}</span>
          </span>
        }
        title={user.name}
        description={`${user.email} · ${user.orgPath}`}
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <KeyRound className="h-3.5 w-3.5" /> {t.resetPassword}
            </Button>
            <Button variant="outline" size="sm" className="text-xs">{t.forceMfa}</Button>
            <Button
              size="sm"
              className={cn(
                "text-xs",
                user.status === "Disabled"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-white text-rose-600 border border-rose-200 hover:bg-rose-50",
              )}
            >
              {user.status === "Disabled" ? t.enable : t.disable}
            </Button>
          </>
        }
      />

      <div className="bg-card rounded-xl border border-border shadow-sm">
        <Tabs defaultValue="profile">
          <div className="border-b border-border px-4">
            <TabsList className="bg-transparent p-0 h-auto gap-1">
              <TabsTrigger value="profile" className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-primary border-b-2 border-transparent rounded-none px-3 py-3 text-sm font-semibold">{t.profile}</TabsTrigger>
              <TabsTrigger value="access" className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-primary border-b-2 border-transparent rounded-none px-3 py-3 text-sm font-semibold">{t.access}</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="profile" className="p-6 mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 max-w-3xl">
              <Field label={t.fullName}><Input defaultValue={user.name} className="h-9" /></Field>
              <Field label={t.email}><Input defaultValue={user.email} disabled className="h-9 bg-slate-50 font-mono" /></Field>
              <Field label={t.defaultLanguage}>
                <FilterSelect value={user.language} onChange={() => {}} className="w-full h-9">
                  <option value="de-DE">de-DE (German)</option>
                  <option value="en-GB">en-GB (English)</option>
                  <option value="fr-FR">fr-FR (French)</option>
                </FilterSelect>
              </Field>
              <Field label={t.organization} help={t.moveOrgHelp}>
                <FilterSelect value={user.orgId} onChange={() => {}} className="w-full h-9">
                  {orgOptions.map((o) => (
                    <option key={o.id} value={o.id}>{o.label}</option>
                  ))}
                </FilterSelect>
              </Field>
            </div>
          </TabsContent>

          <TabsContent value="access" className="p-6 mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">{t.assignedRoles}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {initialRoles.map((r) => (
                    <RoleChip key={r.id} label={r.name} on={roleIds.includes(r.id)} onClick={() => toggleRole(r.id)} />
                  ))}
                </div>
                <p className="text-xs text-slate-400">{t.rolesHelp}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">{t.effectiveAccess}</p>
                <div className="rounded-lg border border-border bg-slate-50 px-4 py-3 text-sm space-y-1.5">
                  <Row k={t.permissions}><b className="font-mono">{effectivePerms} / {TOTAL_PERMISSIONS}</b></Row>
                  <Row k={t.scope}><b>{t.wholeOrg}</b></Row>
                  <Row k={t.mfa}>
                    <b className={user.mfa ? "text-emerald-600" : "text-amber-600"}>
                      {user.mfa ? `✓ ${t.verified}` : t.notEnrolled}
                    </b>
                  </Row>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 border-t border-border px-6 py-4">
          <Button variant="outline" size="sm" onClick={onBack}>{t.cancel}</Button>
          <Button size="sm" onClick={() => { toast.success(t.save); onBack(); }}>{t.save}</Button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1.5">{label}</label>
      {children}
      {help && <p className="text-[11px] text-slate-400 mt-1">{help}</p>}
    </div>
  );
}

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500">{k}</span>
      {children}
    </div>
  );
}

// ─── Invite modal ────────────────────────────────────────────────────────────
function InviteDialog({ open, onClose, t, onInvite }: { open: boolean; onClose: () => void; t: AdminCopy; onInvite: (u: AdminUser) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [orgId, setOrgId] = useState(orgOptions[0]?.id ?? "");
  const [roleIds, setRoleIds] = useState<string[]>(["fleet-manager"]);

  const reset = () => { setName(""); setEmail(""); setOrgId(orgOptions[0]?.id ?? ""); setRoleIds(["fleet-manager"]); };
  const toggleRole = (id: string) =>
    setRoleIds((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]));

  const submit = () => {
    if (!name.trim() || !email.trim() || roleIds.length === 0) return;
    const org = orgOptions.find((o) => o.id === orgId);
    onInvite({
      id: `u-${name.toLowerCase().replace(/\s+/g, "-")}`,
      name: name.trim(),
      email: email.trim(),
      orgId,
      orgPath: org?.label.trim() ?? "",
      roleIds,
      status: "Invited",
      lastLogin: "—",
      mfa: false,
      language: "en-GB",
      avatarColor: ((name.length % 6) + 1),
    });
    toast.success(t.inviteSent);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t.inviteTitle}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-1">
          <Field label={`${t.fullName} *`}>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Marco Rossi" className="h-9" />
          </Field>
          <Field label={`${t.workEmail} *`}>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="marco.rossi@mueller.it" className="h-9 font-mono" />
          </Field>
          <Field label={`${t.organization} *`}>
            <FilterSelect value={orgId} onChange={setOrgId} className="w-full h-9">
              {orgOptions.map((o) => (
                <option key={o.id} value={o.id}>{o.label}</option>
              ))}
            </FilterSelect>
          </Field>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t.rolesOneOrMore} *</label>
            <div className="flex flex-wrap gap-2">
              {initialRoles.map((r) => (
                <RoleChip key={r.id} label={r.name} on={roleIds.includes(r.id)} onClick={() => toggleRole(r.id)} />
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">{t.inviteRolesHelp}</p>
          </div>
          <div className="rounded-r-lg border-l-[3px] border-primary bg-primary/5 px-3 py-2.5 text-xs text-primary/90">
            {t.inviteNote}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>{t.cancel}</Button>
          <Button size="sm" onClick={submit} disabled={!name.trim() || !email.trim() || roleIds.length === 0} className="gap-1.5">
            <UserPlus className="h-3.5 w-3.5" /> {t.sendInvite}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Panel ───────────────────────────────────────────────────────────────────
export function UsersPanel({ t }: { t: AdminCopy }) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [orgFilter, setOrgFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [query, setQuery] = useState("");

  const selected = users.find((u) => u.id === selectedId) ?? null;

  const filtered = users.filter((u) => {
    if (orgFilter !== "all" && u.orgId !== orgFilter) return false;
    if (roleFilter !== "all" && !u.roleIds.includes(roleFilter)) return false;
    if (statusFilter !== "all" && u.status !== statusFilter) return false;
    if (query && !`${u.name} ${u.email}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  if (selected) {
    return <UserDetail user={selected} t={t} onBack={() => setSelectedId(null)} />;
  }

  return (
    <div className="animate-fade-in">
      <PanelHeader
        title={t.usersTitle}
        description={t.usersDesc}
        actions={
          <Button size="sm" onClick={() => setInviteOpen(true)} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" strokeWidth={2.5} /> {t.inviteUser}
          </Button>
        }
      />

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 p-4 border-b border-border">
          <FilterSelect value={orgFilter} onChange={setOrgFilter}>
            <option value="all">{t.allOrgs}</option>
            {orgOptions.map((o) => (
              <option key={o.id} value={o.id}>{o.label}</option>
            ))}
          </FilterSelect>
          <FilterSelect value={roleFilter} onChange={setRoleFilter}>
            <option value="all">{t.allRoles}</option>
            {initialRoles.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </FilterSelect>
          <FilterSelect value={statusFilter} onChange={setStatusFilter}>
            <option value="all">{t.allStatuses}</option>
            <option value="Active">{t.statusActive}</option>
            <option value="Invited">{t.statusInvited}</option>
            <option value="Disabled">{t.statusDisabled}</option>
          </FilterSelect>
          <div className="relative ml-auto w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.search} className="pl-9 h-9 text-xs" />
          </div>
          <span className="text-xs text-slate-400 font-medium w-full sm:w-auto sm:ml-2">{t.usersCount(filtered.length)}</span>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 border-b border-border hover:bg-slate-50">
              <TableHead className="text-[10px] font-semibold tracking-wider py-3 px-5">{t.colUser}</TableHead>
              <TableHead className="text-[10px] font-semibold tracking-wider py-3 px-5">{t.colOrg}</TableHead>
              <TableHead className="text-[10px] font-semibold tracking-wider py-3 px-5">{t.colRoles}</TableHead>
              <TableHead className="text-[10px] font-semibold tracking-wider py-3 px-5">{t.colStatus}</TableHead>
              <TableHead className="text-[10px] font-semibold tracking-wider py-3 px-5">{t.colLastLogin}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((u) => (
              <TableRow
                key={u.id}
                onClick={() => setSelectedId(u.id)}
                className="cursor-pointer hover:bg-primary/[0.02] border-b border-border last:border-0"
              >
                <TableCell className="py-3 px-5">
                  <div className="flex items-center gap-3">
                    <Avatar name={u.name} color={u.avatarColor} className="w-8 h-8 text-xs" />
                    <div>
                      <div className="font-semibold text-foreground text-sm leading-tight">{u.name}</div>
                      <div className="text-xs text-muted-foreground font-mono">{u.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 px-5 text-xs text-slate-600 font-medium">{u.orgPath}</TableCell>
                <TableCell className="py-3 px-5">
                  <div className="flex flex-wrap gap-1">
                    {u.roleIds.map((rid) => (
                      <span key={rid} className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                        {roleById[rid]?.name ?? rid}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="py-3 px-5"><StatusPill status={u.status} t={t} /></TableCell>
                <TableCell className="py-3 px-5 text-xs text-slate-600 font-medium">{u.lastLogin}</TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-sm text-slate-400">{t.noUsers}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <InviteDialog open={inviteOpen} onClose={() => setInviteOpen(false)} t={t} onInvite={(u) => setUsers((prev) => [u, ...prev])} />
    </div>
  );
}
