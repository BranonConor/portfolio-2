"use client";

import { Flex, Text, Heading, Box, Link as ChakraLink } from "@chakra-ui/react";
import { PageWrapper } from "@/components/PageWrapper";
import { PaintStroke } from "@/components/PaintStroke";
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
        <Box
          border="1px solid"
          borderColor="brand.border"
          borderRadius="12px"
          bg="rgba(20, 20, 22, 0.6)"
          backdropFilter="blur(16px)"
          overflow="hidden"
          width="100%"
        >
          {/* Paint stroke header area */}
          <Box
            position="relative"
            width="100%"
            height={["80px", "100px", "120px"]}
            overflow="hidden"
            borderBottom="1px solid"
            borderBottomColor="brand.border"
          >
            <PaintStroke
              variant={3}
              top="-30px"
              left="-50px"
              width={["200px", "260px", "320px"]}
              opacity={0.35}
            />
            <PaintStroke
              variant={1}
              top="-20px"
              right="-40px"
              width={["180px", "220px", "280px"]}
              opacity={0.25}
            />
            <PaintStroke
              variant={6}
              bottom="-50px"
              left="30%"
              width={["160px", "200px", "240px"]}
              opacity={0.2}
              rotate={15}
            />
          </Box>

          <Box p={5} pb={3}>
            <Heading
              as="h1"
              fontSize={["28px", "36px"]}
              fontWeight="700"
              letterSpacing="-0.03em"
              mb={2}
            >
              In the Wild
            </Heading>
            <Text fontSize="15px" color="brand.textMuted">
              Things I&apos;ve helped ship, living out in the world ⚡️
            </Text>
          </Box>

          {/* Filters */}
          <Flex flexWrap="wrap" alignItems="center" mb={4} gap={1.5} px={5}>
            {categories.map((cat) => (
              <Text
                key={cat.key}
                as="button"
                fontSize="12px"
                fontWeight={currentFilter === cat.key ? "500" : "400"}
                paddingY={1.5}
                paddingX={3}
                color={currentFilter === cat.key ? ACCENT : "brand.textMuted"}
                bg={currentFilter === cat.key ? `${ACCENT}15` : "transparent"}
                border="1px solid"
                borderColor={
                  currentFilter === cat.key ? `${ACCENT}40` : "brand.border"
                }
                borderRadius="8px"
                onClick={() => setCurrentFilter(cat.key)}
                transition="0.12s ease all"
                _hover={{
                  borderColor: `${ACCENT}40`,
                  color: ACCENT,
                  bg: `${ACCENT}15`,
                }}
                cursor="pointer"
              >
                {cat.label}
              </Text>
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
              "& > *:first-child::after": { display: "none" },
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
                  paddingY={4}
                  position="relative"
                  _after={{
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "1px",
                    bg: "brand.border",
                    transition: "0.18s ease all",
                    transformOrigin: "center",
                  }}
                  _hover={{
                    textDecoration: "none",
                    bg: "brand.surfaceHover",
                    marginX: -3,
                    paddingX: 3,
                    borderRadius: "10px",
                    zIndex: 1,
                    _after: { transform: "scaleX(0)" },
                  }}
                  transition="0.12s ease all"
                >
                  <Box flex={1} minWidth={0} pr={4}>
                    <Text textStyle="listTitle">{item.title}</Text>
                    <Text
                      textStyle="listMeta"
                      mt={0.5}
                      display={["block", "block", "none"]}
                    >
                      {item.source} · {item.date}
                    </Text>
                  </Box>
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
        </Box>
      </Flex>
    </PageWrapper>
  );
}
