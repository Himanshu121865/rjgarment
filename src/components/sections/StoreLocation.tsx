'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';

export function StoreLocation() {
    const [interacted, setInteracted] = useState(false);
    const [mapKey, setMapKey] = useState(0);
    const mapContainerRef = useRef<HTMLDivElement>(null);

    const recenter = () => {
        setMapKey((k) => k + 1);
        setInteracted(false);
    };

    return (
        <section id="store-location" className="bg-black py-24 md:py-32 px-4 md:px-12 border-b-8 border-white scroll-mt-28">
            <h2 className="text-[#ff4800] text-4xl md:text-8xl font-black uppercase tracking-tighter mb-12 md:mb-16 underline decoration-white decoration-4 md:decoration-8 underline-offset-4 md:underline-offset-8">Visit Us</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center max-w-7xl mx-auto">
                <div className="space-y-6 md:space-y-8">
                    <div className="border-4 md:border-8 border-white bg-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] md:shadow-[16px_16px_0px_0px_rgba(255,255,255,1)]">
                        <p className="text-white font-mono text-xs md:text-sm uppercase tracking-widest mb-3 md:mb-4">Flagship Store</p>
                        <h3 className="text-white text-4xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9]">
                            India<br />Gate
                        </h3>
                        <div className="w-full h-1.5 md:h-2 bg-[#ff4800] my-4 md:my-6" />
                        <p className="text-gray-400 font-mono text-xs md:text-sm uppercase tracking-wider">
                            New Delhi, India
                        </p>
                    </div>
                    <motion.a
                        href="https://www.google.com/maps/dir/?api=1&destination=India+Gate,+New+Delhi,+India"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02, x: -4, y: -4, boxShadow: '12px 12px 0px 0px rgba(255,255,255,1)' }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center justify-center gap-3 border-4 border-white bg-[#ff4800] px-6 md:px-8 py-4 md:py-5 font-black uppercase tracking-widest text-black shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] md:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]"
                    >
                        <MapPin size={24} className="md:size-7" />
                        Get Directions
                        <ArrowRight strokeWidth={3} size={20} className="md:size-6" />
                    </motion.a>
                    <div className="flex gap-3 md:gap-4">
                        <div className="border-4 border-white bg-[#ff4800] p-4 md:p-6 flex-1 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] md:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
                            <p className="font-black text-xl md:text-2xl text-black">Mon–Sat</p>
                            <p className="font-mono text-xs md:text-sm font-bold text-black uppercase">10:00 – 20:00</p>
                        </div>
                        <div className="border-4 border-white bg-black p-4 md:p-6 flex-1 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] md:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
                            <p className="font-black text-xl md:text-2xl text-white">Sunday</p>
                            <p className="font-mono text-xs md:text-sm font-bold text-white uppercase">12:00 – 18:00</p>
                        </div>
                    </div>
                </div>
                <div
                    ref={mapContainerRef}
                    onMouseEnter={() => setInteracted(true)}
                    className="relative border-4 md:border-8 border-white shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] md:shadow-[16px_16px_0px_0px_rgba(255,255,255,1)]"
                >
                    <div className="border-4 border-[#ff4800] m-1.5 md:m-2 overflow-hidden">
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
