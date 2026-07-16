import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check } from "lucide-react";
import { cn } from "@/utils/utils";

// A muted select item with a trailing check indicator, used across the wizard.
export const SubtleSelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center justify-between rounded-lg py-2 px-3 text-xs outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-slate-50 dark:focus:bg-slate-900 focus:text-foreground text-muted-foreground hover:text-foreground transition-colors duration-150",
      className
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    <span className="flex h-3.5 w-3.5 items-center justify-center ml-2">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-3.5 w-3.5 text-primary stroke-[3]" />
      </SelectPrimitive.ItemIndicator>
    </span>
  </SelectPrimitive.Item>
));
SubtleSelectItem.displayName = "SubtleSelectItem";
