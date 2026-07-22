"use client";

/**
 * <GradientArt> (P4) — generative, Stripe-style iridescent card art rendered in
 * Branon's palette (blue / purple / pink). Layered radial + conic gradients with
 * blend modes, a soft bloom, and the existing paint-grain (`/noise.png`) overlay.
 *
 * A tiny deterministic hash of `seed` (e.g. a card title) picks stable per-card
 * hue offsets and blob positions, so a grid looks art-directed rather than uniform.
 * Pure CSS — no canvas, no new deps. Slow drift is opt-in and disabled under
 * `prefers-reduced-motion`.
 */

import { Box, BoxProps } from "@chakra-ui/react";
import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

// Branon's palette (from theme.ts).
const PALETTE = ["#60a5fa", "#a78bfa", "#f472b6", "#22c55e", "#fbbf24"];

/** Deterministic 32-bit hash of a string. */
function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

type GradientArtProps = BoxProps & {
  /** Stable seed (usually the card title) for deterministic variation. */
  seed: string;
  /** Enable a slow ambient drift (respects reduced-motion). */
  animate?: boolean;
};

export const GradientArt: React.FC<GradientArtProps> = ({
  seed,
  animate = false,
  ...rest
}) => {
  const reduce = useReducedMotion();

  const { layers, drift } = useMemo(() => {
    const h = hash(seed);
    const c1 = PALETTE[h % PALETTE.length];
    const c2 = PALETTE[(h >> 3) % PALETTE.length];
    const c3 = PALETTE[(h >> 6) % PALETTE.length];
    // Blob positions derived from the hash (kept within the frame-ish).
    const p = (n: number) => 10 + ((h >> n) % 80);

    const layers = [
      `radial-gradient(60% 60% at ${p(2)}% ${p(5)}%, ${c1}cc 0%, transparent 70%)`,
      `radial-gradient(55% 55% at ${p(8)}% ${p(11)}%, ${c2}b3 0%, transparent 72%)`,
      `radial-gradient(50% 50% at ${p(14)}% ${p(17)}%, ${c3}99 0%, transparent 75%)`,
      `conic-gradient(from ${(h % 360)}deg at 50% 50%, ${c1}22, ${c2}22, ${c3}22, ${c1}22)`,
    ].join(", ");

    return {
      layers,
      drift: {
        x: [(h % 12) - 6, 6 - (h % 12), (h % 12) - 6],
        y: [(h % 8) - 4, 4 - (h % 8), (h % 8) - 4],
      },
    };
  }, [seed]);

  const shouldDrift = animate && !reduce;

  return (
    <Box
      aria-hidden="true"
      position="absolute"
      inset={0}
      overflow="hidden"
      pointerEvents="none"
      {...rest}
    >
      {/* Gradient mesh + bloom */}
      <Box
        as={motion.div}
        position="absolute"
        inset="-20%"
        background={layers}
        filter="blur(28px) saturate(1.15)"
        style={{ mixBlendMode: "screen" }}
        animate={
          shouldDrift
            ? {
                x: drift.x,
                y: drift.y,
                transition: {
                  duration: 18,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }
            : undefined
        }
      />
      {/* Iridescent sheen */}
      <Box
        position="absolute"
        inset={0}
        style={{ mixBlendMode: "soft-light" }}
        background="linear-gradient(120deg, rgba(255,255,255,0.14), transparent 40%, rgba(255,255,255,0.06))"
      />
      {/* Paint grain — ties it to the brand and kills banding */}
      <Box
        as="img"
        src="/noise.png"
        alt=""
        position="absolute"
        inset={0}
        width="100%"
        height="100%"
        objectFit="cover"
        opacity={0.18}
        style={{ mixBlendMode: "overlay" }}
      />
    </Box>
  );
};
