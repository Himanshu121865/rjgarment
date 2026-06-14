"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Eye, Trash2, X, Check, Image, Film } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatSize } from "@/lib/format";
import type { MediaFile } from "@/types/media";

export function MediaCard({
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
  const [saveError, setSaveError] = useState<string | null>(null);
  const nameTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const priceTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const catTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const saveMeta = useCallback(
    async (
      name: string,
      field: "displayName" | "price" | "category",
      value: string | number,
    ) => {
      setSaving(true);
      setSaveError(null);
      try {
        const res = await fetch("/api/admin/media/meta", {
          method: "PUT",
          headers: {
            "x-admin-password": password,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ filename: name, [field]: value }),
        });
        if (!res.ok) {
          const errText = await res.text();
          setSaveError(errText || `Error ${res.status}`);
          console.error("Meta save failed", errText);
          setSaving(false);
          return;
        }
      } catch (err) {
        setSaveError("Network error");
        console.error(err);
        setSaving(false);
        return;
      }
      setSaving(false);
      onMetaChange(name, field, value);
    },
    [password, onMetaChange],
  );

  const handleNameChange = (val: string) => {
    setDisplayName(val);
    clearTimeout(nameTimer.current);
    nameTimer.current = setTimeout(
      () => saveMeta(file.name, "displayName", val),
      600,
    );
  };

  const handlePriceChange = (val: string) => {
    setPrice(val);
    clearTimeout(priceTimer.current);
    priceTimer.current = setTimeout(
      () => saveMeta(file.name, "price", parseFloat(val) || 0),
      600,
    );
  };

  const handleCategoryChange = (val: string) => {
    setCategory(val);
    clearTimeout(catTimer.current);
    catTimer.current = setTimeout(
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
                step="1"
                min="0"
                className="w-10 font-mono text-sm font-bold bg-transparent border-0 outline-none text-black"
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
              className="flex-1 font-mono text-[11px] uppercase tracking-wider bg-white border-2 border-black px-2 py-1 text-black font-bold cursor-pointer"
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
            {saveError && (
              <span className="text-[9px] font-mono text-[#ff4800] uppercase flex-shrink-0 max-w-[80px] truncate" title={saveError}>
                ERR
              </span>
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
