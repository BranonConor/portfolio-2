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

  // Derive the filter chips from whatever categories actually exist, so
  // empty categories never show up. "All" is always first.
  const categories = useMemo(() => {
    const seen: string[] = [];
    for (const item of inTheWild) {
      if (!seen.includes(item.category)) seen.push(item.category);
    }
    return [{ key: "all", label: "All" }, ...seen.map((c) => ({ key: c, label: c }))];
  }, []);

  const filtered =
    currentFilter === "all"
      ? inTheWild
      : inTheWild.filter((item) => item.category === currentFilter);

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
              Work I&apos;ve had a hand in — shipped, launched, or out in the world.
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
            {filtered.map((item) => {
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
                  flexDirection={["column", "row"]}
                  justifyContent="space-between"
                  alignItems={["flex-start", "center"]}
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
                  <Flex flexDirection="column" gap={1} pr={[0, 4]}>
                    <Flex alignItems="center" gap={2}>
                      <Text
                        fontSize="14px"
                        fontWeight="500"
                        color="brand.text"
                      >
                        {item.title}
                      </Text>
                      {item.external && (
                        <ExternalLinkIcon
                          boxSize="12px"
                          color="brand.textMuted"
                        />
                      )}
                    </Flex>
                    <Flex alignItems="center" gap={2} flexWrap="wrap">
                      <Text
                        fontSize="11px"
                        color={ACCENT}
                        bg={`${ACCENT}15`}
                        paddingX={2}
                        paddingY={0.5}
                        borderRadius="6px"
                      >
                        {item.category}
                      </Text>
                      <Text fontSize="12px" color="brand.textMuted">
                        {item.source}
                      </Text>
                      <Text
                        fontSize="12px"
                        color="brand.textMuted"
                        opacity={0.7}
                      >
                        · {item.role}
                      </Text>
                    </Flex>
                  </Flex>
                  <Text
                    fontSize="12px"
                    color="brand.textMuted"
                    opacity={0.6}
                    flexShrink={0}
                    mt={[2, 0]}
                  >
                    {item.date}
                  </Text>
                </ChakraLink>
              );
            })}
          </Flex>
        </Box>
      </Flex>
    </PageWrapper>
  );
}
