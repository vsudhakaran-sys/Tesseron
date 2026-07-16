import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { cn } from "@/utils/utils";
import { Button } from "@/components/common/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/ui/table";
import { auditEvents } from "./data";
import type { AdminCopy } from "./translations";
import { Avatar, PanelHeader } from "./shared";

function FilterSelect({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 rounded-lg border border-border bg-white px-3 text-xs font-medium text-slate-700 outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
    >
      {children}
    </select>
  );
}

export function AuditPanel({ t }: { t: AdminCopy }) {
  const [actor, setActor] = useState("all");
  const [action, setAction] = useState("all");

  const actors = useMemo(() => Array.from(new Set(auditEvents.map((e) => e.actorName))), []);
  const actions = useMemo(() => Array.from(new Set(auditEvents.map((e) => e.action))), []);

  const filtered = auditEvents.filter((e) => {
    if (actor !== "all" && e.actorName !== actor) return false;
    if (action !== "all" && e.action !== action) return false;
    return true;
  });

  return (
    <div className="animate-fade-in">
      <PanelHeader
        title={t.auditTitle}
        description={t.auditDesc}
        actions={
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Download className="h-3.5 w-3.5" /> {t.exportCsv}
          </Button>
        }
      />

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 p-4 border-b border-border">
          <FilterSelect value={actor} onChange={setActor}>
            <option value="all">{t.allActors}</option>
            {actors.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </FilterSelect>
          <FilterSelect value={action} onChange={setAction}>
            <option value="all">{t.allActions}</option>
            {actions.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </FilterSelect>
          <FilterSelect value="24h" onChange={() => {}}>
            <option value="24h">{t.last24h}</option>
            <option value="7d">{t.last7d}</option>
            <option value="30d">{t.last30d}</option>
          </FilterSelect>
          <span className="text-xs text-slate-400 font-medium ml-auto">{t.eventsCount(filtered.length)}</span>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 border-b border-border hover:bg-slate-50">
              <TableHead className="text-[10px] font-semibold tracking-wider py-3 px-5">{t.colTime}</TableHead>
              <TableHead className="text-[10px] font-semibold tracking-wider py-3 px-5">{t.colActor}</TableHead>
              <TableHead className="text-[10px] font-semibold tracking-wider py-3 px-5">{t.colAction}</TableHead>
              <TableHead className="text-[10px] font-semibold tracking-wider py-3 px-5">{t.colTarget}</TableHead>
              <TableHead className="text-[10px] font-semibold tracking-wider py-3 px-5">{t.colResult}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((e) => (
              <TableRow key={e.id} className="border-b border-border last:border-0 hover:bg-slate-50/60">
                <TableCell className="py-3 px-5 font-mono text-xs text-slate-500 whitespace-nowrap">{e.time}</TableCell>
                <TableCell className="py-3 px-5">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={e.actorName} color={e.actorColor} className="w-7 h-7 text-[11px]" />
                    <span className="text-sm font-semibold text-slate-800">{e.actorName}</span>
                  </div>
                </TableCell>
                <TableCell className="py-3 px-5 font-mono text-xs font-medium text-slate-700">{e.action}</TableCell>
                <TableCell className="py-3 px-5 text-xs text-slate-600">{e.target}</TableCell>
                <TableCell className="py-3 px-5">
                  <span
                    className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold",
                      e.result === "allow" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100",
                    )}
                  >
                    {e.result === "allow" ? t.resultAllow : t.resultDeny}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
