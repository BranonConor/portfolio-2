"use client";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { theme } from "./theme";
import { Space_Grotesk, Poppins } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const poppins = Poppins({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
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
