import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/pageMetadata";

// `page.tsx` in this segment is a client component, so it can't export
// `metadata` itself — this server layout carries the route's link-preview
// metadata instead (title/description/OG image) and simply renders through.
export const metadata: Metadata = buildPageMetadata({
  title: "Projects",
  description: "Things I've designed, built, and shipped.",
  path: "/projects",
});

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
