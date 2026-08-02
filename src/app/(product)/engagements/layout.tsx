import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/pageMetadata";

// `page.tsx` in this segment is a client component, so it can't export
// `metadata` itself — this server layout carries the route's link-preview
// metadata instead (title/description/OG image) and simply renders through.
export const metadata: Metadata = buildPageMetadata({
  title: "Engagements",
  description: "Talks, mentorship, and community involvement.",
  path: "/engagements",
});

export default function EngagementsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
