"use client";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { theme } from "./theme";
import localFont from "next/font/local";

const spaceGrotesk = localFont({
  src: [
    {
      path: "../../public/fonts/space-grotesk-variable.woff2",
      weight: "400 700",
    },
  ],
  display: "swap",
});

const poppins = localFont({
  src: [
    { path: "../../public/fonts/poppins-300.woff2", weight: "300" },
    { path: "../../public/fonts/poppins-400.woff2", weight: "400" },
    { path: "../../public/fonts/poppins-500.woff2", weight: "500" },
    { path: "../../public/fonts/poppins-600.woff2", weight: "600" },
  ],
  display: "swap",
});

const fonts = {
  heading: spaceGrotesk.style.fontFamily,
  body: poppins.style.fontFamily,
};

const themeWithFonts = extendTheme({ ...theme, fonts });

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider theme={themeWithFonts}>{children}</ChakraProvider>
    </CacheProvider>
  );
}
