'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export function BrutalReveal({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
    const elRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = elRef.current;
        if (!el) return;
        const words = el.querySelectorAll('.brutal-word');
        gsap.fromTo(words,
            { opacity: 0, y: 50, rotateX: -90, transformOrigin: "0% 50% -50%" },
            {
                opacity: 1, y: 0, rotateX: 0,
                duration: 0.9, stagger: 0.05, delay, ease: "power4.out",
                scrollTrigger: { trigger: el, start: "top 90%" }
            }
        );
    }, [delay]);

    return (
        <div ref={elRef} className={cn("inline-block", className)} style={{ perspective: "1000px" }}>
            {text.split(' ').map((word, i) => (
                <span key={i} className="brutal-word opacity-0 inline-block mr-[0.3em] font-black uppercase tracking-tighter">
                    {word}
                </span>
            ))}
        </div>
    );
}
