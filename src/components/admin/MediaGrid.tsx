"use client";

import { Eye } from "lucide-react";
import { MediaCard } from "./MediaCard";
import type { MediaFile } from "@/types/media";

export function MediaGrid({
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
