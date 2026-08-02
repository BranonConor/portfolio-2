"use client";

import { Flex, Text, Box, Image, Link as ChakraLink } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { PageWrapper } from "@/components/PageWrapper";
import { PageHeading } from "@/components/PageHeading";
import { RetroCard } from "@/components/RetroCard";
import { RetroFilterPill } from "@/components/RetroFilterPill";
import { SectionHeading } from "@/components/SectionHeading";
import { pixelFont } from "@/components/boot-intro/pixelFont";
import Link from "next/link";
import {
  brandingProjects,
  designSystemsProjects,
  a11yProjects,
  otherProjects,
  productProjects,
  sideProjects,
  showcaseItems,
} from "./consts";
import { useState } from "react";

const categories = [
  { key: "all", label: "All" },
  { key: "Side Projects", label: "Side Projects" },
  { key: "Design Systems", label: "Design Systems" },
  { key: "Product", label: "Product" },
  { key: "A11y", label: "Accessibility" },
  { key: "Brand Design", label: "Brand Design" },
  { key: "Hackweek", label: "Hackweek" },
];

const MONTHS: Record<string, number> = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
};

// Safari/JSC's `new Date("December 2025")` returns Invalid Date, which breaks
// chronological sorting in mobile Safari. Parse "Month YYYY" / "Mon YYYY"
// strings manually for cross-browser consistency.
const parseProjectDate = (input: string): number => {
  const match = input.trim().match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (match) {
    const month = MONTHS[match[1].toLowerCase()];
    const year = Number(match[2]);
    if (month !== undefined && !Number.isNaN(year)) {
      return new Date(year, month, 1).getTime();
    }
  }
  const fallback = new Date(input).getTime();
  return Number.isNaN(fallback) ? 0 : fallback;
};

const allProjects = [
  ...sideProjects,
  ...designSystemsProjects,
  ...productProjects,
  ...a11yProjects,
  ...otherProjects,
  ...brandingProjects,
].sort((a, b) => parseProjectDate(b.date) - parseProjectDate(a.date));

