"use client";

import { Flex, Text, Box, Link as ChakraLink } from "@chakra-ui/react";
import { PageWrapper } from "@/components/PageWrapper";
import { PageHeading } from "@/components/PageHeading";
import { RetroCard } from "@/components/RetroCard";
import { RetroFilterPill } from "@/components/RetroFilterPill";
import { pixelFont } from "@/components/boot-intro/pixelFont";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { useMemo, useState } from "react";
import { inTheWild } from "./consts";

const ACCENT = "#fbbf24";

export default function InTheWild() {
  const [currentFilter, setCurrentFilter] = useState("all");

  // Fixed source-based filters: GitHub work vs. everything else.
  const categories = [
    { key: "all", label: "All" },
    { key: "github", label: "GitHub" },
    { key: "other", label: "Other" },
  ];

  const filtered =
    currentFilter === "all"
      ? inTheWild
      : currentFilter === "github"
        ? inTheWild.filter((item) => item.source === "GitHub")
        : inTheWild.filter((item) => item.source !== "GitHub");

  // Always show newest first, regardless of array order in consts.
  const sorted = useMemo(
    () =>
      [...filtered].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    [filtered],
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
            <PageHeading
              title="In the Wild"
              subtitle="Things I've helped ship, living out in the world ⚡️"
            />
          </Box>

          {/* Filters */}
          <Flex flexWrap="wrap" alignItems="center" gap={2} px={5} pt={4} pb={4}>
            {categories.map((cat) => (
              <RetroFilterPill
                key={cat.key}
                label={cat.label}
                color={ACCENT}
                active={currentFilter === cat.key}
                onClick={() => setCurrentFilter(cat.key)}
              />
            ))}
          </Flex>

          {/* List */}
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
            {sorted.map((item) => {
              const linkProps = item.external
                ? {
                    href: item.link,
                    isExternal: true,
                    target: "_blank",
                    rel: "noopener noreferrer",
                  }
                : { as: Link, href: item.link };

              return (
                <ChakraLink
                  key={item.title}
                  {...linkProps}
                  display="flex"
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
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
                    bg: `${ACCENT}14`,
                    borderColor: `${ACCENT}55`,
                    transform: "translateX(3px)",
                    zIndex: 1,
                    _after: { transform: "scaleX(0)" },
                  }}
                  transition="0.14s ease all"
                >
                  <Flex flex={1} minWidth={0} pr={4} gap={2}>
                    <Text
                      as="span"
                      className={pixelFont.className}
                      fontSize="7px"
                      color={ACCENT}
                      aria-hidden="true"
                      flexShrink={0}
                      mt="3px"
                    >
                      {"\u25B8"}
                    </Text>
                    <Box>
                      <Text textStyle="listTitle">{item.title}</Text>
                      <Text
                        textStyle="listMeta"
                        mt={0.5}
                        display={["block", "block", "none"]}
                      >
                        {item.source} · {item.date}
                      </Text>
                    </Box>
                  </Flex>
                  <Flex
                    flexShrink={0}
                    alignItems="center"
                    gap={2}
                    alignSelf="stretch"
                  >
                    <Text
                      textStyle="listMeta"
                      display={["none", "none", "block"]}
                      whiteSpace="nowrap"
                    >
                      {item.source} · {item.date}
                    </Text>
                    <Box
                      boxSize={3}
                      flexShrink={0}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      {item.external && (
                        <ExternalLinkIcon boxSize={3} color="brand.textMuted" />
                      )}
                    </Box>
                  </Flex>
                </ChakraLink>
              );
            })}
          </Flex>
        </RetroCard>
      </Flex>
    </PageWrapper>
  );
}
