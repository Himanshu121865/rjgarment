import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CinematicStack() {
    const cards = [
        { title: 'RAW', desc: 'Heavy-weight fabrics. Unfinished edges. Uncompromising build.', bg: 'bg-white', text: 'text-black' },
        { title: 'LOUD', desc: 'Oversized silhouettes. Maximum presence. Zero apology.', bg: 'bg-[#ff4800]', text: 'text-black' },
        { title: 'PURE', desc: 'Monochrome palette. Structural integrity. Timeless form.', bg: 'bg-black', text: 'text-white border-white' },
    ];

    return (
        <section className="relative bg-[#E0E0E0] py-32 px-6 md:px-12">
            <h2 className="text-6xl md:text-9xl font-black uppercase mb-24 border-b-8 border-black pb-8 flex items-center justify-between">
                <span>Core Pillars</span>
                <span className="text-[#ff4800]">***</span>
            </h2>

            <div className="w-full max-w-5xl mx-auto relative pb-[20vh]">
                {cards.map((card, i) => (
                    <div
                        key={i}
                        className={cn(
                            "sticky border-4 md:border-8 border-black p-6 md:p-16 flex flex-col justify-between shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] min-h-[50vh] transition-transform duration-300",
                            card.bg, card.text
                        )}
                        style={{ top: `calc(10vh + ${i * 30}px)` }}
                    >
                        <div className="flex justify-between items-start">
                            <span className="font-mono text-xl md:text-4xl font-bold uppercase border-2 p-1.5 px-3 md:p-2 md:px-4 shadow-[4px_4px_0px_0px_currentColor]">0{i+1}</span>
                            <Zap size={36} className="md:size-16 stroke-current" />
                        </div>
                        <div>
                            <h3 className="text-5xl md:text-[10rem] font-black tracking-tighter uppercase leading-[0.8]">{card.title}</h3>
                            <p className="font-mono text-lg md:text-3xl font-bold uppercase mt-4 md:mt-8 border-l-4 md:border-l-8 pl-4 md:pl-6 border-current">{card.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
