import { useState } from "react";
import { toast } from "sonner";
import { Building2, ChevronRight, Plus } from "lucide-react";
import { cn } from "@/utils/utils";
import { Button } from "@/components/common/ui/button";
import { Input } from "@/components/common/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/common/ui/dialog";
import { initialUsers, orgTree } from "./data";
import type { OrgNode } from "./types";
import type { AdminCopy } from "./translations";
import { Avatar, PanelHeader } from "./shared";

const topLevelOrgs = orgTree.flatMap((root) => [root, ...(root.children ?? [])]);

function TreeRow({
  node,
  depth,
  selectedId,
  expanded,
  onSelect,
  onToggle,
}: {
  node: OrgNode;
  depth: number;
  selectedId: string;
  expanded: Set<string>;
  onSelect: (n: OrgNode) => void;
  onToggle: (id: string) => void;
}) {
  const hasKids = !!node.children?.length;
  const isOpen = expanded.has(node.id);
  const selected = selectedId === node.id;

  return (
    <div>
      <div
        role="button"
        onClick={() => { onSelect(node); if (hasKids) onToggle(node.id); }}
        className={cn(
          "flex items-center gap-2 rounded-lg px-2.5 py-2 cursor-pointer text-sm transition-colors",
          selected ? "bg-primary/10 text-primary font-semibold" : "hover:bg-slate-50 text-slate-700",
        )}
        style={{ marginLeft: depth * 18 }}
      >
        <ChevronRight
          className={cn("h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform", isOpen && "rotate-90", !hasKids && "invisible")}
        />
        <Building2 className={cn("h-4 w-4 shrink-0", selected ? "text-primary" : "text-teal-600")} />
        <span className="truncate">{node.name}</span>
        <span className={cn("ml-auto text-[11px] font-mono", selected ? "text-primary/80" : "text-slate-400")}>
          {node.users} {node.users === 1 ? "user" : "users"}
        </span>
      </div>
      {hasKids && isOpen && (
        <div className="border-l border-dashed border-slate-200 ml-[18px] pl-1.5 mt-0.5 space-y-0.5">
          {node.children!.map((child) => (
            <TreeRow key={child.id} node={child} depth={0} selectedId={selectedId} expanded={expanded} onSelect={onSelect} onToggle={onToggle} />
          ))}
        </div>
      )}
    </div>
  );
}

function AddSubOrgDialog({ open, onClose, t }: { open: boolean; onClose: () => void; t: AdminCopy }) {
  const [name, setName] = useState("");
  const [parent, setParent] = useState(orgTree[0]?.id ?? "");

  const submit = () => {
    if (!name.trim()) return;
    toast.success(t.orgCreated);
    setName("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t.createSubOrg}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-1">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t.name} *</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sales Berlin" className="h-9" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t.parentOrg} *</label>
            <select
              value={parent}
              onChange={(e) => setParent(e.target.value)}
              className="w-full h-9 rounded-lg border border-border bg-white px-3 text-sm text-slate-700 outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
            >
              {topLevelOrgs.map((o) => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t.country} <span className="text-slate-400 font-normal">({t.optional})</span></label>
            <select className="w-full h-9 rounded-lg border border-border bg-white px-3 text-sm text-slate-700 outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10">
              <option>{t.countryNone}</option>
              <option>Germany (DE)</option>
              <option>France (FR)</option>
              <option>Switzerland (CH)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t.description} <span className="text-slate-400 font-normal">({t.optional})</span></label>
            <textarea rows={2} className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 resize-none" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>{t.cancel}</Button>
          <Button size="sm" onClick={submit} disabled={!name.trim()}>{t.createSubOrg}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function OrganizationsPanel({ t }: { t: AdminCopy }) {
  const root = orgTree[0];
  const [selected, setSelected] = useState<OrgNode>(root);
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(topLevelOrgs.map((o) => o.id)));
  const [addOpen, setAddOpen] = useState(false);

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const members = initialUsers.filter((u) => u.orgId === selected.id);

  return (
    <div className="animate-fade-in">
      <PanelHeader
        title={t.orgsTitle}
        description={t.orgsDesc}
        actions={
          <Button size="sm" onClick={() => setAddOpen(true)} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" strokeWidth={2.5} /> {t.newSubOrg}
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4 items-start">
        {/* Tree */}
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
            <h3 className="text-sm font-bold text-slate-800">{t.hierarchy}</h3>
            <span className="text-xs text-slate-400">{t.clickToDrill}</span>
          </div>
          <div className="p-3">
            {orgTree.map((node) => (
              <TreeRow key={node.id} node={node} depth={0} selectedId={selected.id} expanded={expanded} onSelect={setSelected} onToggle={toggle} />
            ))}
          </div>
        </div>

        {/* Detail */}
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border">
            <h3 className="text-sm font-bold text-slate-800">{selected.name}</h3>
            <span className="text-xs text-slate-400 font-mono">platform.{selected.path}</span>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{t.directUsers}</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">{selected.users}</div>
              </div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{t.subOrgs}</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">{selected.children?.length ?? 0}</div>
              </div>
            </div>

            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">{t.members}</div>
            <div className="space-y-0.5">
              {members.map((u) => (
                <div key={u.id} className="flex items-center gap-2.5 py-2 border-b border-slate-100 last:border-0">
                  <Avatar name={u.name} color={u.avatarColor} className="w-7 h-7 text-[11px]" />
                  <div>
                    <div className="text-sm font-semibold text-slate-800 leading-tight">{u.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                  </div>
                </div>
              ))}
              {members.length === 0 && <p className="text-xs text-slate-400 py-2">—</p>}
            </div>

            <div className="flex gap-2 mt-5">
              <Button variant="outline" size="sm" className="text-xs">{t.edit}</Button>
              <Button variant="outline" size="sm" className="text-xs" onClick={() => setAddOpen(true)}>{t.addSubHere}</Button>
            </div>
          </div>
        </div>
      </div>

      <AddSubOrgDialog open={addOpen} onClose={() => setAddOpen(false)} t={t} />
    </div>
  );
}
