"use client";

import { extendTheme } from "@chakra-ui/react";
import { buttonTheme } from "./componentOverrides/button";

const colors = {
  white: "#fafafa",
  black: "#000000",
  brand: {
    // The GBA/GBC LCD backlight is "on" — a warm paper/canvas tone, the
    // same one the boot intro flicks to when the console powers up
    // (see PAPER_BG_SX in BootIntro.tsx). SCREEN_BG (dark green) is now
    // reserved for the transient power-on/off flick and the console's own
    // screen cutout artwork, not the resting page background.
    bg: "#EEE6D3",
    // Surfaces/borders/text are warm, paper-toned instead of neutral
    // near-black/white — real GBC/DMG screens never showed a true black or
    // a true white, so pure #000/#fff surfaces would read as a jarring,
    // unrelated color next to the paper backdrop.
    surface: "#F7F2E4",
    surfaceHover: "#EFE6D0",
    border: "rgba(51, 44, 28, 0.14)",
    borderHover: "rgba(51, 44, 28, 0.26)",
    text: "#332C1C",
    textMuted: "#655C42",
    accent: "#60a5fa",
    accentMuted: "#3b82f6",
    pink: "#f472b6",
    gradient: "linear-gradient(135deg, #60a5fa, #a78bfa)",
    // Legacy aliases for MDX/post compatibility
    grey: "#28350f",
    lightGrey: "#334512",
    darkBg: "#1D2A0C",
    lightBg: "#28350f",
    blue: "#60a5fa",
    darkPink: "#f472b6",
  },
};

const config = {
  initialColorMode: "dark" as const,
  useSystemColorMode: false,
};

// Reusable text style tokens for list items
const textStyles = {
  listTitle: {
    fontSize: "13px",
    fontWeight: "400",
    color: "brand.text",
    lineHeight: "1.5",
  },
  listMeta: {
    fontSize: "11px",
    color: "brand.textMuted",
  },
};

const styles = {
  global: {
    ":root": {
      "--sparkle-desktop": "none",
      "--sparkle-mobile": "block",
      "@media (min-width: 48em)": {
        "--sparkle-desktop": "block",
        "--sparkle-mobile": "none",
      },
    },
    body: {
      bg: "brand.bg",
      color: "brand.text",
    },
  },
};

const components = {
  Button: buttonTheme,
};

export const theme = extendTheme({
  colors,
  config,
  styles,
  components,
  textStyles,
});
