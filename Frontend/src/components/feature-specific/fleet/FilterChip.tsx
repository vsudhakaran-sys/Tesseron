import { cn } from "@/utils/utils";
import { ChevronDown, X } from "lucide-react";

interface FilterChipProps {
  label: string;
  value?: string;
  isActive?: boolean;
  onClear?: () => void;
  onClick?: () => void;
  hasDropdown?: boolean;
  icon?: React.ReactNode;
}

export function FilterChip({
  label,
  value,
  isActive = false,
  onClear,
  onClick,
  hasDropdown = false,
  icon,
}: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-all",
        isActive
          ? "bg-primary text-primary-foreground shadow-sm"
          : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/60"
      )}
    >
      {icon && <span className="text-current">{icon}</span>}
      <span>{label}</span>
      {value && <span className="font-semibold">{value}</span>}
      {hasDropdown && <ChevronDown className="h-3.5 w-3.5 opacity-70" />}
      {isActive && onClear && (
        <X
          className="h-3.5 w-3.5 ml-0.5 opacity-70 hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            onClear();
          }}
        />
      )}
    </button>
  );
}



