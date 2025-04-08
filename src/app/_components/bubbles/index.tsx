"use client";

import { useEffect, useRef } from "react";

import Bubble, { bubbleEasing } from "@/app/_components/bubbles/bubble";
import { cn } from "@/lib/tailwind";

interface BubblesProps {
  className?: string;
}

const Bubbles = ({ className }: BubblesProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const resizeCanvas = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.scrollWidth;
        canvas.height = canvas.parentElement.scrollHeight;
      } else {
        canvas.width = document.body.offsetWidth;
        canvas.height = document.body.offsetHeight;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const bubbles = Array.from({ length: 100 }, () => {
      const bubble = new Bubble(canvas);
      bubble.progress = Math.random();
      bubble.y =
        bubble.initialY - bubbleEasing(bubble.progress) * canvas.height;
      return bubble;
    });

    let lastSpawnTime = 0;
    const spawnInterval = 35;

    const animate = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (timestamp - lastSpawnTime > spawnInterval) {
        bubbles.push(new Bubble(canvas));
        lastSpawnTime = timestamp;
      }

      for (let i = bubbles.length - 1; i >= 0; i--) {
        const isVisible = bubbles[i]!.update();

        if (!isVisible) {
          bubbles.splice(i, 1);
        } else {
          bubbles[i]!.draw();
        }
      }

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        "pointer-events-none absolute inset-0 size-full",
        className,
      )}
    />
  );
};

export default Bubbles;
