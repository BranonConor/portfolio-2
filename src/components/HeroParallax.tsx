"use client";

/**
 * <HeroParallax> (P8 Tier A) — a faked-3D stage for the home hero graphic.
 *
 * Wraps the layered paint strokes + portrait in a CSS perspective container that:
 *  - tilts (rotateX/rotateY) toward the cursor with spring-damped physics, and
 *  - rises + settles slightly on scroll (scrollYProgress → translateY/scale),
 * producing depth without any WebGL. Combined with the per-stroke drift from
 * <AnimatedPaintStroke>, layers separate in space like the press.stripe books.
 *
 * No new dependencies. Fine-pointer only for the tilt; scroll parallax and tilt
 * are both disabled under `prefers-reduced-motion`. Purely decorative.
 */

import { Box, BoxProps } from "@chakra-ui/react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useRef } from "react";
import { spring } from "@/lib/motion";

interface HeroParallaxProps extends BoxProps {
  /** Max tilt in degrees toward the cursor. */
  tilt?: number;
  children: React.ReactNode;
}

export const HeroParallax: React.FC<HeroParallaxProps> = ({
  tilt = 8,
  children,
  ...props
}) => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Cursor tilt (relative to this element's center).
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, spring.float);
  const sy = useSpring(my, spring.float);
  const rotateY = useTransform(sx, [-1, 1], [-tilt, tilt]);
  const rotateX = useTransform(sy, [-1, 1], [tilt, -tilt]);

  // Scroll parallax rise/settle.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yRaw = useTransform(scrollYProgress, [0, 1], [0, -36]);
  const scaleRaw = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const y = useSpring(yRaw, spring.soft);
  const scale = useSpring(scaleRaw, spring.soft);

  useEffect(() => {
    if (reduce) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(pointer: coarse)").matches
    )
      return;

    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        // Normalize by a generous radius so the tilt eases in from afar.
        mx.set(Math.max(-1, Math.min(1, (e.clientX - cx) / (r.width * 1.4))));
        my.set(Math.max(-1, Math.min(1, (e.clientY - cy) / (r.height * 1.4))));
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduce, mx, my]);

  if (reduce) {
    return <Box {...props}>{children}</Box>;
  }

  return (
    <Box {...props} sx={{ perspective: "900px", ...props.sx }}>
      <motion.div
        ref={ref}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          rotateX,
          rotateY,
          y,
          scale,
        }}
      >
        {children}
      </motion.div>
    </Box>
  );
};
