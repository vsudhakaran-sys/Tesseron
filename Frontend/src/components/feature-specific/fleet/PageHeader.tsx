import { cn } from "@/utils/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8",
        className
      )}
    >
      <div className="space-y-0.5">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-3xl leading-tight">{title}</h1>
        {description && (
          <p className="text-sm font-medium text-slate-500 max-w-2xl">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}



