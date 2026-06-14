"use client";

import { useState, useRef, useCallback } from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

export function UploadZone({
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
