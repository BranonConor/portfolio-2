"use client";

import { extendTheme } from "@chakra-ui/react";
import { buttonTheme } from "./componentOverrides/button";

const colors = {
  white: "#fafafa",
  black: "#000000",
  brand: {
    bg: "#09090b",
    surface: "#141416",
    surfaceHover: "#1c1c1f",
    border: "rgba(255, 255, 255, 0.15)",
    borderHover: "rgba(255, 255, 255, 0.22)",
    text: "#fafafa",
    textMuted: "#a1a1aa",
    accent: "#60a5fa",
    accentMuted: "#3b82f6",
    pink: "#f472b6",
    gradient: "linear-gradient(135deg, #60a5fa, #a78bfa)",
    // Legacy aliases for MDX/post compatibility
    grey: "#141416",
    lightGrey: "#1c1c1f",
    darkBg: "#09090b",
    lightBg: "#141416",
    blue: "#60a5fa",
    darkPink: "#f472b6",
  },
};

const config = {
  initialColorMode: "dark" as const,
  useSystemColorMode: false,
};

const styles = {
  global: {
    body: {
      bg: "brand.bg",
      color: "brand.text",
    },
  },
};

const components = {
  Button: buttonTheme,
};

export const theme = extendTheme({ colors, config, styles, components });
