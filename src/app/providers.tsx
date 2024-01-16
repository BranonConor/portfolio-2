"use client";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { theme } from "./theme";
import { Comfortaa } from "next/font/google";

const comfortaa = Comfortaa({
  weight: ["300", "400", "600", "700"],
  subsets: ["latin"],
});
const fonts = {
  heading: comfortaa.style.fontFamily,
  body: comfortaa.style.fontFamily,
  p: comfortaa.style.fontFamily,
  span: comfortaa.style.fontFamily,
  li: comfortaa.style.fontFamily,
};
const themeWithFonts = extendTheme({ ...theme, fonts });
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider theme={themeWithFonts}>{children}</ChakraProvider>
    </CacheProvider>
  );
}
