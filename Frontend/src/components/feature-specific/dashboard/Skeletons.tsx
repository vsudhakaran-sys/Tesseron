import React from "react";

export function SectionSkeleton({ title, height = 120 }: { title?: string; height?: number }) {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      {title && (
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="skeleton w-32 h-4 rounded" />
          <div className="skeleton w-16 h-3 rounded" />
        </div>
      )}
      <div className="p-5 space-y-3">
        <div className="skeleton w-full rounded" style={{ height: `${height}px` }} />
        <div className="flex gap-2">
          {[40, 60, 30, 50, 45, 55].map((w, i) => (
            <div key={i} className="skeleton h-2 rounded" style={{ width: `${w}px` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border bg-slate-50/50">
        <div className="skeleton w-36 h-4 rounded" />
        <div className="skeleton w-20 h-3 rounded" />
      </div>
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3">
            <div className="skeleton w-6 h-6 rounded-full flex-shrink-0" />
            <div className="skeleton w-24 h-3 rounded" />
            <div className="skeleton w-12 h-3 rounded ml-auto" />
            <div className="skeleton w-20 h-3 rounded" />
            <div className="skeleton w-16 h-3 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
