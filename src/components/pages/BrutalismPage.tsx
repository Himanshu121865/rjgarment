'use client';

import { Marquee } from '@/components/ui/Marquee';
import { BrutalHero } from '@/components/sections/BrutalHero';
import { LatestArrivals } from '@/components/sections/LatestArrivals';
import { BrutalStatement } from '@/components/sections/BrutalStatement';
import { StoreLocation } from '@/components/sections/StoreLocation';
import { BrutalGallery } from '@/components/sections/BrutalGallery';
export interface BrutalismPageProps {
    heroTitle?: string;
    statementText?: string;
    images?: string[];
}

export default function BrutalismPage({
    heroTitle = "RAJESH GARMENTS",
    statementText = "CLOTHING FOR THE CONCRETE JUNGLE",
    images = [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=2000&auto=format&fit=crop"
    ]
}: BrutalismPageProps = {}) {
    return (
        <div className="relative bg-[#E0E0E0] text-black selection:bg-[#ff4800] selection:text-black font-sans">
            <BrutalHero title={heroTitle} />
            <Marquee items={["STREETWEAR", "MENS WEAR", "KID WEAR"]} bg="bg-[#ff4800]" color="text-black" duration={55} />
            <LatestArrivals />
            <BrutalStatement statement={statementText} />
            <StoreLocation />
            <BrutalGallery images={images} />
        </div>
    );
}
