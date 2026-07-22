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

interface PanelMeta {
  title: string;
  blurb: string;
  route: string;
  cta: string;
}

export const PANEL_META: Record<BuildingId, PanelMeta> = {
  farmhouse: {
    title: "🏡 The Farmhouse",
    blurb: "Where Branon hangs his hat — about, experience, and the story so far.",
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
    blurb: "Talks, mentoring, and community engagements.",
    route: "/engagements",
    cta: "See engagements",
  },
  gallery: {
    title: "🖼️ The Gallery",
    blurb: "Shipped work spotted in the wild.",
    route: "/in-the-wild",
    cta: "See in the wild",
  },
  recordshop: {
    title: "🎵 The Record Shop",
    blurb: "Music Branon produces for focus and flow.",
    route: "/#music",
    cta: "Listen on the classic site",
  },
  photowall: {
    title: "📷 The Gallery Wall",
    blurb: "Photography & digital art.",
    route: "/#photography",
    cta: "View photography",
  },
};

const featuredProjects = [
  ...designSystemsProjects.slice(0, 2),
  ...a11yProjects.slice(0, 1),
  ...brandingProjects.slice(0, 1),
  ...otherProjects.slice(0, 1),
];

function ProjectsContent() {
  return (
    <Grid templateColumns={["1fr", "1fr", "1fr 1fr"]} gap={3} mt={4}>
      {featuredProjects.map((p) => (
        <CLink
          key={p.link}
          as={NextLink}
          href={p.link}
          _hover={{ textDecoration: "none", borderColor: "brand.text" }}
          border="1px solid"
          borderColor="brand.border"
          borderRadius="10px"
          p={3}
          transition="0.12s ease all"
        >
          <Text
            fontSize="10px"
            fontWeight="600"
            textTransform="uppercase"
            letterSpacing="0.08em"
            color="brand.textMuted"
          >
            {p.category}
          </Text>
          <Text fontSize="14px" color="brand.text" mt={1}>
            {p.title}
          </Text>
          <Text fontSize="12px" color="brand.textMuted" mt={1}>
            {p.date}
          </Text>
        </CLink>
      ))}
    </Grid>
  );
}

/**
 * Renders themed in-world content for a building. Content is pulled from the
 * existing portfolio data/routes — never duplicated. Phase 1 fully wires the
 * Workshop (Projects); other buildings surface a blurb + deep link to their
 * existing (fully accessible) route.
 */
export function PanelContent({ buildingId }: { buildingId: BuildingId }) {
  const meta = PANEL_META[buildingId];
  return (
    <Box>
      <Text fontSize="20px" fontWeight="700" color="brand.text">
        {meta.title}
      </Text>
      <Text fontSize="14px" color="brand.textMuted" mt={2}>
        {meta.blurb}
      </Text>

      {buildingId === "workshop" && <ProjectsContent />}

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
