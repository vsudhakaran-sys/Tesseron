import * as React from "react";
import { format, parse, isValid } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/utils/utils";
import { Button } from "@/components/common/ui/button";
import { Calendar } from "@/components/common/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/common/ui/popover";

interface DatePickerProps {
  id?: string;
  /** Stored value in ISO format ("yyyy-MM-dd"). */
  value?: string;
  /** Emits the picked date back in ISO format ("yyyy-MM-dd"), or "" when cleared. */
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const STORAGE_FORMAT = "yyyy-MM-dd";
const DISPLAY_FORMAT = "dd-MM-yyyy";

export function DatePicker({
  id,
  value,
  onChange,
  placeholder = "Select date",
  className,
  disabled,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const selected = React.useMemo(() => {
    if (!value) return undefined;
    const parsed = parse(value, STORAGE_FORMAT, new Date());
    return isValid(parsed) ? parsed : undefined;
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "h-9 w-full justify-start gap-2 px-3 text-left text-xs font-normal bg-white dark:bg-slate-900 rounded-lg",
            !selected && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          {selected ? format(selected, DISPLAY_FORMAT) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="z-[120] w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          defaultMonth={selected}
          onSelect={(date) => {
            onChange?.(date ? format(date, STORAGE_FORMAT) : "");
            setOpen(false);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
