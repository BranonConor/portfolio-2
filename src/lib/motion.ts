"use client";

/**
 * Shared motion tokens — one vocabulary of easing curves, durations, springs, and
 * reveal variants so every animation across the site feels like the same hand.
 *
 * Borrowed from Stripe's discipline (consistent, gentle timing) and reused everywhere
 * instead of ad-hoc inline values. Pair with `useReducedMotion()` from framer-motion
 * to disable or soften motion for users who ask for it.
 */

import type { Transition, Variants } from "framer-motion";

/** Cubic-bezier easing curves. `out` is the workhorse expressive ease. */
export const ease = {
  /** Snappy start, long gentle settle — the default for entrances/hovers. */
  out: [0.16, 1, 0.3, 1] as const,
  /** Symmetric ease for reversible state changes. */
  inOut: [0.65, 0, 0.35, 1] as const,
  /** Soft standard ease. */
  standard: [0.4, 0, 0.2, 1] as const,
};

/** Durations in seconds. */
export const dur = {
  fast: 0.15,
  base: 0.25,
  slow: 0.45,
} as const;

/** Reusable spring configs for physical, damped motion (tilt, magnetic, parallax). */
export const spring = {
  /** Soft settle for cursor-following tilt/sheen. */
  soft: { type: "spring", stiffness: 150, damping: 20, mass: 0.6 } as const,
  /** Snappier pull-back for magnetic buttons. */
  snappy: { type: "spring", stiffness: 300, damping: 22, mass: 0.5 } as const,
  /** Loose, floaty parallax layers. */
  float: { type: "spring", stiffness: 60, damping: 18, mass: 1 } as const,
};

/** Base transition used by most tween animations. */
export const baseTransition: Transition = {
  duration: dur.base,
  ease: ease.out,
};

/**
 * Container variants that stagger their children in on scroll.
 * Use with a child that has the `revealItem` variants below.
 */
export const revealContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.02 },
  },
};

/** Child variants: fade + gentle rise. */
export const revealItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: dur.slow, ease: ease.out },
  },
};

/** Reduced-motion-safe variants: fade only, no translate. */
export const revealItemReduced: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: dur.base } },
};

/** Standard viewport config for `whileInView` — animate once, slightly early. */
export const inViewOnce = { once: true, margin: "-10% 0px -10% 0px" } as const;
