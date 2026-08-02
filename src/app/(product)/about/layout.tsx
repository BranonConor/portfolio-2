import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/pageMetadata";

// `page.tsx` in this segment is a client component, so it can't export
// `metadata` itself — this server layout carries the route's link-preview
// metadata instead (title/description/OG image) and simply renders through.
export const metadata: Metadata = buildPageMetadata({
  title: "About",
  description: "Design Engineer building @ GitHub — background, work, and interests.",
  path: "/about",
});

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
