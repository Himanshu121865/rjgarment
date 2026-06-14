"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Season,
  RecentItem,
  SEASON_ORDER,
  getSeason,
} from "@/lib/helpers/season";
import { ColorRevealImg } from "@/components/ui/ColorRevealImg";
import {
  CollectionCard,
  type Collection,
} from "@/components/collections/CollectionCard";
import { CollectionDetail } from "@/components/collections/CollectionDetail";
import { cn } from "@/lib/utils";

type SeasonFilter = "All" | Season;

function buildCollections(items: RecentItem[]): Collection[] {
  const grouped: Record<string, RecentItem[]> = {};
  items.forEach((item) => {
    const season = item.category || getSeason(item.createdAt);
    if (!grouped[season]) grouped[season] = [];
    grouped[season].push(item);
  });

  return Object.entries(grouped).map(([season, seasonItems], i) => {
    const year = new Date(seasonItems[0].createdAt).getFullYear().toString();
    return {
      id: `season-${i}`,
      season: `${season} ${year}`,
      seasonTag: season as Season,
      title: `${season.toUpperCase()} EDIT`,
      desc: `Curated ${season.toLowerCase()} collection. Heavy fabrics. Concrete attitude.`,
      year,
      hero: seasonItems[0]?.url || "",
      images: seasonItems.map((item) => item.url),
      colors: seasonItems.map(() => "#000000"),
    };
  });
}

export default function CollectionsPage() {
  const [selected, setSelected] = useState<Collection | null>(null);
  const [filter, setFilter] = useState<SeasonFilter>("All");
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [archiveItems, setArchiveItems] = useState<RecentItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/public/recent").then((r) => r.json()),
      fetch("/api/public/recent?older=true").then((r) => r.json()),
    ])
      .then(([recent, archive]) => {
        setRecentItems(recent.files || []);
        setArchiveItems(archive.files || []);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const collections = buildCollections(archiveItems);

  useEffect(() => {
    if (selected) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
  }, [selected]);

  const filtered =
    filter === "All"
      ? collections
      : collections.filter((c) => c.seasonTag === filter);

  const grouped: Record<Season, RecentItem[]> = {
    Spring: [],
    Summer: [],
    Fall: [],
    Winter: [],
  };
  recentItems.forEach((item) => {
    const s = (item.category || getSeason(item.createdAt)) as Season;
    if (grouped[s]) grouped[s].push(item);
  });
  const currentSeason = getSeason(new Date().toISOString());

  return (
    <div className="bg-[#E0E0E0] selection:bg-[#ff4800] selection:text-black">
      <div className="relative px-4 md:px-12 pt-24 md:pt-28 pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 md:mb-12 border-b-4 md:border-b-8 border-black pb-4 md:pb-8">
            <p className="font-mono text-[10px] md:text-sm font-bold uppercase tracking-widest text-gray-600 mb-1 md:mb-2">
              RJ GARMENT · Archive
            </p>
            <h1 className="text-5xl md:text-[8rem] font-black uppercase tracking-tighter leading-[0.85] text-black">
              Collections
            </h1>
          </div>

          <div className="flex flex-wrap gap-2 md:gap-3 mb-10 md:mb-12">
            {(
              ["All", "Spring", "Summer", "Fall", "Winter"] as SeasonFilter[]
            ).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={cn(
                  "font-mono text-[10px] md:text-xs font-bold uppercase tracking-widest px-4 md:px-4 py-2.5 md:py-2 border-2 border-black transition-all min-h-[44px]",
                  filter === s
                    ? "bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    : "bg-transparent text-black hover:bg-gray-200",
                )}
              >
                {s === "All" ? "All Seasons" : s}
              </button>
            ))}
            <span className="font-mono text-[10px] md:text-xs text-gray-500 self-center ml-auto">
              {filtered.length} collection{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {recentItems.length > 0 && (
            <div className="mb-12 md:mb-16 pb-8 md:pb-12 border-b-4 md:border-b-8 border-black">
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <h2 className="text-2xl md:text-5xl font-black uppercase tracking-tighter text-black leading-none">
                  Latest
                  <br />
                  Arrivals
                </h2>
                <span className="font-mono text-[10px] md:text-xs font-bold uppercase tracking-widest text-black">
                  Last 7 days
                </span>
              </div>
              {SEASON_ORDER.map((season) => {
                const seasonItems = grouped[season];
                if (!seasonItems.length) return null;
                const isCurrent = season === currentSeason;
                return (
                  <div key={season} className="mb-8 md:mb-10 last:mb-0">
                    <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4 border-b-2 md:border-b-4 border-black pb-1.5 md:pb-2">
                      <span
                        className={cn(
                          "font-mono text-[9px] md:text-[10px] font-bold uppercase px-1.5 md:px-2 py-0.5 md:py-1 border-2 border-black",
                          isCurrent
                            ? "bg-[#ff4800] text-black"
                            : "bg-white text-black",
                        )}
                      >
                        {isCurrent ? "Now" : "Arch"}
                      </span>
                      <h3 className="text-xl md:text-4xl font-black uppercase tracking-tighter text-black">
                        {season}
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3">
                      {seasonItems.map((item, i) => (
                        <motion.div
                          key={item.url}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.03 }}
                          className="group relative border-2 border-black bg-[#E0E0E0] overflow-hidden"
                        >
                          <div className="aspect-[4/5] md:aspect-[3/4] overflow-hidden bg-black">
                            {item.type === "image" ? (
                              <ColorRevealImg
                                src={item.url}
                                alt={item.displayName || ""}
                                item={item}
                              />
                            ) : (
                              <video
                                src={item.url}
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
                          <div className="p-1.5 md:p-2 border-t-2 border-black">
                            <p className="font-black text-[9px] md:text-[10px] uppercase tracking-tighter text-black truncate">
                              {item.displayName || "Untitled"}
                            </p>
                            {item.price != null && item.price > 0 && (
                              <p className="font-mono text-[9px] md:text-[10px] font-bold text-black">
                                ₹{Number(item.price).toFixed(2)}
                              </p>
                            )}
                          </div>
                          <div className="absolute top-1 left-1">
                            <span className="font-mono text-[7px] md:text-[8px] font-bold uppercase px-1 md:px-1.5 py-0.5 bg-[#ff4800] text-black border border-black">
                              NEW
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="columns-2 md:columns-3 gap-2 md:gap-5">
            {filtered.map((c) => (
              <div key={c.id} className="break-inside-avoid mb-2 md:mb-5">
                <CollectionCard collection={c} onOpen={() => setSelected(c)} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <CollectionDetail
            collection={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
