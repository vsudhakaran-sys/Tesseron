import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/common/ui/dialog";
import { Button } from "@/components/common/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common/ui/select";
import { Checkbox } from "@/components/common/ui/checkbox";
import { AlertCircle, Sparkles, Lock } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SuggestionEntry {
  suggestedField: string | null;
  confidence: number;
  description: string;
  fieldType: string;
  isForeignHeader: boolean;
  translatedHeader: string | null;
}

interface SheetData {
  headers: string[];
  rowCount: number;
  sampleData: (string | number | null)[][];
}

export interface PreviewResult {
  jobId: string;
  detectedLang: string;
  fileStructure: Record<string, SheetData>;
  translatedHeaderMap: Record<string, string>;
  suggestions: Record<string, Record<string, SuggestionEntry>>;
}

export interface ConfirmedMappings {
  confirmedMappings: Record<string, Record<string, { dbField: string }>>;
  translateColumns: string[];
}

interface FieldMappingModalProps {
  open: boolean;
  filename: string;
  previewResult: PreviewResult;
  onConfirm: (params: ConfirmedMappings) => void;
  onCancel: () => void;
}

// ─── Available DB Fields ──────────────────────────────────────────────────────

const FLEETSYNC_DB_FIELD_KEYS = [
  "station_name",
  "service_station_location",
  "station_number",
  "transaction_number",
  "service_country",
  "cost_group",
  "product_group",
  "product_type",
  "product_code",
  "payment_currency",
  "unit",
  "quantity",
  "price_per_unit",
  "net_base_value",
  "net_service_value",
  "net_purchase_value",
  "currency_of_service",
  "value_in_payment_currency",
  "value_in_service_country_currency",
  "vat",
  "price_per_unit_gross",
  "net_discount",
  "vehicle_number",
  "billing_date",
  "bill_number",
  "invoice_number",
  "ticket_number_dkv",
  "postcode_of_station",
  "gross_base_value",
  "kostenstelle_1",
  "kostenstelle_2",
  "abrechnungsobjekt_nummer",
  "country_of_invoice",
  "odometer",
  "gross_discount",
  "alter_terminal",
  "client_number",
  "transaction_date",
  "transaction_time",
  "distance_since_last_fill",
  "year_month",
  "energy_type",
];

// ─── Confidence Badge ─────────────────────────────────────────────────────────

