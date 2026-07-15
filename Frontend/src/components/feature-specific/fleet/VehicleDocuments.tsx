import { useMemo, useRef, useState } from "react";
import {
  FolderClosed,
  FolderOpen,
  FolderPlus,
  ShoppingCart,
  ClipboardList,
  Shield,
  FileText,
  AlertTriangle,
  UploadCloud,
  Download,
  Trash2,
  Search,
  ChevronRight,
  Plus,
  X,
  Check,
  File as FileIcon,
  FileImage,
  FileSpreadsheet,
  Files,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/common/ui/button";
import { Input } from "@/components/common/ui/input";
import { cn } from "@/utils/utils";

/* ────────────────────────────────────────────────────────────────────────────
 * Types
 * ──────────────────────────────────────────────────────────────────────────── */

interface Folder {
  id: string;
  name: string;
  icon: any;
  accent: string; // tailwind text colour token for the folder glyph
  children?: Folder[];
}

interface DocFile {
  id: string;
  name: string;
  size: number; // bytes
  uploadedAt: Date;
  uploadedBy: string;
  url?: string; // object URL for files uploaded this session
}

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const ACCEPT = ".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,.xls,.xlsx,.ppt,.pptx";

/* ────────────────────────────────────────────────────────────────────────────
 * Seed data (mock, in-memory)
 * ──────────────────────────────────────────────────────────────────────────── */

const initialFolders: Folder[] = [
  { id: "procurement", name: "Procurement", icon: ShoppingCart, accent: "text-blue-600" },
  { id: "tasks", name: "Tasks", icon: ClipboardList, accent: "text-amber-600" },
  {
    id: "insurance",
    name: "Insurance",
    icon: Shield,
    accent: "text-emerald-600",
    children: [
      { id: "policies", name: "Policies", icon: FileText, accent: "text-teal-600" },
      { id: "claims", name: "Claims", icon: AlertTriangle, accent: "text-rose-600" },
    ],
  },
];

const initialFiles: Record<string, DocFile[]> = {
  procurement: [
    { id: "f1", name: "Purchase-Order-FG47GGE7.pdf", size: 284_120, uploadedAt: new Date(2026, 0, 12), uploadedBy: "TESSERON Admin" },
    { id: "f2", name: "Delivery-Acceptance.pdf", size: 512_880, uploadedAt: new Date(2026, 0, 14), uploadedBy: "TESSERON Admin" },
  ],
  tasks: [],
  insurance: [],
  policies: [
    { id: "f3", name: "Comprehensive-Policy-2026.pdf", size: 1_204_400, uploadedAt: new Date(2026, 1, 1), uploadedBy: "InsureFleet NL" },
  ],
  claims: [],
};

/* ────────────────────────────────────────────────────────────────────────────
 * Helpers
 * ──────────────────────────────────────────────────────────────────────────── */

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function fileMeta(name: string): { Icon: any; tint: string } {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (["png", "jpg", "jpeg", "webp", "gif", "svg"].includes(ext))
    return { Icon: FileImage, tint: "bg-purple-500/10 text-purple-600" };
  if (["xls", "xlsx", "csv"].includes(ext))
    return { Icon: FileSpreadsheet, tint: "bg-emerald-500/10 text-emerald-600" };
  if (["pdf"].includes(ext)) return { Icon: FileText, tint: "bg-rose-500/10 text-rose-600" };
  if (["doc", "docx"].includes(ext)) return { Icon: FileText, tint: "bg-blue-500/10 text-blue-600" };
  return { Icon: FileIcon, tint: "bg-slate-500/10 text-slate-600" };
}

/** Flatten the folder tree into an id → folder lookup (for the selected header + counts). */
function flatten(folders: Folder[], acc: Folder[] = []): Folder[] {
  for (const f of folders) {
    acc.push(f);
    if (f.children) flatten(f.children, acc);
  }
  return acc;
}

function newId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `id-${Math.floor(performance.now() * 1000)}`;
  }
}

