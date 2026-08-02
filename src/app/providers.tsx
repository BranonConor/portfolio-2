"use client";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { theme } from "./theme";
import { pixelFont } from "@/components/boot-intro/pixelFont";
import { proseFont } from "@/components/proseFont";

// The site now composes with just the two typefaces described in
// proseFont.ts: Press Start 2P for pixel-styled headings/titles, and IBM
// Plex Mono for everything else. Wiring them into theme.fonts here (rather
// than leaving Chakra's old defaults in place) matters because every
// Chakra <Heading> bakes `font-family: var(--chakra-fonts-heading)`
// straight into its own generated CSS class — if that variable still
// pointed at a leftover legacy font (as it did before, resolving to Space
// Grotesk/Poppins), it would fight the pixelFont/proseFont `className`
// applied on top of the same element, and unpredictably win after
// hydration — which is exactly why pixel-font headings could appear to
// "disappear" in production. Pointing the theme's own heading/body fonts
// at pixelFont/proseFont keeps both mechanisms in agreement instead of
// racing each other.
const fonts = {
  heading: pixelFont.style.fontFamily,
  body: proseFont.style.fontFamily,
};

const themeWithFonts = extendTheme({ ...theme, fonts });

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider theme={themeWithFonts}>{children}</ChakraProvider>
    </CacheProvider>
  );
}
