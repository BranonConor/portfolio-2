/**
 * Shared "inside the console" theme constants. `SCREEN_BG` is sampled
 * straight from the GBC shell's screen artwork (console-shell.svg) so the
 * cut from "zoomed into the screen" (boot-intro) to "browsing the site"
 * (every other route) is seamless — the whole site becomes the screen.
 */
export const SCREEN_BG = "#1D2A0C";

/**
 * A hand-authored 8-bit/pixel-art arrow cursor (chunky white-fill,
 * black-outline pixels) used everywhere on the site in place of the system
 * pointer, to keep the retro-console feel consistent for mouse input even
 * outside the boot intro overlay. The hotspot (1, 1) lines up with the
 * arrow's tip.
 */
export const PIXEL_CURSOR = "url('/boot-intro/cursor.svg') 1 1, auto";

/**
 * sessionStorage key set by `PageWrapper`'s ESC/"power off" handler right
 * before navigating back to `/`, and read once by `BootIntro` on mount —
 * tells it to play the zoom back *out* to the idle console (reverse of the
 * cartridge power-on zoom) instead of just appearing in its resting state,
 * so leaving a route feels like a continuous, seamless zoom-out.
 */
export const REVERSE_BOOT_STORAGE_KEY = "gba-reverse-boot";

/**
 * A hand-tuned tileable fractal-noise grain + soft radial vignette, so the
 * console/site reads as sitting on a warm paper surface rather than a flat
 * void. Originally authored for the boot intro's cartridge-select paper
 * backdrop; also used as the background for every in-product route (see
 * PageWrapper) so the "screen flicks on to paper" moment at the end of the
 * boot sequence hands off to an identical surface underneath, rather than a
 * different texture (e.g. CRT scanlines) taking over once you land.
 */
const PAPER_NOISE_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.07 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`;
const PAPER_NOISE_DATA_URI = `data:image/svg+xml,${encodeURIComponent(PAPER_NOISE_SVG)}`;
export const PAPER_BG_SX = {
  backgroundColor: "#EEE6D3",
  backgroundImage: `radial-gradient(ellipse 120% 90% at 50% 28%, rgba(255,251,241,0.95), rgba(233,222,198,0.55) 55%, rgba(196,180,148,0.42) 100%), url("${PAPER_NOISE_DATA_URI}")`,
  backgroundBlendMode: "normal, overlay",
  backgroundSize: "cover, 180px 180px",
};
