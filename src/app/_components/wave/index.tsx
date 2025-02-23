"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/tailwind";

interface WaveProps {
  className?: string;
}

const Wave = ({ className }: WaveProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("resize", updateDimensions);
      resizeObserver.disconnect();
    };
  }, []);

  const createWavePath = (progress: number) => {
    const { width, height } = dimensions;
    if (!width || !height) {
      return "";
    }

    const safeHeight = height - 10;

    const wavelength = width * 1.5;
    const amplitude = safeHeight / 2;

    let path = `M 0 ${height} `;
    for (let x = 0; x <= width; x += 10) {
      const y =
        safeHeight -
        amplitude -
        amplitude * Math.sin((x / wavelength + progress) * 2 * Math.PI);
      path += `L ${x} ${y} `;
    }
    const lastY =
      safeHeight -
      amplitude -
      amplitude * Math.sin((width / wavelength + progress) * 2 * Math.PI);
    path += `L ${width} ${lastY} L ${width} ${height} Z`;
    return path;
  };

  return (
    <div ref={containerRef} className={cn("w-full", className)}>
      <svg width="100%" height="100%" preserveAspectRatio="none">
        <motion.path
          d={createWavePath(0)}
          initial={{ d: createWavePath(0) }}
          animate={{
            d: Array.from({ length: 8 }, (_, i) => createWavePath(i / 7)),
          }}
          transition={{
            duration: 10,
            ease: "linear",
            repeat: Number.POSITIVE_INFINITY,
          }}
        />
      </svg>
    </div>
  );
};

export default Wave;
