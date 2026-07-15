import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UploadCloud, Plus, Globe, Calendar, Search, Eye, Download } from "lucide-react";
import { Button } from "@/components/common/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common/ui/select";
import ReactCountryFlag from "react-country-flag";
import FieldMappingModal, {
  type PreviewResult,
  type ConfirmedMappings,
} from "@/components/feature-specific/fleetSync/FieldMappingModal";
import DataPreviewSheet from "@/components/feature-specific/fleetSync/DataPreviewSheet";
import { apiGet, apiPost } from "@/services/api";
import { addNotification } from "@/hooks/useNotifications";

// ─── Types ────────────────────────────────────────────────────────────────────

interface UploadHistoryRecord {
  id: number;
  filename: string;
  status: string;
  records: number;
  size_mb: number;
  source: string;
  uploader_name: string;
  uploader_email: string;
  created_at: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function FleetSync() {
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("manual");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");

  // ── Upload / analysis state ──────────────────────────────────────────────
  const [selectedFileName, setSelectedFileName] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("auto");
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadDone, setUploadDone] = useState(false);
  const [currentPhase, setCurrentPhase] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const sseRef = useRef<EventSource | null>(null);

  // ── Modal / preview state ────────────────────────────────────────────────
  const [previewResult, setPreviewResult] = useState<PreviewResult | null>(null);
  const [previewUploadId, setPreviewUploadId] = useState<number | null>(null);
  const [dataPreviewOpen, setDataPreviewOpen] = useState(false);

  const tabs = [
    { id: "manual", label: t.fleetSync.manualUpload },
    { id: "history", label: t.fleetSync.history },
  ];

  // ── History query ────────────────────────────────────────────────────────
  const { data: historyData = [] } = useQuery<UploadHistoryRecord[]>({
    queryKey: ["fleet-history"],
    queryFn: () => apiGet("/fleetsync/history"),
    refetchOnWindowFocus: false,
  });

  const filteredHistory = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return historyData.filter(row => {
      const matchesSearch =
        !q ||
        row.filename.toLowerCase().includes(q) ||
        new Date(row.created_at).toLocaleString().toLowerCase().includes(q) ||
        row.uploader_name.toLowerCase().includes(q) ||
        row.uploader_email.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === "all" || row.status.toLowerCase() === statusFilter;
      const matchesSource =
        sourceFilter === "all" || row.source.toLowerCase() === sourceFilter;
      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [historyData, searchQuery, statusFilter, sourceFilter]);

  const resetHistoryFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSourceFilter("all");
  };

  // ── Upload complete: open preview after animation ─────────────────────────
  useEffect(() => {
    if (uploadDone && previewUploadId !== null) {
      const t = setTimeout(() => {
        setUploadProgress(null);
        setUploadDone(false);
        setDataPreviewOpen(true);
      }, 2500);
      return () => clearTimeout(t);
    }
  }, [uploadDone, previewUploadId]);

  // ── Cleanup SSE on unmount ────────────────────────────────────────────────
  useEffect(() => {
    return () => { sseRef.current?.close(); };
  }, []);

