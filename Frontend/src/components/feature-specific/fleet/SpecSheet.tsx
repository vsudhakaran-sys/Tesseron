import type { ReactNode } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/common/ui/input";
import { cn } from "@/utils/utils";

/* ────────────────────────────────────────────────────────────────────────────
 * Shared primitives for the read-only vehicle "spec sheet" tabs
 * (Vehicle Data / Technical Data): a find-a-field search, titled cards with a
 * blue icon heading, and divided label / value rows.
 * ──────────────────────────────────────────────────────────────────────────── */

export interface Spec {
  label: string;
  value?: string;
}

/** A single label / value row. */
export function SpecRow({ label, value }: Spec) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5 border-b border-border/40">
      <span className="text-[13px] text-muted-foreground">{label}</span>
      <span
        className={cn(
          "text-[13px] text-right",
          value ? "font-semibold text-foreground" : "text-muted-foreground/50"
        )}
      >
        {value || "—"}
      </span>
    </div>
  );
}

/** A vertical stack of spec rows. */
export function SpecColumn({ items }: { items: Spec[] }) {
  return (
    <div>
      {items.map((s) => (
        <SpecRow key={s.label} {...s} />
      ))}
    </div>
  );
}

/** Two side-by-side spec columns (stacks to one column on mobile). */
export function SpecTwoColumn({ left, right }: { left: Spec[]; right: Spec[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
      <SpecColumn items={left} />
      <SpecColumn items={right} />
    </div>
  );
}

/** A titled spec card — blue icon + heading over its rows. */
export function SpecCard({
  icon: Icon,
  title,
  children,
}: {
  icon: any;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border/40 bg-slate-50/40 dark:bg-slate-900/20 p-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-bold text-primary font-display">{title}</h3>
      </div>
      {children}
    </div>
  );
}

/** The "Find a field…" search input. */
export function FindFieldInput({
  value,
  onChange,
  placeholder = "Find a field…",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="aria-input h-10 pl-9 text-sm rounded-xl border-border/80"
      />
    </div>
  );
}

/** Empty state shown when a search matches no fields. */
export function NoFieldsFound({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <SlidersHorizontal className="h-9 w-9 text-muted-foreground/40" />
      <p className="text-sm font-semibold text-foreground">No fields match “{query}”</p>
      <p className="text-xs text-muted-foreground">Try a different search term.</p>
    </div>
  );
}

/** Filter spec rows by a case-insensitive label query. */
export function filterSpecs(items: Spec[], query: string): Spec[] {
  const q = query.trim().toLowerCase();
  return q ? items.filter((s) => s.label.toLowerCase().includes(q)) : items;
}
