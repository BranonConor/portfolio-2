import type { Metadata } from "next";
import { Providers } from "./providers";
import { SkipToContent } from "@/components/SkipToContent";

export const metadata: Metadata = {
  metadataBase: new URL("https://branon.dev"),
  title: "Branon Eusebio",
  description: "Design Engineer building @ GitHub",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Branon Eusebio",
    description: "Design Engineer building @ GitHub",
    url: "https://branon.dev",
    siteName: "Branon Eusebio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Branon Eusebio",
    description: "Design Engineer building @ GitHub",
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
        background: "#09090b",
      }}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/dracula-prism/dist/css/dracula-prism.css"
        ></link>
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <Providers>
          <SkipToContent />
          {children}
        </Providers>
      </body>
    </html>
  );
}
