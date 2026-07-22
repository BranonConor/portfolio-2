"use client";

/**
 * useTilt (P3) — damped, cursor-following 3D tilt with a light-following sheen,
 * echoing the press.stripe "books look at your pointer" feel at card scale.
 *
 * Returns motion values (spring-damped, so no React re-render per mousemove) plus
 * pointer handlers. Tilt and sheen are disabled under `prefers-reduced-motion` and
 * on coarse (touch) pointers — on those the handlers are no-ops and rotation stays 0.
 */

import { useCallback, useMemo, useRef } from "react";
import {
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { spring } from "./motion";

interface UseTiltOptions {
  /** Max rotation in degrees at the card edges. */
  max?: number;
  /** Perspective distance (px) for the 3D transform. */
  perspective?: number;
}

export function useTilt({ max = 8, perspective = 800 }: UseTiltOptions = {}) {
  const reduce = useReducedMotion();
  const boundsRef = useRef<DOMRect | null>(null);

  // Normalized pointer position within the element: -0.5 .. 0.5
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  // Sheen highlight position in %
  const sx = useMotionValue(50);
  const sy = useMotionValue(50);

  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [max, -max]), spring.soft);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-max, max]), spring.soft);
  const sheenX = useSpring(sx, spring.soft);
  const sheenY = useSpring(sy, spring.soft);
  const sheenOpacity = useMotionValue(0);

  const enabled = !reduce;

  const onMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!enabled) return;
      // Skip on touch / coarse pointers where a hover-tilt makes no sense.
      if (
        typeof window !== "undefined" &&
        window.matchMedia?.("(pointer: coarse)").matches
      )
        return;
      boundsRef.current = e.currentTarget.getBoundingClientRect();
      sheenOpacity.set(1);
    },
    [enabled, sheenOpacity],
  );

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!enabled || !boundsRef.current) return;
      const b = boundsRef.current;
      const xPct = (e.clientX - b.left) / b.width;
      const yPct = (e.clientY - b.top) / b.height;
      px.set(xPct - 0.5);
      py.set(yPct - 0.5);
      sx.set(xPct * 100);
      sy.set(yPct * 100);
    },
    [enabled, px, py, sx, sy],
  );

  const onMouseLeave = useCallback(() => {
    boundsRef.current = null;
    px.set(0);
    py.set(0);
    sheenOpacity.set(0);
  }, [px, py, sheenOpacity]);

  const handlers = useMemo(
    () => (enabled ? { onMouseEnter, onMouseMove, onMouseLeave } : {}),
    [enabled, onMouseEnter, onMouseMove, onMouseLeave],
  );

  return {
    enabled,
    handlers,
    /** Spread onto the tilting motion element's `style`. */
    style: enabled
      ? { rotateX, rotateY, transformPerspective: perspective, transformStyle: "preserve-3d" as const }
      : {},
    /** Motion values for an optional sheen overlay. */
    sheen: { x: sheenX, y: sheenY, opacity: sheenOpacity },
  };
}
