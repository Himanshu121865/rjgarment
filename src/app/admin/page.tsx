"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  Trash2,
  Image,
  Film,
  Eye,
  X,
  Lock,
  LogOut,
  ArrowLeft,
  Check,
} from "lucide-react";

const PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

interface MediaFile {
  name: string;
  url: string;
  type: "image" | "video" | "other";
  size: number;
  createdAt: string;
  displayName: string;
  price: number;
  category: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function AdminLogin({ onLogin }: { onLogin: (pwd: string) => void }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === PASSWORD) {
      onLogin(input);
      sessionStorage.setItem("admin_token", input);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <motion.form
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="w-full max-w-md border-8 border-[#ff4800] bg-white p-12 shadow-[24px_24px_0px_0px_#ff4800]"
      >
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Lock size={40} className="text-black" />
            <h1 className="text-5xl font-black uppercase tracking-tighter leading-none">
              Admin
              <br />
              Access
            </h1>
          </div>
          <div className="w-full h-2 bg-[#ff4800]" />
        </div>

        <label className="block font-mono text-xs font-bold uppercase tracking-widest mb-2 text-black">
          Password
        </label>
        <input
          type="password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full border-4 border-black p-4 font-mono text-lg uppercase bg-transparent text-black placeholder:text-gray-400 focus:outline-none focus:border-[#ff4800] transition-colors"
          placeholder="ENTER PASSWORD"
          autoFocus
        />

        {error && (
          <p className="mt-3 font-black text-sm uppercase text-[#ff4800]">
            Access Denied
          </p>
        )}

        <motion.button
          whileHover={{
            scale: 1.02,
            x: -3,
            y: -3,
            boxShadow: "6px 6px 0px 0px rgba(0,0,0,1)",
          }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="mt-6 w-full border-4 border-black bg-[#ff4800] p-4 font-black uppercase tracking-widest text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          Unlock
        </motion.button>

        <p className="mt-6 font-mono text-xs text-gray-500 uppercase tracking-wider text-center">
          RJ GARMENT · Admin Panel
        </p>
      </motion.form>
    </div>
  );
}

function UploadZone({
  password,
  onUploadComplete,
}: {
  password: string;
  onUploadComplete: () => void;
}) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [total, setTotal] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [skipped, setSkipped] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadedRef = useRef<Set<string>>(new Set());

  const uploadFiles = useCallback(
    async (files: FileList) => {
      const fileArray = Array.from(files).filter((f) => {
        const key = `${f.name}-${f.size}`;
        if (uploadedRef.current.has(key)) return false;
        uploadedRef.current.add(key);
        return true;
      });

      const skippedCount = Array.from(files).length - fileArray.length;
      setSkipped(skippedCount);
      setTotal(fileArray.length);
      setCompleted(0);
      setUploading(true);
      let successCount = 0;

      for (const file of fileArray) {
        const formData = new FormData();
        formData.append("files", file);
        try {
          const res = await fetch("/api/admin/upload", {
            method: "POST",
            headers: { "x-admin-password": password },
            body: formData,
          });
          if (res.ok) successCount++;
        } catch (err) {
          console.error(err);
        }
        setCompleted((prev) => prev + 1);
      }

      setUploading(false);
      if (successCount > 0) onUploadComplete();
    },
    [password, onUploadComplete],
  );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) {
      uploadFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      uploadFiles(e.target.files);
    }
  };

  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => !uploading && inputRef.current?.click()}
      className={cn(
        "relative cursor-pointer border-8 border-black p-8 md:p-16 text-center transition-all duration-200",
        dragging
          ? "bg-[#ff4800] border-dashed scale-[1.02]"
          : "bg-white hover:bg-gray-50",
      )}
      style={{
        boxShadow: dragging
          ? "12px 12px 0px 0px rgba(0,0,0,1)"
          : "8px 8px 0px 0px rgba(0,0,0,1)",
      }}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleChange}
        className="hidden"
      />

      {uploading ? (
        <div className="flex flex-col items-center gap-4">
          <Upload size={48} className="text-black" />
          <p className="font-black text-2xl uppercase tracking-tighter text-black">
            Uploading...
          </p>
          {skipped > 0 && (
            <p className="font-mono text-xs uppercase tracking-widest text-gray-500">
              Skipped {skipped} duplicate{skipped !== 1 ? "s" : ""}
            </p>
          )}
          <div className="w-full max-w-md border-4 border-black bg-white h-8 relative overflow-hidden">
            <div
              className="h-full bg-[#ff4800] transition-all duration-300"
              style={{
                width: `${pct}%`,
                clipPath:
                  "polygon(0 0, calc(100% - 12px) 0, 100% 100%, 0 100%)",
              }}
            />
          </div>
          <p className="font-mono text-sm font-bold uppercase tracking-widest text-black">
            {completed} of {total} uploaded
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <Upload size={64} className="text-black" />
          <p className="font-black text-4xl md:text-5xl uppercase tracking-tighter text-black leading-none">
            Drop Files Here
          </p>
          <p className="font-mono text-sm uppercase tracking-widest text-gray-600">
            or click to browse · Images & Videos · Max 50MB each
          </p>
        </div>
      )}
    </div>
  );
}

