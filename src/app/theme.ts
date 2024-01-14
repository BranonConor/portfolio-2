import { extendTheme } from "@chakra-ui/react";

const colors = {
  white: "#FFFFFF",
  black: "#000000",
  brand: {
    grey: "#222",
    lightGrey: "#e6e6e6",
    darkBg: "#111",
    lightBg: "#F6F6F6",
    pink: "#FF0096",
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

export const theme = extendTheme({ colors, config });
