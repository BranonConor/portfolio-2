"use client";

import { Flex, Text, Box, Link as ChakraLink } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { PageWrapper } from "@/components/PageWrapper";
import { PageHeading } from "@/components/PageHeading";
import { RetroCard } from "@/components/RetroCard";
import { pixelFont } from "@/components/boot-intro/pixelFont";
import Link from "next/link";

export default function Blog() {
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
        <RetroCard>
          <Box p={5} pb={3} borderBottom="2px solid" borderBottomColor="brand.border">
            <PageHeading title="Blog" subtitle="Updates, thoughts, and more." />
          </Box>

          <Flex
            flexDirection="column"
            width="100%"
            gap={0}
            px={5}
            pt={4}
            pb={4}
            sx={{
              "& > *:first-of-type::after": { display: "none" },
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
                  bg: "#61dafb14",
                  borderColor: "#61dafb55",
                  transform: "translateX(3px)",
                  zIndex: 1,
                  _after: { transform: "scaleX(0)" },
                }}
                transition="0.14s ease all"
              >
                <Flex flex={1} minWidth={0} gap={2}>
                  <Text
                    as="span"
                    className={pixelFont.className}
                    fontSize="7px"
                    color="#61dafb"
                    aria-hidden="true"
                    flexShrink={0}
                    mt="3px"
                  >
                    {"\u25B8"}
                  </Text>
                  <Box flex={1} minWidth={0}>
                    <Flex alignItems="center" gap={3}>
                      <Text as="span" textStyle="listTitle">
                        {post.title}
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
                </Flex>
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
        </RetroCard>
      </Flex>
    </PageWrapper>
  );
}
