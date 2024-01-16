"use client";

import { extendTheme } from "@chakra-ui/react";
import { buttonTheme } from "./componentOverrides/button";

const colors = {
  white: "#FFFFFF",
  black: "#000000",
  brand: {
    grey: "#222",
    lightGrey: "#e6e6e6",
    darkBg: "#111",
    lightBg: "#F6F6F6",
    pink: "#FF0096",
    darkPink: "#980059",
    blue: "#0080c7",
    gradient: "linear-gradient(124.41deg,#0072b1,#fd36ab 95.2%)",
  },
  shadows: {
    neon: "0px 4px 15px 0px rgba(226,175,255, 0.6)",
  },
};

const config = {
  initialColorMode: "system",
  useSystemColorMode: true,
};

const components = {
  Button: buttonTheme,
};

export const theme = extendTheme({ colors, config, components });
