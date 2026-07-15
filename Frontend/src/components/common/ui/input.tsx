import * as React from "react";

import { cn } from "@/utils/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-input bg-white dark:bg-slate-900 px-3 py-2 text-sm transition-all duration-200 placeholder:text-muted-foreground hover:border-blue-300/80 dark:hover:border-blue-800/80 focus:border-blue-400 dark:focus:border-blue-600 focus:outline-none focus-visible:outline-none focus-visible:border-blue-400 dark:focus-visible:border-blue-600 focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };



