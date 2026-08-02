"use client";

import { Flex, Text, Box, Link as ChakraLink } from "@chakra-ui/react";
import { PageWrapper } from "@/components/PageWrapper";
import { PageHeading } from "@/components/PageHeading";
import { RetroCard } from "@/components/RetroCard";
import { RetroFilterPill } from "@/components/RetroFilterPill";
import { pixelFont } from "@/components/boot-intro/pixelFont";
import Link from "next/link";
import { useState } from "react";
import { mentoring, publicSpeaking } from "./consts";
import { ExternalLinkIcon } from "@chakra-ui/icons";

const categories = [
  { key: "all", label: "All" },
  { key: "Public Speaking", label: "Public Speaking" },
  { key: "Mentoring", label: "Mentoring" },
];

const allEngagements = [...publicSpeaking, ...mentoring];

export default function Engagements() {
  const [currentFilter, setCurrentFilter] = useState("all");

  const filteredEngagements =
    currentFilter === "all"
      ? allEngagements
      : allEngagements.filter((e) => e.category === currentFilter);

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
            <PageHeading
              title="Engagements"
              subtitle="Showing up for the community."
            />
          </Box>

          {/* Filters */}
          <Flex flexWrap="wrap" alignItems="center" gap={2} px={5} pt={4} pb={4}>
            {categories.map((cat) => (
              <RetroFilterPill
                key={cat.key}
                label={cat.label}
                color="#22c55e"
                active={currentFilter === cat.key}
                onClick={() => setCurrentFilter(cat.key)}
              />
            ))}
          </Flex>

          {/* Engagement List */}
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
            {filteredEngagements.map((engagement) => (
              <ChakraLink
                key={engagement.title}
                as={Link}
                href={engagement.link}
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
                  bg: "#22c55e14",
                  borderColor: "#22c55e55",
                  transform: "translateX(3px)",
                  zIndex: 1,
                  _after: { transform: "scaleX(0)" },
                }}
                transition="0.14s ease all"
              >
                <Flex alignItems="center" gap={3}>
                  <Text
                    as="span"
                    className={pixelFont.className}
                    fontSize="11px"
                    color="transparent"
                    _groupHover={{ color: "#22c55e" }}
                    aria-hidden="true"
                    transition="color 0.14s ease"
                  >
                    {"\u25B6"}
                  </Text>
                  <Text textStyle="listTitle">
                    {engagement.title}
                  </Text>
                  <Text
                    fontSize="11px"
                    color="brand.textMuted"
                    bg="brand.surface"
                    paddingX={2}
                    paddingY={0.5}
                    borderRadius="4px"
                    display={["none", "block"]}
                  >
                    {engagement.category}
                  </Text>
                </Flex>
                <Text
                  fontSize="12px"
                  color="brand.textMuted"
                  opacity={0.6}
                  flexShrink={0}
                  mt={[1, 0]}
                >
                  {engagement.date}
                </Text>
              </ChakraLink>
            ))}
          </Flex>
        </RetroCard>
      </Flex>
    </PageWrapper>
  );
}