function ConfidenceBadge({ value }: { value: number }) {
  if (value === 0) return <span className="text-xs text-slate-400">—</span>;
  const color =
    value >= 90 ? "bg-teal-100 text-teal-700 border-teal-200"
      : value >= 75 ? "bg-amber-100 text-amber-700 border-amber-200"
        : "bg-slate-100 text-slate-500 border-slate-200";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${color}`}>
      {value}%
    </span>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function FieldMappingModal({
  open,
  filename,
  previewResult,
  onConfirm,
  onCancel,
}: FieldMappingModalProps) {
  const { t } = useLanguage();
  const { fileStructure, suggestions, detectedLang } = previewResult;

  // Initialize local mappings from suggestions
  const [localMappings, setLocalMappings] = useState<Record<string, Record<string, string>>>(() => {
    const init: Record<string, Record<string, string>> = {};
    for (const [sheetName, sheetSuggestions] of Object.entries(suggestions)) {
      init[sheetName] = {};
      for (const [header, s] of Object.entries(sheetSuggestions)) {
        init[sheetName][header] = s.suggestedField || "__none__";
      }
    }
    return init;
  });

  // Pre-check translate for foreign-language headers
  const [translateChecked, setTranslateChecked] = useState<Set<string>>(() => {
    const init = new Set<string>();
    for (const sheetSuggestions of Object.values(suggestions)) {
      for (const [header, s] of Object.entries(sheetSuggestions)) {
        if (s.isForeignHeader) init.add(header);
      }
    }
    return init;
  });

  const toggleTranslate = (header: string) => {
    setTranslateChecked(prev => {
      const next = new Set(prev);
      next.has(header) ? next.delete(header) : next.add(header);
      return next;
    });
  };

  // Collect all headers across all sheets for global select-all | params : none | returns : string[]
  const allHeaders = Object.values(fileStructure).flatMap(s => s.headers);
  // Check if all translate checkboxes are currently checked | params : none | returns : boolean
  const allTranslateChecked = allHeaders.length > 0 && allHeaders.every(h => translateChecked.has(h));

  // Toggle all translate checkboxes globally | params : none | returns : void
  const toggleAllTranslate = () => {
    setTranslateChecked(() => {
      if (allTranslateChecked) {
        return new Set<string>();
      } else {
        return new Set<string>(allHeaders);
      }
    });
  };

  const setMapping = (sheetName: string, header: string, dbField: string) => {
    setLocalMappings(prev => ({
      ...prev,
      [sheetName]: { ...prev[sheetName], [header]: dbField },
    }));
  };

  const handleConfirm = () => {
    const confirmedMappings: Record<string, Record<string, { dbField: string }>> = {};
    for (const [sheetName, sheetMappings] of Object.entries(localMappings)) {
      confirmedMappings[sheetName] = {};
      for (const [header, dbField] of Object.entries(sheetMappings)) {
        if (dbField && dbField !== "__none__") confirmedMappings[sheetName][header] = { dbField };
      }
    }
    onConfirm({ confirmedMappings, translateColumns: Array.from(translateChecked) });
  };

  const langLabel = t.languages[detectedLang as keyof typeof t.languages] || detectedLang.toUpperCase();
  const totalMapped = Object.values(localMappings).flatMap(Object.values).filter(m => m && m !== "__none__").length;
  const totalHeaders = Object.values(fileStructure).flatMap(s => s.headers).length;

  const dbFields = [
    { value: "__none__", label: t.fieldMapping.ignoreColumn, description: "" },
    ...FLEETSYNC_DB_FIELD_KEYS.map(key => ({
      value: key,
      label: t.dbFields[key as keyof typeof t.dbFields] || key,
      description: t.dbFieldDescriptions[key as keyof typeof t.dbFieldDescriptions] || "",
    })),
  ];

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onCancel(); }}>
      <DialogContent
        className="max-w-[98vw] sm:max-w-[95vw] xl:max-w-[1150px] w-full p-0 gap-0 rounded-2xl overflow-hidden"
        aria-describedby={undefined}
        onInteractOutside={e => e.preventDefault()}
      >
        {/* Header bar */}
        <DialogHeader className="flex-col sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 pr-12 sm:pr-14 py-3 sm:py-4 border-b border-slate-100 bg-white gap-1 sm:gap-0">
          <DialogTitle className="text-base sm:text-lg font-bold text-slate-900">
            {t.fieldMapping.title}
          </DialogTitle>
          <span className="text-xs sm:text-sm font-medium text-slate-400 truncate max-w-[160px] sm:max-w-[260px]" title={filename}>
            {filename}
          </span>
        </DialogHeader>

        <div className="flex flex-col max-h-[80dvh] sm:max-h-[85dvh]">
          {/* Info banner */}
          <div className="mx-3 sm:mx-6 mt-3 sm:mt-4 flex items-start gap-3 rounded-xl bg-blue-50 border border-blue-200 px-3 sm:px-4 py-3">
            <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs sm:text-sm text-blue-700 leading-relaxed">
              {t.fieldMapping.infoText.replace("{lang}", langLabel)}
            </p>
          </div>

          {/* Sheets */}
          <div className="overflow-y-auto flex-1 px-3 sm:px-6 pb-4 sm:pb-6 mt-3 sm:mt-4 space-y-6">
            {Object.entries(fileStructure).map(([sheetName, sheetData]) => {
              const sheetSuggestions = suggestions[sheetName] || {};
              const totalRows = sheetData.rowCount;

              return (
                <div key={sheetName}>
                  {/* Sheet info row */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">
                      {sheetName.replace(/([a-zA-Z]+)(\d+)/, '$1 $2')}
                    </span>
                  </div>

                  {/* Mapping table (Desktop) */}
                  <div className="hidden sm:block rounded-xl border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead className="bg-slate-50 border-b border-slate-200">
                          <tr>
                            <th className="px-4 py-3 text-xs font-bold text-slate-600 w-[18%]">{t.fieldMapping.yourColumn}</th>
                            <th className="px-4 py-3 text-xs font-bold text-slate-600 w-[10%] text-center">
                              <div className="flex items-center justify-center gap-2">
                                <span>{t.fieldMapping.translate}</span>
                                <Checkbox
                                  checked={allTranslateChecked}
                                  onCheckedChange={toggleAllTranslate}
                                  className="border-slate-300 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                                />
                              </div>
                            </th>
                            <th className="px-4 py-3 text-xs font-bold text-slate-600 w-[15%]">{t.fieldMapping.sampleData}</th>
                            <th className="px-4 py-3 text-xs font-bold text-slate-600 w-[22%]">{t.fieldMapping.availableDataItem}</th>
                            <th className="px-4 py-3 text-xs font-bold text-slate-600 w-[10%] text-center">{t.fieldMapping.confidence}</th>
                            <th className="px-4 py-3 text-xs font-bold text-slate-600 hidden md:table-cell">{t.fieldMapping.description}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {sheetData.headers.map((header, headerIdx) => {
                            const suggestion = sheetSuggestions[header];
                            const currentDbField = localMappings[sheetName]?.[header] ?? "__none__";
                            const isTranslateChecked = translateChecked.has(header);
                            const confidence = suggestion?.confidence ?? 0;
                            const isExactMatch = confidence === 100;
                            const isForeign = suggestion?.isForeignHeader ?? false;

                            // Sample values for this column
                            const samples = sheetData.sampleData
                              .map(row => row[headerIdx])
                              .filter(v => v !== null && v !== undefined && v !== "")
                              .slice(0, 1)
                              .map(String);

                            // Description for currently selected field
                            const selectedFieldDef = dbFields.find(f => f.value === currentDbField);
                            const description = selectedFieldDef?.description || suggestion?.description || "";

                            return (
                              <tr key={header} className="hover:bg-slate-50/60 transition-colors">
                                {/* Your Column */}
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-semibold text-xs text-slate-800 break-all">{header}</span>
                                    {isExactMatch && (
                                      <span title="Exact match — high confidence">
                                        <Lock className="h-3 w-3 text-teal-500 flex-shrink-0" />
                                      </span>
                                    )}
                                  </div>
                                  {suggestion?.translatedHeader && (
                                    <span className="text-xs text-slate-400 mt-0.5 block">
                                      → {suggestion.translatedHeader}
                                    </span>
                                  )}
                                </td>

                                {/* Translate? */}
                                <td className="px-4 py-3 text-center">
                                  <div className="flex flex-col items-center gap-1">
                                    <Checkbox
                                      checked={isTranslateChecked}
                                      onCheckedChange={() => toggleTranslate(header)}
                                      className="border-slate-300 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                                    />

                                  </div>
                                </td>

                                {/* Sample Data */}
                                <td className="px-4 py-3">
                                  <div className="space-y-0.5">
                                    {samples.length > 0
                                      ? samples.map((s, i) => (
                                        <div key={i} className="text-xs text-slate-600 truncate max-w-[140px]" title={s}>
                                          {s}
                                        </div>
                                      ))
                                      : <span className="text-xs text-slate-400">—</span>
                                    }
                                  </div>
                                </td>

                                {/* Available Data Item (dropdown) */}
                                <td className="px-4 py-3">
                                  <Select
                                    value={currentDbField}
                                    onValueChange={val => setMapping(sheetName, header, val)}
                                  >
                                    <SelectTrigger className="h-8 text-xs rounded-lg border-slate-200 bg-white">
                                      <SelectValue placeholder={t.fieldMapping.selectField} />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-72 rounded-xl">
                                      {dbFields.map(field => (
                                        <SelectItem key={field.value} value={field.value} className="text-[12px]">
                                          {field.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </td>

                                {/* Confidence */}
                                <td className="px-4 py-3 text-center">
                                  <ConfidenceBadge value={confidence} />
                                </td>

                                {/* Description */}
                                <td className="px-4 py-3 hidden md:table-cell">
                                  <span className="text-xs text-slate-500 leading-relaxed">{description}</span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Mapping Cards (Mobile) */}
                  <div className="sm:hidden space-y-3">
                    {/* Select All Translate toggle for mobile */}
                    <div className="flex items-center gap-2 rounded-lg bg-slate-50 border border-slate-200 px-3 py-2">
                      <Checkbox
                        checked={allTranslateChecked}
                        onCheckedChange={toggleAllTranslate}
                        className="h-4 w-4 border-slate-300 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                      />
                      <span className="text-xs font-semibold text-slate-600">{t.fieldMapping.translate} — Select All</span>
                    </div>
                    {sheetData.headers.map((header, headerIdx) => {
                      const suggestion = sheetSuggestions[header];
                      const currentDbField = localMappings[sheetName]?.[header] ?? "__none__";
                      const isTranslateChecked = translateChecked.has(header);
                      const confidence = suggestion?.confidence ?? 0;
                      const isForeign = suggestion?.isForeignHeader ?? false;

                      const samples = sheetData.sampleData
                        .map(row => row[headerIdx])
                        .filter(v => v !== null && v !== undefined && v !== "")
                        .slice(0, 1)
                        .map(String);

                      return (
                        <div key={header} className="rounded-xl border border-slate-200 bg-white p-4 space-y-4 shadow-sm">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                {t.fieldMapping.yourColumn}
                              </label>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-sm text-slate-900 break-all">{header}</span>
                                {confidence === 100 && <Lock className="h-3 w-3 text-teal-500 flex-shrink-0" />}
                              </div>
                              {suggestion?.translatedHeader && (
                                <span className="text-xs text-slate-400 mt-0.5 block italic">
                                  → {suggestion.translatedHeader}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col items-center gap-1.5 pt-1">
                              <label className="text-xs font-bold text-slate-400 uppercase">{t.fieldMapping.translate}</label>
                              <Checkbox
                                checked={isTranslateChecked}
                                onCheckedChange={() => toggleTranslate(header)}
                                className="h-5 w-5 border-slate-300 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                              />

                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                {t.fieldMapping.sampleData}
                              </label>
                              <div className="space-y-1">
                                {samples.length > 0 ? (
                                  samples.map((s, i) => (
                                    <div key={i} className="text-xs text-slate-600 truncate bg-slate-50 px-2 py-0.5 rounded border border-slate-100" title={s}>
                                      {s}
                                    </div>
                                  ))
                                ) : (
                                  <span className="text-xs text-slate-400">—</span>
                                )}
                              </div>
                            </div>
                            <div>
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                {t.fieldMapping.confidence}
                              </label>
                              <ConfidenceBadge value={confidence} />
                            </div>
                          </div>

                          <div className="pt-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                              {t.fieldMapping.availableDataItem}
                            </label>
                            <Select
                              value={currentDbField}
                              onValueChange={val => setMapping(sheetName, header, val)}
                            >
                              <SelectTrigger className="h-10 text-sm rounded-xl border-slate-200 bg-slate-50 font-medium">
                                <SelectValue placeholder={t.fieldMapping.selectField} />
                              </SelectTrigger>
                              <SelectContent className="max-h-72 rounded-xl">
                                {dbFields.map(field => (
                                  <SelectItem key={field.value} value={field.value} className="text-sm py-2.5">
                                    {field.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 px-4 sm:px-6 py-4 border-t border-slate-100 bg-white">
            <Button
              variant="ghost"
              onClick={onCancel}
              className="w-full sm:w-auto text-slate-600 hover:text-slate-900 font-semibold text-sm"
            >
              {t.fieldMapping.cancel}
            </Button>
            <Button
              onClick={handleConfirm}
              className="w-full sm:w-auto text-white font-semibold px-6 rounded-xl shadow-md text-sm"
              style={{ backgroundColor: '#1A28EA', boxShadow: '0 4px 12px rgba(26,40,234,0.25)' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1620d4')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1A28EA')}
            >
              {t.fieldMapping.processFile}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
