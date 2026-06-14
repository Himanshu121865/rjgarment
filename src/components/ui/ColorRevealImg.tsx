'use client';

import { useRef } from 'react';
import { Heart } from 'lucide-react';
import { useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useSavedItems } from '@/context/SavedItemsContext';

interface ColorRevealImgProps {
    src: string;
    alt: string;
    className?: string;
    item?: { url: string; displayName: string | null; price: number | null; type: string; createdAt: string };
}

export function ColorRevealImg({ src, alt, className, item }: ColorRevealImgProps) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: false, amount: 0.6, margin: "-25% 0px -25% 0px" });
    const { toggleSave, isSaved } = useSavedItems();
    const saved = item ? isSaved(item.url) : false;
    return (
        <div ref={ref} className={cn("relative overflow-hidden h-full w-full group", className)}>
            <img
                src={src}
                alt={alt}
                className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105"
                style={{ filter: inView ? 'grayscale(0%)' : 'grayscale(100%)' }}
            />
            {item && (
                <button
                    onClick={() => toggleSave(item)}
                    className="absolute top-2 right-2 z-10 border-2 border-black bg-white p-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
                >
                    <Heart size={16} className={saved ? "text-[#ff4800]" : "text-black"} fill={saved ? "#ff4800" : "none"} />
                </button>
            )}
        </div>
    );
}