function MediaCard({
  file,
  password,
  onDelete,
  onMetaChange,
  selected,
  onToggleSelect,
}: {
  file: MediaFile;
  password: string;
  onDelete: () => void;
  onMetaChange: (
    name: string,
    field: "displayName" | "price" | "category",
    value: string | number,
  ) => void;
  selected: boolean;
  onToggleSelect: (name: string) => void;
}) {
  const [preview, setPreview] = useState<MediaFile | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [displayName, setDisplayName] = useState(file.displayName);
  const [price, setPrice] = useState(file.price.toString());
  const [category, setCategory] = useState(file.category);
  const [saving, setSaving] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const saveMeta = useCallback(
    async (
      name: string,
      field: "displayName" | "price" | "category",
      value: string | number,
    ) => {
      setSaving(true);
      try {
        await fetch("/api/admin/media/meta", {
          method: "PUT",
          headers: {
            "x-admin-password": password,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ filename: name, [field]: value }),
        });
      } catch (err) {
        console.error(err);
      } finally {
        setSaving(false);
        onMetaChange(name, field, value);
      }
    },
    [password, onMetaChange],
  );

  const handleNameChange = (val: string) => {
    setDisplayName(val);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(
      () => saveMeta(file.name, "displayName", val),
      600,
    );
  };

  const handlePriceChange = (val: string) => {
    setPrice(val);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(
      () => saveMeta(file.name, "price", parseFloat(val) || 0),
      600,
    );
  };

  const handleCategoryChange = (val: string) => {
    setCategory(val);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(
      () => saveMeta(file.name, "category", val),
      600,
    );
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/media/${file.name}`, {
        method: "DELETE",
        headers: { "x-admin-password": password },
      });
      if (res.ok) onDelete();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
      setDeleteConfirm(false);
    }
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "group relative border-4 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden",
          selected ? "border-[#ff4800]" : "border-black",
        )}
      >
        <div
          className="aspect-[4/3] overflow-hidden bg-black cursor-pointer"
          onClick={() => setPreview(file)}
        >
          {file.type === "image" ? (
            <img
              src={file.url}
              alt={file.name}
              className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
            />
          ) : (
            <video
              src={file.url}
              className="h-full w-full object-cover"
              muted
              onMouseEnter={(e) => e.currentTarget.play()}
              onMouseLeave={(e) => {
                e.currentTarget.pause();
                e.currentTarget.currentTime = 0;
              }}
            />
          )}
        </div>

        <div className="p-3 space-y-2 border-t-4 border-black">
          <div className="flex items-center gap-2">
            {file.type === "image" ? (
              <Image size={14} className="text-black flex-shrink-0" />
            ) : (
              <Film size={14} className="text-black flex-shrink-0" />
            )}
            <input
              value={displayName}
              onChange={(e) => handleNameChange(e.target.value)}
              className="flex-1 font-black text-sm uppercase tracking-tighter bg-transparent border-0 border-b-2 border-transparent focus:border-black outline-none px-1 py-0.5 text-black truncate min-w-0"
              placeholder="Product name"
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 border-2 border-black px-2 py-1">
              <span className="font-mono text-[10px] font-bold uppercase text-gray-500">
                ₹
              </span>
              <input
                value={price}
                onChange={(e) => handlePriceChange(e.target.value)}
                type="number"
                step="0.01"
                min="0"
                className="w-20 font-mono text-sm font-bold bg-transparent border-0 outline-none text-black"
              />
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setPreview(file)}
                className="border-2 border-black p-1.5 hover:bg-black hover:text-white transition-colors"
              >
                <Eye size={14} />
              </button>
              <button
                onClick={() => setDeleteConfirm(true)}
                className="border-2 border-black p-1.5 hover:bg-[#ff4800] hover:text-white transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 border-t-2 border-black pt-2 mt-1">
            <span className="font-mono text-[9px] font-bold uppercase text-gray-500 flex-shrink-0">
              Season
            </span>
            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="flex-1 font-mono text-[11px] uppercase tracking-wider bg-transparent border-0 border-b border-dotted border-gray-300 focus:border-black outline-none px-1 text-black cursor-pointer"
            >
              <option value="">Auto</option>
              <option value="Spring">Spring</option>
              <option value="Summer">Summer</option>
              <option value="Fall">Fall</option>
              <option value="Winter">Winter</option>
            </select>
            {saving && (
              <motion.div
                animate={{ opacity: [0, 1] }}
                className="text-[10px] font-mono text-gray-400 uppercase flex-shrink-0"
              >
                ...
              </motion.div>
            )}
          </div>
        </div>

        <div className="absolute top-2 left-2 flex gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSelect(file.name);
            }}
            className={cn(
              "border-2 border-black w-6 h-6 flex items-center justify-center transition-colors cursor-pointer",
              selected ? "bg-[#ff4800]" : "bg-white hover:bg-gray-200",
            )}
          >
            {selected && (
              <Check size={14} className="text-black" strokeWidth={4} />
            )}
          </button>
          <span
            className={cn(
              "font-mono text-[10px] font-bold uppercase px-2 py-1 border-2 border-black",
              file.type === "image"
                ? "bg-white text-black"
                : "bg-black text-white",
            )}
          >
            {file.type === "image" ? "IMG" : "VID"}
          </span>
        </div>

        {file.type === "video" && (
          <div className="absolute top-2 right-2">
            <span className="font-mono text-[10px] font-bold uppercase px-2 py-1 bg-[#ff4800] text-black border-2 border-black">
              ▶
            </span>
          </div>
        )}
      </motion.div>

      {preview && (
        <div
          className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-6"
          onClick={() => setPreview(null)}
        >
          <button
            onClick={() => setPreview(null)}
            className="absolute top-6 right-6 border-4 border-white p-3 bg-black text-white hover:bg-[#ff4800] hover:border-[#ff4800] transition-colors z-10"
          >
            <X size={32} />
          </button>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-5xl max-h-[85vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {preview.type === "image" ? (
              <img
                src={preview.url}
                alt={preview.name}
                className="w-full h-auto max-h-[85vh] object-contain border-8 border-white shadow-[24px_24px_0px_0px_rgba(255,255,255,0.3)]"
              />
            ) : (
              <video
                src={preview.url}
                controls
                autoPlay
                className="w-full max-h-[85vh] border-8 border-white shadow-[24px_24px_0px_0px_rgba(255,255,255,0.3)]"
              />
            )}
            <div className="mt-4 flex items-center justify-center gap-6">
              <p className="font-mono text-sm text-white uppercase tracking-wider">
                {preview.displayName}
              </p>
              {preview.price > 0 && (
                <span className="font-black text-lg text-[#ff4800]">
                  ₹{preview.price.toFixed(2)}
                </span>
              )}
              <span className="font-mono text-xs text-gray-400">
                · {formatSize(preview.size)}
              </span>
            </div>
          </motion.div>
        </div>
      )}

      {deleteConfirm && (
        <div
          className="fixed inset-0 z-[250] bg-black/80 flex items-center justify-center p-6"
          onClick={() => !deleting && setDeleteConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-sm w-full border-8 border-black bg-white p-8 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="inline-flex border-4 border-black bg-[#ff4800] p-4 mb-6">
                <Trash2 size={32} className="text-black" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter text-black mb-2">
                Delete File?
              </h3>
              <p className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-6 truncate">
                {file.displayName || file.name}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(false)}
                  disabled={deleting}
                  className="flex-1 border-4 border-black bg-white py-3 font-black uppercase text-sm tracking-widest text-black hover:bg-gray-100 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 border-4 border-black bg-[#ff4800] py-3 font-black uppercase text-sm tracking-widest text-black hover:bg-[#e04000] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {deleting ? "..." : "Delete"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}

function MediaGrid({
  files,
  password,
  onDelete,
  onMetaChange,
  selected,
  onToggleSelect,
}: {
  files: MediaFile[];
  password: string;
  onDelete: () => void;
  onMetaChange: (
    name: string,
    field: "displayName" | "price" | "category",
    value: string | number,
  ) => void;
  selected: Set<string>;
  onToggleSelect: (name: string) => void;
}) {
  if (!files.length) {
    return (
      <div className="border-8 border-black bg-white p-16 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="border-8 border-black bg-[#ff4800] p-6 inline-block">
            <Eye size={64} className="text-black" />
          </div>
          <p className="font-black text-3xl uppercase tracking-tighter text-black">
            No Media Yet
          </p>
          <p className="font-mono text-sm uppercase tracking-widest text-gray-600">
            Upload images and videos above
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {files.map((file) => (
        <MediaCard
          key={file.name}
          file={file}
          password={password}
          onDelete={onDelete}
          onMetaChange={onMetaChange}
          selected={selected.has(file.name)}
          onToggleSelect={onToggleSelect}
        />
      ))}
    </div>
  );
}

import { cn } from "@/lib/utils";

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("admin_token");
    if (stored) {
      setToken(stored);
    }
    setChecking(false);
  }, []);

  const fetchMedia = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/media", {
        headers: { "x-admin-password": token },
      });
      if (res.ok) {
        const data = await res.json();
        setFiles(data.files);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    setSelected(new Set());
  }, [files]);

  const toggleSelect = (name: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const selectAll = () => {
    if (selected.size === files.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(files.map((f) => f.name)));
    }
  };

  const handleBulkDelete = async () => {
    setBulkDeleting(true);
    let ok = 0;
    for (const name of selected) {
      try {
        const res = await fetch(`/api/admin/media/${name}`, {
          method: "DELETE",
          headers: { "x-admin-password": token! },
        });
        if (res.ok) ok++;
      } catch (err) {
        console.error(err);
      }
    }
    setBulkDeleting(false);
    setShowBulkConfirm(false);
    setSelected(new Set());
    if (ok > 0) fetchMedia();
  };

  useEffect(() => {
    if (token) fetchMedia();
  }, [token, fetchMedia]);

  const handleLogin = (pwd: string) => {
    setToken(pwd);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_token");
    setToken(null);
    setFiles([]);
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="border-8 border-[#ff4800] bg-white p-8"
        >
          <span className="font-black text-4xl">RJ</span>
        </motion.div>
      </div>
    );
  }

  if (!token) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#E0E0E0] selection:bg-[#ff4800] selection:text-black">
      <nav className="sticky top-0 z-50 bg-black border-b-4 border-[#ff4800]">
        <div className="flex items-center justify-between px-6 py-4">
          <a
            href="/"
            className="flex items-center gap-3 text-white font-black text-xl uppercase tracking-tighter hover:text-[#ff4800] transition-colors"
          >
            <ArrowLeft size={24} />
            RJ GARMENT
          </a>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs uppercase tracking-widest text-white hidden md:block">
              {files.length} files
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 border-2 border-[#ff4800] px-4 py-2 font-bold uppercase text-xs tracking-widest text-white hover:bg-[#ff4800] hover:text-black transition-colors"
            >
              <LogOut size={16} />
              Lock
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        <div>
          <h1 className="text-6xl md:text-[7rem] font-black uppercase tracking-tighter leading-[0.85] text-black">
            Media
            <br />
            Library
          </h1>
          <p className="font-mono text-sm uppercase tracking-widest text-gray-600 mt-4 border-l-4 border-black pl-4">
            Upload and manage your product images and videos
          </p>
        </div>

        <UploadZone password={token} onUploadComplete={fetchMedia} />

        <section>
          <div className="flex items-center justify-between mb-8 border-b-4 border-black pb-4">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black">
              All Media
            </h2>
            <span className="font-mono text-sm font-bold uppercase text-black border-2 border-black px-3 py-1">
              {files.length} item{files.length !== 1 ? "s" : ""}
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-32 gap-3 h-40">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ scaleY: [0.4, 1, 0.4] }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.8,
                    delay: i * 0.15,
                    ease: "easeInOut",
                  }}
                  className="w-4 h-16 origin-bottom border-4 border-black bg-[#ff4800] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                />
              ))}
            </div>
          ) : (
            <>
              {selected.size > 0 && (
                <div className="flex items-center justify-between mb-6 border-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={selectAll}
                      className="border-2 border-black px-3 py-1.5 font-mono text-xs font-bold uppercase hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      {selected.size === files.length
                        ? "Deselect All"
                        : "Select All"}
                    </button>
                    <span className="font-mono text-xs font-bold uppercase text-black">
                      {selected.size} selected
                    </span>
                  </div>
                  <button
                    onClick={() => setShowBulkConfirm(true)}
                    className="flex items-center gap-2 border-2 border-black bg-[#ff4800] px-4 py-2 font-black text-xs uppercase hover:bg-[#e04000] transition-colors cursor-pointer"
                  >
                    <Trash2 size={14} />
                    Delete Selected
                  </button>
                </div>
              )}
              <MediaGrid
                files={files}
                password={token}
                onDelete={fetchMedia}
                onMetaChange={() => {}}
                selected={selected}
                onToggleSelect={toggleSelect}
              />
            </>
          )}

          {showBulkConfirm && (
            <div
              className="fixed inset-0 z-[250] bg-black/80 flex items-center justify-center p-6"
              onClick={() => !bulkDeleting && setShowBulkConfirm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="max-w-sm w-full border-8 border-black bg-white p-8 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <div className="inline-flex border-4 border-black bg-[#ff4800] p-4 mb-6">
                    <Trash2 size={32} className="text-black" />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-black mb-2">
                    Delete {selected.size} file{selected.size !== 1 ? "s" : ""}?
                  </h3>
                  <p className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-6">
                    This cannot be undone
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowBulkConfirm(false)}
                      disabled={bulkDeleting}
                      className="flex-1 border-4 border-black bg-white py-3 font-black uppercase text-sm tracking-widest text-black hover:bg-gray-100 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleBulkDelete}
                      disabled={bulkDeleting}
                      className="flex-1 border-4 border-black bg-[#ff4800] py-3 font-black uppercase text-sm tracking-widest text-black hover:bg-[#e04000] transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {bulkDeleting ? "..." : "Delete"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </section>
      </main>

      <footer className="border-t-8 border-black bg-black mt-32">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-black text-xl uppercase tracking-tighter text-white">
            RJ GARMENT
          </span>
          <span className="font-mono text-xs uppercase tracking-widest text-gray-500">
            Admin Panel · Unauthorized access prohibited
          </span>
        </div>
      </footer>
    </div>
  );
}
