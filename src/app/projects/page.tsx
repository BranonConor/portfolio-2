"use client";

import { Flex, Text, Heading, Box, Link as ChakraLink } from "@chakra-ui/react";
import { PageWrapper } from "@/components/PageWrapper";
import { PaintStroke } from "@/components/PaintStroke";
import Link from "next/link";
import {
  brandingProjects,
  designSystemsProjects,
  a11yProjects,
  otherProjects,
  productProjects,
} from "./consts";
import { useState } from "react";

const categories = [
  { key: "all", label: "All" },
  { key: "Design Systems", label: "Design Systems" },
  { key: "Product", label: "Product" },
  { key: "A11y", label: "Accessibility" },
  { key: "Brand Design", label: "Brand Design" },
  { key: "Hackweek", label: "Hackweek" },
];

const allProjects = [
  ...designSystemsProjects,
  ...productProjects,
  ...a11yProjects,
  ...otherProjects,
  ...brandingProjects,
];

export default function Projects() {
  const [currentFilter, setCurrentFilter] = useState("all");

  const filteredProjects =
    currentFilter === "all"
      ? allProjects
      : allProjects.filter((p) => p.category === currentFilter);

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
              variant={1}
              top="-40px"
              left="-50px"
              width={["200px", "260px", "320px"]}
              opacity={0.35}
            />
            <PaintStroke
              variant={6}
              top="-20px"
              right="-40px"
              width={["180px", "220px", "280px"]}
              opacity={0.25}
            />
            <PaintStroke
              variant={3}
              bottom="-50px"
              left="35%"
              width={["160px", "200px", "240px"]}
              opacity={0.2}
              rotate={-10}
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
              Projects
            </Heading>
            <Text fontSize="15px" color="brand.textMuted">
              Cool things I&apos;ve worked on.
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
                  currentFilter === cat.key ? "#da70d6" : "brand.textMuted"
                }
                bg={currentFilter === cat.key ? "#da70d615" : "transparent"}
                border="1px solid"
                borderColor={
                  currentFilter === cat.key ? "#da70d640" : "brand.border"
                }
                borderRadius="8px"
                onClick={() => setCurrentFilter(cat.key)}
                transition="0.12s ease all"
                _hover={{
                  borderColor: "#da70d640",
                  color: "#da70d6",
                  bg: "#da70d615",
                }}
                cursor="pointer"
              >
                {cat.label}
              </Text>
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
              "& > *:first-child::after": { display: "none" },
              "& > *:hover + *::after": { transform: "scaleX(0)" },
            }}
          >
            {filteredProjects.map((project) => (
              <ChakraLink
                key={project.title}
                as={Link}
                href={project.link}
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
                <Flex alignItems="center" gap={3}>
                  <Text fontSize="14px" fontWeight="500" color="brand.text">
                    {project.title}
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
                    {project.category}
                  </Text>
                  {(project as any).hasPassword && (
                    <Text fontSize="11px" opacity={0.5}>
                      🔒
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
        </Box>
      </Flex>
    </PageWrapper>
  );
}
