'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import { Season, RecentItem, SEASON_ORDER, getSeason } from '@/lib/helpers/season';
import { ColorRevealImg } from '@/components/ui/ColorRevealImg';

type SeasonFilter = 'All' | Season;

interface Collection {
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

const seasonColors: Record<string, string> = {
    FW: 'bg-black text-white',
    SS: 'bg-white text-black',
};

function buildCollections(items: RecentItem[]): Collection[] {
    const grouped: Record<string, RecentItem[]> = {};
    items.forEach((item) => {
        const season = item.category || getSeason(item.createdAt);
        if (!grouped[season]) grouped[season] = [];
        grouped[season].push(item);
    });

    return Object.entries(grouped).map(([season, seasonItems], i) => {
        const year = new Date(seasonItems[0].createdAt).getFullYear().toString();
        const label = season === 'Fall' ? 'FW' : season === 'Spring' ? 'SS' : season.slice(0, 2).toUpperCase();
        return {
            id: `season-${i}`,
            season: `${season} ${year}`,
            seasonTag: season as Season,
            title: `${season.toUpperCase()} EDIT`,
            desc: `Curated ${season.toLowerCase()} collection. Heavy fabrics. Concrete attitude.`,
            year,
            hero: seasonItems[0]?.url || '',
            images: seasonItems.map((item) => item.url),
            colors: seasonItems.map(() => '#000000'),
        };
    });
}

function CollectionCard({ collection, onOpen }: { collection: Collection; onOpen: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
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
                            seasonColors[collection.season.slice(0, 2)] || 'bg-white text-black'
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
                    seasonColors[collection.season.slice(0, 2)] || 'bg-white text-black'
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

function CollectionDetail({ collection, onClose }: { collection: Collection; onClose: () => void }) {
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
                            seasonColors[collection.season.slice(0, 2)] || 'bg-white text-black'
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
                                    style={{ aspectRatio: i % 2 === 0 ? '3/4' : '4/5' }}
                                >
                                    <ColorRevealImg src={img} alt={`${collection.season} look ${i + 1}`} className="h-full" />
                                </motion.div>
                            ))}
                        </div>
                    )}

                    <div className="mt-12 md:mt-16 flex justify-center">
                        <motion.a
                            href="#"
                            whileHover={{ scale: 1.02, x: -2, y: -2, boxShadow: '6px 6px 0px 0px rgba(255,255,255,1)' }}
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

import { cn } from '@/lib/utils';

export default function CollectionsPage() {
    const [selected, setSelected] = useState<Collection | null>(null);
    const [filter, setFilter] = useState<SeasonFilter>('All');
    const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
    const [archiveItems, setArchiveItems] = useState<RecentItem[]>([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        Promise.all([
            fetch('/api/public/recent').then((r) => r.json()),
            fetch('/api/public/recent?older=true').then((r) => r.json()),
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
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = `${scrollbarWidth}px`;
        } else {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }
    }, [selected]);

    const filtered = filter === 'All'
        ? collections
        : collections.filter((c) => c.seasonTag === filter);

    const grouped: Record<Season, RecentItem[]> = { Spring: [], Summer: [], Fall: [], Winter: [] };
    recentItems.forEach((item) => {
        const s = (item.category || getSeason(item.createdAt)) as Season;
        if (grouped[s]) grouped[s].push(item);
    });
    const currentSeason = getSeason(new Date().toISOString());

    return (
        <div className="bg-[#E0E0E0] selection:bg-[#ff4800] selection:text-black">

            {/* COLLECTIONS */}
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
                        {(['All', 'Spring', 'Summer', 'Fall', 'Winter'] as SeasonFilter[]).map((s) => (
                            <button
                                key={s}
                                onClick={() => setFilter(s)}
                                className={cn(
                                    "font-mono text-[10px] md:text-xs font-bold uppercase tracking-widest px-4 md:px-4 py-2.5 md:py-2 border-2 border-black transition-all min-h-[44px]",
                                    filter === s
                                        ? "bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                        : "bg-transparent text-black hover:bg-gray-200"
                                )}
                            >
                                {s === 'All' ? 'All Seasons' : s}
                            </button>
                        ))}
                        <span className="font-mono text-[10px] md:text-xs text-gray-500 self-center ml-auto">{filtered.length} collection{filtered.length !== 1 ? 's' : ''}</span>
                    </div>

                    {recentItems.length > 0 && (
                        <div className="mb-12 md:mb-16 pb-8 md:pb-12 border-b-4 md:border-b-8 border-black">
                            <div className="flex items-center justify-between mb-6 md:mb-8">
                                <h2 className="text-2xl md:text-5xl font-black uppercase tracking-tighter text-black leading-none">
                                    Latest<br />Arrivals
                                </h2>
                                <span className="font-mono text-[10px] md:text-xs font-bold uppercase tracking-widest text-black">Last 7 days</span>
                            </div>
                            {SEASON_ORDER.map((season) => {
                                const seasonItems = grouped[season];
                                if (!seasonItems.length) return null;
                                const isCurrent = season === currentSeason;
                                return (
                                    <div key={season} className="mb-8 md:mb-10 last:mb-0">
                                        <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4 border-b-2 md:border-b-4 border-black pb-1.5 md:pb-2">
                                            <span className={cn(
                                                "font-mono text-[9px] md:text-[10px] font-bold uppercase px-1.5 md:px-2 py-0.5 md:py-1 border-2 border-black",
                                                isCurrent ? "bg-[#ff4800] text-black" : "bg-black text-white"
                                            )}>
                                                {isCurrent ? 'Now' : 'Arch'}
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
                                                        {item.type === 'image' ? (
                                                            <ColorRevealImg src={item.url} alt={item.displayName || ''} item={item} />
                                                        ) : (
                                                            <video src={item.url} className="h-full w-full object-cover" muted onMouseEnter={(e) => e.currentTarget.play()} onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }} />
                                                        )}
                                                    </div>
                                                    <div className="p-1.5 md:p-2 border-t-2 border-black">
                                                        <p className="font-black text-[9px] md:text-[10px] uppercase tracking-tighter text-black truncate">{item.displayName || 'Untitled'}</p>
                                                        {item.price != null && item.price > 0 && (
                                                            <p className="font-mono text-[9px] md:text-[10px] font-bold text-black">₹{Number(item.price).toFixed(2)}</p>
                                                        )}
                                                    </div>
                                                    <div className="absolute top-1 left-1">
                                                        <span className="font-mono text-[7px] md:text-[8px] font-bold uppercase px-1 md:px-1.5 py-0.5 bg-[#ff4800] text-black border border-black">NEW</span>
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
                                <CollectionCard
                                    collection={c}
                                    onOpen={() => setSelected(c)}
                                />
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
