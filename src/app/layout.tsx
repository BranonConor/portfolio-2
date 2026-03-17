import type { Metadata } from "next";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Branon Eusebio",
  description: "Design Engineer building @ GitHub",
  icons: {
    icon: "/s0.png",
    apple: "/s0.png",
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
