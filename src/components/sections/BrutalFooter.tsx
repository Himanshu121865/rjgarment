'use client';

import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Marquee } from '@/components/ui/Marquee';

export function BrutalFooter() {
    const router = useRouter();

    const scrollToStore = () => {
        const el = document.getElementById('store-location');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            router.push('/#store-location');
        }
    };

    return (
        <footer className="bg-black text-white pt-20 md:pt-32 overflow-hidden border-t-8 border-[#ff4800]">
            <div className="px-6 md:px-12 flex flex-col lg:flex-row justify-between pb-20 md:pb-32 border-b-8 border-white gap-12 md:gap-16">
                <h2 className="text-[20vw] md:text-[15vw] lg:text-[10vw] font-black uppercase leading-[0.8] tracking-tighter">
                    <span className="text-[#ff4800]">Made</span><br/>To Last.
                </h2>
                <div className="flex flex-col justify-end font-mono text-2xl md:text-5xl font-bold uppercase space-y-4 md:space-y-6">
                    <a href="#" className="flex items-center gap-4 hover:text-[#ff4800] hover:pl-8 transition-all group border-b-4 border-transparent hover:border-[#ff4800] pb-2 min-h-[48px]">INSTAGRAM <span className="hidden group-hover:block"><ArrowRight size={32} /></span></a>
                    <a href="#" className="flex items-center gap-4 hover:text-[#ff4800] hover:pl-8 transition-all group border-b-4 border-transparent hover:border-[#ff4800] pb-2 min-h-[48px]">TIKTOK <span className="hidden group-hover:block"><ArrowRight size={32} /></span></a>
                    <button onClick={scrollToStore} className="flex items-center gap-4 hover:text-[#ff4800] hover:pl-8 transition-all group border-b-4 border-transparent hover:border-[#ff4800] pb-2 min-h-[48px] text-left cursor-pointer">STORE LOCATOR <span className="hidden group-hover:block"><ArrowRight size={32} /></span></button>
                </div>
            </div>
            <div className="border-t-8 border-white px-6 md:px-12 py-6 md:py-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="font-mono text-xs md:text-sm uppercase tracking-widest text-gray-400">
                        Built with <span className="text-[#ff4800] font-black">brutal</span> precision
                    </p>
                    <a href="mailto:himanshujha1218@gmail.com" className="font-mono text-xs md:text-sm font-bold uppercase tracking-widest text-white bg-black border-2 border-white px-4 py-2 hover:bg-[#ff4800] hover:text-black hover:border-[#ff4800] transition-all shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        himanshujha1218@gmail.com
                    </a>
                    <p className="font-mono text-[10px] md:text-xs text-gray-600 uppercase tracking-wider">
                        Need a website? Let&apos;s talk.
                    </p>
                </div>
            </div>
            <Marquee items={["FIXED PRICE"]} bg="bg-[#ff4800]" color="text-black" />
        </footer>
    );
}
