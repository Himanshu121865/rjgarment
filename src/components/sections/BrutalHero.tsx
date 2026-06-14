'use client';

import Link from 'next/link';
import { useMotionValue } from 'framer-motion';
import { BrutalButton } from '@/components/ui/BrutalButton';
import { TiltCard } from '@/components/ui/TiltCard';
import { MagneticChar } from '@/components/ui/MagneticHover';
import Ferrofluid from '@/components/ui/Ferrofluid';

export function BrutalHero({ title }: { title: string }) {
    const mouseX = useMotionValue(-1000);
    const mouseY = useMotionValue(-1000);

    return (
        <section
            className="relative min-h-screen flex flex-col md:flex-row items-center justify-center p-6 md:p-12 overflow-hidden bg-black z-10 pt-24 border-b-8 border-black"
            onMouseMove={(e) => { mouseX.set(e.clientX); mouseY.set(e.clientY); }}
            onMouseLeave={() => { mouseX.set(-1000); mouseY.set(-1000); }}
        >
            <div className="absolute inset-0 z-0">
                <Ferrofluid
                    colors={["#ff4800", "#ff6b2b", "#ffffff"]}
                    speed={0.3}
                    scale={2}
                    turbulence={0.8}
                    fluidity={0.15}
                    rimWidth={0.25}
                    sharpness={2}
                    shimmer={1}
                    glow={1.5}
                    opacity={0.8}
                    flowDirection="down"
                    mouseInteraction={true}
                    mouseStrength={1.2}
                    mouseRadius={0.3}
                />
            </div>
            <div className="w-full md:w-1/2 flex flex-col justify-center space-y-8 z-20">
                <h1 className="flex flex-col leading-none">
                    {title.split(' ').map((word, wi) => (
                        <span key={wi} className="flex gap-1 md:gap-2">
                            {word.split('').map((char, ci) => (
                                <MagneticChar key={ci} char={char} mouseX={mouseX} mouseY={mouseY} activeColor="#ff4800" restColor="#ffffff" />
                            ))}
                        </span>
                    ))}
                </h1>
                <div className="pt-8">
                    <Link href="/collections">
                        <BrutalButton>COLLECTIONS</BrutalButton>
                    </Link>
                </div>
            </div>
            <div className="w-full md:w-1/2 flex justify-center mt-12 md:mt-0 z-20">
                <TiltCard />
            </div>
            <div className="absolute bottom-6 left-6 font-mono font-bold uppercase text-xs hidden md:block mix-blend-exclusion text-white z-20">
                <div>COLLECTION: FW26</div>
                <div>LIMITED RELEASE</div>
            </div>
        </section>
    );
}
