import type { Metadata } from "next";
import { Providers } from "./providers";
import {
  ColorModeScript,
  theme,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import { ColorModeButton } from "@/components/ColorModeButton";

export const metadata: Metadata = {
  title: "Branon Eusebio",
  description: "UX-focused software engineer based in San Diego, CA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      style={{ padding: "none", margin: "none", overflowX: "hidden" }}
    >
      <body>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Providers>
          <ColorModeButton />
          {children}
        </Providers>
      </body>
    </html>
  );
}
