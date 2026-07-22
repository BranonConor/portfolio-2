"use client";

/**
 * useMagnetic (P7) — a button/element gently pulls toward the cursor within its
 * hit area and springs back on leave. Disabled under `prefers-reduced-motion` and
 * on coarse (touch) pointers.
 *
 * Returns a spring-damped {x, y} for `style` plus pointer handlers. Movement is
 * intentionally small so click/focus targets don't visibly drift.
 */

import { useCallback, useMemo, useRef } from "react";
import { useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { spring } from "./motion";

interface UseMagneticOptions {
  /** Max pixel offset toward the cursor. */
  strength?: number;
}

export function useMagnetic({ strength = 6 }: UseMagneticOptions = {}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, spring.snappy);
  const y = useSpring(my, spring.snappy);

  const enabled = !reduce;

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!enabled) return;
      if (
        typeof window !== "undefined" &&
        window.matchMedia?.("(pointer: coarse)").matches
      )
        return;
      const el = e.currentTarget;
      const b = el.getBoundingClientRect();
      const relX = e.clientX - (b.left + b.width / 2);
      const relY = e.clientY - (b.top + b.height / 2);
      mx.set((relX / (b.width / 2)) * strength);
      my.set((relY / (b.height / 2)) * strength);
    },
    [enabled, mx, my, strength],
  );

  const onMouseLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  const handlers = useMemo(
    () => (enabled ? { onMouseMove, onMouseLeave } : {}),
    [enabled, onMouseMove, onMouseLeave],
  );

  return {
    ref,
    enabled,
    handlers,
    style: enabled ? { x, y } : {},
  };
}
