'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, Star, Hexagon, Zap, MapPin, ShoppingBag, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export const BrutalReveal = ({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) => {
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
};


export function NoiseOverlay() {
    return (
        <div className="pointer-events-none fixed inset-0 z-[100] opacity-[0.04] mix-blend-difference">
            <svg className="h-full w-full">
                <filter id="noiseFilter">
                    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" />
                </filter>
                <rect width="100%" height="100%" filter="url(#noiseFilter)" />
            </svg>
        </div>
    );
}

export function BrutalButton({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <motion.button
            whileHover={{ scale: 1.02, x: -4, y: -4, boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)' }}
            whileTap={{ scale: 0.98, x: 0, y: 0, boxShadow: '2px 2px 0px 0px rgba(0,0,0,1)' }}
            className={cn(
                "relative flex items-center justify-center gap-2 border-4 border-black bg-[#ff4800] px-8 py-4 font-black uppercase tracking-widest text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all",
                className
            )}
        >
            {children}
            <ArrowRight strokeWidth={3} />
        </motion.button>
    );
}

export function TiltCard() {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const xSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const ySpring = useSpring(y, { stiffness: 300, damping: 30 });
    const rotateX = useTransform(ySpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
    const rotateY = useTransform(xSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
    };

    const handleMouseLeave = () => {
        x.set(0); y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ transformStyle: "preserve-3d", rotateX, rotateY }}
            className="relative aspect-square w-full max-w-md rounded-none border-4 border-black bg-white p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] transition-shadow duration-300 z-10"
        >
            <div style={{ transform: "translateZ(60px)" }} className="flex h-full flex-col justify-between border-4 border-black bg-[#ff4800] p-6 selection:bg-black selection:text-[#ff4800]">
                <Hexagon size={64} fill="black" className="text-black" strokeWidth={1.5} />
                <div>
                    <h3 className="text-5xl font-black uppercase leading-[0.9] tracking-tighter text-black">
                        Wear
                        <br />
                        The
                        <br />
                        Statement
                    </h3>
                </div>
            </div>
        </motion.div>
    );
}

export function Marquee({ text = "RAW POWER", bg = "bg-white", color = "text-black" }) {
    return (
        <div className={cn("relative flex overflow-x-hidden border-y-4 border-black py-4", bg)}>
            <motion.div
                className="flex whitespace-nowrap"
                animate={{ x: "-50%" }}
                transition={{ repeat: Infinity, ease: "linear", duration: 8 }}
            >
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-8 px-8">
                        <span className={cn("text-5xl md:text-7xl font-black uppercase italic tracking-tighter", color)}>
                            {text}
                        </span>
                        <Star className={cn("fill-current", color)} size={48} />
                    </div>
                ))}
            </motion.div>
        </div>
    );
}

