"use client";

import React, { useRef } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimationFrame,
  MotionValue,
} from "framer-motion";

export const MagneticChar = ({
  char,
  mouseX,
  mouseY,
  activeColor,
  restColor = "#1a1a1a",
}: {
  char: string;
  mouseX: MotionValue;
  mouseY: MotionValue;
  activeColor: string;
  restColor?: string;
}) => {
  const isTouch = useRef(false);
  const ref = useRef<HTMLSpanElement>(null);
  const distance = useMotionValue(1000);

  React.useEffect(() => {
    isTouch.current = window.matchMedia(
      "(hover: none) and (pointer: coarse)",
    ).matches;
  }, []);

  useAnimationFrame(() => {
    if (!ref.current || isTouch.current) return;
    const rect = ref.current.getBoundingClientRect();
    const d = Math.sqrt(
      Math.pow(mouseX.get() - (rect.left + rect.width / 2), 2) +
        Math.pow(mouseY.get() - (rect.top + rect.height / 2), 2),
    );
    distance.set(d);
  });

  const weight = useTransform(distance, [0, 700], [900, 600]);
  const scaleX = useTransform(distance, [0, 300], [1.5, 1]);
  const color = useTransform(distance, [0, 200], [activeColor, restColor]);

  return (
    <motion.span
      ref={ref}
      style={{ fontWeight: weight, scaleX, color }}
      className="inline-block text-5xl lg:text-8xl transition-colors duration-75 origin-center"
    >
      {char}
    </motion.span>
  );
};
