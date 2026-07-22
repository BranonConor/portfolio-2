"use client";

/**
 * Client-only, dynamically-imported wrapper for the optional r3f hero (P8 Tier B).
 * The heavy three.js bundle lives in its own code-split chunk that is never loaded
 * unless this component actually mounts (i.e. when NEXT_PUBLIC_HERO_3D === "1").
 */

import dynamic from "next/dynamic";

export const Hero3DLazy = dynamic(() => import("./Hero3D"), {
  ssr: false,
  loading: () => null,
});
