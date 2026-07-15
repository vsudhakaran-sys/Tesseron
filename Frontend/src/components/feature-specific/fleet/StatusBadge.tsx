import { cn } from "@/utils/utils";

interface StatusBadgeProps {
  status: "active" | "inactive" | "maintenance" | "available" | "assigned";
  className?: string;
}

const statusConfig = {
  active: {
    label: "Active",
    bgColor: "bg-success/15",
    textColor: "text-success",
  },
  inactive: {
    label: "Inactive",
    bgColor: "bg-muted",
    textColor: "text-muted-foreground",
  },
  maintenance: {
    label: "Maintenance",
    bgColor: "bg-warning/15",
    textColor: "text-warning",
  },
  available: {
    label: "Available",
    bgColor: "bg-success/15",
    textColor: "text-success",
  },
  assigned: {
    label: "Assigned",
    bgColor: "bg-info/15",
    textColor: "text-info",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded",
        config.bgColor,
        config.textColor,
        className
      )}
    >
      {config.label}
    </span>
  );
}



