import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/services/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/common/ui/dialog";
import { Button } from "@/components/common/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

import { useNavigate } from "react-router-dom";

interface DataPreviewSheetProps {
  open: boolean;
  uploadId: number | null;
  filename?: string;
  onClose: () => void;
}

const PAGE_SIZE = 50;

// Columns to show first (highest priority)
const PRIORITY_COLUMNS = [
  "vehicle_number",
  "transaction_date",
  "transaction_time",
  "station_name",
  "service_country",
  "quantity",
  "unit",
  "price_per_unit",
  "net_base_value",
  "vat",
  "payment_currency",
  "energy_type",
];

function toLabel(field: string): string {
  return field
    .replace(/_/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}

function formatValue(val: unknown): string {
  if (val === null || val === undefined) return "—";
  if (val instanceof Date) return val.toLocaleDateString();
  const str = String(val);
  if (str === "") return "—";
  // Trim long strings
  return str.length > 40 ? str.slice(0, 38) + "…" : str;
}

export default function DataPreviewSheet({
  open,
  uploadId,
  filename,
  onClose,
}: DataPreviewSheetProps) {
  const { t } = useLanguage();
  const [page, setPage] = useState(0);
  const navigate = useNavigate();

  const { data: records = [], isLoading, isError } = useQuery<Record<string, unknown>[]>({
    queryKey: ["fleet-preview", uploadId],
    queryFn: () => apiGet(`/fleetsync/data/${uploadId}`),
    enabled: open && uploadId !== null,
  });

  // Determine visible columns: internal fields excluded, priority first
  const excludedCols = new Set(["id", "upload_id", "created_at"]);
  const allCols = records.length > 0
    ? Object.keys(records[0]).filter(k => !excludedCols.has(k))
    : [];

  const sortedCols = [
    ...PRIORITY_COLUMNS.filter(c => allCols.includes(c)),
    ...allCols.filter(c => !PRIORITY_COLUMNS.includes(c)),
  ];

  // Only show columns that have at least one non-null value
  const activeCols = sortedCols.filter(col =>
    records.some(r => r[col] !== null && r[col] !== undefined && r[col] !== "")
  );

  const totalPages = Math.ceil(records.length / PAGE_SIZE);
  const pageRecords = records.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onClose(); }}>
      <DialogContent
        className="max-w-[100vw] sm:max-w-[95vw] xl:max-w-[1300px] w-full max-h-[100dvh] sm:max-h-[90dvh] p-0 gap-0 rounded-none sm:rounded-2xl overflow-hidden flex flex-col"
        aria-describedby={undefined}
        onInteractOutside={e => e.preventDefault()}
      >
        {/* Header */}
        <DialogHeader className="flex-row items-center justify-between px-6 py-4 border-b border-slate-100 bg-white shrink-0">
          <div>
            <DialogTitle className="text-lg font-bold text-slate-900">
              {t.dataPreview.title}
            </DialogTitle>
            {filename && (
              <p className="text-xs text-slate-500 mt-0.5 truncate max-w-sm">{filename}</p>
            )}
          </div>
          <div className="flex items-center gap-3 mr-6">
            {records.length > 0 && (
              <span className="text-sm font-medium text-slate-500">
                {records.length.toLocaleString()} {t.dataPreview.records}
              </span>
            )}
          </div>
        </DialogHeader>

        {/* Body */}
        <div className="flex-1 flex flex-col min-h-0 bg-white">
          {isLoading && (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
              {t.dataPreview.loading}
            </div>
          )}

          {isError && (
            <div className="flex-1 flex items-center justify-center text-red-500 text-sm">
              {t.dataPreview.error}
            </div>
          )}

          {!isLoading && !isError && records.length === 0 && (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
              {t.dataPreview.noRecords}
            </div>
          )}

          {!isLoading && !isError && records.length > 0 && (
            <>
              {/* Table Container */}
              <div className="flex-1 overflow-auto border-b border-slate-100">
                <table className="w-full text-left border-collapse" style={{ minWidth: `${activeCols.length * 140}px` }}>
                  <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 text-xs font-bold text-slate-500 w-12 bg-slate-50">#</th>
                      {activeCols.map(col => (
                        <th key={col} className="px-4 py-3 text-xs font-bold text-slate-600 whitespace-nowrap bg-slate-50">
                          {t.dbFields[col as keyof typeof t.dbFields] || toLabel(col)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {pageRecords.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-4 py-2.5 text-xs text-slate-400 font-medium whitespace-nowrap">
                          {page * PAGE_SIZE + idx + 1}
                        </td>
                        {activeCols.map(col => (
                          <td key={col} className="px-4 py-2.5 text-xs text-slate-700 whitespace-nowrap">
                            {formatValue(row[col])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-slate-100 shrink-0">
                  <span className="text-sm text-slate-500">
                    {t.dataPreview.pageOf.replace("{page}", String(page + 1)).replace("{total}", String(totalPages))}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-lg"
                      onClick={() => setPage(p => Math.max(0, p - 1))}
                      disabled={page === 0}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-lg"
                      onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                      disabled={page === totalPages - 1}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer with OK Button */}
        {!isLoading && !isError && records.length > 0 && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0 rounded-b-2xl">
            <Button
              onClick={() => {
                onClose();
                navigate("/");
              }}
              className="h-10 px-8 text-sm font-semibold rounded-xl bg-primary text-white hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
            >
              {t.dataPreview.done}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
