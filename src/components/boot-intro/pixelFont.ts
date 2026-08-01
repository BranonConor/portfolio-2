import localFont from "next/font/local";

/**
 * "Press Start 2P" (SIL Open Font License), self-hosted alongside the site's
 * other fonts — gives the boot logo an authentic chunky/8-bit pixel-font
 * look. Scoped to the boot intro only; the rest of the site keeps its own
 * heading/body fonts from providers.tsx.
 */
export const pixelFont = localFont({
  src: "../../../public/fonts/press-start-2p.ttf",
  display: "swap",
  weight: "400",
});
