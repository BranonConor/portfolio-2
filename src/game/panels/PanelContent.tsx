"use client";

import { Box, Flex, Grid, Link as CLink, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import type { BuildingId } from "../config";
import {
  a11yProjects,
  brandingProjects,
  designSystemsProjects,
  otherProjects,
} from "@/app/projects/consts";
import { blogPosts } from "@/app/blog/consts";
import { publicSpeaking, mentoring } from "@/app/engagements/consts";
import { inTheWild } from "@/app/in-the-wild/consts";
import { Music } from "@/components/sections/Music";
import { Photography } from "@/components/sections/Photography";

interface PanelMeta {
  title: string;
  blurb: string;
  route: string;
  cta: string;
}

export const PANEL_META: Record<BuildingId, PanelMeta> = {
  farmhouse: {
    title: "🏡 The Farmhouse",
    blurb:
      "Branon Eusebio — Design Engineer building @ GitHub. Design systems, accessibility, and playful, well-crafted interfaces.",
    route: "/about",
    cta: "Visit the About page",
  },
  workshop: {
    title: "🛠️ The Workshop",
    blurb: "Design systems, accessibility, branding, and product work.",
    route: "/projects",
    cta: "See all projects",
  },
  library: {
    title: "📚 The Library",
    blurb: "Long-form writing on design engineering and accessibility.",
    route: "/blog",
    cta: "Read the blog",
  },
  townhall: {
    title: "🎤 The Town Hall",
    blurb: "Talks, panels, podcasts, and mentoring.",
    route: "/engagements",
    cta: "See all engagements",
  },
  gallery: {
    title: "🖼️ The Gallery",
    blurb: "Work shipped and spotted in the wild.",
    route: "/in-the-wild",
    cta: "See all in the wild",
  },
  recordshop: {
    title: "🎵 The Record Shop",
    blurb: "",
    route: "/#music",
    cta: "Open the classic site",
  },
  photowall: {
    title: "📷 The Gallery Wall",
    blurb: "",
    route: "/#photography",
    cta: "Open the classic site",
  },
};

interface CardItem {
  title: string;
  meta?: string;
  date?: string;
  link: string;
  external?: boolean;
}

function CardGrid({ items }: { items: CardItem[] }) {
  return (
    <Grid templateColumns={["1fr", "1fr", "1fr 1fr"]} gap={3} mt={4}>
      {items.map((p) => (
        <CLink
          key={p.link + p.title}
          as={NextLink}
          href={p.link}
          target={p.external ? "_blank" : undefined}
          rel={p.external ? "noopener noreferrer" : undefined}
          _hover={{ textDecoration: "none", borderColor: "brand.text" }}
          border="1px solid"
          borderColor="brand.border"
          borderRadius="10px"
          p={3}
          transition="0.12s ease all"
        >
          {p.meta && (
            <Text
              fontSize="10px"
              fontWeight="600"
              textTransform="uppercase"
              letterSpacing="0.08em"
              color="brand.textMuted"
            >
              {p.meta}
            </Text>
          )}
          <Text fontSize="14px" color="brand.text" mt={1}>
            {p.title}
          </Text>
          {p.date && (
            <Text fontSize="12px" color="brand.textMuted" mt={1}>
              {p.date}
            </Text>
          )}
        </CLink>
      ))}
    </Grid>
  );
}

const featuredProjects: CardItem[] = [
  ...designSystemsProjects.slice(0, 2),
  ...a11yProjects.slice(0, 1),
  ...brandingProjects.slice(0, 1),
  ...otherProjects.slice(0, 1),
].map((p) => ({
  title: p.title,
  meta: Array.isArray(p.category) ? p.category.join(", ") : p.category,
  date: p.date,
  link: p.link,
}));

const engagementItems: CardItem[] = [...publicSpeaking, ...mentoring].map(
  (p) => ({ title: p.title, meta: p.category, date: p.date, link: p.link }),
);

const wildItems: CardItem[] = inTheWild.slice(0, 4).map((w) => ({
  title: w.title,
  meta: w.source,
  date: w.date,
  link: w.link,
  external: w.external,
}));

const blogItems: CardItem[] = blogPosts.map((b) => ({
  title: b.title,
  meta: b.category,
  date: b.date,
  link: b.link,
  external: b.external,
}));

function SectionBody({ buildingId }: { buildingId: BuildingId }) {
  switch (buildingId) {
    case "workshop":
      return <CardGrid items={featuredProjects} />;
    case "library":
      return <CardGrid items={blogItems} />;
    case "townhall":
      return <CardGrid items={engagementItems} />;
    case "gallery":
      return <CardGrid items={wildItems} />;
    case "recordshop":
      return (
        <Box mt={2}>
          <Music />
        </Box>
      );
    case "photowall":
      return (
        <Box mt={2}>
          <Photography />
        </Box>
      );
    default:
      return null;
  }
}

/**
 * Renders themed in-world content for a building. All content is pulled from the
 * existing portfolio data/components (projects/blog/engagements/in-the-wild
 * consts + the Music/Photography section components) — never duplicated.
 */
export function PanelContent({ buildingId }: { buildingId: BuildingId }) {
  const meta = PANEL_META[buildingId];
  const showHeaderBlurb = meta.blurb.length > 0;
  return (
    <Box>
      <Text fontSize="20px" fontWeight="700" color="brand.text">
        {meta.title}
      </Text>
      {showHeaderBlurb && (
        <Text fontSize="14px" color="brand.textMuted" mt={2}>
          {meta.blurb}
        </Text>
      )}

      <SectionBody buildingId={buildingId} />

      <Flex mt={5}>
        <CLink
          as={NextLink}
          href={meta.route}
          bg="brand.text"
          color="brand.bg"
          fontSize="13px"
          fontWeight="600"
          px={4}
          py={2}
          borderRadius="8px"
          _hover={{ textDecoration: "none", opacity: 0.9 }}
        >
          {meta.cta} →
        </CLink>
      </Flex>
    </Box>
  );
}
