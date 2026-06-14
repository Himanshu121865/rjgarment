'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { ColorRevealImg } from '@/components/ui/ColorRevealImg';
import { BrutalButton } from '@/components/ui/BrutalButton';
import { useSavedItems } from '@/context/SavedItemsContext';

export default function SavedPage() {
    const { savedItems, toggleSave } = useSavedItems();
    const [confirmClear, setConfirmClear] = useState(false);

    return (
        <div className="min-h-screen bg-[#E0E0E0] text-black pt-24">
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
                <div className="flex items-center justify-between mb-12 border-b-8 border-black pb-6">
                    <div>
                        <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-black leading-none">
                            Saved
                        </h1>
                        <p className="font-mono text-xs md:text-sm text-gray-500 mt-2 uppercase tracking-widest">
                            {savedItems.length} item{savedItems.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3">
                        <Heart size={20} className="text-[#ff4800]" fill="#ff4800" />
                    </div>
                </div>

                {savedItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <Heart size={64} className="text-gray-300 mb-6" />
                        <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-4">
                            Nothing saved yet
                        </h2>
                        <p className="font-mono text-sm text-gray-500 uppercase tracking-widest mb-8">
                            Tap the heart icon on any item to save it here
                        </p>
                        <Link href="/collections">
                            <BrutalButton>Browse Collections</BrutalButton>
                        </Link>
                    </div>
                ) : (
                    <>
                        {savedItems.length > 1 && (
                            <div className="flex justify-end mb-6">
                                {confirmClear ? (
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono text-xs font-bold uppercase tracking-wider">Clear all?</span>
                                        <button
                                            onClick={() => { savedItems.forEach((i) => toggleSave(i)); setConfirmClear(false); }}
                                            className="border-2 border-black bg-[#ff4800] px-3 py-1.5 font-black text-xs uppercase cursor-pointer"
                                        >
                                            Yes
                                        </button>
                                        <button
                                            onClick={() => setConfirmClear(false)}
                                            className="border-2 border-black bg-white px-3 py-1.5 font-black text-xs uppercase cursor-pointer"
                                        >
                                            No
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setConfirmClear(true)}
                                        className="flex items-center gap-2 border-2 border-black bg-white px-4 py-2 font-black text-xs uppercase hover:bg-[#ff4800] transition-colors cursor-pointer"
                                    >
                                        <Trash2 size={14} />
                                        Clear all
                                    </button>
                                )}
                            </div>
                        )}

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
                            {savedItems.map((item, i) => (
                                <motion.div
                                    key={item.url}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.03 }}
                                    className="group relative border-2 md:border-4 border-black bg-[#E0E0E0] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-shadow duration-300"
                                >
                                    <div className="aspect-[4/5] overflow-hidden bg-black">
                                        {item.type === 'image' ? (
                                            <ColorRevealImg src={item.url} alt={item.displayName || 'Saved item'} item={item} />
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
                                </motion.div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
