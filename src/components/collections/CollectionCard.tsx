"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ColorRevealImg } from "@/components/ui/ColorRevealImg";
import type { Season } from "@/lib/helpers/season";

export interface Collection {
  id: string;
  season: string;
  seasonTag: Season;
  title: string;
  desc: string;
  year: string;
  hero: string;
  images: string[];
  colors: string[];
}

export const seasonColors: Record<string, string> = {
  FW: "bg-black text-white",
  SS: "bg-white text-black",
};

export function CollectionCard({ collection, onOpen }: { collection: Collection; onOpen: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="group relative border-2 md:border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden cursor-pointer hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transition-shadow duration-300"
      onClick={onOpen}
    >
      {collection.hero ? (
        <div className="overflow-hidden">
          <ColorRevealImg src={collection.hero} alt={collection.season} className="aspect-[4/5] md:aspect-[3/4]" />
        </div>
      ) : (
        <div className="w-full aspect-[4/5] md:aspect-[3/4] bg-black flex items-center justify-center">
          <div className="text-center p-4 md:p-6">
            <div className={cn(
              "inline-block font-mono text-[10px] md:text-xs font-bold uppercase px-2 md:px-3 py-1 md:py-1.5 border-2 mb-2 md:mb-4",
              seasonColors[collection.season.slice(0, 2)] || "bg-white text-black"
            )}>
              {collection.season}
            </div>
            <h3 className="text-white text-xl md:text-3xl font-black uppercase tracking-tighter leading-none">
              {collection.title}
            </h3>
          </div>
        </div>
      )}

      <div className="absolute top-2 left-2 md:top-3 md:left-3 flex gap-1.5 md:gap-2">
        <span className={cn(
          "font-mono text-[9px] md:text-[10px] font-bold uppercase px-2 md:px-3 py-1 md:py-1.5 border border-black md:border-2",
          seasonColors[collection.season.slice(0, 2)] || "bg-white text-black"
        )}>
          {collection.season}
        </span>
        <span className="font-mono text-[9px] md:text-[10px] font-bold uppercase px-2 md:px-3 py-1 md:py-1.5 border border-black md:border-2 bg-[#ff4800] text-black">
          {collection.year}
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-3 md:p-5 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
        <h3 className="text-white text-xl md:text-4xl font-black uppercase tracking-tighter leading-none">
          {collection.title}
        </h3>
        <div className="flex gap-1.5 mt-2 md:mt-3">
          {collection.colors.map((c, i) => (
            <span key={i} className="w-3 h-3 md:w-4 md:h-4 border border-white" style={{ backgroundColor: c }} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