  // ── File picker ──────────────────────────────────────────────────────────
  const openFilePicker = () => fileInputRef.current?.click();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFileName(file?.name ?? "");
    // Reset previous preview if a new file is selected
    setPreviewResult(null);
    setUploadProgress(null);
    setUploadDone(false);
  };

  // ── Step 1: Analyze (POST /preview) ──────────────────────────────────────
  const [analysisProgress, setAnalysisProgress] = useState<number | null>(null);

  const handleAnalyze = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file || analyzing) return;

    setAnalyzing(true);
    setAnalysisProgress(0);
    
    // Simulate initial progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev === null) return null;
        return Math.min(prev + Math.floor(Math.random() * 15) + 5, 90);
      });
    }, 400);

    const formData = new FormData();
    formData.append("file", file);

    // Map country code to language code for backend
    const langMap: Record<string, string> = { de: "de", nl: "nl", ja: "ja", tr: "tr" };
    if (selectedLanguage !== "auto" && langMap[selectedLanguage]) {
      formData.append("language", langMap[selectedLanguage]);
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/fleetsync/preview`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || "Preview failed");
      }
      const data: PreviewResult = await res.json();
      setAnalysisProgress(100);
      setTimeout(() => {
        setPreviewResult(data);
        setAnalysisProgress(null);
      }, 400);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      alert(`Failed to analyze file: ${message}`);
      setAnalysisProgress(null);
    } finally {
      clearInterval(progressInterval);
      setAnalyzing(false);
    }
  };

  // ── Step 2: Process (POST /process + SSE) ────────────────────────────────
  const handleProcessFile = async ({ confirmedMappings, translateColumns }: ConfirmedMappings) => {
    if (!previewResult) return;

    // Capture filename now — selectedFileName (React state) could change
    // if the user picks a new file while this upload is still processing
    const filenameAtStart = selectedFileName;

    const jobId = previewResult.jobId;
    const detectedLang = previewResult.detectedLang;

    // Close mapping modal
    setPreviewResult(null);

    // Start progress bar
    setUploadProgress(0);
    setUploadDone(false);
    setCurrentPhase("reading");

    try {
      // Connect to SSE before triggering processing to avoid race condition | params : jobId | returns : void
      const sse = new EventSource(`${import.meta.env.VITE_API_URL}/fleetsync/progress/${jobId}`);
      sseRef.current = sse;

      // Wait for SSE "connected" heartbeat before firing the process request | params : sse | returns : Promise<void>
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => { sse.close(); reject(new Error("SSE connection timeout")); }, 5000);

        sse.onmessage = (event) => {
          const data = JSON.parse(event.data);

          if (data.phase === "connected") {
            clearTimeout(timeout);
            resolve();
            return;
          }

          if (data.phase) setCurrentPhase(data.phase);
          setUploadProgress(Math.min(data.progress ?? 0, 100));

          if (data.phase === "complete") {
            sse.close();
            setUploadDone(true);
            setCurrentPhase("complete");
            setPreviewUploadId(data.uploadId ?? null);
            queryClient.invalidateQueries({ queryKey: ["fleet-history"] });
            addNotification({
              title: "FleetSync Complete",
              description: `${filenameAtStart} processed successfully`,
            });
          } else if (data.phase === "error") {
            sse.close();
            setUploadProgress(null);
            setCurrentPhase("");
            alert(`Processing failed: ${data.error}`);
          }
        };

        sse.onerror = () => {
          clearTimeout(timeout);
          sse.close();
          reject(new Error("SSE connection failed"));
        };
      });

      // SSE confirmed — now trigger backend processing | params : jobId, mappings | returns : void
      await apiPost("/fleetsync/process", {
        jobId,
        mappings: confirmedMappings,
        translateColumns,
        detectedLang,
        uploaderName: "User",
        uploaderEmail: "",
      });
    } catch (err: unknown) {
      sseRef.current?.close();
      setUploadProgress(null);
      const message = err instanceof Error ? err.message : "Unknown error";
      alert(`Processing failed: ${message}`);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // JSX
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="w-full space-y-4 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t.fleetSync.title}</h1>
        <p className="text-slate-500 mt-1">{t.fleetSync.description}</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 text-sm font-semibold transition-colors relative ${
              activeTab === tab.id ? "text-primary" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* ── Manual Upload Tab ─────────────────────────────────────────────── */}
      {activeTab === "manual" && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Selectors Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">{t.fleetSync.selectCountry}</label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-full h-10 rounded-xl border-slate-200 bg-white shadow-sm font-medium">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent className="rounded-xl shadow-lg border-slate-200">
                  <SelectItem value="auto">{t.fleetSync.autoDetect}</SelectItem>
                  <SelectItem value="de">
                    <div className="flex items-center gap-2">
                      <ReactCountryFlag countryCode="DE" svg style={{ width: "1.2em", height: "1.2em" }} />
                      Germany
                    </div>
                  </SelectItem>
                  <SelectItem value="nl">
                    <div className="flex items-center gap-2">
                      <ReactCountryFlag countryCode="NL" svg style={{ width: "1.2em", height: "1.2em" }} />
                      Netherlands
                    </div>
                  </SelectItem>
                  <SelectItem value="ja">
                    <div className="flex items-center gap-2">
                      <ReactCountryFlag countryCode="JP" svg style={{ width: "1.2em", height: "1.2em" }} />
                      Japan
                    </div>
                  </SelectItem>
                  <SelectItem value="tr">
                    <div className="flex items-center gap-2">
                      <ReactCountryFlag countryCode="TR" svg style={{ width: "1.2em", height: "1.2em" }} />
                      Turkey
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">{t.fleetSync.fileLanguage}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500 z-10">
                  <Globe className="h-4 w-4" />
                </div>
                <Select value="auto" disabled>
                  <SelectTrigger className="w-full h-10 pl-9 rounded-xl border-slate-200 bg-slate-50/50 shadow-sm font-medium text-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl shadow-lg border-slate-200">
                    <SelectItem value="auto">{t.fleetSync.autoDetect}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">{t.fleetSync.dataType}</label>
              <Select disabled>
                <SelectTrigger className="w-full h-10 rounded-xl border-slate-200 bg-white shadow-sm font-medium opacity-50">
                  <SelectValue placeholder="Fuel Card Data" />
                </SelectTrigger>
                <SelectContent />
              </Select>
            </div>
          </div>

          {/* Upload Area */}
          <div
            className="w-full bg-[#f1f5f9] border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all duration-200 hover:bg-slate-200/50 cursor-pointer"
            onClick={openFilePicker}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openFilePicker(); }
            }}
            role="button"
            tabIndex={0}
          >
            <UploadCloud className="h-12 w-12 text-slate-400 mb-3" strokeWidth={1.5} />
            <h3 className="text-lg font-bold text-slate-900 mb-1.5">{t.fleetSync.dragDrop}</h3>
            <p className="text-xs font-medium text-slate-600 mb-5">
              {t.fleetSync.supportedFormats}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.json,.csv"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              type="button"
              onClick={(e) => { e.stopPropagation(); openFilePicker(); }}
              className="rounded-xl px-5 h-10 bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20 text-sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t.fleetSync.chooseFile}
            </Button>
            <p className="text-xs text-slate-500 mt-3 font-medium">
              {selectedFileName || t.fleetSync.noFileChosen}
            </p>
          </div>

          {/* Analyze Button */}
          <Button
            onClick={handleAnalyze}
            disabled={!selectedFileName || analyzing || uploadProgress !== null || analysisProgress !== null}
            className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-sm shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {analyzing ? t.fleetSync.analyzing : t.fleetSync.analyzeMap}
          </Button>

          {analysisProgress !== null && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    <span className="flex items-center gap-1">
                      Analyzing file layout
                      <span className="jumping-dots text-[#1A28EA]">
                        <span>.</span><span>.</span><span>.</span>
                      </span>
                    </span>
                  </p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5 truncate max-w-xs">
                    {selectedFileName}
                  </p>
                </div>
                <span className="text-xl font-extrabold tabular-nums text-primary">
                  {Math.round(analysisProgress)}%
                </span>
              </div>
              <div className="relative h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 transition-all duration-300 ease-out bg-primary"
                  style={{ width: `${analysisProgress}%` }}
                />
              </div>
            </div>
          )}

          {uploadProgress !== null && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    {uploadDone ? t.fleetSync.uploadComplete : (
                      <span className="flex items-center gap-1">
                        {currentPhase === "reading" && "Reading file"}
                        {currentPhase === "mapping" && "Analyzing structure"}
                        {currentPhase === "translating" && "Translating fields"}
                        {currentPhase === "inserting" && "Storing data"}
                        {!currentPhase && t.fleetSync.processingFile}
                        {!uploadDone && (
                          <span className="jumping-dots text-[#1A28EA]">
                            <span>.</span><span>.</span><span>.</span>
                          </span>
                        )}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5 truncate max-w-xs">
                    {selectedFileName}
                  </p>
                </div>
                <span className={`text-xl font-extrabold tabular-nums ${uploadDone ? "text-[#1ca673]" : "text-primary"}`}>
                  {Math.round(Math.min(uploadProgress, 100))}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="relative h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`absolute inset-y-0 left-0 transition-all duration-300 ease-out ${uploadDone ? "bg-[#1ca673]" : "bg-primary"}`}
                  style={{ width: `${Math.min(uploadProgress, 100)}%` }}
                />
              </div>

              {uploadDone && (
                <p className="mt-4 text-center text-xs font-semibold text-[#1ca673]">
                  {t.fleetSync.openingPreview}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── History Tab ───────────────────────────────────────────────────── */}
      {activeTab === "history" && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-6 w-6 text-slate-800 font-bold" />
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{t.fleetSync.uploadHistory}</h2>
            </div>
            <p className="text-xs font-medium text-slate-600">{t.fleetSync.manageUploads}</p>
          </div>

          <div className="p-4 sm:p-5 space-y-5">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-5">
              <div className="relative flex-1 w-full sm:min-w-[280px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.fleetSync.search}
                  className="w-full pl-10 pr-4 h-12 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium text-slate-800 placeholder:text-slate-400"
                />
              </div>

              {/* Filters & Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full xl:w-auto flex-shrink-0">
                {/* Status */}
                <div className="relative w-full sm:w-[160px] xl:w-[180px]">
                <label className="absolute -top-[9px] left-3 px-1.5 bg-white text-xs font-semibold text-slate-500 z-10">{t.fleetSync.status}</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full h-12 border-slate-300 rounded-xl relative focus:ring-2 focus:ring-primary">
                    <SelectValue placeholder={t.fleetSync.allStatuses} />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">{t.fleetSync.allStatuses}</SelectItem>
                    <SelectItem value="success">{t.fleetSync.success}</SelectItem>
                    <SelectItem value="failed">{t.fleetSync.failed}</SelectItem>
                    <SelectItem value="processing">{t.fleetSync.processing}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

                {/* Source */}
                <div className="relative w-full sm:w-[160px] xl:w-[180px]">
                <label className="absolute -top-[9px] left-3 px-1.5 bg-white text-xs font-semibold text-slate-500 z-10">{t.fleetSync.source}</label>
                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger className="w-full h-12 border-slate-300 rounded-xl relative focus:ring-2 focus:ring-primary">
                    <SelectValue placeholder={t.fleetSync.allSources} />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">{t.fleetSync.allSources}</SelectItem>
                    <SelectItem value="manual">{t.fleetSync.manual}</SelectItem>
                    <SelectItem value="ftp">{t.fleetSync.ftp}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

                <div className="w-full sm:w-auto flex-shrink-0">
                  <Button
                    variant="outline"
                    onClick={resetHistoryFilters}
                    className="w-full sm:w-auto h-12 px-8 rounded-xl font-bold text-[#1a237e] border-slate-300 hover:bg-slate-50 uppercase tracking-widest text-xs"
                  >
                    {t.fleetSync.reset}
                  </Button>
                </div>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="space-y-3 xl:hidden">
              {filteredHistory.length === 0 && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center text-sm font-medium text-slate-600">
                  {t.fleetSync.noUploads}
                </div>
              )}
              {filteredHistory.map((row) => (
                <div key={row.id} className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-bold text-sm text-slate-800 break-all">{row.filename}</p>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-[6px] text-xs font-bold whitespace-nowrap ${row.status === "Success" ? "bg-[#1ca673] text-white" : "bg-[#cd2026] text-white"}`}>
                      {row.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                    <span className="text-slate-500">{t.fleetSync.uploadDate}</span>
                    <span className="font-medium text-slate-800 text-right">{new Date(row.created_at).toLocaleString()}</span>
                    <span className="text-slate-500">{t.fleetSync.records}</span>
                    <span className="font-semibold text-slate-800 text-right">{row.records}</span>
                    <span className="text-slate-500">{t.fleetSync.size}</span>
                    <span className="font-medium text-slate-700 text-right">{Number(row.size_mb).toFixed(2)} MB</span>
                    <span className="text-slate-500">{t.fleetSync.source}</span>
                    <span className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border border-slate-300 bg-white text-slate-700">{row.source}</span>
                    </span>
                    <span className="text-slate-500">{t.fleetSync.uploadedBy}</span>
                    <span className="text-right">
                      <span className="block font-semibold text-slate-900">{row.uploader_name || "—"}</span>
                      <span className="text-slate-500">{row.uploader_email}</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-end gap-4 text-slate-500 pt-1">
                    <Eye
                      className="h-[18px] w-[18px] hover:text-primary cursor-pointer transition-colors"
                      onClick={() => { setPreviewUploadId(row.id); setDataPreviewOpen(true); }}
                    />
                    <Download
                      className="h-[18px] w-[18px] hover:text-primary cursor-pointer transition-colors"
                      onClick={() => window.open(`${import.meta.env.VITE_API_URL}/fleetsync/download/${row.id}`, "_blank")}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden xl:block rounded-xl border border-slate-200 overflow-x-auto bg-slate-50/30 min-h-[360px]">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <colgroup>
                  <col className="w-[22%]" />
                  <col className="w-[18%]" />
                  <col className="w-[10%]" />
                  <col className="w-[8%]" />
                  <col className="w-[8%]" />
                  <col className="w-[10%]" />
                  <col className="w-[14%]" />
                  <col className="w-[10%]" />
                </colgroup>
                <thead className="bg-[#f8f9fc] text-slate-900 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-bold text-xs">{t.fleetSync.fileName}</th>
                    <th className="px-6 py-4 font-bold text-xs">{t.fleetSync.uploadDate}</th>
                    <th className="px-6 py-4 font-bold text-xs">{t.fleetSync.status}</th>
                    <th className="px-6 py-4 font-bold text-xs">{t.fleetSync.records}</th>
                    <th className="px-6 py-4 font-bold text-xs">{t.fleetSync.size}</th>
                    <th className="px-6 py-4 font-bold text-xs">{t.fleetSync.source}</th>
                    <th className="px-6 py-4 font-bold text-xs">{t.fleetSync.uploadedBy}</th>
                    <th className="px-6 py-4 font-bold text-xs text-center">{t.fleetSync.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white shadow-sm">
                  {filteredHistory.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="font-bold text-sm text-slate-800 tracking-tight">{row.filename}</span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-800 font-medium whitespace-nowrap tracking-tight">
                        {new Date(row.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-[6px] text-xs font-bold text-white tracking-wide ${row.status === "Success" ? "bg-[#1ca673]" : row.status === "Processing" ? "bg-amber-500" : "bg-[#cd2026]"}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-800 font-bold">{row.records}</td>
                      <td className="px-6 py-4 text-xs text-slate-700 font-medium">{Number(row.size_mb).toFixed(2)} MB</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border border-slate-300 bg-white text-slate-700 tracking-tight shadow-sm">
                          {row.source}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs leading-tight">
                        <span className="font-semibold text-slate-900 block mb-0.5">{row.uploader_name || "—"}</span>
                        <span className="text-slate-500 font-medium">{row.uploader_email}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-5 text-slate-500">
                          <Eye
                            className="h-6 w-6 hover:text-primary cursor-pointer transition-colors flex-shrink-0"
                            onClick={() => { setPreviewUploadId(row.id); setDataPreviewOpen(true); }}
                          />
                          <Download
                            className="h-6 w-6 hover:text-primary cursor-pointer transition-colors flex-shrink-0"
                            onClick={() => window.open(`${import.meta.env.VITE_API_URL}/fleetsync/download/${row.id}`, "_blank")}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredHistory.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-6 py-10 text-center text-sm font-medium text-slate-600">
                        {t.fleetSync.noUploads}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Field Mapping Modal ───────────────────────────────────────────── */}
      {previewResult && (
        <FieldMappingModal
          open={true}
          filename={selectedFileName}
          previewResult={previewResult}
          onConfirm={handleProcessFile}
          onCancel={() => setPreviewResult(null)}
        />
      )}

      {/* ── Data Preview Sheet ────────────────────────────────────────────── */}
      <DataPreviewSheet
        open={dataPreviewOpen}
        uploadId={previewUploadId}
        filename={selectedFileName || undefined}
        onClose={() => setDataPreviewOpen(false)}
      />
    </div>
  );
}
