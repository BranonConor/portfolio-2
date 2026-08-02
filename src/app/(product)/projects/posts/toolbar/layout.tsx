import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/pageMetadata";

// `page.tsx` here is a client component ("use client", for interactive demo
// widgets), so it can't export `metadata` itself — this server layout carries
// the post's link-preview metadata instead.
export const metadata: Metadata = buildPageMetadata({
  title: "Toolbar Component @ Smartsheet",
  description:
    "Improving one of Smartsheet's most widely-used design system components",
  path: "/projects/posts/toolbar",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