export default function Projects() {
  const [currentFilter, setCurrentFilter] = useState("all");

  const filteredProjects =
    currentFilter === "all"
      ? allProjects
      : allProjects.filter((p) =>
          Array.isArray(p.category)
            ? p.category.includes(currentFilter)
            : p.category === currentFilter,
        );

  return (
    <PageWrapper>
      <Flex
        flexDirection="column"
        width="100%"
        alignItems="flex-start"
        justifyContent="flex-start"
      >
        <RetroCard>
          <Box p={5} pb={3} borderBottom="2px solid" borderBottomColor="brand.border">
            <PageHeading title="Projects" subtitle="Cool things I've worked on." />
          </Box>

          {/* Filters */}
          <Flex flexWrap="wrap" alignItems="center" gap={2} px={5} pt={4} pb={4}>
            {categories.map((cat) => (
              <RetroFilterPill
                key={cat.key}
                label={cat.label}
                color="#da70d6"
                active={currentFilter === cat.key}
                onClick={() => setCurrentFilter(cat.key)}
              />
            ))}
          </Flex>

          {/* Project List */}
          <Flex
            flexDirection="column"
            width="100%"
            gap={0}
            px={5}
            pb={3}
            sx={{
              "& > *:first-of-type::after": { display: "none" },
              "& > *:hover + *::after": { transform: "scaleX(0)" },
            }}
          >
            {filteredProjects.map((project) => (
              <ChakraLink
                key={project.title}
                as={Link}
                href={project.link}
                role="group"
                display="flex"
                flexDirection={["column", "row"]}
                justifyContent="space-between"
                alignItems={["flex-start", "center"]}
                gap={2}
                position="relative"
                paddingY={3}
                paddingX={3}
                borderRadius="10px"
                border="2px solid transparent"
                _after={{
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 2,
                  right: 2,
                  height: "2px",
                  bg: "brand.border",
                  transition: "0.15s ease all",
                  transformOrigin: "center",
                }}
                _hover={{
                  textDecoration: "none",
                  bg: "#da70d614",
                  borderColor: "#da70d655",
                  transform: "translateX(3px)",
                  zIndex: 1,
                  _after: { transform: "scaleX(0)" },
                }}
                transition="0.14s ease all"
              >
                <Flex alignItems="center" gap={3} flexWrap="wrap">
                  <Text
                    as="span"
                    className={pixelFont.className}
                    fontSize="11px"
                    color="transparent"
                    _groupHover={{ color: "#da70d6" }}
                    aria-hidden="true"
                    transition="color 0.14s ease"
                  >
                    {"\u25B6"}
                  </Text>
                  <Text textStyle="listTitle">
                    {project.title}
                  </Text>
                  {(Array.isArray(project.category)
                    ? project.category
                    : [project.category]
                  ).map((cat) => (
                    <Text
                      key={cat}
                      fontSize="11px"
                      color="brand.textMuted"
                      bg="brand.surface"
                      paddingX={2}
                      paddingY={0.5}
                      borderRadius="4px"
                      display={["none", "block"]}
                    >
                      {cat}
                    </Text>
                  ))}
                  {(project as any).hasPassword && (
                    <Text fontSize="11px" opacity={0.5}>
                      🔒
                    </Text>
                  )}
                  {(project as any).inProgress && (
                    <Text
                      fontSize="10px"
                      fontWeight="600"
                      letterSpacing="0.06em"
                      color="#fbbf24"
                      bg="rgba(251, 191, 36, 0.12)"
                      border="1px solid rgba(251, 191, 36, 0.3)"
                      paddingX={1.5}
                      paddingY={0.5}
                      borderRadius="4px"
                      display={["none", "block"]}
                    >
                      IN PROG
                    </Text>
                  )}
                </Flex>
                <Text
                  fontSize="12px"
                  color="brand.textMuted"
                  opacity={0.6}
                  flexShrink={0}
                  mt={[1, 0]}
                >
                  {project.date}
                </Text>
              </ChakraLink>
            ))}
          </Flex>
        </RetroCard>

        <RetroCard p={5} mt={4}>
          <SectionHeading title="Showcase" color="#da70d6" />
          <Flex
            flexDirection="column"
            gap={0}
            sx={{
              "& > *:first-of-type::after": { display: "none" },
              "& > *:hover + *::after": { transform: "scaleX(0)" },
            }}
          >
            {showcaseItems.map((item) => (
              <ChakraLink
                key={item.title}
                href={item.link}
                isExternal
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                gap={3}
                position="relative"
                paddingY={2.5}
                paddingX={3}
                borderRadius="10px"
                border="2px solid transparent"
                _after={{
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 2,
                  right: 2,
                  height: "2px",
                  bg: "brand.border",
                  transition: "0.15s ease all",
                  transformOrigin: "center",
                }}
                _hover={{
                  textDecoration: "none",
                  bg: "#da70d614",
                  borderColor: "#da70d655",
                  transform: "translateX(3px)",
                  zIndex: 1,
                  _after: { transform: "scaleX(0)" },
                }}
                transition="0.14s ease all"
              >
                <Flex alignItems="center" gap={2.5} flex={1} minWidth={0}>
                  <Box
                    width="32px"
                    height="32px"
                    minWidth="32px"
                    borderRadius="6px"
                    border="2px solid"
                    borderColor="brand.border"
                    bg={item.title === "Thesis" ? "#2b2b2b" : "brand.surface"}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    overflow="hidden"
                  >
                    <Image
                      src={item.icon}
                      alt={item.title}
                      width="18px"
                      height="18px"
                      objectFit="contain"
                      borderRadius="3px"
                    />
                  </Box>
                  <Box minWidth={0}>
                    <Flex alignItems="center" gap={2}>
                      <Text textStyle="listTitle">{item.title}</Text>
                      {item.tag && (
                        <Box
                          as="span"
                          fontSize="10px"
                          fontWeight="600"
                          letterSpacing="0.02em"
                          color="#22c55e"
                          bg="#22c55e15"
                          px={2}
                          py={0.5}
                          borderRadius="4px"
                          whiteSpace="nowrap"
                        >
                          {item.tag}
                        </Box>
                      )}
                    </Flex>
                    <Text textStyle="listMeta" mt={0.5}>
                      {item.description}
                    </Text>
                  </Box>
                </Flex>
                <ExternalLinkIcon boxSize={3} color="brand.textMuted" flexShrink={0} />
              </ChakraLink>
            ))}
          </Flex>
        </RetroCard>
      </Flex>
    </PageWrapper>
  );
}
