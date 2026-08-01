import localFont from "next/font/local";

/**
 * The site's one non-heading UI font — every route now composes with just
 * two typefaces: Press Start 2P for pixel-styled headings/titles, and this
 * IBM Plex Mono for everything else (body copy, list rows, subtitles,
 * category chips, cartridge blurbs, etc). It's a clean, highly legible
 * monospace (OFL-licensed, self-hosted) that still reads as "retro
 * terminal/tech" alongside the pixel headings, without VT323's eye strain
 * at long-form reading sizes (MDX posts). Applied as the default body font
 * in PageWrapper.tsx (covers every inner route) and imported directly
 * wherever text renders outside that tree (e.g. BootIntro.tsx).
 */
export const proseFont = localFont({
  src: [
    { path: "../../public/fonts/ibm-plex-mono-400.ttf", weight: "400" },
    { path: "../../public/fonts/ibm-plex-mono-500.ttf", weight: "500" },
  ],
  display: "swap",
});
