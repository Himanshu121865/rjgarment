"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Trash2, LogOut, ArrowLeft, Check } from "lucide-react";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { UploadZone } from "@/components/admin/UploadZone";
import { MediaGrid } from "@/components/admin/MediaGrid";
import type { MediaFile } from "@/types/media";

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
