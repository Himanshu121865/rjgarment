"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

export function BrutalStatement({ statement }: { statement: string }) {
  const [barComplete, setBarComplete] = useState(false);
  const barRef = useRef(null);
  const barInView = useInView(barRef, { once: true, margin: "-100px" });

  return (
    <section className="bg-black text-white px-6 py-24 md:py-32 border-b-8 border-[#ff4800]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-8xl font-black uppercase leading-[1.1] tracking-tighter">
          {statement.split(" ").map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={barInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.08, ease: "easeOut" }}
              className="inline-block mr-[0.3em]"
            >
              {word}
            </motion.span>
          ))}
        </h2>
        <div
          ref={barRef}
          className="mt-16 w-full h-8 border-4 border-white overflow-hidden relative"
        >
          <motion.div
            initial={{ width: "0%" }}
            animate={barInView ? { width: "100%" } : {}}
            transition={{ duration: 1.5, ease: "circOut" }}
            onAnimationComplete={() => setBarComplete(true)}
            className="absolute top-0 left-0 h-full bg-[#ff4800]"
          />
        </div>

        {barComplete && (
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="font-mono text-lg md:text-2xl font-bold uppercase tracking-[0.3em] text-[#ff4800] mt-10 text-center"
          >
            RJ GARMENT · EST. 2020 · SANT NAGAR
          </motion.p>
        )}
      </div>
    </section>
  );
}
