'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Season, SEASON_ORDER, getSeason, RecentItem } from '@/lib/helpers/season';
import { ColorRevealImg } from '@/components/ui/ColorRevealImg';

export function LatestArrivals() {
    const [items, setItems] = useState<RecentItem[]>([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        fetch('/api/public/recent')
            .then((r) => r.json())
            .then((data) => { setItems(data.files || []); setLoaded(true); })
            .catch(() => setLoaded(true));
    }, []);

    const grouped: Record<Season, RecentItem[]> = { Spring: [], Summer: [], Fall: [], Winter: [] };
    if (loaded) {
        items.forEach((item) => {
            const s = (item.category || getSeason(item.createdAt)) as Season;
            if (grouped[s]) grouped[s].push(item);
        });
    }

    const currentSeason = getSeason(new Date().toISOString());
    const hasItems = loaded && items.length > 0;

    return (
        <section className="bg-white py-24 md:py-32 px-6 md:px-12 border-b-8 border-black">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-12 border-b-8 border-black pb-6">
                    <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-black leading-none">
                        Latest<br />Arrivals
                    </h2>
                    <div className="flex items-center gap-2 md:gap-3">
                        <span className="w-3 h-3 md:w-4 md:h-4 bg-[#ff4800]" />
                        <span className="font-mono text-[10px] md:text-xs font-bold uppercase tracking-widest text-black">Last 7 days</span>
                    </div>
                </div>

                {!hasItems && loaded && (
                    <p className="font-mono text-sm md:text-base text-gray-500 uppercase tracking-widest mt-8 text-center">
                        No new arrivals in the last 7 days
                    </p>
                )}

                {SEASON_ORDER.map((season) => {
                    const seasonItems = grouped[season];
                    if (!seasonItems.length) return null;
                    const isCurrent = season === currentSeason;
                    return (
                        <div key={season} className="mb-14 last:mb-0">
                            <div className="flex items-center gap-3 md:gap-4 mb-6 border-b-4 border-black pb-3">
                                <span className={cn(
                                    "font-mono text-[10px] md:text-xs font-bold uppercase px-2 md:px-3 py-1 border-2 border-black",
                                    isCurrent ? "bg-[#ff4800] text-black" : "bg-black text-white"
                                )}>
                                    {isCurrent ? 'Now showing' : 'Archive'}
                                </span>
                                <h3 className="text-2xl md:text-5xl font-black uppercase tracking-tighter text-black">
                                    {season}
                                </h3>
                                <span className="font-mono text-[10px] md:text-xs text-gray-500">{seasonItems.length} item{seasonItems.length !== 1 ? 's' : ''}</span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
                                {seasonItems.map((item, i) => (
                                    <motion.div
                                        key={item.url}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.05 }}
                                        className="group relative border-2 md:border-4 border-black bg-[#E0E0E0] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-shadow duration-300"
                                    >
                                        <div className="aspect-[4/5] overflow-hidden bg-black">
                                            {item.type === 'image' ? (
                                                <ColorRevealImg src={item.url} alt={item.displayName || 'New arrival'} item={item} />
                                            ) : (
                                                <video
                                                    src={item.url}
                                                    className="h-full w-full object-cover"
                                                    muted
                                                    onMouseEnter={(e) => e.currentTarget.play()}
                                                    onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                                                />
                                            )}
                                        </div>
                                        <div className="p-2 md:p-4 space-y-1 md:space-y-2 border-t-2 md:border-t-4 border-black">
                                            <p className="font-black text-[11px] md:text-sm uppercase tracking-tighter text-black truncate">
                                                {item.displayName || 'Untitled'}
                                            </p>
                                            {item.price != null && item.price > 0 && (
                                                <p className="font-mono text-[11px] md:text-sm font-bold text-black">
                                                    ₹{Number(item.price).toFixed(2)}
                                                </p>
                                            )}
                                        </div>
                                        <div className="absolute top-1.5 left-1.5 md:top-2 md:left-2">
                                            <span className="font-mono text-[8px] md:text-[10px] font-bold uppercase px-1.5 md:px-2 py-0.5 md:py-1 bg-[#ff4800] text-black border border-black md:border-2">
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
        </section>
    );
}
