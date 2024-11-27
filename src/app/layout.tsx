import type { Metadata } from "next";
import { Providers } from "./providers";
import { ColorModeScript, theme } from "@chakra-ui/react";
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
      style={{
        padding: "none",
        margin: "none",
        overflowX: "hidden",
        scrollBehavior: "smooth",
        background: "linear-gradient(124deg, #0072b1, #fd36ab 95.2%)",
      }}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/dracula-prism/dist/css/dracula-prism.css"
        ></link>
      </head>
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
