'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

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
