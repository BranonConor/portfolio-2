import type { Metadata } from "next";

const SITE_NAME = "Branon Eusebio";
const SITE_URL = "https://branon.dev";

/**
 * Shared per-route metadata builder. Every route/post uses this so link
 * previews (Slack, Discord, iMessage, X/Twitter, etc.) show that page's own
 * title + description in a section-colored cartridge preview rather than
 * falling back to the site's generic homepage image for every link.
 */
export function buildPageMetadata({
  title,
  description,
  path: routePath,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const fullTitle = `${title} · ${SITE_NAME}`;
  const url = `${SITE_URL}${routePath}`;
  const ogImage = `/api/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(
    description
  )}&path=${encodeURIComponent(routePath)}`;

  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      type: "article",
      images: [{ url: ogImage, width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}
