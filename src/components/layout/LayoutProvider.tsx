'use client';

import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { NavBar } from './NavBar';
import { NoiseOverlay } from '@/components/ui/NoiseOverlay';
import { BrutalFooter } from '@/components/sections/BrutalFooter';
import { SavedItemsProvider } from '@/context/SavedItemsContext';

export function LayoutProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');

    const scrollDown = () => {
        if (pathname === '/') {
            const el = document.getElementById('visual-archive');
            if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
        }
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    };

    return (
        <SavedItemsProvider>
            <div className="flex flex-col min-h-screen">
                <NoiseOverlay />
                {!isAdmin && <NavBar />}
                <div className="flex-1">
                    {children}
                </div>
                {!isAdmin && <BrutalFooter />}

                <motion.button
                    onClick={scrollDown}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="fixed bottom-[88px] right-6 z-50 border-2 border-black bg-[#ff4800] p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                >
                    <ChevronDown size={24} className="text-black" />
                </motion.button>
            </div>
        </SavedItemsProvider>
    );
}
