import { useState, type ReactNode } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/utils/utils";
import { Input } from "@/components/common/ui/input";
import { Button } from "@/components/common/ui/button";
import { DatePicker } from "@/components/common/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/common/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/common/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/common/ui/popover";
import { SubtleSelectItem } from "../customers/SubtleSelectItem";

/** Shared label — appends a red asterisk for important / required fields. */
export function FieldLabel({
  htmlFor,
  required = false,
  children,
}: {
  htmlFor?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="text-xs font-bold text-foreground opacity-85" htmlFor={htmlFor}>
      {children}
      {required && <span className="ml-0.5 text-destructive">*</span>}
    </label>
  );
}

/** Labelled text input — keeps the (large) fleet drawers readable and consistent. */
export function Field({
  label,
  id,
  value,
  onChange,
  placeholder,
  className = "",
  mono = false,
  type = "text",
  maxLength,
  required = false,
}: {
  label: string;
  id?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  mono?: boolean;
  type?: string;
  maxLength?: number;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      <Input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        className={`h-9 text-xs ${mono ? "font-mono" : ""} ${className}`}
      />
    </div>
  );
}

/** Labelled custom date picker (styled, replaces the native browser date control). */
export function DateField({
  label,
  id,
  value,
  onChange,
  required = false,
}: {
  label: string;
  id?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      <DatePicker id={id} value={value} onChange={onChange} />
    </div>
  );
}

export interface SelectOption {
  value: string;
  label: string;
}

/** Labelled dropdown — for fields with a fixed set of choices. */
export function SelectField({
  label,
  id,
  value,
  onChange,
  options,
  placeholder = "Select",
  required = false,
}: {
  label: string;
  id?: string;
  value: string;
  onChange: (v: string) => void;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} className="h-9 text-xs bg-white dark:bg-slate-900 rounded-lg">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="z-[110] rounded-xl border border-border shadow-lg">
          {options.map((o) => (
            <SubtleSelectItem key={o.value} value={o.value}>
              {o.label}
            </SubtleSelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

/**
 * Labelled searchable dropdown (combobox) — filter by typing, pick from the list,
 * or commit a free-typed custom value. `onPick` fires only when a value is
 * committed (selected or typed), which callers use to trigger side effects such
 * as auto-populating dependent fields.
 */
export function ComboField({
  label,
  id,
  value,
  onChange,
  options,
  placeholder = "Select or type…",
  searchPlaceholder = "Search…",
  required = false,
  disabled = false,
  onPick,
}: {
  label: string;
  id?: string;
  value: string;
  onChange: (v: string) => void;
  options: SelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  required?: boolean;
  disabled?: boolean;
  onPick?: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const commit = (v: string) => {
    onChange(v);
    onPick?.(v);
    setQuery("");
    setOpen(false);
  };

  const selectedLabel = options.find((o) => o.value === value)?.label ?? value;

  return (
    <div className="space-y-1.5">
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      <Popover
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (!o) setQuery("");
        }}
      >
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            disabled={disabled}
            className="h-9 w-full justify-between gap-2 px-3 text-left text-xs font-normal bg-white dark:bg-slate-900 rounded-lg"
          >
            <span className={cn("truncate", !value && "text-muted-foreground")}>
              {value ? selectedLabel : placeholder}
            </span>
            <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="z-[120] w-[var(--radix-popover-trigger-width)] p-0 rounded-xl border border-border shadow-lg"
        >
          <Command>
            <CommandInput
              value={query}
              onValueChange={setQuery}
              placeholder={searchPlaceholder}
              className="text-xs"
            />
            <CommandList>
              <CommandEmpty>
                {query.trim() ? (
                  <button
                    type="button"
                    onClick={() => commit(query.trim())}
                    className="mx-auto block rounded-md px-2 py-1 text-xs font-medium text-primary hover:underline"
                  >
                    Use “{query.trim()}”
                  </button>
                ) : (
                  <span className="text-xs text-muted-foreground">No options</span>
                )}
              </CommandEmpty>
              <CommandGroup>
                {options.map((o) => (
                  <CommandItem
                    key={o.value}
                    value={o.label}
                    onSelect={() => commit(o.value)}
                    className="text-xs"
                  >
                    <Check className={cn("mr-2 h-3.5 w-3.5", value === o.value ? "opacity-100" : "opacity-0")} />
                    {o.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
