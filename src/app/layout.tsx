import type { Metadata } from "next";
import Script from "next/script";
import { Providers } from "./providers";
import { SkipToContent } from "@/components/SkipToContent";
import { SCREEN_BG } from "@/lib/consoleTheme";

const GA_MEASUREMENT_ID = "G-C74KV5XNVN";

const DEFAULT_OG_IMAGE =
  "/api/og?title=Branon%20Eusebio&subtitle=Design%20Engineer%20building%20%40%20GitHub";

export const metadata: Metadata = {
  metadataBase: new URL("https://branon.dev"),
  title: "Branon Eusebio",
  description: "Design Engineer building @ GitHub",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Branon Eusebio",
    description: "Design Engineer building @ GitHub",
    url: "https://branon.dev",
    siteName: "Branon Eusebio",
    type: "website",
    images: [
      { url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: "Branon Eusebio" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Branon Eusebio",
    description: "Design Engineer building @ GitHub",
    images: [DEFAULT_OG_IMAGE],
  },
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
        padding: "0",
        margin: "0",
        overflowX: "hidden",
        scrollBehavior: "smooth",
        background: SCREEN_BG,
      }}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/dracula-prism/dist/css/dracula-prism.css"
        ></link>
        {/* The boot intro's console illustration is the very first thing
            visitors see on "/" — preloading it here (rather than letting the
            <img> in PowerOnScene discover it after hydration) closes most of
            the gap where the cartridge picker is visible before the console
            art has rendered in. */}
        <link
          rel="preload"
          as="image"
          href="/boot-intro/console-shell.svg"
          type="image/svg+xml"
        ></link>
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <Providers>
          <SkipToContent />
          {children}
        </Providers>
      </body>
    </html>
  );
}
