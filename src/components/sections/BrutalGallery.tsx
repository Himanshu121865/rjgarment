'use client';

import { cn } from '@/lib/utils';
import { ColorRevealImg } from '@/components/ui/ColorRevealImg';

export function BrutalGallery({ images }: { images: string[] }) {
    return (
        <section id="visual-archive" className="bg-[#E0E0E0] py-16 md:py-32 px-4 md:px-12 scroll-mt-24">
            <h2 className="text-4xl md:text-[8rem] font-black uppercase text-center mb-12 md:mb-24 border-y-4 md:border-y-8 border-black py-6 md:py-8 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] tracking-tighter">Visual Archive</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-32 max-w-7xl mx-auto">
                {images.map((img, i) => (
                    <div key={i} className={cn("relative border-4 md:border-8 border-black bg-white p-2 md:p-4 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] md:shadow-[24px_24px_0px_0px_rgba(0,0,0,1)]", i % 2 !== 0 ? "md:mt-48" : "")}>
                        <ColorRevealImg src={img} alt={`gallery-${i}`} className="aspect-[4/5] md:aspect-[3/4]" />
                        <div className="absolute top-0 right-0 bg-[#ff4800] text-black font-black text-3xl md:text-5xl p-3 md:p-6 border-l-4 md:border-l-8 border-b-4 md:border-b-8 border-black z-10">IMG_{i+1}</div>
                    </div>
                ))}
            </div>
        </section>
    );
}