export function NavBar() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const links = [
        { label: 'Shop', href: '#' },
        { label: 'Collections', href: '/collections', internal: true },
        { label: 'About', href: '#' },
        { label: 'Contact', href: '#' },
        { label: 'Location', href: '/#store-location', icon: MapPin, internal: true },
    ];

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-[#E0E0E0] border-b-4 border-black">
            <div className="flex items-center justify-between px-6 py-4">
                <button onClick={() => { if (pathname === '/') window.scrollTo({ top: 0, behavior: 'smooth' }); else router.push('/'); }} className="font-black text-2xl uppercase tracking-tighter text-black hover:text-[#ff4800] transition-colors cursor-pointer">
                    RJ GARMENT
                </button>

                <div className="hidden md:flex items-center gap-8">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isCurrentPage = link.internal && pathname === link.href.split('#')[0];
                        const cls = "group flex items-center gap-1 font-bold uppercase text-sm tracking-widest text-black hover:text-[#ff4800] transition-colors border-b-2 border-transparent hover:border-[#ff4800] pb-1";
                        if (isCurrentPage) {
                            return (
                                <button key={link.label} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={`${cls} cursor-pointer`}>
                                    {Icon && <Icon size={16} />}
                                    {link.label}
                                </button>
                            );
                        }
                        if (link.internal) {
                            return (
                                <Link key={link.label} href={link.href} className={cls}>
                                    {Icon && <Icon size={16} className="group-hover:scale-110 transition-transform" />}
                                    {link.label}
                                </Link>
                            );
                        }
                        return (
                            <a key={link.label} href={link.href} className={cls}>
                                {Icon && <Icon size={16} className="group-hover:scale-110 transition-transform" />}
                                {link.label}
                            </a>
                        );
                    })}
                    <motion.button
                        whileHover={{ scale: 1.02, x: -2, y: -2, boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 border-2 border-black bg-[#ff4800] px-5 py-2 font-black uppercase text-xs tracking-widest text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                    >
                        <ShoppingBag size={16} />
                        Cart (0)
                    </motion.button>
                </div>

                <button
                    onClick={() => setOpen(!open)}
                    className="md:hidden border-2 border-black p-2 hover:bg-black hover:text-white transition-colors"
                >
                    {open ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {open && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="md:hidden border-t-4 border-black bg-[#E0E0E0] overflow-hidden"
                >
                    <div className="flex flex-col px-6 pb-6 pt-4 gap-3">
                        {links.map((link) => {
                            const Icon = link.icon;
                            const isCurrentPage = link.internal && pathname === link.href.split('#')[0];
                            const cls = "flex items-center gap-3 font-black uppercase text-lg tracking-tighter text-black hover:text-[#ff4800] transition-colors border-b-2 border-black pb-2";
                            if (isCurrentPage) {
                                return (
                                    <button key={link.label} onClick={() => { setOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className={`${cls} cursor-pointer text-left`}>
                                        {Icon && <Icon size={20} />}
                                        {link.label}
                                    </button>
                                );
                            }
                            if (link.internal) {
                                return (
                                    <Link key={link.label} href={link.href} onClick={() => setOpen(false)} className={cls}>
                                        {Icon && <Icon size={20} />}
                                        {link.label}
                                    </Link>
                                );
                            }
                            return (
                                <a key={link.label} href={link.href} onClick={() => setOpen(false)} className={cls}>
                                    {Icon && <Icon size={20} />}
                                    {link.label}
                                </a>
                            );
                        })}
                        <button
                            onClick={() => setOpen(false)}
                            className="flex items-center justify-center gap-2 border-2 border-black bg-[#ff4800] px-5 py-3 font-black uppercase text-sm tracking-widest text-black mt-2 cursor-pointer"
                        >
                            <ShoppingBag size={16} />
                            Cart (0)
                        </button>
                    </div>
                </motion.div>
            )}
        </nav>
    );
}


function BrutalHero({ title, subtitle }: { title: string, subtitle: string }) {
    return (
        <section className="relative min-h-screen flex flex-col md:flex-row items-center justify-center p-6 md:p-12 overflow-hidden bg-[#E0E0E0] z-10 pt-24 border-b-8 border-black">
            
            <div className="w-full md:w-1/2 flex flex-col justify-center space-y-8 z-20 mix-blend-exclusion text-white">
                <h1 className="text-7xl md:text-[8rem] leading-[0.85]"><BrutalReveal text={title} /></h1>
                <p className="font-mono text-xl md:text-2xl font-bold uppercase tracking-widest max-w-lg border-l-4 border-white pl-4">
                    {subtitle}
                </p>
                <div className="pt-8">
                    <BrutalButton className="bg-white text-black border-white hover:bg-[#ff4800]">SHOP NOW</BrutalButton>
                </div>
            </div>

            <div className="w-full md:w-1/2 flex justify-center mt-12 md:mt-0">
                <TiltCard />
            </div>

            <div className="absolute bottom-6 left-6 font-mono font-bold uppercase text-xs hidden md:block mix-blend-exclusion text-white">
                <div>COLLECTION: FW26</div>
                <div>LIMITED RELEASE</div>
            </div>
        </section>
    );
}

type Season = 'Spring' | 'Summer' | 'Fall' | 'Winter';

const SEASON_ORDER: Season[] = ['Spring', 'Summer', 'Fall', 'Winter'];

function getSeason(dateStr: string): Season {
    const month = new Date(dateStr).getMonth();
    if (month >= 2 && month <= 4) return 'Spring';
    if (month >= 5 && month <= 7) return 'Summer';
    if (month >= 8 && month <= 10) return 'Fall';
    return 'Winter';
}

interface RecentItem {
    url: string;
    type: string;
    displayName: string | null;
    price: number | null;
    createdAt: string;
}

function LatestArrivals() {
    const [items, setItems] = useState<RecentItem[]>([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        fetch('/api/public/recent')
            .then((r) => r.json())
            .then((data) => { setItems(data.files || []); setLoaded(true); })
            .catch(() => setLoaded(true));
    }, []);

    if (!loaded || !items.length) return null;

    const grouped: Record<Season, RecentItem[]> = { Spring: [], Summer: [], Fall: [], Winter: [] };
    items.forEach((item) => {
        const s = getSeason(item.createdAt);
        grouped[s].push(item);
    });

    const currentSeason = getSeason(new Date().toISOString());

    return (
        <section className="bg-white py-24 md:py-32 px-6 md:px-12 border-b-8 border-black">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-12 border-b-8 border-black pb-6">
                    <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-black leading-none">
                        Latest<br />Arrivals
                    </h2>
                    <div className="flex items-center gap-3">
                        <span className="w-4 h-4 bg-[#ff4800]" />
                        <span className="font-mono text-xs font-bold uppercase tracking-widest text-black">Last 7 days</span>
                    </div>
                </div>

                {SEASON_ORDER.map((season) => {
                    const seasonItems = grouped[season];
                    if (!seasonItems.length) return null;
                    const isCurrent = season === currentSeason;
                    return (
                        <div key={season} className="mb-14 last:mb-0">
                            <div className="flex items-center gap-4 mb-6 border-b-4 border-black pb-3">
                                <span className={cn(
                                    "font-mono text-xs font-bold uppercase px-3 py-1 border-2 border-black",
                                    isCurrent ? "bg-[#ff4800] text-black" : "bg-black text-white"
                                )}>
                                    {isCurrent ? 'Now showing' : 'Archive'}
                                </span>
                                <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black">
                                    {season}
                                </h3>
                                <span className="font-mono text-xs text-gray-500">{seasonItems.length} item{seasonItems.length !== 1 ? 's' : ''}</span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                                {seasonItems.map((item, i) => (
                                    <motion.div
                                        key={item.url}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.05 }}
                                        className="group relative border-4 border-black bg-[#E0E0E0] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-shadow duration-300"
                                    >
                                        <div className="aspect-[4/5] overflow-hidden bg-black">
                                            {item.type === 'image' ? (
                                                <img
                                                    src={item.url}
                                                    alt={item.displayName || 'New arrival'}
                                                    className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                                                />
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
                                        <div className="p-4 space-y-2 border-t-4 border-black">
                                            <p className="font-black text-sm uppercase tracking-tighter text-black truncate">
                                                {item.displayName || 'Untitled'}
                                            </p>
                                            {item.price != null && item.price > 0 && (
                                                <p className="font-mono text-sm font-bold text-black">
                                                    ₹{Number(item.price).toFixed(2)}
                                                </p>
                                            )}
                                        </div>
                                        <div className="absolute top-2 right-2">
                                            <span className="font-mono text-[10px] font-bold uppercase px-2 py-1 bg-[#ff4800] text-black border-2 border-black">
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

function BrutalStatement({ statement }: { statement: string }) {
    const sectionRef = useRef(null);
    return (
        <section ref={sectionRef} className="bg-black text-white px-6 py-32 md:p-32 border-b-8 border-[#ff4800]">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl md:text-7xl font-black uppercase leading-[1.1] tracking-tighter">
                    <BrutalReveal text={statement} />
                </h2>
                <div className="mt-16 w-full h-8 border-4 border-white overflow-hidden relative">
                    <motion.div 
                        initial={{ width: "0%" }}
                        whileInView={{ width: "100%" }}
                        transition={{ duration: 1.5, ease: "circOut" }}
                        className="absolute top-0 left-0 h-full bg-[#ff4800]"
                    />
                </div>
            </div>
        </section>
    );
}

function CinematicStack() {
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
                            "sticky border-8 border-black p-8 md:p-16 flex flex-col justify-between shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] min-h-[50vh] transition-transform duration-300",
                            card.bg, card.text
                        )}
                        style={{ top: `calc(15vh + ${i * 40}px)` }}
                    >
                        <div className="flex justify-between items-start">
                            <span className="font-mono text-2xl md:text-4xl font-bold uppercase border-2 p-2 px-4 shadow-[4px_4px_0px_0px_currentColor]">0{i+1}</span>
                            <Zap size={64} className="stroke-current" />
                        </div>
                        <div>
                            <h3 className="text-7xl md:text-[10rem] font-black tracking-tighter uppercase leading-[0.8]">{card.title}</h3>
                            <p className="font-mono text-xl md:text-3xl font-bold uppercase mt-8 border-l-8 pl-6 border-current">{card.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

function StoreLocation() {
    const [interacted, setInteracted] = useState(false);
    const [mapKey, setMapKey] = useState(0);
    const mapContainerRef = useRef<HTMLDivElement>(null);

    const recenter = () => {
        setMapKey((k) => k + 1);
        setInteracted(false);
    };

    return (
        <section id="store-location" className="bg-black py-32 px-6 md:px-12 border-b-8 border-white">
            <h2 className="text-[#ff4800] text-5xl md:text-8xl font-black uppercase tracking-tighter mb-16 underline decoration-white decoration-8 underline-offset-8">Visit Us</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
                <div className="space-y-8">
                    <div className="border-8 border-white bg-black p-8 shadow-[16px_16px_0px_0px_rgba(255,255,255,1)]">
                        <p className="text-white font-mono text-sm uppercase tracking-widest mb-4">Flagship Store</p>
                        <h3 className="text-white text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9]">
                            India<br />Gate
                        </h3>
                        <div className="w-full h-2 bg-[#ff4800] my-6" />
                        <p className="text-gray-400 font-mono text-sm uppercase tracking-wider">
                            New Delhi, India
                        </p>
                    </div>
                    <motion.a
                        href="https://www.google.com/maps/dir/?api=1&destination=India+Gate,+New+Delhi,+India"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02, x: -4, y: -4, boxShadow: '12px 12px 0px 0px rgba(255,255,255,1)' }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center justify-center gap-3 border-4 border-white bg-[#ff4800] px-8 py-5 font-black uppercase tracking-widest text-black shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]"
                    >
                        <MapPin size={28} />
                        Get Directions
                        <ArrowRight strokeWidth={3} size={24} />
                    </motion.a>
                    <div className="flex gap-4">
                        <div className="border-4 border-white bg-[#ff4800] p-6 flex-1 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
                            <p className="font-black text-2xl text-black">Mon–Sat</p>
                            <p className="font-mono text-sm font-bold text-black uppercase">10:00 – 20:00</p>
                        </div>
                        <div className="border-4 border-white bg-black p-6 flex-1 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
                            <p className="font-black text-2xl text-white">Sunday</p>
                            <p className="font-mono text-sm font-bold text-white uppercase">12:00 – 18:00</p>
                        </div>
                    </div>
                </div>
                <div
                    ref={mapContainerRef}
                    onMouseEnter={() => setInteracted(true)}
                    className="relative border-8 border-white shadow-[16px_16px_0px_0px_rgba(255,255,255,1)]"
                >
                    <div className="border-4 border-[#ff4800] m-2 overflow-hidden">
                        <iframe
                            key={mapKey}
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.668789851382!2d77.229485!3d28.612912!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce2daa9eb4d0b%3A0x717c4da1ec3f5d35!2sIndia+Gate!5e0!3m2!1sen!2sin!4v1"
                            width="100%"
                            height="450"
                            style={{ border: 0, filter: 'grayscale(100%) contrast(120%)' }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Store Location"
                        />
                    </div>

                    <motion.button
                        initial={false}
                        animate={interacted ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                        onClick={recenter}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 border-4 border-black bg-white px-5 py-3 font-black uppercase text-xs tracking-widest text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    >
                        <MapPin size={18} />
                        Recenter
                    </motion.button>
                </div>
            </div>
        </section>
    );
}

function BrutalGallery({ images }: { images: string[] }) {
    const ref = useRef(null);
    
    useEffect(() => {
        const triggers = gsap.utils.toArray('.img-block');
        triggers.forEach((el: any) => {
            gsap.fromTo(el, 
                { scale: 0.85, filter: 'grayscale(100%) contrast(200%)' },
                { 
                    scale: 1, filter: 'grayscale(0%) contrast(100%)', duration: 1.2, ease: 'expo.out',
                    scrollTrigger: { trigger: el, start: "top 80%", scrub: 1 }
                }
            );
        });
    }, []);

    return (
        <section className="bg-[#E0E0E0] py-32 px-6 md:px-12">
            <h2 className="text-6xl md:text-[8rem] font-black uppercase text-center mb-24 border-y-8 border-black py-8 bg-white shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] tracking-tighter">Visual Archive</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 max-w-7xl mx-auto" ref={ref}>
                {images.map((img, i) => (
                    <div key={i} className={cn("img-block relative border-8 border-black bg-white p-4 shadow-[24px_24px_0px_0px_rgba(0,0,0,1)]", i % 2 !== 0 ? "md:mt-48" : "")}>
                        <img src={img} alt={`gallery-${i}`} className="w-full aspect-[3/4] object-cover grayscale hover:grayscale-0 transition-all duration-700 hover:scale-105" />
                        <div className="absolute top-0 right-0 bg-[#ff4800] text-black font-black text-5xl p-6 border-l-8 border-b-8 border-black z-10">IMG_{i+1}</div>
                    </div>
                ))}
            </div>
        </section>
    );
}

function BrutalFooter() {
    return (
        <footer className="bg-black text-white pt-32 overflow-hidden border-t-8 border-[#ff4800]">
            <div className="px-6 md:px-12 flex flex-col lg:flex-row justify-between pb-32 border-b-8 border-white gap-16">
                <h2 className="text-[15vw] lg:text-[10vw] font-black uppercase leading-[0.8] tracking-tighter">
                    <span className="text-[#ff4800]">Stay</span><br/>Heavy.
                </h2>
                <div className="flex flex-col justify-end font-mono text-3xl md:text-5xl font-bold uppercase space-y-6">
                    <a href="#" className="flex items-center gap-4 hover:text-[#ff4800] hover:pl-8 transition-all group border-b-4 border-transparent hover:border-[#ff4800] pb-2">INSTAGRAM <ArrowRight className="hidden group-hover:block" size={40} /></a>
                    <a href="#" className="flex items-center gap-4 hover:text-[#ff4800] hover:pl-8 transition-all group border-b-4 border-transparent hover:border-[#ff4800] pb-2">TIKTOK <ArrowRight className="hidden group-hover:block" size={40} /></a>
                    <a href="#store-location" className="flex items-center gap-4 hover:text-[#ff4800] hover:pl-8 transition-all group border-b-4 border-transparent hover:border-[#ff4800] pb-2">STORE LOCATOR <ArrowRight className="hidden group-hover:block" size={40} /></a>
                </div>
            </div>
            <Marquee text="SYSTEM TERMINATED" bg="bg-[#ff4800]" color="text-black" />
        </footer>
    );
}

export interface BrutalismPageProps {
    heroTitle?: string;
    heroSubtitle?: string;
    statementText?: string;
    images?: string[];
}

export default function BrutalismPage({
    heroTitle = "RAJESH GARMENTS",
    heroSubtitle = "Bold cuts. Heavy fabrics. Unapologetic streetwear engineered for the concrete jungle.",
    statementText = "WE STRIP AWAY THE FLUFF. WHAT REMAINS IS PURE, UNFILTERED GARMENT ARCHITECTURE. FORM FOLLOWS IMPACT.",
    images = [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=2000&auto=format&fit=crop"
    ]
}: BrutalismPageProps = {}) {
    return (
        <div className="relative bg-[#E0E0E0] min-h-screen text-black selection:bg-[#ff4800] selection:text-black font-sans">
            <NoiseOverlay />
            <NavBar />
            <BrutalHero title={heroTitle} subtitle={heroSubtitle} />
            <Marquee text="STREETWEAR" />
            <LatestArrivals />
            <BrutalStatement statement={statementText} />
            <CinematicStack />
            <StoreLocation />
            <BrutalGallery images={images} />
            <BrutalFooter />
        </div>
    );
}
