import { useState, useEffect, useRef, type ReactNode } from "react";
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
  fieldKey?: string;
  onSave?: (fieldKey: string, newValue: any) => void;
}

/** A single label / value row. Clickable to edit. */
export function SpecRow({ label, value, fieldKey, onSave }: Spec) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value || "");
  const inputRef = useRef<HTMLInputElement | HTMLSelectElement>(null);

  useEffect(() => {
    setTempValue(value || "");
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    setIsEditing(false);
    if (onSave && fieldKey && tempValue !== value) {
      let cleanValue: any = tempValue;
      if (fieldKey === "mileage") {
        cleanValue = parseInt(tempValue.replace(/[^\d]/g, ""), 10) || 0;
      } else if (fieldKey === "tax" || fieldKey === "privateUseRate") {
        cleanValue = tempValue.replace(/[€\s]/g, "");
      }
      onSave(fieldKey, cleanValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setTempValue(value || "");
      setIsEditing(false);
    }
  };

  const isEditable = !!(fieldKey && onSave);

  return (
    <div 
      className={cn(
        "flex items-baseline justify-between gap-4 py-1.5 border-b border-border/40 transition-colors",
        isEditable && !isEditing && "hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer rounded px-1.5 -mx-1.5"
      )}
      onClick={() => isEditable && !isEditing && setIsEditing(true)}
    >
      <span className="text-[11px] text-muted-foreground select-none">{label}</span>
      {isEditing ? (
        <div onClick={(e) => e.stopPropagation()} className="flex items-center">
          {label === "Status" ? (
            <select
              ref={inputRef as any}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className="text-[11px] h-6 bg-white dark:bg-slate-900 border border-border rounded px-1 text-foreground"
            >
              <option value="Active">Active</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Inactive">Inactive</option>
            </select>
          ) : label === "Tire Type" ? (
            <select
              ref={inputRef as any}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className="text-[11px] h-6 bg-white dark:bg-slate-900 border border-border rounded px-1 text-foreground"
            >
              <option value="Summer">Summer</option>
              <option value="Winter">Winter</option>
              <option value="All-Season">All-Season</option>
            </select>
          ) : label.toLowerCase().includes("date") ? (
            <input
              ref={inputRef as any}
              type="date"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className="text-[11px] h-6 bg-white dark:bg-slate-900 border border-border rounded px-1 text-foreground"
            />
          ) : (
            <input
              ref={inputRef as any}
              type="text"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className="text-[11px] h-6 bg-white dark:bg-slate-900 border border-border rounded px-1 text-right text-foreground w-36"
            />
          )}
        </div>
      ) : (
        <span
          className={cn(
            "text-[11px] text-right transition-colors",
            value ? "font-semibold text-foreground" : "text-muted-foreground/50",
            isEditable && "hover:text-primary"
          )}
        >
          {value || "—"}
        </span>
      )}
    </div>
  );
}

/** A vertical stack of spec rows. */
export function SpecColumn({ items, onSave }: { items: Spec[]; onSave?: (fieldKey: string, val: any) => void }) {
  return (
    <div>
      {items.map((s) => (
        <SpecRow key={s.label} {...s} onSave={onSave} />
      ))}
    </div>
  );
}

/** Two side-by-side spec columns (stacks to one column on mobile). */
export function SpecTwoColumn({ left, right, onSave }: { left: Spec[]; right: Spec[]; onSave?: (fieldKey: string, val: any) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
      <SpecColumn items={left} onSave={onSave} />
      <SpecColumn items={right} onSave={onSave} />
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
