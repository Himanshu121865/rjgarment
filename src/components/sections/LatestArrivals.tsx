'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { RecentItem } from '@/lib/helpers/season';
import { ColorRevealImg } from '@/components/ui/ColorRevealImg';

export function LatestArrivals() {
    const [items, setItems] = useState<RecentItem[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [page, setPage] = useState(0);
    const [perPage, setPerPage] = useState(6);
    const headingRef = useRef<HTMLHeadingElement>(null);
    const initial = useRef(true);

    useEffect(() => {
        const mq = window.matchMedia('(min-width: 768px)');
        setPerPage(mq.matches ? 8 : 6);
        const handler = (e: MediaQueryListEvent) => {
            setPerPage(e.matches ? 8 : 6);
            setPage(0);
        };
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    useEffect(() => {
        if (initial.current) { initial.current = false; return; }
        headingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, [page]);

    useEffect(() => {
        fetch('/api/public/recent')
            .then((r) => r.json())
            .then((data) => { setItems(data.files || []); setLoaded(true); })
            .catch(() => setLoaded(true));
    }, []);

    const totalPages = Math.max(1, Math.ceil(items.length / perPage));
    const currentPage = Math.min(page, totalPages - 1);
    const start = currentPage * perPage;
    const pageItems = items.slice(start, start + perPage);

    return (
        <section className="bg-white py-24 md:py-32 px-6 md:px-12 border-b-8 border-black">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-12 border-b-8 border-black pb-6">
                    <div>
                        <h2 ref={headingRef} className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-black leading-none scroll-mt-24">
                            Latest<br />Arrivals
                        </h2>
                        <p className="font-mono text-[10px] md:text-xs text-gray-500 mt-2">
                            Page {currentPage + 1} of {totalPages}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3">
                        <span className="w-3 h-3 md:w-4 md:h-4 bg-[#ff4800]" />
                        <span className="font-mono text-[10px] md:text-xs font-bold uppercase tracking-widest text-black">Last 7 days</span>
                    </div>
                </div>

                {!loaded && (
                    <div className="flex items-center justify-center py-32 gap-3">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                animate={{ scaleY: [0.4, 1, 0.4] }}
                                transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15, ease: 'easeInOut' }}
                                className="w-4 h-16 origin-bottom border-4 border-black bg-[#ff4800]"
                            />
                        ))}
                    </div>
                )}

                {loaded && pageItems.length === 0 && (
                    <p className="font-mono text-sm md:text-base text-gray-500 uppercase tracking-widest mt-8 text-center">
                        No new arrivals in the last 7 days
                    </p>
                )}

                {loaded && pageItems.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
                        {pageItems.map((item, i) => (
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
                )}

                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-16 border-t-4 border-black pt-8">
                        <button
                            onClick={() => setPage((p) => Math.max(0, p - 1))}
                            disabled={currentPage === 0}
                            className="border-4 border-black bg-white px-8 py-3 font-black uppercase text-sm tracking-widest text-black hover:bg-[#ff4800] transition-colors disabled:opacity-30 disabled:hover:bg-white cursor-pointer"
                        >
                            Prev
                        </button>
                        <span className="font-mono text-xs text-gray-500">
                            {currentPage + 1} / {totalPages}
                        </span>
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                            disabled={currentPage === totalPages - 1}
                            className="border-4 border-black bg-white px-8 py-3 font-black uppercase text-sm tracking-widest text-black hover:bg-[#ff4800] transition-colors disabled:opacity-30 disabled:hover:bg-white cursor-pointer"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
