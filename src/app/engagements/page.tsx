"use client";

import { Flex, Text, Heading, Box, Link as ChakraLink } from "@chakra-ui/react";
import { PageWrapper } from "@/components/PageWrapper";
import { PaintStroke } from "@/components/PaintStroke";
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
              variant={5}
              top="-30px"
              left="-50px"
              width={["200px", "260px", "320px"]}
              opacity={0.35}
            />
            <PaintStroke
              variant={2}
              top="-20px"
              right="-40px"
              width={["180px", "220px", "280px"]}
              opacity={0.25}
            />
            <PaintStroke
              variant={4}
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
              Engagements
            </Heading>
            <Text fontSize="15px" color="brand.textMuted">
              Showing up for the community.
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
                color={
                  currentFilter === cat.key ? "brand.text" : "brand.textMuted"
                }
                bg={currentFilter === cat.key ? "brand.surface" : "transparent"}
                border="1px solid"
                borderColor={
                  currentFilter === cat.key
                    ? "brand.borderHover"
                    : "brand.border"
                }
                borderRadius="8px"
                onClick={() => setCurrentFilter(cat.key)}
                transition="0.15s ease all"
                _hover={{
                  borderColor: "brand.borderHover",
                  color: "brand.text",
                }}
                cursor="pointer"
              >
                {cat.label}
              </Text>
            ))}
          </Flex>

          {/* Engagement List */}
          <Flex flexDirection="column" width="100%" gap={0} px={5} pb={5}>
            {filteredEngagements.map((engagement) => (
              <ChakraLink
                key={engagement.title}
                as={Link}
                href={engagement.link}
                display="flex"
                flexDirection={["column", "row"]}
                justifyContent="space-between"
                alignItems={["flex-start", "center"]}
                paddingY={4}
                borderBottom="1px solid"
                borderBottomColor="brand.border"
                _first={{
                  borderTop: "1px solid",
                  borderTopColor: "brand.border",
                }}
                _hover={{
                  textDecoration: "none",
                  bg: "brand.surface",
                  marginX: -4,
                  paddingX: 4,
                  borderRadius: "12px",
                  borderColor: "transparent",
                }}
                transition="0.15s ease all"
              >
                <Flex alignItems="center" gap={3}>
                  <Text fontSize="14px" fontWeight="500" color="brand.text">
                    {engagement.title}
                  </Text>
                  <Text
                    fontSize="11px"
                    color="brand.textMuted"
                    bg="brand.surface"
                    paddingX={2}
                    paddingY={0.5}
                    borderRadius="6px"
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
        </Box>

        {/* ADPList CTA */}
        <ChakraLink
          href="https://adplist.org/mentors/branon-eusebio"
          isExternal
          mt={8}
          display="flex"
          alignItems="center"
          gap={2}
          fontSize="13px"
          color="brand.textMuted"
          border="1px solid"
          borderColor="brand.border"
          bg="rgba(20, 20, 22, 0.6)"
          backdropFilter="blur(16px)"
          borderRadius="10px"
          paddingX={4}
          paddingY={3}
          _hover={{
            textDecoration: "none",
            borderColor: "brand.borderHover",
            color: "brand.text",
          }}
          transition="0.15s ease all"
        >
          Book a mentoring session on ADPList
          <ExternalLinkIcon boxSize={3} />
        </ChakraLink>
      </Flex>
    </PageWrapper>
  );
}
