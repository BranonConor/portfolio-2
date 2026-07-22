"use client";

import { Flex, Heading, Text, Box, Link as ChakraLink } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { PageWrapper } from "@/components/PageWrapper";
import { PaintStroke } from "@/components/PaintStroke";
import { motion, useReducedMotion } from "framer-motion";
import { revealItem, revealItemReduced, inViewOnce } from "@/lib/motion";
import Link from "next/link";

export default function Blog() {
  const reduce = useReducedMotion();
  const posts = [
    {
      title: "The CLI is the New UI",
      category: "AI & DX",
      link: "https://www.thesis.social/article/cmp73stnr000o04l6bxr194c5",
      date: "May 2026",
      external: true,
    },
    {
      title: "The need for INCLUSION.md",
      category: "Accessibility",
      link: "/blog/posts/the-need-for-inclusion-md",
      date: "May 2026",
    },
    {
      title: "Creating an A11y Auditing Kit",
      category: "Accessibility",
      link: "/blog/posts/creating-an-a11y-auditing-kit",
      date: "June 2022",
    },
  ];

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
              variant={5}
              top="-20px"
              right="-40px"
              width={["180px", "220px", "280px"]}
              opacity={0.25}
            />
            <PaintStroke
              variant={2}
              bottom="-50px"
              left="40%"
              width={["160px", "200px", "240px"]}
              opacity={0.2}
              rotate={10}
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
              Blog
            </Heading>
            <Text fontSize="15px" color="brand.textMuted">
              Updates, thoughts, and more.
            </Text>
          </Box>

          <Flex
            as={motion.div}
            initial="hidden"
            whileInView="show"
            viewport={inViewOnce}
            variants={reduce ? revealItemReduced : revealItem}
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
            {posts.map((post) => (
              <ChakraLink
                key={post.title}
                {...(post.external
                  ? { href: post.link, isExternal: true }
                  : { as: Link, href: post.link })}
                display="flex"
                justifyContent="space-between"
                alignItems="flex-start"
                paddingY={2.5}
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
                  "& > span:first-of-type": { color: "brand.text" },
                }}
                transition="0.12s ease all"
              >
                <Box flex={1} minWidth={0}>
                  <Flex alignItems="center" gap={3}>
                    <Text
                      as="span"
                      textStyle="listTitle"
                      transition="0.12s ease all"
                    >
                      {post.title}
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
                      {post.category}
                    </Text>
                  </Flex>
                  <Text
                    textStyle="listMeta"
                    mt={0.5}
                    display={{ base: "block", md: "none" }}
                  >
                    {post.date}
                  </Text>
                </Box>
                <Flex
                  alignItems="center"
                  gap={2}
                  flexShrink={0}
                  ml={3}
                  alignSelf="stretch"
                >
                  <Text
                    textStyle="listMeta"
                    display={{ base: "none", md: "block" }}
                  >
                    {post.date}
                  </Text>
                  <Box
                    boxSize={3}
                    flexShrink={0}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {post.external && (
                      <ExternalLinkIcon boxSize={3} color="brand.textMuted" />
                    )}
                  </Box>
                </Flex>
              </ChakraLink>
            ))}
          </Flex>
        </Box>
      </Flex>
    </PageWrapper>
  );
}