/* ────────────────────────────────────────────────────────────────────────────
 * Folder row (recursive)
 * ──────────────────────────────────────────────────────────────────────────── */

function FolderRow({
  folder,
  depth,
  selectedId,
  counts,
  onSelect,
  onAddSub,
}: {
  folder: Folder;
  depth: number;
  selectedId: string;
  counts: Record<string, number>;
  onSelect: (id: string) => void;
  onAddSub: (parentId: string) => void;
}) {
  const Icon = folder.icon;
  const active = selectedId === folder.id;
  const count = counts[folder.id] ?? 0;

  return (
    <div>
      <button
        type="button"
        onClick={() => onSelect(folder.id)}
        className={cn(
          "group/row relative w-full flex items-center gap-2.5 rounded-xl pr-2 py-2 text-left transition-all duration-200 border",
          active
            ? "bg-primary/[0.06] border-primary/25 aria-glow-blue"
            : "border-transparent hover:bg-slate-50/70 dark:hover:bg-slate-900/40 hover:border-border/40"
        )}
        style={{ paddingLeft: `${10 + depth * 18}px` }}
      >
        {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-full bg-primary" />}
        <span
          className={cn(
            "flex items-center justify-center w-7 h-7 rounded-lg shrink-0 transition-transform duration-200 group-hover/row:scale-105",
            active ? "bg-primary/10" : "bg-slate-100 dark:bg-slate-800/60"
          )}
        >
          {active ? (
            <FolderOpen className={cn("h-[15px] w-[15px]", folder.accent)} />
          ) : (
            <Icon className={cn("h-[15px] w-[15px]", folder.accent)} />
          )}
        </span>
        <span className={cn("flex-1 min-w-0 truncate text-xs font-bold", active ? "text-primary" : "text-foreground")}>
          {folder.name}
        </span>

        {/* Add sub-folder (hover) */}
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            onAddSub(folder.id);
          }}
          className="opacity-0 group-hover/row:opacity-100 flex items-center justify-center h-6 w-6 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
          title="New sub-folder"
        >
          <Plus className="h-3.5 w-3.5" />
        </span>

        <span
          className={cn(
            "min-w-[22px] text-center text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full shrink-0",
            active ? "bg-primary/15 text-primary" : "bg-slate-100 dark:bg-slate-800 text-muted-foreground"
          )}
        >
          {count}
        </span>
      </button>

      {folder.children?.length ? (
        <div className="mt-1 space-y-1">
          {folder.children.map((child) => (
            <FolderRow
              key={child.id}
              folder={child}
              depth={depth + 1}
              selectedId={selectedId}
              counts={counts}
              onSelect={onSelect}
              onAddSub={onAddSub}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * Main component
 * ──────────────────────────────────────────────────────────────────────────── */

export function VehicleDocuments() {
  const [folders, setFolders] = useState<Folder[]>(initialFolders);
  const [filesByFolder, setFilesByFolder] = useState<Record<string, DocFile[]>>(initialFiles);
  const [selectedId, setSelectedId] = useState<string>("procurement");
  const [adding, setAdding] = useState<{ parentId: string | null } | null>(null);
  const [newName, setNewName] = useState("");
  const [query, setQuery] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const flat = useMemo(() => flatten(folders), [folders]);
  const selected = flat.find((f) => f.id === selectedId) ?? flat[0];

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const f of flat) c[f.id] = filesByFolder[f.id]?.length ?? 0;
    return c;
  }, [flat, filesByFolder]);

  const files = filesByFolder[selectedId] ?? [];
  const totalFiles = useMemo(
    () => Object.values(filesByFolder).reduce((n, arr) => n + arr.length, 0),
    [filesByFolder]
  );

  const visibleFiles = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q ? files.filter((f) => f.name.toLowerCase().includes(q)) : files;
    return [...list].sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
  }, [files, query]);

  /* ── folder creation ── */
  const startAdd = (parentId: string | null) => {
    setNewName("");
    setAdding({ parentId });
  };

  const commitAdd = () => {
    const name = newName.trim();
    if (!adding) return;
    if (!name) {
      setAdding(null);
      return;
    }
    const folder: Folder = { id: newId(), name, icon: FolderClosed, accent: "text-slate-500" };
    if (adding.parentId === null) {
      setFolders((prev) => [...prev, folder]);
    } else {
      const parentId = adding.parentId;
      const insert = (list: Folder[]): Folder[] =>
        list.map((f) =>
          f.id === parentId
            ? { ...f, children: [...(f.children ?? []), folder] }
            : f.children
            ? { ...f, children: insert(f.children) }
            : f
        );
      setFolders((prev) => insert(prev));
    }
    setFilesByFolder((prev) => ({ ...prev, [folder.id]: [] }));
    setSelectedId(folder.id);
    setAdding(null);
    setNewName("");
    toast.success(`Folder “${name}” created`);
  };

  /* ── uploads ── */
  const addFiles = (fileList: FileList | File[]) => {
    const incoming = Array.from(fileList);
    if (!incoming.length) return;

    const accepted: DocFile[] = [];
    let rejected = 0;
    for (const file of incoming) {
      if (file.size > MAX_SIZE) {
        rejected++;
        continue;
      }
      accepted.push({
        id: newId(),
        name: file.name,
        size: file.size,
        uploadedAt: new Date(),
        uploadedBy: "TESSERON Admin",
        url: URL.createObjectURL(file),
      });
    }

    if (accepted.length) {
      setFilesByFolder((prev) => ({
        ...prev,
        [selectedId]: [...accepted, ...(prev[selectedId] ?? [])],
      }));
      toast.success(
        `${accepted.length} file${accepted.length > 1 ? "s" : ""} uploaded to ${selected.name}`
      );
    }
    if (rejected) {
      toast.error(`${rejected} file${rejected > 1 ? "s" : ""} exceeded the 10 MB limit`);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  const handleDownload = (file: DocFile) => {
    if (file.url) {
      const a = document.createElement("a");
      a.href = file.url;
      a.download = file.name;
      a.click();
    } else {
      toast(`Downloading “${file.name}”…`);
    }
  };

  const handleDelete = (file: DocFile) => {
    setFilesByFolder((prev) => ({
      ...prev,
      [selectedId]: (prev[selectedId] ?? []).filter((f) => f.id !== file.id),
    }));
    if (file.url) URL.revokeObjectURL(file.url);
    toast.success(`“${file.name}” deleted`);
  };

  /* ── render ── */
  return (
    <div className="space-y-4 animate-fade-in">
      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Files className="h-4 w-4 text-primary" />
          <span className="font-bold text-foreground">Documents</span>
          <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-full text-[10px]">
            {totalFiles}
          </span>
        </div>
        <div className="ml-auto relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search in ${selected.name}…`}
            className="aria-input h-9 pl-9 text-xs rounded-xl border-border/80"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ── Folders ── */}
        <div className="lg:col-span-5 aria-card rounded-2xl overflow-hidden flex flex-col">
          <div className="px-5 py-3.5 border-b border-border/40 bg-slate-50/50 dark:bg-slate-900/30 shrink-0 flex items-center gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground font-display">
              Vehicle Folders
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => startAdd(null)}
              className="ml-auto h-7 px-2.5 text-[11px] font-bold text-primary hover:text-primary hover:bg-primary/10 rounded-lg"
            >
              <FolderPlus className="h-3.5 w-3.5 mr-1" />
              New Folder
            </Button>
          </div>

          <div className="p-3 space-y-1">
            {folders.map((folder) => (
              <FolderRow
                key={folder.id}
                folder={folder}
                depth={0}
                selectedId={selectedId}
                counts={counts}
                onSelect={setSelectedId}
                onAddSub={startAdd}
              />
            ))}

            {/* Inline new-folder input */}
            {adding && (
              <div className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/[0.03] px-2.5 py-1.5 mt-1">
                <FolderPlus className="h-4 w-4 text-primary shrink-0" />
                <Input
                  autoFocus
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitAdd();
                    if (e.key === "Escape") setAdding(null);
                  }}
                  placeholder={adding.parentId ? "Sub-folder name…" : "Folder name…"}
                  className="h-7 text-xs border-0 bg-transparent focus-visible:ring-0 px-0"
                />
                <button
                  type="button"
                  onClick={commitAdd}
                  className="flex items-center justify-center h-6 w-6 rounded-md text-emerald-600 hover:bg-emerald-500/10"
                  title="Create"
                >
                  <Check className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setAdding(null)}
                  className="flex items-center justify-center h-6 w-6 rounded-md text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Cancel"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Files ── */}
        <div className="lg:col-span-7 aria-card rounded-2xl overflow-hidden flex flex-col">
          <div className="px-5 py-3.5 border-b border-border/40 bg-slate-50/50 dark:bg-slate-900/30 shrink-0 flex items-center gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground font-display flex items-center gap-1.5 min-w-0">
              <span className="text-muted-foreground">Files in</span>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
              <span className="text-primary truncate">{selected.name}</span>
            </h3>
            <span className="ml-auto text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full shrink-0">
              {files.length}
            </span>
          </div>

          <div className="p-4 space-y-3">
            {/* Dropzone */}
            <label
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={cn(
                "flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed px-4 py-7 text-center cursor-pointer transition-all duration-200",
                isDragging
                  ? "border-primary bg-primary/[0.06] scale-[0.99]"
                  : "border-border/70 hover:border-primary/50 hover:bg-slate-50/60 dark:hover:bg-slate-900/30"
              )}
            >
              <span
                className={cn(
                  "flex items-center justify-center w-11 h-11 rounded-xl mb-1 transition-transform duration-200",
                  isDragging ? "bg-primary/15 scale-110" : "bg-primary/10"
                )}
              >
                <UploadCloud className="h-5 w-5 text-primary" />
              </span>
              <p className="text-xs font-bold text-foreground">
                {isDragging ? "Drop to upload" : `Upload to ${selected.name}`}
              </p>
              <p className="text-[11px] text-muted-foreground">
                Drag &amp; drop or <span className="text-primary font-semibold">click to browse</span>
              </p>
              <p className="text-[10px] text-muted-foreground/70">PDF, image, or Office file up to 10 MB</p>
              <input
                ref={inputRef}
                type="file"
                multiple
                accept={ACCEPT}
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) addFiles(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>

            {/* File list */}
            {visibleFiles.length ? (
              <div className="space-y-1.5">
                {visibleFiles.map((file) => {
                  const { Icon, tint } = fileMeta(file.name);
                  return (
                    <div
                      key={file.id}
                      className="group/file flex items-center gap-3 rounded-xl border border-border/50 bg-white/50 dark:bg-slate-900/40 px-3 py-2.5 hover:border-primary/30 hover:bg-slate-50/70 dark:hover:bg-slate-900/60 transition-all duration-200"
                    >
                      <span className={cn("flex items-center justify-center w-9 h-9 rounded-lg shrink-0", tint)}>
                        <Icon className="h-[18px] w-[18px]" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-foreground truncate">{file.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">
                          {formatBytes(file.size)} • {formatDate(file.uploadedAt)} • {file.uploadedBy}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover/file:opacity-100 transition-opacity shrink-0">
                        <button
                          type="button"
                          onClick={() => handleDownload(file)}
                          className="flex items-center justify-center h-8 w-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                          title="Download"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(file)}
                          className="flex items-center justify-center h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border/60 py-10 text-center">
                <FolderClosed className="h-9 w-9 text-muted-foreground/50" />
                <p className="text-xs font-semibold text-foreground">
                  {query ? "No matching files" : "No documents in this folder yet"}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {query ? "Try a different search term." : "Upload a file to get started."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


