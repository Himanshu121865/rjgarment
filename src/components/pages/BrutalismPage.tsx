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
        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop"
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
