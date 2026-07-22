"use client";

/**
 * <AnimatedPaintStroke> (P5) — a signature paint stroke that gently leans, drifts,
 * and skews toward the cursor with spring-damped physics: Branon's own brand mark
 * performing the press.stripe "follow the pointer" move.
 *
 * Listens to global pointer position (normalized -1..1), mapped through soft springs.
 * Fine-pointer only; fully static under `prefers-reduced-motion`. Purely decorative
 * and non-interactive.
 */

import { Box, BoxProps } from "@chakra-ui/react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useEffect } from "react";
import { spring } from "@/lib/motion";
import { strokeSrcs } from "./PaintStroke";

interface AnimatedPaintStrokeProps extends BoxProps {
  /** Which stroke variant to use (1–6). */
  variant?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Base rotation in degrees (the cursor reaction is added on top). */
  baseRotate?: number;
  /** Reaction strength multiplier. */
  intensity?: number;
  /** Static scale multiplier (matches PaintStroke). */
  scale?: number;
  /** Flip horizontally. */
  flip?: boolean;
}

export const AnimatedPaintStroke: React.FC<AnimatedPaintStrokeProps> = ({
  variant = 1,
  baseRotate = 0,
  intensity = 1,
  scale = 1,
  flip = false,
  opacity = 0.5,
  ...props
}) => {
  const reduce = useReducedMotion();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, spring.float);
  const sy = useSpring(my, spring.float);

  const x = useTransform(sx, [-1, 1], [-14 * intensity, 14 * intensity]);
  const y = useTransform(sy, [-1, 1], [-12 * intensity, 12 * intensity]);
  const rotate = useTransform(
    sx,
    [-1, 1],
    [baseRotate - 6 * intensity, baseRotate + 6 * intensity],
  );
  const skewX = useTransform(sy, [-1, 1], [4 * intensity, -4 * intensity]);

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
        mx.set((e.clientX / window.innerWidth) * 2 - 1);
        my.set((e.clientY / window.innerHeight) * 2 - 1);
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduce, mx, my]);

  const scaleX = flip ? -scale : scale;
  const scaleY = scale;

  return (
    <Box
      position="absolute"
      pointerEvents="none"
      userSelect="none"
      opacity={opacity}
      zIndex={0}
      {...props}
    >
      <motion.img
        src={strokeSrcs[variant - 1]}
        alt=""
        aria-hidden="true"
        draggable={false}
        style={
          reduce
            ? {
                width: "100%",
                display: "block",
                transform: `rotate(${baseRotate}deg) scale(${scaleX}, ${scaleY})`,
                mixBlendMode: "lighten",
              }
            : {
                width: "100%",
                display: "block",
                x,
                y,
                rotate,
                skewX,
                scaleX,
                scaleY,
                mixBlendMode: "lighten",
              }
        }
      />
    </Box>
  );
};
