'use client';

import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

export function Marquee({ items = ["RAW POWER"], bg = "bg-white", color = "text-black", duration = 20 }: { items?: string[]; bg?: string; color?: string; duration?: number }) {
    return (
        <div className={cn("relative flex overflow-x-hidden border-y-4 border-black py-4", bg)}>
            <div
                className="flex whitespace-nowrap marquee-scroll"
                style={{ animationDuration: `${duration}s` }}
            >
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-8 px-8">
                        {items.map((item, j) => (
                            <div key={j} className="flex items-center gap-8">
                                <span className={cn("text-5xl md:text-7xl font-black uppercase italic tracking-tighter", color)}>
                                    {item}
                                </span>
                                <Star className={cn("fill-current shrink-0", color)} size={48} />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <style>{`
                .marquee-scroll {
                    animation: marquee linear infinite;
                    will-change: transform;
                    backface-visibility: hidden;
                }
                @keyframes marquee {
                    0% { transform: translate3d(0, 0, 0); }
                    100% { transform: translate3d(-50%, 0, 0); }
                }
            `}</style>
        </div>
    );
}
