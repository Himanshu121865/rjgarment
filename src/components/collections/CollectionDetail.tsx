"use client";

import { motion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ColorRevealImg } from "@/components/ui/ColorRevealImg";
import { seasonColors } from "./CollectionCard";
import type { Collection } from "./CollectionCard";

export function CollectionDetail({ collection, onClose }: { collection: Collection; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/95 overflow-y-auto"
    >
      <div className="relative min-h-screen">
        <button
          onClick={onClose}
          className="fixed top-4 right-4 md:top-6 md:right-6 z-10 border-2 md:border-4 border-white p-2 md:p-3 bg-black text-white hover:bg-[#ff4800] hover:border-[#ff4800] transition-colors"
        >
          <X size={24} className="md:size-[32px]" />
        </button>

        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-24">
          <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-4">
            <span className={cn(
              "font-mono text-[11px] md:text-sm font-bold uppercase px-3 md:px-4 py-1.5 md:py-2 border-2 border-white",
              seasonColors[collection.season.slice(0, 2)] || "bg-white text-black"
            )}>
              {collection.season}
            </span>
            <span className="font-mono text-[11px] md:text-sm font-bold uppercase px-3 md:px-4 py-1.5 md:py-2 border-2 border-white bg-[#ff4800] text-black">
              {collection.year}
            </span>
          </div>

          <h1 className="text-5xl md:text-[10rem] font-black uppercase tracking-tighter leading-[0.85] text-white mb-4 md:mb-6">
            {collection.title}
          </h1>

          <p className="font-mono text-sm md:text-2xl font-bold uppercase tracking-widest text-gray-400 max-w-xl border-l-2 md:border-l-4 border-[#ff4800] pl-3 md:pl-4 mb-10 md:mb-12">
            {collection.desc}
          </p>

          <div className="flex gap-2 mb-10 md:mb-16">
            {collection.colors.map((c, i) => (
              <span key={i} className="w-6 h-6 md:w-8 md:h-8 border-2 border-white" style={{ backgroundColor: c }} />
            ))}
          </div>

          {collection.images.length > 0 && (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-4 md:gap-6 space-y-4 md:space-y-6">
              {collection.images.map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="break-inside-avoid border-2 md:border-4 border-white bg-black overflow-hidden"
                  style={{ aspectRatio: i % 2 === 0 ? "3/4" : "4/5" }}
                >
                  <ColorRevealImg src={img} alt={`${collection.season} look ${i + 1}`} className="h-full" />
                </motion.div>
              ))}
            </div>
          )}

          <div className="mt-12 md:mt-16 flex justify-center">
            <motion.a
              href="#"
              whileHover={{ scale: 1.02, x: -2, y: -2, boxShadow: "6px 6px 0px 0px rgba(255,255,255,1)" }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 border-2 md:border-4 border-white bg-[#ff4800] px-6 md:px-10 py-3 md:py-5 font-black uppercase tracking-widest text-black shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] md:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] text-sm md:text-base"
            >
              Shop {collection.season}
              <ArrowRight strokeWidth={3} size={20} className="md:size-[24px]" />
            </motion.a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
