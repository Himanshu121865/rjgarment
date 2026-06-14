'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, MapPin, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSavedItems } from '@/context/SavedItemsContext';

export function NavBar() {
    const [open, setOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const pathname = usePathname();
    const router = useRouter();
    const { count } = useSavedItems();

    useEffect(() => {
        const el = document.getElementById('store-location');
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => setActiveSection(entry.isIntersecting ? 'store-location' : null),
            { threshold: 0.3 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const links = [
        { label: 'Home', href: '/', internal: true },
        { label: 'Collections', href: '/collections', internal: true },
        { label: 'Contact', href: '/contact', internal: true },
        { label: 'Location', href: '/#store-location', icon: MapPin, internal: true },
    ];

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-[#E0E0E0] border-b-4 border-black">
            <div className="flex items-center justify-between px-4 md:px-6 py-4">
                <motion.button
                    onClick={() => { if (pathname === '/') window.scrollTo({ top: 0, behavior: 'smooth' }); else router.push('/'); }}
                    whileHover={{ scale: 1.02, x: -1, y: -1, boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)' }}
                    whileTap={{ scale: 0.92, rotate: -3, boxShadow: '0px 0px 0px 0px rgba(0,0,0,1)' }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="font-black text-lg md:text-2xl uppercase tracking-tighter text-black bg-white border-2 border-black px-3 md:px-4 py-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer whitespace-nowrap"
                >
                    RJ GARMENT
                </motion.button>

                <div className="hidden md:flex items-center gap-8">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isCurrentPage = link.internal && (
                            (link.href.includes('#') && activeSection === link.href.split('#')[1]) ||
                            (!link.href.includes('#') && pathname === link.href)
                        );
                        const cls = `group flex items-center gap-1 font-bold uppercase text-sm tracking-widest pb-1 transition-colors border-b-2 ${isCurrentPage ? 'text-[#ff4800] border-[#ff4800]' : 'text-black border-transparent hover:text-[#ff4800] hover:border-[#ff4800]'}`;
                        if (link.href.includes('#') || isCurrentPage) {
                            const hash = link.href.split('#')[1];
                            return (
                                <button key={link.label} onClick={() => {
                                    if (hash) {
                                        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
                                    } else {
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }
                                }} className={`${cls} cursor-pointer`}>
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
                    <Link
                        href="/saved"
                        className={`flex items-center gap-2 border-2 px-5 py-2 font-black uppercase text-xs tracking-widest transition-all ${pathname === '/saved' ? 'border-[#ff4800] bg-white text-[#ff4800] shadow-[4px_4px_0px_0px_#ff4800]' : 'border-black bg-[#ff4800] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5'}`}
                    >
                        <Heart size={16} />
                        Saved
                        {count > 0 && <span className="text-[10px] leading-none">({count})</span>}
                    </Link>
                </div>

                <button
                    onClick={() => setOpen(!open)}
                    className="md:hidden border-2 border-black p-3 hover:bg-black hover:text-white transition-colors flex-shrink-0"
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
                            const isCurrentPage = link.internal && (
                                (link.href.includes('#') && activeSection === link.href.split('#')[1]) ||
                                (!link.href.includes('#') && pathname === link.href)
                            );
                            const cls = `flex items-center gap-3 font-black uppercase text-lg tracking-tighter transition-colors border-b-2 pb-2 ${isCurrentPage ? 'text-[#ff4800] border-[#ff4800]' : 'text-black border-black hover:text-[#ff4800]'}`;
                        if (link.href.includes('#') || isCurrentPage) {
                                const hash = link.href.split('#')[1];
                                return (
                                    <button key={link.label} onClick={() => {
                                        setOpen(false);
                                        if (hash) {
                                            document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
                                        } else {
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }
                                    }} className={`${cls} cursor-pointer text-left`}>
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
                        <Link
                            href="/saved"
                            onClick={() => setOpen(false)}
                            className={`flex items-center justify-center gap-2 border-2 px-5 py-3 font-black uppercase text-sm tracking-widest mt-2 cursor-pointer transition-all ${pathname === '/saved' ? 'border-[#ff4800] bg-white text-[#ff4800]' : 'border-black bg-[#ff4800] text-black'}`}
                        >
                            <Heart size={16} />
                            Saved
                            {count > 0 && <span className="text-[10px] leading-none">({count})</span>}
                        </Link>
                    </div>
                </motion.div>
            )}
        </nav>
    );
}
