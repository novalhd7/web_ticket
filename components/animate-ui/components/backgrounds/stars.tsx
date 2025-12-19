"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  type SpringOptions,
  type Transition,
} from "motion/react";
import { cn } from "@/lib/utils";

/* ================= STAR LAYER ================= */

type StarLayerProps = {
  count: number;
  size: number;
  transition: Transition;
  starColor: string;
};

function generateStars(count: number, color: string) {
  return Array.from({ length: count })
    .map(() => {
      const x = Math.random() * 4000 - 2000;
      const y = Math.random() * 4000 - 2000;
      return `${x}px ${y}px ${color}`;
    })
    .join(", ");
}

function StarLayer({ count, size, transition, starColor }: StarLayerProps) {
  const [shadow, setShadow] = React.useState("");

  React.useEffect(() => {
    setShadow(generateStars(count, starColor));
  }, [count, starColor]);

  return (
    <motion.div
      className="absolute top-0 left-0 h-[2000px] w-full"
      animate={{ y: [0, -2000] }}
      transition={transition}
    >
      <div
        className="absolute rounded-full"
        style={{ width: size, height: size, boxShadow: shadow }}
      />
      <div
        className="absolute top-[2000px] rounded-full"
        style={{ width: size, height: size, boxShadow: shadow }}
      />
    </motion.div>
  );
}

/* ================= BACKGROUND ================= */

type StarsBackgroundProps = {
  factor?: number;
  speed?: number;
  transition?: SpringOptions;
  starColor?: string;
  className?: string;
};

export function StarsBackground({
  factor = 0.03,
  speed = 50,
  transition = { stiffness: 50, damping: 20 },
  starColor = "#fff",
  className,
}: StarsBackgroundProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, transition);
  const springY = useSpring(y, transition);

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      x.set(-(e.clientX - cx) * factor);
      y.set(-(e.clientY - cy) * factor);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [factor, x, y]);

  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden bg-[radial-gradient(ellipse_at_bottom,_#262626_0%,_#000_100%)]",
        className
      )}
    >
      <motion.div
        style={{ x: springX, y: springY }}
        className="pointer-events-none"
      >
        <StarLayer
          count={1000}
          size={1}
          transition={{ repeat: Infinity, duration: speed, ease: "linear" }}
          starColor={starColor}
        />
        <StarLayer
          count={400}
          size={2}
          transition={{
            repeat: Infinity,
            duration: speed * 2,
            ease: "linear",
          }}
          starColor={starColor}
        />
        <StarLayer
          count={200}
          size={3}
          transition={{
            repeat: Infinity,
            duration: speed * 3,
            ease: "linear",
          }}
          starColor={starColor}
        />
      </motion.div>
    </div>
  );
}
